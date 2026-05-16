# Chronicles of Aethermarch

**Chronicles of Aethermarch** is a noir magitek JRPG concept and interactive narrative prototype. The project blends classic JRPG emotional storytelling with a modern industrial-fantasy visual identity: steam, aether conduits, corporate rot, found family, and human/machine horror.

> A city runs on power. Power runs on something else.

## Current Prototype

This repository currently contains **Scene 01: “Something In The Wreckage”**, implemented as a React/Vite cinematic cutscene prototype.

The prototype includes:

- Typewriter-style dialogue pacing
- Cinematic scene transitions
- Noir-inspired letterboxing and UI
- Animated atmospheric backgrounds
- Character-colored dialogue boxes
- Progress indicator
- Replayable title-card ending

## Project Vision

Aethermarch is planned as a classic JRPG-inspired experience with a darker, modern presentation style. The player follows **Vyx**, a lower-district scavenger whose life changes after a Hex Wraith recognizes him instead of attacking.

The story explores:

- Technology as promise vs. catastrophe
- Human cost hidden beneath progress
- Found family in a collapsing city
- Guilt, survival, and redemption
- The blurred boundary between magic, machine, and memory

## Running the Prototype

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open the local Vite URL in your browser.

## Repository Structure

```text
chronicles-of-aethermarch/
├── src/
│   ├── App.jsx              # Interactive cutscene prototype
│   ├── main.jsx             # React entry point
│   └── index.css            # Global base styling
├── docs/
│   ├── lore/
│   │   └── game-bible.md    # Living story/world document
│   └── scripts/
│       └── scene-01-something-in-the-wreckage.md
├── assets/
│   ├── images/              # Future concept art, mockups, UI stills
│   └── audio/               # Future ambient tracks and sound effects
├── notes/                   # Development notes and design logs
├── index.html
├── package.json
└── README.md
```

## Roadmap

### Phase 1 — Cinematic Prototype
- [x] Scene 01 script
- [x] Interactive cutscene implementation
- [x] Basic cinematic UI and transitions
- [ ] Refactor scene data into separate files
- [ ] Add sound effects and ambient audio

### Phase 2 — Playable Intro Slice
- [ ] Add explorable Lower District 7 scene
- [ ] Add Vyx movement controls
- [ ] Add interactable scrap piles and signs
- [ ] Add simple objective: collect enough scrap to pay rent
- [ ] Add transition from cutscene to exploration

### Phase 3 — First Encounter Prototype
- [ ] Build one Hex Wraith combat encounter
- [ ] Prototype turn-based or timeline combat
- [ ] Add Vyx basic actions: attack, defend, aether pulse
- [ ] Add Wraith hesitation/glitch mechanic

## Portfolio Notes

This project demonstrates:

- Narrative design
- Worldbuilding
- Character-driven writing
- React component architecture
- UI/UX prototyping
- Interactive storytelling systems
- Game-feel experimentation

## Status

Living prototype. Built as a learning project and portfolio piece.
