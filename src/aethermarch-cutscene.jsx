import { useState, useEffect, useRef, useCallback } from "react";

// ── FONTS ─────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&family=Share+Tech+Mono&display=swap";
document.head.appendChild(fontLink);

const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; }

  @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
  @keyframes flicker { 0%,100%{opacity:1} 45%{opacity:.85} 50%{opacity:.7} 55%{opacity:.9} }
  @keyframes pulse   { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes steamDrift {
    0%   { transform: translateY(0px)   translateX(0px)  scale(1);   opacity: 0; }
    15%  { opacity: .35; }
    85%  { opacity: .15; }
    100% { transform: translateY(-80px) translateX(12px) scale(1.6); opacity: 0; }
  }
  @keyframes conduitPulse {
    0%,100% { opacity: .15; box-shadow: 0 0 4px #4af0e0; }
    50%     { opacity: .45; box-shadow: 0 0 14px #4af0e0, 0 0 28px #4af0e044; }
  }
  @keyframes wraith {
    0%,100% { filter: drop-shadow(0 0 8px #4466ff) brightness(.9); }
    50%     { filter: drop-shadow(0 0 22px #88aaff) brightness(1.15); }
  }
  @keyframes cursor { 0%,100%{opacity:1} 50%{opacity:0} }

  .typewriter-cursor::after {
    content: '▋';
    animation: cursor 0.8s step-end infinite;
    color: #e8b84b;
    font-size: .9em;
    margin-left: 1px;
  }
`;
document.head.appendChild(style);

// ── SCENE DATA ────────────────────────────────────────────────────────────────
// type: "scene" | "narration" | "dialogue" | "title" | "transition"
// speaker: character name (for dialogue)
// bg: which background to render
// emphasis: bold the whole line

const SCENE_01 = [
  // ── PART ONE ──────────────────────────────────────────────────────────────
  {
    type: "transition",
    text: "PART ONE",
    sub: "THE CITY BEFORE THE WORLD WAKES",
    bg: "city-above",
  },
  {
    type: "scene",
    text: "The city of Aethermarch from above — a towering industrial sprawl swallowed in pre-dawn fog. Steam vents exhale white clouds between ancient stone towers. Aether conduits pulse faint blue beneath the cobblestones, the city's veins still beating.",
    bg: "city-above",
  },
  {
    type: "narration",
    text: "The city of Aethermarch never fully sleeps.",
    bg: "city-above",
  },
  {
    type: "narration",
    text: "It just gets quieter about what it's doing.",
    bg: "city-above",
  },
  {
    type: "scene",
    text: "Camera drifts downward — past gleaming corporate towers, past transit lines gone dark, down into the smoke and tangle of Lower District 7. A quarantine notice is plastered to a crumbling wall:",
    bg: "district-7",
  },
  {
    type: "narration",
    text: "\"AETHERIC CONTAMINATION — DISTRICT 7 RESTRICTED BY ORDER OF AETHON SYNDICATE MUNICIPAL AUTHORITY.\"",
    bg: "district-7",
    emphasis: true,
  },
  {
    type: "scene",
    text: "Someone has drawn a wrench through the official seal. Underneath, in spray-painted letters:",
    bg: "district-7",
  },
  {
    type: "narration",
    text: "\"WE STILL LIVE HERE.\"",
    bg: "district-7",
    emphasis: true,
  },

  // ── PART TWO ──────────────────────────────────────────────────────────────
  {
    type: "transition",
    text: "PART TWO",
    sub: "JUST ANOTHER MORNING",
    bg: "substation",
  },
  {
    type: "scene",
    text: "VYX moves through the ruins of a collapsed aetheric substation with practiced ease — boots careful on unstable ground, bag over one shoulder. He's wearing a patched-up work jacket covered in tool loops. A wrench hangs at his belt like a weapon. He looks young. He moves like someone older.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Okay. Collapsed junction box — that's copper wire. That's mine.",
    bg: "substation",
  },
  {
    type: "scene",
    text: "He crouches, pulls a coil of wire free, examines it, stuffs it in the bag.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Cracked aether housing — worthless, nobody buys cracked. Unless...",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...No. It's just cracked. Moving on.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Three more of these this month. Three. Syndicate says it's contamination. Sure. The pipes just started exploding themselves. Very natural. Very normal city behavior.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Dad would've known what was actually happening.",
    bg: "substation",
    pause: true,
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...Whatever. Eyes open, Vyx.",
    bg: "substation",
  },
  {
    type: "scene",
    text: "His boot catches on something half-buried in the rubble. He pulls it free — an aether coil. Still intact. Still faintly glowing. He stares at it.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...No.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Yes.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "That's rent. That's actually rent.",
    bg: "substation",
    emphasis: true,
  },
  {
    type: "scene",
    text: "He grins — and for just a second, he looks exactly his age. He drops the coil carefully into the bag. Pats the bag. Looks up at the pre-dawn sky through the collapsed roof.",
    bg: "substation",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Okay. One more sweep and I'm out. Don't get greedy, don't get—",
    bg: "substation",
  },
  {
    type: "scene",
    text: "He stops.",
    bg: "substation",
    pause: true,
  },
  {
    type: "scene",
    text: "Something in the rubble ahead of him is moving.",
    bg: "substation-dark",
    emphasis: true,
  },

  // ── PART THREE ────────────────────────────────────────────────────────────
  {
    type: "transition",
    text: "PART THREE",
    sub: "THE THING IN THE DARK",
    bg: "substation-dark",
  },
  {
    type: "scene",
    text: "The ambient hum of the city cuts out. Sudden, total quiet — like something has swallowed the sound. Then: a low, arrhythmic clicking. Metal on stone. Getting closer.",
    bg: "substation-dark",
  },
  {
    type: "scene",
    text: "Vyx goes very still. His hand moves slowly to the wrench at his belt.",
    bg: "substation-dark",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...Okay. Okay okay okay.",
    bg: "substation-dark",
    whisper: true,
  },
  {
    type: "scene",
    text: "The debris shifts. A shape rises from the rubble — too many joints bending in too many directions. A body that was once human, stretched and rebuilt into something the Hex Engine found more useful. Magitek lattice visible beneath pale skin. Eyes that glow a cold, dead blue.",
    bg: "wraith",
  },
  {
    type: "narration",
    text: "A HEX WRAITH.",
    bg: "wraith",
    emphasis: true,
  },
  {
    type: "scene",
    text: "It orients toward him. That horrible, mechanical head-tilt. Sensors sweeping. It takes one step forward. Vyx braces.",
    bg: "wraith",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "Right. Great. Perfect start to the morning.",
    bg: "wraith",
  },
  {
    type: "scene",
    text: "The Wraith stops.",
    bg: "wraith",
    pause: true,
  },
  {
    type: "scene",
    text: "The Wraith's signal — that constant crackling static that surrounds them — stutters. Skips. Like a record scratching.",
    bg: "wraith",
  },
  {
    type: "scene",
    text: "The blue light in its eyes flickers. Once. Twice. It tilts its head the other direction. It takes one step — not toward the exit. Toward Vyx. But not aggressive.",
    bg: "wraith",
  },
  {
    type: "narration",
    text: "Like it recognizes him.",
    bg: "wraith",
    emphasis: true,
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...What are you doing?",
    bg: "wraith",
    whisper: true,
  },
  {
    type: "scene",
    text: "The Wraith makes a sound. Not a screech. Not the mechanical howl they usually make. Something distorted, broken, layered — like three voices trying to speak through the same damaged speaker.",
    bg: "wraith",
  },
  {
    type: "narration",
    text: "It sounds almost like a name.",
    bg: "wraith",
    emphasis: true,
  },
  {
    type: "scene",
    text: "Then the moment shatters. A Syndicate patrol drone sweeps its light through the district. The Wraith's head snaps toward it. Its signal spikes back to full intensity. The recognition — whatever it was — is gone. It lurches sideways and vanishes into the dark.",
    bg: "substation-dark",
  },
  {
    type: "scene",
    text: "Vyx stands alone in the wreckage. Wrench still raised. Aether coil forgotten in his bag. He stares at the dark where the Wraith disappeared.",
    bg: "substation-dark",
    pause: true,
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "...Okay.",
    bg: "substation-dark",
  },
  {
    type: "dialogue",
    speaker: "VYX",
    text: "That was new.",
    bg: "substation-dark",
  },
  {
    type: "scene",
    text: "He slowly lowers the wrench. Looks at his hand — it's not shaking, which surprises him. He turns and walks out of the ruin, into the pre-dawn streets of Lower District 7.",
    bg: "substation-dark",
  },
  {
    type: "narration",
    text: "Somewhere deep beneath the cobblestones, something vast and patient pulses back.",
    bg: "city-above",
  },

  // ── TITLE CARD ────────────────────────────────────────────────────────────
  { type: "title", bg: "black" },
];

// ── CHARACTER COLORS ──────────────────────────────────────────────────────────
const CHAR_COLOR = {
  VYX:       "#e8b84b",
  KAEL:      "#7dd3c8",
  PIP:       "#c97c2a",
  RYKER:     "#8899aa",
  NARRATION: "#d4c9a8",
};

// ── CSS BACKGROUNDS ───────────────────────────────────────────────────────────
function Background({ id }) {
  const base = {
    position: "absolute", inset: 0,
    transition: "opacity 1.2s ease",
  };

  const configs = {
    "city-above": {
      bg: "radial-gradient(ellipse at 50% 0%, #1a2a3a 0%, #080c14 60%, #000 100%)",
      elements: "city-above",
    },
    "district-7": {
      bg: "radial-gradient(ellipse at 30% 80%, #2a1a0a 0%, #0d0a06 60%, #000 100%)",
      elements: "district",
    },
    "substation": {
      bg: "radial-gradient(ellipse at 60% 60%, #0a1a14 0%, #06100c 60%, #000 100%)",
      elements: "substation",
    },
    "substation-dark": {
      bg: "radial-gradient(ellipse at 50% 50%, #080808 0%, #030303 100%)",
      elements: "dark",
    },
    "wraith": {
      bg: "radial-gradient(ellipse at 50% 40%, #08101e 0%, #04080f 60%, #000 100%)",
      elements: "wraith",
    },
    "black": {
      bg: "#000",
      elements: "none",
    },
  };

  const cfg = configs[id] || configs["black"];

  return (
    <div style={{ ...base, background: cfg.bg, overflow: "hidden" }}>
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, #00000022 3px, #00000022 4px)",
      }}/>

      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px",
      }}/>

      {/* City skyline */}
      {(cfg.elements === "city-above" || cfg.elements === "district") && (
        <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"55%", opacity:.35 }}
          viewBox="0 0 800 300" preserveAspectRatio="none">
          {/* Buildings */}
          {[
            [0,120,60,180],[65,80,50,220],[120,100,70,200],[195,60,45,240],
            [245,140,55,160],[305,50,65,250],[375,90,50,210],[430,130,60,170],
            [495,70,55,230],[555,110,65,190],[625,50,50,250],[680,95,60,205],
            [745,130,55,170],
          ].map(([x,h,w,y],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill="#0a1020"/>
          ))}
          {/* Windows */}
          {Array.from({length:40},(_,i) => (
            <rect key={i}
              x={20 + (i*19)%760} y={80 + (i*31)%160}
              width={4} height={6}
              fill={Math.random()>.6?"#4af0e0":"#e8b84b"}
              opacity={0.3 + Math.random()*0.4}
            />
          ))}
        </svg>
      )}

      {/* Aether conduits */}
      {cfg.elements === "city-above" && (
        <>
          {[15,35,55,70,85].map((pct,i) => (
            <div key={i} style={{
              position:"absolute", bottom:"8%", left:`${pct}%`,
              width:2, height:`${20+i*5}%`,
              background:"#4af0e0",
              animation:`conduitPulse ${2+i*0.4}s ease-in-out infinite`,
              animationDelay:`${i*0.3}s`,
            }}/>
          ))}
        </>
      )}

      {/* Steam particles */}
      {(cfg.elements === "substation" || cfg.elements === "district" || cfg.elements === "city-above") && (
        <>
          {Array.from({length:8},(_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${8+i*12}%`,
              bottom:`${10+i*5}%`,
              width: 8+i*2, height: 8+i*2,
              borderRadius:"50%",
              background:"#aaccbb",
              animation:`steamDrift ${3+i*0.7}s ease-out infinite`,
              animationDelay:`${i*0.5}s`,
            }}/>
          ))}
        </>
      )}

      {/* Wraith glow */}
      {cfg.elements === "wraith" && (
        <>
          <div style={{
            position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)",
            fontSize:72,
            animation:"wraith 2s ease-in-out infinite",
            filter:"drop-shadow(0 0 20px #4466ff)",
          }}>👻</div>
          {/* Hex grid */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.06 }}
            viewBox="0 0 400 400">
            {Array.from({length:12},(_,row) =>
              Array.from({length:10},(_,col) => {
                const x = col*40 + (row%2)*20;
                const y = row*34;
                const pts = [
                  [x+20,y],[x+40,y+10],[x+40,y+30],[x+20,y+40],[x,y+30],[x,y+10]
                ].map(p=>p.join(",")).join(" ");
                return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="#4466ff" strokeWidth="0.8"/>;
              })
            )}
          </svg>
          {/* Blue mist */}
          {Array.from({length:6},(_,i) => (
            <div key={i} style={{
              position:"absolute",
              left:`${20+i*12}%`, bottom:`${5+i*8}%`,
              width:12, height:12, borderRadius:"50%",
              background:"#2244aa",
              animation:`steamDrift ${4+i*0.6}s ease-out infinite`,
              animationDelay:`${i*0.7}s`,
            }}/>
          ))}
        </>
      )}

      {/* Dark rubble */}
      {cfg.elements === "dark" && (
        <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"35%", opacity:.5 }}
          viewBox="0 0 800 150" preserveAspectRatio="none">
          <polygon points="0,150 0,80 40,60 80,90 130,50 190,75 250,40 310,70 380,30 440,65 500,45 560,80 620,35 680,60 740,50 800,70 800,150" fill="#111"/>
        </svg>
      )}
    </div>
  );
}

// ── TYPEWRITER HOOK ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 28, onDone) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;

    function tick() {
      if (idx.current < text.length) {
        idx.current++;
        setDisplayed(text.slice(0, idx.current));
        const char = text[idx.current - 1];
        const delay = [",","—",";"].includes(char) ? speed*5 :
                      [".","!","?"].includes(char) ? speed*8 : speed;
        timer.current = setTimeout(tick, delay);
      } else {
        setDone(true);
        onDone?.();
      }
    }
    timer.current = setTimeout(tick, 80);
    return () => clearTimeout(timer.current);
  }, [text]);

  function skip() {
    clearTimeout(timer.current);
    setDisplayed(text);
    setDone(true);
    onDone?.();
  }

  return { displayed, done, skip };
}

// ── DIALOGUE BOX ─────────────────────────────────────────────────────────────
function DialogueBox({ beat, onAdvance, beatIndex }) {
  const [typeDone, setTypeDone] = useState(false);
  const { displayed, done, skip } = useTypewriter(beat.text, 22, () => setTypeDone(true));

  useEffect(() => { setTypeDone(false); }, [beatIndex]);

  function handleClick() {
    if (!done) { skip(); }
    else { onAdvance(); }
  }

  const isDialogue   = beat.type === "dialogue";
  const isNarration  = beat.type === "narration";
  const isScene      = beat.type === "scene";
  const speakerColor = isDialogue ? (CHAR_COLOR[beat.speaker] || "#fff") : CHAR_COLOR.NARRATION;

  return (
    <div
      onClick={handleClick}
      style={{
        position:"absolute", bottom:0, left:0, right:0,
        padding:"0 0 40px",
        cursor:"pointer",
        animation:"slideUp .35s ease forwards",
        zIndex:20,
      }}
    >
      {/* Letterbox bottom bar */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:40,
        background:"#000",
      }}/>

      {/* Main box */}
      <div style={{
        margin:"0 40px",
        background:"linear-gradient(180deg, #05080f 0%, #08101a 100%)",
        border:`1px solid ${isDialogue ? speakerColor + "66" : "#2a3a4a"}`,
        borderBottom:"none",
        boxShadow:`0 -4px 40px #00000099, inset 0 1px 0 ${isDialogue ? speakerColor + "22" : "#ffffff08"}`,
        padding:"0",
        minHeight:110,
      }}>
        {/* Speaker name plate */}
        {isDialogue && (
          <div style={{
            display:"inline-block",
            background:`linear-gradient(90deg, ${speakerColor}33, transparent)`,
            borderRight:`2px solid ${speakerColor}`,
            padding:"6px 20px 6px 16px",
            marginBottom:2,
          }}>
            <span style={{
              fontFamily:"'Cinzel', serif",
              fontSize:11,
              letterSpacing:3,
              color: speakerColor,
              textShadow:`0 0 10px ${speakerColor}`,
            }}>{beat.speaker}</span>
          </div>
        )}

        {/* Scene label */}
        {isScene && (
          <div style={{
            display:"inline-block",
            padding:"6px 20px 6px 16px",
            borderRight:"1px solid #2a3a4a",
            marginBottom:2,
          }}>
            <span style={{
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:9,
              letterSpacing:3,
              color:"#4a6a5a",
              textTransform:"uppercase",
            }}>[ SCENE ]</span>
          </div>
        )}

        {/* Text */}
        <div style={{ padding:"10px 20px 16px" }}>
          <span style={{
            fontFamily: isDialogue ? "'IM Fell English', serif" : isNarration ? "'IM Fell English', serif" : "'Share Tech Mono', monospace",
            fontSize: isDialogue ? 17 : isNarration ? 16 : 13,
            fontStyle: isNarration ? "italic" : "normal",
            color: isDialogue ? "#f0ead8" :
                   isNarration ? (beat.emphasis ? "#e8d8a0" : "#c8bca0") :
                   "#7a9a8a",
            lineHeight: 1.7,
            letterSpacing: isScene ? 0.5 : 0,
            fontWeight: beat.emphasis ? 600 : 400,
          }}>
            {displayed}
            {!done && <span className="typewriter-cursor"/>}
          </span>
        </div>

        {/* Advance indicator */}
        {done && (
          <div style={{
            textAlign:"right", padding:"0 20px 12px",
            animation:"pulse 1.2s ease-in-out infinite",
          }}>
            <span style={{
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:10, color:"#e8b84b66", letterSpacing:2,
            }}>▶ CONTINUE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TRANSITION CARD ───────────────────────────────────────────────────────────
function TransitionCard({ beat, onDone }) {
  const [phase, setPhase] = useState("in"); // in | hold | out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"),  1800);
    const t3 = setTimeout(() => onDone(),          2600);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:50,
      background:"#000",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase === "in" ? 0 : phase === "hold" ? 1 : 0,
      transition:"opacity .5s ease",
      pointerEvents:"none",
    }}>
      <div style={{
        fontFamily:"'Share Tech Mono', monospace",
        fontSize:10, letterSpacing:6, color:"#4a6a5a",
        marginBottom:10, textTransform:"uppercase",
      }}>{beat.text}</div>
      <div style={{
        fontFamily:"'Cinzel', serif",
        fontSize:18, letterSpacing:4, color:"#e8b84b",
        textShadow:"0 0 20px #e8b84b66",
        textTransform:"uppercase",
        textAlign:"center",
        maxWidth:400,
      }}>{beat.sub}</div>
      <div style={{
        marginTop:16, width:80, height:1,
        background:"linear-gradient(90deg, transparent, #e8b84b, transparent)",
      }}/>
    </div>
  );
}

// ── TITLE CARD ────────────────────────────────────────────────────────────────
function TitleCard({ onDone }) {
  const [phase, setPhase] = useState(0);
  const lines = ["CHRONICLES", "OF", "AETHERMARCH"];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => setPhase(4), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position:"absolute", inset:0, zIndex:50,
      background:"#000",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      gap:4,
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontFamily:"'Cinzel', serif",
          fontSize: i===2 ? 36 : i===1 ? 14 : 13,
          letterSpacing: i===2 ? 8 : 12,
          color: i===2 ? "#e8b84b" : "#7a8a9a",
          textShadow: i===2 ? "0 0 30px #e8b84b88, 0 0 60px #e8b84b44" : "none",
          opacity: phase > i ? 1 : 0,
          transform: phase > i ? "translateY(0)" : "translateY(10px)",
          transition:"opacity .8s ease, transform .8s ease",
          animation: i===2 && phase > 2 ? "flicker 4s ease-in-out infinite" : "none",
        }}>{line}</div>
      ))}

      <div style={{
        marginTop:24,
        fontFamily:"'IM Fell English', serif",
        fontStyle:"italic",
        fontSize:13,
        color:"#5a6a5a",
        letterSpacing:1,
        opacity: phase > 3 ? 1 : 0,
        transition:"opacity 1.2s ease",
        textAlign:"center",
      }}>
        "A city runs on power. Power runs on something else."
      </div>

      {phase > 3 && (
        <div
          onClick={onDone}
          style={{
            marginTop:32,
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:10, letterSpacing:4,
            color:"#e8b84b",
            cursor:"pointer",
            animation:"pulse 1.5s ease-in-out infinite",
          }}
        >
          ▶ PRESS TO CONTINUE
        </div>
      )}
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div style={{
      position:"absolute", top:40, left:"50%", transform:"translateX(-50%)",
      display:"flex", gap:3, zIndex:30,
    }}>
      {Array.from({length: total}, (_,i) => (
        <div key={i} style={{
          width: i < current ? 12 : 6,
          height:2,
          background: i < current ? "#e8b84b" : "#2a3a4a",
          transition:"all .3s ease",
        }}/>
      ))}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [beatIndex, setBeatIndex]     = useState(0);
  const [bgFade, setBgFade]           = useState(false);
  const [finished, setFinished]       = useState(false);
  const [showSkip, setShowSkip]       = useState(false);

  const beat    = SCENE_01[beatIndex];
  const prevBg  = useRef(beat?.bg);

  // Show skip hint after 3s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Spacebar advances
  useEffect(() => {
    function onKey(e) {
      if (e.code === "Space") advance();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [beatIndex]);

  function advance() {
    if (beatIndex >= SCENE_01.length - 1) { setFinished(true); return; }
    const next = SCENE_01[beatIndex + 1];
    if (next?.bg !== beat?.bg) {
      setBgFade(true);
      setTimeout(() => {
        setBeatIndex(i => i + 1);
        setBgFade(false);
        prevBg.current = next?.bg;
      }, 400);
    } else {
      setBeatIndex(i => i + 1);
    }
  }

  if (finished) {
    return (
      <div style={{
        width:"100vw", height:"100vh", background:"#000",
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        fontFamily:"'Cinzel', serif",
      }}>
        <div style={{ color:"#e8b84b", fontSize:14, letterSpacing:4, marginBottom:16 }}>SCENE 01 COMPLETE</div>
        <div style={{
          fontFamily:"'IM Fell English', serif", fontStyle:"italic",
          color:"#5a7a6a", fontSize:14, marginBottom:32, textAlign:"center", maxWidth:400,
        }}>
          "Something in its signal recognized him."
        </div>
        <div
          onClick={() => { setBeatIndex(0); setFinished(false); }}
          style={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:10, letterSpacing:4, color:"#e8b84b",
            cursor:"pointer", border:"1px solid #e8b84b44",
            padding:"10px 20px",
          }}
        >▶ REPLAY SCENE</div>
      </div>
    );
  }

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#000", position:"relative", overflow:"hidden" }}>

      {/* Background */}
      <div style={{ opacity: bgFade ? 0 : 1, transition:"opacity .4s ease" }}>
        <Background id={beat.bg}/>
      </div>

      {/* Top letterbox */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:40,
        background:"#000", zIndex:10,
      }}/>

      {/* Progress */}
      <ProgressBar
        current={SCENE_01.filter((b,i) => i < beatIndex && b.type !== "transition").length}
        total={SCENE_01.filter(b => b.type !== "transition").length}
      />

      {/* Skip hint */}
      {showSkip && (
        <div style={{
          position:"absolute", top:14, right:20, zIndex:30,
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:8, letterSpacing:2, color:"#2a3a4a",
        }}>CLICK OR SPACE TO ADVANCE</div>
      )}

      {/* Beat renderer */}
      {beat.type === "transition" ? (
        <TransitionCard key={beatIndex} beat={beat} onDone={advance}/>
      ) : beat.type === "title" ? (
        <TitleCard onDone={() => setFinished(true)}/>
      ) : (
        <DialogueBox
          key={beatIndex}
          beat={beat}
          beatIndex={beatIndex}
          onAdvance={advance}
        />
      )}
    </div>
  );
}
