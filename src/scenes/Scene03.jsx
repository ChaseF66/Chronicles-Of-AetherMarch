// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Scene03.jsx — The Reveal, The Flashback, Ryker's Interlude, Slater Boss, Escape

import { useState, useEffect, useRef } from "react";
import Background from "../components/Background";
import {
  SCENE_03_PRE,
  SCENE_03_FLASHBACK,
  SCENE_03_POST_FLASHBACK,
  SCENE_03_RYKER,
  SCENE_03_CHASE,
  SCENE_03_ESCAPE,
} from "../data/scenes";
import { CHAR_COLOR, JOBS, SKILLS, calcDmg, makeChar, makeEnemy, roll } from "../data/characters";

// ── SLATER ENEMY ─────────────────────────────────────────────────────────────
const SLATER_ENEMY = {
  name: "Commander Slater", emoji: "🎖️", hp: 120, atk: 16, def: 12, mag: 8, spd: 8,
  reward: { xp: 80, gold: 50 }, color: "#e05555",
};

// ── TYPEWRITER ────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 22, onDone) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    setDisplayed(""); setDone(false); idx.current = 0;
    function tick() {
      if (idx.current < text.length) {
        idx.current++;
        setDisplayed(text.slice(0, idx.current));
        const char = text[idx.current - 1];
        const delay = [",", "—", ";"].includes(char) ? speed * 5
          : [".", "!", "?"].includes(char) ? speed * 8 : speed;
        timer.current = setTimeout(tick, delay);
      } else { setDone(true); onDone?.(); }
    }
    timer.current = setTimeout(tick, 80);
    return () => clearTimeout(timer.current);
  }, [text]);

  function skip() { clearTimeout(timer.current); setDisplayed(text); setDone(true); onDone?.(); }
  return { displayed, done, skip };
}

// ── CHAR COLORS ───────────────────────────────────────────────────────────────
const CHAR_COLORS = {
  VYX: "#e8b84b", PIP: "#c97c2a", KAEL: "#7dd3c8",
  RYKER: "#8899aa", SLATER: "#e05555", NARRATION: "#d4c9a8",
};

// ── DIALOGUE BOX ──────────────────────────────────────────────────────────────
function DialogueBox({ beat, onAdvance, beatIndex, flashback = false }) {
  const { displayed, done, skip } = useTypewriter(beat.text, flashback ? 26 : 22);
  const isDialogue = beat.type === "dialogue";
  const isNarration = beat.type === "narration";
  const isScene = beat.type === "scene";
  const speakerColor = isDialogue ? (CHAR_COLORS[beat.speaker] || "#fff") : CHAR_COLORS.NARRATION;

  const boxBg = flashback
    ? "linear-gradient(180deg, #1a1208 0%, #1f160a 100%)"
    : "linear-gradient(180deg, #05080f 0%, #08101a 100%)";

  const boxBorder = flashback
    ? `1px solid ${isDialogue ? speakerColor + "66" : "#5a4a2a"}`
    : `1px solid ${isDialogue ? speakerColor + "66" : "#2a3a4a"}`;

  return (
    <div onClick={() => !done ? skip() : onAdvance()}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 40px", cursor: "pointer", zIndex: 20 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#000" }} />
      <div style={{ margin: "0 40px", background: boxBg, border: boxBorder, borderBottom: "none", boxShadow: "0 -4px 40px #00000099", minHeight: 110 }}>
        {isDialogue && (
          <div style={{ display: "inline-block", background: `linear-gradient(90deg, ${speakerColor}33, transparent)`, borderRight: `2px solid ${speakerColor}`, padding: "6px 20px 6px 16px", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: speakerColor, textShadow: `0 0 10px ${speakerColor}` }}>{beat.speaker}</span>
          </div>
        )}
        {isScene && (
          <div style={{ display: "inline-block", padding: "6px 20px 6px 16px", borderRight: `1px solid ${flashback ? "#5a4a2a" : "#2a3a4a"}`, marginBottom: 2 }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: 3, color: flashback ? "#6a5a3a" : "#4a6a5a", textTransform: "uppercase" }}>[ SCENE ]</span>
          </div>
        )}
        <div style={{ padding: "10px 20px 16px" }}>
          <span style={{
            fontFamily: isScene ? "'Share Tech Mono', monospace" : "'IM Fell English', serif",
            fontSize: isDialogue ? 17 : isNarration ? 16 : 13,
            fontStyle: isNarration ? "italic" : "normal",
            color: flashback
              ? (isDialogue ? "#f5ead0" : isNarration ? "#e8d4a0" : "#9a8a6a")
              : (isDialogue ? "#f0ead8" : isNarration ? (beat.emphasis ? "#e8d8a0" : "#c8bca0") : "#7a9a8a"),
            lineHeight: 1.7,
            fontWeight: beat.emphasis ? 600 : 400,
          }}>
            {displayed}
            {!done && <span style={{ animation: "cursor .8s step-end infinite", color: flashback ? "#c8a84b" : "#e8b84b" }}>▋</span>}
          </span>
        </div>
        {done && (
          <div style={{ textAlign: "right", padding: "0 20px 12px", animation: "pulse 1.2s ease-in-out infinite" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: flashback ? "#c8a84b66" : "#e8b84b66", letterSpacing: 2 }}>▶ CONTINUE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TRANSITION CARD ───────────────────────────────────────────────────────────
function TransitionCard({ beat, onDone, warm = false }) {
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50,
      background: warm ? "#0a0800" : "#000",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === "hold" ? 1 : 0, transition: "opacity .5s ease", pointerEvents: "none",
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 6, color: warm ? "#6a5a3a" : "#4a6a5a", marginBottom: 10 }}>{beat.text}</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: 4, color: warm ? "#c8a84b" : "#e8b84b", textShadow: warm ? "0 0 20px #c8a84b66" : "0 0 20px #e8b84b66", textAlign: "center", maxWidth: 400 }}>{beat.sub}</div>
      <div style={{ marginTop: 16, width: 80, height: 1, background: `linear-gradient(90deg, transparent, ${warm ? "#c8a84b" : "#e8b84b"}, transparent)` }} />
    </div>
  );
}

// ── HARD CUT ──────────────────────────────────────────────────────────────────
function HardCut({ onDone }) {
  const [phase, setPhase] = useState("white");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 80);
    const t2 = setTimeout(() => onDone(), 500);
    return () => [t1, t2].forEach(clearTimeout);
  }, []);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 100,
      background: phase === "white" ? "#fff" : "#000",
      transition: phase === "fade" ? "background 0.4s ease" : "none",
      pointerEvents: "none",
    }} />
  );
}

// ── SLATER BOSS BATTLE ────────────────────────────────────────────────────────
function SlaterBoss({ onVictory, onDefeat }) {
  const [vyx] = useState(() => makeChar("Vyx", "Machinist", 0));
  const [pip] = useState(() => makeChar("Pip", "Rogue", 1));
  const [vHP, setVHP] = useState(vyx.maxHp);
  const [vMP, setVMP] = useState(vyx.maxMp);
  const [pHP, setPHP] = useState(pip.maxHp);
  const [slater] = useState(() => makeEnemy(SLATER_ENEMY));
  const [sHP, setSHP] = useState(slater.maxHp);
  const [phase, setPhase] = useState("player");
  const [activeChar, setActiveChar] = useState("vyx");
  const [log, setLog] = useState([
    "🎖️ Commander Slater steps forward.",
    "⚔ Vyx and Pip — your move."
  ]);
  const [shakeSlater, setShakeSlater] = useState(false);
  const [shakeVyx, setShakeVyx] = useState(false);
  const [shakePip, setShakePip] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const logRef = useRef();

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const vyxSkills = JOBS["Machinist"].skills;
  const pipSkills = JOBS["Rogue"].skills;
  const currentSkills = activeChar === "vyx" ? vyxSkills : pipSkills;
  const currentMP = activeChar === "vyx" ? vMP : pip.mp;

  function addLog(msg) { setLog(l => [...l, msg]); }

  async function getAIFlavor(action, actor) {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 60,
          messages: [{ role: "user", content: `JRPG boss battle, steampunk setting. One punchy line (max 10 words): ${actor} uses ${action} on Commander Slater — corporate Aethon enforcer.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text ?? "";
      if (text) addLog(`✨ ${text.trim()}`);
    } catch (e) { }
    setAiLoading(false);
  }

  function doAction(skillName) {
    const skill = SKILLS[skillName];
    const isVyx = activeChar === "vyx";
    const actorMP = isVyx ? vMP : pip.mp;
    const actorATK = isVyx ? vyx.atk : pip.atk;
    const actorMAG = isVyx ? vyx.mag : pip.mag;
    const actorName = isVyx ? "Vyx" : "Pip";

    if (skill.mpCost > actorMP) { addLog("❌ Not enough MP!"); return; }

    if (isVyx) setVMP(mp => mp - skill.mpCost);

    let dmg = 0;
    if (skill.type === "dmg") {
      dmg = calcDmg(actorATK + actorMAG * 0.2, slater.def, skill.power);
      const newSHP = Math.max(0, sHP - dmg);
      setSHP(newSHP);
      addLog(`⚔ ${actorName} uses ${skillName} — Slater takes ${dmg} damage!`);
      setShakeSlater(true);
      setTimeout(() => setShakeSlater(false), 400);
      getAIFlavor(skillName, actorName);
      if (newSHP <= 0) { setPhase("win"); return; }
    } else {
      addLog(`🔧 ${actorName} uses ${skillName}!`);
    }

    // Switch to other character or enemy turn
    if (isVyx) {
      setActiveChar("pip");
      addLog("⚔ Pip's turn.");
    } else {
      setActiveChar("vyx");
      setPhase("enemy");
      setTimeout(() => {
        const eDmg = calcDmg(slater.atk, vyx.def);
        const target = Math.random() > 0.5 ? "vyx" : "pip";
        if (target === "vyx") {
          const newVHP = Math.max(0, vHP - eDmg);
          setVHP(newVHP);
          addLog(`🎖️ Slater strikes Vyx — ${eDmg} damage!`);
          setShakeVyx(true);
          setTimeout(() => setShakeVyx(false), 400);
          if (newVHP <= 0) { setPhase("lose"); return; }
        } else {
          const newPHP = Math.max(0, pHP - eDmg);
          setPHP(newPHP);
          addLog(`🎖️ Slater strikes Pip — ${eDmg} damage!`);
          setShakePip(true);
          setTimeout(() => setShakePip(false), 400);
          if (newPHP <= 0) { setPhase("lose"); return; }
        }
        setTimeout(() => { setPhase("player"); addLog("⚔ Your turn."); }, 600);
      }, 900);
    }
  }

  const sPct = sHP / slater.maxHp;
  const vPct = vHP / vyx.maxHp;
  const pPct = pHP / pip.maxHp;
  const sColor = sPct > 0.5 ? "#4ec97a" : sPct > 0.25 ? "#e8b84b" : "#e05555";
  const vColor = vPct > 0.5 ? "#4ec97a" : vPct > 0.25 ? "#e8b84b" : "#e05555";
  const pColor = pPct > 0.5 ? "#4ec97a" : pPct > 0.25 ? "#e8b84b" : "#e05555";

  if (phase === "win") return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#e8b84b", textShadow: "0 0 20px #e8b84b", marginBottom: 8 }}>VICTORY</div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#4ec97a", marginBottom: 4 }}>+ 80 XP</div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#e8b84b", marginBottom: 32 }}>+ 50 GOLD</div>
      <button onClick={onVictory} style={{ background: "transparent", border: "2px solid #e8b84b", color: "#e8b84b", fontFamily: "'Press Start 2P', monospace", fontSize: 9, padding: "10px 20px", cursor: "pointer" }}>CONTINUE ▶</button>
    </div>
  );

  if (phase === "lose") return (
    <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>💀</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#e05555", marginBottom: 16 }}>DEFEATED</div>
      <button onClick={onDefeat} style={{ background: "transparent", border: "2px solid #e05555", color: "#e05555", fontFamily: "'Press Start 2P', monospace", fontSize: 9, padding: "10px 20px", cursor: "pointer" }}>TRY AGAIN</button>
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "50px 20px 20px", gap: 10, zIndex: 20 }}>
      {/* Slater */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div className={shakeSlater ? "shake" : ""} style={{ fontSize: 56, filter: "drop-shadow(0 0 12px #e05555)" }}>{slater.emoji}</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: "#e05555" }}>{slater.name}</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: "#8899aa", marginBottom: 2 }}>AETHON RESPONSE DIVISION</div>
        <div style={{ width: 180, height: 10, background: "#1a2030", border: "1px solid #2a3a5a" }}>
          <div style={{ width: `${sPct * 100}%`, height: "100%", background: sColor, transition: "width 0.3s ease" }} />
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#8899aa" }}>{sHP} / {slater.maxHp}</div>
      </div>

      {/* Log */}
      <div ref={logRef} style={{ flex: 1, background: "#05080f", border: "1px solid #1a2a3a", padding: "8px 12px", overflowY: "auto", maxHeight: 100 }}>
        {log.map((l, i) => (
          <div key={i} style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: i === log.length - 1 ? "#e8edf5" : "#5a6a7a", marginBottom: 2 }}>{l}</div>
        ))}
        {aiLoading && <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#7dd3c8" }}>✨ ...</div>}
      </div>

      {/* Party */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { name: "VYX", emoji: "🔧", hp: vHP, maxHp: vyx.maxHp, mp: vMP, maxMp: vyx.maxMp, color: "#e8b84b", pct: vPct, barColor: vColor, shake: shakeVyx, active: activeChar === "vyx" },
          { name: "PIP", emoji: "🗡️", hp: pHP, maxHp: pip.maxHp, mp: pip.mp, maxMp: pip.maxMp, color: "#c97c2a", pct: pPct, barColor: pColor, shake: shakePip, active: activeChar === "pip" },
        ].map(c => (
          <div key={c.name} style={{ background: "#05080f", border: `1px solid ${c.active && phase === "player" ? c.color : "#2a3a5a"}`, padding: "8px 10px", boxShadow: c.active && phase === "player" ? `0 0 8px ${c.color}44` : "none" }}>
            <div className={c.shake ? "shake" : ""} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 24 }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9, color: c.color, marginBottom: 3 }}>{c.name}</div>
                <div style={{ width: "100%", height: 7, background: "#1a2030", border: "1px solid #2a3a5a", marginBottom: 2 }}>
                  <div style={{ width: `${c.pct * 100}%`, height: "100%", background: c.barColor }} />
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: "#8899aa" }}>HP {c.hp}/{c.maxHp}</div>
                <div style={{ width: "100%", height: 5, background: "#1a2030", border: "1px solid #2a3a5a", marginTop: 2 }}>
                  <div style={{ width: `${(c.mp / c.maxMp) * 100}%`, height: "100%", background: "#5b8dee" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      {phase === "player" && (
        <div style={{ background: "#05080f", border: "1px solid #2a5a2a", padding: "10px 14px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#4ec97a", letterSpacing: 2, marginBottom: 8 }}>
            ⚙ {activeChar === "vyx" ? "VYX" : "PIP"}'S TURN
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {currentSkills.map(s => {
              const sk = SKILLS[s];
              const canAfford = sk && (activeChar === "vyx" ? vMP : pip.mp) >= sk.mpCost;
              return (
                <button key={s} onClick={() => canAfford && doAction(s)} disabled={!canAfford} style={{
                  background: "transparent", border: `2px solid ${canAfford ? "#4ec97a" : "#2a3a2a"}`,
                  color: canAfford ? "#4ec97a" : "#2a4a2a",
                  fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                  padding: "6px 10px", cursor: canAfford ? "pointer" : "not-allowed",
                }}>
                  {s}{sk.mpCost > 0 && <span style={{ color: "#5b8dee" }}> {sk.mpCost}MP</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {phase === "enemy" && (
        <div style={{ background: "#05080f", border: "1px solid #5a2a2a", padding: "10px 14px" }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#e05555" }}>Slater attacks...</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN SCENE 03 ─────────────────────────────────────────────────────────────
export default function Scene03({ onComplete }) {
  const PHASES = ["pre", "flashback", "post_flashback", "ryker", "chase", "battle", "escape"];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [bgFade, setBgFade] = useState(false);
  const [showHardCut, setShowHardCut] = useState(false);

  const phase = PHASES[phaseIdx];
  const beatsMap = {
    pre: SCENE_03_PRE,
    flashback: SCENE_03_FLASHBACK,
    post_flashback: SCENE_03_POST_FLASHBACK,
    ryker: SCENE_03_RYKER,
    chase: SCENE_03_CHASE,
    escape: SCENE_03_ESCAPE,
  };

  const beats = beatsMap[phase] || [];
  const beat = beats[beatIndex];
  const isFlashback = phase === "flashback";

  useEffect(() => {
    function onKey(e) { if (e.code === "Space" && phase !== "battle") advance(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beatIndex, phase, phaseIdx]);

  function nextPhase() {
    if (phaseIdx >= PHASES.length - 1) { onComplete(); return; }
    setBgFade(true);
    setTimeout(() => { setPhaseIdx(i => i + 1); setBeatIndex(0); setBgFade(false); }, 400);
  }

  function advance() {
    if (beat?.type === "hardcut") { setShowHardCut(true); return; }
    if (beatIndex >= beats.length - 1) { nextPhase(); return; }
    const next = beats[beatIndex + 1];
    if (next?.bg && next.bg !== beat?.bg) {
      setBgFade(true);
      setTimeout(() => { setBeatIndex(i => i + 1); setBgFade(false); }, 400);
    } else {
      setBeatIndex(i => i + 1);
    }
  }

  function handleHardCutDone() { setShowHardCut(false); setBeatIndex(i => i + 1); }

  const bgId = beat?.bg || "workshop";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ opacity: bgFade ? 0 : 1, transition: "opacity .4s ease" }}>
        <Background id={bgId} />
      </div>

      {/* Flashback warm overlay */}
      {isFlashback && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(40, 20, 0, 0.3)", pointerEvents: "none", zIndex: 3 }} />
      )}

      {/* Top letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "#000", zIndex: 10 }} />

      {/* Flashback label */}
      {isFlashback && (
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 30 }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: 4, color: "#c8a84b", textTransform: "uppercase" }}>◈ MEMORY ◈</span>
        </div>
      )}

      {/* Hard cut */}
      {showHardCut && <HardCut onDone={handleHardCutDone} />}

      {/* Battle phase */}
      {phase === "battle" ? (
        <SlaterBoss
          onVictory={() => { setPhaseIdx(PHASES.indexOf("escape")); setBeatIndex(0); }}
          onDefeat={() => { setBeatIndex(0); }}
        />
      ) : beat?.type === "transition" ? (
        <TransitionCard key={`${phaseIdx}-${beatIndex}`} beat={beat} onDone={advance} warm={isFlashback} />
      ) : beat?.type === "hardcut" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }} />
      ) : (
        <DialogueBox key={`${phaseIdx}-${beatIndex}`} beat={beat} beatIndex={beatIndex} onAdvance={advance} flashback={isFlashback} />
      )}

      {/* Hint */}
      {phase !== "battle" && (
        <div style={{ position: "absolute", top: 14, right: 20, zIndex: 30, fontFamily: "'Share Tech Mono', monospace", fontSize: 8, letterSpacing: 2, color: "#2a3a4a" }}>
          CLICK OR SPACE TO ADVANCE
        </div>
      )}
    </div>
  );
}
