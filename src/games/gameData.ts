// Game data for all 50 levels
// Each level maps to a game type with specific content

const gameDataMap: Record<number, any> = {
  // === MODULE 1: FOUNDATION ===

  // Level 1: Alphabet Avalanche - FallingLetters
  1: {
    type: "falling-letters",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  },

  // Level 2: Phonics Pop - BubblePop
  2: {
    type: "bubble-pop",
    rounds: [
      { prompt: "buh", correctLetter: "B", options: ["B", "D", "P", "T", "G"] },
      { prompt: "kuh", correctLetter: "C", options: ["C", "S", "K", "G", "T"] },
      { prompt: "duh", correctLetter: "D", options: ["D", "B", "T", "P", "G"] },
      { prompt: "fff", correctLetter: "F", options: ["F", "V", "S", "P", "H"] },
      { prompt: "guh", correctLetter: "G", options: ["G", "K", "D", "J", "B"] },
      { prompt: "huh", correctLetter: "H", options: ["H", "A", "K", "J", "E"] },
      { prompt: "juh", correctLetter: "J", options: ["J", "G", "Y", "D", "Z"] },
      { prompt: "lll", correctLetter: "L", options: ["L", "R", "N", "M", "W"] },
      { prompt: "mmm", correctLetter: "M", options: ["M", "N", "B", "W", "P"] },
      { prompt: "nnn", correctLetter: "N", options: ["N", "M", "L", "R", "D"] },
      { prompt: "puh", correctLetter: "P", options: ["P", "B", "T", "D", "K"] },
      { prompt: "rrr", correctLetter: "R", options: ["R", "L", "W", "N", "Y"] },
      { prompt: "sss", correctLetter: "S", options: ["S", "Z", "C", "X", "F"] },
      { prompt: "tuh", correctLetter: "T", options: ["T", "D", "P", "K", "B"] },
      { prompt: "vvv", correctLetter: "V", options: ["V", "F", "W", "B", "Z"] },
      { prompt: "aaa", correctLetter: "A", options: ["A", "E", "I", "O", "U"] },
      { prompt: "eee", correctLetter: "E", options: ["E", "I", "A", "U", "O"] },
      { prompt: "iii", correctLetter: "I", options: ["I", "E", "A", "Y", "U"] },
      { prompt: "ooo", correctLetter: "O", options: ["O", "U", "A", "E", "I"] },
      { prompt: "uuu", correctLetter: "U", options: ["U", "O", "A", "W", "E"] },
    ],
  },

  // Level 3: Picture Word Match - DragMatch
  3: {
    type: "drag-match",
    leftLabel: "🖼️ Pictures",
    rightLabel: "📝 Words",
    rounds: [
      { pairs: [
        { left: "🐱", right: "Cat", emoji: "" },
        { left: "🐶", right: "Dog", emoji: "" },
        { left: "🌳", right: "Tree", emoji: "" },
        { left: "📚", right: "Book", emoji: "" },
      ]},
      { pairs: [
        { left: "🏠", right: "House", emoji: "" },
        { left: "🚗", right: "Car", emoji: "" },
        { left: "🌞", right: "Sun", emoji: "" },
        { left: "🌙", right: "Moon", emoji: "" },
      ]},
      { pairs: [
        { left: "🍎", right: "Apple", emoji: "" },
        { left: "🐟", right: "Fish", emoji: "" },
        { left: "🎵", right: "Music", emoji: "" },
        { left: "⭐", right: "Star", emoji: "" },
      ]},
      { pairs: [
        { left: "🌸", right: "Flower", emoji: "" },
        { left: "🐦", right: "Bird", emoji: "" },
        { left: "🍞", right: "Bread", emoji: "" },
        { left: "💧", right: "Water", emoji: "" },
      ]},
      { pairs: [
        { left: "👶", right: "Baby", emoji: "" },
        { left: "🎒", right: "Bag", emoji: "" },
        { left: "🪑", right: "Chair", emoji: "" },
        { left: "🚪", right: "Door", emoji: "" },
      ]},
    ],
  },

  // Level 4: Sound Safari - MultipleChoice
  4: {
    type: "multiple-choice",
    rounds: [
      { question: "🔊 Which animal says 'meow'?", options: ["🐶 Dog", "🐱 Cat", "🐦 Bird", "🐸 Frog"], correctIndex: 1 },
      { question: "🔊 Which animal says 'woof'?", options: ["🐱 Cat", "🐸 Frog", "🐶 Dog", "🐦 Bird"], correctIndex: 2 },
      { question: "🔊 What do you use to eat soup?", options: ["Fork", "Knife", "Spoon", "Cup"], correctIndex: 2 },
      { question: "🔊 What is the color of the sky?", options: ["Red", "Green", "Blue", "Yellow"], correctIndex: 2 },
      { question: "🔊 What do you sleep in?", options: ["Chair", "Table", "Bed", "Car"], correctIndex: 2 },
      { question: "🔊 Which one can fly?", options: ["Fish", "Dog", "Cat", "Bird"], correctIndex: 3 },
      { question: "🔊 What do you drink in the morning?", options: ["Milk", "Stone", "Paper", "Sand"], correctIndex: 0 },
      { question: "🔊 What do you wear on your feet?", options: ["Hat", "Shoes", "Gloves", "Belt"], correctIndex: 1 },
      { question: "🔊 What number comes after 3?", options: ["2", "5", "4", "1"], correctIndex: 2 },
      { question: "🔊 Which one is a fruit?", options: ["Carrot", "Potato", "Apple", "Onion"], correctIndex: 2 },
      { question: "🔊 What do you write with?", options: ["Pen", "Spoon", "Cup", "Shoe"], correctIndex: 0 },
      { question: "🔊 How many legs does a cat have?", options: ["Two", "Six", "Four", "Eight"], correctIndex: 2 },
    ],
  },

  // Level 5: Letter Builder - DragMatch (used as typing/spelling)
  5: {
    type: "typing",
    instruction: "Spell the word shown in the picture!",
    rounds: [
      { prompt: "🐱 _____", answer: "cat", hint: "3 letters, starts with C" },
      { prompt: "🐶 _____", answer: "dog", hint: "3 letters, starts with D" },
      { prompt: "🌞 _____", answer: "sun", hint: "3 letters, starts with S" },
      { prompt: "📚 _____", answer: "book", hint: "4 letters, starts with B" },
      { prompt: "🐟 _____", answer: "fish", hint: "4 letters, starts with F" },
      { prompt: "🌳 _____", answer: "tree", hint: "4 letters, starts with T" },
      { prompt: "🏠 _____", answer: "house", hint: "5 letters, starts with H" },
      { prompt: "🍎 _____", answer: "apple", hint: "5 letters, starts with A" },
      { prompt: "🚗 _____", answer: "car", hint: "3 letters, starts with C" },
      { prompt: "🎒 _____", answer: "bag", hint: "3 letters, starts with B" },
      { prompt: "🐦 _____", answer: "bird", hint: "4 letters, starts with B" },
      { prompt: "🌸 _____", answer: "flower", hint: "6 letters, starts with F" },
      { prompt: "💧 _____", answer: "water", hint: "5 letters, starts with W" },
      { prompt: "🍞 _____", answer: "bread", hint: "5 letters, starts with B" },
      { prompt: "⭐ _____", answer: "star", hint: "4 letters, starts with S" },
    ],
  },

  // Level 6: Syllable Splash - MultipleChoice
  6: {
    type: "multiple-choice",
    rounds: [
      { question: "How many syllables in 'cat'?", options: ["1", "2", "3"], correctIndex: 0, explanation: "Cat = cat (1 syllable)" },
      { question: "How many syllables in 'apple'?", options: ["1", "2", "3"], correctIndex: 1, explanation: "Ap-ple (2 syllables)" },
      { question: "How many syllables in 'banana'?", options: ["1", "2", "3"], correctIndex: 2, explanation: "Ba-na-na (3 syllables)" },
      { question: "How many syllables in 'dog'?", options: ["1", "2", "3"], correctIndex: 0, explanation: "Dog = dog (1 syllable)" },
      { question: "How many syllables in 'elephant'?", options: ["1", "2", "3"], correctIndex: 2, explanation: "El-e-phant (3 syllables)" },
      { question: "How many syllables in 'table'?", options: ["1", "2", "3"], correctIndex: 1, explanation: "Ta-ble (2 syllables)" },
      { question: "How many syllables in 'computer'?", options: ["1", "2", "3"], correctIndex: 2, explanation: "Com-pu-ter (3 syllables)" },
      { question: "How many syllables in 'tree'?", options: ["1", "2", "3"], correctIndex: 0, explanation: "Tree = tree (1 syllable)" },
      { question: "How many syllables in 'orange'?", options: ["1", "2", "3"], correctIndex: 1, explanation: "Or-ange (2 syllables)" },
      { question: "How many syllables in 'butterfly'?", options: ["1", "2", "3"], correctIndex: 2, explanation: "But-ter-fly (3 syllables)" },
      { question: "How many syllables in 'pencil'?", options: ["1", "2", "3"], correctIndex: 1, explanation: "Pen-cil (2 syllables)" },
      { question: "How many syllables in 'fish'?", options: ["1", "2", "3"], correctIndex: 0, explanation: "Fish = fish (1 syllable)" },
    ],
  },

  // Level 7: Word Crash (Pronunciation) - Typing
  7: {
    type: "typing",
    instruction: "Type the word you see! (Pronunciation practice)",
    rounds: [
      { prompt: "Hello", answer: "hello" },
      { prompt: "Thank you", answer: "thank you" },
      { prompt: "Please", answer: "please" },
      { prompt: "Water", answer: "water" },
      { prompt: "Friend", answer: "friend" },
      { prompt: "School", answer: "school" },
      { prompt: "Happy", answer: "happy" },
      { prompt: "Morning", answer: "morning" },
      { prompt: "Beautiful", answer: "beautiful" },
      { prompt: "Important", answer: "important" },
      { prompt: "Chocolate", answer: "chocolate" },
      { prompt: "Library", answer: "library" },
      { prompt: "Comfortable", answer: "comfortable" },
      { prompt: "Vegetable", answer: "vegetable" },
      { prompt: "Wednesday", answer: "wednesday" },
    ],
  },

  // Level 8: Greeting Builder - SentenceBuilder
  8: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Build a greeting:", words: ["Hello", "my", "name", "is", "Ana"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Build a greeting:", words: ["Good", "morning", "teacher"], correctOrder: [0, 1, 2] },
      { instruction: "How do you respond?", words: ["Nice", "to", "meet", "you"], correctOrder: [0, 1, 2, 3] },
      { instruction: "Say goodbye:", words: ["See", "you", "tomorrow"], correctOrder: [0, 1, 2] },
      { instruction: "Introduce yourself:", words: ["I", "am", "a", "student"], correctOrder: [0, 1, 2, 3] },
      { instruction: "Ask a question:", words: ["How", "are", "you", "today"], correctOrder: [0, 1, 2, 3] },
      { instruction: "Respond to 'How are you?':", words: ["I", "am", "fine", "thank", "you"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Build a greeting:", words: ["Good", "evening", "sir"], correctOrder: [0, 1, 2] },
      { instruction: "Say goodbye politely:", words: ["It", "was", "nice", "meeting", "you"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Ask for a name:", words: ["What", "is", "your", "name"], correctOrder: [0, 1, 2, 3] },
    ],
  },

  // Level 9: Color Shape Quest - MultipleChoice
  9: {
    type: "multiple-choice",
    rounds: [
      { question: "Find the RED object:", options: ["🟢 Green circle", "🔴 Red circle", "🔵 Blue circle", "🟡 Yellow circle"], correctIndex: 1 },
      { question: "Find the BLUE object:", options: ["🟠 Orange square", "🟣 Purple square", "🔵 Blue square", "🟢 Green square"], correctIndex: 2 },
      { question: "Which is a triangle?", options: ["⬛ Square", "⚫ Circle", "🔺 Triangle", "⬜ Rectangle"], correctIndex: 2 },
      { question: "What color is the sun?", options: ["Blue", "Yellow", "Green", "Purple"], correctIndex: 1 },
      { question: "What shape is a door?", options: ["Circle", "Triangle", "Rectangle", "Star"], correctIndex: 2 },
      { question: "Find the big GREEN circle:", options: ["Small red circle", "Big green circle", "Small green circle", "Big red circle"], correctIndex: 1 },
      { question: "Which is a PURPLE star?", options: ["🟢 Green star", "🟡 Yellow star", "🟣 Purple star", "🔴 Red star"], correctIndex: 2 },
      { question: "What shape has 3 sides?", options: ["Square", "Circle", "Triangle", "Rectangle"], correctIndex: 2 },
      { question: "What color is grass?", options: ["Blue", "Red", "Green", "Orange"], correctIndex: 2 },
      { question: "Find the ORANGE rectangle:", options: ["Blue rectangle", "Green rectangle", "Red rectangle", "Orange rectangle"], correctIndex: 3 },
      { question: "How many sides does a square have?", options: ["3", "4", "5", "6"], correctIndex: 1 },
      { question: "Which is the smallest shape?", options: ["Big circle", "Medium circle", "Small circle", "Tiny circle"], correctIndex: 3 },
    ],
  },

  // Level 10: Foundation Boss - BossChallenge
  10: {
    type: "boss-challenge",
    bossName: "Dragon of Foundation",
    bossEmoji: "🐉",
    rounds: [
      { type: "mc", question: "Which letter makes the 'sss' sound?", options: ["Z", "S", "C", "X"], correctIndex: 1 },
      { type: "mc", question: "Match: 🐱 = ?", options: ["Dog", "Bird", "Cat", "Fish"], correctIndex: 2 },
      { type: "typing", question: "Spell the word: 🌞", correctAnswer: "sun" },
      { type: "mc", question: "How many syllables in 'elephant'?", options: ["1", "2", "3", "4"], correctIndex: 2 },
      { type: "mc", question: "Complete: 'Good ___ teacher!'", options: ["night", "morning", "bye", "no"], correctIndex: 1 },
      { type: "mc", question: "What color is the sky?", options: ["Red", "Blue", "Green", "Pink"], correctIndex: 1 },
      { type: "typing", question: "Spell: 🍎", correctAnswer: "apple" },
      { type: "mc", question: "Which letter comes after M?", options: ["L", "O", "N", "P"], correctIndex: 2 },
      { type: "mc", question: "🔊 'woof' — which animal?", options: ["Cat", "Dog", "Bird", "Fish"], correctIndex: 1 },
      { type: "mc", question: "What shape has 4 equal sides?", options: ["Triangle", "Circle", "Square", "Star"], correctIndex: 2 },
      { type: "typing", question: "Spell: 📚", correctAnswer: "book" },
      { type: "mc", question: "'Nice to ___ you' — fill blank:", options: ["see", "meet", "go", "eat"], correctIndex: 1 },
      { type: "mc", question: "How many syllables in 'cat'?", options: ["1", "2", "3"], correctIndex: 0 },
      { type: "typing", question: "Spell: 🐶", correctAnswer: "dog" },
      { type: "mc", question: "Which is a fruit?", options: ["Chair", "Banana", "Table", "Door"], correctIndex: 1 },
    ],
  },

  // === MODULE 2: ELEMENTARY ===

  // Level 11: Sentence Scaffold - SentenceBuilder
  11: {
    type: "sentence-builder",
    rounds: [
      { instruction: "A girl eats an apple:", words: ["She", "eats", "an", "apple"], correctOrder: [0, 1, 2, 3] },
      { instruction: "A boy reads a book:", words: ["He", "reads", "a", "book"], correctOrder: [0, 1, 2, 3] },
      { instruction: "They play in the park:", words: ["They", "play", "in", "the", "park"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "I drink water:", words: ["I", "drink", "water", "every", "day"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "She walks to school:", words: ["She", "walks", "to", "school"], correctOrder: [0, 1, 2, 3] },
      { instruction: "We like ice cream:", words: ["We", "like", "ice", "cream"], correctOrder: [0, 1, 2, 3] },
      { instruction: "The cat sleeps:", words: ["The", "cat", "sleeps", "on", "the", "sofa"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "My mom cooks dinner:", words: ["My", "mom", "cooks", "dinner"], correctOrder: [0, 1, 2, 3] },
      { instruction: "Birds fly in the sky:", words: ["Birds", "fly", "in", "the", "sky"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "He watches TV:", words: ["He", "watches", "TV", "at", "night"], correctOrder: [0, 1, 2, 3, 4] },
    ],
  },

  // Level 12: Verb Action Match - MultipleChoice
  12: {
    type: "multiple-choice",
    rounds: [
      { question: "🏃 What action is this?", options: ["Sleeping", "Running", "Cooking", "Reading"], correctIndex: 1 },
      { question: "📖 What action is this?", options: ["Jumping", "Dancing", "Reading", "Swimming"], correctIndex: 2 },
      { question: "🍳 What action is this?", options: ["Cooking", "Cleaning", "Singing", "Driving"], correctIndex: 0 },
      { question: "💤 What action is this?", options: ["Eating", "Walking", "Playing", "Sleeping"], correctIndex: 3 },
      { question: "'She ___ dinner every day' (cook)", options: ["cook", "cooks", "cooking", "cooked"], correctIndex: 1, explanation: "Third person singular: she cooks" },
      { question: "'They ___ football after school' (play)", options: ["plays", "playing", "play", "played"], correctIndex: 2, explanation: "They + base verb: they play" },
      { question: "'He ___ to work every morning' (drive)", options: ["drive", "driving", "drived", "drives"], correctIndex: 3, explanation: "Third person singular: he drives" },
      { question: "'I ___ English at school' (study)", options: ["studies", "study", "studying", "studyed"], correctIndex: 1, explanation: "First person: I study" },
      { question: "🎵 What action is this?", options: ["Reading", "Singing", "Sleeping", "Eating"], correctIndex: 1 },
      { question: "'The dog ___ in the garden' (run)", options: ["run", "running", "runs", "runned"], correctIndex: 2, explanation: "Third person: the dog runs" },
      { question: "🏊 What action is this?", options: ["Swimming", "Flying", "Running", "Jumping"], correctIndex: 0 },
      { question: "'We ___ to music every day' (listen)", options: ["listens", "listening", "listen", "listened"], correctIndex: 2 },
    ],
  },

  // Level 13: Tense Tower - CategorySort
  13: {
    type: "category-sort",
    categories: ["Every Day (Simple)", "Right Now (Continuous)"],
    rounds: [
      { item: "She walks to school", categoryIndex: 0 },
      { item: "She is walking to school", categoryIndex: 1 },
      { item: "I eat breakfast every morning", categoryIndex: 0 },
      { item: "I am eating breakfast right now", categoryIndex: 1 },
      { item: "He plays football on Sundays", categoryIndex: 0 },
      { item: "He is playing football at the moment", categoryIndex: 1 },
      { item: "They study English every day", categoryIndex: 0 },
      { item: "They are studying English now", categoryIndex: 1 },
      { item: "The sun rises in the east", categoryIndex: 0 },
      { item: "Look! It is raining outside", categoryIndex: 1 },
      { item: "We always drink tea", categoryIndex: 0 },
      { item: "We are drinking tea right now", categoryIndex: 1 },
      { item: "She usually reads before bed", categoryIndex: 0 },
      { item: "She is reading a new book today", categoryIndex: 1 },
      { item: "Dogs bark at strangers", categoryIndex: 0 },
      { item: "The dog is barking at the mailman", categoryIndex: 1 },
    ],
  },

  // Level 14: Preposition Playground - MultipleChoice
  14: {
    type: "multiple-choice",
    rounds: [
      { question: "The cat is ___ the table", options: ["on", "in", "at", "between"], correctIndex: 0, explanation: "'On' means resting on top of a surface" },
      { question: "The ball is ___ the box", options: ["on", "in", "at", "above"], correctIndex: 1, explanation: "'In' means inside something" },
      { question: "She is ___ school", options: ["in", "on", "at", "under"], correctIndex: 2, explanation: "'At' is used for locations/buildings" },
      { question: "The dog is ___ the table", options: ["on", "above", "under", "between"], correctIndex: 2, explanation: "'Under' means below something" },
      { question: "The picture is ___ the sofa", options: ["under", "in", "above", "at"], correctIndex: 2, explanation: "'Above' means higher than" },
      { question: "The shop is ___ the bank and the school", options: ["in", "on", "between", "under"], correctIndex: 2 },
      { question: "The park is ___ the school", options: ["next to", "in", "on", "under"], correctIndex: 0 },
      { question: "The tree is ___ the house", options: ["on", "in", "behind", "under"], correctIndex: 2, explanation: "'Behind' means at the back of" },
      { question: "The car is ___ the building", options: ["behind", "in front of", "under", "above"], correctIndex: 1 },
      { question: "The library is ___ the park", options: ["on", "in", "near", "under"], correctIndex: 2 },
      { question: "Put the book ___ the shelf", options: ["under", "on", "between", "near"], correctIndex: 1 },
      { question: "The cat is hiding ___ the curtain", options: ["on", "behind", "above", "at"], correctIndex: 1 },
    ],
  },

  // Level 15: Adjective Adventure - MultipleChoice
  15: {
    type: "multiple-choice",
    rounds: [
      { question: "Which is BIGGER: a cat or an elephant?", options: ["Cat", "Elephant"], correctIndex: 1 },
      { question: "Which is FASTER: a snail or a cheetah?", options: ["Snail", "Cheetah"], correctIndex: 1 },
      { question: "What is the comparative of 'tall'?", options: ["tallest", "taller", "more tall", "tallier"], correctIndex: 1 },
      { question: "What is the superlative of 'big'?", options: ["bigger", "most big", "biggest", "bigest"], correctIndex: 2 },
      { question: "The ___ girl in class won the prize", options: ["smart", "smarter", "smartest", "more smart"], correctIndex: 2, explanation: "Superlative: the smartest (of all)" },
      { question: "This book is ___ than that one", options: ["interesting", "more interesting", "most interesting", "interestinger"], correctIndex: 1 },
      { question: "She is ___ than her sister", options: ["young", "younger", "youngest", "more young"], correctIndex: 1 },
      { question: "It is the ___ day of the year", options: ["hot", "hotter", "hottest", "more hot"], correctIndex: 2 },
      { question: "'Happy' → comparative:", options: ["happyer", "more happy", "happier", "most happy"], correctIndex: 2 },
      { question: "A ___ cat sat on the mat", options: ["small, black", "black, small"], correctIndex: 0, explanation: "Size before color in English" },
      { question: "The elephant is very ___", options: ["small", "tiny", "large", "short"], correctIndex: 2 },
      { question: "'Good' → comparative:", options: ["gooder", "more good", "better", "best"], correctIndex: 2 },
    ],
  },

  // Level 16: Fill the Blank Dash - FillInBlank
  16: {
    type: "fill-in-blank",
    rounds: [
      { sentence: "She ___ to school every day.", options: ["walk", "walks", "walking", "walked"], correctIndex: 1 },
      { sentence: "The cat is ___ the table.", options: ["on", "at", "to", "for"], correctIndex: 0 },
      { sentence: "He is ___ than his brother.", options: ["tall", "taller", "tallest", "more tall"], correctIndex: 1 },
      { sentence: "They ___ playing football right now.", options: ["is", "am", "are", "be"], correctIndex: 2 },
      { sentence: "I always ___ breakfast at 7 AM.", options: ["eating", "eats", "eat", "ate"], correctIndex: 2 },
      { sentence: "The book is ___ the desk.", options: ["at", "on", "to", "for"], correctIndex: 1 },
      { sentence: "She is the ___ girl in class.", options: ["smart", "smarter", "smartest", "more smart"], correctIndex: 2 },
      { sentence: "We ___ English every Monday.", options: ["study", "studies", "studying", "studied"], correctIndex: 0 },
      { sentence: "The bird is ___ in the sky.", options: ["fly", "flying", "flies", "flew"], correctIndex: 1 },
      { sentence: "My house is ___ the park.", options: ["between", "near", "on", "in"], correctIndex: 1 },
      { sentence: "He ___ TV every evening.", options: ["watch", "watches", "watching", "watched"], correctIndex: 1 },
      { sentence: "This is the ___ movie I have ever seen.", options: ["good", "better", "best", "most good"], correctIndex: 2 },
    ],
  },

  // Level 17: Listening Labyrinth - MultipleChoice
  17: {
    type: "multiple-choice",
    rounds: [
      { question: "🔊 'Turn left' — Which direction?", options: ["→ Right", "← Left", "↑ Straight", "↓ Back"], correctIndex: 1 },
      { question: "🔊 'Go straight ahead' — Which direction?", options: ["← Left", "→ Right", "↑ Straight", "↓ Back"], correctIndex: 2 },
      { question: "🔊 'Turn right at the corner' — ?", options: ["← Left", "→ Right", "↑ Straight", "Go back"], correctIndex: 1 },
      { question: "🔊 'Stop!' — What should you do?", options: ["Run", "Jump", "Stop", "Turn"], correctIndex: 2 },
      { question: "🔊 'Go back' — What does it mean?", options: ["Move forward", "Return", "Turn left", "Stop"], correctIndex: 1 },
      { question: "What does 'straight ahead' mean?", options: ["Turn around", "Go forward", "Stop", "Turn right"], correctIndex: 1 },
      { question: "Follow: 'Go straight, then turn right'", options: ["→ then ↑", "↑ then →", "← then ↑", "↑ then ←"], correctIndex: 1 },
      { question: "🔊 'The library is on your left' — Where is it?", options: ["Right side", "Left side", "Behind you", "Above"], correctIndex: 1 },
      { question: "What is the opposite of 'left'?", options: ["Up", "Down", "Right", "Straight"], correctIndex: 2 },
      { question: "🔊 'Take the second right' — meaning?", options: ["Turn right now", "Pass one, turn right at next", "Go straight", "Turn left twice"], correctIndex: 1 },
    ],
  },

  // Level 18: Spelling Bee Buzz - Typing
  18: {
    type: "typing",
    instruction: "Spell the word correctly!",
    rounds: [
      { prompt: "The opposite of 'hot'", answer: "cold" },
      { prompt: "A place where you learn", answer: "school" },
      { prompt: "The color of bananas", answer: "yellow" },
      { prompt: "You use it to write", answer: "pencil" },
      { prompt: "The day after Monday", answer: "tuesday" },
      { prompt: "The opposite of 'big'", answer: "small" },
      { prompt: "A baby cat", answer: "kitten" },
      { prompt: "You eat it for breakfast (🍳)", answer: "egg" },
      { prompt: "The month after March", answer: "april" },
      { prompt: "Not short, but ___", answer: "tall" },
      { prompt: "A room for cooking", answer: "kitchen" },
      { prompt: "The number after twelve", answer: "thirteen" },
      { prompt: "You sleep in a ___", answer: "bed" },
      { prompt: "The opposite of 'young'", answer: "old" },
      { prompt: "A round fruit, color is orange", answer: "orange" },
    ],
  },

  // Level 19: Pronoun Swap - FillInBlank
  19: {
    type: "fill-in-blank",
    rounds: [
      { sentence: "Maria loves Maria's dog → ___ loves ___ dog", options: ["She / her", "He / his", "They / their", "We / our"], correctIndex: 0 },
      { sentence: "John is tall → ___ is tall", options: ["She", "He", "They", "It"], correctIndex: 1 },
      { sentence: "The children play → ___ play", options: ["He", "She", "We", "They"], correctIndex: 3 },
      { sentence: "Give the book to Tom → Give the book to ___", options: ["he", "him", "his", "her"], correctIndex: 1 },
      { sentence: "This is Sara's pen → This is ___ pen", options: ["his", "her", "their", "our"], correctIndex: 1 },
      { sentence: "My brother and I study → ___ study", options: ["They", "He", "We", "You"], correctIndex: 2 },
      { sentence: "The cat lost the cat's toy → ___ lost ___ toy", options: ["It / its", "He / his", "She / her", "They / their"], correctIndex: 0 },
      { sentence: "Tell Lisa and me → Tell ___", options: ["we", "us", "our", "them"], correctIndex: 1 },
      { sentence: "The students finished ___ homework", options: ["his", "her", "its", "their"], correctIndex: 3 },
      { sentence: "I gave ___ my phone number", options: ["she", "her", "hers", "herself"], correctIndex: 1 },
      { sentence: "Is this ___ coat? (you)", options: ["you", "your", "yours", "you're"], correctIndex: 1 },
      { sentence: "Paul and Tim went to ___ house", options: ["his", "her", "their", "its"], correctIndex: 2 },
    ],
  },

  // Level 20: Elementary Boss - BossChallenge
  20: {
    type: "boss-challenge",
    bossName: "Quiz Show Host",
    bossEmoji: "🎩",
    rounds: [
      { type: "mc", question: "Present simple or continuous? 'She is cooking right now'", options: ["Simple", "Continuous"], correctIndex: 1 },
      { type: "mc", question: "The cat is ___ the chair", options: ["at", "under", "to", "for"], correctIndex: 1 },
      { type: "mc", question: "'Good' → superlative:", options: ["goodest", "most good", "better", "best"], correctIndex: 3 },
      { type: "typing", question: "Spell: the opposite of 'hot'", correctAnswer: "cold" },
      { type: "mc", question: "Replace 'John and Mary': ___", options: ["He", "She", "We", "They"], correctIndex: 3 },
      { type: "mc", question: "She ___ to school every day", options: ["go", "goes", "going", "gone"], correctIndex: 1 },
      { type: "mc", question: "'Tall' → comparative:", options: ["tallest", "more tall", "taller", "tallier"], correctIndex: 2 },
      { type: "typing", question: "Spell: a place where you learn", correctAnswer: "school" },
      { type: "mc", question: "They ___ playing right now", options: ["is", "am", "are", "be"], correctIndex: 2 },
      { type: "mc", question: "The book is ___ the desk", options: ["in", "on", "at", "under"], correctIndex: 1 },
      { type: "mc", question: "Give the book to ___ (she)", options: ["she", "her", "hers", "herself"], correctIndex: 1 },
      { type: "typing", question: "Spell: the day after Monday", correctAnswer: "tuesday" },
      { type: "mc", question: "🔊 'Turn left' means:", options: ["Go right", "Go left", "Go straight", "Stop"], correctIndex: 1 },
      { type: "mc", question: "He ___ TV every evening", options: ["watch", "watches", "watching"], correctIndex: 1 },
      { type: "mc", question: "This is the ___ movie ever", options: ["good", "better", "best"], correctIndex: 2 },
    ],
  },

  // === MODULE 3: INTERMEDIATE ===

  // Level 21: Idiom Explorer - DragMatch
  21: {
    type: "drag-match",
    leftLabel: "Idiom",
    rightLabel: "Meaning",
    rounds: [
      { pairs: [
        { left: "Break the ice", right: "Start a conversation" },
        { left: "Piece of cake", right: "Very easy" },
        { left: "Hit the books", right: "Study hard" },
        { left: "Under the weather", right: "Feeling sick" },
      ]},
      { pairs: [
        { left: "Bite the bullet", right: "Face something difficult" },
        { left: "Cost an arm and a leg", right: "Very expensive" },
        { left: "Let the cat out of the bag", right: "Reveal a secret" },
        { left: "Once in a blue moon", right: "Very rarely" },
      ]},
      { pairs: [
        { left: "Spill the beans", right: "Tell a secret" },
        { left: "The ball is in your court", right: "It's your decision" },
        { left: "Kill two birds with one stone", right: "Solve two problems at once" },
        { left: "Burning the midnight oil", right: "Working late at night" },
      ]},
    ],
  },

  // Level 22: Paragraph Puzzle - SentenceBuilder
  22: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Order these sentences into a paragraph:", words: ["Dogs are great pets.", "They are loyal and friendly.", "Many families have dogs.", "Dogs need exercise and love."], correctOrder: [2, 0, 1, 3] },
      { instruction: "Order into a paragraph:", words: ["First, I wake up early.", "Then, I eat breakfast.", "After that, I go to school.", "Finally, I come home and study."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Build a coherent paragraph:", words: ["The weather was beautiful.", "We decided to go to the beach.", "We swam in the ocean all day.", "It was the best day of summer."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Order this paragraph:", words: ["Reading is important for everyone.", "It helps improve vocabulary.", "Books can take you to new worlds.", "You should read every day."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Arrange the paragraph:", words: ["Technology has changed our lives.", "We use phones every day.", "The internet connects people worldwide.", "Technology will continue to grow."], correctOrder: [0, 1, 2, 3] },
    ],
  },

  // Level 23: Synonym & Antonym Arena - CategorySort
  23: {
    type: "category-sort",
    categories: ["Synonym (Same)", "Antonym (Opposite)"],
    rounds: [
      { item: "Happy → Joyful", categoryIndex: 0 },
      { item: "Happy → Sad", categoryIndex: 1 },
      { item: "Big → Large", categoryIndex: 0 },
      { item: "Big → Small", categoryIndex: 1 },
      { item: "Fast → Quick", categoryIndex: 0 },
      { item: "Fast → Slow", categoryIndex: 1 },
      { item: "Beautiful → Ugly", categoryIndex: 1 },
      { item: "Beautiful → Gorgeous", categoryIndex: 0 },
      { item: "Smart → Intelligent", categoryIndex: 0 },
      { item: "Smart → Stupid", categoryIndex: 1 },
      { item: "Hot → Cold", categoryIndex: 1 },
      { item: "Hot → Warm", categoryIndex: 0 },
      { item: "Strong → Powerful", categoryIndex: 0 },
      { item: "Strong → Weak", categoryIndex: 1 },
      { item: "Brave → Courageous", categoryIndex: 0 },
      { item: "Brave → Cowardly", categoryIndex: 1 },
    ],
  },

  // Level 24: Conditional Crossroads - MultipleChoice
  24: {
    type: "multiple-choice",
    rounds: [
      { question: "If it rains tomorrow, ___", options: ["I will bring an umbrella", "I would bring an umbrella", "I brought an umbrella"], correctIndex: 0, explanation: "First conditional: If + present, will + base verb" },
      { question: "If I were rich, ___", options: ["I will buy a house", "I would buy a house", "I buy a house"], correctIndex: 1, explanation: "Second conditional: If + past, would + base verb" },
      { question: "If she studies hard, ___", options: ["she would pass", "she will pass", "she passed"], correctIndex: 1 },
      { question: "If I had wings, ___", options: ["I will fly", "I would fly", "I fly"], correctIndex: 1 },
      { question: "If you heat water to 100°C, ___", options: ["it boils", "it would boil", "it will boil"], correctIndex: 0, explanation: "Zero conditional: general truth" },
      { question: "If we leave now, ___", options: ["we will arrive on time", "we would arrive on time", "we arrived on time"], correctIndex: 0 },
      { question: "If I were you, ___", options: ["I will study more", "I would study more", "I study more"], correctIndex: 1 },
      { question: "If it snows, ___", options: ["the roads become slippery", "the roads would become", "the roads became"], correctIndex: 0 },
      { question: "If he had more time, ___", options: ["he will travel", "he would travel", "he travels"], correctIndex: 1 },
      { question: "If you mix red and blue, ___", options: ["you get purple", "you will get purple", "you would get purple"], correctIndex: 0 },
    ],
  },

  // Level 25: Reading Comprehension - MultipleChoice (with passage)
  25: {
    type: "multiple-choice",
    rounds: [
      { passage: "Tom wakes up at 6 AM every day. He eats breakfast with his family. Then he walks to school. His favorite subject is science because he loves experiments. After school, he plays soccer with his friends.", question: "What time does Tom wake up?", options: ["5 AM", "6 AM", "7 AM", "8 AM"], correctIndex: 1 },
      { passage: "Tom wakes up at 6 AM every day. He eats breakfast with his family. Then he walks to school. His favorite subject is science because he loves experiments. After school, he plays soccer with his friends.", question: "What is Tom's favorite subject?", options: ["Math", "English", "Science", "History"], correctIndex: 2 },
      { passage: "Tom wakes up at 6 AM every day. He eats breakfast with his family. Then he walks to school. His favorite subject is science because he loves experiments. After school, he plays soccer with his friends.", question: "What does Tom do after school?", options: ["Studies", "Watches TV", "Plays soccer", "Sleeps"], correctIndex: 2 },
      { passage: "The Amazon rainforest is the largest tropical rainforest in the world. It covers parts of nine countries in South America. The forest is home to millions of species of animals, plants, and insects. Scientists call it 'the lungs of the Earth' because it produces a large amount of the world's oxygen.", question: "Where is the Amazon rainforest?", options: ["Africa", "Asia", "South America", "Europe"], correctIndex: 2 },
      { passage: "The Amazon rainforest is the largest tropical rainforest in the world. It covers parts of nine countries in South America. The forest is home to millions of species of animals, plants, and insects. Scientists call it 'the lungs of the Earth' because it produces a large amount of the world's oxygen.", question: "Why is it called 'the lungs of the Earth'?", options: ["It's shaped like lungs", "It produces oxygen", "It's very large", "Animals breathe there"], correctIndex: 1 },
      { passage: "Maria started a small garden last spring. She planted tomatoes, peppers, and herbs. Every morning, she watered her plants and checked for insects. By summer, her garden was full of fresh vegetables. She shared them with her neighbors.", question: "When did Maria start her garden?", options: ["Summer", "Fall", "Winter", "Spring"], correctIndex: 3 },
      { passage: "Maria started a small garden last spring. She planted tomatoes, peppers, and herbs. Every morning, she watered her plants and checked for insects. By summer, her garden was full of fresh vegetables. She shared them with her neighbors.", question: "What did Maria do with her vegetables?", options: ["Sold them", "Shared with neighbors", "Threw them away", "Kept them all"], correctIndex: 1 },
      { passage: "The internet was created in the 1960s for military communication. It became available to the public in the 1990s. Today, billions of people use the internet every day for work, education, and entertainment. Social media has changed how people communicate with each other.", question: "When did the internet become public?", options: ["1960s", "1970s", "1980s", "1990s"], correctIndex: 3 },
      { passage: "The internet was created in the 1960s for military communication. It became available to the public in the 1990s. Today, billions of people use the internet every day for work, education, and entertainment. Social media has changed how people communicate with each other.", question: "What was the internet originally created for?", options: ["Entertainment", "Education", "Military communication", "Social media"], correctIndex: 2 },
      { passage: "Exercise is important for a healthy body and mind. Walking for just 30 minutes a day can reduce stress and improve mood. Regular exercise helps prevent many diseases. Doctors recommend at least 150 minutes of exercise per week.", question: "How much exercise do doctors recommend per week?", options: ["30 minutes", "60 minutes", "100 minutes", "150 minutes"], correctIndex: 3 },
    ],
  },

  // Level 26: Phrasal Verb Frenzy - DragMatch
  26: {
    type: "drag-match",
    leftLabel: "Meaning",
    rightLabel: "Phrasal Verb",
    rounds: [
      { pairs: [
        { left: "Stop trying", right: "Give up" },
        { left: "Search for information", right: "Look up" },
        { left: "Enter a vehicle", right: "Get in" },
        { left: "Start a journey", right: "Set off" },
      ]},
      { pairs: [
        { left: "Activate (a device)", right: "Turn on" },
        { left: "Deactivate", right: "Turn off" },
        { left: "Wait a moment", right: "Hold on" },
        { left: "Take care of", right: "Look after" },
      ]},
      { pairs: [
        { left: "Discover by chance", right: "Come across" },
        { left: "Stop functioning", right: "Break down" },
        { left: "Continue", right: "Carry on" },
        { left: "Investigate", right: "Look into" },
      ]},
      { pairs: [
        { left: "Complete a form", right: "Fill in" },
        { left: "Appear, arrive", right: "Show up" },
        { left: "Reject", right: "Turn down" },
        { left: "Invent", right: "Make up" },
      ]},
    ],
  },

  // Level 27: Dictation Dash - Typing
  27: {
    type: "typing",
    instruction: "Type the sentence you hear (read the prompt and type it)",
    rounds: [
      { prompt: "The cat sat on the mat", answer: "the cat sat on the mat" },
      { prompt: "She goes to school every day", answer: "she goes to school every day" },
      { prompt: "We had a wonderful time", answer: "we had a wonderful time" },
      { prompt: "The children are playing outside", answer: "the children are playing outside" },
      { prompt: "He bought a new book yesterday", answer: "he bought a new book yesterday" },
      { prompt: "Please open the window", answer: "please open the window" },
      { prompt: "My mother cooks delicious food", answer: "my mother cooks delicious food" },
      { prompt: "They will arrive tomorrow morning", answer: "they will arrive tomorrow morning" },
      { prompt: "I have been studying English for two years", answer: "i have been studying english for two years" },
      { prompt: "The weather is beautiful today", answer: "the weather is beautiful today" },
      { prompt: "She forgot to bring her umbrella", answer: "she forgot to bring her umbrella" },
      { prompt: "We should protect the environment", answer: "we should protect the environment" },
    ],
  },

  // Level 28: Story Builder - StoryChoice
  28: {
    type: "story-choice",
    rounds: [
      { storyText: "Once upon a time, there was a young girl named Lily who lived in a small village near a forest.", question: "What happens next?", options: ["One day, she found a mysterious map in her grandmother's attic.", "She decided to become a doctor.", "She moved to a big city."], correctIndex: 0 },
      { storyText: "Lily studied the map carefully. It showed a path through the forest leading to a hidden cave marked with an X.", question: "What should Lily do?", options: ["She threw the map away.", "She packed her bag and followed the map into the forest.", "She gave the map to her teacher."], correctIndex: 1 },
      { storyText: "Deep in the forest, Lily came to a crossroads. The map showed she should go left, but she heard a strange sound coming from the right.", question: "Which path did she choose?", options: ["She followed the map and went left, staying on the safe path.", "She went home.", "She sat down and cried."], correctIndex: 0 },
      { storyText: "After walking for an hour, Lily found the hidden cave. Inside, she discovered old books filled with stories and a golden key.", question: "What did Lily do with the golden key?", options: ["She left it there.", "She used it to open a small locked chest in the corner of the cave.", "She sold it at the market."], correctIndex: 1 },
      { storyText: "Inside the chest, Lily found a letter from her great-grandmother, explaining that the cave was a secret library for the village.", question: "How does the story end?", options: ["Lily told the village about the library and everyone came to read the books.", "Lily forgot about everything.", "Lily burned the books."], correctIndex: 0 },
      { storyText: "The village celebrated Lily's discovery. The secret library became a place where children and adults came to learn and share stories.", question: "What is the moral of the story?", options: ["Never explore alone", "Curiosity and courage can lead to wonderful discoveries", "Maps are always wrong"], correctIndex: 1 },
    ],
  },

  // Level 29: Debate Simulator - MultipleChoice
  29: {
    type: "multiple-choice",
    rounds: [
      { question: "Topic: 'Should school start later?' — Your opponent says: 'Students are too tired in the morning.' Choose your response:", options: ["I agree. Research shows teens need more sleep for better learning.", "I don't care about sleep.", "That's completely wrong, students are never tired."], correctIndex: 0, explanation: "A strong argument acknowledges the point and adds evidence" },
      { question: "Your opponent says: 'Later start times mean less time for after-school activities.' Respond:", options: ["Activities don't matter at all.", "That's a valid concern, but academic performance should come first.", "You're wrong about everything."], correctIndex: 1 },
      { question: "Topic: 'Is technology helpful for children?' — Argue FOR technology:", options: ["Technology makes children lazy.", "Educational apps and online resources can make learning fun and interactive.", "Children should never use technology."], correctIndex: 1 },
      { question: "Your opponent says: 'Too much screen time is bad.' Respond:", options: ["Screen time is always good.", "You're right that moderation is key. However, with proper limits, technology offers huge benefits.", "I refuse to discuss this."], correctIndex: 1 },
      { question: "Make a concession (agree partially):", options: ["I completely disagree with everything you said.", "While I see your point about screen time, I believe the benefits outweigh the risks.", "You are wrong."], correctIndex: 1, explanation: "Making a concession shows maturity in argumentation" },
      { question: "Give a strong closing argument:", options: ["In conclusion, I'm always right.", "Whatever, let's stop.", "To summarize, with proper guidance, technology enhances learning, creativity, and access to information."], correctIndex: 2 },
    ],
  },

  // Level 30: Intermediate Boss - BossChallenge
  30: {
    type: "boss-challenge",
    bossName: "Treasure Guardian",
    bossEmoji: "🏴‍☠️",
    rounds: [
      { type: "mc", question: "'Break the ice' means:", options: ["Literally break ice", "Start a conversation", "End a fight", "Cool down"], correctIndex: 1 },
      { type: "mc", question: "If I were a bird, I ___ fly", options: ["will", "would", "can", "did"], correctIndex: 1 },
      { type: "mc", question: "'Happy' synonym:", options: ["Sad", "Angry", "Joyful", "Tired"], correctIndex: 2 },
      { type: "typing", question: "'Stop trying' = phrasal verb: give ___", correctAnswer: "up" },
      { type: "mc", question: "If you heat water to 100°C, it ___", options: ["would boil", "will boil", "boils", "boiled"], correctIndex: 2 },
      { type: "mc", question: "'Big' antonym:", options: ["Large", "Huge", "Small", "Tall"], correctIndex: 2 },
      { type: "mc", question: "Correct order: 'She / every day / to school / walks'", options: ["She walks to school every day", "Every day she to school walks", "To school she walks every day"], correctIndex: 0 },
      { type: "typing", question: "Spell: the opposite of 'beautiful'", correctAnswer: "ugly" },
      { type: "mc", question: "Second conditional uses:", options: ["If + present, will", "If + past, would", "If + future, can"], correctIndex: 1 },
      { type: "mc", question: "'Turn on' means:", options: ["Rotate", "Activate", "Move", "Dance"], correctIndex: 1 },
      { type: "mc", question: "Which is a topic sentence?", options: ["In conclusion.", "For example.", "Dogs make wonderful pets for many reasons.", "Also, they are fun."], correctIndex: 2 },
      { type: "typing", question: "'Search for info' = phrasal verb: look ___", correctAnswer: "up" },
    ],
  },

  // === MODULE 4: UPPER INTERMEDIATE ===

  // Level 31: Academic Word Wall - FillInBlank
  31: {
    type: "fill-in-blank",
    rounds: [
      { sentence: "The researcher will ___ the data before publishing.", options: ["analyze", "create", "ignore", "forget"], correctIndex: 0, explanation: "'Analyze' means to examine in detail" },
      { sentence: "The study had a significant ___ on the field.", options: ["problem", "impact", "color", "taste"], correctIndex: 1 },
      { sentence: "Students must ___ their thesis by June.", options: ["eat", "submit", "forget", "hide"], correctIndex: 1 },
      { sentence: "The ___ of the experiment was to test the hypothesis.", options: ["color", "objective", "weight", "sound"], correctIndex: 1 },
      { sentence: "They need to ___ their approach to the problem.", options: ["modify", "destroy", "ignore", "smell"], correctIndex: 0 },
      { sentence: "The findings ___ the previous research.", options: ["contradict", "eat", "sleep", "paint"], correctIndex: 0 },
      { sentence: "The teacher will ___ the concepts in class.", options: ["burn", "illustrate", "taste", "sleep"], correctIndex: 1 },
      { sentence: "We need more ___ to support this claim.", options: ["music", "evidence", "water", "color"], correctIndex: 1 },
      { sentence: "The policy was designed to ___ equality.", options: ["destroy", "prevent", "promote", "hide"], correctIndex: 2 },
      { sentence: "The author provides a detailed ___.", options: ["song", "analysis", "recipe", "joke"], correctIndex: 1 },
      { sentence: "Climate change is a ___ issue.", options: ["tiny", "trivial", "significant", "funny"], correctIndex: 2 },
      { sentence: "The ___ suggests a new methodology.", options: ["research", "sport", "meal", "game"], correctIndex: 0 },
    ],
  },

  // Level 32: Essay Architect - SentenceBuilder
  32: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Build an essay introduction:", words: ["Education is essential for personal growth.", "It opens doors to new opportunities.", "In this essay, I will discuss its importance.", "Many people underestimate the value of education."], correctOrder: [3, 0, 1, 2] },
      { instruction: "Order body paragraph:", words: ["Firstly, education improves critical thinking.", "Students learn to analyze information.", "This skill is valuable in everyday life.", "For example, making informed decisions."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Build a conclusion:", words: ["In conclusion, education transforms lives.", "It provides knowledge and skills.", "Everyone deserves access to quality education.", "Therefore, we must invest in our schools."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Order argumentative paragraph:", words: ["Some argue that technology harms learning.", "However, studies show it can enhance education.", "For instance, interactive apps improve engagement.", "The key is using technology wisely."], correctOrder: [0, 1, 2, 3] },
      { instruction: "Build supporting paragraph:", words: ["Moreover, exercise improves mental health.", "Physical activity releases endorphins.", "These chemicals reduce stress and anxiety.", "Regular exercise leads to a happier life."], correctOrder: [0, 1, 2, 3] },
    ],
  },

  // Level 33: Passive Voice - SentenceBuilder
  33: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Convert to passive: 'She wrote the letter'", words: ["The letter", "was", "written", "by", "her"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Convert to passive: 'They build houses'", words: ["Houses", "are", "built", "by", "them"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Convert to passive: 'He painted the wall'", words: ["The wall", "was", "painted", "by", "him"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Convert to passive: 'She has written a book'", words: ["A book", "has been", "written", "by", "her"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Convert to passive: 'People speak English worldwide'", words: ["English", "is", "spoken", "worldwide"], correctOrder: [0, 1, 2, 3] },
      { instruction: "Convert to passive: 'They will finish the project'", words: ["The project", "will be", "finished", "by", "them"], correctOrder: [0, 1, 2, 3, 4] },
      { instruction: "Convert to passive: 'Someone stole my car'", words: ["My car", "was", "stolen"], correctOrder: [0, 1, 2] },
      { instruction: "Convert to passive: 'They are building a new school'", words: ["A new school", "is being", "built"], correctOrder: [0, 1, 2] },
    ],
  },

  // Level 34: Reported Speech - SentenceBuilder
  34: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Direct → Reported: 'I am happy' he said", words: ["He", "said", "that", "he", "was", "happy"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "'I will come tomorrow' she said", words: ["She", "said", "that", "she", "would", "come", "the next day"], correctOrder: [0, 1, 2, 3, 4, 5, 6] },
      { instruction: "'I like pizza' he told me", words: ["He", "told me", "that", "he", "liked", "pizza"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "'We are studying' they said", words: ["They", "said", "that", "they", "were", "studying"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "'I have finished' she said", words: ["She", "said", "that", "she", "had", "finished"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "'I can swim' he said", words: ["He", "said", "that", "he", "could", "swim"], correctOrder: [0, 1, 2, 3, 4, 5] },
    ],
  },

  // Level 35: Advanced Listening Lab - MultipleChoice (passage-based)
  35: {
    type: "multiple-choice",
    rounds: [
      { passage: "Good morning, everyone. Today's lecture focuses on renewable energy sources. Solar power has grown by 25% in the last five years. Wind energy is now the cheapest form of electricity in many countries. However, the main challenge remains energy storage, as both solar and wind are intermittent sources.", question: "What has grown by 25% in five years?", options: ["Wind energy", "Solar power", "Nuclear energy", "Coal usage"], correctIndex: 1 },
      { passage: "Good morning, everyone. Today's lecture focuses on renewable energy sources. Solar power has grown by 25% in the last five years. Wind energy is now the cheapest form of electricity in many countries. However, the main challenge remains energy storage, as both solar and wind are intermittent sources.", question: "What is the main challenge mentioned?", options: ["Cost", "Energy storage", "Public opinion", "Space"], correctIndex: 1 },
      { passage: "In an interview, Dr. Smith said: 'The key to learning a new language is consistent practice. Even 15 minutes a day can lead to significant improvement over a year. The biggest mistake learners make is trying to be perfect from the start.'", question: "How much daily practice does Dr. Smith recommend?", options: ["1 hour", "30 minutes", "15 minutes", "5 minutes"], correctIndex: 2 },
      { passage: "In an interview, Dr. Smith said: 'The key to learning a new language is consistent practice. Even 15 minutes a day can lead to significant improvement over a year. The biggest mistake learners make is trying to be perfect from the start.'", question: "What is the biggest mistake learners make?", options: ["Not studying enough", "Trying to be perfect from the start", "Using only one method", "Studying too much"], correctIndex: 1 },
      { passage: "The panel discussed the future of remote work. Panelist A argued that remote work increases productivity. Panelist B countered that it can lead to isolation and reduced collaboration. They agreed that a hybrid model offers the best of both worlds.", question: "What did the panelists agree on?", options: ["Remote work is best", "Office work is best", "A hybrid model is ideal", "Work should be eliminated"], correctIndex: 2 },
      { passage: "The population of urban areas has been increasing steadily. By 2050, it is estimated that 68% of the world's population will live in cities. This urbanization brings challenges including housing shortages, traffic congestion, and environmental pollution.", question: "What percentage will live in cities by 2050?", options: ["50%", "60%", "68%", "75%"], correctIndex: 2 },
    ],
  },

  // Level 36: Collocation Connector - DragMatch
  36: {
    type: "drag-match",
    leftLabel: "Verb/Adjective",
    rightLabel: "Collocation Partner",
    rounds: [
      { pairs: [
        { left: "make", right: "a decision" },
        { left: "do", right: "homework" },
        { left: "take", right: "a shower" },
        { left: "have", right: "a meeting" },
      ]},
      { pairs: [
        { left: "heavy", right: "rain" },
        { left: "strong", right: "coffee" },
        { left: "fast", right: "food" },
        { left: "deep", right: "sleep" },
      ]},
      { pairs: [
        { left: "pay", right: "attention" },
        { left: "keep", right: "a promise" },
        { left: "break", right: "the law" },
        { left: "catch", right: "a cold" },
      ]},
      { pairs: [
        { left: "make", right: "progress" },
        { left: "take", right: "responsibility" },
        { left: "run", right: "a business" },
        { left: "save", right: "time" },
      ]},
    ],
  },

  // Level 37: Modal Verb Mastery - MultipleChoice
  37: {
    type: "multiple-choice",
    rounds: [
      { question: "Wet footprints near the window. Someone ___ entered through the window.", options: ["must have", "can't have", "might have", "shouldn't have"], correctIndex: 0, explanation: "'Must have' = strong deduction about the past" },
      { question: "She ___ been at the party. She was in another city.", options: ["must have", "can't have", "should have", "might have"], correctIndex: 1, explanation: "'Can't have' = impossible conclusion" },
      { question: "He ___ taken the bus. I'm not sure.", options: ["must have", "can't have", "might have", "will have"], correctIndex: 2, explanation: "'Might have' = uncertain possibility" },
      { question: "You ___ studied more. You failed the exam.", options: ["must have", "should have", "can't have", "might have"], correctIndex: 1, explanation: "'Should have' = advice about past action" },
      { question: "___ I use your phone? (asking permission)", options: ["Must", "Should", "May", "Would"], correctIndex: 2 },
      { question: "You ___ wear a seatbelt. It's the law.", options: ["might", "could", "must", "may"], correctIndex: 2, explanation: "'Must' = obligation" },
      { question: "You ___ see a doctor about that cough.", options: ["must", "should", "might", "can't"], correctIndex: 1, explanation: "'Should' = advice" },
      { question: "He ___ speak three languages when he was young.", options: ["can", "could", "may", "must"], correctIndex: 1, explanation: "'Could' = past ability" },
      { question: "It ___ rain later. Take an umbrella.", options: ["must", "should", "might", "can't"], correctIndex: 2 },
      { question: "They ___ have left already. The house is dark.", options: ["might", "must", "can", "should"], correctIndex: 1 },
    ],
  },

  // Level 38: Critical Reading - MultipleChoice
  38: {
    type: "multiple-choice",
    rounds: [
      { passage: "Fast fashion has revolutionized the clothing industry, making trendy clothes affordable for everyone. However, this convenience comes at a terrible cost. Workers in developing countries are paid poverty wages, and the environmental damage from textile waste is staggering. We simply cannot continue to treat clothing as disposable.", question: "What is the author's main purpose?", options: ["To promote fast fashion", "To criticize fast fashion's impact", "To discuss clothing trends", "To compare prices"], correctIndex: 1 },
      { passage: "Fast fashion has revolutionized the clothing industry, making trendy clothes affordable for everyone. However, this convenience comes at a terrible cost. Workers in developing countries are paid poverty wages, and the environmental damage from textile waste is staggering. We simply cannot continue to treat clothing as disposable.", question: "Which word reveals the author's bias?", options: ["revolutionized", "affordable", "terrible", "trendy"], correctIndex: 2, explanation: "'Terrible' is a strong opinion word showing the author's negative view" },
      { passage: "Studies consistently show that children who read for pleasure perform better academically. A recent survey of 10,000 students found that daily readers scored 15% higher on standardized tests. Despite this overwhelming evidence, many schools continue to cut library funding.", question: "What persuasive technique is used?", options: ["Personal story", "Statistics and data", "Celebrity endorsement", "Humor"], correctIndex: 1 },
      { passage: "Studies consistently show that children who read for pleasure perform better academically. A recent survey of 10,000 students found that daily readers scored 15% higher on standardized tests. Despite this overwhelming evidence, many schools continue to cut library funding.", question: "What is the author's tone?", options: ["Happy", "Neutral", "Frustrated", "Humorous"], correctIndex: 2, explanation: "'Despite this overwhelming evidence' suggests frustration" },
      { passage: "Everyone knows that organic food is healthier. Natural farming methods produce food that is free from harmful chemicals. Choosing organic is simply the right choice for your family.", question: "What logical flaw is in this passage?", options: ["Uses statistics incorrectly", "Makes unsupported generalizations", "Cites too many sources", "Is too balanced"], correctIndex: 1, explanation: "'Everyone knows' is a generalization without evidence" },
      { passage: "The new city park project will cost $5 million. Mayor Johnson states it will bring 'thousands of jobs and transform the community.' However, independent analysts estimate only 50 permanent jobs will be created, and previous city projects have exceeded their budgets by 40%.", question: "What does the passage suggest about the Mayor's claims?", options: ["They are accurate", "They are exaggerated", "They are modest", "They are irrelevant"], correctIndex: 1 },
    ],
  },

  // Level 39: Pronunciation Precision - Typing
  39: {
    type: "typing",
    instruction: "Type the word with correct spelling (pronunciation practice)",
    rounds: [
      { prompt: "ship (not sheep)", answer: "ship", hint: "Short 'i' sound" },
      { prompt: "beach (not b*tch)", answer: "beach", hint: "Long 'ee' sound" },
      { prompt: "present (noun: a gift)", answer: "present" },
      { prompt: "record (noun: a disc)", answer: "record" },
      { prompt: "comfortable", answer: "comfortable", hint: "3 syllables: COMF-ter-ble" },
      { prompt: "Wednesday", answer: "wednesday", hint: "Silent 'd'" },
      { prompt: "February", answer: "february", hint: "Don't skip the first 'r'" },
      { prompt: "library", answer: "library", hint: "Not 'libary'" },
      { prompt: "temperature", answer: "temperature", hint: "4 syllables" },
      { prompt: "vegetable", answer: "vegetable", hint: "3 syllables: VEJ-tuh-bul" },
      { prompt: "necessary", answer: "necessary", hint: "One 'c', two 's'" },
      { prompt: "restaurant", answer: "restaurant", hint: "3 syllables" },
    ],
  },

  // Level 40: Upper Intermediate Boss - BossChallenge
  40: {
    type: "boss-challenge",
    bossName: "Space Commander",
    bossEmoji: "🚀",
    rounds: [
      { type: "mc", question: "Convert to passive: 'She wrote the letter'", options: ["The letter was written by her", "The letter is written by her", "She was written the letter"], correctIndex: 0 },
      { type: "mc", question: "She said 'I am tired' → Reported:", options: ["She said she is tired", "She said she was tired", "She said I am tired"], correctIndex: 1 },
      { type: "mc", question: "Someone ___ have broken the window. It's shattered.", options: ["can't", "might", "must", "should"], correctIndex: 2 },
      { type: "mc", question: "'Make a decision' is a ___", options: ["phrasal verb", "collocation", "idiom", "proverb"], correctIndex: 1 },
      { type: "typing", question: "Academic word: to examine in detail = a_____e", correctAnswer: "analyze" },
      { type: "mc", question: "The author uses the word 'terrible' — this shows:", options: ["Neutral tone", "Positive bias", "Negative bias", "Humor"], correctIndex: 2 },
      { type: "mc", question: "'68% of people will live in cities by 2050' — this is:", options: ["Opinion", "Statistic/fact", "Idiom", "Metaphor"], correctIndex: 1 },
      { type: "mc", question: "You ___ wear a seatbelt (obligation):", options: ["might", "could", "must", "should"], correctIndex: 2 },
      { type: "typing", question: "Collocation: pay ___", correctAnswer: "attention" },
      { type: "mc", question: "Passive: 'They are building a school' →", options: ["A school is being built", "A school was built", "A school has been built"], correctIndex: 0 },
    ],
  },

  // === MODULE 5: ADVANCED ===

  // Level 41: Rhetoric & Persuasion - MultipleChoice
  41: {
    type: "multiple-choice",
    rounds: [
      { question: "Which rhetorical device uses emotional appeal?", options: ["Logos", "Ethos", "Pathos", "Kairos"], correctIndex: 2, explanation: "Pathos = emotional appeal to the audience" },
      { question: "'Ask not what your country can do for you...' uses:", options: ["Repetition", "Chiasmus", "Metaphor", "Simile"], correctIndex: 1, explanation: "Chiasmus reverses the structure of two clauses" },
      { question: "A doctor citing their medical degree uses:", options: ["Pathos", "Logos", "Ethos", "Hyperbole"], correctIndex: 2, explanation: "Ethos = credibility/authority appeal" },
      { question: "'Studies show 90% of students improved' uses:", options: ["Pathos", "Logos", "Ethos", "Alliteration"], correctIndex: 1, explanation: "Logos = logical appeal with evidence/data" },
      { question: "Identify: 'Should we just stand by and watch children suffer?'", options: ["Rhetorical question + Pathos", "Logos + Ethos", "Simple question", "Metaphor"], correctIndex: 0 },
      { question: "'I have a dream... I have a dream...' is an example of:", options: ["Metaphor", "Repetition", "Irony", "Understatement"], correctIndex: 1 },
      { question: "Build argument: 'Schools should provide free lunch.' Best opening:", options: ["Free lunch is nice.", "No child should go hungry. Every day, millions of students face hunger.", "Lunch should be free because I think so.", "Some people want free lunch."], correctIndex: 1 },
      { question: "Which adds logical support?", options: ["I feel strongly about this", "Research from Harvard shows a 40% improvement", "Everyone knows this is true", "My friend agrees"], correctIndex: 1 },
      { question: "Best conclusion:", options: ["That's all.", "So yeah.", "The evidence is clear: free school meals are an investment in our children's future.", "I'm done talking."], correctIndex: 2 },
      { question: "'Life is a journey' is an example of:", options: ["Simile", "Metaphor", "Alliteration", "Hyperbole"], correctIndex: 1 },
    ],
  },

  // Level 42: Literary Analysis - MultipleChoice
  42: {
    type: "multiple-choice",
    rounds: [
      { passage: "The old man sat by the dying fire, watching the last embers fade like the memories of his youth. The clock on the mantle ticked steadily, marking the passage of time he could never reclaim.", question: "What does the 'dying fire' symbolize?", options: ["Winter", "The old man's fading life", "A power outage", "Cooking"], correctIndex: 1 },
      { passage: "The old man sat by the dying fire, watching the last embers fade like the memories of his youth. The clock on the mantle ticked steadily, marking the passage of time he could never reclaim.", question: "What literary device is 'fade like the memories'?", options: ["Metaphor", "Simile", "Hyperbole", "Alliteration"], correctIndex: 1 },
      { passage: "She stood at the crossroads, one path leading to the familiar village, the other disappearing into the unknown forest. She took a deep breath and chose the forest.", question: "The crossroads likely symbolizes:", options: ["A real intersection", "A life-changing decision", "Getting lost", "Exercise"], correctIndex: 1 },
      { passage: "The room was painted in bright yellows and oranges, yet she felt nothing but the cold weight of loneliness pressing against her chest.", question: "What technique creates contrast here?", options: ["Irony", "Simile", "Alliteration", "Onomatopoeia"], correctIndex: 0, explanation: "The bright colors contrast with her dark feelings — situational irony" },
      { passage: "'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.' — Jane Austen", question: "The tone of this opening is:", options: ["Tragic", "Ironic/satirical", "Romantic", "Angry"], correctIndex: 1 },
      { passage: "The narrator describes every character's thoughts but never reveals their own feelings or opinions about the events.", question: "This narrative perspective is:", options: ["First person", "Second person", "Third person omniscient", "Third person limited"], correctIndex: 2 },
    ],
  },

  // Level 43: Advanced Vocabulary Vault - FillInBlank
  43: {
    type: "fill-in-blank",
    rounds: [
      { sentence: "The politician tried to ___ the public with misleading statistics.", options: ["illuminate", "deceive", "entertain", "educate"], correctIndex: 1 },
      { sentence: "Her writing style is characterized by its ___ and clarity.", options: ["ambiguity", "verbosity", "brevity", "complexity"], correctIndex: 2, explanation: "'Brevity' = conciseness, quality of being brief" },
      { sentence: "The ___ between the two theories is still debated.", options: ["similarity", "dichotomy", "agreement", "harmony"], correctIndex: 1, explanation: "'Dichotomy' = division into two contrasting things" },
      { sentence: "His ___ remarks offended many in the audience.", options: ["polite", "inflammatory", "quiet", "thoughtful"], correctIndex: 1 },
      { sentence: "The report was ___ in its coverage of the issues.", options: ["biased", "superficial", "comprehensive", "brief"], correctIndex: 2 },
      { sentence: "She showed great ___ in handling the crisis.", options: ["weakness", "incompetence", "acumen", "confusion"], correctIndex: 2, explanation: "'Acumen' = the ability to make good judgments" },
      { sentence: "The law was ___ to prevent discrimination.", options: ["enacted", "ignored", "removed", "forgotten"], correctIndex: 0 },
      { sentence: "His argument was ___ and lacked evidence.", options: ["compelling", "tenuous", "strong", "convincing"], correctIndex: 1, explanation: "'Tenuous' = very weak or slight" },
      { sentence: "The artist's work shows remarkable ___.", options: ["mediocrity", "versatility", "simplicity", "monotony"], correctIndex: 1 },
      { sentence: "The company adopted a more ___ approach to sustainability.", options: ["careless", "pragmatic", "reckless", "theoretical"], correctIndex: 1 },
    ],
  },

  // Level 44: Nuance Navigator - MultipleChoice
  44: {
    type: "multiple-choice",
    rounds: [
      { question: "'The CEO ___ the new policy' — most appropriate word:", options: ["said", "announced", "mentioned", "whispered"], correctIndex: 1, explanation: "'Announced' is formal and authoritative, fitting for a CEO making a policy change" },
      { question: "'She ___ across the room' — implies anger:", options: ["walked", "strolled", "stormed", "wandered"], correctIndex: 2, explanation: "'Stormed' implies angry, forceful movement" },
      { question: "'The painting was ___' — strongest praise:", options: ["nice", "good", "exquisite", "okay"], correctIndex: 2, explanation: "'Exquisite' = extremely beautiful and delicate" },
      { question: "Formal context: 'We need to ___ this matter'", options: ["look at", "address", "check out", "deal with"], correctIndex: 1, explanation: "'Address' is the most formal and professional option" },
      { question: "'He ___ the truth' — implies reluctance:", options: ["told", "admitted", "said", "reported"], correctIndex: 1, explanation: "'Admitted' suggests reluctance, acknowledging something unfavorable" },
      { question: "Academic writing: 'The results ___ that...'", options: ["show", "suggest", "prove", "tell"], correctIndex: 1, explanation: "'Suggest' is appropriately hedged for academic writing" },
      { question: "'The child ___ with joy' — most vivid:", options: ["smiled", "laughed", "beamed", "grinned"], correctIndex: 2, explanation: "'Beamed' implies radiating happiness" },
      { question: "Negative connotation: 'The politician was ___'", options: ["determined", "persistent", "stubborn", "dedicated"], correctIndex: 2, explanation: "'Stubborn' has negative connotation vs 'determined' (positive)" },
      { question: "Neutral reporting: 'The witness ___ that...'", options: ["claimed", "stated", "insisted", "argued"], correctIndex: 1, explanation: "'Stated' is neutral; others imply doubt or force" },
      { question: "'She ___ her colleague's work' — positive:", options: ["criticized", "praised", "questioned", "dismissed"], correctIndex: 1 },
    ],
  },

  // Level 45: Accent Adaptation - MultipleChoice
  45: {
    type: "multiple-choice",
    rounds: [
      { question: "In British English, the ground floor = In American English:", options: ["Ground floor", "First floor", "Basement", "Second floor"], correctIndex: 1, explanation: "British 'ground floor' = American 'first floor'" },
      { question: "British 'lift' = American ___", options: ["Stairs", "Elevator", "Escalator", "Ramp"], correctIndex: 1 },
      { question: "British 'boot' (of a car) = American ___", options: ["Hood", "Trunk", "Tire", "Bonnet"], correctIndex: 1 },
      { question: "British 'flat' = American ___", options: ["House", "Apartment", "Bungalow", "Mansion"], correctIndex: 1 },
      { question: "Australian slang 'arvo' means:", options: ["Morning", "Afternoon", "Evening", "Night"], correctIndex: 1 },
      { question: "In British English, 'queue' means:", options: ["A question", "A line/waiting line", "A type of music", "A haircut"], correctIndex: 1 },
      { question: "American 'cookie' = British ___", options: ["Cake", "Biscuit", "Cracker", "Muffin"], correctIndex: 1 },
      { question: "British 'petrol' = American ___", options: ["Diesel", "Gas/Gasoline", "Oil", "Water"], correctIndex: 1 },
      { question: "In British English, 'chips' = American ___", options: ["Chips", "French fries", "Crisps", "Nachos"], correctIndex: 1 },
      { question: "'Colour' vs 'Color' — which is British?", options: ["Color", "Colour"], correctIndex: 1 },
    ],
  },

  // Level 46: Academic Writing Workshop - SentenceBuilder
  46: {
    type: "sentence-builder",
    rounds: [
      { instruction: "Build a topic sentence:", words: ["Climate change", "is", "arguably", "the most", "pressing issue", "of our time"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "Add hedging language:", words: ["The evidence", "appears to", "suggest", "a correlation", "between", "diet and health"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "Build with citation:", words: ["According to", "Smith (2023),", "renewable energy", "could reduce", "emissions by", "40%"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "Academic conclusion:", words: ["In light of", "the findings,", "further research", "is", "clearly", "warranted"], correctOrder: [0, 1, 2, 3, 4, 5] },
      { instruction: "Counter-argument:", words: ["While", "some scholars", "disagree,", "the majority of", "evidence supports", "this view"], correctOrder: [0, 1, 2, 3, 4, 5] },
    ],
  },

  // Level 47: Discourse & Cohesion - FillInBlank
  47: {
    type: "fill-in-blank",
    rounds: [
      { sentence: "She studied hard. ___, she passed the exam.", options: ["However", "Therefore", "Moreover", "Nevertheless"], correctIndex: 1, explanation: "'Therefore' = cause and effect" },
      { sentence: "He is smart. ___, he is very hardworking.", options: ["However", "Furthermore", "Therefore", "Instead"], correctIndex: 1, explanation: "'Furthermore' = addition" },
      { sentence: "It was raining. ___, we went to the beach.", options: ["Therefore", "Moreover", "Nevertheless", "Furthermore"], correctIndex: 2, explanation: "'Nevertheless' = contrast/unexpected result" },
      { sentence: "Many studies support this. ___, Smith (2020) found that...", options: ["However", "For instance", "Nevertheless", "In contrast"], correctIndex: 1, explanation: "'For instance' = giving an example" },
      { sentence: "___, the results indicate a positive trend.", options: ["In conclusion", "For example", "However", "Additionally"], correctIndex: 0 },
      { sentence: "Some prefer online learning. ___, others find classroom learning more effective.", options: ["Similarly", "In contrast", "Therefore", "Furthermore"], correctIndex: 1 },
      { sentence: "Exercise improves physical health. ___, it benefits mental wellbeing.", options: ["However", "In contrast", "Moreover", "Instead"], correctIndex: 2 },
      { sentence: "The data shows improvement. ___, there are still areas of concern.", options: ["Moreover", "Therefore", "However", "For example"], correctIndex: 2 },
      { sentence: "___, both studies reach the same conclusion.", options: ["In contrast", "Nevertheless", "To sum up", "However"], correctIndex: 2 },
      { sentence: "Several factors contribute to this. ___, economic instability plays a role.", options: ["However", "In contrast", "Namely", "Nevertheless"], correctIndex: 2 },
    ],
  },

  // Level 48: Real World Simulation - MultipleChoice
  48: {
    type: "multiple-choice",
    rounds: [
      { question: "🏢 Job Interview: 'Tell me about yourself.'", options: ["I'm a person who exists.", "I'm a motivated professional with 3 years of experience in marketing.", "I don't want to talk about myself.", "My hobbies include sleeping."], correctIndex: 1 },
      { question: "🏢 Interview: 'What is your greatest weakness?'", options: ["I have no weaknesses.", "I sometimes focus too much on details, but I'm working on prioritizing tasks.", "I'm always late.", "I don't like working."], correctIndex: 1, explanation: "Show self-awareness and growth" },
      { question: "🏥 Doctor: 'How can I help you today?'", options: ["Fix me.", "I've been experiencing headaches and fatigue for the past week.", "I don't know.", "Nothing."], correctIndex: 1, explanation: "Be specific about symptoms and duration" },
      { question: "📞 Customer Service: 'I received the wrong item.'", options: ["Give me my money back now!", "Hello, I'd like to report an issue with my recent order. I received item X instead of item Y.", "This is the worst company ever.", "I want to speak to the CEO."], correctIndex: 1 },
      { question: "🎓 Seminar: 'What do you think about this theory?'", options: ["It's dumb.", "I don't have an opinion.", "While the theory raises valid points, I think it overlooks the social factors involved.", "I agree with everything."], correctIndex: 2 },
      { question: "🏢 Interview: 'Why should we hire you?'", options: ["Because I need money.", "I bring relevant experience, strong analytical skills, and a passion for innovation.", "I'm the best person in the world.", "You should be lucky to have me."], correctIndex: 1 },
      { question: "📞 Negotiation: 'The price seems high for this service.'", options: ["Take it or leave it.", "I understand your concern. Let me explain the value included in this package.", "That's your problem.", "Fine, we'll lower it to nothing."], correctIndex: 1 },
      { question: "🏥 Doctor follow-up: 'How is the medicine working?'", options: ["Fine.", "The symptoms have improved, but I'm still experiencing some dizziness in the mornings.", "I stopped taking it.", "I don't remember."], correctIndex: 1 },
    ],
  },

  // Level 49: Mastery Mix - BossChallenge
  49: {
    type: "boss-challenge",
    bossName: "Grand Master",
    bossEmoji: "👑",
    rounds: [
      { type: "mc", question: "Pathos, Logos, Ethos — which uses statistics?", options: ["Pathos", "Logos", "Ethos"], correctIndex: 1 },
      { type: "mc", question: "'The dying fire' symbolizes:", options: ["Cooking", "Fading life/hope", "Winter", "Safety"], correctIndex: 1 },
      { type: "mc", question: "'Brevity' means:", options: ["Length", "Conciseness", "Complexity", "Confusion"], correctIndex: 1 },
      { type: "mc", question: "Most formal: 'We need to ___ this matter'", options: ["look at", "address", "check out", "deal with"], correctIndex: 1 },
      { type: "mc", question: "British 'lift' = American:", options: ["Stairs", "Elevator", "Ramp", "Ladder"], correctIndex: 1 },
      { type: "mc", question: "'Therefore' signals:", options: ["Contrast", "Cause/effect", "Addition", "Example"], correctIndex: 1 },
      { type: "typing", question: "Discourse marker for contrast:", correctAnswer: "however" },
      { type: "mc", question: "Best interview response to 'Tell me about yourself':", options: ["I exist", "A concise professional summary", "My life story", "Nothing"], correctIndex: 1 },
      { type: "mc", question: "Academic hedging: 'The results ___ that...'", options: ["prove", "suggest", "guarantee", "force"], correctIndex: 1 },
      { type: "mc", question: "'Stormed' implies the person was:", options: ["Happy", "Calm", "Angry", "Tired"], correctIndex: 2 },
      { type: "typing", question: "Collocation: make a ___", correctAnswer: "decision" },
      { type: "mc", question: "Someone must have entered = we are ___", options: ["Uncertain", "Almost certain", "Guessing randomly", "Joking"], correctIndex: 1 },
    ],
  },

  // Level 50: Grand Finale - BossChallenge
  50: {
    type: "boss-challenge",
    bossName: "Final Graduation Exam",
    bossEmoji: "🎓",
    rounds: [
      { type: "mc", question: "Which sentence is passive?", options: ["She wrote the book", "The book was written by her", "She is writing", "She will write"], correctIndex: 1 },
      { type: "mc", question: "'Tenuous' means:", options: ["Strong", "Very weak", "Moderate", "Perfect"], correctIndex: 1 },
      { type: "mc", question: "Reported speech: 'I will go' → She said she ___", options: ["will go", "would go", "goes", "went"], correctIndex: 1 },
      { type: "typing", question: "Discourse marker for summary:", correctAnswer: "in conclusion" },
      { type: "mc", question: "'Nevertheless' is similar to:", options: ["Therefore", "However", "Moreover", "For instance"], correctIndex: 1 },
      { type: "mc", question: "First conditional: 'If it rains, ___'", options: ["I would stay home", "I will stay home", "I stayed home"], correctIndex: 1 },
      { type: "mc", question: "'Exquisite' means:", options: ["Ugly", "Ordinary", "Extremely beautiful", "Simple"], correctIndex: 2 },
      { type: "typing", question: "Phrasal verb: give ___", correctAnswer: "up" },
      { type: "mc", question: "Zero conditional: 'If you heat water, ___'", options: ["it will boil", "it would boil", "it boils"], correctIndex: 2 },
      { type: "mc", question: "'Chiasmus' is a rhetorical device that:", options: ["Repeats words", "Reverses clause structure", "Uses emotion", "Cites authority"], correctIndex: 1 },
      { type: "mc", question: "Best academic hedging:", options: ["This proves...", "This suggests...", "This guarantees...", "This forces..."], correctIndex: 1 },
      { type: "mc", question: "'Comprehensive' means:", options: ["Brief", "Partial", "Thorough and complete", "Confusing"], correctIndex: 2 },
      { type: "typing", question: "Collocation: pay ___", correctAnswer: "attention" },
      { type: "mc", question: "The narrator who knows all characters' thoughts:", options: ["First person", "Second person", "Third person omniscient", "Third person limited"], correctIndex: 2 },
      { type: "mc", question: "🎉 Final question: What does 'Lingual Quest' help you learn?", options: ["Mathematics", "English", "Science", "History"], correctIndex: 1 },
    ],
  },
};

export function getLevelGameData(levelId: number): any {
  return gameDataMap[levelId] || gameDataMap[1];
}

export function getGameType(levelId: number): string {
  const data = gameDataMap[levelId];
  if (!data) return "multiple-choice";
  return data.type;
}
