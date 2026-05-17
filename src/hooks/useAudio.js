// ─── CHRONICLES OF AETHERMARCH ───────────────────────────────────────────────
// useAudio.js — Central audio system
// Place this file at: src/hooks/useAudio.js
//
// TRACK MAP:
//   cyan-crucible        → Title Screen
//   aether-forge         → Scene 02 (District 7, tutorial battle)
//   steam-ironlight      → Scene 03 (chase, Slater boss)
//   corrupted-aether-gate→ Scene 01 (substation, Hex Wraith presence)
//   steambound-lullaby   → Ryker interlude, flashback, emotional beats
//
// All files must be in: public/audio/

import { useEffect, useRef } from "react";

// ── TRACK REGISTRY ────────────────────────────────────────────────────────────
export const TRACKS = {
  TITLE:     "/audio/cyan-crucible.mp3",
  SCENE_01:  "/audio/corrupted-aether-gate.mp3",
  SCENE_02:  "/audio/aether-forge.mp3",
  SCENE_03:  "/audio/steam-ironlight.mp3",
  EMOTIONAL: "/audio/steambound-lullaby.mp3",
};

// ── GLOBAL AUDIO SINGLETON ────────────────────────────────────────────────────
// One Audio instance lives for the whole app session.
// Scenes fade in/out without creating new elements each time.
let _audio = null;
let _currentSrc = null;
let _fadeInterval = null;

function getAudio() {
  if (!_audio) {
    _audio = new Audio();
    _audio.loop = true;
    _audio.volume = 0;
  }
  return _audio;
}

function clearFade() {
  if (_fadeInterval) {
    clearInterval(_fadeInterval);
    _fadeInterval = null;
  }
}

// ── FADE HELPERS ──────────────────────────────────────────────────────────────
function fadeIn(audio, targetVol = 0.7, stepMs = 80, stepAmt = 0.02) {
  clearFade();
  _fadeInterval = setInterval(() => {
    const next = Math.min(audio.volume + stepAmt, targetVol);
    audio.volume = next;
    if (next >= targetVol) clearFade();
  }, stepMs);
}

function fadeOut(audio, onDone, stepMs = 60, stepAmt = 0.04) {
  clearFade();
  _fadeInterval = setInterval(() => {
    const next = Math.max(audio.volume - stepAmt, 0);
    audio.volume = next;
    if (next <= 0) {
      clearFade();
      audio.pause();
      onDone?.();
    }
  }, stepMs);
}

// ── CORE TRANSITION ───────────────────────────────────────────────────────────
// Call this to cross-transition to any track.
// If the same track is already playing, does nothing.
export function playTrack(src, targetVol = 0.4) {
  const audio = getAudio();

  if (_currentSrc === src && !audio.paused) return;

  const startNew = () => {
    audio.src = src;
    _currentSrc = src;
    audio.volume = 0;
    audio.play()
      .then(() => fadeIn(audio, targetVol))
      .catch(() => {
        // Autoplay blocked — unlock on first interaction
        const unlock = () => {
          audio.play()
            .then(() => fadeIn(audio, targetVol))
            .catch(() => {});
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("pointerdown", unlock);
        window.addEventListener("keydown", unlock);
      });
  };

  if (!audio.paused && audio.volume > 0) {
    fadeOut(audio, startNew);
  } else {
    startNew();
  }
}

export function stopAudio(onDone) {
  const audio = getAudio();
  if (audio.paused) { onDone?.(); return; }
  fadeOut(audio, () => {
    _currentSrc = null;
    onDone?.();
  });
}

// ── REACT HOOK ────────────────────────────────────────────────────────────────
// useAudio(track) — call at the top of any scene component.
// Fades in on mount, fades out on unmount automatically.
//
// Usage:
//   import { useAudio, TRACKS } from "../hooks/useAudio";
//   useAudio(TRACKS.SCENE_02);

export function useAudio(src, targetVol = 0.7) {
  const srcRef = useRef(src);
  srcRef.current = src;

  useEffect(() => {
    if (srcRef.current) playTrack(srcRef.current, targetVol);
    // No cleanup fadeout here — scene transitions call playTrack()
    // which handles the cross-fade automatically.
  }, [src]);
}

// ── SCENE-SPECIFIC HELPER: EMOTIONAL SHIFT ────────────────────────────────────
// Call this inside Scene03 when Ryker's interlude or the flashback begins.
// It cross-fades from steam-ironlight → steambound-lullaby mid-scene,
// then fades back when the interlude ends.
//
// Usage:
//   import { shiftToEmotional, shiftBack } from "../hooks/useAudio";
//   shiftToEmotional();          // Ryker bar starts
//   shiftBack(TRACKS.SCENE_03);  // Chase resumes

export function shiftToEmotional() {
  playTrack(TRACKS.EMOTIONAL, 0.3); // quieter for intimate moments
}

export function shiftBack(track, vol = 0.7) {
  playTrack(track, vol);
}