import { db } from "./connection"
import {
  users,
  courses,
  modules,
  lessons,
  reviews,
  usersToCourses,
  usersToLessons
} from "./schema"

async function seed() {
  // Users
  const insertedUsers = await db.insert(users).values([
    {
      name: "Alice Nguyen",
      email: "alice@example.com",
      password: "hashedpassword1",
    },
    {
      name: "Bob Tran",
      email: "bob@example.com",
      password: "hashedpassword2",
    },
  ]).returning()

  const [alice, bob] = insertedUsers

  // Courses
  const insertedCourses = await db.insert(courses).values([
    {
      title: "Intro to Web Development",
      description: "Learn HTML, CSS, and JavaScript",
      instructor: "John Doe",
      thumbnail: "/thumbs/webdev.png",
      category: "Programming",
      length: "8 hours",
    },
    {
      title: "React Fundamentals",
      description: "Build modern React applications",
      instructor: "Jane Smith",
      thumbnail: "/thumbs/react.png",
      category: "Frontend",
      length: "10 hours",
    },
  ]).returning()

  const [webCourse, reactCourse] = insertedCourses

  // Modules
  const insertedModules = await db.insert(modules).values([
    { title: "HTML Basics", courseId: webCourse.id },
    { title: "CSS Styling", courseId: webCourse.id },
    { title: "React Basics", courseId: reactCourse.id },
  ]).returning()

  const [htmlModule, cssModule, reactModule] = insertedModules

  // Lessons
  const insertedLessons = await db.insert(lessons).values([
    { title: "HTML Structure", length: 10, moduleId: htmlModule.id },
    { title: "HTML Forms", length: 12, moduleId: htmlModule.id },

    { title: "Flexbox", length: 15, moduleId: cssModule.id },
    { title: "Grid Layout", length: 15, moduleId: cssModule.id },

    { title: "React Components", length: 20, moduleId: reactModule.id },
    { title: "React State", length: 18, moduleId: reactModule.id },
  ]).returning()

  // Enroll users in courses
  await db.insert(usersToCourses).values([
    { userId: alice.id, courseId: webCourse.id },
    { userId: alice.id, courseId: reactCourse.id },
    { userId: bob.id, courseId: webCourse.id },
  ])

  // Mark some lessons completed
  await db.insert(usersToLessons).values([
    { usersId: alice.id, lessonId: insertedLessons[0].id, completed: true },
    { usersId: alice.id, lessonId: insertedLessons[1].id, completed: true },
    { usersId: bob.id, lessonId: insertedLessons[0].id, completed: false },
  ])

  // Reviews
  await db.insert(reviews).values([
    {
      userId: alice.id,
      courseId: webCourse.id,
      content: "Great introduction to web development!",
      rating: 5,
    },
    {
      userId: bob.id,
      courseId: webCourse.id,
      content: "Very helpful course",
      rating: 4,
    },
  ])

  console.log("Database seeded successfully")
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })