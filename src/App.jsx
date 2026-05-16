// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// App.jsx — Master controller. Routes between all screens.

import { useState } from "react";
import Scene01 from "./scenes/Scene01";
import Scene02 from "./scenes/Scene02";
import Scene03 from "./scenes/Scene03";
import TitleScreen from "./scenes/TitleScreen";

// ── GLOBAL STYLES & FONTS ─────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&family=Share+Tech+Mono&display=swap";
document.head.appendChild(fontLink);

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; overflow: hidden; }

  @keyframes fadeIn        { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp       { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes flicker       { 0%,100%{opacity:1} 45%{opacity:.85} 50%{opacity:.7} 55%{opacity:.9} }
  @keyframes float         { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes shake         { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  @keyframes pulse         { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes steamDrift    { 0%{transform:translateY(0) scale(1);opacity:0} 15%{opacity:.35} 85%{opacity:.15} 100%{transform:translateY(-80px) scale(1.6);opacity:0} }
  @keyframes conduitPulse  { 0%,100%{opacity:.15;box-shadow:0 0 4px #4af0e0} 50%{opacity:.45;box-shadow:0 0 14px #4af0e0,0 0 28px #4af0e044} }
  @keyframes wraith        { 0%,100%{filter:drop-shadow(0 0 8px #4466ff) brightness(.9)} 50%{filter:drop-shadow(0 0 22px #88aaff) brightness(1.15)} }
  @keyframes cursor        { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes titlePulse    { 0%,100%{box-shadow:0 0 6px #e8b84b} 50%{box-shadow:0 0 18px #e8b84b} }

  .shake  { animation: shake 0.3s ease; }
  .fadeIn { animation: fadeIn 0.4s ease forwards; }
`;
document.head.appendChild(style);

// ── SCREENS ───────────────────────────────────────────────────────────────────
// Current screens: scene01 | [more coming: title, jobselect, map, battle, scene02...]

// Placeholder for screens not yet built
function ComingSoon({ screen, onBack }) {
  return (
    <div style={{
      width:"100vw", height:"100vh", background:"#0a0d14",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      fontFamily:"'Press Start 2P', monospace", gap:16,
    }}>
      <div style={{ fontSize:10, color:"#7dd3c8", letterSpacing:2 }}>CHRONICLES OF AETHERMARCH</div>
      <div style={{ fontSize:14, color:"#e8b84b" }}>{screen}</div>
      <div style={{ fontSize:8, color:"#4a5568", marginTop:8 }}>— COMING SOON —</div>
      <button onClick={onBack} style={{
        marginTop:24, background:"transparent", border:"2px solid #e8b84b",
        color:"#e8b84b", fontFamily:"'Press Start 2P', monospace",
        fontSize:8, padding:"8px 16px", cursor:"pointer",
      }}>◀ BACK</button>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  // screen: "scene01" | "title" | "jobselect" | "map" | "battle" | "scene02"
  const [screen, setScreen] = useState("title");

  if (screen === "title") {
    return <TitleScreen
      onNewGame={() => setScreen("scene01")}
      onContinue={() => setScreen("scene01")}
    />;
  }

  // Route to the right screen
  if (screen === "scene01") {
    return <Scene01 onComplete={() => setScreen("scene02")}/>;
  }

  if (screen === "scene02") {
    return <Scene02 onComplete={() => setScreen("scene03")}/>;
  }

  if (screen === "scene03") {
    return <Scene03 onComplete={() => setScreen("title")}/>;
  }

  // TODO: Add title screen, job select, world map, battle, scene02 etc.
  // Each will be its own component imported here, e.g.:
  // if (screen === "title")    return <TitleScreen onStart={() => setScreen("jobselect")}/>;
  // if (screen === "jobselect") return <JobSelect onConfirm={() => setScreen("map")}/>;
  // if (screen === "map")      return <WorldMap onBattle={() => setScreen("battle")}/>;
  // if (screen === "battle")   return <BattleScreen onVictory={() => setScreen("map")}/>;

  return <ComingSoon screen={screen.toUpperCase()} onBack={() => setScreen("scene01")}/>;
}
