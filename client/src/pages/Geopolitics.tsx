import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, TrendingUp, AlertCircle } from "lucide-react";

export default function Geopolitics() {
  const corridors = [
    {
      name: "BRI - Belt & Road Initiative",
      description: "တရုတ်ရဲ့ အဆင့်မြင့်တဲ့ အမြတ်အစွန်းရှာ ကုန်သွယ်မှုစီမံချက်။ Myanmar သည် အခြေခံအုတ်မြစ်ပဲ ဖြစ်ပါတယ်။ Yunnan မှ Yangon အထိ။ ဒါဟာ အနာဂတ်ပါပဲ။",
      icon: "🌏",
    },
    {
      name: "ASEAN Trade Corridor",
      description: "အဆိုပါ ကုန်သွယ်မှုစီမံချက်သည် ASEAN အတွင်း ကုန်သွယ်မှုကို အဆင့်မြင့်စေပါတယ်။ Myanmar သည် အဓိကအခန်းကဏ္ဍ ပါဝင်ပါတယ်။",
      icon: "🤝",
    },
    {
      name: "South Asian Trade Gateway",
      description: "အိန္ဒိယ၊ ဘင်္ဂလားဒေ့ရှ်နှင့် အခြား တောင်အာရှ နိုင်ငံများ ကုန်သွယ်မှုအတွက် Myanmar သည် တံခါးပါပဲ ဖြစ်ပါတယ်။",
      icon: "🌐",
    },
  ];

  const tradegates = [
    {
      gate: "Muse-Ruili (China Border)",
      volume: "High",
      goods: "ကုန်ပစ္စည်းများ၊ အစားအစာ၊ စက်ပွဲများ",
      strategy: "တရုတ်ဆီသို့ တင်ပို့ခြင်းအတွက် အကောင်းဆုံးမြေပြင်လမ်းပါပဲ။",
    },
    {
      gate: "Mae Sot-Myawady (Thailand Border)",
      volume: "Very High",
      goods: "ကုန်ပစ္စည်းများ၊ အသုံးအဆောင်များ၊ စက်ပွဲများ",
      strategy: "အများဆုံးကုန်သွယ်မှုလမ်းပါပဲ။ ထိုင်းဘက်သို့ တင်ပို့ခြင်းအတွက် အကောင်းဆုံးပါပဲ။",
    },
    {
      gate: "Yangon Port",
      volume: "Highest",
      goods: "အားလုံးကုန်ပစ္စည်းများ",
      strategy: "နိုင်ငံတကာကုန်သွယ်မှုအတွက် အဓိကတံခါးပါပဲ။ အများဆုံးကုန်သွယ်မှုအတွက် အကောင်းဆုံးပါပဲ။",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">Geopolitics</h1>
            <p className="text-xl text-muted-foreground">Strategic Trade Corridors - အမြတ်အစွန်းရှာ ကုန်သွယ်မှုလမ်းများ</p>
            <p className="text-lg text-foreground leading-relaxed">
              Myanmar sits at the intersection of three major trade corridors: the Belt & Road Initiative, ASEAN integration, and South Asian connectivity. Understanding geopolitics means understanding where the money flows.
            </p>
          </div>
        </div>
      </section>

      {/* Trade Corridors */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Major Trade Corridors</h2>
              <p className="text-lg text-muted-foreground">Where Myanmar fits in the global trade map</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {corridors.map((corridor, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
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

      {/* Trade Gates */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Strategic Trade Gates</h2>
              <p className="text-lg text-muted-foreground">Where goods enter and exit Myanmar</p>
            </div>

            <div className="space-y-4">
              {tradegates.map((gate, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{gate.gate}</CardTitle>
                        <CardDescription className="text-base mt-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                            Volume: {gate.volume}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Primary Goods</h4>
                      <p className="text-foreground">{gate.goods}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Strategy</h4>
                      <p className="text-foreground">{gate.strategy}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Geopolitical Risks */}
      <section className="section-padding">
        <div className="container">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                Geopolitical Risks & Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">US-China Trade Tensions</h4>
                <p className="text-muted-foreground">Myanmar's neutrality makes it an attractive alternative for companies diversifying away from China. Opportunity: position yourself as a regional hub.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">ASEAN Integration</h4>
                <p className="text-muted-foreground">ASEAN is moving toward deeper integration. Myanmar's participation in ASEAN trade agreements means preferential access to regional markets.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Belt & Road Expansion</h4>
                <p className="text-muted-foreground">China's BRI is accelerating infrastructure development. This means better logistics, faster clearance, and more trade volume. Position yourself early.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Regional Stability</h4>
                <p className="text-muted-foreground">Political stability in Myanmar is crucial for trade. Monitor developments—they directly impact trade corridors and tariff policies.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
