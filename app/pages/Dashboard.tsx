import { COURSES } from '~/constants'
import { BookOpen, Clock, Star, GraduationCap } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { userContext } from '~/context'
import type { Route } from './+types/Dashboard'
import { CourseSchema } from '~/types'
import {
  getUserCourses,
  getCourseLessonCount,
} from '~/.server/database/utils'
import z from 'zod'
import ContinueLearning from '~/components/ContinueLearning'
import RecommendedCourses from '~/components/RecommendedCourses'

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext)
  if (user === null) {
    throw new Error('User context resolved to null.')
  }

  var mode = 'db'
  var coursesParsed
  switch (mode) {
    case 'db':
      const courses = await getUserCourses(user.id)
      courses.map((c) => ({ ...c, lessonCount: getCourseLessonCount(c.id) }))
      coursesParsed = z.array(CourseSchema).parse(courses)
      return { mode, user, courses: coursesParsed }
    case 'local':
      coursesParsed = z.array(CourseSchema).parse(COURSES)
      return { mode, user, courses: coursesParsed }
    default:
      break
  }
}

export default function Dashboard() {
  const { mode, user, courses } = useLoaderData()
  const continueCourse = courses[0]
  const recommendedCourses = courses.slice(1)

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section>
        <p className="text-slate-600 mt-1">USING MODE: {mode}</p>
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}! 👋</h1>
        <p className="text-slate-400 mt-1">You've completed 45% of your weekly goal. Keep it up!</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Courses in Progress', value: '4', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Completed Courses', value: '12', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Learning Hours', value: '124h', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Achievement Points', value: '2,450', icon: Star, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className={stat.bg + " w-10 h-10 rounded-xl flex items-center justify-center mb-4"}>
              <stat.icon className={stat.color + " w-5 h-5"} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </section>

        <ContinueLearning course={continueCourse} />
        <RecommendedCourses courses={recommendedCourses} />
    </div>
  )
}