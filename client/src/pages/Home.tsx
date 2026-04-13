import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Briefcase, Globe, TrendingUp, Zap, Map } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  const modules = [
    {
      id: "pillars",
      icon: BookOpen,
      label: "The Pillars",
      description: "Documentation vs Operations",
      href: "/pillars",
    },
    {
      id: "compliance",
      icon: Briefcase,
      label: "Compliance Hub",
      description: "DICA, Trade Net 2.0, MACCS",
      href: "/compliance",
    },
    {
      id: "market-pulse",
      icon: TrendingUp,
      label: "Market Pulse",
      description: "15/85 Rule & Taxation",
      href: "/market-pulse",
    },
    {
      id: "trade-mastery",
      icon: Zap,
      label: "Trade Mastery",
      description: "Incoterms & Logistics",
      href: "/trade-mastery",
    },
    {
      id: "geopolitics",
      icon: Globe,
      label: "Geopolitics",
      description: "BRI & Trade Gates",
      href: "/geopolitics",
    },
    {
      id: "sample-projects",
      icon: Map,
      label: "Sample Projects",
      description: "PET Pellets Case Study",
      href: "/sample-projects",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                <span className="neon-glow">လချစ်ရာ</span>
                <br />
                <span className="text-foreground">LatYar</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                Gateway to Global Trade: Full Knowledge Sharing Hub
              </p>
            </div>

            <div className="space-y-3 py-8">
              <p className="text-lg neon-glow-orange font-semibold">
                Legacy over Currency. Winning in the Storm.
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                No sugarcoating. Just real strategy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/pillars")}
              >
                Explore Modules
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">Six Pillars of Trade Mastery</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Navigate the complete landscape of international trade and logistics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card
                    key={module.id}
                    className="group cursor-pointer hover:neon-border transition-all duration-300 border-border hover:border-primary active:scale-[0.98] touch-manipulation"
                    onClick={() => navigate(module.href)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center text-primary transition-all transform translate-x-0 md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0">
                          <span className="text-xs font-bold uppercase tracking-wider">Open</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mt-4 group-hover:text-primary transition-colors">
                        {module.label}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="pt-2 border-t border-border/50 group-hover:border-primary/30 transition-colors">
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          Click to explore detailed guides and strategic insights for {module.label.toLowerCase()}.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why LatYar Section */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">Why LatYar?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built for traders who demand precision, strategy, and real-world insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">📚 Deep Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprehensive guides on documentation, compliance, and trade procedures. No fluff, just real strategy.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">🛠️ Interactive Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Incoterms calculator, tax estimator, HS code finder. Tools built for professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">🌍 Strategic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Geopolitical analysis, market dynamics, real-world case studies. The edge you need.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Rhyzoe Section */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/50 neon-border">
              <CardHeader>
                <CardTitle className="text-3xl">About Rhyzoe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  <span className="neon-glow">Dev x Artist x Crypto Hustler</span> building the legacy brand for Myanmar's Trade Industry.
                </p>
                <p className="text-muted-foreground">
                  This platform is built on a simple philosophy: <span className="neon-glow-orange">Legacy over Currency</span>. We don't sugarcoat. We don't simplify. We give you the real strategy, the real numbers, the real path to winning in the storm.
                </p>
                <p className="text-muted-foreground">
                  Myanmar's trade industry deserves better than generic advice. It deserves insight from someone who understands the market, the culture, and the opportunity. That's what LatYar delivers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Trends Section */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">Future Trends & Technology</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                2026-2027 အတွင်း မျှော်မှန်းထားသော နည်းပညာနှင့် မူဝါဒအပြောင်းအလဲများ။
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">🧪</span>
                    Lab Grown Meat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cell-based meat များသည် 2027 ဝန်းကျင်တွင် Luxury product အဖြစ် ဈေးကွက်ဝင်လာမည်။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">⚡</span>
                    EV Special Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    2026 မတ်လကုန်အထိ EV အပိုပစ္စည်းများ အကောက်ခွန် 0% ခံစားခွင့်ရှိသည်။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">📊</span>
                    Automation & Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automation Dashboard နှင့် Tracking သည် အနာဂတ်၏ အခွင့်အလမ်းဖြစ်သည်။
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">Ready to Master the Trade?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join the elite circle of traders who understand the game.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90"
            onClick={() => navigate("/pillars")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container text-center text-muted-foreground">
          <p>© 2026 LatYar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
