import { env } from "cloudflare:workers";

const COOKIE_NAME = "dragon_archive_admin";
const SESSION_SECONDS = 60 * 60 * 4;

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function textToBase64Url(value: string) {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));
}

async function digest(value: string) {
  return bytesToBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))));
}

function cookieHeader(token: string, secure: boolean) {
  return `${COOKIE_NAME}=${token}; Path=/api/archive; Max-Age=${SESSION_SECONDS}; HttpOnly; SameSite=Strict${secure ? "; Secure" : ""}`;
}

export async function POST(request: Request) {
  const configuredPassword = env.ARCHIVE_ADMIN_PASSWORD;
  const sessionSecret = env.ARCHIVE_SESSION_SECRET ?? configuredPassword;
  if (!configuredPassword || !sessionSecret) {
    return Response.json({ error: "管理员密钥尚未配置。" }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await request.json() as { password?: string };
  } catch {
    return Response.json({ error: "请求格式无效。" }, { status: 400 });
  }

  const [expected, actual] = await Promise.all([digest(configuredPassword), digest(body.password ?? "")]);
  if (expected !== actual) {
    return Response.json({ error: "密码不正确，无法进入档案库。" }, { status: 401 });
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  const token = `${textToBase64Url(payload)}.${await sign(payload, sessionSecret)}`;
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookieHeader(token, new URL(request.url).protocol === "https:"), "Cache-Control": "no-store" } });
}
