// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Scene02.jsx — District 7, tutorial battle, Pip's entrance

import { useState, useEffect, useRef } from "react";
import Background from "../components/Background";
import { SCENE_02_PRE, SCENE_02_TUTORIAL, SCENE_02_POST } from "../data/scenes";
import { CHAR_COLOR, JOBS, SKILLS, ENEMY_TEMPLATES, calcDmg, calcHeal, makeChar, makeEnemy, roll } from "../data/characters";
import { useAudio, TRACKS } from "../hooks/useAudio";

// ── FONTS (inherited from App.jsx) ────────────────────────────────────────────
const WRAITH_ENEMY = {
  name: "Hex Wraith", emoji: "👻", hp: 55, atk: 8, def: 4, mag: 16, spd: 9,
  reward: { xp: 25, gold: 15 }, color: "#a070e0",
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

// ── DIALOGUE BOX ──────────────────────────────────────────────────────────────
function DialogueBox({ beat, onAdvance, beatIndex }) {
  const { displayed, done, skip } = useTypewriter(beat.text, 22);
  const isDialogue = beat.type === "dialogue";
  const isNarration = beat.type === "narration";
  const isScene = beat.type === "scene";
  const speakerColor = isDialogue ? (CHAR_COLOR[beat.speaker] || "#fff") : CHAR_COLOR.NARRATION;

  return (
    <div onClick={() => !done ? skip() : onAdvance()}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 40px", cursor: "pointer", zIndex: 20 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#000" }} />
      <div style={{
        margin: "0 40px",
        background: "linear-gradient(180deg, #05080f 0%, #08101a 100%)",
        border: `1px solid ${isDialogue ? speakerColor + "66" : "#2a3a4a"}`,
        borderBottom: "none",
        boxShadow: `0 -4px 40px #00000099`,
        minHeight: 110,
      }}>
        {isDialogue && (
          <div style={{ display: "inline-block", background: `linear-gradient(90deg, ${speakerColor}33, transparent)`, borderRight: `2px solid ${speakerColor}`, padding: "6px 20px 6px 16px", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: speakerColor, textShadow: `0 0 10px ${speakerColor}` }}>{beat.speaker}</span>
          </div>
        )}
        {isScene && (
          <div style={{ display: "inline-block", padding: "6px 20px 6px 16px", borderRight: "1px solid #2a3a4a", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#4a6a5a", textTransform: "uppercase" }}>[ SCENE ]</span>
          </div>
        )}
        <div style={{ padding: "10px 20px 16px" }}>
          <span style={{
            fontFamily: isScene ? "'Share Tech Mono', monospace" : "'IM Fell English', serif",
            fontSize: isDialogue ? 17 : isNarration ? 16 : 13,
            fontStyle: isNarration ? "italic" : "normal",
            color: isDialogue ? "#f0ead8" : isNarration ? (beat.emphasis ? "#e8d8a0" : "#c8bca0") : "#7a9a8a",
            lineHeight: 1.7,
            fontWeight: beat.emphasis ? 600 : 400,
          }}>
            {displayed}
            {!done && <span style={{ animation: "cursor .8s step-end infinite", color: "#e8b84b" }}>▋</span>}
          </span>
        </div>
        {done && (
          <div style={{ textAlign: "right", padding: "0 20px 12px", animation: "pulse 1.2s ease-in-out infinite" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#e8b84b66", letterSpacing: 2 }}>▶ CONTINUE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TUTORIAL BOX ──────────────────────────────────────────────────────────────
function TutorialBox({ beat, onAdvance }) {
  const { displayed, done, skip } = useTypewriter(beat.text, 18);
  return (
    <div onClick={() => !done ? skip() : onAdvance()}
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 40px", cursor: "pointer", zIndex: 20 }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#000" }} />
      <div style={{
        margin: "0 40px",
        background: "linear-gradient(180deg, #0a1a0a 0%, #0d1f0d 100%)",
        border: "1px solid #2a5a2a",
        borderBottom: "none",
        boxShadow: "0 -4px 40px #00000099, inset 0 1px 0 #4ec97a22",
        minHeight: 120,
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 8px", borderBottom: "1px solid #1a3a1a" }}>
          <span style={{ fontSize: 18 }}>{beat.icon}</span>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#4ec97a", textTransform: "uppercase" }}>
            ⚙ {beat.title}
          </span>
        </div>
        {/* Text */}
        <div style={{ padding: "12px 20px 16px" }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: "#a8d8a8", lineHeight: 1.8, letterSpacing: 0.3 }}>
            {displayed}
            {!done && <span style={{ animation: "cursor .8s step-end infinite", color: "#4ec97a" }}>▋</span>}
          </span>
        </div>
        {done && (
          <div style={{ textAlign: "right", padding: "0 20px 12px", animation: "pulse 1.2s ease-in-out infinite" }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#4ec97a66", letterSpacing: 2 }}>
              {beat.last ? "▶ BEGIN BATTLE" : "▶ CONTINUE"}
            </span>
          </div>
        )}
      </div>
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

// ── TRANSITION CARD ───────────────────────────────────────────────────────────
function TransitionCard({ beat, onDone }) {
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 50, background: "#000",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === "hold" ? 1 : 0, transition: "opacity .5s ease", pointerEvents: "none",
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 6, color: "#4a6a5a", marginBottom: 10 }}>{beat.text}</div>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: 18, letterSpacing: 4, color: "#e8b84b", textShadow: "0 0 20px #e8b84b66", textAlign: "center", maxWidth: 400 }}>{beat.sub}</div>
      <div style={{ marginTop: 16, width: 80, height: 1, background: "linear-gradient(90deg, transparent, #e8b84b, transparent)" }} />
    </div>
  );
}

// ── TUTORIAL BATTLE ───────────────────────────────────────────────────────────
function TutorialBattle({ onVictory, onDefeat }) {
  const [vyx] = useState(() => makeChar("Vyx", "Machinist", 0));
  const [vHP, setVHP] = useState(vyx.maxHp);
  const [vMP, setVMP] = useState(vyx.maxMp);
  const [enemy] = useState(() => makeEnemy(WRAITH_ENEMY));
  const [eHP, setEHP] = useState(enemy.maxHp);
  const [phase, setPhase] = useState("player"); // player | enemy | win | lose
  const [log, setLog] = useState(["⚙ A Hex Wraith lunges at you!", "⚔ Your turn — choose an action."]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [shakeEnemy, setShakeEnemy] = useState(false);
  const [shakeVyx, setShakeVyx] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const logRef = useRef();

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const skills = JOBS["Machinist"].skills;

  function addLog(msg) { setLog(l => [...l, msg]); }

  async function getAIFlavor(action) {
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 60,
          messages: [{ role: "user", content: `JRPG battle narrator, steampunk setting. One punchy line (max 10 words): Vyx uses ${action} on a Hex Wraith.` }]
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
    if (skill.mpCost > vMP) { addLog("❌ Not enough MP!"); return; }

    setVMP(mp => mp - skill.mpCost);
    setSelectedSkill(null);

    let dmg = 0;
    if (skill.type === "dmg") {
      dmg = calcDmg(vyx.atk + vyx.mag * 0.2, enemy.def, skill.power);
      const newEHP = Math.max(0, eHP - dmg);
      setEHP(newEHP);
      addLog(`⚔ Vyx uses ${skillName} — ${enemy.name} takes ${dmg} damage!`);
      setShakeEnemy(true);
      setTimeout(() => setShakeEnemy(false), 400);
      getAIFlavor(skillName);

      if (newEHP <= 0) { setPhase("win"); return; }
    }

    // Enemy turn
    setPhase("enemy");
    setTimeout(() => {
      const eDmg = calcDmg(enemy.atk, vyx.def);
      const newVHP = Math.max(0, vHP - eDmg);
      setVHP(newVHP);
      addLog(`🤖 ${enemy.name} strikes back — Vyx takes ${eDmg} damage!`);
      setShakeVyx(true);
      setTimeout(() => setShakeVyx(false), 400);

      if (newVHP <= 0) { setPhase("lose"); return; }
      setTimeout(() => { setPhase("player"); addLog("⚔ Your turn."); }, 600);
    }, 900);
  }

  // HP colors
  const vPct = vHP / vyx.maxHp;
  const ePct = eHP / enemy.maxHp;
  const vHPColor = vPct > 0.5 ? "#4ec97a" : vPct > 0.25 ? "#e8b84b" : "#e05555";
  const eHPColor = ePct > 0.5 ? "#4ec97a" : ePct > 0.25 ? "#e8b84b" : "#e05555";

  if (phase === "win") {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚔️</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#e8b84b", textShadow: "0 0 20px #e8b84b", marginBottom: 16 }}>VICTORY</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#4ec97a", marginBottom: 8 }}>+ 25 XP</div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#e8b84b", marginBottom: 32 }}>+ 15 GOLD</div>
        <button onClick={onVictory} style={{ background: "transparent", border: "2px solid #e8b84b", color: "#e8b84b", fontFamily: "'Press Start 2P', monospace", fontSize: 9, padding: "10px 20px", cursor: "pointer" }}>
          CONTINUE ▶
        </button>
      </div>
    );
  }

  if (phase === "lose") {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💀</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, color: "#e05555", marginBottom: 16 }}>DEFEATED</div>
        <div style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 14, color: "#5a6a5a", marginBottom: 32 }}>The district claims another soul...</div>
        <button onClick={onDefeat} style={{ background: "transparent", border: "2px solid #e05555", color: "#e05555", fontFamily: "'Press Start 2P', monospace", fontSize: 9, padding: "10px 20px", cursor: "pointer" }}>
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "50px 20px 20px", gap: 12, zIndex: 20 }}>
      {/* Enemy */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div className={shakeEnemy ? "shake" : ""} style={{ fontSize: 64, filter: `drop-shadow(0 0 12px #a070e0)`, animation: "wraith 2s ease-in-out infinite" }}>
          {enemy.emoji}
        </div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: 3, color: "#a070e0" }}>{enemy.name}</div>
        <div style={{ width: 160, height: 10, background: "#1a2030", border: "1px solid #2a3a5a" }}>
          <div style={{ width: `${ePct * 100}%`, height: "100%", background: eHPColor, transition: "width 0.3s ease", boxShadow: `0 0 4px ${eHPColor}` }} />
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "#8899aa" }}>{eHP} / {enemy.maxHp}</div>
      </div>

      {/* Battle log */}
      <div ref={logRef} style={{ flex: 1, background: "#05080f", border: "1px solid #1a2a3a", padding: "8px 12px", overflowY: "auto", maxHeight: 120 }}>
        {log.map((l, i) => (
          <div key={i} style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: i === log.length - 1 ? "#e8edf5" : "#5a6a7a", marginBottom: 2 }}>{l}</div>
        ))}
        {aiLoading && <div style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: "#7dd3c8" }}>✨ ...</div>}
      </div>

      {/* Vyx status */}
      <div style={{ background: "#05080f", border: "1px solid #2a3a5a", padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div className={shakeVyx ? "shake" : ""} style={{ fontSize: 36 }}>🔧</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: 2, color: "#e8b84b", marginBottom: 4 }}>VYX</div>
          <div style={{ width: "100%", height: 8, background: "#1a2030", border: "1px solid #2a3a5a", marginBottom: 3 }}>
            <div style={{ width: `${vPct * 100}%`, height: "100%", background: vHPColor, transition: "width 0.3s ease" }} />
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#8899aa" }}>HP {vHP}/{vyx.maxHp}</div>
          <div style={{ width: "100%", height: 6, background: "#1a2030", border: "1px solid #2a3a5a", marginTop: 3 }}>
            <div style={{ width: `${(vMP / vyx.maxMp) * 100}%`, height: "100%", background: "#5b8dee" }} />
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#5b8dee" }}>MP {vMP}/{vyx.maxMp}</div>
        </div>
      </div>

      {/* Skills */}
      {phase === "player" && (
        <div style={{ background: "#05080f", border: "1px solid #2a5a2a", padding: "10px 14px" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "#4ec97a", letterSpacing: 2, marginBottom: 8 }}>⚙ CHOOSE ACTION</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {skills.map(s => {
              const sk = SKILLS[s];
              const canAfford = sk && vMP >= sk.mpCost;
              return (
                <button key={s} onClick={() => canAfford && doAction(s)} disabled={!canAfford} style={{
                  background: "transparent",
                  border: `2px solid ${canAfford ? "#4ec97a" : "#2a3a2a"}`,
                  color: canAfford ? "#4ec97a" : "#2a4a2a",
                  fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                  padding: "6px 10px", cursor: canAfford ? "pointer" : "not-allowed",
                }}>
                  {s}{sk.mpCost > 0 && <span style={{ color: "#5b8dee" }}> {sk.mpCost}MP</span>}
                </button>
              );
            })}
          </div>
          {selectedSkill && <div style={{ marginTop: 6, fontFamily: "'VT323', monospace", fontSize: 14, color: "#8899aa" }}>{SKILLS[selectedSkill]?.desc}</div>}
        </div>
      )}
      {phase === "enemy" && (
        <div style={{ background: "#05080f", border: "1px solid #5a2a2a", padding: "10px 14px" }}>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: "#e05555" }}>Enemy turn...</div>
        </div>
      )}
    </div>
  );
}

// ── MAIN SCENE 02 ─────────────────────────────────────────────────────────────
export default function Scene02({ onComplete }) {
  useAudio(TRACKS.SCENE_02);

  
  // phase: "pre" | "tutorial" | "battle" | "post"
  const [phase, setPhase] = useState("pre");
  const [beatIndex, setBeatIndex] = useState(0);
  const [bgFade, setBgFade] = useState(false);
  const [showHardCut, setShowHardCut] = useState(false);

  const beats = phase === "pre" ? SCENE_02_PRE
    : phase === "tutorial" ? SCENE_02_TUTORIAL
    : SCENE_02_POST;

  const beat = beats[beatIndex];

  useEffect(() => {
    function onKey(e) { if (e.code === "Space" && phase !== "battle") advance(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beatIndex, phase]);

  function advance() {
    if (beat?.type === "hardcut") {
      setShowHardCut(true);
      return;
    }
    if (beatIndex >= beats.length - 1) {
      if (phase === "pre") { setPhase("tutorial"); setBeatIndex(0); }
      else if (phase === "tutorial") { setPhase("battle"); }
      else if (phase === "post") { onComplete(); }
      return;
    }
    const next = beats[beatIndex + 1];
    if (next?.bg && next.bg !== beat?.bg) {
      setBgFade(true);
      setTimeout(() => { setBeatIndex(i => i + 1); setBgFade(false); }, 400);
    } else {
      setBeatIndex(i => i + 1);
    }
  }

  function handleHardCutDone() {
    setShowHardCut(false);
    setBeatIndex(i => i + 1);
  }

  function handleBattleVictory() {
    setPhase("post");
    setBeatIndex(0);
  }

  function handleBattleDefeat() {
    setPhase("battle");
  }

  const bgId = beat?.bg || "district-7";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      {/* Background */}
      <div style={{ opacity: bgFade ? 0 : 1, transition: "opacity .4s ease" }}>
        <Background id={bgId} />
      </div>

      {/* Top letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 40, background: "#000", zIndex: 10 }} />

      {/* Hard cut flash */}
      {showHardCut && <HardCut onDone={handleHardCutDone} />}

      {/* Battle phase */}
      {phase === "battle" ? (
        <TutorialBattle onVictory={handleBattleVictory} onDefeat={handleBattleDefeat} />
      ) : beat?.type === "transition" ? (
        <TransitionCard key={beatIndex} beat={beat} onDone={advance} />
      ) : beat?.type === "tutorial" ? (
        <TutorialBox key={beatIndex} beat={beat} onAdvance={advance} />
      ) : beat?.type === "hardcut" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }} />
      ) : (
        <DialogueBox key={beatIndex} beat={beat} beatIndex={beatIndex} onAdvance={advance} />
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
