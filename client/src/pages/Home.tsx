import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Briefcase, Globe, TrendingUp, Zap, Map, LibraryBig } from "lucide-react";
import { useLocation } from "wouter";
import SemanticSearch from "@/components/SemanticSearch";
import CustomsValuationGuide from "@/components/CustomsValuationGuide";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const modules = [
    {
      id: "pillars",
      icon: BookOpen,
      label: isMyanmar ? "အဓိကမဏ္ဍိုင်များ" : "Core Pillars",
      description: isMyanmar ? "စာရွက်စာတမ်းနှင့် လုပ်ငန်းလည်ပတ်မှု" : "Documentation and operations",
      href: "/pillars",
    },
    {
      id: "compliance",
      icon: Briefcase,
      label: isMyanmar ? "စည်းမျဉ်းလိုက်နာမှုဗဟို" : "Compliance Hub",
      description: "DICA, Trade Net 2.0, MACCS",
      href: "/compliance",
    },
    {
      id: "market-pulse",
      icon: TrendingUp,
      label: isMyanmar ? "ဈေးကွက်စီးဆင်းမှု" : "Market Pulse",
      description: isMyanmar ? "၁၅/၈၅ စည်းမျဉ်းနှင့် အခွန်ကောက်ခံမှု" : "15/85 rules and taxation",
      href: "/market-pulse",
    },
    {
      id: "trade-mastery",
      icon: Zap,
      label: isMyanmar ? "ကုန်သွယ်မှုကျွမ်းကျင်မှု" : "Trade Mastery",
      description: isMyanmar ? "Incoterms နှင့် ကုန်စည်ပို့ဆောင်ရေး" : "Incoterms and logistics",
      href: "/trade-mastery",
    },
    {
      id: "geopolitics",
      icon: Globe,
      label: isMyanmar ? "ပထဝီနိုင်ငံရေး" : "Geopolitics",
      description: isMyanmar ? "BRI နှင့် ကုန်သွယ်မှုတံခါးပေါက်များ" : "BRI and trade gateways",
      href: "/geopolitics",
    },
    {
      id: "knowledge-dashboard",
      icon: LibraryBig,
      label: isMyanmar ? "Knowledge Dashboard" : "Knowledge Dashboard",
      description: isMyanmar ? "AI summary နဲ့ knowledge update" : "AI summaries and knowledge updates",
      href: "/knowledge-dashboard",
    },
    {
      id: "sample-projects",
      icon: Map,
      label: isMyanmar ? "နမူနာစီမံကိန်းများ" : "Sample Projects",
      description: isMyanmar ? "PET Pellets လေ့လာမှုမှတ်တမ်း" : "PET Pellets case study",
      href: "/sample-projects",
    },
  ];

  const copy = {
    heroSubtitle: isMyanmar
      ? "ကမ္ဘာလုံးဆိုင်ရာ ကုန်သွယ်မှုတံခါးပေါက် - အသိပညာမျှဝေရာ ဗဟိုချက်"
      : "Global trade gateway - your knowledge command center",
    heroLine: isMyanmar
      ? "အကျိုးအမြတ်ထက် အစဉ်အလာက ပိုအရေးကြီးသည်။ မုန်တိုင်းကြားတွင် အောင်နိုင်သူဖြစ်ပါစေ။"
      : "Legacy over currency. Win in the storm.",
    heroDesc: isMyanmar
      ? "အမှန်တရားကိုသာ ဖော်ပြသည်။ စစ်မှန်သော မဟာဗျူဟာများသာ ဖြစ်သည်။"
      : "No fluff. Only real strategy and execution.",
    exploreBtn: isMyanmar ? "ကဏ္ဍများကို လေ့လာရန်" : "Explore Modules",
    learnBtn: isMyanmar ? "ပိုမိုလေ့လာရန်" : "Learn More",
    modulesTitle: isMyanmar ? "ကုန်သွယ်မှုကျွမ်းကျင်မှု၏ အဓိကမဏ္ဍိုင် (၇) ရပ်" : "Seven Pillars of Trade Mastery",
    modulesDesc: isMyanmar
      ? "နိုင်ငံတကာကုန်သွယ်မှုနှင့် ကုန်စည်ပို့ဆောင်ရေး နယ်ပယ်တစ်ခုလုံးကို ကျွမ်းကျင်စွာ လျှောက်လှမ်းပါ"
      : "Master the full international trade and logistics landscape.",
    enter: isMyanmar ? "ဝင်ရောက်ရန်" : "Enter",
    moduleLearnSuffix: isMyanmar
      ? "အတွက် အသေးစိတ်လမ်းညွှန်ချက်များနှင့် မဟာဗျူဟာမြောက် အမြင်များကို လေ့လာရန် နှိပ်ပါ။"
      : "Click to learn detailed guidance and strategic insights.",
    whyTitle: isMyanmar ? "ဘာကြောင့် လက်ျာ (LatYar) ကို ရွေးချယ်သင့်သလဲ?" : "Why Choose LatYar?",
    whyDesc: isMyanmar
      ? "တိကျမှု၊ မဟာဗျူဟာနှင့် လက်တွေ့နယ်ပယ်မှ အမြင်များကို လိုလားသော ကုန်သည်များအတွက် ရည်ရွယ်ပါသည်"
      : "Built for traders who want precision, strategy, and real-world execution.",
    whyCards: isMyanmar
      ? [
          {
            title: "📚 နက်ရှိုင်းသော အသိပညာ",
            body: "စာရွက်စာတမ်းများ၊ စည်းမျဉ်းလိုက်နာမှုနှင့် ကုန်သွယ်မှုလုပ်ငန်းစဉ်များအကြောင်း အပြည့်အစုံ လမ်းညွှန်ချက်များ။ အနှစ်သာရမရှိသော စကားများမပါဘဲ လက်တွေ့ကျသော မဟာဗျူဟာများသာ ဖြစ်သည်။",
          },
          {
            title: "🛠️ အပြန်အလှန်အကျိုးပြု ကိရိယာများ",
            body: "Incoterms တွက်ချက်မှု၊ အခွန်ခန့်မှန်းမှု၊ HS code ရှာဖွေမှု။ ကျွမ်းကျင်ပညာရှင်များအတွက် တည်ဆောက်ထားသော ကိရိယာများ။",
          },
          {
            title: "🌍 မဟာဗျူဟာမြောက် အမြင်များ",
            body: "ပထဝီနိုင်ငံရေး ခွဲခြမ်းစိတ်ဖြာမှု၊ ဈေးကွက်စီးဆင်းမှု၊ လက်တွေ့ကမ္ဘာမှ လေ့လာမှုမှတ်တမ်းများ။ သင်လိုအပ်သော အားသာချက်များ။",
          },
        ]
      : [
          {
            title: "📚 Deep Knowledge",
            body: "Complete guidance on documentation, compliance, and trade operations. Practical strategy with no fluff.",
          },
          {
            title: "🛠️ Interactive Tools",
            body: "Incoterms calculators, tax estimators, and HS code support. Built for professionals in real workflows.",
          },
          {
            title: "🌍 Strategic Insight",
            body: "Geopolitical analysis, market movement tracking, and field case studies to sharpen your edge.",
          },
        ],
    aboutTitle: isMyanmar ? "Rhyzoe အကြောင်း" : "About Rhyzoe",
    aboutLine1: isMyanmar
      ? "Developer x Artist x Crypto Hustler ဖြစ်ပြီး မြန်မာ့ကုန်သွယ်ရေးကဏ္ဍအတွက် အစဉ်အလာရှိသော အမှတ်တံဆိပ်တစ်ခုကို တည်ဆောက်နေသူ ဖြစ်သည်။"
      : "A Developer x Artist x Crypto Hustler building a legacy brand for Myanmar trade.",
    aboutLine2: isMyanmar
      ? "ဤပလက်ဖောင်းကို ရိုးရှင်းသော ဒဿနတစ်ခုပေါ်တွင် တည်ဆောက်ထားပါသည် - အကျိုးအမြတ်ထက် အစဉ်အလာက ပိုအရေးကြီးသည်။ ကျွန်ုပ်တို့သည် အခြေအနေကို ဖုံးကွယ်မထားပါ။ ရိုးရှင်းအောင် မလုပ်ပါ။ မုန်တိုင်းကြားတွင် အောင်နိုင်ရန် စစ်မှန်သော မဟာဗျူဟာ၊ ကိန်းဂဏန်းများနှင့် လမ်းကြောင်းကိုသာ ဖော်ပြပါသည်။"
      : "This platform is built on one simple belief: legacy over currency. We do not hide complexity. We give you real strategies, numbers, and direction to win in difficult markets.",
    aboutLine3: isMyanmar
      ? "မြန်မာ့ကုန်သွယ်ရေးကဏ္ဍသည် ယေဘုယျဆန်သော အကြံဉာဏ်များထက် ပိုမိုကောင်းမွန်သော အရာနှင့် ထိုက်တန်ပါသည်။ ဈေးကွက်၊ ယဉ်ကျေးမှုနှင့် အခွင့်အလမ်းများကို နားလည်သူတစ်ဦးထံမှ အမြင်များကို လိုအပ်ပါသည်။ ၎င်းကို လက်ျာ (LatYar) က ပေးစွမ်းမည် ဖြစ်သည်။"
      : "Myanmar trade deserves more than generic advice. It needs grounded insights from someone who understands the market, culture, and opportunity. That is what LatYar delivers.",
    futureTitle: isMyanmar ? "အနာဂတ်လမ်းကြောင်းနှင့် နည်းပညာ" : "Future Trends and Technology",
    futureDesc: isMyanmar
      ? "၂၀၂၆-၂၀၂၇ အတွင်း မျှော်မှန်းထားသော နည်းပညာနှင့် မူဝါဒအပြောင်းအလဲများ။"
      : "Technology and policy shifts expected across 2026-2027.",
    trends: isMyanmar
      ? [
          {
            title: "🧪 ဓာတ်ခွဲခန်းထုတ် အသား (Lab Grown Meat)",
            body: "Cell-based meat များသည် ၂၀၂၇ ဝန်းကျင်တွင် Luxury product အဖြစ် ဈေးကွက်ဝင်လာမည်။",
          },
          {
            title: "⚡ EV အပိုပစ္စည်းများ",
            body: "လျှပ်စစ်ကား အပိုပစ္စည်းများအပေါ် မူဝါဒပြောင်းလဲမှုများသည် သွင်းကုန်အခွင့်အရေးအသစ်များ ဖန်တီးနေသည်။",
          },
          {
            title: "💻 ဒီဂျစ်တယ်ကုန်သွယ်မှု ပေါင်းစည်းမှု",
            body: "Trade Net 2.0 နှင့် automation များက ရှင်းလင်းရေးလုပ်ငန်းစဉ်ကို ပိုမိုမြန်ဆန်ပြီး တိကျစေမည်။",
          },
        ]
      : [
          {
            title: "🧪 Lab-Grown Meat",
            body: "Cell-based meat is expected to enter Myanmar as a premium market segment around 2027.",
          },
          {
            title: "⚡ EV Components",
            body: "Policy shifts around EV parts are opening new import windows and margin opportunities.",
          },
          {
            title: "💻 Digital Trade Integration",
            body: "Trade Net 2.0 and automation will accelerate and standardize clearance workflows.",
          },
        ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
              <p className="text-xl md:text-2xl text-muted-foreground">{copy.heroSubtitle}</p>
            </div>

            <div className="space-y-3 py-8">
              <p className="text-lg neon-glow-orange font-semibold">{copy.heroLine}</p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">{copy.heroDesc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => navigate("/pillars")}
              >
                {copy.exploreBtn}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                {copy.learnBtn}
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

      <CustomsValuationGuide />

      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">{copy.modulesTitle}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{copy.modulesDesc}</p>
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
                          <span className="text-xs font-bold uppercase tracking-wider">{copy.enter}</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mt-4 group-hover:text-primary transition-colors">
                        {module.label}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="pt-2 border-t border-border/50 group-hover:border-primary/30 transition-colors">
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {module.label} {copy.moduleLearnSuffix}
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

      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">{copy.whyTitle}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{copy.whyDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {copy.whyCards.map((item) => (
                <Card key={item.title} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-primary/50 neon-border">
              <CardHeader>
                <CardTitle className="text-3xl">{copy.aboutTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg">
                  <span className="neon-glow">Developer x Artist x Crypto Hustler</span> {copy.aboutLine1}
                </p>
                <p className="text-muted-foreground">{copy.aboutLine2}</p>
                <p className="text-muted-foreground">{copy.aboutLine3}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold">{copy.futureTitle}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{copy.futureDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {copy.trends.map((trend) => (
                <Card key={trend.title} className="border-border hover:neon-border transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl">{trend.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{trend.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
