// ⏳ Fake delay (simulate API)
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 📚 Get all courses
export async function getCourses() {
  await delay(500);

  return [
    {
      id: 1,
      title: "Crack FAANG Interviews",
      instructor: "Rahul (Google)",
      description: "DSA + System Design complete preparation",
      price: 1999,
      originalPrice: 2999,
    },
    {
      id: 2,
      title: "Frontend Mastery",
      instructor: "Ananya (Amazon)",
      description: "React, Tailwind, real-world projects",
      price: 1499,
    },
  ];
}

// 🎥 Get all sessions (live workshops)
export async function getSessions() {
  await delay(500);

  return [
    {
      id: 1,
      title: "System Design Live Session",
      instructor: "Rahul (Google)",
      description: "Learn HLD + LLD with real examples",
      date: "25 April 2026",
      time: "6:00 PM",
      price: 999,
      seatsLeft: 5,
      isLive: false,
    },
    {
      id: 2,
      title: "React Live Workshop",
      instructor: "Ananya (Amazon)",
      description: "Build projects live",
      date: "28 April 2026",
      time: "7:00 PM",
      price: 799,
      seatsLeft: 0,
      isLive: false,
    },
  ];
}

// 📄 Get single course by ID
export async function getCourseById(id) {
  const courses = await getCourses();
  return courses.find((course) => course.id === id);
}

// 💰 Enroll in course
export async function enrollCourse(courseId) {
  await delay(400);

  return {
    success: true,
    message: "Enrollment successful",
    courseId,
  };
}