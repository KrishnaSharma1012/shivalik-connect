export const DUMMY_POSTS = [
  {
    _id: "dp1",
    author: {
      _id: "u1",
      name: "Rahul Sharma",
      role: "alumni",
      isVerified: true,
      company: "Google",
      avatar: "R"
    },
    content: "Thrilled to share that I've completed my Advanced System Design certification! 🚀 It's been an incredible journey learning to build scalable distributed systems. Can't wait to apply these learnings to real-world challenges.",
    image: "/dummy/certificate.png",
    likes: ["u2", "u3", "u4", "u10", "u11"],
    comments: [
      { _id: "c1", author: { name: "Arjun" }, content: "Congratulations Rahul! This is huge. 🔥" },
      { _id: "c2", author: { name: "Sneha" }, content: "Inspiring! Looking forward to your session on this." }
    ],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  },
  {
    _id: "dp2",
    author: {
      _id: "u2",
      name: "Priya Nair",
      role: "alumni",
      isVerified: true,
      company: "Meta",
      avatar: "P"
    },
    content: "Our team just won the Global Tech Hackathon 2026! 🏆 48 hours of intense coding, networking, and innovation. So proud of what we built. If you're a student looking for hackathon tips, feel free to connect!",
    image: "/dummy/achievement.png",
    likes: ["u1", "u4", "u5", "u6", "u7", "u8", "u9", "u12", "u13", "u14"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
  },
  {
    _id: "dp3",
    author: {
      _id: "u3",
      name: "Amit Patel",
      role: "student",
      isVerified: false,
      college: "IIT Bombay",
      avatar: "A"
    },
    content: "Just started learning React and honestly, the community here is amazing. Any recommendations on advanced state management patterns? Redux vs Context vs Zustand?",
    likes: ["u1", "u2"],
    comments: [
      { _id: "c3", author: { name: "Rahul Sharma" }, content: "Start with Context for small apps, then check out Zustand. It's much lighter than Redux!" }
    ],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
  },
  {
    _id: "dp4",
    author: {
      _id: "u10",
      name: "Sanya Gupta",
      role: "alumni",
      isVerified: true,
      company: "Amazon",
      avatar: "S"
    },
    content: "Hosting a live session this Sunday on 'Demystifying the Amazon SDE-1 Interview'. We'll cover LPs, DSA expectations, and mock scenarios. Limited seats available! Check the Academics tab.",
    likes: ["u3", "u15", "u20"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  }
];

export const DUMMY_ALUMNI = [
  {
    _id: "ua1",
    name: "Rahul Sharma",
    role: "Senior Software Engineer",
    company: "Google",
    college: "IIT Delhi",
    alumniPlan: "premium",
    avatar: "R",
    skills: ["System Design", "Java", "GCP"],
    interests: ["Distributed Systems", "Mentorship"]
  },
  {
    _id: "ua2",
    name: "Priya Nair",
    role: "Product Manager",
    company: "Meta",
    college: "BITS Pilani",
    alumniPlan: "premium",
    avatar: "P",
    skills: ["Product Strategy", "Agile", "User Research"],
    interests: ["EdTech", "Social Impact"]
  },
  {
    _id: "ua4",
    name: "Sanya Gupta",
    role: "SDE-2",
    company: "Amazon",
    college: "DTU",
    alumniPlan: "standard",
    avatar: "S",
    skills: ["Distributed Computing", "AWS", "Python"],
    interests: ["Cloud Infrastructure", "Backend Development"]
  },
  {
    _id: "ua5",
    name: "Vikram Singh",
    role: "Data Scientist",
    company: "Microsoft",
    college: "NSUT",
    alumniPlan: "premium",
    avatar: "V",
    skills: ["Machine Learning", "PyTorch", "Azure"],
    interests: ["AI Ethics", "Big Data"]
  }
];

export const DUMMY_MY_POSTS = [
  {
    _id: "mp1",
    author: { name: "You", avatar: "Y" },
    content: "Just finalized the syllabus for my upcoming MERN Stack workshop! We'll be building a real-time collaboration tool from scratch. 🚀 #FullStack #MERN #Workshop",
    likes: ["ua2", "ua4"],
    comments: [
      { author: { name: "Priya Nair" }, content: "Sounds awesome! Can't wait to see the demo." }
    ],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    _id: "mp2",
    author: { name: "You", avatar: "Y" },
    content: "Important update: The system design session scheduled for tomorrow is moved to 7 PM IST to accommodate more students. See you all there! 🎥",
    likes: ["ua5"],
    comments: [],
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(), // 1 week ago
  }
];

export const DUMMY_EARNINGS = [
  {
    _id: "tx1",
    sourceTitle: "System Design Masterclass",
    type: "session",
    grossAmount: 1999,
    alumniShare: 1599,
    status: "paid",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    _id: "tx2",
    sourceTitle: "React Performance Workshop",
    type: "workshop",
    grossAmount: 999,
    alumniShare: 799,
    status: "paid",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    _id: "tx3",
    sourceTitle: "Frontend Interview Course",
    type: "course",
    grossAmount: 4999,
    alumniShare: 3999,
    status: "paid",
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString()
  }
];

export const DUMMY_MY_SESSIONS = [
  {
    _id: "ms1",
    title: "MERN Stack Depth Session",
    type: "session",
    description: "Deep dive into MongoDB aggregation and React optimization.",
    date: "2026-04-20",
    time: "18:00",
    duration: "90 min",
    price: 499,
    totalSeats: 25,
    enrolled: 18,
    isLive: false,
    thumbnail: "/dummy/achievement.png"
  },
  {
    _id: "ms2",
    title: "System Design for Beginners",
    type: "workshop",
    description: "Learning load balancers, caching, and database sharding.",
    date: "2026-04-25",
    time: "10:00",
    duration: "180 min",
    price: 1299,
    totalSeats: 50,
    enrolled: 42,
    isLive: true,
    thumbnail: "/dummy/certificate.png"
  }
];

export const DUMMY_CONVERSATIONS = [
  {
    id: "ds1",
    name: "Amit Patel",
    company: "IIT Bombay",
    lastMessage: "Thanks for the guidance on React hooks!",
    time: "10:30 AM",
    unread: 2,
    avatar: "A",
    color: "#7C5CFC",
    subscribed: true
  },
  {
    id: "ds2",
    name: "Sneha Reddy",
    company: "BITS Pilani",
    lastMessage: "Are there any slots for the mock interview?",
    time: "9:15 AM",
    unread: 0,
    avatar: "S",
    color: "#7C5CFC",
    subscribed: false
  }
];

export const DUMMY_MESSAGES = [
  { sender: "them", text: "Hello! I saw your post about the System Design session.", time: "10:00 AM" },
  { sender: "me", text: "Hi Amit! Yes, it's happening this Sunday. Are you interested?", time: "10:05 AM" },
  { sender: "them", text: "Definitely. I've already enrolled. Thanks for the guidance on React hooks!", time: "10:30 AM" }
];
