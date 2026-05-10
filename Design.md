# PiggyRush Design

## 1. Product Summary

PiggyRush is a single-screen, two-player co-op tower-defense game designed for iPad browsers. It is inspired by the readable lane defense, wave pressure, and tactical tower placement of Kingdom Rush, but its signature feature is local simultaneous play: two players share one iPad in landscape orientation, each holding one short edge of the iPad face-to-face and controlling one hero from that edge.

The first playable version is one polished level delivered as a single `index.html`. It uses Phaser 3 for rendering, scaling, game loop, and multi-touch input, with no build step or backend.

### Core Promise

Two players defend the piggy-bank kingdom together: build towers, fight enemies directly with heroes, cast abilities, and survive all waves before the shared base health reaches zero.

### Target Device

- Primary: iPad in landscape orientation.
- Secondary: desktop browser for development and testing.
- Input: multi-touch through Pointer Events.
- Rendering/input engine: Phaser 3, full-screen responsive canvas, multi-pointer touch enabled.

## 2. Design Goals

1. **Immediate shared-screen co-op**
   - Both players can move, fight, and cast abilities at the same time.
   - Controls are separated by short edge so players do not need to cross hands.

2. **Readable tower-defense action**
   - Enemies, towers, heroes, projectiles, health, gold, and wave state must be clear at arm's length.
   - The battlefield should feel busy but never visually noisy.

3. **Single-file portability**
   - The game ships as one HTML file.
   - All art is drawn with Phaser Graphics, text, gradients, and simple shapes.
   - No image, audio, font, or build-time package downloads.

4. **Polished one-level vertical slice**
   - V1 should feel complete, not like a loose engine demo.
   - Include start, pause, restart, victory, defeat, wave flow, tower placement, hero deaths, and revive behavior.

5. **Simple deterministic systems**
   - Use plain JavaScript classes and config objects.
   - Keep balance data centralized so iteration is easy.
   - Avoid complex pathfinding; enemies follow predefined waypoint paths.

## 3. Player Experience

### Screen Layout

The game uses the whole screen in landscape.

- **Left short edge:** Player 1 control zone, rotated to face the left-edge player.
- **Right short edge:** Player 2 control zone, rotated to face the right-edge player.
- **Center battlefield:** shared map, path, towers, enemies, heroes, and base.
- **Top HUD:** shared lives, gold, wave number, pause/restart controls.
- **Left-edge control cluster:** Player 1 virtual joystick and ability button, with labels rotated toward Player 1.
- **Right-edge control cluster:** Player 2 virtual joystick and ability button, with labels rotated toward Player 2.

The left and right edge control regions can be visually hinted with subtle translucent overlays, but the battlefield remains one shared play space. Enemies travel through the center from one long side of the iPad to the opposite long side.

### Control Rules

Each player can only start hero-control gestures from their own half of the screen.

- Player 1 pointer starts on the left half, nearest the left short edge.
- Player 2 pointer starts on the right half, nearest the right short edge.
- Once a pointer is assigned to a player, movement continues even if the finger drifts near the center.
- Ability buttons belong to their player's half.
- Tower build spots can be tapped by either player if the tap is not currently captured by a joystick or ability button.

### Virtual Joystick

Each player has a floating virtual joystick.

- Touch down in the joystick region activates movement.
- Drag direction controls hero movement.
- Drag magnitude controls speed up to the hero's max speed.
- Release stops movement.
- On desktop, keyboard fallback may be provided for testing:
  - Player 1: `WASD`, ability `F`.
  - Player 2: arrow keys, ability `/` or `Enter`.

### Ability Buttons

Each hero has one active ability in V1.

- Ability button shows cooldown progress.
- Disabled state is obvious during cooldown or while the hero is down.
- Ability casts immediately in the hero's facing direction or around the hero, depending on hero type.
- No targeting sub-mode is required for V1; this keeps simultaneous iPad play fast.

## 4. Game Concept

### Setting

The piggy-bank kingdom sits at the end of a winding road. Mischievous raiders are charging down the lane to steal coins. Two heroes defend the road while magical towers guard fixed build spots.

### Win Condition

Survive all scripted waves with base health above zero.

### Lose Condition

Base health reaches zero. Enemies reduce base health when they reach the final waypoint.

### Session Length

V1 should last about 4 to 6 minutes.

### Tone

Bright, playful fantasy arcade:

- Warm grass and stone paths.
- Gold coins, pink piggy-bank base, colorful heroes.
- Enemies are readable cartoon raiders.
- UI uses large labels and high-contrast icons.

## 5. Core Gameplay Loop

1. The level loads into a ready state.
2. Players see base health, gold, wave count, build spots, heroes, and controls.
3. Players build initial towers from shared gold.
4. Players start the wave manually or after a short countdown.
5. Enemies spawn and follow the path.
6. Towers attack automatically.
7. Heroes move freely near the road, attack nearby enemies automatically, and cast abilities on command.
8. Defeated enemies grant shared gold.
9. Between waves, players spend gold on towers and upgrades.
10. The game ends with victory after the final wave or defeat when base health reaches zero.

## 6. Level Design

### Map

V1 has one map: **Coin Meadow Pass**.

The path enters from the top long side, curves through the center, and exits into the piggy-bank base at the bottom long side. Use a predefined waypoint list normalized to a 1000 x 600 world coordinate space.

Example path:

```js
[
  { x: 500, y: -45 },
  { x: 500, y: 95 },
  { x: 406, y: 170 },
  { x: 455, y: 260 },
  { x: 590, y: 330 },
  { x: 545, y: 440 },
  { x: 500, y: 520 },
  { x: 500, y: 645 }
]
```

### Build Spots

Use 8 fixed build spots positioned near, but not on, the path.

Recommended normalized positions:

```js
[
  { x: 350, y: 100 },
  { x: 620, y: 125 },
  { x: 300, y: 245 },
  { x: 690, y: 270 },
  { x: 365, y: 410 },
  { x: 650, y: 455 },
  { x: 500, y: 370 },
  { x: 500, y: 205 }
]
```

Each empty spot can build one tower. Tapping a spot opens a compact radial or three-button menu near the spot. The menu must remain inside the screen bounds.

### Hero Walkable Area

Heroes can move through the battlefield but should remain inside the world bounds with a small margin.

- World bounds: `0 <= x <= 1000`, `70 <= y <= 560`.
- Heroes can overlap the enemy path.
- Heroes cannot leave the screen.
- No collision with towers is required for V1.

## 7. Heroes

Both heroes are active at the start.

### Shared Hero Rules

- Heroes move with joystick input.
- Heroes automatically attack the nearest enemy within range.
- Heroes can be damaged by enemies that pass near them.
- When health reaches zero, the hero is downed and cannot move or attack.
- Downed heroes revive automatically after a short timer at partial health.
- Downed heroes do not cause defeat directly.

### Player 1 Hero: Penny Knight

Role: durable melee defender.

- Health: 160.
- Move speed: 145 world units per second.
- Attack range: 42.
- Attack damage: 18.
- Attack cooldown: 0.6 seconds.
- Ability: **Piggy Slam**
  - Cooldown: 8 seconds.
  - Effect: circular area damage around the hero.
  - Radius: 90.
  - Damage: 45.
  - Bonus: briefly knocks enemies back along the path by a small amount.

### Player 2 Hero: Coin Mage

Role: ranged control and burst.

- Health: 110.
- Move speed: 165 world units per second.
- Attack range: 150.
- Attack damage: 12.
- Attack cooldown: 0.8 seconds.
- Ability: **Gold Spark**
  - Cooldown: 7 seconds.
  - Effect: fires a piercing line or fast projectile toward the nearest enemy.
  - Damage: 35.
  - Bonus: applies a short slow to each enemy hit.

### Revive Rules

- Revive delay: 6 seconds.
- Revive health: 60% max health.
- Revive position: near the piggy-bank base or the hero's last safe position.
- While downed, draw a large revive countdown ring above the hero.

## 8. Towers

Towers are built on fixed spots using shared gold. V1 supports three tower types.

### Archer Tower

Purpose: reliable single-target damage.

- Cost: 70 gold.
- Range: 170.
- Damage: 16.
- Fire rate: 0.55 seconds.
- Projectile: fast arrow.
- Targeting: nearest enemy to base, then nearest to tower as fallback.

### Cannon Tower

Purpose: splash damage against groups.

- Cost: 100 gold.
- Range: 145.
- Damage: 28.
- Fire rate: 1.25 seconds.
- Splash radius: 55.
- Projectile: arcing bomb or slow shell.
- Targeting: cluster-friendly; nearest enemy to base is acceptable for V1.

### Magic Slow Tower

Purpose: control.

- Cost: 85 gold.
- Range: 155.
- Damage: 8.
- Fire rate: 0.9 seconds.
- Slow: 35% for 1.8 seconds.
- Projectile: glowing bolt.

### Tower Upgrades

V1 can support one upgrade level per tower type if time allows. If included:

- Upgrade cost: 70% of base tower cost.
- Increase damage by 35%.
- Increase range by 8%.
- Keep visuals simple: add a crown, glow, or larger roof.

If implementation time is limited, tower upgrades may be deferred, but the design document should still define the intended upgrade path.

## 9. Enemies

Enemies follow the waypoint path from entrance to base.

### Shared Enemy Rules

- Each enemy has health, speed, reward, base damage, and optional traits.
- Enemies take damage from towers, hero attacks, and abilities.
- Enemies can be slowed.
- On death, grant shared gold.
- On reaching the base, reduce base health and despawn.

### Swarm Goblin

Purpose: weak group enemy.

- Health: 32.
- Speed: 58.
- Reward: 8 gold.
- Base damage: 1.

### Sprint Rat

Purpose: fast leak threat.

- Health: 24.
- Speed: 95.
- Reward: 9 gold.
- Base damage: 1.

### Shield Brute

Purpose: durable pressure enemy.

- Health: 130.
- Speed: 38.
- Reward: 22 gold.
- Base damage: 3.

### Coin Thief

Optional advanced V1 enemy.

- Health: 58.
- Speed: 68.
- Reward: 14 gold.
- Base damage: 1.
- Trait: steals 5 gold if it reaches the base, capped so the player cannot go below 0.

## 10. Waves

Use a scripted array inside the HTML. Waves should be deterministic and easy to tune.

Example shape:

```js
const WAVES = [
  {
    name: "First Snatchers",
    groups: [
      { type: "swarm", count: 8, interval: 0.7, delay: 0 }
    ]
  },
  {
    name: "Fast Feet",
    groups: [
      { type: "swarm", count: 8, interval: 0.55, delay: 0 },
      { type: "fast", count: 5, interval: 0.8, delay: 3 }
    ]
  }
];
```

Recommended V1 structure:

1. Small swarm tutorial wave.
2. Mixed swarm plus fast enemies.
3. First brute wave.
4. Larger mixed wave with fast leak pressure.
5. Crossfire mixed wave.
6. Shield-heavy wave.
7. Fast-heavy wave.
8. Thief and brute wave.
9. Large mixed pressure wave.
10. Final Piggy Siege with all enemy types.

Wave pacing:

- Start gold: 220.
- Base health: 25.
- Inter-wave preparation time: manual start button plus optional countdown.
- Final wave should be challenging but winnable with towers and active hero use.

## 11. Economy

The economy is shared by both players.

- Starting gold: 220.
- Gold source: enemy rewards.
- Gold spend: build towers and optional upgrades.
- No selling in V1 unless trivial to implement.
- If two players tap build at the same time, resolve actions sequentially in event order.
- If there is not enough gold, show a small red cost flash and do not build.

## 12. User Interface

### HUD

Top HUD must show:

- Base health with heart or piggy-bank icon.
- Gold count.
- Current wave, total waves, and wave name.
- Pause button.
- Restart button.

The HUD should be large enough for iPad reading and must not cover critical controls.

### Build Menu

When tapping an empty build spot:

- Show Archer, Cannon, and Magic options.
- Include cost on each option.
- Disable options the team cannot afford.
- Tapping outside closes the menu.

When tapping a built tower:

- Show tower type and optional upgrade button.
- If upgrades are deferred, show current tower stats only and close on outside tap.

### Game State Screens

Use lightweight overlays for:

- Start screen.
- Pause screen.
- Victory screen.
- Defeat screen.

Overlays should not navigate away from the page. Restart resets all runtime state.

### Orientation Handling

If the viewport is portrait or too narrow:

- Keep the game running but show a clear rotate-device overlay.
- Do not permanently block desktop testing.
- The overlay should disappear when landscape dimensions return.

## 13. Technical Architecture

The implementation target is one file:

```text
index.html
```

The file contains:

- HTML shell with one Phaser parent container.
- Inline CSS for full-screen layout, touch behavior, and fallback UI.
- Phaser 3 loaded by script tag.
- Inline JavaScript for all game systems.

### Recommended JavaScript Structure

Use small classes and plain configs:

```text
PiggyRushScene
Hero
Enemy
Tower
Projectile
BurstEffect
Beam
FloatingText
UI helpers
```

### PiggyRushScene

Owns global state:

- Phaser scene lifecycle.
- World scale.
- Entities.
- Gold, base health, current wave.
- Game mode: `start`, `playing`, `paused`, `victory`, `defeat`.
- Main loop through Phaser `update`.

Responsibilities:

- Initialize and reset state.
- Update systems in deterministic order.
- Dispatch render calls.
- Handle high-level UI actions.

### Multi-Touch Input

Input uses Phaser Pointer Events and explicitly enables extra pointers:

- `this.input.addPointer(8)`.
- `input.activePointers: 10`.
- Tracks active pointers by pointer id.
- Assigns pointer ownership based on initial screen half.
- Converts screen coordinates to world coordinates.
- Updates each player's joystick vector.
- Detects ability button presses.
- Sends build-spot taps to UI when the pointer is not captured by movement or ability controls.

Important rule: a pointer that starts in one half remains assigned to that player until release.

### Renderer

Rendering uses Phaser Graphics and Text objects. Draw order:

1. Background.
2. Path.
3. Build spots and towers.
4. Enemies.
5. Projectiles and effects.
6. Heroes.
7. Floating text.
8. HUD and controls.
9. Menus and overlays.

Rendering should use normalized world coordinates and convert to screen coordinates through the current scale.

### WaveManager

Owns wave state:

- Current wave index.
- Active spawn timers.
- Whether all groups have spawned.
- Whether wave is cleared.
- Manual start between waves.

### Entity Update Order

Each frame:

1. Process input state.
2. Update wave spawning.
3. Update heroes.
4. Update enemies.
5. Update towers.
6. Update projectiles and effects.
7. Resolve deaths, rewards, leaks, victory, and defeat.
8. Render.

## 14. Rendering Requirements

### Phaser Scaling

Use Phaser Scale `RESIZE` mode so the game canvas fills the iPad viewport and recomputes the world-to-screen transform on resize or rotation. The fixed 1000 x 600 world maps into the available viewport with letterbox-safe scaling.

### Visual Priority

The game must always make these readable:

1. Hero locations and health.
2. Enemy positions and type.
3. Path direction.
4. Build spots and tower type.
5. Base health and gold.
6. Ability cooldowns.

### Style Notes

- Avoid tiny text.
- Avoid dark low-contrast backgrounds.
- Avoid UI covering the joystick areas.
- Use simple shadows and outlines for readability.
- Use color plus shape differences, not color alone.

## 15. Input Edge Cases

Handle these cases explicitly:

- Both players touch at the same time.
- One player drags across the center line.
- A second finger appears on the same short-edge half.
- A pointer is canceled by the browser.
- The window resizes or rotates mid-game.
- A player taps a tower spot while the other is moving.
- Ability button is tapped while the hero is down or on cooldown.

Expected behavior:

- No browser scrolling or zooming during play.
- No player steals the other player's joystick pointer.
- Cancelled pointers clear safely.
- Resize recalculates canvas, controls, and screen-to-world transform.

## 16. Accessibility and Usability

- Use large touch targets: at least 56 CSS pixels for buttons.
- Use clear cooldown arcs or fills.
- Use readable text contrast.
- Avoid relying on audio.
- Provide desktop keyboard fallback for development.
- Keep important UI away from iPad browser safe-area edges using CSS safe-area env variables where useful.

## 17. Performance Requirements

The game should run smoothly on recent iPads.

- Target: 60 FPS.
- Minimum acceptable: stable 30 FPS during final wave.
- Avoid per-frame object churn where easy.
- Keep enemy and projectile counts modest.
- Use simple Canvas shapes instead of heavy effects.
- Keep all collision checks simple radius or distance checks.

## 18. Testing Plan

### Browser Smoke Test

- Open `index.html` directly in Safari or Chrome.
- Confirm the start screen renders.
- Start the game.
- Confirm first wave can begin.

### iPad Multi-Touch Test

- Put one finger on the left joystick and one on the right joystick.
- Move both heroes simultaneously.
- Drag one finger across the center line and confirm ownership remains stable.
- Press both ability buttons near the same time.

### Gameplay Test

- Build each tower type.
- Confirm gold decreases correctly.
- Confirm enemies follow the full path.
- Confirm towers fire at enemies in range.
- Confirm projectiles deal damage.
- Confirm enemies grant gold on death.
- Confirm leaks reduce base health.
- Confirm final wave can trigger victory.
- Confirm base health reaching zero triggers defeat.

### UI Test

- Pause and resume.
- Restart from playing, victory, and defeat states.
- Rotate the iPad to portrait and back.
- Tap outside build menus to close them.
- Confirm UI does not overlap controls on common iPad landscape sizes.

### Desktop Test

- Verify keyboard fallback moves both heroes.
- Verify mouse/touch simulation can build towers and activate menus.
- Resize the browser window and confirm the layout adapts.

## 19. Acceptance Criteria

The V1 implementation is complete when:

- The game is fully playable from a single local `index.html`.
- No network access is required.
- Two players can control separate heroes simultaneously on one iPad.
- Each player is restricted to their half-screen controls.
- The shared co-op tower-defense loop is functional from start to victory or defeat.
- At least three tower types and three enemy types are implemented.
- Ten scripted waves are implemented.
- Pause, restart, victory, and defeat states work.
- The layout remains readable and usable on iPad landscape.

## 20. Future Enhancements

These are intentionally out of scope for V1 but should be compatible with the architecture:

- Multiple levels.
- More heroes.
- More tower upgrades and specializations.
- Boss waves.
- Local difficulty settings.
- Sound effects and music generated or embedded as data.
- Persistent high score in `localStorage`.
- Better art assets if the single-file constraint is relaxed.
- Online co-op is explicitly out of scope for this design.
