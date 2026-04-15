import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Briefcase, Globe, TrendingUp, Zap, Map } from "lucide-react";
import { useLocation } from "wouter";
import SemanticSearch from "@/components/SemanticSearch";

export default function Home() {
  const [, navigate] = useLocation();

  const modules = [
    {
      id: "pillars",
      icon: BookOpen,
      label: "အဓိကမဏ္ဍိုင်များ",
      description: "စာရွက်စာတမ်းနှင့် လုပ်ငန်းလည်ပတ်မှု",
      href: "/pillars",
    },
    {
      id: "compliance",
      icon: Briefcase,
      label: "စည်းမျဉ်းလိုက်နာမှုဗဟို",
      description: "DICA၊ Trade Net 2.0၊ MACCS",
      href: "/compliance",
    },
    {
      id: "market-pulse",
      icon: TrendingUp,
      label: "ဈေးကွက်စီးဆင်းမှု",
      description: "၁၅/၈၅ စည်းမျဉ်းနှင့် အခွန်ကောက်ခံမှု",
      href: "/market-pulse",
    },
    {
      id: "trade-mastery",
      icon: Zap,
      label: "ကုန်သွယ်မှုကျွမ်းကျင်မှု",
      description: "Incoterms နှင့် ကုန်စည်ပို့ဆောင်ရေး",
      href: "/trade-mastery",
    },
    {
      id: "geopolitics",
      icon: Globe,
      label: "ပထဝီနိုင်ငံရေး",
      description: "BRI နှင့် ကုန်သွယ်မှုတံခါးပေါက်များ",
      href: "/geopolitics",
    },
    {
      id: "sample-projects",
      icon: Map,
      label: "နမူနာစီမံကိန်းများ",
      description: "PET Pellets လေ့လာမှုမှတ်တမ်း",
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
                <span className="neon-glow">လက်ျာ</span>
                <br />
                <span className="text-foreground">LatYar</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                ကမ္ဘာလုံးဆိုင်ရာ ကုန်သွယ်မှုတံခါးပေါက် - အသိပညာမျှဝေရာ ဗဟိုချက်
              </p>
            </div>

            <div className="space-y-3 py-8">
              <p className="text-lg neon-glow-orange font-semibold">
                အကျိုးအမြတ်ထက် အစဉ်အလာက ပိုအရေးကြီးသည်။ မုန်တိုင်းကြားတွင် အောင်နိုင်သူဖြစ်ပါစေ။
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                အမှန်တရားကိုသာ ဖော်ပြသည်။ စစ်မှန်သော မဟာဗျူဟာများသာ ဖြစ်သည်။
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/pillars")}
              >
                ကဏ္ဍများကို လေ့လာရန်
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                ပိုမိုလေ့လာရန်
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container max-w-4xl">
          <SemanticSearch />
        </div>
      </section>

      {/* Modules Grid */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">ကုန်သွယ်မှုကျွမ်းကျင်မှု၏ အဓိကမဏ္ဍိုင် (၆) ရပ်</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                နိုင်ငံတကာကုန်သွယ်မှုနှင့် ကုန်စည်ပို့ဆောင်ရေး နယ်ပယ်တစ်ခုလုံးကို ကျွမ်းကျင်စွာ လျှောက်လှမ်းပါ
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
                          <span className="text-xs font-bold uppercase tracking-wider">ဝင်ရောက်ရန်</span>
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
                          {module.label} အတွက် အသေးစိတ်လမ်းညွှန်ချက်များနှင့် မဟာဗျူဟာမြောက် အမြင်များကို လေ့လာရန် နှိပ်ပါ။
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
              <h2 className="text-4xl md:text-5xl font-bold">ဘာကြောင့် လက်ျာ (LatYar) ကို ရွေးချယ်သင့်သလဲ?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                တိကျမှု၊ မဟာဗျူဟာနှင့် လက်တွေ့နယ်ပယ်မှ အမြင်များကို လိုလားသော ကုန်သည်များအတွက် ရည်ရွယ်ပါသည်
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">📚 နက်ရှိုင်းသော အသိပညာ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    စာရွက်စာတမ်းများ၊ စည်းမျဉ်းလိုက်နာမှုနှင့် ကုန်သွယ်မှုလုပ်ငန်းစဉ်များအကြောင်း အပြည့်အစုံ လမ်းညွှန်ချက်များ။ အနှစ်သာရမရှိသော စကားများမပါဘဲ လက်တွေ့ကျသော မဟာဗျူဟာများသာ ဖြစ်သည်။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">🛠️ အပြန်အလှန်အကျိုးပြု ကိရိယာများ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Incoterms တွက်ချက်မှု၊ အခွန်ခန့်မှန်းမှု၊ HS code ရှာဖွေမှု။ ကျွမ်းကျင်ပညာရှင်များအတွက် တည်ဆောက်ထားသော ကိရိယာများ။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">🌍 မဟာဗျူဟာမြောက် အမြင်များ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ပထဝီနိုင်ငံရေး ခွဲခြမ်းစိတ်ဖြာမှု၊ ဈေးကွက်စီးဆင်းမှု၊ လက်တွေ့ကမ္ဘာမှ လေ့လာမှုမှတ်တမ်းများ။ သင်လိုအပ်သော အားသာချက်များ။
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
                <CardTitle className="text-3xl">Rhyzoe အကြောင်း</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  <span className="neon-glow">Developer x Artist x Crypto Hustler</span> ဖြစ်ပြီး မြန်မာ့ကုန်သွယ်ရေးကဏ္ဍအတွက် အစဉ်အလာရှိသော အမှတ်တံဆိပ်တစ်ခုကို တည်ဆောက်နေသူ ဖြစ်သည်။
                </p>
                <p className="text-muted-foreground">
                  ဤပလက်ဖောင်းကို ရိုးရှင်းသော ဒဿနတစ်ခုပေါ်တွင် တည်ဆောက်ထားပါသည် - <span className="neon-glow-orange">အကျိုးအမြတ်ထက် အစဉ်အလာက ပိုအရေးကြီးသည်</span>။ ကျွန်ုပ်တို့သည် အခြေအနေကို ဖုံးကွယ်မထားပါ။ ရိုးရှင်းအောင် မလုပ်ပါ။ မုန်တိုင်းကြားတွင် အောင်နိုင်ရန် စစ်မှန်သော မဟာဗျူဟာ၊ ကိန်းဂဏန်းများနှင့် လမ်းကြောင်းကိုသာ ဖော်ပြပါသည်။
                </p>
                <p className="text-muted-foreground">
                  မြန်မာ့ကုန်သွယ်ရေးကဏ္ဍသည် ယေဘုယျဆန်သော အကြံဉာဏ်များထက် ပိုမိုကောင်းမွန်သော အရာနှင့် ထိုက်တန်ပါသည်။ ဈေးကွက်၊ ယဉ်ကျေးမှုနှင့် အခွင့်အလမ်းများကို နားလည်သူတစ်ဦးထံမှ အမြင်များကို လိုအပ်ပါသည်။ ၎င်းကို လက်ျာ (LatYar) က ပေးစွမ်းမည် ဖြစ်သည်။
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
              <h2 className="text-4xl md:text-5xl font-bold">အနာဂတ်လမ်းကြောင်းနှင့် နည်းပညာ</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                ၂၀၂၆-၂၀၂၇ အတွင်း မျှော်မှန်းထားသော နည်းပညာနှင့် မူဝါဒအပြောင်းအလဲများ။
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">🧪</span>
                    ဓာတ်ခွဲခန်းထုတ် အသား (Lab Grown Meat)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cell-based meat များသည် ၂၀၂၇ ဝန်းကျင်တွင် Luxury product အဖြစ် ဈေးကွက်ဝင်လာမည်။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">⚡</span>
                    EV အထူးကုဒ် (EV Special Code)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    ၂၀၂၆ မတ်လကုန်အထိ EV အပိုပစ္စည်းများ အကောက်ခွန် ၀% ခံစားခွင့်ရှိသည်။
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border hover:neon-border transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">📊</span>
                    အလိုအလျောက်စနစ်နှင့် ခြေရာခံခြင်း
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
          <h2 className="text-4xl md:text-5xl font-bold">ကုန်သွယ်မှုနယ်ပယ်ကို ကျွမ်းကျင်ရန် အဆင်သင့်ဖြစ်ပြီလား?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            ဂိမ်းကို နားလည်သော ထိပ်တန်းကုန်သည်များ၏ အသိုင်းအဝိုင်းသို့ ဝင်ရောက်လိုက်ပါ။
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-background text-foreground hover:bg-background/90"
            onClick={() => navigate("/pillars")}
          >
            အခုပဲ စတင်လိုက်ပါ
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container text-center text-muted-foreground">
          <p>© ၂၀၂၆ လက်ျာ (LatYar)။ မူပိုင်ခွင့်အားလုံး ရရှိပြီးဖြစ်သည်။</p>
        </div>
      </footer>
    </div>
  );
}
