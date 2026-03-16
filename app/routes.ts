import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route('login', './pages/Login.tsx'),
    route('register', './pages/Register.tsx'),
    route('regsitraion-success', './pages/RegisterSuccess.tsx'),
    layout('./routes/protected.tsx', [
        layout('./layouts/MainLayout.tsx', [
            index('./pages/Dashboard.tsx'),
            route('courses', './pages/Courses.tsx'),
            route('achievements', './pages/Achievements.tsx'),
            route('profile', './pages/Profile.tsx'),
            route('settings', './pages/Settings.tsx'),
            route('courses/:courseId', './pages/CourseDetail.tsx'),
            route('courses/:courseId/lessons/:lessonId', './pages/Lesson.tsx'),
            route('*', './routes/splat-redirect.tsx'),
        ]),
    ]),
] satisfies RouteConfig;
