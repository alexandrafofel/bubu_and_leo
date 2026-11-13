# Cererea initiala

Promptul original din care a fost facuta prima versiune a jocului, cuvant cu cuvant (fisierul atasat in prima conversatie).

---

Build a video game for two siblings, ages 6 and 8, who will play it together on a Mac using two PlayStation 4 (DualShock 4) controllers. All in-game text and voice-over must be in ROMANIAN.

## The game idea
- Title: "Bubu și Leo: Ouăle de Aur"
- World: "Valea Caldă" — a sunny valley with meadows, a forest, a riverbank, a hill with windmills, and a waterfall. Warm late-afternoon light.
- Player 1 (age 6): BUBU, a round baby dinosaur (triceratops-like), orange with green spots and a tiny red scarf. Power (✕): a big STOMP that shakes the ground, briefly stunning nearby enemies and pulling nearby golden eggs toward him.
- Player 2 (age 8): LEO, a young footballer in a yellow-and-blue kit with a red headband. Power (✕): KICKS a ball that bounces off walls; it knocks enemies away and collects golden eggs it touches. Holding ✕ longer = stronger kick (optional skill for the older child).
- Story: a mischievous crow named CIORI stole the golden eggs from the dinosaur nests and scattered them across the valley, right before the big Sunset Festival. Bubu and Leo must find all the eggs before sunset.
- Collectibles: golden eggs (shared team counter), plus rare shiny bonus stars (3 per level, harder to reach — for the 8-year-old).
- Obstacles: sticky mud puddles (slow you down), rolling pinecones, grumpy sleepy beetles that wake up when you get close, gusts of wind on the windmill hill.
- When a hero is hit: they get dizzy (little circling stars above their head) for 2 seconds and drop 1 egg that can be picked up again. Never a "Game Over".
- Helper surprise: a friendly orange butterfly appears sometimes; touching it gives both heroes a short speed boost and a warm glow.
- Secret: a hidden cave behind the waterfall (level 5) containing a giant golden egg worth a lot of points.
- Final boss: Ciori sits on a huge nest in the tallest tree, throwing pinecones. The heroes must work together: Bubu's stomp shakes the tree so Ciori drops down for a moment, and Leo kicks the ball into the nest. Three successful hits win. Ciori is mischievous, not evil — at the end he apologizes and joins the festival.
- Ending: the Sunset Festival — lanterns, gentle fireworks, one golden egg hatches into a tiny baby dinosaur, and the screen celebrates "Bubu și Leo" by name with the total eggs and stars collected.

## Technical requirements
- One single, fully self-contained HTML file: no external libraries, images or audio files. All graphics drawn in canvas, all sound generated with the Web Audio API. Must run offline in Google Chrome on macOS.
- Controllers via the Gamepad API (standard mapping): left stick or D-pad to move, ✕ for the special power, Options to pause. Stick deadzone at least 0.25.
- Start screen says "Apasă ✕ pe controller" and shows, for each player, whether their controller has been detected. Each player has a clear color shown on screen (Bubu = orange, Leo = yellow-blue).
- Keyboard fallback for testing: Player 1 = WASD + Space, Player 2 = arrow keys + Enter.
- Controller vibration on hits and pickups via vibrationActuator, when available.
- Fullscreen, everything large and readable on a TV.

## Design for their age
- Cooperative, not competitive: all points belong to the team.
- Top-down perspective (or anything that does not require precise jumping). The 6-year-old has never held a controller before.
- On the start screen, each player picks their own difficulty: "Ușor" (slower enemies around them, large pickup radius, shorter dizziness) or "Normal".
- Total play time about 45 minutes: 6 levels of 5–7 minutes each, plus the final boss. Each level introduces something new (meadow → forest with beetles → muddy riverbank → windy hill → waterfall with the secret cave → sunset path → boss).
- In-game text in Romanian, very short, icons instead of sentences where possible. Read each level intro aloud with speechSynthesis using a ro-RO voice if available.
- Save progress in localStorage so we can pause and continue later.

## Visual style: a hand-painted picture book
- Everything should look hand-painted, like a watercolor/gouache illustration from a children's book. No hard black outlines, no pixel art, no flat vector look.
- Warm palette: ochre, peach, terracotta, honey yellow, sage green, dusty pink. Shadows in warm violet or brown, never gray or black.
- Canvas techniques: a noise-generated paper texture over the whole screen, shapes with slightly irregular "wobbly" edges, layered semi-transparent washes like watercolor, soft gradients, warm afternoon lighting, a subtle vignette. The sky slowly shifts toward sunset as the levels progress.
- Characters are round and cute with big friendly eyes, and move softly (gentle breathing when idle, little bounces when walking).
- Warm particles on pickups: pollen, golden sparks, petals.
- Performance: pre-render static backgrounds once to an offscreen canvas so the game runs smoothly at 60 fps on a Mac.

## Sound style: warm and soft
- Generated with Web Audio but warm: sine and triangle waves, low-pass filters, a soft reverb (convolver with a generated impulse response). No square/8-bit sounds, nothing harsh.
- Timbres like kalimba, marimba, wooden chimes and soft flute.
- Calm background music on a pentatonic scale, low volume, different per level; the boss fight is slightly more upbeat but still friendly.
- When a hero is hit: a soft, comical "bonk", never anything scary. Bubu's stomp = a deep soft "thump"; Leo's kick = a warm "pok".
- Separate volume controls for music and sound effects.

## Delivery
- Before the code, give me the level plan in 5–6 lines.
- Put a CONFIG object at the top of the code (names, colors, speeds, number of levels, level duration) so I can easily make changes the kids ask for.
- When done, tell me how to open the file and how to test the controllers.