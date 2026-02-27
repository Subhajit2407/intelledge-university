import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Academics from "./pages/Academics";
import Placements from "./pages/Placements";
import CalendarPage from "./pages/CalendarPage";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";
import AICopilot from "./pages/AICopilot";
import ResumeChecker from "./pages/ResumeChecker";
import { AIVoiceOrb } from "./components/dashboard/AIVoiceOrb";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { logout } from "./utils/auth";

const queryClient = new QueryClient();

const App = () => {
  const getRole = () => localStorage.getItem("intelledge_role");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="fixed top-2 right-2 z-[9999] px-2 py-1 bg-primary/20 text-[10px] font-black rounded-lg backdrop-blur text-primary italic">
          v4.2.2-STABLE
        </div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Gatekeeper><Index /></Gatekeeper>} />
            <Route path="/academics" element={<Gatekeeper><Academics /></Gatekeeper>} />
            <Route path="/placements" element={<Gatekeeper><Placements /></Gatekeeper>} />
            <Route path="/calendar" element={<Gatekeeper><CalendarPage /></Gatekeeper>} />
            <Route path="/resources" element={<Gatekeeper><Resources /></Gatekeeper>} />
            <Route path="/projects" element={<Gatekeeper><Projects /></Gatekeeper>} />
            <Route path="/analytics" element={<Gatekeeper><Analytics /></Gatekeeper>} />
            <Route path="/ai-copilot" element={<Gatekeeper><AICopilot /></Gatekeeper>} />
            <Route path="/resume-checker" element={<Gatekeeper><ResumeChecker /></Gatekeeper>} />
            <Route path="*" element={<LogOutRedirect />} />
          </Routes>
          <AIVoiceOrb />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const Gatekeeper = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("intelledge_role");
  if (!role) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const LogOutRedirect = () => {
  return <Navigate to="/login" replace />;
};

export default App;
