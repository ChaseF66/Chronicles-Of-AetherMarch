// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Scene04.jsx — The Road East | "The First Breath"
// Drop this file into src/scenes/

import { useState, useEffect, useRef } from "react";
import Background from "../components/Background";
import { CHAR_COLOR } from "../data/characters";
import { useAudio, shiftToEmotional, TRACKS } from "../hooks/useAudio";
import { 
  SCENE_04_PRE,
  SCENE_04_ENCOUNTER_PRE,
  SCENE_04_ENCOUNTER_POST,
  SCENE_04_CAMP,
} from "../data/scenes";

// ── TYPEWRITER HOOK ───────────────────────────────────────────────────────────
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
          : [".", "!", "?"].includes(char) ? speed * 8
          : speed;
        timer.current = setTimeout(tick, delay);
      } else { setDone(true); onDone?.(); }
    }
    timer.current = setTimeout(tick, 80);
    return () => clearTimeout(timer.current);
  }, [text]);

  function skip() {
    clearTimeout(timer.current);
    setDisplayed(text); setDone(true); onDone?.();
  }
  return { displayed, done, skip };
}

// ── GLITCH BEAT ───────────────────────────────────────────────────────────────
function GlitchBeat({ text, onAdvance }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 100);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onAdvance, 400);
    }, 2800);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [text]);

  return (
    <div onClick={onAdvance} style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      padding: "0 0 40px", cursor: "pointer", zIndex: 20,
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#000" }} />
      <div style={{
        margin: "0 40px",
        padding: "10px 18px",
        background: "rgba(0,8,12,0.85)",
        border: "1px solid rgba(74,240,224,0.15)",
        borderBottom: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 10, color: "rgba(74,240,224,0.45)",
          letterSpacing: "2px", marginBottom: 5,
        }}>
          [GLITCH — FILING]
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12, color: "rgba(74,240,224,0.75)",
          letterSpacing: "0.5px", lineHeight: 1.5,
        }}>
          {text}
        </div>
      </div>
    </div>
  );
}

// ── DIALOGUE BOX ─────────────────────────────────────────────────────────────
function DialogueBox({ beat, onAdvance, beatIndex }) {
  const [typeDone, setTypeDone] = useState(false);
  const { displayed, done, skip } = useTypewriter(beat.text, 22, () => setTypeDone(true));
  useEffect(() => { setTypeDone(false); }, [beatIndex]);

  const isDialogue = beat.type === "dialogue";
  const isScene    = beat.type === "scene";
  const speakerColor = isDialogue ? (CHAR_COLOR[beat.speaker] || "#fff") : CHAR_COLOR.NARRATION;

  return (
    <div onClick={() => !done ? skip() : onAdvance()} style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      padding: "0 0 40px", cursor: "pointer",
      animation: "slideUp .35s ease forwards", zIndex: 20,
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "#000" }} />
      <div style={{
        margin: "0 40px",
        background: "linear-gradient(180deg, #05080f 0%, #08101a 100%)",
        border: `1px solid ${isDialogue ? speakerColor + "66" : "#2a3a4a"}`,
        borderBottom: "none",
        boxShadow: `0 -4px 40px #00000099, inset 0 1px 0 ${isDialogue ? speakerColor + "22" : "#ffffff11"}`,
        padding: "14px 20px 10px",
      }}>
        {isDialogue && (
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 11, color: speakerColor,
            letterSpacing: "3px", marginBottom: 8, opacity: 0.9,
          }}>
            {beat.speaker}
          </div>
        )}
        <div style={{
          fontFamily: isScene ? "'IM Fell English', serif" : "'VT323', monospace",
          fontStyle: isScene ? "italic" : "normal",
          fontSize: isScene ? 16 : 20,
          color: beat.whisper ? "rgba(180,200,210,0.7)" : (isScene ? "rgba(160,185,200,0.9)" : "#d8eaf0"),
          lineHeight: 1.55, minHeight: 48,
        }}>
          {displayed}
          {!done && <span style={{ opacity: 0.5 }}>█</span>}
        </div>
        {done && (
          <div style={{
            textAlign: "right",
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9, color: "rgba(74,240,224,0.3)",
            letterSpacing: "2px", marginTop: 8,
          }}>
            SPACE / CLICK ▶
          </div>
        )}
      </div>
    </div>
  );
}

// ── BATTLE PLACEHOLDER ────────────────────────────────────────────────────────
function BattlePlaceholder({ onVictory }) {
  return (
    <div style={{
      width: "100vw", height: "100vh", background: "#000",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "3px", color: "rgba(74,240,224,0.5)" }}>
        [GLITCH — FILING]
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, letterSpacing: "2px", color: "rgba(74,240,224,0.7)" }}>
        AETHER-CORRUPTED UNIT — BATTLE INITIATED
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "1px", color: "rgba(74,240,224,0.3)", marginTop: 8 }}>
        CLASSIFICATION IN PROGRESS...
      </div>
      <button onClick={onVictory} style={{
        marginTop: 32,
        background: "transparent",
        border: "1px solid rgba(74,240,224,0.3)",
        color: "rgba(74,240,224,0.7)",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 11, letterSpacing: "3px",
        padding: "10px 28px", cursor: "pointer",
      }}>
        CLASSIFICATION COMPLETE ▶
      </button>
    </div>
  );
}

// ── MAIN SCENE 04 ─────────────────────────────────────────────────────────────
export default function Scene04({ onComplete }) {
  const PHASES = ["pre", "encounter_pre", "battle", "encounter_post", "camp"];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [beatIndex, setBeatIndex] = useState(0);
  const [bgFade, setBgFade] = useState(false);

  const phase = PHASES[phaseIdx];

  useAudio(TRACKS.SCENE_02); // aether-forge for the road

  useEffect(() => {
    if (phase === "camp") shiftToEmotional();
  }, [phase]);

  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space" && phase !== "battle") advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beatIndex, phase, phaseIdx]);

  const beatsMap = {
    pre:            SCENE_04_PRE,
    encounter_pre:  SCENE_04_ENCOUNTER_PRE,
    encounter_post: SCENE_04_ENCOUNTER_POST,
    camp:           SCENE_04_CAMP,
  };

  const beats = beatsMap[phase] || [];
  const beat  = beats[beatIndex];

  function nextPhase() {
    if (phaseIdx >= PHASES.length - 1) { onComplete(); return; }
    setBgFade(true);
    setTimeout(() => {
      setPhaseIdx(i => i + 1);
      setBeatIndex(0);
      setBgFade(false);
    }, 400);
  }

  function advance() {
    if (beatIndex >= beats.length - 1) { nextPhase(); return; }
    const next = beats[beatIndex + 1];
    if (next?.bg && next.bg !== beat?.bg) {
      setBgFade(true);
      setTimeout(() => { setBeatIndex(i => i + 1); setBgFade(false); }, 400);
    } else {
      setBeatIndex(i => i + 1);
    }
  }

  if (phase === "battle") {
    return <BattlePlaceholder onVictory={nextPhase} />;
  }

  const bgId = beat?.bg || "road-east-day";

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000", position: "relative", overflow: "hidden" }}>
      <div style={{ opacity: bgFade ? 0 : 1, transition: "opacity 0.4s ease" }}>
        <Background id={bgId} />
      </div>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
      }} />
      {beat?.type === "glitch" ? (
        <GlitchBeat key={`${phaseIdx}-${beatIndex}`} text={beat.text} onAdvance={advance} />
      ) : (
        <DialogueBox key={`${phaseIdx}-${beatIndex}`} beat={beat} onAdvance={advance} beatIndex={beatIndex} />
      )}
    </div>
  );
}