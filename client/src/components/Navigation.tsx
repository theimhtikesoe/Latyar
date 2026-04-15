import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  ChevronLeft, 
  ArrowUp, 
  Home, 
  ChevronDown, 
  BookOpen, 
  Briefcase, 
  TrendingUp, 
  Zap, 
  Globe, 
  Map,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    { id: "pillars", icon: BookOpen, label: "အဓိကမဏ္ဍိုင်များ", href: "/pillars" },
    { id: "compliance", icon: Briefcase, label: "စည်းမျဉ်းလိုက်နာမှုဗဟို", href: "/compliance" },
    { id: "market-pulse", icon: TrendingUp, label: "ဈေးကွက်စီးဆင်းမှု", href: "/market-pulse" },
    { id: "trade-mastery", icon: Zap, label: "ကုန်သွယ်မှုကျွမ်းကျင်မှု", href: "/trade-mastery" },
    { id: "geopolitics", icon: Globe, label: "ပထဝီနိုင်ငံရေး", href: "/geopolitics" },
    { id: "sample-projects", icon: Map, label: "နမူနာစီမံကိန်းများ", href: "/sample-projects" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (location === "/") return;
    window.history.back();
  };

  const navigateTo = (href: string) => {
    setLocation(href);
  };

  return (
    <>
      {/* Sticky Header */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled || isMobileMenuOpen
            ? "bg-background/95 backdrop-blur-md border-primary/20 py-3" 
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
                title="နောက်သို့"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            <div 
              className="font-bold text-xl cursor-pointer flex items-center gap-2"
              onClick={() => navigateTo("/")}
            >
              <span className="text-primary neon-glow">လက်ျာ</span>
              <span className="hidden sm:inline text-foreground/80 text-sm font-medium tracking-widest">LATYAR</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo("/")}
              className={cn(
                "text-foreground/70 hover:text-primary hover:bg-primary/10",
                location === "/" && "text-primary bg-primary/10"
              )}
            >
              <Home className="w-4 h-4 mr-2" />
              ပင်မစာမျက်နှာ
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-foreground/70 hover:text-primary hover:bg-primary/10",
                    location !== "/" && location !== "/404" && "text-primary bg-primary/10"
                  )}
                >
                  ကဏ္ဍများ
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-primary/20">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <DropdownMenuItem
                      key={module.id}
                      onClick={() => navigateTo(module.href)}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer py-3 focus:bg-primary/10 focus:text-primary",
                        location === module.href && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{module.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-primary/20 py-4 px-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                className={cn(
                  "justify-start text-lg font-semibold",
                  location === "/" ? "text-primary bg-primary/10" : "text-foreground/70"
                )}
                onClick={() => navigateTo("/")}
              >
                <Home className="w-5 h-5 mr-3" />
                ပင်မစာမျက်နှာ
              </Button>
              
              <div className="mt-4 mb-2 px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ကုန်သွယ်မှုကဏ္ဍများ</p>
              </div>
              
              <div className="grid grid-cols-1 gap-1">
                {modules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Button
                      key={module.id}
                      variant="ghost"
                      className={cn(
                        "justify-start py-6",
                        location === module.href ? "text-primary bg-primary/10" : "text-foreground/70"
                      )}
                      onClick={() => navigateTo(module.href)}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{module.label}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
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
        title="အပေါ်သို့ပြန်သွားရန်"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </>
  );
}
