import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function MarketPulse() {
  const rules = [
    {
      name: "15/85 Rule",
      description: "အရောင်းအဝယ်ရှင်ဆီမှ ၁၅% သုံးစွဲရမယ်။ အကျန် ၈၅% အားလုံး ကုန်ပစ္စည်းအတွက် သုံးစွဲရမယ်။ ဒါမှ အခွန်ခွင့်ပြုချက်ရနိုင်ပါတယ်။",
      icon: "📊",
    },
    {
      name: "Local Content Requirement",
      description: "အချို့ကုန်ပစ္စည်းတွေ သည်ပြည်ဒေသတွင်းမှ ပစ္စည်းများ ပါဝင်ရမယ်။ ဒါမှ အခွန်ခွင့်ပြုချက်ရနိုင်ပါတယ်။",
      icon: "🏭",
    },
    {
      name: "Price Monitoring",
      description: "အချို့ကုန်ပစ္စည်းတွေ ဈေးကွက်ထိန်းချုပ်ခံရတယ်။ သင်ကြေးမုံရဲ့ အကွာအဝေးထဲမှာ ရှိရမယ်။ ဒါမှ ကောင်းမွန်တဲ့ အဆင့်ပြည့်ဝတဲ့ ကုန်သွယ်မှုပဲ ဖြစ်ပါတယ်။",
      icon: "💰",
    },
  ];

  const taxation = [
    {
      type: "အကောက်ခွန် (Tariff)",
      rate: "0% - 40%",
      description: "ကုန်ပစ္စည်းအမျိုးအစားပေါ်မှာ မူတည်တယ်။ အချို့ကုန်ပစ္စည်းတွေ အခွန်ခွင့်ပြုချက်ရှိတယ်။",
    },
    {
      type: "အခြားခွန်ခြင်း (Other Taxes)",
      rate: "Variable",
      description: "အရောင်းအဝယ်ခွန်၊ အသုံးခွန်နှင့် အခြား ခွန်ခြင်းများ ရှိနိုင်ပါတယ်။",
    },
    {
      type: "အထူးခွန် (Special Duty)",
      rate: "0% - 100%",
      description: "အချို့ကုန်ပစ္စည်းတွေ အထူးခွန်ခံရတယ်။ ဒါဟာ ကုန်သွယ်မှုကို ကာကွယ်ရန် အတွက်ပါပဲ။",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">Market Pulse</h1>
            <p className="text-xl text-muted-foreground">Real-World Trade Dynamics - ကုန်သွယ်မှုဈေးကွက်၏ အမှန်တကယ်အနေအထားများ</p>
            <p className="text-lg text-foreground leading-relaxed">
              Myanmar's trade market isn't random. It operates on rules: the 15/85 rule, local content requirements, and price monitoring. Understand these, and you'll predict market movements before they happen.
            </p>
          </div>
        </div>
      </section>

      {/* Market Rules */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Market Rules</h2>
              <p className="text-lg text-muted-foreground">The invisible hand that guides Myanmar's trade</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rules.map((rule, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{rule.name}</CardTitle>
                      <span className="text-3xl">{rule.icon}</span>
                    </div>
                  </CardHeader>
                  <CardHeader>
                    <CardTitle className="text-xl">{rule.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{rule.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Taxation Structure */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Taxation Structure</h2>
              <p className="text-lg text-muted-foreground">How Myanmar calculates import duties</p>
            </div>

            <div className="space-y-4">
              {taxation.map((tax, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{tax.type}</CardTitle>
                        <CardDescription className="text-lg mt-1">{tax.rate}</CardDescription>
                      </div>
                      <DollarSign className="w-8 h-8 text-primary opacity-50" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{tax.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Future Trends */}
      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                2026-2027 Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">Lab-Grown Meat (LGM)</h4>
                <p className="text-muted-foreground">Cell-based meat is entering Myanmar's market as a luxury product. Expect tariff classifications to evolve. Early movers will capture market share.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">EV Components (0% Tariff until March 2026)</h4>
                <p className="text-muted-foreground">Electric vehicle components enjoy zero tariff until March 2026. After that, expect tariffs to increase. The window is closing—act now if you're in this space.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Digital Trade Integration</h4>
                <p className="text-muted-foreground">Trade Net 2.0 is moving faster. Automated clearance is coming. Traders who digitize now will have a competitive advantage.</p>
              </div>
            </CardContent>
          </Card>

          <PageNavigation 
            nextHref="/trade-mastery" 
            nextLabel="Trade Mastery" 
          />
        </div>
      </section>
    </div>
  );
}
