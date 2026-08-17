/* Data store for SSLC Social Science Exam-Cram App */

// 1. 15 Concepts Ranked by Frequency
const TOPICS_DATA = [
  {
    id: "topic-1",
    rank: 1,
    title: "Indian National Movement & Freedom Struggle",
    chapter: "History Ch 2-4",
    frequency: 98,
    expectedMarks: 8,
    priority: "HIGH"
  },
  {
    id: "topic-2",
    rank: 2,
    title: "World Climate, Temperature & Diurnal Range",
    chapter: "Geography Ch 3",
    frequency: 95,
    expectedMarks: 6,
    priority: "HIGH"
  },
  {
    id: "topic-3",
    rank: 3,
    title: "Global Deserts & Grasslands Mapping",
    chapter: "Geography Ch 5",
    frequency: 92,
    expectedMarks: 5,
    priority: "HIGH"
  },
  {
    id: "topic-4",
    rank: 4,
    title: "Constitution of India & Fundamental Rights",
    chapter: "Civics Ch 1",
    frequency: 90,
    expectedMarks: 6,
    priority: "HIGH"
  },
  {
    id: "topic-5",
    rank: 5,
    title: "Agricultural Patterns & Food Security",
    chapter: "Economics Ch 2",
    frequency: 87,
    expectedMarks: 5,
    priority: "HIGH"
  },
  {
    id: "topic-6",
    rank: 6,
    title: "The First War of Indian Independence (1857)",
    chapter: "History Ch 1",
    frequency: 85,
    expectedMarks: 5,
    priority: "HIGH"
  },
  {
    id: "topic-7",
    rank: 7,
    title: "Money, Banking & Financial Institutions",
    chapter: "Economics Ch 3",
    frequency: 82,
    expectedMarks: 4,
    priority: "MEDIUM"
  },
  {
    id: "topic-8",
    rank: 8,
    title: "Resources & Sustainable Development",
    chapter: "Geography Ch 1",
    frequency: 80,
    expectedMarks: 4,
    priority: "MEDIUM"
  },
  {
    id: "topic-9",
    rank: 9,
    title: "United Nations & International Agencies",
    chapter: "Civics Ch 4",
    frequency: 78,
    expectedMarks: 4,
    priority: "MEDIUM"
  },
  {
    id: "topic-10",
    rank: 10,
    title: "Social Stratification & Human Rights",
    chapter: "Sociology Ch 1",
    frequency: 75,
    expectedMarks: 3,
    priority: "MEDIUM"
  },
  {
    id: "topic-11",
    rank: 11,
    title: "Industrialization & Economic Growth",
    chapter: "Economics Ch 4",
    frequency: 72,
    expectedMarks: 3,
    priority: "MEDIUM"
  },
  {
    id: "topic-12",
    rank: 12,
    title: "Natural Disasters & Mitigation Strategies",
    chapter: "Geography Ch 8",
    frequency: 70,
    expectedMarks: 3,
    priority: "MEDIUM"
  },
  {
    id: "topic-13",
    rank: 13,
    title: "Consumer Rights & Public Distribution",
    chapter: "Economics Ch 5",
    frequency: 68,
    expectedMarks: 2,
    priority: "LOW"
  },
  {
    id: "topic-14",
    rank: 14,
    title: "Post-Independence India Integration",
    chapter: "History Ch 6",
    frequency: 65,
    expectedMarks: 3,
    priority: "LOW"
  },
  {
    id: "topic-15",
    rank: 15,
    title: "Public Administration & Local Governance",
    chapter: "Civics Ch 3",
    frequency: 60,
    expectedMarks: 2,
    priority: "LOW"
  }
];

// 2. Comprehensive Question Database Across All Types
const QUESTIONS_DATA = [
  // MCQ
  {
    id: "q-1",
    topicId: "topic-1",
    type: "mcq",
    question: "Who launched the Non-Cooperation Movement in 1920 following the Jallianwala Bagh Massacre?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhash Chandra Bose", "Bal Gangadhar Tilak"],
    correctAnswer: "Mahatma Gandhi",
    explanation: "Mahatma Gandhi initiated the Non-Cooperation Movement in 1920 after the Jallianwala Bagh massacre and Rowlatt Act."
  },
  {
    id: "q-2",
    topicId: "topic-4",
    type: "mcq",
    question: "Which Fundamental Right prohibits child labor in factories and hazardous environments under Article 24?",
    options: ["Right against Exploitation", "Right to Equality", "Right to Freedom", "Cultural and Educational Rights"],
    correctAnswer: "Right against Exploitation",
    explanation: "Article 24 of the Indian Constitution under 'Right against Exploitation' outlaws employment of children below 14 years."
  },
  {
    id: "q-3",
    topicId: "topic-6",
    type: "mcq",
    question: "Who was declared as the Emperor of India during the Revolt of 1857 by the Sepoys?",
    options: ["Bahadur Shah Zafar", "Nana Saheb", "Rani Lakshmibai", "Tantia Tope"],
    correctAnswer: "Bahadur Shah Zafar",
    explanation: "Rebel sepoys marched to Delhi and proclaimed the last Mughal Emperor Bahadur Shah II (Zafar) as Shahanshah-e-Hindustan."
  },
  {
    id: "q-4",
    topicId: "topic-7",
    type: "mcq",
    question: "Which central agency acts as the 'Banker's Bank' and regulates currency in India?",
    options: ["Reserve Bank of India (RBI)", "State Bank of India (SBI)", "NITI Aayog", "Ministry of Finance"],
    correctAnswer: "Reserve Bank of India (RBI)",
    explanation: "The Reserve Bank of India (RBI) is India's central bank responsible for issuing currency and monetary policy."
  },

  // FILL IN THE BLANKS
  {
    id: "q-5",
    topicId: "topic-1",
    type: "fill",
    question: "The historic session of Indian National Congress where 'Poorna Swaraj' (Complete Independence) resolution was passed took place at ________ in 1929.",
    correctAnswer: "Lahore",
    explanation: "The Lahore Session of Congress in December 1929 presided over by Jawaharlal Nehru declared Poorna Swaraj."
  },
  {
    id: "q-6",
    topicId: "topic-9",
    type: "fill",
    question: "The headquarters of the United Nations Organization (UNO) is located in ________.",
    correctAnswer: "New York",
    explanation: "The UNO was established in 1945 with headquarters in New York City, USA."
  },

  // MATCHING
  {
    id: "q-7",
    topicId: "topic-3",
    type: "match",
    question: "Match the temperate and tropical grasslands with their respective continents/regions:",
    pairs: [
      { left: "Prairies", right: "North America" },
      { left: "Pampas", right: "South America" },
      { left: "Steppes", right: "Eurasia" },
      { left: "Downs", right: "Australia" }
    ],
    correctAnswer: "Prairies -> North America | Pampas -> South America | Steppes -> Eurasia | Downs -> Australia",
    explanation: "Prairies are in N. America, Pampas in S. America, Steppes in Eurasia, Downs in Australia."
  },

  // REASONING & CASE STUDY
  {
    id: "q-8",
    topicId: "topic-2",
    type: "reasoning",
    question: "Assertion (A): Deserts experience a very high diurnal range of temperature.\nReason (R): Absence of cloud cover and low humidity allow rapid solar heating during the day and swift terrestrial radiation loss at night.",
    options: [
      "Both A and R are true and R is the correct explanation of A",
      "Both A and R are true but R is NOT the correct explanation of A",
      "A is true but R is false",
      "A is false but R is true"
    ],
    correctAnswer: "Both A and R are true and R is the correct explanation of A",
    explanation: "Dry desert air lacks cloud cover and moisture, resulting in extreme day heating and cold nights."
  },
  {
    id: "q-9",
    topicId: "topic-5",
    type: "case",
    question: "Case Study: Farmer Ramesh in Punjab shifted from traditional crop rotation to continuous high-yield wheat-paddy monoculture using heavy groundwater irrigation and chemical fertilizers. After 10 years, crop yield declined and the water table dropped severely.\nQuestion: What agricultural crisis is Ramesh facing and what sustainable solution should he adopt?",
    correctAnswer: "Soil degradation & groundwater depletion. Ramesh must adopt crop diversification, drip irrigation, organic farming, and rain harvesting.",
    keyPoints: ["soil degradation", "groundwater depletion", "crop diversification", "organic farming", "drip irrigation"]
  },

  // CHART COMPLETION
  {
    id: "q-10",
    topicId: "topic-10",
    type: "chart",
    question: "Complete the Social Stratification Hierarchy: \nTop: Ruling Class / Elite -> Middle: ________ -> Base: Laborers & Working Class",
    options: ["Bureaucrats & Traders / Professionals", "Monarchs", "Slaves", "Untouchables"],
    correctAnswer: "Bureaucrats & Traders / Professionals",
    explanation: "In traditional social stratification models, the middle tier comprises merchants, traders, and administrative professionals."
  },

  // WRITE-THE-ANSWER (3 - 8 MARKS LONG ANSWERS)
  {
    id: "q-11",
    topicId: "topic-1",
    type: "long",
    marks: 5,
    question: "Explain the factors that led to the launch of the Quit India Movement in 1942 and evaluate its impact on India's Freedom Struggle.",
    correctAnswer: "Model Answer Key Points:\n1. Failure of Cripps Mission (1942) which failed to promise immediate self-rule.\n2. Threat of Japanese invasion on Indian borders during WWII.\n3. Rising inflation, food shortages, and wartime distress among common people.\n4. Gandhi's clarion call 'Do or Die' (Karo ya Maro) at Gowalia Tank, Bombay.\n5. Massive nationwide uprising despite immediate arrest of top leaders, breaking British colonial authority permanently.",
    keyPoints: ["cripps mission failure", "japanese invasion threat", "do or die", "gowalia tank", "nationwide uprising"]
  },
  {
    id: "q-12",
    topicId: "topic-4",
    type: "long",
    marks: 6,
    question: "Describe the six fundamental rights guaranteed by the Constitution of India and explain the importance of Article 32.",
    correctAnswer: "Model Answer Key Points:\n1. Right to Equality (Arts 14-18)\n2. Right to Freedom (Arts 19-22)\n3. Right against Exploitation (Arts 23-24)\n4. Right to Freedom of Religion (Arts 25-28)\n5. Cultural & Educational Rights (Arts 29-30)\n6. Right to Constitutional Remedies (Art 32) - Dr. B.R. Ambedkar called Article 32 the 'Heart and Soul' of the Constitution as it empowers citizens to move the Supreme Court via writs (Habeas Corpus, Mandamus, Quo Warranto, Certiorari, Prohibition).",
    keyPoints: ["right to equality", "right to freedom", "right against exploitation", "freedom of religion", "cultural & educational rights", "right to constitutional remedies", "article 32", "writs"]
  },
  {
    id: "q-13",
    topicId: "topic-6",
    type: "long",
    marks: 5,
    question: "Analyze the administrative, military, and immediate causes of the First War of Indian Independence (1857).",
    correctAnswer: "Model Answer Key Points:\n1. Administrative/Political: Lord Dalhousie's Doctrine of Lapse annexed states like Satara, Jhansi, Nagpur; pension abolition for Nana Saheb.\n2. Economic: Destruction of Indian handicrafts, high land revenue taxes.\n3. Military: Discrimination against Indian sepoys in salary, promotion, and overseas service allowance.\n4. Immediate Cause: Introduction of Enfield Rifle with grease cartridges rumored to be made of cow and pig fat, offending Hindu & Muslim religious sentiments.",
    keyPoints: ["doctrine of lapse", "dalhousie", "enfield rifle", "greased cartridges", "sepoy discrimination"]
  },
  {
    id: "q-14",
    topicId: "topic-8",
    type: "long",
    marks: 4,
    question: "What is Sustainable Development? List four key strategies for conserving natural resources.",
    correctAnswer: "Model Answer Key Points:\n1. Sustainable Development is development that meets the needs of the present without compromising the ability of future generations to meet their own needs.\n2. Strategies: (a) Use of renewable energy (solar, wind), (b) 3Rs - Reduce, Reuse, Recycle, (c) Afforestation & forest protection, (d) Rainwater harvesting & soil conservation.",
    keyPoints: ["meets needs of present", "future generations", "renewable energy", "3rs", "afforestation", "rainwater harvesting"]
  },
  {
    id: "q-15",
    topicId: "topic-14",
    type: "long",
    marks: 4,
    question: "Explain the role played by Sardar Vallabhbhai Patel in the integration of princely states into the Indian Union.",
    correctAnswer: "Model Answer Key Points:\n1. Sardar Vallabhbhai Patel was India's first Home Minister, known as the 'Iron Man of India'.\n2. Used diplomacy, coercion, and the 'Instrument of Accession' to merge over 560 princely states.\n3. Successfully handled stubborn states: Junagadh (plebiscite), Hyderabad (Operation Polo military action), and Jammu & Kashmir (Instrument of Accession).",
    keyPoints: ["iron man of india", "instrument of accession", "junagadh", "hyderabad operation polo", "kashmir"]
  }
];

// 3. Map Targets Data
const MAP_TARGETS_DATA = [
  { name: "Sahara Desert", location: "North Africa", type: "Desert" },
  { name: "Kalahari Desert", location: "Southern Africa", type: "Desert" },
  { name: "Atacama Desert", location: "South America (Chile)", type: "Desert" },
  { name: "Gobi Desert", location: "East Asia (China/Mongolia)", type: "Desert" },
  { name: "Thar Desert", location: "South Asia (India/Pakistan)", type: "Desert" },
  { name: "Great Victoria Desert", location: "Australia", type: "Desert" },
  { name: "Prairies", location: "North America", type: "Grassland" },
  { name: "Savanna", location: "Central/East Africa", type: "Grassland" },
  { name: "Steppes", location: "Eurasia", type: "Grassland" },
  { name: "Pampas", location: "South America (Argentina)", type: "Grassland" },
  { name: "Veld", location: "South Africa", type: "Grassland" },
  { name: "Downs", location: "Australia", type: "Grassland" }
];

// 4. Temperature & Diurnal Range Dataset
const NUMERICAL_PROBLEMS_DATA = [
  {
    id: "num-1",
    city: "Jaisalmer (Thar Desert)",
    maxTemp: 42.5,
    minTemp: 18.0,
    hourlyReadings: [20.0, 22.0, 28.0, 36.0, 42.5, 38.0, 30.0, 24.5],
    range: 24.5, // 42.5 - 18.0
    mean: 30.12, // Sum/8
    unit: "°C"
  },
  {
    id: "num-2",
    city: "Riyadh (Arabian Peninsula)",
    maxTemp: 45.0,
    minTemp: 22.0,
    hourlyReadings: [24.0, 28.0, 35.0, 42.0, 45.0, 40.0, 32.0, 26.0],
    range: 23.0, // 45.0 - 22.0
    mean: 34.0,
    unit: "°C"
  },
  {
    id: "num-3",
    city: "Denver (Prairies Region)",
    maxTemp: 28.0,
    minTemp: 8.0,
    hourlyReadings: [10.0, 14.0, 20.0, 26.0, 28.0, 22.0, 16.0, 12.0],
    range: 20.0, // 28.0 - 8.0
    mean: 18.5,
    unit: "°C"
  },
  {
    id: "num-4",
    city: "Atacama Station (Desert Coast)",
    maxTemp: 32.0,
    minTemp: 12.0,
    hourlyReadings: [14.0, 18.0, 24.0, 30.0, 32.0, 26.0, 20.0, 16.0],
    range: 20.0, // 32.0 - 12.0
    mean: 22.5,
    unit: "°C"
  }
];

// 5. Last 30 Minutes High-Yield Rapid Facts
const LAST_30_MIN_FACTS = [
  {
    topic: "Indian Freedom Struggle",
    fact: "1857 Revolt began at Meerut on May 10, 1857. Mangal Pandey mutinied at Barrackpore."
  },
  {
    topic: "Indian Freedom Struggle",
    fact: "Gandhi's 3 major early Satyagrahas: Champaran (1917 - Indigo), Kheda (1918 - Peasants), Ahmedabad (1918 - Mill workers)."
  },
  {
    topic: "Climate & Temperature",
    fact: "Diurnal Range Formula = T_max - T_min. Daily Mean Temp = Sum of hourly readings / Total number of readings."
  },
  {
    topic: "Deserts & Grasslands",
    fact: "Tropical Grasslands = Savanna (Africa), Llanos (Venezuela), Campos (Brazil). Temperate Grasslands = Prairies (N. America), Pampas (S. America), Steppes (Eurasia), Veld (S. Africa), Downs (Australia)."
  },
  {
    topic: "Indian Constitution",
    fact: "Dr. B.R. Ambedkar was Chairman of the Drafting Committee. Constitution adopted on Nov 26, 1949 and came into force on Jan 26, 1950."
  },
  {
    topic: "Fundamental Rights",
    fact: "Article 21A provides free & compulsory education to children aged 6 to 14. Article 32 gives Right to Constitutional Remedies."
  },
  {
    topic: "Economics & Banking",
    fact: "RBI established in 1935 under RBI Act 1934. Nationalized in 1949. Central bank of India."
  },
  {
    topic: "Sustainable Development",
    fact: "Brundtland Commission Report (1987) 'Our Common Future' popularized the definition of Sustainable Development."
  },
  {
    topic: "UNO & International",
    fact: "UNO established Oct 24, 1945. 6 main organs: General Assembly, Security Council, Economic & Social Council, Trusteeship Council, ICJ, Secretariat."
  },
  {
    topic: "Post-Independence Integration",
    fact: "Operation Polo (1948) was the police action to integrate Hyderabad princely state into the Indian Union."
  }
];
