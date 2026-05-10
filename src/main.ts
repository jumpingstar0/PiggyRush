import Phaser from "phaser";

type GameState = "select" | "ready" | "playing" | "paused" | "victory" | "defeat";
type TowerKey = "archer" | "cannon" | "magic";
type EnemyKey = "swarm" | "fast" | "brute" | "thief";
type AbilityType = "slam" | "spark" | "trap";
type AttackStyle = "melee" | "projectile";

interface Point {
  x: number;
  y: number;
}

interface LevelConfig {
  id: string;
  name: string;
  short: string;
  description: string;
  path: Point[];
  buildSpots: Point[];
  heroStarts: [Point, Point];
  theme: {
    top: number;
    bottom: number;
    grassA: number;
    grassB: number;
    pathOuter: number;
    pathMid: number;
    pathInner: number;
  };
}

interface DifficultyConfig {
  id: string;
  name: string;
  description: string;
  startGold: number;
  baseHealth: number;
  enemyHealth: number;
  enemySpeed: number;
  enemyReward: number;
  waveClearBonus: number;
}

interface HeroConfig {
  id: string;
  name: string;
  role: string;
  color: number;
  trim: number;
  maxHealth: number;
  speed: number;
  attackRange: number;
  attackDamage: number;
  attackCooldown: number;
  attackStyle: AttackStyle;
  abilityName: string;
  abilityShort: string;
  abilityCooldown: number;
  abilityType: AbilityType;
}

interface TowerConfig {
  key: TowerKey;
  name: string;
  short: string;
  cost: number;
  range: number;
  damage: number;
  cooldown: number;
  projectileSpeed: number;
  color: number;
  dark: number;
  splash: number;
  slow: number;
  slowDuration: number;
}

interface EnemyConfig {
  key: EnemyKey;
  name: string;
  maxHealth: number;
  speed: number;
  reward: number;
  baseDamage: number;
  radius: number;
  color: number;
  dark: number;
  stealGold?: number;
}

interface WaveGroup {
  type: EnemyKey;
  count: number;
  interval: number;
  delay: number;
}

interface Wave {
  name: string;
  groups: WaveGroup[];
}

const WORLD = { width: 1000, height: 600, heroMinY: 58, heroMaxY: 548 };
const UI = { joystickRadius: 66, joystickKnob: 26, abilityRadius: 42, spotRadius: 26 };

const LEVELS: LevelConfig[] = [
  {
    id: "meadow",
    name: "Coin Meadow Pass",
    short: "Meadow",
    description: "Readable bends and clean first-run tower spots.",
    path: [
      { x: 500, y: -45 },
      { x: 500, y: 95 },
      { x: 406, y: 170 },
      { x: 455, y: 260 },
      { x: 590, y: 330 },
      { x: 545, y: 440 },
      { x: 500, y: 520 },
      { x: 500, y: 645 }
    ],
    buildSpots: [
      { x: 350, y: 100 },
      { x: 620, y: 125 },
      { x: 300, y: 245 },
      { x: 690, y: 270 },
      { x: 365, y: 410 },
      { x: 650, y: 455 },
      { x: 500, y: 370 },
      { x: 500, y: 205 }
    ],
    heroStarts: [{ x: 210, y: 330 }, { x: 790, y: 270 }],
    theme: {
      top: 0x9ddf67,
      bottom: 0x56ad4d,
      grassA: 0x2e7f34,
      grassB: 0xfff7d4,
      pathOuter: 0x8f6237,
      pathMid: 0xd8a05c,
      pathInner: 0xefc680
    }
  },
  {
    id: "market",
    name: "Twisty Market Maze",
    short: "Market",
    description: "Longer center route with sharp turns and split coverage.",
    path: [
      { x: 488, y: -48 },
      { x: 488, y: 68 },
      { x: 338, y: 105 },
      { x: 284, y: 184 },
      { x: 416, y: 232 },
      { x: 610, y: 198 },
      { x: 724, y: 270 },
      { x: 612, y: 348 },
      { x: 392, y: 326 },
      { x: 276, y: 402 },
      { x: 430, y: 486 },
      { x: 594, y: 446 },
      { x: 510, y: 548 },
      { x: 510, y: 648 }
    ],
    buildSpots: [
      { x: 355, y: 64 },
      { x: 612, y: 92 },
      { x: 230, y: 258 },
      { x: 508, y: 155 },
      { x: 782, y: 204 },
      { x: 720, y: 392 },
      { x: 500, y: 292 },
      { x: 338, y: 506 },
      { x: 666, y: 518 },
      { x: 222, y: 430 }
    ],
    heroStarts: [{ x: 170, y: 344 }, { x: 830, y: 304 }],
    theme: {
      top: 0x88d67c,
      bottom: 0x4d9d5f,
      grassA: 0x237251,
      grassB: 0xf5df9b,
      pathOuter: 0x725037,
      pathMid: 0xb98852,
      pathInner: 0xf1cf8d
    }
  },
  {
    id: "bridge",
    name: "Vault Bridge Run",
    short: "Bridge",
    description: "Diagonal pressure with strong late-path tower positions.",
    path: [
      { x: 190, y: -45 },
      { x: 260, y: 94 },
      { x: 420, y: 152 },
      { x: 640, y: 188 },
      { x: 780, y: 276 },
      { x: 700, y: 385 },
      { x: 536, y: 420 },
      { x: 420, y: 492 },
      { x: 500, y: 548 },
      { x: 500, y: 648 }
    ],
    buildSpots: [
      { x: 142, y: 118 },
      { x: 350, y: 78 },
      { x: 512, y: 238 },
      { x: 710, y: 122 },
      { x: 850, y: 342 },
      { x: 620, y: 480 },
      { x: 356, y: 394 },
      { x: 498, y: 344 },
      { x: 256, y: 520 }
    ],
    heroStarts: [{ x: 190, y: 370 }, { x: 800, y: 330 }],
    theme: {
      top: 0xa6d978,
      bottom: 0x5ea266,
      grassA: 0x3f7b44,
      grassB: 0xfff0c2,
      pathOuter: 0x766448,
      pathMid: 0xb4a16f,
      pathInner: 0xe4d598
    }
  }
];

const DIFFICULTIES: DifficultyConfig[] = [
  {
    id: "cozy",
    name: "Cozy",
    description: "More gold, sturdier base, gentler pressure.",
    startGold: 260,
    baseHealth: 32,
    enemyHealth: 0.85,
    enemySpeed: 0.92,
    enemyReward: 1.15,
    waveClearBonus: 45
  },
  {
    id: "normal",
    name: "Normal",
    description: "Default arcade balance for two players.",
    startGold: 220,
    baseHealth: 25,
    enemyHealth: 1,
    enemySpeed: 1,
    enemyReward: 1,
    waveClearBonus: 35
  },
  {
    id: "spicy",
    name: "Spicy",
    description: "Less room for leaks and pricier decisions.",
    startGold: 190,
    baseHealth: 18,
    enemyHealth: 1.18,
    enemySpeed: 1.08,
    enemyReward: 0.9,
    waveClearBonus: 25
  }
];

const HERO_CONFIGS: HeroConfig[] = [
  {
    id: "penny",
    name: "Penny Knight",
    role: "Durable melee defender",
    color: 0xe35858,
    trim: 0xffe08a,
    maxHealth: 160,
    speed: 145,
    attackRange: 48,
    attackDamage: 18,
    attackCooldown: 0.6,
    attackStyle: "melee",
    abilityName: "Piggy Slam",
    abilityShort: "SLAM",
    abilityCooldown: 8,
    abilityType: "slam"
  },
  {
    id: "mage",
    name: "Coin Mage",
    role: "Ranged burst and control",
    color: 0x4f83df,
    trim: 0xf7d35a,
    maxHealth: 110,
    speed: 165,
    attackRange: 150,
    attackDamage: 12,
    attackCooldown: 0.8,
    attackStyle: "projectile",
    abilityName: "Gold Spark",
    abilityShort: "SPARK",
    abilityCooldown: 7,
    abilityType: "spark"
  },
  {
    id: "ranger",
    name: "Bacon Ranger",
    role: "Mobile skirmisher and traps",
    color: 0x31a06a,
    trim: 0xffc15f,
    maxHealth: 125,
    speed: 178,
    attackRange: 130,
    attackDamage: 10,
    attackCooldown: 0.45,
    attackStyle: "projectile",
    abilityName: "Truffle Trap",
    abilityShort: "TRAP",
    abilityCooldown: 9,
    abilityType: "trap"
  }
];

const TOWER_TYPES: Record<TowerKey, TowerConfig> = {
  archer: { key: "archer", name: "Archer", short: "AR", cost: 70, range: 170, damage: 16, cooldown: 0.55, projectileSpeed: 600, color: 0x3a9b4b, dark: 0x206330, splash: 0, slow: 0, slowDuration: 0 },
  cannon: { key: "cannon", name: "Cannon", short: "CN", cost: 100, range: 145, damage: 28, cooldown: 1.25, projectileSpeed: 410, color: 0xc46c3b, dark: 0x7c3b22, splash: 55, slow: 0, slowDuration: 0 },
  magic: { key: "magic", name: "Magic", short: "MG", cost: 85, range: 155, damage: 8, cooldown: 0.9, projectileSpeed: 520, color: 0x4d8ed8, dark: 0x24538e, splash: 0, slow: 0.35, slowDuration: 1.8 }
};

const ENEMY_TYPES: Record<EnemyKey, EnemyConfig> = {
  swarm: { key: "swarm", name: "Swarm Raider", maxHealth: 32, speed: 58, reward: 8, baseDamage: 1, radius: 14, color: 0x6ec052, dark: 0x315f29 },
  fast: { key: "fast", name: "Sprint Raider", maxHealth: 24, speed: 95, reward: 9, baseDamage: 1, radius: 12, color: 0xd89245, dark: 0x7b481f },
  brute: { key: "brute", name: "Shield Brute", maxHealth: 130, speed: 38, reward: 22, baseDamage: 3, radius: 20, color: 0x6f7582, dark: 0x343945 },
  thief: { key: "thief", name: "Coin Thief", maxHealth: 58, speed: 68, reward: 14, baseDamage: 1, stealGold: 5, radius: 14, color: 0xc9b44b, dark: 0x786b25 }
};

const WAVES: Wave[] = [
  { name: "First Snatchers", groups: [{ type: "swarm", count: 8, interval: 0.72, delay: 0.2 }] },
  { name: "Fast Feet", groups: [{ type: "swarm", count: 9, interval: 0.58, delay: 0 }, { type: "fast", count: 5, interval: 0.85, delay: 3.0 }] },
  { name: "Shield Push", groups: [{ type: "brute", count: 3, interval: 1.75, delay: 0.3 }, { type: "swarm", count: 11, interval: 0.5, delay: 2.0 }] },
  { name: "Coin Grab", groups: [{ type: "thief", count: 5, interval: 0.85, delay: 0.1 }, { type: "fast", count: 8, interval: 0.62, delay: 2.2 }, { type: "swarm", count: 12, interval: 0.45, delay: 4.6 }] },
  { name: "Crossfire", groups: [{ type: "swarm", count: 16, interval: 0.42, delay: 0.2 }, { type: "fast", count: 8, interval: 0.58, delay: 2.8 }, { type: "brute", count: 3, interval: 1.3, delay: 5.4 }] },
  { name: "Shield Parade", groups: [{ type: "brute", count: 5, interval: 1.1, delay: 0 }, { type: "thief", count: 5, interval: 0.7, delay: 2.6 }, { type: "swarm", count: 14, interval: 0.36, delay: 4.8 }] },
  { name: "Rapid River", groups: [{ type: "fast", count: 14, interval: 0.42, delay: 0.1 }, { type: "swarm", count: 18, interval: 0.32, delay: 2.0 }, { type: "brute", count: 3, interval: 1.2, delay: 6.2 }] },
  { name: "Vault Crackers", groups: [{ type: "thief", count: 8, interval: 0.55, delay: 0 }, { type: "brute", count: 6, interval: 1.0, delay: 1.8 }, { type: "fast", count: 10, interval: 0.48, delay: 5.0 }] },
  { name: "Double Trouble", groups: [{ type: "swarm", count: 24, interval: 0.28, delay: 0 }, { type: "fast", count: 12, interval: 0.4, delay: 2.4 }, { type: "thief", count: 8, interval: 0.55, delay: 5.0 }, { type: "brute", count: 5, interval: 1.05, delay: 7.0 }] },
  { name: "Piggy Siege", groups: [{ type: "brute", count: 8, interval: 0.95, delay: 0 }, { type: "swarm", count: 28, interval: 0.25, delay: 0.8 }, { type: "fast", count: 16, interval: 0.36, delay: 4.4 }, { type: "thief", count: 10, interval: 0.5, delay: 7.4 }] }
];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const dist = (a: number, b: number, c: number, d: number) => Math.hypot(a - c, b - d);
const distSq = (a: number, b: number, c: number, d: number) => {
  const dx = a - c;
  const dy = b - d;
  return dx * dx + dy * dy;
};

const byId = <T extends { id: string }>(items: T[], id: string, fallback = items[0]) => items.find((item) => item.id === id) ?? fallback;

class Hero {
  [key: string]: any;

  constructor(config: HeroConfig, playerIndex: number, start: Point) {
    Object.assign(this, config);
    this.playerIndex = playerIndex;
    this.label = `P${playerIndex + 1}`;
    this.x = start.x;
    this.y = start.y;
    this.health = config.maxHealth;
    this.attackTimer = 0;
    this.abilityTimer = 0;
    this.reviveTimer = 0;
    this.down = false;
    this.facing = { x: playerIndex === 0 ? 1 : -1, y: 0 };
    this.hitFlash = 0;
  }

  update(dt: number, scene: PiggyRushScene, vector: Point) {
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    this.abilityTimer = Math.max(0, this.abilityTimer - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);

    if (this.down) {
      this.reviveTimer -= dt;
      if (this.reviveTimer <= 0) {
        this.down = false;
        this.health = Math.round(this.maxHealth * 0.6);
        this.x = clamp(this.x, 420, 580);
        this.y = clamp(this.y, 430, 540);
        scene.addFloatingText("Back in!", this.x, this.y - 38, 0x1f6630, 1.1, 18);
      }
      return;
    }

    const mag = Math.hypot(vector.x, vector.y);
    if (mag > 0.04) {
      this.x += vector.x * this.speed * dt;
      this.y += vector.y * this.speed * dt;
      this.facing = { x: vector.x / mag, y: vector.y / mag };
    }

    this.x = clamp(this.x, 24, WORLD.width - 24);
    this.y = clamp(this.y, WORLD.heroMinY, WORLD.heroMaxY);

    const target = scene.findEnemyInRange(this.x, this.y, this.attackRange);
    if (target && this.attackTimer <= 0) {
      this.attackTimer = this.attackCooldown;
      if (this.attackStyle === "melee") {
        target.takeDamage(this.attackDamage, scene);
        scene.effects.push(new BurstEffect(target.x, target.y, 22, this.trim));
      } else {
        scene.projectiles.push(new Projectile(this.x, this.y - 16, target, 540, this.attackDamage, this.trim, 5, 0, 0, 0));
      }
    }
  }

  damage(amount: number, scene: PiggyRushScene) {
    if (this.down) return;
    this.health -= amount;
    this.hitFlash = 0.16;
    if (this.health <= 0) {
      this.health = 0;
      this.down = true;
      this.reviveTimer = 6;
      scene.addFloatingText(`${this.label} down`, this.x, this.y - 42, 0xb22a2a, 1.2, 18);
    }
  }

  cast(scene: PiggyRushScene) {
    if (this.down || this.abilityTimer > 0) return false;
    this.abilityTimer = this.abilityCooldown;

    if (this.abilityType === "slam") {
      for (const enemy of scene.enemies) {
        if (dist(this.x, this.y, enemy.x, enemy.y) <= 90) {
          enemy.takeDamage(45, scene);
          enemy.pathDistance = Math.max(0, enemy.pathDistance - 18);
          enemy.syncToPath(scene.pathSegments);
        }
      }
      scene.effects.push(new BurstEffect(this.x, this.y, 90, 0xffd157, 0.38));
      scene.addFloatingText(this.abilityName, this.x, this.y - 56, 0x7b3b20, 1.1, 18);
    } else if (this.abilityType === "spark") {
      const target = scene.findEnemyInRange(this.x, this.y, 420) || scene.enemies[0];
      if (!target) return true;
      const mag = Math.hypot(target.x - this.x, target.y - this.y) || 1;
      const dir = { x: (target.x - this.x) / mag, y: (target.y - this.y) / mag };
      scene.beams.push(new Beam(this.x, this.y, dir.x, dir.y, 440, 0.22));
      for (const enemy of scene.enemies) {
        const along = (enemy.x - this.x) * dir.x + (enemy.y - this.y) * dir.y;
        if (along < 0 || along > 440) continue;
        const px = this.x + dir.x * along;
        const py = this.y + dir.y * along;
        if (dist(enemy.x, enemy.y, px, py) <= enemy.radius + 28) {
          enemy.takeDamage(35, scene);
          enemy.applySlow(0.45, 2.2);
        }
      }
      scene.addFloatingText(this.abilityName, this.x, this.y - 56, 0x735f08, 1.1, 18);
    } else {
      scene.traps.push(new Trap(this.x, this.y));
      scene.effects.push(new BurstEffect(this.x, this.y, 82, 0x55c987, 0.3));
      scene.addFloatingText(this.abilityName, this.x, this.y - 56, 0x1f6630, 1.1, 18);
    }

    return true;
  }
}

class Enemy {
  [key: string]: any;

  constructor(typeKey: EnemyKey, scene: PiggyRushScene) {
    const config = ENEMY_TYPES[typeKey];
    Object.assign(this, config);
    this.typeKey = typeKey;
    this.maxHealth = Math.max(1, Math.round(config.maxHealth * scene.difficulty.enemyHealth));
    this.health = this.maxHealth;
    this.speed = config.speed * scene.difficulty.enemySpeed;
    this.reward = Math.max(1, Math.round(config.reward * scene.difficulty.enemyReward));
    this.pathDistance = 0;
    this.segmentIndex = 0;
    this.x = scene.level.path[0].x;
    this.y = scene.level.path[0].y;
    this.dead = false;
    this.leaked = false;
    this.slowTimer = 0;
    this.slowAmount = 0;
    this.hitFlash = 0;
    this.biteTimer = 0.4 + Math.random() * 0.6;
    this.syncToPath(scene.pathSegments);
  }

  syncToPath(segments: any[]) {
    let left = this.pathDistance;
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (left <= segment.length) {
        const t = segment.length ? left / segment.length : 0;
        this.x = Phaser.Math.Linear(segment.a.x, segment.b.x, t);
        this.y = Phaser.Math.Linear(segment.a.y, segment.b.y, t);
        this.segmentIndex = i;
        return;
      }
      left -= segment.length;
    }
    const last = segments[segments.length - 1];
    this.x = last.b.x;
    this.y = last.b.y;
    this.segmentIndex = segments.length - 1;
  }

  update(dt: number, scene: PiggyRushScene) {
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.slowTimer = Math.max(0, this.slowTimer - dt);
    this.biteTimer -= dt;
    this.pathDistance += this.speed * (this.slowTimer > 0 ? 1 - this.slowAmount : 1) * dt;
    this.syncToPath(scene.pathSegments);
    for (const hero of scene.heroes) {
      if (!hero.down && dist(this.x, this.y, hero.x, hero.y) < this.radius + 24 && this.biteTimer <= 0) {
        hero.damage(this.typeKey === "brute" ? 12 : 7, scene);
        this.biteTimer = this.typeKey === "brute" ? 1.1 : 0.9;
      }
    }
    if (this.pathDistance >= scene.pathLength) this.leak(scene);
  }

  takeDamage(amount: number, scene: PiggyRushScene) {
    if (this.dead || this.leaked) return;
    this.health -= amount;
    this.hitFlash = 0.12;
    if (this.health <= 0) {
      this.dead = true;
      scene.gold += this.reward;
      scene.effects.push(new BurstEffect(this.x, this.y, this.radius + 16, 0xffd15c, 0.28));
      scene.addFloatingText(`+${this.reward}`, this.x, this.y - 22, 0x7b5600, 0.75, 15);
    }
  }

  applySlow(amount: number, duration: number) {
    this.slowAmount = Math.max(this.slowAmount, amount);
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  leak(scene: PiggyRushScene) {
    if (this.leaked) return;
    this.leaked = true;
    scene.baseHealth -= this.baseDamage;
    if (this.stealGold) scene.gold = Math.max(0, scene.gold - this.stealGold);
    scene.effects.push(new BurstEffect(scene.basePoint.x, scene.basePoint.y, 44, 0xff9c9c, 0.35));
    scene.addFloatingText(`-${this.baseDamage} base`, scene.basePoint.x, scene.basePoint.y - 48, 0xa32323, 0.9, 16);
    if (scene.baseHealth <= 0) {
      scene.baseHealth = 0;
      scene.state = "defeat";
    }
  }
}

class Tower {
  [key: string]: any;

  constructor(typeKey: TowerKey, spotIndex: number, scene: PiggyRushScene) {
    this.typeKey = typeKey;
    this.config = TOWER_TYPES[typeKey];
    this.spotIndex = spotIndex;
    this.x = scene.level.buildSpots[spotIndex].x;
    this.y = scene.level.buildSpots[spotIndex].y;
    this.cooldown = 0.2;
    this.level = 1;
  }

  range() {
    return this.config.range * (this.level > 1 ? 1.08 : 1);
  }

  damage() {
    return this.config.damage * (this.level > 1 ? 1.35 : 1);
  }

  upgradeCost() {
    return Math.round(this.config.cost * 0.7);
  }

  update(dt: number, scene: PiggyRushScene) {
    this.cooldown -= dt;
    if (this.cooldown > 0) return;
    const target = scene.findTowerTarget(this.x, this.y, this.range());
    if (!target) return;
    this.cooldown = this.config.cooldown;
    scene.projectiles.push(new Projectile(this.x, this.y - 24, target, this.config.projectileSpeed, this.damage(), this.config.color, this.typeKey === "cannon" ? 8 : 5, this.config.splash, this.config.slow, this.config.slowDuration));
  }
}

class Projectile {
  [key: string]: any;

  constructor(x: number, y: number, target: Enemy, speed: number, damage: number, color: number, radius: number, splash: number, slow: number, slowDuration: number) {
    Object.assign(this, { x, y, target, speed, damage, color, radius, splash, slow, slowDuration });
    this.prevX = x;
    this.prevY = y;
    this.dead = false;
  }

  update(dt: number, scene: PiggyRushScene) {
    if (!this.target || this.target.dead || this.target.leaked) {
      this.dead = true;
      return;
    }
    this.prevX = this.x;
    this.prevY = this.y;
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const mag = Math.hypot(dx, dy) || 1;
    const step = this.speed * dt;
    if (step >= mag) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.hit(scene);
    } else {
      this.x += dx / mag * step;
      this.y += dy / mag * step;
    }
  }

  hit(scene: PiggyRushScene) {
    if (this.splash > 0) {
      for (const enemy of scene.enemies) {
        if (!enemy.dead && !enemy.leaked && dist(this.x, this.y, enemy.x, enemy.y) <= this.splash) enemy.takeDamage(this.damage, scene);
      }
      scene.effects.push(new BurstEffect(this.x, this.y, this.splash, 0xe79855, 0.32));
    } else {
      this.target.takeDamage(this.damage, scene);
      if (this.slow > 0) this.target.applySlow(this.slow, this.slowDuration);
      scene.effects.push(new BurstEffect(this.x, this.y, 20, this.color, 0.18));
    }
    this.dead = true;
  }
}

class Trap {
  [key: string]: any;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 82;
    this.duration = 4.5;
    this.life = this.duration;
    this.dead = false;
    this.hit = new Set<Enemy>();
  }

  update(dt: number, scene: PiggyRushScene) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }
    for (const enemy of scene.enemies) {
      if (enemy.dead || enemy.leaked || this.hit.has(enemy)) continue;
      if (dist(this.x, this.y, enemy.x, enemy.y) <= this.radius + enemy.radius) {
        this.hit.add(enemy);
        enemy.takeDamage(26, scene);
        enemy.applySlow(0.62, 2.4);
        scene.effects.push(new BurstEffect(enemy.x, enemy.y, 38, 0x55c987, 0.24));
      }
    }
  }
}

class BurstEffect {
  [key: string]: any;

  constructor(x: number, y: number, radius: number, color: number, duration = 0.25) {
    Object.assign(this, { x, y, radius, color, duration, life: duration, dead: false });
  }

  update(dt: number) {
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }
}

class Beam {
  [key: string]: any;

  constructor(x: number, y: number, dx: number, dy: number, length: number, duration: number) {
    Object.assign(this, { x, y, dx, dy, length, duration, life: duration, dead: false });
  }

  update(dt: number) {
    this.life -= dt;
    if (this.life <= 0) this.dead = true;
  }
}

class PiggyRushScene extends Phaser.Scene {
  [key: string]: any;

  constructor() {
    super("PiggyRush");
  }

  create() {
    this.g = this.add.graphics();
    this.selectedHeroIds = ["penny", "mage"];
    this.selectedLevelId = "meadow";
    this.selectedDifficultyId = "normal";
    this.state = "select";
    this.input.addPointer(8);
    this.input.topOnly = false;
    this.scale.on("resize", () => this.onResize());
    this.onResize();
    this.computePath();
    this.createTextObjects();
    this.installInput();
    this.prepareEmptyRuntime();
    activeScene = this;
    buildSetupUi(this);
  }

  get level(): LevelConfig {
    return byId(LEVELS, this.selectedLevelId);
  }

  get difficulty(): DifficultyConfig {
    return byId(DIFFICULTIES, this.selectedDifficultyId, DIFFICULTIES[1]);
  }

  get basePoint(): Point {
    const path = this.level.path;
    return path[path.length - 2] ?? { x: 500, y: 548 };
  }

  prepareEmptyRuntime() {
    this.gold = 0;
    this.baseHealth = 0;
    this.waveIndex = 0;
    this.waveActive = false;
    this.waveGroups = [];
    this.waveClearDelay = 0;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.traps = [];
    this.effects = [];
    this.beams = [];
    this.heroes = [];
    this.selectedSpot = null;
    this.closeMenu();
    this.clearFloaters();
  }

  createTextObjects() {
    const font = '"Trebuchet MS", Arial, sans-serif';
    this.texts = {
      base: this.add.text(0, 0, "", { fontFamily: font, fontSize: "18px", fontStyle: "bold", color: "#9b3246" }).setOrigin(0.5),
      gold: this.add.text(0, 0, "", { fontFamily: font, fontSize: "18px", fontStyle: "bold", color: "#85600a" }).setOrigin(0.5),
      wave: this.add.text(0, 0, "", { fontFamily: font, fontSize: "18px", fontStyle: "bold", color: "#274f2e" }).setOrigin(0.5),
      waveBtn: this.add.text(0, 0, "", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff8dc" }).setOrigin(0.5),
      pauseBtn: this.add.text(0, 0, "", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff8dc" }).setOrigin(0.5),
      restartBtn: this.add.text(0, 0, "Restart", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff8dc" }).setOrigin(0.5),
      setupBtn: this.add.text(0, 0, "Setup", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff8dc" }).setOrigin(0.5),
      p1Label: this.add.text(0, 0, "", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff9df", stroke: "#3a2a1c", strokeThickness: 3 }).setOrigin(0.5).setAngle(90),
      p2Label: this.add.text(0, 0, "", { fontFamily: font, fontSize: "15px", fontStyle: "bold", color: "#fff9df", stroke: "#3a2a1c", strokeThickness: 3 }).setOrigin(0.5).setAngle(-90),
      p1Ability: this.add.text(0, 0, "", { fontFamily: font, fontSize: "13px", fontStyle: "bold", color: "#fff9df" }).setOrigin(0.5).setAngle(90),
      p2Ability: this.add.text(0, 0, "", { fontFamily: font, fontSize: "13px", fontStyle: "bold", color: "#fff9df" }).setOrigin(0.5).setAngle(-90),
      title: this.add.text(0, 0, "", { fontFamily: font, fontSize: "42px", fontStyle: "bold", color: "#573b22" }).setOrigin(0.5),
      sub1: this.add.text(0, 0, "", { fontFamily: font, fontSize: "20px", fontStyle: "bold", color: "#38512a" }).setOrigin(0.5),
      sub2: this.add.text(0, 0, "", { fontFamily: font, fontSize: "16px", fontStyle: "bold", color: "#6a5739" }).setOrigin(0.5),
      sub3: this.add.text(0, 0, "", { fontFamily: font, fontSize: "16px", fontStyle: "bold", color: "#6a5739" }).setOrigin(0.5),
      sub4: this.add.text(0, 0, "", { fontFamily: font, fontSize: "16px", fontStyle: "bold", color: "#6a5739" }).setOrigin(0.5)
    };
    this.menuTexts = [];
    this.floaters = [];
  }

  installInput() {
    this.activePointers = new Map();
    this.joysticks = [
      { active: false, pointerId: null, vector: { x: 0, y: 0 }, start: { x: 0, y: 0 }, current: { x: 0, y: 0 } },
      { active: false, pointerId: null, vector: { x: 0, y: 0 }, start: { x: 0, y: 0 }, current: { x: 0, y: 0 } }
    ];
    this.keys = new Set<string>();
    this.input.on("pointerdown", (pointer: any) => this.pointerDown(pointer));
    this.input.on("pointermove", (pointer: any) => this.pointerMove(pointer));
    this.input.on("pointerup", (pointer: any) => this.pointerUp(pointer));
    this.input.on("pointerupoutside", (pointer: any) => this.pointerUp(pointer));
    this.input.on("pointercancel", (pointer: any) => this.releasePointer(this.pointerId(pointer)));
    window.addEventListener("pointercancel", (event) => this.releasePointer(event.pointerId));
    window.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"].includes(event.key)) event.preventDefault();
      if (event.key === "p" || event.key === "P") this.togglePause();
      if (event.key === "r" || event.key === "R") this.resetRun();
      if (event.key === "f" || event.key === "F") this.tryHeroAbility(0);
      if (event.key === "/" || event.key === "Enter") this.tryHeroAbility(1);
      if (event.key === " ") this.startWave();
      this.keys.add(event.key);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.key));
  }

  onResize() {
    this.gameWidth = this.scale.width || window.innerWidth;
    this.gameHeight = this.scale.height || window.innerHeight;
    this.viewScale = Math.min(this.gameWidth / WORLD.width, this.gameHeight / WORLD.height);
    this.viewX = (this.gameWidth - WORLD.width * this.viewScale) / 2;
    this.viewY = (this.gameHeight - WORLD.height * this.viewScale) / 2;
  }

  applySelection(heroIds: [string, string], levelId: string, difficultyId: string) {
    this.selectedHeroIds = heroIds;
    this.selectedLevelId = levelId;
    this.selectedDifficultyId = difficultyId;
    this.resetRun();
  }

  enterSelection() {
    this.state = "select";
    this.prepareEmptyRuntime();
  }

  computePath() {
    this.pathSegments = [];
    this.pathLength = 0;
    const path = this.level.path;
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const length = dist(a.x, a.y, b.x, b.y);
      this.pathSegments.push({ a, b, length, start: this.pathLength });
      this.pathLength += length;
    }
  }

  resetRun() {
    this.computePath();
    this.state = "ready";
    this.gold = this.difficulty.startGold;
    this.baseHealth = this.difficulty.baseHealth;
    this.waveIndex = 0;
    this.waveActive = false;
    this.waveGroups = [];
    this.waveClearDelay = 0;
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.traps = [];
    this.effects = [];
    this.beams = [];
    this.heroes = this.selectedHeroIds.map((id: string, index: number) => new Hero(byId(HERO_CONFIGS, id), index, this.level.heroStarts[index]));
    this.selectedSpot = null;
    this.closeMenu();
    this.clearFloaters();
    this.addFloatingText("Tap Start", WORLD.width / 2, 185, 0x375d2a, 1.6, 24);
  }

  sx(x: number) {
    return this.viewX + x * this.viewScale;
  }

  sy(y: number) {
    return this.viewY + y * this.viewScale;
  }

  sr(r: number) {
    return r * this.viewScale;
  }

  sw(point: Point) {
    return { x: (point.x - this.viewX) / this.viewScale, y: (point.y - this.viewY) / this.viewScale };
  }

  controlRects() {
    const midY = this.gameHeight / 2;
    const edge = Math.max(86, Math.min(112, this.gameWidth * 0.105));
    const offset = Math.max(92, Math.min(138, this.gameHeight * 0.2));
    return [
      { joystick: { x: edge, y: midY + offset, r: UI.joystickRadius }, ability: { x: edge, y: midY - offset * 0.6, r: UI.abilityRadius }, rotation: 90 },
      { joystick: { x: this.gameWidth - edge, y: midY - offset, r: UI.joystickRadius }, ability: { x: this.gameWidth - edge, y: midY + offset * 0.6, r: UI.abilityRadius }, rotation: -90 }
    ];
  }

  topButtons() {
    const y = 12;
    const right = this.gameWidth - 16;
    return {
      restart: { x: right - 86, y, w: 86, h: 48 },
      pause: { x: right - 180, y, w: 86, h: 48 },
      wave: { x: right - 310, y, w: 122, h: 48 },
      setup: { x: right - 404, y, w: 86, h: 48 }
    };
  }

  hudWaveRect() {
    const buttons = this.topButtons();
    const x = 276;
    const right = buttons.setup.x - 12;
    const w = Math.max(180, right - x);
    return { x, y: 12, w, h: 48 };
  }

  pointerId(pointer: any) {
    return pointer.pointerId || pointer.id;
  }

  hitCircle(point: Point, circle: any) {
    return distSq(point.x, point.y, circle.x, circle.y) <= circle.r * circle.r;
  }

  hitRect(point: Point, rect: any) {
    return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
  }

  pointerDown(pointer: any) {
    if (this.state === "select") return;
    const id = this.pointerId(pointer);
    const point = { x: pointer.x, y: pointer.y };
    if (this.handleTopButton(point)) {
      this.activePointers.set(id, { type: "button", start: point, last: point, moved: false });
      return;
    }
    const player = point.x < this.gameWidth / 2 ? 0 : 1;
    const controls = this.controlRects()[player];
    if (this.heroes[player] && this.hitCircle(point, controls.ability)) {
      this.tryHeroAbility(player);
      this.activePointers.set(id, { type: "ability", player, start: point, last: point, moved: false });
      return;
    }
    if (this.hitCircle(point, controls.joystick) && !this.joysticks[player].active) {
      const joy = this.joysticks[player];
      joy.active = true;
      joy.pointerId = id;
      joy.start = { x: controls.joystick.x, y: controls.joystick.y };
      joy.current = point;
      this.updateJoystick(player, point);
      this.activePointers.set(id, { type: "joystick", player, start: point, last: point, moved: false });
      return;
    }
    this.activePointers.set(id, { type: "tap", player, start: point, last: point, moved: false });
  }

  pointerMove(pointer: any) {
    const id = this.pointerId(pointer);
    const state = this.activePointers.get(id);
    if (!state) return;
    const point = { x: pointer.x, y: pointer.y };
    state.last = point;
    if (dist(state.start.x, state.start.y, point.x, point.y) > 10) state.moved = true;
    if (state.type === "joystick") this.updateJoystick(state.player, point);
  }

  pointerUp(pointer: any) {
    const id = this.pointerId(pointer);
    this.releasePointer(id, pointer);
  }

  releasePointer(id: number, pointer: any = null) {
    const state = this.activePointers.get(id);
    if (!state) return;
    if (state.type === "joystick") {
      const joy = this.joysticks[state.player];
      joy.active = false;
      joy.pointerId = null;
      joy.vector = { x: 0, y: 0 };
    } else if (pointer && state.type === "tap" && !state.moved) {
      this.handleWorldTap(state.last);
    }
    this.activePointers.delete(id);
  }

  updateJoystick(player: number, point: Point) {
    const joy = this.joysticks[player];
    const dx = point.x - joy.start.x;
    const dy = point.y - joy.start.y;
    const mag = Math.hypot(dx, dy);
    const max = UI.joystickRadius;
    const scale = mag > max ? max / mag : 1;
    joy.current = { x: joy.start.x + dx * scale, y: joy.start.y + dy * scale };
    joy.vector = { x: mag > 4 ? (dx * scale) / max : 0, y: mag > 4 ? (dy * scale) / max : 0 };
  }

  heroVector(player: number) {
    const key = { x: 0, y: 0 };
    if (player === 0) {
      if (this.keys.has("a") || this.keys.has("A")) key.x -= 1;
      if (this.keys.has("d") || this.keys.has("D")) key.x += 1;
      if (this.keys.has("w") || this.keys.has("W")) key.y -= 1;
      if (this.keys.has("s") || this.keys.has("S")) key.y += 1;
    } else {
      if (this.keys.has("ArrowLeft")) key.x -= 1;
      if (this.keys.has("ArrowRight")) key.x += 1;
      if (this.keys.has("ArrowUp")) key.y -= 1;
      if (this.keys.has("ArrowDown")) key.y += 1;
    }
    const mag = Math.hypot(key.x, key.y);
    if (mag > 0) return { x: key.x / mag, y: key.y / mag };
    return this.joysticks[player].vector;
  }

  handleTopButton(point: Point) {
    const buttons = this.topButtons();
    if (this.hitRect(point, buttons.setup)) {
      showSetupScreen();
      return true;
    }
    if (this.hitRect(point, buttons.restart)) {
      this.resetRun();
      return true;
    }
    if (this.hitRect(point, buttons.pause)) {
      this.togglePause();
      return true;
    }
    if (this.hitRect(point, buttons.wave)) {
      this.startWave();
      return true;
    }
    if (this.state === "ready" || this.state === "victory" || this.state === "defeat") {
      const box = this.overlayBox();
      if (this.hitRect(point, box)) {
        if (this.state === "ready") this.startWave();
        else this.resetRun();
        return true;
      }
    }
    return false;
  }

  handleWorldTap(point: Point) {
    if (this.state === "select" || this.state === "paused") return;
    if (this.state === "ready") {
      const world = this.sw(point);
      if (!this.tryBuildSpotTap(world)) this.startWave();
      return;
    }
    if (this.state === "victory" || this.state === "defeat") {
      this.resetRun();
      return;
    }
    if (this.buildMenu) {
      for (const item of this.buildMenu.items) {
        if (this.hitRect(point, item.rect)) {
          if (item.enabled) item.action();
          else {
            const world = this.sw(point);
            this.addFloatingText("Need gold", world.x, world.y, 0xb22a2a, 0.8, 16);
          }
          return;
        }
      }
    }
    const world = this.sw(point);
    if (!this.tryBuildSpotTap(world)) this.closeMenu();
  }

  tryBuildSpotTap(world: Point) {
    let spotIndex = -1;
    for (let i = 0; i < this.level.buildSpots.length; i++) {
      const spot = this.level.buildSpots[i];
      if (dist(world.x, world.y, spot.x, spot.y) <= 38) {
        spotIndex = i;
        break;
      }
    }
    if (spotIndex >= 0) {
      this.openBuildMenu(spotIndex);
      return true;
    }
    return false;
  }

  openBuildMenu(spotIndex: number) {
    this.closeMenu();
    this.selectedSpot = spotIndex;
    const existing = this.towers.find((t: Tower) => t.spotIndex === spotIndex);
    const spot = this.level.buildSpots[spotIndex];
    const spotScreen = { x: this.sx(spot.x), y: this.sy(spot.y) };
    const w = existing ? 190 : 286;
    const h = existing ? 118 : 124;
    const x = clamp(spotScreen.x - w / 2, 10, this.gameWidth - w - 10);
    const y = clamp(spotScreen.y - h - 36, 74, this.gameHeight - h - 18);
    const items: any[] = [];
    if (existing) {
      const cost = existing.upgradeCost();
      items.push({
        rect: { x: x + 18, y: y + 50, w: w - 36, h: 48 },
        label: existing.level < 2 ? `Upgrade ${cost}` : "Max level",
        color: 0x6a8d3d,
        enabled: existing.level < 2 && this.gold >= cost,
        action: () => {
          if (existing.level >= 2 || this.gold < cost) return;
          this.gold -= cost;
          existing.level += 1;
          this.addFloatingText("Upgraded", existing.x, existing.y - 54, 0x314f1d, 1, 16);
          this.closeMenu();
        }
      });
    } else {
      (["archer", "cannon", "magic"] as TowerKey[]).forEach((key, index) => {
        const type = TOWER_TYPES[key];
        items.push({
          rect: { x: x + 16 + index * 88, y: y + 52, w: 82, h: 50 },
          label: `${type.short} ${type.cost}`,
          color: type.dark,
          enabled: this.gold >= type.cost,
          action: () => this.buildTower(key, spotIndex)
        });
      });
    }
    this.buildMenu = { x, y, w, h, title: existing ? `${existing.config.name} L${existing.level}` : "Build tower", items };
    this.menuTexts.push(this.add.text(x + w / 2, y + 22, this.buildMenu.title, { fontFamily: "Trebuchet MS, Arial", fontSize: "16px", fontStyle: "bold", color: "#4b351f" }).setOrigin(0.5));
    for (const item of items) {
      this.menuTexts.push(this.add.text(item.rect.x + item.rect.w / 2, item.rect.y + item.rect.h / 2, item.label, { fontFamily: "Trebuchet MS, Arial", fontSize: "14px", fontStyle: "bold", color: "#fff8dc" }).setOrigin(0.5));
    }
  }

  closeMenu() {
    this.selectedSpot = null;
    this.buildMenu = null;
    if (this.menuTexts) {
      for (const text of this.menuTexts) text.destroy();
      this.menuTexts = [];
    }
  }

  buildTower(typeKey: TowerKey, spotIndex: number) {
    const type = TOWER_TYPES[typeKey];
    if (this.gold < type.cost || this.towers.some((t: Tower) => t.spotIndex === spotIndex)) return;
    this.gold -= type.cost;
    const tower = new Tower(typeKey, spotIndex, this);
    this.towers.push(tower);
    this.effects.push(new BurstEffect(tower.x, tower.y, 42, 0xfff0a6, 0.34));
    this.addFloatingText(type.name, tower.x, tower.y - 48, type.dark, 0.9, 15);
    this.closeMenu();
  }

  startWave() {
    if (this.state === "select") return;
    if (this.state === "paused") {
      this.state = "playing";
      return;
    }
    if (this.state === "victory" || this.state === "defeat") {
      this.resetRun();
      return;
    }
    if (this.waveActive || this.waveIndex >= WAVES.length) return;
    if (this.state === "ready") this.state = "playing";
    const wave = WAVES[this.waveIndex];
    this.waveGroups = wave.groups.map((group) => ({ ...group, spawned: 0, timer: -group.delay }));
    this.waveActive = true;
    this.waveClearDelay = 0;
    this.addFloatingText(`Wave ${this.waveIndex + 1}: ${wave.name}`, WORLD.width / 2, 100, 0x344f2e, 1.8, 24);
  }

  updateWave(dt: number) {
    if (!this.waveActive) return;
    let done = true;
    for (const group of this.waveGroups) {
      if (group.spawned >= group.count) continue;
      done = false;
      group.timer += dt;
      while (group.timer >= group.interval && group.spawned < group.count) {
        group.timer -= group.interval;
        group.spawned += 1;
        this.enemies.push(new Enemy(group.type, this));
      }
    }
    if (done && this.enemies.length === 0) {
      this.waveClearDelay += dt;
      if (this.waveClearDelay > 1) {
        this.waveActive = false;
        this.waveIndex += 1;
        this.gold += this.difficulty.waveClearBonus;
        this.addFloatingText(`+${this.difficulty.waveClearBonus} wave clear`, WORLD.width / 2, 126, 0x795314, 1.4, 20);
        if (this.waveIndex >= WAVES.length) this.state = "victory";
      }
    }
  }

  togglePause() {
    if (this.state === "playing") this.state = "paused";
    else if (this.state === "paused") this.state = "playing";
  }

  tryHeroAbility(player: number) {
    if (this.state === "ready") this.state = "playing";
    if (this.state !== "playing" || !this.heroes[player]) return;
    this.heroes[player].cast(this);
  }

  findEnemyInRange(x: number, y: number, range: number) {
    let best: Enemy | null = null;
    let bestDistance = Infinity;
    for (const enemy of this.enemies) {
      if (enemy.dead || enemy.leaked) continue;
      const d = distSq(x, y, enemy.x, enemy.y);
      if (d <= range * range && d < bestDistance) {
        best = enemy;
        bestDistance = d;
      }
    }
    return best;
  }

  findTowerTarget(x: number, y: number, range: number) {
    let best: Enemy | null = null;
    let bestProgress = -Infinity;
    for (const enemy of this.enemies) {
      if (enemy.dead || enemy.leaked || distSq(x, y, enemy.x, enemy.y) > range * range) continue;
      if (enemy.pathDistance > bestProgress) {
        best = enemy;
        bestProgress = enemy.pathDistance;
      }
    }
    return best;
  }

  addFloatingText(text: string, x: number, y: number, color: number, duration: number, size: number) {
    const obj = this.add.text(this.sx(x), this.sy(y), text, {
      fontFamily: "Trebuchet MS, Arial",
      fontSize: `${size}px`,
      fontStyle: "bold",
      color: `#${color.toString(16).padStart(6, "0")}`,
      stroke: "#fff8da",
      strokeThickness: 4
    }).setOrigin(0.5);
    this.floaters.push({ obj, x, y, life: duration, duration });
  }

  clearFloaters() {
    if (!this.floaters) return;
    for (const f of this.floaters) f.obj.destroy();
    this.floaters = [];
  }

  update(_time: number, deltaMs: number) {
    const dt = Math.min(0.033, deltaMs / 1000);
    if (this.state === "playing") {
      this.updateWave(dt);
      for (let i = 0; i < this.heroes.length; i++) this.heroes[i].update(dt, this, this.heroVector(i));
      for (const enemy of this.enemies) enemy.update(dt, this);
      for (const tower of this.towers) tower.update(dt, this);
      for (const projectile of this.projectiles) projectile.update(dt, this);
      for (const trap of this.traps) trap.update(dt, this);
    }
    for (const effect of this.effects) effect.update(dt);
    for (const beam of this.beams) beam.update(dt);
    for (const floater of this.floaters) {
      floater.life -= dt;
      floater.y -= dt * 28;
      floater.obj.setPosition(this.sx(floater.x), this.sy(floater.y)).setAlpha(clamp(floater.life / floater.duration, 0, 1));
    }
    this.enemies = this.enemies.filter((e: Enemy) => !e.dead && !e.leaked);
    this.projectiles = this.projectiles.filter((p: Projectile) => !p.dead);
    this.traps = this.traps.filter((t: Trap) => !t.dead);
    this.effects = this.effects.filter((e: BurstEffect) => !e.dead);
    this.beams = this.beams.filter((b: Beam) => !b.dead);
    for (const floater of this.floaters.filter((f: any) => f.life <= 0)) floater.obj.destroy();
    this.floaters = this.floaters.filter((f: any) => f.life > 0);
    this.draw();
    this.updateTextLayout();
  }

  roundedRect(x: number, y: number, w: number, h: number, radius: number, fill: number, stroke?: number, lineWidth = 2) {
    this.g.fillStyle(fill, 1);
    this.g.fillRoundedRect(x, y, w, h, radius);
    if (stroke !== undefined) {
      this.g.lineStyle(lineWidth, stroke, 1);
      this.g.strokeRoundedRect(x, y, w, h, radius);
    }
  }

  draw() {
    const g = this.g;
    const theme = this.level.theme;
    g.clear();
    g.fillGradientStyle(theme.top, theme.top, theme.bottom, theme.bottom, 1);
    g.fillRect(0, 0, this.gameWidth, this.gameHeight);
    this.drawWorld();
    if (this.state !== "select") {
      this.drawHud();
      this.drawControls();
      this.drawBuildMenu();
      this.drawOverlay();
    }
  }

  drawWorld() {
    const g = this.g;
    const theme = this.level.theme;
    for (let i = 0; i < 38; i++) {
      g.fillStyle(i % 2 ? theme.grassA : theme.grassB, i % 2 ? 0.13 : 0.16);
      g.fillEllipse(this.sx((i * 223) % 1000), this.sy(70 + (i * 91) % 500), this.sr(26), this.sr(9));
    }
    this.drawPathStroke(theme.pathOuter, 68);
    this.drawPathStroke(theme.pathMid, 58);
    this.drawPathStroke(theme.pathInner, 44);
    this.drawEntranceSign();
    this.drawPiggyBase();
    this.drawBuildSpots();
    this.drawTowers();
    this.drawTraps();
    this.drawEnemies();
    this.drawProjectiles();
    this.drawBeams();
    this.drawHeroes();
    this.drawEffects();
  }

  drawPathStroke(color: number, width: number) {
    const path = this.level.path;
    this.g.lineStyle(this.sr(width), color, 1);
    for (let i = 0; i < path.length - 1; i++) {
      this.g.lineBetween(this.sx(path[i].x), this.sy(path[i].y), this.sx(path[i + 1].x), this.sy(path[i + 1].y));
    }
  }

  drawEntranceSign() {
    const g = this.g;
    const first = this.level.path[1] ?? this.level.path[0];
    const x = this.sx(first.x + 62);
    const y = this.sy(45);
    g.fillStyle(0x765029, 1);
    g.fillRect(x - this.sr(6), y, this.sr(12), this.sr(55));
    this.roundedRect(x - this.sr(38), y - this.sr(30), this.sr(76), this.sr(34), this.sr(8), 0xf7d894, 0x765029, this.sr(4));
  }

  drawPiggyBase() {
    const g = this.g;
    const x = this.sx(this.basePoint.x);
    const y = this.sy(this.basePoint.y);
    g.fillStyle(0x674622, 0.22);
    g.fillEllipse(x, y + this.sr(34), this.sr(148), this.sr(30));
    g.fillStyle(0xf190aa, 1);
    g.lineStyle(this.sr(5), 0x9d4265, 1);
    g.fillEllipse(x, y, this.sr(132), this.sr(86));
    g.strokeEllipse(x, y, this.sr(132), this.sr(86));
    g.fillStyle(0xf6adc0, 1);
    g.fillEllipse(x + this.sr(60), y, this.sr(42), this.sr(32));
    g.fillStyle(0x9d4265, 1);
    g.fillCircle(x + this.sr(68), y - this.sr(3), this.sr(4));
    g.fillCircle(x + this.sr(54), y - this.sr(3), this.sr(4));
    g.fillRect(x - this.sr(34), y - this.sr(45), this.sr(62), this.sr(8));
    g.fillStyle(0x66304a, 1);
    g.fillCircle(x + this.sr(30), y - this.sr(15), this.sr(6));
  }

  drawBuildSpots() {
    const g = this.g;
    this.level.buildSpots.forEach((spot, index) => {
      if (this.towers.some((t: Tower) => t.spotIndex === index)) return;
      const x = this.sx(spot.x);
      const y = this.sy(spot.y);
      g.fillStyle(0x573919, 0.22);
      g.fillEllipse(x, y + this.sr(20), this.sr(68), this.sr(20));
      g.fillStyle(0xf7dd9b, 1);
      g.lineStyle(this.sr(4), 0x8b643a, 1);
      g.fillCircle(x, y, this.sr(UI.spotRadius));
      g.strokeCircle(x, y, this.sr(UI.spotRadius));
      this.drawPlus(x, y, this.sr(10), 0x7d5a34, this.sr(4));
    });
  }

  drawTowers() {
    const g = this.g;
    for (const tower of this.towers) {
      const x = this.sx(tower.x);
      const y = this.sy(tower.y);
      if (this.selectedSpot === tower.spotIndex) {
        g.fillStyle(0xffffff, 0.1);
        g.lineStyle(this.sr(3), 0xffffff, 0.7);
        g.fillCircle(x, y, this.sr(tower.range()));
        g.strokeCircle(x, y, this.sr(tower.range()));
      }
      g.fillStyle(0x4c3318, 0.25);
      g.fillEllipse(x, y + this.sr(25), this.sr(70), this.sr(22));
      g.fillStyle(0x8f6838, 1);
      g.fillRect(x - this.sr(18), y - this.sr(8), this.sr(36), this.sr(38));
      g.fillStyle(tower.config.dark, 1);
      g.fillTriangle(x - this.sr(30), y - this.sr(10), x, y - this.sr(40), x + this.sr(30), y - this.sr(10));
      this.roundedRect(x - this.sr(22), y - this.sr(9), this.sr(44), this.sr(28), this.sr(6), tower.config.color, undefined);
      if (tower.level > 1) {
        g.fillStyle(0xffd95b, 1);
        g.fillTriangle(x - this.sr(13), y - this.sr(45), x, y - this.sr(58), x + this.sr(13), y - this.sr(45));
      }
    }
  }

  drawTraps() {
    const g = this.g;
    for (const trap of this.traps) {
      const alpha = clamp(trap.life / trap.duration, 0, 1);
      g.fillStyle(0x55c987, 0.15 * alpha);
      g.fillCircle(this.sx(trap.x), this.sy(trap.y), this.sr(trap.radius));
      g.lineStyle(this.sr(4), 0x206330, 0.75 * alpha);
      g.strokeCircle(this.sx(trap.x), this.sy(trap.y), this.sr(trap.radius));
      g.fillStyle(0xffc15f, 0.9 * alpha);
      g.fillCircle(this.sx(trap.x), this.sy(trap.y), this.sr(12));
    }
  }

  drawEnemies() {
    const g = this.g;
    for (const enemy of [...this.enemies].sort((a, b) => a.y - b.y)) {
      const x = this.sx(enemy.x);
      const y = this.sy(enemy.y);
      const r = this.sr(enemy.radius);
      g.fillStyle(0x412716, 0.24);
      g.fillEllipse(x, y + r + this.sr(10), r * 2.2, this.sr(14));
      g.fillStyle(enemy.hitFlash > 0 ? 0xfff2c3 : enemy.color, 1);
      g.lineStyle(this.sr(3), enemy.dark, 1);
      g.fillCircle(x, y, r);
      g.strokeCircle(x, y, r);
      if (enemy.typeKey === "brute") this.roundedRect(x - r * 0.6, y - r * 0.25, r * 1.2, r * 1.2, this.sr(5), 0xd7d9df, 0x59606b, this.sr(2));
      else if (enemy.typeKey === "thief") {
        g.fillStyle(0xfff0a6, 1);
        g.fillCircle(x, y, r * 0.62);
      } else {
        g.fillStyle(enemy.dark, 1);
        g.fillCircle(x - r * 0.35, y - r * 0.2, this.sr(3));
        g.fillCircle(x + r * 0.35, y - r * 0.2, this.sr(3));
      }
      if (enemy.slowTimer > 0) {
        g.lineStyle(this.sr(3), 0x95dfff, 0.85);
        g.strokeCircle(x, y, r + this.sr(5));
      }
      this.drawBar(x - r - this.sr(4), y - r - this.sr(16), r * 2 + this.sr(8), this.sr(6), enemy.health / enemy.maxHealth, 0xdc4b42);
    }
  }

  drawProjectiles() {
    const g = this.g;
    for (const p of this.projectiles) {
      g.lineStyle(this.sr(p.radius), p.color, 1);
      g.lineBetween(this.sx(p.prevX), this.sy(p.prevY), this.sx(p.x), this.sy(p.y));
      g.fillStyle(p.color, 1);
      g.fillCircle(this.sx(p.x), this.sy(p.y), this.sr(p.radius));
    }
  }

  drawBeams() {
    const g = this.g;
    for (const beam of this.beams) {
      const alpha = clamp(beam.life / beam.duration, 0, 1);
      g.lineStyle(this.sr(16), 0xffe56a, alpha);
      g.lineBetween(this.sx(beam.x), this.sy(beam.y), this.sx(beam.x + beam.dx * beam.length), this.sy(beam.y + beam.dy * beam.length));
      g.lineStyle(this.sr(6), 0xfff8c7, alpha);
      g.lineBetween(this.sx(beam.x), this.sy(beam.y), this.sx(beam.x + beam.dx * beam.length), this.sy(beam.y + beam.dy * beam.length));
    }
  }

  drawHeroes() {
    const g = this.g;
    for (const hero of [...this.heroes].sort((a, b) => a.y - b.y)) {
      const x = this.sx(hero.x);
      const y = this.sy(hero.y);
      const alpha = hero.down ? 0.58 : 1;
      g.fillStyle(0x412716, 0.25 * alpha);
      g.fillEllipse(x, y + this.sr(23), this.sr(52), this.sr(16));
      g.fillStyle(hero.hitFlash > 0 ? 0xfff2c3 : hero.color, alpha);
      g.lineStyle(this.sr(4), 0x60352c, alpha);
      g.fillCircle(x, y, this.sr(23));
      g.strokeCircle(x, y, this.sr(23));
      g.fillStyle(hero.trim, alpha);
      if (hero.abilityType === "slam") {
        g.fillTriangle(x - this.sr(17), y - this.sr(20), x, y - this.sr(40), x + this.sr(17), y - this.sr(20));
        g.fillRect(x + this.sr(17), y - this.sr(4), this.sr(20), this.sr(8));
      } else if (hero.abilityType === "spark") {
        g.fillTriangle(x - this.sr(17), y - this.sr(8), x, y - this.sr(42), x + this.sr(17), y - this.sr(8));
        g.fillCircle(x + this.sr(18), y - this.sr(10), this.sr(6));
      } else {
        g.fillTriangle(x - this.sr(18), y - this.sr(8), x, y - this.sr(34), x + this.sr(18), y - this.sr(8));
        g.fillRect(x + this.sr(16), y - this.sr(2), this.sr(24), this.sr(5));
        g.fillCircle(x + this.sr(42), y, this.sr(5));
      }
      if (hero.down) {
        g.lineStyle(this.sr(5), 0xfff5cc, 1);
        g.strokeCircle(x, y, this.sr(34));
      }
      this.drawBar(x - this.sr(28), y - this.sr(42), this.sr(56), this.sr(8), hero.health / hero.maxHealth, 0x48bc5f);
    }
  }

  drawEffects() {
    const g = this.g;
    for (const effect of this.effects) {
      const t = 1 - effect.life / effect.duration;
      g.lineStyle(this.sr(6 * (1 - t) + 2), effect.color, clamp(effect.life / effect.duration, 0, 1) * 0.7);
      g.strokeCircle(this.sx(effect.x), this.sy(effect.y), this.sr(effect.radius * (0.25 + t * 0.75)));
    }
  }

  drawBar(x: number, y: number, w: number, h: number, pct: number, color: number) {
    this.g.fillStyle(0x412616, 0.55);
    this.g.fillRoundedRect(x, y, w, h, h / 2);
    this.g.fillStyle(color, 1);
    this.g.fillRoundedRect(x + 1, y + 1, Math.max(0, (w - 2) * clamp(pct, 0, 1)), h - 2, h / 2);
  }

  drawPlus(x: number, y: number, size: number, color: number, width: number) {
    this.g.lineStyle(width, color, 1);
    this.g.lineBetween(x - size, y, x + size, y);
    this.g.lineBetween(x, y - size, x, y + size);
  }

  drawHud() {
    const buttons = this.topButtons();
    const waveRect = this.hudWaveRect();
    this.roundedRect(16, 12, 118, 48, 12, 0xfff8da, 0x705b34, 2);
    this.roundedRect(146, 12, 118, 48, 12, 0xfff8da, 0x705b34, 2);
    this.roundedRect(waveRect.x, waveRect.y, waveRect.w, waveRect.h, 12, 0xfff8da, 0x705b34, 2);
    this.drawButton(buttons.setup, 0x715236);
    this.drawButton(buttons.wave, this.waveActive ? 0x5d5b50 : 0x2d7f44);
    this.drawButton(buttons.pause, this.state === "ready" || this.state === "victory" || this.state === "defeat" ? 0x5d5b50 : 0x365e97);
    this.drawButton(buttons.restart, 0x9f4936);
  }

  drawButton(rect: any, color: number) {
    this.roundedRect(rect.x, rect.y, rect.w, rect.h, 8, color, 0xffffff, 2);
  }

  drawControls() {
    if (!this.heroes.length) return;
    const controls = this.controlRects();
    const panelW = Math.min(250, Math.max(188, this.gameWidth * 0.24));
    this.g.fillStyle(this.heroes[0].color, 0.08);
    this.g.fillRect(0, 0, panelW, this.gameHeight);
    this.g.fillStyle(this.heroes[1].color, 0.08);
    this.g.fillRect(this.gameWidth - panelW, 0, panelW, this.gameHeight);
    this.g.lineStyle(3, 0xffffff, 0.18);
    this.g.lineBetween(panelW, 76, panelW, this.gameHeight - 76);
    this.g.lineBetween(this.gameWidth - panelW, 76, this.gameWidth - panelW, this.gameHeight - 76);
    controls.forEach((zones: any, player: number) => {
      const joy = this.joysticks[player];
      const hero = this.heroes[player];
      this.g.fillStyle(0x1f3824, 0.26);
      this.g.lineStyle(4, 0xffffff, 0.72);
      this.g.fillCircle(zones.joystick.x, zones.joystick.y, zones.joystick.r);
      this.g.strokeCircle(zones.joystick.x, zones.joystick.y, zones.joystick.r);
      this.g.fillStyle(hero.color, 1);
      this.g.lineStyle(4, 0xfff8dc, 1);
      this.g.fillCircle(joy.active ? joy.current.x : zones.joystick.x, joy.active ? joy.current.y : zones.joystick.y, UI.joystickKnob);
      this.g.strokeCircle(joy.active ? joy.current.x : zones.joystick.x, joy.active ? joy.current.y : zones.joystick.y, UI.joystickKnob);
      this.g.fillStyle(hero.down ? 0x505050 : hero.color, 1);
      this.g.lineStyle(4, 0xfff8dc, 1);
      this.g.fillCircle(zones.ability.x, zones.ability.y, zones.ability.r);
      this.g.strokeCircle(zones.ability.x, zones.ability.y, zones.ability.r);
      if (hero.abilityTimer > 0 || hero.down) {
        this.g.fillStyle(0x1d1c18, 0.46);
        this.g.slice(zones.ability.x, zones.ability.y, zones.ability.r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(hero.abilityTimer / hero.abilityCooldown, 0, 1), true);
        this.g.fillPath();
      }
    });
  }

  drawBuildMenu() {
    if (!this.buildMenu) return;
    this.roundedRect(this.buildMenu.x, this.buildMenu.y, this.buildMenu.w, this.buildMenu.h, 8, 0xfff8da, 0x8b643a, 3);
    for (const item of this.buildMenu.items) this.drawButton(item.rect, item.enabled ? item.color : 0x888276);
  }

  overlayBox() {
    const w = Math.min(660, this.gameWidth - 48);
    const h = 250;
    return { x: this.gameWidth / 2 - w / 2, y: this.gameHeight / 2 - h / 2, w, h };
  }

  drawOverlay() {
    if (!["ready", "paused", "victory", "defeat"].includes(this.state)) return;
    this.g.fillStyle(0x293020, 0.4);
    this.g.fillRect(0, 0, this.gameWidth, this.gameHeight);
    const box = this.overlayBox();
    this.roundedRect(box.x, box.y, box.w, box.h, 8, 0xfff8da, 0x8b643a, 4);
  }

  updateTextLayout() {
    const hudVisible = this.state !== "select";
    for (const key of ["base", "gold", "wave", "waveBtn", "pauseBtn", "restartBtn", "setupBtn", "p1Label", "p2Label", "p1Ability", "p2Ability"]) {
      this.texts[key].setVisible(hudVisible);
    }
    const showOverlay = ["ready", "paused", "victory", "defeat"].includes(this.state);
    for (const key of ["title", "sub1", "sub2", "sub3", "sub4"]) this.texts[key].setVisible(showOverlay);
    if (!hudVisible) return;

    const buttons = this.topButtons();
    const waveRect = this.hudWaveRect();
    const currentWave = this.waveIndex >= WAVES.length ? "All waves clear" : `Wave ${this.waveIndex + 1}/${WAVES.length}: ${WAVES[this.waveIndex].name}`;
    this.texts.base.setText(`Base ${this.baseHealth}`).setPosition(75, 36);
    this.texts.gold.setText(`Gold ${this.gold}`).setPosition(205, 36);
    this.texts.wave.setText(`${this.level.short} | ${this.difficulty.name} | ${currentWave}`).setPosition(waveRect.x + waveRect.w / 2, 36);
    this.texts.waveBtn.setText(this.waveActive ? "Wave live" : this.state === "ready" ? "Start" : "Next wave").setPosition(buttons.wave.x + buttons.wave.w / 2, buttons.wave.y + buttons.wave.h / 2);
    this.texts.pauseBtn.setText(this.state === "paused" ? "Resume" : "Pause").setPosition(buttons.pause.x + buttons.pause.w / 2, buttons.pause.y + buttons.pause.h / 2);
    this.texts.restartBtn.setPosition(buttons.restart.x + buttons.restart.w / 2, buttons.restart.y + buttons.restart.h / 2);
    this.texts.setupBtn.setPosition(buttons.setup.x + buttons.setup.w / 2, buttons.setup.y + buttons.setup.h / 2);

    if (this.heroes.length) {
      const controls = this.controlRects();
      this.texts.p1Label.setText(`P1 ${this.heroes[0].name}`).setPosition(controls[0].joystick.x - 66, controls[0].joystick.y);
      this.texts.p2Label.setText(`P2 ${this.heroes[1].name}`).setPosition(controls[1].joystick.x + 66, controls[1].joystick.y);
      this.texts.p1Ability.setText(`${this.heroes[0].abilityShort}\n${this.abilityText(this.heroes[0])}`).setPosition(controls[0].ability.x, controls[0].ability.y);
      this.texts.p2Ability.setText(`${this.heroes[1].abilityShort}\n${this.abilityText(this.heroes[1])}`).setPosition(controls[1].ability.x, controls[1].ability.y);
    }

    if (showOverlay) {
      const box = this.overlayBox();
      const readyHeroes = this.heroes.length ? `${this.heroes[0].name} and ${this.heroes[1].name}` : "Choose heroes";
      const copy: Record<string, string[]> = {
        ready: ["PiggyRush", `${this.level.name} | ${this.difficulty.name}`, readyHeroes, "Build towers, then tap Start for the first wave.", "Keyboard: WASD/F and arrows/Enter."],
        paused: ["Paused", "Tap Resume or press P.", `${this.level.name} | ${this.difficulty.name}`, "Controls face each player.", "Tap Setup to change heroes or map."],
        victory: ["Victory", "The piggy-bank kingdom is safe.", "Restart to replay this setup.", "Tap Setup to change heroes, level, or difficulty.", ""],
        defeat: ["Defeat", "The vault cracked under pressure.", "Restart, rebuild, and guard the route.", "Tap Setup to change heroes, level, or difficulty.", ""]
      };
      const lines = copy[this.state];
      this.texts.title.setText(lines[0]).setPosition(this.gameWidth / 2, box.y + 62);
      this.texts.sub1.setText(lines[1]).setPosition(this.gameWidth / 2, box.y + 108);
      this.texts.sub2.setText(lines[2]).setPosition(this.gameWidth / 2, box.y + 146);
      this.texts.sub3.setText(lines[3]).setPosition(this.gameWidth / 2, box.y + 177);
      this.texts.sub4.setText(lines[4]).setPosition(this.gameWidth / 2, box.y + 206);
    }
  }

  abilityText(hero: Hero) {
    if (hero.down) return `REV ${Math.ceil(hero.reviveTimer)}`;
    if (hero.abilityTimer > 0) return `${Math.ceil(hero.abilityTimer)}s`;
    return "READY";
  }
}

let activeScene: PiggyRushScene | null = null;
let setupBuilt = false;

function buildSetupUi(scene: PiggyRushScene) {
  if (setupBuilt) return;
  setupBuilt = true;
  const root = document.getElementById("setupScreen");
  if (!root) return;

  const selection: { heroes: [string, string]; levelId: string; difficultyId: string } = {
    heroes: ["penny", "mage"],
    levelId: "meadow",
    difficultyId: "normal"
  };

  root.innerHTML = `
    <section class="setup-panel">
      <div class="setup-header">
        <div>
          <h1 class="setup-title">PiggyRush</h1>
          <p class="setup-subtitle">Pick two heroes, one level, and one difficulty.</p>
        </div>
      </div>
      <div class="setup-grid">
        <div class="setup-section" data-player-section="0">
          <div class="section-label">Player 1 Hero</div>
          <div class="choice-row" data-choice-row="hero-0"></div>
        </div>
        <div class="setup-section" data-player-section="1">
          <div class="section-label">Player 2 Hero</div>
          <div class="choice-row" data-choice-row="hero-1"></div>
        </div>
        <div class="setup-section wide">
          <div class="section-label">Level</div>
          <div class="choice-row" data-choice-row="level"></div>
        </div>
        <div class="setup-section wide">
          <div class="section-label">Difficulty</div>
          <div class="choice-row" data-choice-row="difficulty"></div>
        </div>
      </div>
      <div class="setup-actions">
        <button class="start-button" type="button" data-start>Start Run</button>
      </div>
    </section>
  `;

  const render = () => {
    for (const player of [0, 1] as const) {
      const row = root.querySelector(`[data-choice-row="hero-${player}"]`);
      if (!row) continue;
      row.innerHTML = HERO_CONFIGS.map((hero) => {
        const selected = selection.heroes[player] === hero.id;
        const disabled = selection.heroes[1 - player] === hero.id;
        return `<button class="choice-card ${selected ? "is-selected" : ""} ${disabled ? "is-disabled" : ""}" type="button" data-hero="${hero.id}" data-player="${player}">
          <strong>${hero.name}</strong><span>${hero.role}</span>
        </button>`;
      }).join("");
    }

    const levelRow = root.querySelector('[data-choice-row="level"]');
    if (levelRow) {
      levelRow.innerHTML = LEVELS.map((level) => `<button class="choice-card ${selection.levelId === level.id ? "is-selected" : ""}" type="button" data-level="${level.id}">
        <strong>${level.name}</strong><span>${level.description}</span>
      </button>`).join("");
    }

    const difficultyRow = root.querySelector('[data-choice-row="difficulty"]');
    if (difficultyRow) {
      difficultyRow.innerHTML = DIFFICULTIES.map((difficulty) => `<button class="choice-card ${selection.difficultyId === difficulty.id ? "is-selected" : ""}" type="button" data-difficulty="${difficulty.id}">
        <strong>${difficulty.name}</strong><span>${difficulty.description}</span>
      </button>`).join("");
    }
  };

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button") as HTMLButtonElement | null;
    if (!button) return;

    if (button.dataset.hero && button.dataset.player) {
      const player = Number(button.dataset.player) as 0 | 1;
      const other = player === 0 ? 1 : 0;
      const next = button.dataset.hero;
      if (selection.heroes[other] === next) selection.heroes[other] = selection.heroes[player];
      selection.heroes[player] = next;
      render();
      return;
    }

    if (button.dataset.level) {
      selection.levelId = button.dataset.level;
      render();
      return;
    }

    if (button.dataset.difficulty) {
      selection.difficultyId = button.dataset.difficulty;
      render();
      return;
    }

    if (button.dataset.start !== undefined) {
      root.classList.add("is-hidden");
      scene.applySelection([...selection.heroes] as [string, string], selection.levelId, selection.difficultyId);
    }
  });

  render();
}

function showSetupScreen() {
  const root = document.getElementById("setupScreen");
  root?.classList.remove("is-hidden");
  activeScene?.enterSelection();
}

window.addEventListener("load", () => {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "game",
    backgroundColor: "#7cc957",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight
    },
    input: {
      activePointers: 10
    },
    scene: PiggyRushScene
  });
});
