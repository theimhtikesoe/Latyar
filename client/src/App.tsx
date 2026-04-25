import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import ThePillars from "./pages/ThePillars";
import ScrollToTop from "./components/ScrollToTop";
import ComplianceHub from "./pages/ComplianceHub";
import MarketPulse from "./pages/MarketPulse";
import TradeMastery from "./pages/TradeMastery";
import Geopolitics from "./pages/Geopolitics";
import SampleProjects from "./pages/SampleProjects";
import KnowledgeDashboard from "./pages/KnowledgeDashboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/pillars"} component={ThePillars} />
      <Route path={"/compliance"} component={ComplianceHub} />
      <Route path={"/market-pulse"} component={MarketPulse} />
      <Route path={"/trade-mastery"} component={TradeMastery} />
      <Route path={"/geopolitics"} component={Geopolitics} />
      <Route path={"/sample-projects"} component={SampleProjects} />
      <Route path={"/knowledge-dashboard"} component={KnowledgeDashboard} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Design: Neon-Noir Dark Mode
// Theme: Dark background with cyan, orange, and purple neon accents
// Philosophy: Legacy over Currency, Winning in the Storm

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="dark"
        >
          <TooltipProvider>
            <ScrollToTop />
            <Toaster />
            <Navigation />
            <main className="pt-16">
              <Router />
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
