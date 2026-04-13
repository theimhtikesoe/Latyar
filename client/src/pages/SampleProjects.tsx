import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function SampleProjects() {
  const caseStudy = {
    title: "PET Pellets Import - အမှန်တကယ်ကုန်သွယ်မှုဥပမာ",
    description: "အင်္ဂလိပ်စာ Polyethylene Terephthalate (PET) သည် ပလပ်စတစ်ဘူတ်များ၊ အထည်အဝတ်များ နှင့် အခြား ပလပ်စတစ်ပစ္စည်းများ ထုတ်လုပ်ရန် အသုံးပြုသည်။",
    flow: [
      {
        stage: "Supplier Identification",
        description: "အိန္ဒိယ သို့မဟုတ် ထိုင်းမှ PET pellet ထုတ်လုပ်သူများကို ရှာဖွေခြင်း။ အကောင်းဆုံးဈေးကွက်ကို ရွေးချယ်ခြင်း။",
        duration: "2-3 weeks",
      },
      {
        stage: "Quotation & Negotiation",
        description: "ဈေးကွက်ညှိနှိုင်းခြင်း။ အကောင်းဆုံးဈေးကွက်ကို ရွေးချယ်ခြင်း။ အခွန်ခွင့်ပြုချက်အတွက် စာချုပ်ချိုးမြုတ်ခြင်း။",
        duration: "1-2 weeks",
      },
      {
        stage: "License Application",
        description: "DICA မှ အကြံဥပဒေခွင့်ပြုချက် လျှောက်ထားခြင်း။ Trade Net 2.0 မှတစ်ဆင့် အွန်လိုင်း လျှောက်ထားခြင်း။",
        duration: "1 week",
      },
      {
        stage: "Payment & Shipping",
        description: "L/C သို့မဟုတ် TT မှတစ်ဆင့် ငွေပေးချေခြင်း။ ကုန်ပစ္စည်းများ ပို့ဆောင်ခြင်း။",
        duration: "2-4 weeks",
      },
      {
        stage: "Customs Clearance",
        description: "MACCS မှတစ်ဆင့် အကောက်ခွန်ရှင်းလင်းခြင်း။ အခွန်ပေးချေခြင်း။",
        duration: "3-5 days",
      },
      {
        stage: "Delivery & Distribution",
        description: "ကုန်ပစ္စည်းများ ယန္တရားထုတ်လုပ်သူများထံ ပို့ဆောင်ခြင်း။",
        duration: "1-2 weeks",
      },
    ],
  };

  const financials = [
    {
      metric: "Order Volume",
      value: "50 MT (Metric Tons)",
      description: "ပထမဆုံးအမှာစာ အရွယ်အစား",
    },
    {
      metric: "Unit Price",
      value: "$1,200 per MT",
      description: "အိန္ဒိယမှ FOB ဈေးကွက်",
    },
    {
      metric: "Total Cost",
      value: "$60,000",
      description: "ကုန်ပစ္စည်းအစုအဝေး ကုန်ကျမည်",
    },
    {
      metric: "Shipping Cost",
      value: "$3,000",
      description: "အိန္ဒိယမှ Yangon အထိ",
    },
    {
      metric: "Tariff (5%)",
      value: "$3,000",
      description: "အကောက်ခွန် ၅% ခွင့်ပြုချက်",
    },
    {
      metric: "Total Landed Cost",
      value: "$66,000",
      description: "Yangon ရှိ သင့်ရုံးအထိ စုစုပေါင်းကုန်ကျမည်",
    },
  ];

  const margins = [
    {
      scenario: "Wholesale to Local Manufacturers",
      sellingPrice: "$1,350 per MT",
      margin: "$150 per MT",
      totalMargin: "$7,500",
      description: "အတူတကွ ထုတ်လုပ်သူများထံ ရောင်းချခြင်း",
    },
    {
      scenario: "Retail to Small Businesses",
      sellingPrice: "$1,450 per MT",
      margin: "$250 per MT",
      totalMargin: "$12,500",
      description: "အသေးစိတ်ရောင်းချခြင်း - ပိုမိုမြင့်မားသောအမြတ်",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">Sample Projects</h1>
            <p className="text-xl text-muted-foreground">Real-World Case Studies - အမှန်တကယ်ကုန်သွယ်မှုဥပမာများ</p>
            <p className="text-lg text-foreground leading-relaxed">
              Theory is useful. Practice is everything. Here's a real example: importing PET pellets from India, navigating Myanmar's compliance system, and building a profitable business.
            </p>
          </div>
        </div>
      </section>

      {/* Case Study Overview */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <Card className="border-primary/50 neon-border">
              <CardHeader>
                <CardTitle className="text-3xl">{caseStudy.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">{caseStudy.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Complete Process Flow</h2>
              <p className="text-lg text-muted-foreground">From supplier to customer - အစ မှ အဆုံးအထိ</p>
            </div>

            <div className="space-y-6">
              {caseStudy.flow.map((stage, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {idx + 1}
                    </div>
                    {idx < caseStudy.flow.length - 1 && (
                      <div className="w-1 h-24 bg-primary/30 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <Card className="border-border hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{stage.stage}</CardTitle>
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {stage.duration}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{stage.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Financial Breakdown */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Financial Breakdown</h2>
              <p className="text-lg text-muted-foreground">Cost structure for a 50 MT order</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {financials.map((item, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground">{item.metric}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profit Margins */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Profit Scenarios</h2>
              <p className="text-lg text-muted-foreground">Different selling strategies and margins</p>
            </div>

            <div className="space-y-6">
              {margins.map((scenario, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{scenario.scenario}</CardTitle>
                    </div>
                    <CardDescription className="text-base mt-2">{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Selling Price</p>
                        <p className="text-2xl font-bold text-primary">{scenario.sellingPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Margin per MT</p>
                        <p className="text-2xl font-bold text-secondary">{scenario.margin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Profit</p>
                        <p className="text-2xl font-bold text-accent">{scenario.totalMargin}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Lessons */}
      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                Key Lessons from This Case Study
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">1. Compliance is Non-Negotiable</h4>
                <p className="text-muted-foreground">Getting the license right saves time and money. A single mistake can delay clearance by weeks.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">2. Timing is Everything</h4>
                <p className="text-muted-foreground">The entire process takes 8-12 weeks. Plan accordingly. Delays in any stage cascade through the entire timeline.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">3. Margins are Thin but Real</h4>
                <p className="text-muted-foreground">$7,500-$12,500 profit on a $66,000 investment. That's 11-19% ROI. Scale this to 5-10 shipments per year, and you're building a real business.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">4. Relationships Matter</h4>
                <p className="text-muted-foreground">Your supplier, freight forwarder, customs broker, and buyers—build strong relationships with all of them. They'll help you navigate obstacles and find opportunities.</p>
              </div>
            </CardContent>
          </Card>

          <PageNavigation />
        </div>
      </section>
    </div>
  );
}
