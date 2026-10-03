import { desc, eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "../../../db";
import { archiveRecords } from "../../../db/schema";

const COOKIE_NAME = "dragon_archive_admin";

function readCookie(request: Request, name: string) {
  const header = request.headers.get("Cookie") ?? "";
  return header.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`))?.slice(name.length + 1) ?? "";
}

function base64UrlToText(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(normalized), (character) => character.charCodeAt(0)));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function isAdmin(request: Request) {
  const secret = env.ARCHIVE_SESSION_SECRET ?? env.ARCHIVE_ADMIN_PASSWORD;
  const token = readCookie(request, COOKIE_NAME);
  if (!secret || !token) return false;
  const [payloadPart, signature] = token.split(".");
  if (!payloadPart || !signature) return false;
  try {
    const payload = base64UrlToText(payloadPart);
    const [expiresAt] = payload.split(".");
    if (!expiresAt || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;
    return (await sign(payload, secret)) === signature;
  } catch {
    return false;
  }
}

function normalizeName(value: string) {
  return value.trim().toLocaleLowerCase();
}

async function makeArchiveKey(name: string, birthDate: string) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${normalizeName(name)}::${birthDate}`)));
  let hex = "";
  bytes.forEach((byte) => { hex += byte.toString(16).padStart(2, "0"); });
  return hex;
}

function validText(value: unknown, max = 300): value is string {
  return typeof value === "string" && value.trim().length <= max;
}

async function readPayload(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const birthDate = typeof body.birthDate === "string" ? body.birthDate : "";
  if (!name || name.length > 80 || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error("档案称呼或出生日期无效。");
  if (!["grade", "gradeLabel", "dominant", "spell", "character"].every((key) => validText(body[key], 120))) throw new Error("档案结果字段无效。");
  const numberFields = ["score", "compositeScore"];
  if (!numberFields.every((key) => typeof body[key] === "number" && Number.isFinite(body[key]))) throw new Error("档案分数字段无效。");
  const performancePercent = body.performancePercent === null ? null : typeof body.performancePercent === "number" && Number.isFinite(body.performancePercent) ? body.performancePercent : null;
  return {
    name, birthDate, location: typeof body.location === "string" ? body.location.trim().slice(0, 120) : "",
    grade: body.grade as string, gradeLabel: body.gradeLabel as string, score: Math.round(body.score as number), compositeScore: Math.round(body.compositeScore as number), performancePercent,
    dominant: body.dominant as string, spell: body.spell as string, character: body.character as string,
    hiddenTriggered: body.hiddenTriggered === true, specialName: typeof body.specialName === "string" ? body.specialName.slice(0, 120) : null, specialQuote: typeof body.specialQuote === "string" ? body.specialQuote.slice(0, 300) : null,
  };
}

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request);
    const db = getDb();
    const archiveKey = await makeArchiveKey(payload.name, payload.birthDate);
    const now = new Date().toISOString();
    const id = `DRG-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await db.insert(archiveRecords).values({ id, archiveKey, ...payload, createdAt: now, updatedAt: now }).onConflictDoUpdate({
      target: archiveRecords.archiveKey,
      set: { ...payload, updatedAt: now },
    });
    return Response.json({ ok: true }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "档案保存失败。" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "需要管理员权限。" }, { status: 401 });
  try {
    const records = await getDb().select().from(archiveRecords).orderBy(desc(archiveRecords.updatedAt));
    return Response.json({ records }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "档案读取失败。" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) return Response.json({ error: "需要管理员权限。" }, { status: 401 });
  try {
    const body = await request.json() as { id?: string };
    if (!body.id || body.id.length > 80) return Response.json({ error: "档案编号无效。" }, { status: 400 });
    await getDb().delete(archiveRecords).where(eq(archiveRecords.id, body.id));
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "档案删除失败。" }, { status: 500 });
  }
}
