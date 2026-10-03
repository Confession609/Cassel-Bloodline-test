import blackSwanPortExtension from "../言灵库_黑天鹅港动画扩展.json";

export type SpellRecord = {
  name: string;
  serial: string;
  family: string;
  category: string;
  danger: "低危" | "中危" | "高危" | "绝密" | "未详";
  holder: string;
  summary: string;
  confidence: "已知序列" | "公开整理" | "未定序列" | "动画官方" | "动画推定";
  source?: string;
};

// 仅收录五部正传及其公开设定中明确出现/被提及的名称。
// 序列号存在版本差异时，保留为“部分整理记为……”而不是强行取单一值。
const BASE_SPELLS: SpellRecord[] = [
  { name: "皇帝", serial: "01", family: "黑王系", category: "威压 / 血统", danger: "低危", holder: "黑王·尼德霍格", summary: "以龙威压制龙族与混血种，并引发血统共鸣。", confidence: "已知序列" },
  { name: "血系结罗", serial: "02", family: "黑王系", category: "探测 / 感知", danger: "低危", holder: "万博倩", summary: "感知周围龙族血脉，寻找隐藏的血统回响。", confidence: "已知序列" },
  { name: "鬼胜", serial: "09", family: "白王系", category: "强化 / 肉身", danger: "中危", holder: "落叶", summary: "屏蔽痛觉并短时间释放身体极限。", confidence: "已知序列" },
  { name: "冬", serial: "01 系列", family: "未详", category: "未详", danger: "未详", holder: "未详", summary: "周期表早期名称，具体能力与归属待考。", confidence: "公开整理" },
  { name: "催眠", serial: "14", family: "精神系", category: "精神 / 控制", danger: "低危", holder: "未详", summary: "以精神干涉影响目标状态。", confidence: "公开整理" },
  { name: "阴雷", serial: "17", family: "天空与风系", category: "空气 / 爆破", danger: "低危", holder: "未详", summary: "压缩空气并释放无闪光的爆破冲击。", confidence: "已知序列" },
  { name: "蛇", serial: "19", family: "未详", category: "探测 / 感知", danger: "未详", holder: "未详", summary: "周期表中的早期名称，效果公开信息有限。", confidence: "公开整理" },
  { name: "钥匙", serial: "23", family: "精神系", category: "权限 / 开启", danger: "未详", holder: "未详", summary: "被公开周期表列出，具体机制尚缺完整说明。", confidence: "公开整理" },
  { name: "王选之侍", serial: "29", family: "黑王系", category: "强化 / 领域", danger: "中危", holder: "未详", summary: "选择并强化领域中的同伴，使其短时接近人体极限。", confidence: "已知序列" },
  { name: "王之侍", serial: "29 别名", family: "黑王系", category: "强化 / 领域", danger: "中危", holder: "未详", summary: "部分公开表格使用的异名，统一归入王选之侍档案。", confidence: "公开整理" },
  { name: "鬼魂", serial: "37", family: "未详", category: "精神 / 隐匿", danger: "未详", holder: "未详", summary: "周期表中的名称，具体效果与持有者资料有限。", confidence: "公开整理" },
  { name: "真空之蛇", serial: "37", family: "未详", category: "电场 / 探测", danger: "中危", holder: "曼施坦因、叶胜", summary: "通过感知电信号变化探查周围环境。", confidence: "已知序列" },
  { name: "阴流", serial: "41", family: "天空与风系", category: "风 / 操控", danger: "中危", holder: "矢吹樱", summary: "精密控制大范围气流，也可加速轻薄刃具。", confidence: "已知序列" },
  { name: "深血", serial: "47", family: "未详", category: "毒性 / 强化", danger: "未详", holder: "某死侍", summary: "使释放者自身带有毒性。", confidence: "已知序列" },
  { name: "皇帝（周期表旧表记载）", serial: "51", family: "黑王系", category: "威压 / 血统", danger: "低危", holder: "黑王", summary: "部分修订前表格中的序列记载，与序列 01 的皇帝存在版本差异。", confidence: "公开整理" },
  { name: "镰鼬", serial: "59", family: "天空与风系", category: "风 / 感知", danger: "中危", holder: "凯撒、路山彦", summary: "建立声音通道，捕捉领域内的细微声响。", confidence: "已知序列" },
  { name: "饮血真镰", serial: "59+", family: "天空与风系", category: "风 / 攻击", danger: "中危", holder: "凯撒、路山彦", summary: "镰鼬的进阶形态，将空气化为高速旋转的无形刃片。", confidence: "公开整理" },
  { name: "吸血镰", serial: "71", family: "天空与风系", category: "风 / 攻击", danger: "中危", holder: "凯撒、路山彦", summary: "部分周期表整理使用的进阶异名，保留为可检索别名。", confidence: "公开整理" },
  { name: "冥照", serial: "69", family: "天空与风系", category: "光学 / 隐匿", danger: "中危", holder: "酒德麻衣", summary: "扭曲领域内光线，形成近似隐身的效果。", confidence: "已知序列" },
  { name: "刹那", serial: "72", family: "天空与风系", category: "速度 / 强化", danger: "中危", holder: "犬山贺", summary: "成倍提升自身行动速度，但对身体负荷极大。", confidence: "已知序列" },
  { name: "风王之瞳", serial: "74", family: "天空与风系", category: "风 / 领域", danger: "高危", holder: "夏弥", summary: "制造强力空气涡流，形成强风并辅助飞行。", confidence: "已知序列" },
  { name: "风暴角", serial: "74", family: "天空与风系", category: "风暴 / 攻击", danger: "高危", holder: "耶梦加得（模仿）", summary: "激发可控龙卷风，释放环境会显著影响威力。", confidence: "公开整理" },
  { name: "炽", serial: "77", family: "青铜与火系", category: "火 / 攻击", danger: "未详", holder: "未详", summary: "产生大量烈焰，直接灼烧目标。", confidence: "已知序列" },
  { name: "铁流", serial: "80", family: "青铜与火系", category: "金属 / 操控", danger: "中危", holder: "路鸣泽", summary: "控制金属元素，用于攻击、制造或提炼。", confidence: "已知序列" },
  { name: "无尘之地", serial: "81", family: "天空与风系", category: "气流 / 防御", danger: "高危", holder: "龙德施泰特、帕西", summary: "释放强大气流，排斥并阻挡周围物质。", confidence: "已知序列" },
  { name: "金刚界", serial: "81", family: "天空与风系", category: "结界 / 防御", danger: "高危", holder: "酒德麻衣", summary: "冥照的升阶形态，施加可保护目标的结界。", confidence: "公开整理" },
  { name: "剑御", serial: "82", family: "青铜与火系", category: "磁场 / 操控", danger: "中危", holder: "苏茜", summary: "磁化并遥控领域内的金属物体。", confidence: "已知序列" },
  { name: "时间零", serial: "84", family: "黑王系", category: "时间感知 / 速度", danger: "高危", holder: "昂热、楚天骄", summary: "改变领域内的时间感受，使释放者获得极高行动速度。", confidence: "已知序列" },
  { name: "永恒", serial: "84 别名", family: "黑王系", category: "时间感知 / 速度", danger: "高危", holder: "昂热、楚天骄", summary: "部分公开整理使用的时间零异名。", confidence: "公开整理" },
  { name: "青铜御座", serial: "87", family: "青铜与火系", category: "肉身 / 强化", danger: "中危", holder: "芬格尔", summary: "强化肌肉与骨骼，使身体获得青铜般的强度。", confidence: "已知序列" },
  { name: "君焰", serial: "89", family: "青铜与火系", category: "火 / 爆破", danger: "高危", holder: "楚子航", summary: "召集并压缩火元素，在近距离领域内形成高温与爆炸。", confidence: "已知序列" },
  { name: "王权", serial: "91（部分整理记为 92）", family: "白王系", category: "重力 / 控制", danger: "高危", holder: "源稚生", summary: "强化领域重力，使目标承受数倍甚至数十倍体重。", confidence: "已知序列" },
  { name: "天地为炉", serial: "96", family: "青铜与火系", category: "金属 / 冶炼", danger: "高危", holder: "耶梦加得", summary: "在领域中冶制金属并重新组织形态。", confidence: "已知序列" },
  { name: "黑炎牢狱", serial: "110", family: "白王系", category: "火 / 领域", danger: "绝密", holder: "赫尔佐格", summary: "形成高温领域，焚毁范围内的物质。", confidence: "公开整理" },
  { name: "黑日", serial: "110（部分整理未定序）", family: "白王系", category: "引力 / 吞噬", danger: "绝密", holder: "上杉越", summary: "形成近似黑日的吞噬领域，牵引并摧毁目标。", confidence: "公开整理" },
  { name: "审判", serial: "111", family: "白王系", category: "雷电 / 终结", danger: "绝密", holder: "上杉绘梨衣", summary: "对领域内目标施加不可逆的死亡与切割效果。", confidence: "已知序列" },
  { name: "莱茵", serial: "113", family: "未详", category: "元素 / 灾变", danger: "绝密", holder: "未知", summary: "已知与通古斯大爆炸相关的灭世级言灵。", confidence: "已知序列" },
  { name: "烛龙", serial: "114", family: "青铜与火系", category: "火 / 灾变", danger: "绝密", holder: "青铜与火之王", summary: "青铜与火之王一脉的灭世级火焰权能。", confidence: "已知序列" },
  { name: "归墟", serial: "115", family: "海洋与水系", category: "水 / 灾变", danger: "绝密", holder: "海洋与水之王", summary: "引动巨量海水，形成足以吞没城市的海啸。", confidence: "已知序列" },
  { name: "因陀罗之怒", serial: "116", family: "天空与风系", category: "雷电 / 灾变", danger: "绝密", holder: "天空与风之王", summary: "以密集电弧与球状闪电形成大范围毁灭领域。", confidence: "已知序列" },
  { name: "湿婆业舞", serial: "117", family: "大地与山系", category: "大地 / 灾变", danger: "绝密", holder: "芬里厄、夏弥", summary: "以无法轻易中止的舞蹈启动大范围毁灭权能。", confidence: "已知序列" },
  { name: "涅槃", serial: "118", family: "未详", category: "灾变 / 未详", danger: "绝密", holder: "未详", summary: "公开周期表修订中出现的高阶名称，能力资料有限。", confidence: "公开整理" },
  { name: "神谕", serial: "121", family: "白王系", category: "权限 / 免疫", danger: "绝密", holder: "白王", summary: "使白王血脉对皇帝的效果获得免疫。", confidence: "已知序列" },
  { name: "先知", serial: "未详", family: "精神系", category: "预知 / 感知", danger: "未详", holder: "奇兰", summary: "以有限程度预测未来。", confidence: "未定序列" },
  { name: "天演", serial: "未详", family: "精神系", category: "运算 / 强化", danger: "未详", holder: "古德里安、苏恩曦", summary: "强化大脑运算能力，接近高性能计算机。", confidence: "未定序列" },
  { name: "圣裁", serial: "未详", family: "精神系", category: "裁决 / 未详", danger: "未详", holder: "汉高", summary: "已在正传相关资料中出现，具体效果仍待整理。", confidence: "未定序列" },
  { name: "镜瞳", serial: "未详", family: "精神系", category: "解析 / 复制", danger: "未详", holder: "零", summary: "快速解析并掌握事物的使用方法。", confidence: "未定序列" },
  { name: "梦貘", serial: "未详", family: "精神系", category: "梦境 / 控制", danger: "未详", holder: "源稚女", summary: "制造并引导目标进入梦境。", confidence: "未定序列" },
  { name: "雷池", serial: "未详", family: "天空与风系", category: "雷电 / 领域", danger: "未详", holder: "龙马弦一郎", summary: "控制领域内电荷，制造电弧或静电屏障。", confidence: "未定序列" },
  { name: "涡", serial: "未详", family: "海洋与水系", category: "水 / 攻击", danger: "未详", holder: "宫本志雄", summary: "从周围空间汲取水形成高速漩涡。", confidence: "未定序列" },
  { name: "不朽", serial: "未详", family: "大地与山系", category: "肉身 / 强化", danger: "未详", holder: "樱井七海", summary: "强化肉身，使身体达到极高强度。", confidence: "未定序列" },
  { name: "苍雷支配", serial: "未详", family: "白王系", category: "雷电 / 支配", danger: "未详", holder: "赫尔佐格", summary: "已知名称，具体能力资料不完整。", confidence: "未定序列" },
  { name: "血脉牵引", serial: "未详", family: "白王系", category: "血统 / 控制", danger: "未详", holder: "赫尔佐格", summary: "已知名称，具体能力资料不完整。", confidence: "未定序列" },
  { name: "八歧", serial: "未详", family: "海洋与水系", category: "血统 / 再生", danger: "未详", holder: "源稚女", summary: "借由血统强化获得近似八岐大蛇的肉身与再生力。", confidence: "未定序列" },
  { name: "君王", serial: "未详", family: "未详", category: "威压 / 控制", danger: "未详", holder: "楚子航、李雾月", summary: "令目标短时臣服于释放者的威权。", confidence: "未定序列" },
  { name: "因陀罗", serial: "未详", family: "天空与风系", category: "雷电 / 领域", danger: "未详", holder: "阿卜杜拉·阿巴斯", summary: "在领域中操控电场并制造雷击。", confidence: "未定序列" },
  { name: "森罗", serial: "未详", family: "精神系", category: "精神 / 幻象", danger: "未详", holder: "某蛙人", summary: "将自身意象写入目标精神，诱导其看到特定景象。", confidence: "未定序列" },
  { name: "凝胶", serial: "未详", family: "未详", category: "物质 / 控制", danger: "未详", holder: "未详", summary: "公开整理中出现的名称，能力资料有限。", confidence: "未定序列" },
  { name: "死神之镰", serial: "未详", family: "未详", category: "攻击 / 未详", danger: "未详", holder: "未详", summary: "公开整理中出现的名称，能力资料有限。", confidence: "未定序列" },
  { name: "血的恩赐", serial: "未详", family: "血统 / 强化", category: "血统 / 未详", danger: "未详", holder: "未详", summary: "公开整理中出现的名称，能力资料有限。", confidence: "未定序列" },
  { name: "九婴", serial: "未详", family: "未详", category: "血统 / 未详", danger: "未详", holder: "未详", summary: "公开整理中出现的名称，能力资料有限。", confidence: "未定序列" },
];

const BLACK_SWAN_PORT_SOURCE = "黑天鹅港动画 · 第二季第 1 集《零号》";
const animationSpellByName = new Map(blackSwanPortExtension.entries.map((entry) => [entry.name, entry]));
const animationSupplementalSpells: SpellRecord[] = blackSwanPortExtension.entries
  .filter((entry) => !BASE_SPELLS.some((spell) => spell.name === entry.name))
  .map((entry) => ({
    name: entry.name,
    serial: entry.number ? String(entry.number) : "动画未定序",
    family: "未详",
    category: entry.classification,
    danger: "未详",
    holder: entry.sceneRole,
    summary: entry.effect,
    confidence: entry.sourceType === "animationOfficial" ? "动画官方" : "动画推定",
    source: `${BLACK_SWAN_PORT_SOURCE} · ${entry.sourceType === "animationOfficial" ? "官方动画收录" : "动画镜头推定"}`,
  }));

export const SPELLS: SpellRecord[] = [
  ...BASE_SPELLS.map((spell) => {
    const animationEntry = animationSpellByName.get(spell.name);
    return animationEntry ? { ...spell, source: `${BLACK_SWAN_PORT_SOURCE} · ${animationEntry.sourceType === "animationOfficial" ? "官方动画收录" : "动画镜头推定"}` } : spell;
  }),
  ...animationSupplementalSpells,
];

export const SPELL_FAMILIES = ["全部", "黑王系", "白王系", "青铜与火系", "天空与风系", "海洋与水系", "大地与山系", "精神系", "未详"] as const;
