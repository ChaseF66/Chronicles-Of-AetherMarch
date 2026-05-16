// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// UI.jsx — Shared UI primitives used across screens

import { useState } from "react";

export function Txt({ children, size=10, color="#e8edf5", style={} }) {
  return (
    <span style={{ fontFamily:"'Press Start 2P', monospace", fontSize:size, color, lineHeight:1.6, ...style }}>
      {children}
    </span>
  );
}

export function VT({ children, size=18, color="#e8edf5", style={} }) {
  return (
    <span style={{ fontFamily:"'VT323', monospace", fontSize:size, color, lineHeight:1.4, ...style }}>
      {children}
    </span>
  );
}

export function PixelBox({ children, style={}, glow }) {
  return (
    <div style={{
      background:"#111827",
      border:"2px solid #2a3a5a",
      boxShadow: glow ? `0 0 12px ${glow}66, inset 0 0 20px #0004` : `inset 0 0 20px #0004`,
      padding:"12px",
      ...style,
    }}>
      {children}
    </div>
  );
}

export function HPBar({ current, max }) {
  const pct = Math.max(0, current / max);
  const color = pct > 0.5 ? "#4ec97a" : pct > 0.25 ? "#e8b84b" : "#e05555";
  return (
    <div style={{ width:"100%", height:8, background:"#1a2030", border:"1px solid #2a3a5a" }}>
      <div style={{ width:`${pct*100}%`, height:"100%", background:color, transition:"width 0.3s ease", boxShadow:`0 0 4px ${color}` }}/>
    </div>
  );
}

export function MPBar({ current, max }) {
  const pct = Math.max(0, current / max);
  return (
    <div style={{ width:"100%", height:6, background:"#1a2030", border:"1px solid #2a3a5a" }}>
      <div style={{ width:`${pct*100}%`, height:"100%", background:"#5b8dee", transition:"width 0.3s ease", boxShadow:"0 0 4px #5b8dee" }}/>
    </div>
  );
}

export function Btn({ children, onClick, disabled, color="#e8b84b", small }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: disabled ? "#4a5568" : hover ? color : "transparent",
        border:`2px solid ${disabled ? "#4a5568" : color}`,
        color: disabled ? "#8899aa" : hover ? "#0a0d14" : color,
        fontFamily:"'Press Start 2P', monospace",
        fontSize: small ? 8 : 9,
        padding: small ? "5px 8px" : "8px 14px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition:"all 0.15s",
        whiteSpace:"nowrap",
      }}
    >
      {children}
    </button>
  );
}
