/**
 * SceneBox - Seed Demo Data
 * Contains realistic, cinematic scene records, pre-seeded users, and sample activity logs.
 */

const INITIAL_SCENES = [
  {
    id: "sc-01",
    title: "The Neon Rain Stand-off",
    source: "Cybernetic Echo (2024)",
    category: "Action",
    categoryEmoji: "🥊",
    duration: "3:45",
    durationSeconds: 225,
    rating: 4.9,
    views: 48210,
    likes: 12450,
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "In the drenched alleys of Neo-Kyoto, Agent Vance confronts his former mentor with dual plasma blades beneath flickering holographic billboards.",
    tags: ["cyberpunk", "rain", "swords", "mentor vs student", "action", "epic"],
    dna: {
      intensity: 94,
      emotion: 62,
      humor: 10,
      action: 98,
      romance: 5
    },
    featured: true,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-02",
    title: "The Elevator Confession",
    source: "Midnight in Vienna (2023)",
    category: "Romance",
    categoryEmoji: "❤️",
    duration: "4:12",
    durationSeconds: 252,
    rating: 4.8,
    views: 35120,
    likes: 9840,
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "As the historic glass elevator ascends over Vienna's cathedral towers, years of unspoken affection surface before the doors slide open on floor 30.",
    tags: ["confession", "romance", "emotional", "elevator", "love", "night"],
    dna: {
      intensity: 45,
      emotion: 95,
      humor: 20,
      action: 5,
      romance: 99
    },
    featured: false,
    trending: true,
    recentlyAdded: true
  },
  {
    id: "sc-03",
    title: "Zero-G Corridor Breach",
    source: "Event Horizon: Omega (2025)",
    category: "Epic",
    categoryEmoji: "🔥",
    duration: "5:30",
    durationSeconds: 330,
    rating: 4.95,
    views: 92400,
    likes: 27800,
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "The hull breaches at 20,000 miles per hour. Commander Reyes initiates manual magnetic tethering while debris hurtles in pitch-black orbit.",
    tags: ["space", "zero-gravity", "epic", "survival", "sci-fi", "intense"],
    dna: {
      intensity: 98,
      emotion: 70,
      humor: 5,
      action: 92,
      romance: 12
    },
    featured: true,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-04",
    title: "The Courtroom Monologue",
    source: "The Sovereign Verdict (2022)",
    category: "Iconic Dialogue",
    categoryEmoji: "🎭",
    duration: "4:48",
    durationSeconds: 288,
    rating: 4.75,
    views: 64200,
    likes: 18300,
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    description: "Defense Attorney Miriam Cole dismantles a corrupt cartel empire with a blistering six-minute cross-examination that leaves the courtroom dead silent.",
    tags: ["dialogue", "courtroom", "speech", "drama", "monologue", "justice"],
    dna: {
      intensity: 85,
      emotion: 88,
      humor: 15,
      action: 10,
      romance: 0
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-05",
    title: "The Dinner Table Disaster",
    source: "Meet the Grandmas (2023)",
    category: "Comedy",
    categoryEmoji: "😂",
    duration: "3:15",
    durationSeconds: 195,
    rating: 4.6,
    views: 41800,
    likes: 11200,
    thumbnail: "https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "An accidental dose of truth serum into grandma's homemade soup turns a quiet family dinner into an escalating comedy of unfiltered honesty.",
    tags: ["comedy", "family", "funny", "dinner", "laugh", "chaos"],
    dna: {
      intensity: 30,
      emotion: 40,
      humor: 96,
      action: 25,
      romance: 15
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-06",
    title: "The Mirror Dimension Reveal",
    source: "Fractured Chronology (2024)",
    category: "Plot Twist",
    categoryEmoji: "🤯",
    duration: "4:50",
    durationSeconds: 290,
    rating: 4.92,
    views: 88300,
    likes: 24600,
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "The detective realizes every piece of evidence collected over 10 years belonged to his own alternate timeline self.",
    tags: ["plot twist", "mind-bending", "mystery", "reveal", "thriller", "time"],
    dna: {
      intensity: 92,
      emotion: 80,
      humor: 5,
      action: 40,
      romance: 10
    },
    featured: true,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-07",
    title: "The Red Room Interrogation",
    source: "Cold Protocol (2023)",
    category: "Thriller",
    categoryEmoji: "😱",
    duration: "4:05",
    durationSeconds: 245,
    rating: 4.82,
    views: 53900,
    likes: 14700,
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "A ticking timer, a one-way mirror, and a master spy who knows the interrogator's darkest family secrets.",
    tags: ["thriller", "suspense", "interrogation", "spy", "mind games", "dark"],
    dna: {
      intensity: 95,
      emotion: 65,
      humor: 8,
      action: 35,
      romance: 0
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-08",
    title: "The Train Station Farewell",
    source: "Letters We Never Sent (2022)",
    category: "Emotional",
    categoryEmoji: "😭",
    duration: "5:10",
    durationSeconds: 310,
    rating: 4.89,
    views: 71200,
    likes: 21900,
    thumbnail: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    description: "Steam rises from platform 9 as two wartime lovers exchange their pocket watches, knowing neither will return to the same country.",
    tags: ["farewell", "emotional", "tears", "train", "love", "heartbreak"],
    dna: {
      intensity: 50,
      emotion: 99,
      humor: 0,
      action: 5,
      romance: 92
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-09",
    title: "Recursive Reality Loop",
    source: "Tesseract Paradox (2024)",
    category: "Mind-Bending",
    categoryEmoji: "🧠",
    duration: "6:02",
    durationSeconds: 362,
    rating: 4.87,
    views: 63400,
    likes: 19500,
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "A quantum physicist watches his room fold into kaleidoscopic cubes while his future voice narrates his next seven mistakes.",
    tags: ["mind-bending", "physics", "sci-fi", "reality", "paradox", "complex"],
    dna: {
      intensity: 88,
      emotion: 55,
      humor: 12,
      action: 45,
      romance: 5
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-10",
    title: "Highway Chase at Sunset",
    source: "Overdrive Velocity (2023)",
    category: "Action",
    categoryEmoji: "🥊",
    duration: "4:32",
    durationSeconds: 272,
    rating: 4.79,
    views: 57800,
    likes: 16400,
    thumbnail: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
    description: "Two tuned hypercars weave through heavy desert freeway traffic while evading automated police gunships.",
    tags: ["car chase", "speed", "action", "sunset", "stunts", "adrenaline"],
    dna: {
      intensity: 93,
      emotion: 30,
      humor: 15,
      action: 99,
      romance: 0
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-11",
    title: "The Accidental Bank Robbery",
    source: "Bad Luck Benny (2024)",
    category: "Comedy",
    categoryEmoji: "😂",
    duration: "3:40",
    durationSeconds: 220,
    rating: 4.68,
    views: 38900,
    likes: 10400,
    thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "Benny walked in to deposit a $20 birthday check, but his umbrella handle looked exactly like a shotgun in the security mirror.",
    tags: ["comedy", "funny fight", "heist", "misunderstanding", "laugh", "chaos"],
    dna: {
      intensity: 40,
      emotion: 25,
      humor: 97,
      action: 38,
      romance: 5
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-12",
    title: "The Villains Last Toast",
    source: "Empire of Cinders (2023)",
    category: "Iconic Dialogue",
    categoryEmoji: "🎭",
    duration: "4:15",
    durationSeconds: 255,
    rating: 4.91,
    views: 79500,
    likes: 23100,
    thumbnail: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    description: "Lord Malakor pours vintage wine while explaining why heroes are simply villains who lack imagination.",
    tags: ["dialogue", "villain", "best villain dialogue", "speech", "chill", "dark"],
    dna: {
      intensity: 87,
      emotion: 75,
      humor: 18,
      action: 20,
      romance: 0
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-13",
    title: "The Hospital Heartbeat Monitor",
    source: "Before We Fade (2022)",
    category: "Emotional",
    categoryEmoji: "😭",
    duration: "5:22",
    durationSeconds: 322,
    rating: 4.88,
    views: 66400,
    likes: 20300,
    thumbnail: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "A daughter sings her mother's favorite lullaby for the last time as the monitor pulse gradually slows to peace.",
    tags: ["emotional", "emotional ending", "hospital", "family", "goodbye", "tears"],
    dna: {
      intensity: 55,
      emotion: 100,
      humor: 0,
      action: 0,
      romance: 40
    },
    featured: false,
    trending: false,
    recentlyAdded: false
  },
  {
    id: "sc-14",
    title: "The Sniper's Breath",
    source: "Shadow Recon 4 (2024)",
    category: "Thriller",
    categoryEmoji: "😱",
    duration: "3:55",
    durationSeconds: 235,
    rating: 4.83,
    views: 49700,
    likes: 13900,
    thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "1,400 meters out, blizzard wind gusting at 45 knots, and only three seconds before the hostage target crosses the blind corridor.",
    tags: ["sniper", "thriller", "tension", "snow", "tactical", "action"],
    dna: {
      intensity: 96,
      emotion: 45,
      humor: 0,
      action: 78,
      romance: 0
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-15",
    title: "Rainy Rooftop Kiss",
    source: "Under Paris Streetlights (2023)",
    category: "Romance",
    categoryEmoji: "❤️",
    duration: "3:35",
    durationSeconds: 215,
    rating: 4.77,
    views: 44200,
    likes: 12800,
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Drenched under an unexpected Montmartre summer downpour, Luc and Camille stop running and finally drop their umbrellas.",
    tags: ["romance", "rain", "kiss", "paris", "love", "night"],
    dna: {
      intensity: 40,
      emotion: 92,
      humor: 15,
      action: 0,
      romance: 98
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-16",
    title: "The Architect's True Identity",
    source: "The Glass Citadel (2024)",
    category: "Plot Twist",
    categoryEmoji: "🤯",
    duration: "5:08",
    durationSeconds: 308,
    rating: 4.93,
    views: 82100,
    likes: 25400,
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "The mastermind holding the city hostage removes the voice scrambler to reveal she was the mayor who commissioned the defense grid.",
    tags: ["plot twist", "mastermind", "twist", "reveal", "thriller", "drama"],
    dna: {
      intensity: 90,
      emotion: 78,
      humor: 5,
      action: 30,
      romance: 10
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-17",
    title: "The Colosseum Final Stand",
    source: "Legacy of Iron (2023)",
    category: "Epic",
    categoryEmoji: "🔥",
    duration: "6:14",
    durationSeconds: 374,
    rating: 4.97,
    views: 105000,
    likes: 31200,
    thumbnail: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Gladiator General Titus raises his broken gladius as 60,000 spectators chant his true emperor name against the usurper.",
    tags: ["epic", "gladiator", "battle", "glory", "sword", "history"],
    dna: {
      intensity: 99,
      emotion: 90,
      humor: 0,
      action: 96,
      romance: 8
    },
    featured: true,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-18",
    title: "The Hallway Martial Arts Brawl",
    source: "Red Dragon Syndicate (2023)",
    category: "Action",
    categoryEmoji: "🥊",
    duration: "4:20",
    durationSeconds: 260,
    rating: 4.86,
    views: 74100,
    likes: 21300,
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "A continuous 4-minute single-take brawl down a narrow fluorescent tenement corridor against twenty enforcers.",
    tags: ["action", "martial arts", "single take", "hallway", "fight", "intense"],
    dna: {
      intensity: 96,
      emotion: 35,
      humor: 12,
      action: 100,
      romance: 0
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-19",
    title: "The Drunk Wizard Duel",
    source: "Spellbinders & Ale (2024)",
    category: "Comedy",
    categoryEmoji: "😂",
    duration: "3:50",
    durationSeconds: 230,
    rating: 4.71,
    views: 45600,
    likes: 13200,
    thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Two ancient archmages get drunk on dwarven mead and duel using only domestic kitchen transfiguration spells.",
    tags: ["comedy", "funny fight", "magic", "wizard", "tavern", "humor"],
    dna: {
      intensity: 55,
      emotion: 20,
      humor: 98,
      action: 60,
      romance: 0
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-20",
    title: "Memories in the Rain Machine",
    source: "Chrono-Dementia (2024)",
    category: "Mind-Bending",
    categoryEmoji: "🧠",
    duration: "5:45",
    durationSeconds: 345,
    rating: 4.84,
    views: 52100,
    likes: 15600,
    thumbnail: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "Patients relive yesterday's memories, only to discover their present reality is an artificial memory playback from 2088.",
    tags: ["mind-bending", "memory", "sci-fi", "dementia", "philosophical", "mystery"],
    dna: {
      intensity: 78,
      emotion: 84,
      humor: 5,
      action: 25,
      romance: 45
    },
    featured: false,
    trending: false,
    recentlyAdded: false
  },
  {
    id: "sc-21",
    title: "The Bridge Negotiation",
    source: "Borderline Accord (2022)",
    category: "Iconic Dialogue",
    categoryEmoji: "🎭",
    duration: "4:40",
    durationSeconds: 280,
    rating: 4.8,
    views: 48900,
    likes: 14100,
    thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    description: "Two general commanders from opposing nations share cigarettes on a foggy border bridge, trading sharp geopolitical parables.",
    tags: ["dialogue", "negotiation", "war", "peace", "tension", "monologue"],
    dna: {
      intensity: 82,
      emotion: 76,
      humor: 20,
      action: 15,
      romance: 0
    },
    featured: false,
    trending: false,
    recentlyAdded: false
  },
  {
    id: "sc-22",
    title: "Escape from the Sunken Submarine",
    source: "Abyss Protocol (2023)",
    category: "Thriller",
    categoryEmoji: "😱",
    duration: "5:15",
    durationSeconds: 315,
    rating: 4.9,
    views: 68700,
    likes: 19800,
    thumbnail: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "At 800 meters beneath the Arctic, water surges through the command room while the remaining survivor seals the torpedo tube escape hatch.",
    tags: ["thriller", "underwater", "claustrophobic", "survival", "arctic", "danger"],
    dna: {
      intensity: 98,
      emotion: 72,
      humor: 0,
      action: 85,
      romance: 0
    },
    featured: false,
    trending: true,
    recentlyAdded: false
  },
  {
    id: "sc-23",
    title: "Dance in the Sunflower Meadow",
    source: "Solitude in Bloom (2023)",
    category: "Romance",
    categoryEmoji: "❤️",
    duration: "3:28",
    durationSeconds: 208,
    rating: 4.74,
    views: 39800,
    likes: 11900,
    thumbnail: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    description: "Golden hour warms an endless field of sunflowers as estranged soulmates reconnect through an impromptu waltz.",
    tags: ["romance", "dance", "golden hour", "flowers", "wholesome", "sweet"],
    dna: {
      intensity: 28,
      emotion: 91,
      humor: 30,
      action: 0,
      romance: 97
    },
    featured: false,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-24",
    title: "The Sacrifice at Iron Peak",
    source: "Chronicles of Valen (2024)",
    category: "Epic",
    categoryEmoji: "🔥",
    duration: "5:50",
    durationSeconds: 350,
    rating: 4.94,
    views: 89600,
    likes: 26900,
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description: "Holding the mountain pass alone against a legion of mountain drakes to buy time for the refugee caravan to cross.",
    tags: ["epic", "sacrifice", "dragon", "mountain", "heroic", "fantasy"],
    dna: {
      intensity: 99,
      emotion: 94,
      humor: 0,
      action: 97,
      romance: 15
    },
    featured: true,
    trending: false,
    recentlyAdded: true
  },
  {
    id: "sc-25",
    title: "The Double Agent's Passport",
    source: "Copenhagen Shadows (2023)",
    category: "Plot Twist",
    categoryEmoji: "🤯",
    duration: "4:18",
    durationSeconds: 258,
    rating: 4.85,
    views: 59300,
    likes: 17200,
    thumbnail: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "The airport security agent scans the diplomat's diplomatic pouch, uncovering the diplomat's own death certificate dated 1989.",
    tags: ["plot twist", "spy", "airport", "passport", "mystery", "thriller"],
    dna: {
      intensity: 89,
      emotion: 68,
      humor: 10,
      action: 42,
      romance: 5
    },
    featured: false,
    trending: false,
    recentlyAdded: false
  },
  {
    id: "sc-26",
    title: "The Letter from Tomorrow",
    source: "Yesterday's Ghost (2024)",
    category: "Emotional",
    categoryEmoji: "😭",
    duration: "4:42",
    durationSeconds: 282,
    rating: 4.87,
    views: 61800,
    likes: 18400,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "An elderly grandfather opens an attic envelope written in his own childhood handwriting, warning him about the precious seconds he took for granted.",
    tags: ["emotional", "emotional ending", "letters", "nostalgia", "family", "time"],
    dna: {
      intensity: 48,
      emotion: 98,
      humor: 12,
      action: 0,
      romance: 52
    },
    featured: false,
    trending: true,
    recentlyAdded: true
  },
  {
    id: "sc-27",
    title: "Rival Chefs Kitchen Showdown",
    source: "Salt & Saffron (2023)",
    category: "Comedy",
    categoryEmoji: "😂",
    duration: "3:30",
    durationSeconds: 210,
    rating: 4.65,
    views: 37400,
    likes: 9900,
    thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Two Michelin-star egos clash over a single truffle, using flambe pans and powdered sugar as defensive smokescreens.",
    tags: ["comedy", "funny fight", "cooking", "chefs", "food", "rivalry"],
    dna: {
      intensity: 62,
      emotion: 30,
      humor: 95,
      action: 58,
      romance: 20
    },
    featured: false,
    trending: false,
    recentlyAdded: false
  },
  {
    id: "sc-28",
    title: "Quantum Consciousness Split",
    source: "Singularity Mind (2024)",
    category: "Mind-Bending",
    categoryEmoji: "🧠",
    duration: "5:20",
    durationSeconds: 320,
    rating: 4.92,
    views: 76400,
    likes: 22800,
    thumbnail: "https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=800&q=80",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "During an AI neural upload, the subject watches three independent versions of his consciousness make three opposing life choices simultaneously.",
    tags: ["mind-bending", "ai", "cyber", "philosophy", "sci-fi", "consciousness"],
    dna: {
      intensity: 86,
      emotion: 74,
      humor: 8,
      action: 38,
      romance: 18
    },
    featured: false,
    trending: true,
    recentlyAdded: true
  }
];

const INITIAL_USERS = [
  {
    id: "usr-01",
    name: "Rahul Sharma",
    email: "rahul@demo.com",
    password: "Password@123",
    role: "user",
    createdAt: "2026-08-15T10:30:00.000Z",
    lastActive: "2026-10-08T08:45:00.000Z",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "usr-02",
    name: "Ananya Sen",
    email: "ananya@demo.com",
    password: "Password@123",
    role: "user",
    createdAt: "2026-09-02T14:15:00.000Z",
    lastActive: "2026-10-08T09:12:00.000Z",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "usr-03",
    name: "Kiran Rao",
    email: "kiran@demo.com",
    password: "Password@123",
    role: "user",
    createdAt: "2026-09-19T09:20:00.000Z",
    lastActive: "2026-10-07T18:22:00.000Z",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80"
  }
];

const INITIAL_LIKES = {
  "usr-01": ["sc-01", "sc-03", "sc-08", "sc-17"],
  "usr-02": ["sc-02", "sc-06", "sc-15", "sc-23"],
  "usr-03": ["sc-04", "sc-10", "sc-12", "sc-18"]
};

const INITIAL_WATCH_LATER = {
  "usr-01": ["sc-06", "sc-09", "sc-12"],
  "usr-02": ["sc-01", "sc-04", "sc-16"],
  "usr-03": ["sc-03", "sc-17", "sc-24"]
};

const INITIAL_WATCH_HISTORY = {
  "usr-01": [
    { sceneId: "sc-01", timestamp: "2026-10-08T08:42:00.000Z" },
    { sceneId: "sc-03", timestamp: "2026-10-08T08:25:00.000Z" },
    { sceneId: "sc-17", timestamp: "2026-10-07T21:10:00.000Z" }
  ],
  "usr-02": [
    { sceneId: "sc-02", timestamp: "2026-10-08T09:10:00.000Z" },
    { sceneId: "sc-06", timestamp: "2026-10-08T08:50:00.000Z" }
  ],
  "usr-03": [
    { sceneId: "sc-04", timestamp: "2026-10-07T18:20:00.000Z" },
    { sceneId: "sc-12", timestamp: "2026-10-07T17:45:00.000Z" }
  ]
};

const INITIAL_PLAYLISTS = {
  "usr-01": [
    {
      id: "pl-01",
      name: "My Favorite Fights",
      description: "Adrenaline-fueled martial arts and neon weapon duels",
      createdAt: "2026-09-10T11:00:00.000Z",
      scenes: ["sc-01", "sc-10", "sc-18"]
    },
    {
      id: "pl-02",
      name: "Epic Climax Moments",
      description: "Scenes where heroes break through the impossible",
      createdAt: "2026-09-22T15:30:00.000Z",
      scenes: ["sc-03", "sc-17", "sc-24"]
    }
  ],
  "usr-02": [
    {
      id: "pl-03",
      name: "Romantic Escapes",
      description: "Heartwarming rooftop and elevator confessions",
      createdAt: "2026-09-15T18:00:00.000Z",
      scenes: ["sc-02", "sc-15", "sc-23"]
    }
  ]
};

const INITIAL_ACTIVITY_LOGS = [
  {
    id: "act-01",
    userId: "usr-01",
    userName: "Rahul Sharma",
    userEmail: "rahul@demo.com",
    action: "login",
    details: "Logged into SceneBox",
    sceneId: null,
    sceneTitle: null,
    timestamp: "2026-10-08T08:00:00.000Z"
  },
  {
    id: "act-02",
    userId: "usr-01",
    userName: "Rahul Sharma",
    userEmail: "rahul@demo.com",
    action: "watch_scene",
    details: "Watched scene",
    sceneId: "sc-01",
    sceneTitle: "The Neon Rain Stand-off",
    timestamp: "2026-10-08T08:15:00.000Z"
  },
  {
    id: "act-03",
    userId: "usr-01",
    userName: "Rahul Sharma",
    userEmail: "rahul@demo.com",
    action: "like_scene",
    details: "Liked scene",
    sceneId: "sc-01",
    sceneTitle: "The Neon Rain Stand-off",
    timestamp: "2026-10-08T08:18:00.000Z"
  },
  {
    id: "act-04",
    userId: "usr-02",
    userName: "Ananya Sen",
    userEmail: "ananya@demo.com",
    action: "search",
    details: "Searched for 'funny fight'",
    sceneId: null,
    sceneTitle: null,
    timestamp: "2026-10-08T08:30:00.000Z"
  },
  {
    id: "act-05",
    userId: "usr-02",
    userName: "Ananya Sen",
    userEmail: "ananya@demo.com",
    action: "save_watch_later",
    details: "Saved to Watch Later",
    sceneId: "sc-06",
    sceneTitle: "The Mirror Dimension Reveal",
    timestamp: "2026-10-08T08:45:00.000Z"
  },
  {
    id: "act-06",
    userId: "usr-03",
    userName: "Kiran Rao",
    userEmail: "kiran@demo.com",
    action: "create_playlist",
    details: "Created playlist 'Best Dialogues'",
    sceneId: null,
    sceneTitle: null,
    timestamp: "2026-10-07T17:30:00.000Z"
  },
  {
    id: "act-07",
    userId: "usr-03",
    userName: "Kiran Rao",
    userEmail: "kiran@demo.com",
    action: "watch_scene",
    details: "Watched scene",
    sceneId: "sc-04",
    sceneTitle: "The Courtroom Monologue",
    timestamp: "2026-10-07T18:20:00.000Z"
  }
];

const ADMIN_CREDENTIALS = {
  email: "admin@scenebox.com",
  password: "Admin@123",
  name: "Master Administrator",
  role: "admin",
  lastLogin: "2026-10-08T09:00:00.000Z"
};

const CATEGORIES = [
  { id: "Epic", name: "Epic", emoji: "🔥", desc: "Climactic battles, grand spectacles & legendary moments" },
  { id: "Comedy", name: "Comedy", emoji: "😂", desc: "Unfiltered laughter, slapstick & witty banter" },
  { id: "Emotional", name: "Emotional", emoji: "😭", desc: "Heart-wrenching goodbyes & tear-jerking resolutions" },
  { id: "Thriller", name: "Thriller", emoji: "😱", desc: "Edge-of-the-seat tension, suspense & close calls" },
  { id: "Action", name: "Action", emoji: "🥊", desc: "High-octane shootouts, car chases & martial arts" },
  { id: "Romance", name: "Romance", emoji: "❤️", desc: "Heartfelt sparks, rain confessions & tender moments" },
  { id: "Plot Twist", name: "Plot Twist", emoji: "🤯", desc: "Mind-shattering reveals that rewrite the story" },
  { id: "Iconic Dialogue", name: "Iconic Dialogue", emoji: "🎭", desc: "Legendary speeches, monologues & villain lines" },
  { id: "Mind-Bending", name: "Mind-Bending", emoji: "🧠", desc: "Quantum paradoxes, dream worlds & timeline loops" }
];
