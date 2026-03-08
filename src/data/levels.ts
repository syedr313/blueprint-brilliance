export interface Level {
  id: number;
  title: string;
  description: string;
  module: number;
  moduleName: string;
  isLocked: boolean;
  bestScore: number | null;
  stars: number;
  videoUrl: string;
}

export const moduleNames = [
  "Foundation",
  "Elementary",
  "Intermediate",
  "Upper Intermediate",
  "Advanced",
];

export const moduleColors = [
  { from: "hsl(0, 91%, 71%)", to: "hsl(330, 81%, 60%)" },
  { from: "hsl(199, 89%, 60%)", to: "hsl(168, 76%, 40%)" },
  { from: "hsl(38, 92%, 50%)", to: "hsl(48, 96%, 53%)" },
  { from: "hsl(142, 71%, 45%)", to: "hsl(168, 76%, 40%)" },
  { from: "hsl(270, 76%, 55%)", to: "hsl(330, 81%, 60%)" },
];

const levelTitles: string[] = [
  "Alphabet Avalanche", "Phonics Pop", "Picture Word Match", "Sound Safari",
  "Letter Builder", "Syllable Splash", "Word Crash", "Greeting Builder",
  "Color and Number Bingo", "Foundation Boss Challenge",
  "Verb Volcano", "Adjective Adventure", "Sentence Train", "Present Tense Towers",
  "Preposition Maze", "Question Quest", "Contraction Catcher", "Plural Playground",
  "Article Archer", "Elementary Boss Challenge",
  "Idiom Island", "Paragraph Puzzle", "Synonym & Antonym Arena", "Conditional Crossroads",
  "Reading Comprehension Race", "Phrasal Verb Frenzy", "Dictation Dash", "Story Builder",
  "Debate Simulator", "Intermediate Boss Challenge",
  "Academic Word Wall", "Essay Architect", "Passive Voice Transformer", "Reported Speech Relay",
  "Advanced Listening Lab", "Formal Letter Forge", "Clause Constructor", "Modal Verb Mission",
  "Discourse Marker Derby", "Upper Intermediate Boss Challenge",
  "Rhetoric Arena", "Literary Lens", "Register Shifter", "Nuance Navigator",
  "Academic Essay Engine", "Impromptu Speaking Stage", "Error Analysis Lab",
  "Cross-Cultural Communicator", "Professional Presentation Simulator", "Grand Graduation Assessment",
];

export const levels: Level[] = levelTitles.map((title, i) => ({
  id: i + 1,
  title,
  description: `Level ${i + 1} of the Lingual Quest journey`,
  module: Math.floor(i / 10) + 1,
  moduleName: moduleNames[Math.floor(i / 10)],
  isLocked: false,
  bestScore: i === 0 ? 92 : i === 1 ? 85 : i === 2 ? null : null,
  stars: i === 0 ? 3 : i === 1 ? 2 : 0,
  videoUrl: "",
}));
