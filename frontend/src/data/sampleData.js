// Sample data for Teacher Community Toolkit

export const sampleUsers = [
  {
    id: 1,
    name: "Samuel Opoku",
    phoneNumber: "233244123456",
    region: "Greater Accra",
    district: "Accra Metro",
    circuit: "Osu",
    school: "Osu Salem Basic School",
    schoolId: "101020001",
    classes: ["JHS 1", "JHS 2"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Mathematics", "Science"],
    email: "samuel.opoku@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 15, totalPoints: 450 }
  },
  {
    id: 2,
    name: "Nana Agyei Ntoo",
    phoneNumber: "233204123457",
    region: "Ashanti",
    district: "Kumasi Metro",
    circuit: "Bantama",
    school: "Bantama Methodist Basic School",
    schoolId: "201010001",
    classes: ["JHS 3"],
    teacherType: "Teacher",
    role: "Head Teacher",
    subjects: ["English Language Arts"],
    email: "nana.agyei@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 22, totalPoints: 680 }
  },
  {
    id: 3,
    name: "Selassie Ametobey",
    phoneNumber: "233554123458",
    region: "Northern",
    district: "Tamale Metro",
    circuit: "Tamale Central",
    school: "Tamale Central Mosque Basic School",
    schoolId: "301030001",
    classes: ["Basic 5"],
    teacherType: "Teacher",
    role: "SISO",
    subjects: ["Science"],
    email: "selassie.ametobey@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 30, totalPoints: 920 }
  },
  {
    id: 4,
    name: "Joice Ammey",
    phoneNumber: "233244123459",
    region: "Greater Accra",
    district: "Accra Metro",
    circuit: "Osu",
    school: "Osu Salem Basic School",
    schoolId: "101020001",
    classes: ["Basic 4"],
    teacherType: "Teacher",
    role: "Curriculum Lead",
    subjects: ["English Language Arts"],
    email: "joice.ammey@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 18, totalPoints: 540 }
  },
  {
    id: 5,
    name: "Kwame Asante",
    phoneNumber: "233244987001",
    region: "Central",
    district: "Cape Coast Metro",
    circuit: "Cape Coast North",
    school: "Cape Coast Presby Basic School",
    schoolId: "401010001",
    classes: ["Basic 6", "JHS 1"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Social Studies", "History"],
    email: "kwame.asante@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 19, totalPoints: 520 }
  },
  {
    id: 6,
    name: "Abena Mensah",
    phoneNumber: "233244987002",
    region: "Eastern",
    district: "Koforidua",
    circuit: "Koforidua Central",
    school: "Koforidua Anglican Basic School",
    schoolId: "501010002",
    classes: ["Basic 3", "Basic 4"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Ghanaian Language", "Religious & Moral Education"],
    email: "abena.mensah@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 21, totalPoints: 600 }
  },
  {
    id: 7,
    name: "Kofi Darko",
    phoneNumber: "233244987003",
    region: "Volta",
    district: "Ho Municipal",
    circuit: "Ho Central",
    school: "Ho Wesley Basic School",
    schoolId: "601010001",
    classes: ["JHS 2", "JHS 3"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Mathematics", "ICT"],
    email: "kofi.darko@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 17, totalPoints: 480 }
  },
  {
    id: 8,
    name: "Ama Boateng",
    phoneNumber: "233244987004",
    region: "Ashanti",
    district: "Kumasi Metro",
    circuit: "Manhyia",
    school: "Manhyia Government Basic School",
    schoolId: "201030001",
    classes: ["Basic 5", "Basic 6"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Science", "Mathematics"],
    email: "ama.boateng@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 25, totalPoints: 710 }
  },
  {
    id: 9,
    name: "Yaw Kumi",
    phoneNumber: "233244987005",
    region: "Bono",
    district: "Sunyani Municipal",
    circuit: "Sunyani Central",
    school: "Sunyani Catholic Basic School",
    schoolId: "701010001",
    classes: ["JHS 1", "JHS 2"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["English Language Arts", "History"],
    email: "yaw.kumi@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 14, totalPoints: 390 }
  },
  {
    id: 10,
    name: "Efua Asiedu",
    phoneNumber: "233244987006",
    region: "Western",
    district: "Sekondi Takoradi Metro",
    circuit: "Takoradi",
    school: "Takoradi Methodist Basic School",
    schoolId: "801010001",
    classes: ["Basic 4", "Basic 5"],
    teacherType: "Teacher",
    role: "Subject/Class Teacher",
    subjects: ["Religious & Moral Education", "Ghanaian Language"],
    email: "efua.asiedu@ges.gov.gh",
    isActive: true,
    stats: { presenceCount: 20, totalPoints: 560 }
  }
];

export const sampleClusters = [
  {
    id: 1,
    name: "Mathematics Excellence Cluster",
    region: "Greater Accra",
    totalMembers: 24,
    totalSchools: 8,
    totalMeetings: 12,
    meetingsCompleted: 10,
    upcomingMeetings: 2
  },
  {
    id: 2,
    name: "STEM Innovation Cluster",
    region: "Ashanti",
    totalMembers: 18,
    totalSchools: 6,
    totalMeetings: 8,
    meetingsCompleted: 6,
    upcomingMeetings: 2
  },
  {
    id: 3,
    name: "Language Arts Collaboration",
    region: "Northern",
    totalMembers: 15,
    totalSchools: 5,
    totalMeetings: 15,
    meetingsCompleted: 14,
    upcomingMeetings: 1
  }
];

export const sampleMeetings = [
  {
    id: 1,
    title: "Advanced Algebra Teaching Strategies",
    date: "2024-11-25",
    time: "14:00",
    status: "new",
    clusterId: 1,
    facilitator: "Samuel Opoku",
    agenda: [
      "Review recent student performance data",
      "Discuss new assessment techniques",
      "Plan collaborative teaching approaches",
      "Resource sharing session"
    ],
    attendees: [],
    discussions: [],
    files: [],
    voiceNotes: []
  },
  {
    id: 2,
    title: "STEM Project-Based Learning",
    date: "2024-11-20",
    time: "15:30",
    status: "completed",
    clusterId: 2,
    facilitator: "Nana Agyei Ntoo",
    agenda: [
      "Introduction to project-based learning",
      "Current implementation challenges",
      "Success stories and best practices",
      "Next steps planning"
    ],
    attendees: [
      { id: 1, name: "Samuel Opoku", status: "present" },
      { id: 2, name: "Nana Agyei Ntoo", status: "present" },
      { id: 3, name: "Selassie Ametobey", status: "present" },
      { id: 4, name: "Joice Ammey", status: "present" }
    ],
    discussions: [
      {
        id: 1,
        userId: 1,
        userName: "Samuel Opoku",
        timestamp: "2024-11-20T15:35:00Z",
        message: "Project-based learning has shown great results in my mathematics classes.",
        type: "message"
      }
    ],
    files: [],
    voiceNotes: [],
    statistics: {
      totalParticipants: 4,
      averageEngagement: 8.5,
      keyOutcomes: ["Collaboration network established"],
      actionItems: []
    }
  },
  {
    id: 3,
    title: "Classroom Management Best Practices",
    date: "2024-11-28",
    time: "10:00",
    status: "new",
    clusterId: 1,
    facilitator: "Joice Ammey",
    agenda: ["Introduction", "Group Discussion", "Closing"],
    attendees: [],
    discussions: [],
    files: [],
    voiceNotes: []
  }
];

export const sampleLessonPlans = [
  {
    id: 1,
    title: "Quadratic Equations - Factoring Method",
    subject: "Mathematics",
    gradeLevel: "JHS 1",
    duration: "60 minutes",
    planType: "Lesson Plan",
    dok: { dok1: true, dok2: true, dok3: false, dok4: false },
    objectives: ["Students will be able to factor quadratic equations"],
    materials: ["Factoring worksheets"],
    introduction: { duration: "10 minutes", activities: ["Review previous lesson"] },
    mainActivity: { duration: "35 minutes", activities: [] },
    assessment: { formative: [], summative: [] },
    differentiation: [],
    homework: []
  }
];

export const sampleComments = [
  // --- General Assistance Requests ---
  {
    id: 1,
    userId: 1,
    userName: "Samuel Opoku",
    type: "text",
    content: "Differentiated instruction challenges in large classrooms.",
    timestamp: "2024-11-21T10:30:00Z",
    status: "open",
    priority: "high",
    responses: [
      {
        id: 101,
        userName: "Nana Agyei Ntoo",
        timestamp: "2024-11-21T11:00:00Z",
        content: "I recommend grouping students by ability for specific tasks."
      }
    ]
  },
  {
    id: 2,
    userId: 1,
    userName: "Samuel Opoku",
    type: "text",
    content: "Need advice on JHS 1 Mathematics curriculum pacing.",
    timestamp: "2024-11-20T09:00:00Z",
    status: "resolved",
    priority: "medium",
    responses: []
  },
  // --- Other Concerns ---
  {
    id: 5,
    userId: 1,
    userName: "Samuel Opoku",
    type: "concern",
    concernCategory: "Infrastructure",
    content: "ICT lab computers are mostly non-functional. Need urgent repairs before the digital literacy unit.",
    timestamp: "2024-11-24T10:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 6,
    userId: 2,
    userName: "Nana Agyei Ntoo",
    type: "concern",
    concernCategory: "Resources",
    content: "Insufficient textbooks for the new curriculum in JHS 2. Several students share a single copy.",
    timestamp: "2024-11-23T15:30:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 7,
    userId: 4,
    userName: "Joice Ammey",
    type: "concern",
    concernCategory: "Attendance",
    content: "Sudden drop in Friday attendance among JHS 3 students. Many leave for the market.",
    timestamp: "2024-11-25T08:45:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 51,
    userId: 6,
    userName: "Abena Mensah",
    type: "concern",
    concernCategory: "Behavioral",
    content: "Increasing classroom disruptions in Basic 3. Several students are consistently off-task.",
    timestamp: "2024-11-26T09:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 52,
    userId: 9,
    userName: "Yaw Kumi",
    type: "concern",
    concernCategory: "Resources",
    content: "No projector or visual aid equipment available for History lessons. Students cannot engage with maps or timelines effectively.",
    timestamp: "2024-11-27T10:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },

  // ===== ACADEMIC TEACHING SnW CONCERNS =====

  // --- 1. MATHEMATICS ---
  {
    id: 3,
    userId: 1,
    userName: "Samuel Opoku",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 1 students consistently struggle with forming and solving linear equations. Many cannot isolate variables or apply inverse operations correctly.",
    subject: "Mathematics",
    strand: "Algebra",
    loc: 2,
    timestamp: "2024-11-22T14:15:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 8,
    userId: 2,
    userName: "Nana Agyei Ntoo",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 3 students cannot identify geometric shapes, calculate area, or apply the Pythagorean theorem. Visual-spatial reasoning is very poor.",
    subject: "Mathematics",
    strand: "Geometry and Measurement",
    loc: 2,
    timestamp: "2024-11-22T09:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 9,
    userId: 3,
    userName: "Selassie Ametobey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students find it very hard to compare and order large numbers. Place value concepts are not well understood.",
    subject: "Mathematics",
    strand: "Number",
    loc: 1,
    timestamp: "2024-11-23T10:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 10,
    userId: 1,
    userName: "Samuel Opoku",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Most students cannot read bar graphs or interpret tables. Data handling and statistical activities are rarely completed meaningfully.",
    subject: "Mathematics",
    strand: "Data",
    loc: 3,
    timestamp: "2024-11-24T11:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 18,
    userId: 7,
    userName: "Kofi Darko",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 2 students struggle with ratio and proportion problems. Many confuse fractions with percentages and cannot apply cross-multiplication.",
    subject: "Mathematics",
    strand: "Number",
    loc: 2,
    timestamp: "2024-11-25T08:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 19,
    userId: 8,
    userName: "Ama Boateng",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 6 students cannot convert between units of measurement (km to m, kg to g). This is fundamental for science as well.",
    subject: "Mathematics",
    strand: "Geometry and Measurement",
    loc: 2,
    timestamp: "2024-11-26T10:30:00Z",
    status: "in-progress",
    priority: "medium",
    responses: []
  },

  // --- 2. ENGLISH LANGUAGE ARTS ---
  {
    id: 4,
    userId: 4,
    userName: "Joice Ammey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 4 students cannot decode unfamiliar words or use context clues. Phonics instruction has not translated to independent reading.",
    subject: "English Language Arts",
    strand: "Reading",
    loc: 3,
    timestamp: "2024-11-23T11:45:00Z",
    status: "in-progress",
    priority: "medium",
    responses: []
  },
  {
    id: 11,
    userId: 4,
    userName: "Joice Ammey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 4 students are unable to construct grammatically correct sentences or organize paragraphs when writing compositions.",
    subject: "English Language Arts",
    strand: "Writing",
    loc: 2,
    timestamp: "2024-11-21T08:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 12,
    userId: 2,
    userName: "Nana Agyei Ntoo",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 2 students are not confident speaking English in class. Oral presentations are extremely weak; students freeze when asked to narrate or explain fluently.",
    subject: "English Language Arts",
    strand: "Oral Language",
    loc: 2,
    timestamp: "2024-11-22T12:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 13,
    userId: 3,
    userName: "Selassie Ametobey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students cannot identify themes, characters, or settings in set texts. Literary analysis is almost absent.",
    subject: "English Language Arts",
    strand: "Literature",
    loc: 3,
    timestamp: "2024-11-23T14:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 20,
    userId: 9,
    userName: "Yaw Kumi",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 1 students cannot write essays with a clear introduction, body, and conclusion. Writing shows no logical structure or coherent argumentation.",
    subject: "English Language Arts",
    strand: "Writing",
    loc: 1,
    timestamp: "2024-11-20T09:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 21,
    userId: 9,
    userName: "Yaw Kumi",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students struggle to comprehend passages at the JHS 1 level. Reading speed is low and recall is poor even after guided reading sessions.",
    subject: "English Language Arts",
    strand: "Reading",
    loc: 2,
    timestamp: "2024-11-21T11:30:00Z",
    status: "open",
    priority: "high",
    responses: []
  },

  // --- 3. SCIENCE ---
  {
    id: 14,
    userId: 1,
    userName: "Samuel Opoku",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 1 students cannot explain basic chemical reactions, identify states of matter, or apply particle theory concepts.",
    subject: "Science",
    strand: "Physical Sciences",
    loc: 2,
    timestamp: "2024-11-24T09:30:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 15,
    userId: 4,
    userName: "Joice Ammey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 4 students do not understand food chains, ecosystems, or basic biological classification. Life science vocabulary is largely absent.",
    subject: "Science",
    strand: "Life Sciences",
    loc: 3,
    timestamp: "2024-11-25T07:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 22,
    userId: 8,
    userName: "Ama Boateng",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students cannot relate weather patterns to seasons or explain why Ghana experiences two rainy seasons. Earth science concepts are very shallow.",
    subject: "Science",
    strand: "Earth and Space Sciences",
    loc: 2,
    timestamp: "2024-11-26T08:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 23,
    userId: 3,
    userName: "Selassie Ametobey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students cannot identify common crops, explain soil types, or discuss why crop rotation matters. Agricultural science lessons have low engagement.",
    subject: "Science",
    strand: "Agricultural Sciences",
    loc: 3,
    timestamp: "2024-11-27T09:30:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 24,
    userId: 7,
    userName: "Kofi Darko",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 2 students confuse force, energy, and power. Basic physics experiments are difficult to conduct without lab equipment.",
    subject: "Science",
    strand: "Physical Sciences",
    loc: 2,
    timestamp: "2024-11-28T10:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },

  // --- 4. SOCIAL STUDIES ---
  {
    id: 16,
    userId: 2,
    userName: "Nana Agyei Ntoo",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 2 students cannot explain the roles of Parliament, Executive, or Judiciary. Civic duties and voting rights are not well understood.",
    subject: "Social Studies",
    strand: "Government and Citizenship",
    loc: 3,
    timestamp: "2024-11-21T11:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 17,
    userId: 3,
    userName: "Selassie Ametobey",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students cannot interpret simple maps or describe Ghana's major environmental features and natural resources.",
    subject: "Social Studies",
    strand: "Environment",
    loc: 2,
    timestamp: "2024-11-22T15:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 25,
    userId: 5,
    userName: "Kwame Asante",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 6 students struggle to explain basic economic concepts — supply, demand, trade, and markets. Real-world application is poor.",
    subject: "Social Studies",
    strand: "Economics",
    loc: 2,
    timestamp: "2024-11-24T10:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 26,
    userId: 5,
    userName: "Kwame Asante",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students cannot place key events on a timeline or connect Ghanaian independence to broader African historical movements.",
    subject: "Social Studies",
    strand: "History",
    loc: 3,
    timestamp: "2024-11-25T09:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },

  // --- 5. HISTORY ---
  {
    id: 27,
    userId: 5,
    userName: "Kwame Asante",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "JHS 1 students cannot explain the causes or consequences of colonialism in West Africa. They confuse colonial empires and key dates.",
    subject: "History",
    strand: "Colonialism and Independence",
    loc: 2,
    timestamp: "2024-11-20T11:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 28,
    userId: 9,
    userName: "Yaw Kumi",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students cannot name or describe key Ghana pre-colonial kingdoms like Ashanti, Dagbon, or Denkyira. Cultural heritage knowledge is very limited.",
    subject: "History",
    strand: "Ghanaian Kingdoms and Heritage",
    loc: 1,
    timestamp: "2024-11-22T08:30:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 29,
    userId: 5,
    userName: "Kwame Asante",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 6 students have little or no knowledge of current global events or their connection to historical patterns.",
    subject: "History",
    strand: "Contemporary World History",
    loc: 3,
    timestamp: "2024-11-24T14:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },

  // --- 6. RELIGIOUS & MORAL EDUCATION ---
  {
    id: 30,
    userId: 6,
    userName: "Abena Mensah",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 3 students cannot distinguish core beliefs of the three dominant religions in Ghana — Christianity, Islam, and Traditional Religion.",
    subject: "Religious & Moral Education",
    strand: "World Religions",
    loc: 3,
    timestamp: "2024-11-21T09:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 31,
    userId: 10,
    userName: "Efua Asiedu",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 5 students cannot explain why moral values like honesty and respect are important in the community. Lessons seem disconnected from daily life.",
    subject: "Religious & Moral Education",
    strand: "Moral Values and Character",
    loc: 2,
    timestamp: "2024-11-23T10:30:00Z",
    status: "open",
    priority: "medium",
    responses: []
  },
  {
    id: 32,
    userId: 6,
    userName: "Abena Mensah",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students cannot articulate common prayers, festivals, or sacred practices. Cultural and religious literacy is very shallow in this class.",
    subject: "Religious & Moral Education",
    strand: "Sacred Texts and Practices",
    loc: 2,
    timestamp: "2024-11-25T08:00:00Z",
    status: "open",
    priority: "low",
    responses: []
  },
  {
    id: 33,
    userId: 10,
    userName: "Efua Asiedu",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 4 students show poor understanding of community service and social responsibility. Discussion-based lessons have very limited participation.",
    subject: "Religious & Moral Education",
    strand: "Moral Values and Character",
    loc: 3,
    timestamp: "2024-11-26T11:00:00Z",
    status: "open",
    priority: "low",
    responses: []
  },

  // --- 7. GHANAIAN LANGUAGE ---
  {
    id: 34,
    userId: 6,
    userName: "Abena Mensah",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 3 students cannot hold a basic conversation in Twi or Ga. Pronunciation is poor and many do not speak the language at home.",
    subject: "Ghanaian Language",
    strand: "Oral Communication",
    loc: 1,
    timestamp: "2024-11-20T07:30:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 35,
    userId: 10,
    userName: "Efua Asiedu",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Basic 4 students cannot read simple texts in Fante. Decoding and phonological awareness in the mother tongue is critically weak.",
    subject: "Ghanaian Language",
    strand: "Reading and Comprehension",
    loc: 1,
    timestamp: "2024-11-21T07:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 36,
    userId: 6,
    userName: "Abena Mensah",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students can barely write a sentence in their local language. Spelling, grammar, and vocabulary in Ghanaian language writing are extremely poor.",
    subject: "Ghanaian Language",
    strand: "Writing",
    loc: 2,
    timestamp: "2024-11-22T08:00:00Z",
    status: "open",
    priority: "high",
    responses: []
  },
  {
    id: 37,
    userId: 10,
    userName: "Efua Asiedu",
    type: "academic-teaching-snw",
    concernCategory: "Academic Teaching SnW",
    content: "Students show very little appreciation for Ghanaian cultural heritage through language. Proverbs, folktales, and oral traditions are unknown to most students.",
    subject: "Ghanaian Language",
    strand: "Cultural Expression and Literature",
    loc: 3,
    timestamp: "2024-11-23T09:00:00Z",
    status: "open",
    priority: "medium",
    responses: []
  }
];

export const subjectStrands = {
  "Mathematics": ["Number", "Algebra", "Geometry and Measurement", "Data"],
  "Science": ["Physical Sciences", "Life Sciences", "Earth and Space Sciences", "Agricultural Sciences"],
  "English Language Arts": ["Oral Language", "Reading", "Writing", "Literature"],
  "Social Studies": ["Environment", "Government and Citizenship", "Economics", "History"],
  "History": ["Ghanaian Kingdoms and Heritage", "Colonialism and Independence", "Contemporary World History", "Pan-Africanism"],
  "Religious & Moral Education": ["World Religions", "Sacred Texts and Practices", "Moral Values and Character", "Social Responsibility"],
  "Ghanaian Language": ["Oral Communication", "Reading and Comprehension", "Writing", "Cultural Expression and Literature"]
};

export const concernCategories = [
  "Academic Teaching SnW",
  "Resources",
  "Infrastructure",
  "Attendance",
  "Behavioral",
  "Other"
];

export const regions = [
  "Greater Accra",
  "Ashanti",
  "Northern",
  "Central",
  "Western",
  "Eastern",
  "Volta",
  "Bono",
  "Upper East",
  "Upper West"
];

export const districts = {
  "Greater Accra": ["Accra Metro", "Tema Metro", "Ga East", "Ga West", "Kpone Katamanso"],
  "Ashanti": ["Kumasi Metro", "Obuasi Municipal", "Ejisu Municipal", "Mampong Municipal"],
  "Northern": ["Tamale Metro", "Sagnarigu Municipal", "Yendi Municipal", "Savelugu Municipal"],
  "Central": ["Cape Coast Metro", "Effutu Municipal", "Kasoa Municipal", "Agona West"],
  "Western": ["Sekondi Takoradi Metro", "Tarkwa Nsuaem", "Nzema East", "Ahanta West"]
};

export const circuits = {
  "Accra Metro": ["Osu", "Ablekuma", "Ashiedu Keteke", "Ayawaso West"],
  "Tema Metro": ["Tema North", "Tema South", "Tema Central"],
  "Kumasi Metro": ["Bantama", "Asokwa", "Manhyia", "Subin"],
  "Obuasi Municipal": ["Obuasi Central", "Obuasi East", "Obuasi West"],
  "Tamale Metro": ["Tamale Central", "Tamale South", "Tamale North"],
  "Sagnarigu Municipal": ["Sagnarigu", "Kalariga", "Choggu"],
  "Cape Coast Metro": ["Cape Coast North", "Cape Coast South"],
  "Sekondi Takoradi Metro": ["Sekondi", "Takoradi", "Essikado"]
};

export const schools = {
  "Osu": [
    { id: "101020001", name: "Osu Salem Basic School" },
    { id: "101020002", name: "Osu Presbyterian Basic School" },
    { id: "101020003", name: "Osu Manhean Basic School" }
  ],
  "Ablekuma": [
    { id: "101030001", name: "Ablekuma Central Basic School" },
    { id: "101030002", name: "Odorkor Maclean Basic" }
  ],
  "Bantama": [
    { id: "201010001", name: "Bantama Methodist Basic School" },
    { id: "201010002", name: "Bantama Presby Basic School" },
    { id: "201010003", name: "Bantama Islamic Basic" }
  ],
  "Asokwa": [
    { id: "201020001", name: "Asokwa Amakom Basic School" },
    { id: "201020002", name: "Asokwa Presby Basic" }
  ],
  "Tamale Central": [
    { id: "301030001", name: "Tamale Central Mosque Basic School" },
    { id: "301030002", name: "Tamale Presbyterian Basic School" },
    { id: "301030003", name: "Tamale Modern Basic School" }
  ],
  "Tamale South": [
    { id: "301040001", name: "Tamale South Basic School" },
    { id: "301040002", name: "Lamishegu Basic School" }
  ],
  "Sagnarigu": [
    { id: "302010001", name: "Sagnarigu M/A Basic School" },
    { id: "302010002", name: "Education Ridge Basic" }
  ],
  "Sekondi": [
    { id: "501010001", name: "Sekondi Methodist Basic School" },
    { id: "501010002", name: "Sekondi College Basic" }
  ]
};

export const gradeLevels = [
  "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5", "Basic 6",
  "JHS 1", "JHS 2", "JHS 3"
];

export const subjectAreas = [
  "Mathematics",
  "English Language Arts",
  "Science",
  "Social Studies",
  "History",
  "Religious & Moral Education",
  "Ghanaian Language"
];