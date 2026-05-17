// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// Background.jsx — Real image backgrounds with atmospheric overlays

// ── IMAGE MAP ────────────────────────────────────────────────────────────────
// Maps scene background IDs to real art assets in /public/art/
// Adjust filenames to match exactly what's in your public/art/ folder

const IMAGE_MAP = {
  // District 7 scenes
  "city-above":        "/art/District 7 v2.png",
  "district-7":        "/art/District 7 v2.png",
  "district":          "/art/District 7 v2.png",
  "substation":        "/art/District 7 v1.png",
  "substation-dark":   "/art/District 7 v1.png",
  "district-streets":  "/art/District 7 v3.png",

  // Workshop / interior
  "workshop":          "/art/District 7 v4.png",
  "workshop-dark":     "/art/District 7 v4.png",
  "pip-entrance":      "/art/District 7 v3.png",

  // Bar / emotional scenes
  "bar":               "/art/District 7 v4.png",
  "flashback":         "/art/District 7 v4.png",

  // Battle / confrontation
  "battle":            "/art/Revolution In District 7.png",
  "wraith":            "/art/District 7 v1.png",
  "chase":             "/art/Revolution In District 7.png",

  // Fallback
  "black":             null,
};

// ── OVERLAY CONFIG ────────────────────────────────────────────────────────────
// Per-scene color tints layered over the image
const OVERLAY_MAP = {
  "substation":       "rgba(0, 20, 10, 0.45)",   // darker, contaminated
  "substation-dark":  "rgba(0, 10, 5, 0.6)",
  "flashback":        "rgba(40, 20, 0, 0.35)",    // warm amber tint
  "bar":              "rgba(30, 15, 0, 0.4)",      // warm buried amber
  "battle":           "rgba(10, 0, 0, 0.25)",      // slight red heat
  "wraith":           "rgba(5, 0, 20, 0.5)",       // cold purple-dark
  "black":            "rgba(0, 0, 0, 1)",
};

const DEFAULT_OVERLAY = "rgba(0, 5, 10, 0.3)";   // default: cool dark cyan tint

// ── BACKGROUND POSITION ───────────────────────────────────────────────────────
const POSITION_MAP = {
  "city-above":    "center top",
  "district-7":   "center center",
  "substation":   "center bottom",
  "battle":       "center center",
  "flashback":    "center center",
  "bar":          "center bottom",
};

const DEFAULT_POSITION = "center center";

export default function Background({ id }) {
  const imageSrc = IMAGE_MAP[id] || IMAGE_MAP["district-7"];
  const overlay  = OVERLAY_MAP[id] || DEFAULT_OVERLAY;
  const position = POSITION_MAP[id] || DEFAULT_POSITION;

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>

      {/* ── REAL IMAGE ── */}
      {imageSrc && (
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${imageSrc}")`,
          backgroundSize: "cover",
          backgroundPosition: position,
          backgroundRepeat: "no-repeat",
        }}/>
      )}

      {/* ── COLOR OVERLAY (tint + mood) ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: overlay,
        pointerEvents: "none",
      }}/>

      {/* ── VIGNETTE (draws eye to center) ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
        pointerEvents: "none",
      }}/>

      {/* ── SCANLINES ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
        pointerEvents: "none",
        zIndex: 2,
      }}/>

      {/* ── AETHER CONDUIT LINE (bottom pulse) ── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(74,240,224,0.4), transparent)",
        pointerEvents: "none",
        zIndex: 3,
      }}/>

    </div>
  );
}