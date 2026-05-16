// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Background.jsx — Atmospheric CSS backgrounds for scenes and battle

export default function Background({ id }) {
  const configs = {
    "city-above":     { bg:"radial-gradient(ellipse at 50% 0%, #1a2a3a 0%, #080c14 60%, #000 100%)",   elements:"city-above" },
    "district-7":     { bg:"radial-gradient(ellipse at 30% 80%, #2a1a0a 0%, #0d0a06 60%, #000 100%)",  elements:"district" },
    "substation":     { bg:"radial-gradient(ellipse at 60% 60%, #0a1a14 0%, #06100c 60%, #000 100%)",   elements:"substation" },
    "substation-dark":{ bg:"radial-gradient(ellipse at 50% 50%, #080808 0%, #030303 100%)",             elements:"dark" },
    "wraith":         { bg:"radial-gradient(ellipse at 50% 40%, #08101e 0%, #04080f 60%, #000 100%)",   elements:"wraith" },
    "battle":         { bg:"radial-gradient(ellipse at 50% 100%, #1a0a0a 0%, #0a0508 60%, #000 100%)",  elements:"battle" },
    "district-streets":{ bg:"radial-gradient(ellipse at 40% 60%, #1a0f0a 0%, #0d0a06 60%, #000 100%)", elements:"district-streets" },
    "pip-entrance":   { bg:"radial-gradient(ellipse at 50% 80%, #0a1208 0%, #060a05 60%, #000 100%)",  elements:"pip" },
    "workshop":       { bg:"radial-gradient(ellipse at 30% 50%, #0f0a1a 0%, #080610 60%, #000 100%)",  elements:"workshop" },
    "flashback":      { bg:"radial-gradient(ellipse at 50% 40%, #2a1e08 0%, #1a1205 60%, #0a0800 100%)", elements:"flashback" },
    "bar":            { bg:"radial-gradient(ellipse at 30% 60%, #0f0a08 0%, #080605 60%, #000 100%)",   elements:"bar" },
    "workshop-dark":  { bg:"radial-gradient(ellipse at 50% 50%, #050508 0%, #020203 100%)",             elements:"none" },
    "black":          { bg:"#000", elements:"none" },
  };

  const cfg = configs[id] || configs["black"];

  return (
    <div style={{ position:"absolute", inset:0, background:cfg.bg, overflow:"hidden" }}>
      {/* Scanlines */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:2,
        background:"repeating-linear-gradient(0deg, transparent, transparent 3px, #00000022 3px, #00000022 4px)",
      }}/>

      {/* Grain */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none", zIndex:2, opacity:0.04,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize:"200px",
      }}/>

      {/* City skyline */}
      {(cfg.elements === "city-above" || cfg.elements === "district") && (
        <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"55%", opacity:.35 }}
          viewBox="0 0 800 300" preserveAspectRatio="none">
          {[[0,120,60,180],[65,80,50,220],[120,100,70,200],[195,60,45,240],[245,140,55,160],[305,50,65,250],[375,90,50,210],[430,130,60,170],[495,70,55,230],[555,110,65,190],[625,50,50,250],[680,95,60,205],[745,130,55,170]]
            .map(([x,h,w,y],i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#0a1020"/>)}
          {Array.from({length:40},(_,i) => (
            <rect key={i} x={20+(i*19)%760} y={80+(i*31)%160} width={4} height={6}
              fill={i%3===0?"#4af0e0":"#e8b84b"} opacity={0.2+((i*7)%10)*0.03}/>
          ))}
        </svg>
      )}

      {/* Aether conduits */}
      {cfg.elements === "city-above" && (
        [15,35,55,70,85].map((pct,i) => (
          <div key={i} style={{
            position:"absolute", bottom:"8%", left:`${pct}%`,
            width:2, height:`${20+i*5}%`, background:"#4af0e0",
            animation:`conduitPulse ${2+i*0.4}s ease-in-out infinite`,
            animationDelay:`${i*0.3}s`,
          }}/>
        ))
      )}

      {/* Steam */}
      {["substation","district","city-above","battle"].includes(cfg.elements) && (
        Array.from({length:8},(_,i) => (
          <div key={i} style={{
            position:"absolute", left:`${8+i*12}%`, bottom:`${10+i*5}%`,
            width:8+i*2, height:8+i*2, borderRadius:"50%", background:"#aaccbb",
            animation:`steamDrift ${3+i*0.7}s ease-out infinite`,
            animationDelay:`${i*0.5}s`,
          }}/>
        ))
      )}

      {/* Wraith elements */}
      {cfg.elements === "wraith" && (<>
        <div style={{
          position:"absolute", top:"15%", left:"50%", transform:"translateX(-50%)",
          fontSize:72, animation:"wraith 2s ease-in-out infinite",
          filter:"drop-shadow(0 0 20px #4466ff)",
        }}>👻</div>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.06 }}
          viewBox="0 0 400 400">
          {Array.from({length:12},(_,row) => Array.from({length:10},(_,col) => {
            const x=col*40+(row%2)*20, y=row*34;
            const pts=[[x+20,y],[x+40,y+10],[x+40,y+30],[x+20,y+40],[x,y+30],[x,y+10]].map(p=>p.join(",")).join(" ");
            return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="#4466ff" strokeWidth="0.8"/>;
          }))}
        </svg>
        {Array.from({length:6},(_,i) => (
          <div key={i} style={{
            position:"absolute", left:`${20+i*12}%`, bottom:`${5+i*8}%`,
            width:12, height:12, borderRadius:"50%", background:"#2244aa",
            animation:`steamDrift ${4+i*0.6}s ease-out infinite`,
            animationDelay:`${i*0.7}s`,
          }}/>
        ))}
      </>)}

      {/* District streets — monitoring tower */}
      {cfg.elements === "district-streets" && (
        <>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"50%", opacity:.3 }}
            viewBox="0 0 800 250" preserveAspectRatio="none">
            {[[0,100,50,150],[55,140,60,110],[120,80,45,170],[200,120,55,130],[300,60,40,190],[380,100,50,150],[460,130,60,120],[560,70,45,180],[640,110,55,140],[720,90,50,160]]
              .map(([x,h,w,y],i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#0a0f18"/>)}
            {/* Monitoring tower */}
            <rect x="370" y="20" width="8" height="230" fill="#1a2030"/>
            <circle cx="374" cy="20" r="10" fill="#1a2030"/>
            <circle cx="374" cy="20" r="4" fill="#e05555" opacity="0.8"/>
          </svg>
          {/* Red sweep light */}
          {Array.from({length:3},(_,i) => (
            <div key={i} style={{
              position:"absolute", top:"15%", left:"48%",
              width:2, height:`${30+i*5}%`,
              background:"linear-gradient(180deg, #e0555544, transparent)",
              transformOrigin:"top center",
              animation:`conduitPulse ${1.5+i*0.3}s ease-in-out infinite`,
              animationDelay:`${i*0.5}s`,
            }}/>
          ))}
        </>
      )}

      {/* Pip entrance — fire escape */}
      {cfg.elements === "pip" && (
        <>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"60%", opacity:.4 }}
            viewBox="0 0 800 300" preserveAspectRatio="none">
            {[[0,100,80,200],[85,60,70,240],[200,120,90,180],[350,80,60,220],[470,110,80,190],[610,70,65,230],[720,100,80,200]]
              .map(([x,h,w,y],i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#0a1208"/>)}
            {/* Fire escape railings */}
            <rect x="180" y="120" width="120" height="4" fill="#2a3a2a" opacity="0.8"/>
            <rect x="180" y="120" width="4" height="60" fill="#2a3a2a" opacity="0.8"/>
            <rect x="296" y="120" width="4" height="60" fill="#2a3a2a" opacity="0.8"/>
          </svg>
          {/* Glitch drone glow */}
          <div style={{
            position:"absolute", top:"18%", left:"28%",
            width:8, height:8, borderRadius:"50%",
            background:"#7dd3c8",
            boxShadow:"0 0 12px #7dd3c8, 0 0 24px #7dd3c855",
            animation:"conduitPulse 1.5s ease-in-out infinite",
          }}/>
          {Array.from({length:4},(_,i) => (
            <div key={i} style={{
              position:"absolute", left:`${15+i*18}%`, bottom:`${8+i*6}%`,
              width:6, height:6, borderRadius:"50%", background:"#4ec97a",
              animation:`steamDrift ${3+i*0.5}s ease-out infinite`,
              animationDelay:`${i*0.4}s`, opacity:0.4,
            }}/>
          ))}
        </>
      )}

      {/* Workshop interior */}
      {cfg.elements === "workshop" && (
        <>
          {/* Shelves */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.2 }}
            viewBox="0 0 800 600">
            <rect x="0" y="100" width="800" height="4" fill="#2a3a5a"/>
            <rect x="0" y="250" width="800" height="4" fill="#2a3a5a"/>
            <rect x="0" y="400" width="800" height="4" fill="#2a3a5a"/>
            {/* Items on shelves */}
            {Array.from({length:12},(_,i) => (
              <rect key={i} x={30+i*65} y={70+Math.floor(i/4)*150} width={20+i%3*10} height={25+i%2*10} fill="#3a4a6a"/>
            ))}
            {/* Workbench */}
            <rect x="100" y="450" width="500" height="8" fill="#2a3a2a"/>
          </svg>
          {/* Aether coil glow on workbench */}
          <div style={{
            position:"absolute", bottom:"25%", left:"40%",
            width:10, height:10, borderRadius:"50%",
            background:"#4af0e0",
            boxShadow:"0 0 16px #4af0e0, 0 0 32px #4af0e055",
            animation:"conduitPulse 2s ease-in-out infinite",
          }}/>
          {/* Transmitter blink */}
          <div style={{
            position:"absolute", bottom:"26%", left:"55%",
            width:6, height:6, borderRadius:"50%",
            background:"#e8b84b",
            animation:"pulse 1s step-end infinite",
          }}/>
          {Array.from({length:5},(_,i) => (
            <div key={i} style={{
              position:"absolute", left:`${10+i*20}%`, bottom:`${5+i*4}%`,
              width:5, height:5, borderRadius:"50%", background:"#7a6a4a",
              animation:`steamDrift ${4+i*0.6}s ease-out infinite`,
              animationDelay:`${i*0.7}s`, opacity:0.3,
            }}/>
          ))}
        </>
      )}
      {cfg.elements === "dark" && (
        <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"35%", opacity:.5 }}
          viewBox="0 0 800 150" preserveAspectRatio="none">
          <polygon points="0,150 0,80 40,60 80,90 130,50 190,75 250,40 310,70 380,30 440,65 500,45 560,80 620,35 680,60 740,50 800,70 800,150" fill="#111"/>
        </svg>
      )}

      {/* Battle floor */}
      {cfg.elements === "battle" && (
        <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"30%", opacity:.4 }}
          viewBox="0 0 800 120" preserveAspectRatio="none">
          <polygon points="0,120 0,60 200,40 400,55 600,35 800,50 800,120" fill="#1a0808"/>
        </svg>
      )}
      {/* Flashback — warm workshop */}
      {cfg.elements === "flashback" && (
        <>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 30%, #3a2a0a 0%, transparent 60%)", opacity:0.4 }}/>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"40%", opacity:.25 }} viewBox="0 0 800 200" preserveAspectRatio="none">
            <rect x="100" y="80" width="600" height="8" fill="#4a3a1a"/>
            {Array.from({length:8},(_,i) => (
              <rect key={i} x={120+i*80} y={40+Math.floor(i/4)*30} width={30+i%3*10} height={35} fill="#3a2a10"/>
            ))}
          </svg>
          {[20,40,60,75,88].map((pct,i) => (
            <div key={i} style={{
              position:"absolute", top:`${10+i*8}%`, left:`${pct}%`,
              width:3, height:3, borderRadius:"50%", background:"#c8a84b",
              boxShadow:`0 0 6px #c8a84b`,
              animation:`conduitPulse ${2+i*0.3}s ease-in-out infinite`,
              animationDelay:`${i*0.4}s`,
            }}/>
          ))}
        </>
      )}

      {/* Bar — Ryker's scene */}
      {cfg.elements === "bar" && (
        <>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 70%, #1a0f08 0%, transparent 50%)", opacity:0.6 }}/>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%", height:"35%", opacity:.3 }} viewBox="0 0 800 140" preserveAspectRatio="none">
            <rect x="0" y="60" width="800" height="8" fill="#2a1a10"/>
            {Array.from({length:6},(_,i) => (
              <rect key={i} x={50+i*120} y={20} width={15} height={40} fill="#1a0f08"/>
            ))}
          </svg>
          <div style={{ position:"absolute", bottom:"35%", right:"15%", width:40, height:60, background:"linear-gradient(180deg, #2a1a08, #1a0f05)", border:"1px solid #3a2a18" }}/>
          <div style={{ position:"absolute", bottom:"40%", right:"16%", width:36, height:24, background:"linear-gradient(180deg, #c8a84b44, #e8c86844)", animation:"pulse 3s ease-in-out infinite", borderRadius:2 }}/>
        </>
      )}
</div>
  );
}