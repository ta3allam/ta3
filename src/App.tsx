import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import RequireAuth from "@/components/layout/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { CourseProvider } from "./contexts/CourseContext";
import BackgroundDecor from "@/components/layout/BackgroundDecor";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const CoursesPage = lazy(() => import("./pages/courses/Courses"));
const CourseTimeline = lazy(() => import("./pages/courses/Timeline"));
const CourseGroups = lazy(() => import("./pages/courses/Groups"));
const CourseDiscussion = lazy(() => import("./pages/courses/Discussion"));
const CourseContact = lazy(() => import("./pages/courses/Contact"));

const queryClient = new QueryClient();

// Loading component for Suspense
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<LoadingScreen />}>
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

                    {/* Shared Courses Routes - Refactored to avoid ambiguity if needed, 
                        but keeping consistent with role-based access above for now. 
                        Added a catch to redirect general /courses to appropriate dashboard */}
                    <Route element={<RequireAuth allowedRoles={['student', 'teacher', 'admin']} />}>
                      <Route path="/courses" element={<Navigate to="/" replace />} />
                      <Route path="/courses/:courseId/*" element={<CoursesPage />} />
                    </Route>

                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </CourseProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
