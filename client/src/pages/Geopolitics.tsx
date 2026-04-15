import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Geopolitics() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const corridors = isMyanmar
    ? [
        {
          name: "BRI - Belt & Road Initiative",
          description:
            "တရုတ်နိုင်ငံ၏ အဆင့်မြင့်မားသော ကမ္ဘာလုံးဆိုင်ရာ ကုန်သွယ်မှုစီမံကိန်းဖြစ်သည်။ မြန်မာနိုင်ငံသည် ၎င်း၏ အဓိကအခြေခံအုတ်မြစ်တစ်ခုဖြစ်ပြီး ယူနန်မှ ရန်ကုန်အထိ ဆက်သွယ်ထားသည်။ ၎င်းသည် အနာဂတ်၏ အခွင့်အလမ်းတစ်ခုဖြစ်သည်။",
          icon: "🌏",
        },
        {
          name: "ASEAN ကုန်သွယ်မှုလမ်းကြောင်း",
          description:
            "အာဆီယံဒေသတွင်း ကုန်သွယ်မှုကို ပိုမိုကောင်းမွန်စေမည့် စီမံချက်ဖြစ်သည်။ မြန်မာနိုင်ငံသည် အာဆီယံ၏ အချက်အချာကျသော နေရာတွင် တည်ရှိနေသည်။",
          icon: "🤝",
        },
        {
          name: "တောင်အာရှ ကုန်သွယ်မှုတံခါးပေါက်",
          description:
            "အိန္ဒိယ၊ ဘင်္ဂလားဒေ့ရှ်နှင့် အခြားတောင်အာရှနိုင်ငံများနှင့် ကုန်သွယ်မှုပြုရန် မြန်မာနိုင်ငံသည် အဓိကတံခါးပေါက်တစ်ခု ဖြစ်သည်။",
          icon: "🌐",
        },
      ]
    : [
        {
          name: "BRI - Belt & Road Initiative",
          description:
            "China's strategic global trade infrastructure program. Myanmar is a key route node connecting Yunnan to Yangon and beyond.",
          icon: "🌏",
        },
        {
          name: "ASEAN Trade Corridor",
          description:
            "Regional integration is strengthening ASEAN trade flow, and Myanmar sits in a high-leverage geographic position.",
          icon: "🤝",
        },
        {
          name: "South Asia Trade Gateway",
          description:
            "Myanmar acts as a bridge for trade with India, Bangladesh, and wider South Asian markets.",
          icon: "🌐",
        },
      ];

  const tradegates = isMyanmar
    ? [
        {
          gate: "မူဆယ်-ရွှေလီ (တရုတ်နယ်စပ်)",
          volume: "မြင့်မားသည်",
          goods: "လူသုံးကုန်ပစ္စည်းများ၊ အစားအစာ၊ စက်ပစ္စည်းများ",
          strategy: "တရုတ်နိုင်ငံသို့ ကုန်ပစ္စည်းတင်ပို့ရန်အတွက် အကောင်းဆုံး ကုန်းလမ်းကြောင်းဖြစ်သည်။",
        },
        {
          gate: "မြဝတီ-မဲဆောက် (ထိုင်းနယ်စပ်)",
          volume: "အလွန်မြင့်မားသည်",
          goods: "လူသုံးကုန်ပစ္စည်းများ၊ အသုံးအဆောင်များ၊ စက်ပစ္စည်းများ",
          strategy: "မြန်မာနိုင်ငံ၏ အကြီးမားဆုံးသော နယ်စပ်ကုန်သွယ်မှုလမ်းကြောင်း ဖြစ်သည်။",
        },
        {
          gate: "ရန်ကုန်ဆိပ်ကမ်း",
          volume: "အမြင့်မားဆုံး",
          goods: "ကုန်ပစ္စည်းအမျိုးမျိုး",
          strategy: "နိုင်ငံတကာ ပင်လယ်ရေကြောင်းကုန်သွယ်မှုအတွက် အဓိကတံခါးပေါက် ဖြစ်သည်။",
        },
      ]
    : [
        {
          gate: "Muse-Ruili (China Border)",
          volume: "High",
          goods: "Consumer products, food, machinery",
          strategy: "A key land route for bilateral movement with China.",
        },
        {
          gate: "Myawaddy-Mae Sot (Thailand Border)",
          volume: "Very High",
          goods: "Consumer products, appliances, machinery",
          strategy: "Myanmar's highest-volume border trade channel.",
        },
        {
          gate: "Yangon Port",
          volume: "Highest",
          goods: "Mixed cargo categories",
          strategy: "Primary gateway for international sea trade.",
        },
      ];

  const copy = {
    headerTitle: isMyanmar ? "ပထဝီနိုင်ငံရေး" : "Geopolitics",
    headerSubtitle: isMyanmar ? "မဟာဗျူဟာမြောက် ကုန်သွယ်မှုလမ်းကြောင်းများ" : "Strategic trade corridors",
    headerDesc: isMyanmar
      ? "မြန်မာနိုင်ငံသည် BRI၊ အာဆီယံ ပေါင်းစည်းမှုနှင့် တောင်အာရှ ဆက်သွယ်မှုဟူသော အဓိကကုန်သွယ်မှုလမ်းကြောင်း သုံးခု၏ ဆုံချက်တွင် တည်ရှိသည်။ ပထဝီနိုင်ငံရေးကို နားလည်ခြင်းသည် ငွေကြေးစီးဆင်းမှု မည်သည့်နေရာတွင် ရှိသည်ကို သိရှိခြင်းပင် ဖြစ်သည်။"
      : "Myanmar sits at the intersection of BRI, ASEAN integration, and South Asia connectivity. Geopolitical literacy means knowing where capital and cargo will flow next.",
    corridorTitle: isMyanmar ? "အဓိက ကုန်သွယ်မှုလမ်းကြောင်းများ" : "Major Trade Corridors",
    corridorDesc: isMyanmar ? "ကမ္ဘာ့ကုန်သွယ်မှုမြေပုံတွင် မြန်မာနိုင်ငံ၏ အခန်းကဏ္ဍ" : "Myanmar's position on the global trade map",
    gatesTitle: isMyanmar ? "မဟာဗျူဟာမြောက် ကုန်သွယ်မှုတံခါးပေါက်များ" : "Strategic Trade Gateways",
    gatesDesc: isMyanmar ? "မြန်မာနိုင်ငံ၏ အဓိက အဝင်အထွက်နေရာများ" : "Primary import/export gateways",
    volumeLabel: isMyanmar ? "ပမာဏ" : "Volume",
    goodsLabel: isMyanmar ? "အဓိကကုန်စည်များ" : "Primary Goods",
    strategyLabel: isMyanmar ? "မဟာဗျူဟာ" : "Strategy",
    riskTitle: isMyanmar ? "ပထဝီနိုင်ငံရေးဆိုင်ရာ စိန်ခေါ်မှုများနှင့် အခွင့်အလမ်းများ" : "Geopolitical Risks and Opportunities",
    risks: isMyanmar
      ? [
          {
            title: "အမေရိကန်-တရုတ် ကုန်သွယ်ရေး တင်းမာမှု",
            body: "မြန်မာနိုင်ငံ၏ ကြားနေမှုသည် တရုတ်နိုင်ငံမှတစ်ဆင့် ကုန်သွယ်မှုခွဲဖြတ်လိုသော ကုမ္ပဏီများအတွက် ဆွဲဆောင်မှုရှိစေသည်။ အခွင့်အလမ်းမှာ ဒေသတွင်း အချက်အချာနေရာတစ်ခုအဖြစ် ရပ်တည်ရန်ဖြစ်သည်။",
          },
          {
            title: "အာဆီယံ ပေါင်းစည်းမှု",
            body: "အာဆီယံသည် ပိုမိုနက်ရှိုင်းသော ပေါင်းစည်းမှုဆီသို့ ဦးတည်နေသည်။ မြန်မာနိုင်ငံ၏ အာဆီယံကုန်သွယ်ရေး သဘောတူညီချက်များတွင် ပါဝင်မှုသည် ဒေသတွင်းဈေးကွက်များသို့ အထူးအခွင့်အရေးများဖြင့် ဝင်ရောက်နိုင်ခြင်းကို ဆိုလိုသည်။",
          },
          {
            title: "BRI စီမံကိန်း တိုးချဲ့မှု",
            body: "တရုတ်နိုင်ငံ၏ BRI သည် အခြေခံအဆောက်အအုံ ဖွံ့ဖြိုးတိုးတက်မှုကို အရှိန်မြှင့်နေသည်။ ၎င်းသည် ပိုမိုကောင်းမွန်သော ပို့ဆောင်ရေး၊ ပိုမိုမြန်ဆန်သော ရှင်းလင်းရေးနှင့် ပိုမိုများပြားသော ကုန်သွယ်မှုပမာဏကို ဆိုလိုသည်။ စောစီးစွာ နေရာယူထားပါ။",
          },
          {
            title: "ဒေသတွင်း တည်ငြိမ်မှု",
            body: "မြန်မာနိုင်ငံ၏ နိုင်ငံရေးတည်ငြိမ်မှုသည် ကုန်သွယ်မှုအတွက် အလွန်အရေးကြီးသည်။ ဖြစ်ပေါ်တိုးတက်မှုများကို စောင့်ကြည့်ပါ—၎င်းတို့သည် ကုန်သွယ်မှုလမ်းကြောင်းများနှင့် အခွန်မူဝါဒများအပေါ် တိုက်ရိုက်သက်ရောက်မှု ရှိသည်။",
          },
        ]
      : [
          {
            title: "US-China Trade Tension",
            body: "Myanmar's neutral positioning can attract supply-chain routing and regional consolidation plays.",
          },
          {
            title: "ASEAN Integration",
            body: "Deeper ASEAN alignment can expand preferential access and lower friction for regional operators.",
          },
          {
            title: "BRI Expansion",
            body: "Infrastructure expansion improves logistics speed and throughput for cross-border and maritime lanes.",
          },
          {
            title: "Regional Stability",
            body: "Political and security shifts directly affect corridor reliability, tax policy direction, and route planning.",
          },
        ],
    nextLabel: isMyanmar ? "နမူနာစီမံကိန်းများ" : "Sample Projects",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">{copy.headerTitle}</h1>
            <p className="text-xl text-muted-foreground">{copy.headerSubtitle}</p>
            <p className="text-lg text-foreground leading-relaxed">{copy.headerDesc}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{copy.corridorTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.corridorDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {corridors.map((corridor) => (
                <Card key={corridor.name} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{corridor.name}</CardTitle>
                      <span className="text-3xl">{corridor.icon}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{corridor.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{copy.gatesTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.gatesDesc}</p>
            </div>

            <div className="space-y-4">
              {tradegates.map((gate) => (
                <Card key={gate.gate} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{gate.gate}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                            {copy.volumeLabel}: {gate.volume}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">{copy.goodsLabel}</h4>
                      <p className="text-foreground">{gate.goods}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">{copy.strategyLabel}</h4>
                      <p className="text-foreground">{gate.strategy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                {copy.riskTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {copy.risks.map((risk) => (
                <div key={risk.title}>
                  <h4 className="font-semibold text-lg mb-2">{risk.title}</h4>
                  <p className="text-muted-foreground">{risk.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation nextHref="/sample-projects" nextLabel={copy.nextLabel} />
        </div>
      </section>
    </div>
  );
}
