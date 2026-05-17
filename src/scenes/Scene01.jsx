// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Scene01.jsx — Opening cutscene engine

import { useState, useEffect, useRef } from "react";
import Background from "../components/Background";
import { SCENE_01 } from "../data/scenes";
import { CHAR_COLOR } from "../data/characters";
import { useAudio, TRACKS } from "../hooks/useAudio";



// ── TYPEWRITER HOOK ───────────────────────────────────────────────────────────
function useTypewriter(text, speed=22, onDone) {
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
        const char = text[idx.current-1];
        const delay = [",","—",";"].includes(char) ? speed*5 : [".","!","?"].includes(char) ? speed*8 : speed;
        timer.current = setTimeout(tick, delay);
      } else { setDone(true); onDone?.(); }
    }
    timer.current = setTimeout(tick, 80);
    return () => clearTimeout(timer.current);
  }, [text]);

  function skip() { clearTimeout(timer.current); setDisplayed(text); setDone(true); onDone?.(); }
  return { displayed, done, skip };
}

// ── DIALOGUE BOX ─────────────────────────────────────────────────────────────
function DialogueBox({ beat, onAdvance, beatIndex }) {
  const [typeDone, setTypeDone] = useState(false);
  const { displayed, done, skip } = useTypewriter(beat.text, 22, () => setTypeDone(true));
  useEffect(() => { setTypeDone(false); }, [beatIndex]);

  const isDialogue  = beat.type === "dialogue";
  const isNarration = beat.type === "narration";
  const isScene     = beat.type === "scene";
  const speakerColor = isDialogue ? (CHAR_COLOR[beat.speaker] || "#fff") : CHAR_COLOR.NARRATION;

  return (
    <div onClick={() => !done ? skip() : onAdvance()}
      style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 0 40px", cursor:"pointer", animation:"slideUp .35s ease forwards", zIndex:20 }}>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:40, background:"#000" }}/>
      <div style={{
        margin:"0 40px",
        background:"linear-gradient(180deg, #05080f 0%, #08101a 100%)",
        border:`1px solid ${isDialogue ? speakerColor+"66" : "#2a3a4a"}`,
        borderBottom:"none",
        boxShadow:`0 -4px 40px #00000099, inset 0 1px 0 ${isDialogue ? speakerColor+"22" : "#ffffff08"}`,
        minHeight:110,
      }}>
        {isDialogue && (
          <div style={{ display:"inline-block", background:`linear-gradient(90deg, ${speakerColor}33, transparent)`, borderRight:`2px solid ${speakerColor}`, padding:"6px 20px 6px 16px", marginBottom:2 }}>
            <span style={{ fontFamily:"'Cinzel', serif", fontSize:11, letterSpacing:3, color:speakerColor, textShadow:`0 0 10px ${speakerColor}` }}>{beat.speaker}</span>
          </div>
        )}
        {isScene && (
          <div style={{ display:"inline-block", padding:"6px 20px 6px 16px", borderRight:"1px solid #2a3a4a", marginBottom:2 }}>
            <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:9, letterSpacing:3, color:"#4a6a5a", textTransform:"uppercase" }}>[ SCENE ]</span>
          </div>
        )}
        <div style={{ padding:"10px 20px 16px" }}>
          <span style={{
            fontFamily: isScene ? "'Share Tech Mono', monospace" : "'IM Fell English', serif",
            fontSize: isDialogue ? 17 : isNarration ? 16 : 13,
            fontStyle: isNarration ? "italic" : "normal",
            color: isDialogue ? "#f0ead8" : isNarration ? (beat.emphasis ? "#e8d8a0" : "#c8bca0") : "#7a9a8a",
            lineHeight:1.7, letterSpacing: isScene ? 0.5 : 0,
            fontWeight: beat.emphasis ? 600 : 400,
          }}>
            {displayed}
            {!done && <span style={{ animation:"cursor .8s step-end infinite", color:"#e8b84b" }}>▋</span>}
          </span>
        </div>
        {done && (
          <div style={{ textAlign:"right", padding:"0 20px 12px", animation:"pulse 1.2s ease-in-out infinite" }}>
            <span style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, color:"#e8b84b66", letterSpacing:2 }}>▶ CONTINUE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TRANSITION CARD ───────────────────────────────────────────────────────────
function TransitionCard({ beat, onDone }) {
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"),  1800);
    const t3 = setTimeout(() => onDone(),          2600);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div style={{
      position:"absolute", inset:0, zIndex:50, background:"#000",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase==="hold" ? 1 : 0, transition:"opacity .5s ease", pointerEvents:"none",
    }}>
      <div style={{ fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:6, color:"#4a6a5a", marginBottom:10, textTransform:"uppercase" }}>{beat.text}</div>
      <div style={{ fontFamily:"'Cinzel', serif", fontSize:18, letterSpacing:4, color:"#e8b84b", textShadow:"0 0 20px #e8b84b66", textTransform:"uppercase", textAlign:"center", maxWidth:400 }}>{beat.sub}</div>
      <div style={{ marginTop:16, width:80, height:1, background:"linear-gradient(90deg, transparent, #e8b84b, transparent)" }}/>
    </div>
  );
}

// ── TITLE CARD ────────────────────────────────────────────────────────────────
function TitleCard({ onDone }) {
  const [phase, setPhase] = useState(0);
  const lines = ["CHRONICLES","OF","AETHERMARCH"];
  useEffect(() => {
    const ts = [600,1400,2200,3400].map((t,i) => setTimeout(() => setPhase(i+1), t));
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ position:"absolute", inset:0, zIndex:50, background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
      {lines.map((line,i) => (
        <div key={i} style={{
          fontFamily:"'Cinzel', serif",
          fontSize: i===2 ? 36 : i===1 ? 14 : 13,
          letterSpacing: i===2 ? 8 : 12,
          color: i===2 ? "#e8b84b" : "#7a8a9a",
          textShadow: i===2 ? "0 0 30px #e8b84b88, 0 0 60px #e8b84b44" : "none",
          opacity: phase>i ? 1 : 0, transform: phase>i ? "translateY(0)" : "translateY(10px)",
          transition:"opacity .8s ease, transform .8s ease",
          animation: i===2 && phase>2 ? "flicker 4s ease-in-out infinite" : "none",
        }}>{line}</div>
      ))}
      <div style={{ marginTop:24, fontFamily:"'IM Fell English', serif", fontStyle:"italic", fontSize:13, color:"#5a6a5a", letterSpacing:1, opacity:phase>3?1:0, transition:"opacity 1.2s ease", textAlign:"center" }}>
        "A city runs on power. Power runs on something else."
      </div>
      {phase>3 && (
        <div onClick={onDone} style={{ marginTop:32, fontFamily:"'Share Tech Mono', monospace", fontSize:10, letterSpacing:4, color:"#e8b84b", cursor:"pointer", animation:"pulse 1.5s ease-in-out infinite" }}>
          ▶ PRESS TO CONTINUE
        </div>
      )}
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)", display:"flex", gap:3, zIndex:30 }}>
      {Array.from({length:total},(_,i) => (
        <div key={i} style={{ width:i<current?12:6, height:2, background:i<current?"#e8b84b":"#2a3a4a", transition:"all .3s ease" }}/>
      ))}
    </div>
  );
}

// ── MAIN SCENE 01 COMPONENT ───────────────────────────────────────────────────
export default function Scene01({ onComplete }) {
  useAudio(TRACKS.SCENE_01);
  const [beatIndex, setBeatIndex] = useState(0);
  const [bgFade, setBgFade] = useState(false);
  const beat = SCENE_01[beatIndex];

  useEffect(() => {
    function onKey(e) { if (e.code==="Space") advance(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beatIndex]);

  function advance() {
    if (beatIndex >= SCENE_01.length-1) { onComplete(); return; }
    const next = SCENE_01[beatIndex+1];
    if (next?.bg !== beat?.bg) {
      setBgFade(true);
      setTimeout(() => { setBeatIndex(i => i+1); setBgFade(false); }, 400);
    } else {
      setBeatIndex(i => i+1);
    }
  }

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#000", position:"relative", overflow:"hidden" }}>
      <div style={{ opacity:bgFade?0:1, transition:"opacity .4s ease" }}>
        <Background id={beat.bg}/>
      </div>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:40, background:"#000", zIndex:10 }}/>
      <ProgressBar
        current={SCENE_01.filter((b,i) => i<beatIndex && b.type!=="transition").length}
        total={SCENE_01.filter(b => b.type!=="transition").length}
      />
      <div style={{ position:"absolute", top:14, right:20, zIndex:30, fontFamily:"'Share Tech Mono', monospace", fontSize:8, letterSpacing:2, color:"#2a3a4a" }}>
        CLICK OR SPACE TO ADVANCE
      </div>
      {beat.type==="transition" ? <TransitionCard key={beatIndex} beat={beat} onDone={advance}/>
      : beat.type==="title"     ? <TitleCard onDone={onComplete}/>
      : <DialogueBox key={beatIndex} beat={beat} beatIndex={beatIndex} onAdvance={advance}/>}
    </div>
  );
}
