// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// characters.js — Party members, jobs, skills, enemies

export const CHAR_COLOR = {
  VYX:       "#e8b84b",
  KAEL:      "#7dd3c8",
  PIP:       "#c97c2a",
  RYKER:     "#8899aa",
  NARRATION: "#d4c9a8",
};

export const JOBS = {
  Knight:    { emoji:"⚔️",  color:"#e8b84b", hp:120, mp:20,  atk:18, def:14, mag:4,  spd:6,  skills:["Attack","Guard","Provoke"],         desc:"Iron-clad vanguard. High DEF, protects allies." },
  Machinist: { emoji:"🔧",  color:"#7dd3c8", hp:85,  mp:30,  atk:12, def:8,  mag:10, spd:10, skills:["Attack","Drill Shot","Grenade"],     desc:"Tinkers with gadgets. Balanced damage dealer." },
  Arcanist:  { emoji:"📡",  color:"#a070e0", hp:65,  mp:90,  atk:6,  def:5,  mag:20, spd:7,  skills:["Attack","Voltaic Bolt","Hex Field"],  desc:"Channels magitek energy. Glass cannon mage." },
  Medic:     { emoji:"💉",  color:"#4ec97a", hp:80,  mp:70,  atk:8,  def:9,  mag:12, spd:8,  skills:["Attack","Aethersalve","Revive"],      desc:"Battlefield surgeon. Heals and supports party." },
  Rogue:     { emoji:"🗡️",  color:"#c97c2a", hp:75,  mp:40,  atk:16, def:7,  mag:8,  spd:14, skills:["Attack","Back Stab","Smoke Bomb"],   desc:"Swift and cunning. High speed & burst damage." },
  Gunner:    { emoji:"🔫",  color:"#5b8dee", hp:90,  mp:35,  atk:14, def:8,  mag:9,  spd:11, skills:["Attack","Burst Fire","Aimed Shot"],  desc:"Ranged specialist. Consistent physical damage." },
  Hexblade:  { emoji:"⚡",  color:"#4466ff", hp:95,  mp:60,  atk:15, def:9,  mag:15, spd:9,  skills:["Attack","Hex Strike","Signal Drain"], desc:"Part machine, part human. Unique to Kael." },
};

export const SKILLS = {
  "Attack":       { type:"dmg",    power:1.0, mpCost:0,  target:"enemy", desc:"Basic attack" },
  "Guard":        { type:"buff",   power:0,   mpCost:6,  target:"self",  desc:"Raise DEF this turn", effect:"def_up" },
  "Provoke":      { type:"taunt",  power:0,   mpCost:8,  target:"self",  desc:"Draw enemy attacks to self", effect:"taunt" },
  "Drill Shot":   { type:"dmg",    power:1.3, mpCost:10, target:"enemy", desc:"Armor-piercing shot" },
  "Grenade":      { type:"dmg",    power:0.9, mpCost:14, target:"all",   desc:"Hits all enemies" },
  "Voltaic Bolt": { type:"dmg",    power:1.8, mpCost:18, target:"enemy", desc:"Lightning magitek burst" },
  "Hex Field":    { type:"debuff", power:0,   mpCost:22, target:"enemy", desc:"Reduce enemy ATK", effect:"atk_down" },
  "Aethersalve":  { type:"heal",   power:1.4, mpCost:16, target:"ally",  desc:"Restore HP to one ally" },
  "Revive":       { type:"revive", power:0,   mpCost:30, target:"ally",  desc:"Revive a fallen ally with 30% HP" },
  "Back Stab":    { type:"dmg",    power:1.6, mpCost:12, target:"enemy", desc:"Crit-weighted strike" },
  "Smoke Bomb":   { type:"debuff", power:0,   mpCost:10, target:"all",   desc:"Reduce all enemy SPD", effect:"spd_down" },
  "Burst Fire":   { type:"dmg",    power:1.1, mpCost:12, target:"enemy", desc:"Multi-hit ranged attack" },
  "Aimed Shot":   { type:"dmg",    power:1.5, mpCost:16, target:"enemy", desc:"High accuracy single hit" },
  "Hex Strike":   { type:"dmg",    power:1.5, mpCost:14, target:"enemy", desc:"Magitek-infused melee strike" },
  "Signal Drain": { type:"heal",   power:1.0, mpCost:18, target:"self",  desc:"Drain Hextech energy to restore HP" },
};

export const ENEMY_TEMPLATES = [
  { name:"Steam Golem",   emoji:"🤖", hp:80,  atk:12, def:8,  mag:4,  spd:4,  reward:{xp:30,gold:20}, color:"#7dd3c8" },
  { name:"Aether Wraith", emoji:"👻", hp:55,  atk:8,  def:4,  mag:16, spd:9,  reward:{xp:25,gold:15}, color:"#a070e0" },
  { name:"Iron Drone",    emoji:"⚙️", hp:70,  atk:14, def:10, mag:2,  spd:6,  reward:{xp:28,gold:18}, color:"#4a5568" },
  { name:"Magitek Hound", emoji:"🐺", hp:65,  atk:16, def:6,  mag:5,  spd:12, reward:{xp:32,gold:22}, color:"#c97c2a" },
  { name:"Hex Turret",    emoji:"🗼", hp:90,  atk:10, def:14, mag:12, spd:3,  reward:{xp:35,gold:25}, color:"#5b8dee" },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function calcDmg(atk, def, power = 1.0) {
  const base = Math.max(1, atk - Math.floor(def * 0.4));
  return Math.floor(base * power * (0.9 + Math.random() * 0.2));
}

export function calcHeal(mag, power = 1.0) {
  return Math.floor(mag * 2.5 * power * (0.9 + Math.random() * 0.2));
}

export function makeChar(name, jobKey, idx) {
  const job = JOBS[jobKey];
  return {
    id: idx, name, job: jobKey,
    maxHp: job.hp, hp: job.hp,
    maxMp: job.mp, mp: job.mp,
    atk: job.atk, def: job.def, mag: job.mag, spd: job.spd,
    xp: 0, level: 1,
    status: null,
    alive: true,
  };
}

export function makeEnemy(template) {
  return { ...template, maxHp: template.hp, alive: true, id: Math.random(), status: null };
}
