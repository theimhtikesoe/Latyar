import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ArrowUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (location === "/") return;
    window.history.back();
  };

  const goHome = () => {
    setLocation("/");
  };

  return (
    <>
      {/* Sticky Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled 
            ? "bg-background/80 backdrop-blur-md border-primary/20 py-3" 
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            {location !== "/" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goBack}
                className="text-primary hover:bg-primary/10"
                title="Back"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            <div 
              className="font-bold text-xl cursor-pointer flex items-center gap-2"
              onClick={goHome}
            >
              <span className="text-primary neon-glow">လက်ျာ</span>
              <span className="hidden sm:inline text-foreground/80 text-sm font-medium tracking-widest">LATYAR</span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className={cn(
                "text-foreground/70 hover:text-primary hover:bg-primary/10",
                location === "/" && "text-primary bg-primary/10"
              )}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </nav>
        </div>
      </header>

      {/* Scroll to Top Button */}
      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300 border border-primary/30 bg-background/80 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        title="Scroll to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </>
  );
}
