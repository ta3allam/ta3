import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseDetail from "./pages/student/CourseDetail";
import TeacherCourseDetail from "./pages/teacher/TeacherCourseDetail";
import { HelmetProvider } from "react-helmet-async";
import UniversitiesPage from "./pages/Universities";
import DepartmentsPage from "./pages/Departments";
import CoursesPage from "./pages/Courses";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={process.env.NODE_ENV === "development" ? "/ta3" : ""}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/teacher" element={<TeacherDashboard />} />
              <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetail />} />
              <Route path="/universities" element={<UniversitiesPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CoursesPage />} />
              <Route path="/universities/:universityId" element={<DepartmentsPage />} />
              <Route path="/departments/:departmentId" element={<CoursesPage />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/courses/:courseId" element={<CourseDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
