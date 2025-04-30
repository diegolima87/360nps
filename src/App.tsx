
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SurveyCreate from "./pages/SurveyCreate";
import SurveyEdit from "./pages/SurveyEdit";
import SurveyPage from "./pages/SurveyPage";
import SurveyResults from "./pages/SurveyResults";
import ThankYouPage from "./pages/ThankYouPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/survey/:id" element={<SurveyPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/survey-create" element={
              <ProtectedRoute>
                <SurveyCreate />
              </ProtectedRoute>
            } />
            <Route path="/survey-edit/:id" element={
              <ProtectedRoute>
                <SurveyEdit />
              </ProtectedRoute>
            } />
            <Route path="/survey-results/:id" element={
              <ProtectedRoute>
                <SurveyResults />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
