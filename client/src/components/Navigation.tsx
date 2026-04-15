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
  X,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const isMyanmar = language === "my";

  const modules = [
    {
      id: "pillars",
      icon: BookOpen,
      label: isMyanmar ? "အဓိကမဏ္ဍိုင်များ" : "Core Pillars",
      href: "/pillars",
    },
    {
      id: "compliance",
      icon: Briefcase,
      label: isMyanmar ? "စည်းမျဉ်းလိုက်နာမှုဗဟို" : "Compliance Hub",
      href: "/compliance",
    },
    {
      id: "market-pulse",
      icon: TrendingUp,
      label: isMyanmar ? "ဈေးကွက်စီးဆင်းမှု" : "Market Pulse",
      href: "/market-pulse",
    },
    {
      id: "trade-mastery",
      icon: Zap,
      label: isMyanmar ? "ကုန်သွယ်မှုကျွမ်းကျင်မှု" : "Trade Mastery",
      href: "/trade-mastery",
    },
    {
      id: "geopolitics",
      icon: Globe,
      label: isMyanmar ? "ပထဝီနိုင်ငံရေး" : "Geopolitics",
      href: "/geopolitics",
    },
    {
      id: "sample-projects",
      icon: Map,
      label: isMyanmar ? "နမူနာစီမံကိန်းများ" : "Sample Projects",
      href: "/sample-projects",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                title={isMyanmar ? "နောက်သို့" : "Back"}
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
              {isMyanmar ? "ပင်မစာမျက်နှာ" : "Home"}
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
                  {isMyanmar ? "ကဏ္ဍများ" : "Modules"}
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

            <div className="flex items-center gap-1 rounded-md border border-primary/30 p-1">
              <Button
                variant={language === "my" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setLanguage("my")}
              >
                MM
              </Button>
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
            </div>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "my" ? "en" : "my")}
              className="text-primary"
              title={isMyanmar ? "ဘာသာပြောင်းရန်" : "Switch language"}
            >
              <Languages className="w-5 h-5" />
            </Button>
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

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-primary/20 py-4 px-6 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-2">
              <div className="mb-3 flex items-center justify-end gap-2">
                <Button
                  variant={language === "my" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setLanguage("my")}
                >
                  Myanmar
                </Button>
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setLanguage("en")}
                >
                  English
                </Button>
              </div>

              <Button
                variant="ghost"
                className={cn(
                  "justify-start text-lg font-semibold",
                  location === "/" ? "text-primary bg-primary/10" : "text-foreground/70"
                )}
                onClick={() => navigateTo("/")}
              >
                <Home className="w-5 h-5 mr-3" />
                {isMyanmar ? "ပင်မစာမျက်နှာ" : "Home"}
              </Button>

              <div className="mt-4 mb-2 px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {isMyanmar ? "ကုန်သွယ်မှုကဏ္ဍများ" : "Trade Modules"}
                </p>
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

      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        className={cn(
          "fixed bottom-6 right-6 z-50 rounded-full shadow-lg transition-all duration-300 border border-primary/30 bg-background/80 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        title={isMyanmar ? "အပေါ်သို့ပြန်သွားရန်" : "Back to top"}
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </>
  );
}
