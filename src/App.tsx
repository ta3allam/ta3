import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CoursesPage from "./pages/courses/Courses";
import CourseTimeline from "./pages/courses/Timeline";
import CourseGroups from "./pages/courses/Groups";
import CourseDiscussion from "./pages/courses/Discussion";
import CourseContact from "./pages/courses/Contact";
import { HelmetProvider } from "react-helmet-async";
import RequireAuth from "@/components/layout/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { CourseProvider } from "./contexts/CourseContext";
import BackgroundDecor from "@/components/layout/BackgroundDecor";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <CourseProvider>
          <TooltipProvider>
            <BackgroundDecor />
            <div className="relative z-10 bg-transparent">
              <Toaster />
              <Sonner />
              <BrowserRouter basename={process.env.NODE_ENV === "development" ? "/ta3" : ""}>
                <Routes>
                  <Route path="/" element={<Login />} />

                  {/* Admin Routes */}
                  <Route element={<RequireAuth allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Route>

                  {/* Teacher Routes */}
                  <Route element={<RequireAuth allowedRoles={['teacher']} />}>
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/teacher/courses/:courseId" element={<CoursesPage />} />
                    <Route path="/teacher/courses/:courseId/timeline" element={<CourseTimeline />} />
                    <Route path="/teacher/courses/:courseId/groups" element={<CourseGroups />} />
                    <Route path="/teacher/courses/:courseId/discussion" element={<CourseDiscussion />} />
                  </Route>

                  {/* Student Routes */}
                  <Route element={<RequireAuth allowedRoles={['student']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/courses/:courseId" element={<CoursesPage />} />
                    <Route path="/student/courses/:courseId/timeline" element={<CourseTimeline />} />
                    <Route path="/student/courses/:courseId/groups" element={<CourseGroups />} />
                    <Route path="/student/courses/:courseId/discussion" element={<CourseDiscussion />} />
                    <Route path="/student/courses/:courseId/contact" element={<CourseContact />} />
                  </Route>

                  {/* Shared Routes (Check role inside component or allow all auth users) */}
                  <Route element={<RequireAuth allowedRoles={['student', 'teacher', 'admin']} />}>
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route path="/courses/:courseId" element={<CoursesPage />} />
                    <Route path="/courses/:courseId/timeline" element={<CourseTimeline />} />
                    <Route path="/courses/:courseId/groups" element={<CourseGroups />} />
                    <Route path="/courses/:courseId/discussion" element={<CourseDiscussion />} />
                  </Route>

                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </CourseProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
