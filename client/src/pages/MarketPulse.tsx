import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MarketPulse() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const rules = isMyanmar
    ? [
        {
          name: "၁၅/၈၅ စည်းမျဉ်း",
          description:
            "ပို့ကုန်ရငွေ၏ ၁၅% ကို သတ်မှတ်နှုန်းထားဖြင့် လဲလှယ်ရပြီး ကျန် ၈၅% ကို မိမိစိတ်ကြိုက် အသုံးပြုနိုင်သည်။ ဤစည်းမျဉ်းသည် နိုင်ငံခြားငွေ စီးဆင်းမှုအတွက် အလွန်အရေးကြီးသည်။",
          icon: "📊",
        },
        {
          name: "ဒေသတွင်း ပါဝင်မှု လိုအပ်ချက်",
          description:
            "အချို့ကုန်ပစ္စည်းများသည် ပြည်တွင်းမှ ထုတ်လုပ်သော ပစ္စည်းများ သတ်မှတ်ရာခိုင်နှုန်း ပါဝင်ရမည်။ ၎င်းသည် ပြည်တွင်းထုတ်လုပ်မှုကို အားပေးရန် ဖြစ်သည်။",
          icon: "🏭",
        },
        {
          name: "ဈေးနှုန်းစောင့်ကြည့်ခြင်း",
          description:
            "အရေးကြီးကုန်စည်များ၏ ဈေးနှုန်းကို အစိုးရမှ စောင့်ကြည့်ထိန်းချုပ်လေ့ရှိသည်။ သတ်မှတ်ထားသော ဈေးနှုန်းဘောင်အတွင်း ရောင်းဝယ်ရန် လိုအပ်သည်။",
          icon: "💰",
        },
      ]
    : [
        {
          name: "15/85 Rule",
          description:
            "15% of export earnings must be exchanged at regulated rates while 85% can be managed strategically. This directly affects FX liquidity.",
          icon: "📊",
        },
        {
          name: "Local Content Requirement",
          description:
            "Some goods must include a minimum percentage of locally sourced inputs to support domestic production.",
          icon: "🏭",
        },
        {
          name: "Price Monitoring",
          description:
            "Critical goods are often price-monitored by regulators, requiring transactions within approved ranges.",
          icon: "💰",
        },
      ];

  const taxation = isMyanmar
    ? [
        {
          type: "အကောက်ခွန် (Tariff)",
          rate: "၀% - ၄၀%",
          description: "ကုန်ပစ္စည်းအမျိုးအစားပေါ်တွင် မူတည်သည်။ အချို့ကုန်ပစ္စည်းများသည် အခွန်ကင်းလွတ်ခွင့် သို့မဟုတ် သက်သာခွင့်များ ရရှိနိုင်သည်။",
        },
        {
          type: "ကုန်သွယ်လုပ်ငန်းခွန်",
          rate: "ပြောင်းလဲနိုင်သည်",
          description: "အရောင်းအဝယ်အပေါ်တွင် ကောက်ခံသော အခွန်ဖြစ်သည်။ ကုန်စည်အမျိုးအစားအလိုက် နှုန်းထားများ ကွဲပြားနိုင်သည်။",
        },
        {
          type: "အထူးကုန်စည်ခွန်",
          rate: "၀% - ၁၀၀%",
          description: "ဇိမ်ခံပစ္စည်းများ သို့မဟုတ် ထိန်းချုပ်ကုန်စည်များအပေါ်တွင် မြင့်မားသော အခွန်နှုန်းထားများဖြင့် ကောက်ခံခြင်းဖြစ်သည်။",
        },
      ]
    : [
        {
          type: "Tariff",
          rate: "0% - 40%",
          description: "Depends on product category. Some goods qualify for exemption or reduced rates.",
        },
        {
          type: "Commercial Tax",
          rate: "Variable",
          description: "Applied to trade activity, with rates varying by commodity type.",
        },
        {
          type: "Special Goods Tax",
          rate: "0% - 100%",
          description: "Higher rates may apply to luxury or controlled goods categories.",
        },
      ];

  const copy = {
    headerTitle: isMyanmar ? "ဈေးကွက်စီးဆင်းမှု" : "Market Pulse",
    headerSubtitle: isMyanmar ? "လက်တွေ့ကမ္ဘာမှ ကုန်သွယ်မှု အပြောင်းအလဲများ" : "Real-world trade movement",
    headerDesc: isMyanmar
      ? "မြန်မာ့ကုန်သွယ်မှုဈေးကွက်သည် စနစ်တကျ လည်ပတ်နေခြင်း ဖြစ်သည်။ ၁၅/၈၅ စည်းမျဉ်း၊ ဒေသတွင်းပါဝင်မှု လိုအပ်ချက်နှင့် ဈေးနှုန်းစောင့်ကြည့်မှုများကဲ့သို့သော စည်းမျဉ်းများကို နားလည်ထားခြင်းဖြင့် ဈေးကွက်အပြောင်းအလဲများကို ကြိုတင်ခန့်မှန်းနိုင်ပါလိမ့်မည်။"
      : "Myanmar trade markets run on policy mechanics. Understanding FX rules, local-content conditions, and pricing controls helps you forecast shifts before they hit.",
    rulesTitle: isMyanmar ? "ဈေးကွက်စည်းမျဉ်းများ" : "Market Rules",
    rulesDesc: isMyanmar ? "မြန်မာ့ကုန်သွယ်ရေးကို လမ်းညွှန်နေသော မမြင်ရသည့် လက်များ" : "The invisible hands guiding market movement",
    taxTitle: isMyanmar ? "အခွန်ကောက်ခံမှု ပုံစံ" : "Taxation Structure",
    taxDesc: isMyanmar ? "မြန်မာနိုင်ငံ၏ သွင်းကုန်အကောက်ခွန် တွက်ချက်ပုံ" : "How import duties and taxes are structured in Myanmar",
    trendsTitle: isMyanmar ? "၂၀၂၆-၂၀၂၇ ဈေးကွက်လမ်းကြောင်းများ" : "2026-2027 Market Trends",
    trends: isMyanmar
      ? [
          {
            title: "ဓာတ်ခွဲခန်းထုတ် အသား (Lab-Grown Meat)",
            body: "Cell-based meat များသည် မြန်မာ့ဈေးကွက်သို့ ဇိမ်ခံပစ္စည်းအဖြစ် ဝင်ရောက်လာနေသည်။ အကောက်ခွန် အမျိုးအစားခွဲခြားမှုများ ပြောင်းလဲလာမည်ဟု မျှော်လင့်ရသည်။ စောစီးစွာ စတင်သူများက ဈေးကွက်ဝေစုကို ရရှိပါလိမ့်မည်။",
          },
          {
            title: "EV အပိုပစ္စည်းများ (၂၀၂၆ မတ်လအထိ အကောက်ခွန် ၀%)",
            body: "လျှပ်စစ်ကား အပိုပစ္စည်းများသည် ၂၀၂၆ မတ်လအထိ အကောက်ခွန် ကင်းလွတ်ခွင့် ရရှိထားသည်။ ထို့နောက်ပိုင်းတွင် အခွန်နှုန်းထားများ တိုးလာနိုင်သဖြင့် ယခုအချိန်သည် အကောင်းဆုံး အခွင့်အရေး ဖြစ်သည်။",
          },
          {
            title: "ဒီဂျစ်တယ်ကုန်သွယ်မှု ပေါင်းစည်းခြင်း",
            body: "Trade Net 2.0 သည် ပိုမိုမြန်ဆန်လာပြီး အလိုအလျောက် ရှင်းလင်းရေးစနစ်များ လာတော့မည်ဖြစ်သည်။ ယခုကတည်းက ဒီဂျစ်တယ်စနစ်သို့ ပြောင်းလဲထားသော ကုန်သည်များသည် အသာစီးရပါလိမ့်မည်။",
          },
        ]
      : [
          {
            title: "Lab-Grown Meat",
            body: "Cell-based meat is entering as a premium segment. Customs classification and tax treatment may evolve rapidly.",
          },
          {
            title: "EV Parts Window",
            body: "EV component policy incentives create short-term import opportunities before potential rate adjustments.",
          },
          {
            title: "Digital Trade Convergence",
            body: "Trade Net 2.0 and automation will make clearance faster for operators already digitally prepared.",
          },
        ],
    nextLabel: isMyanmar ? "ကုန်သွယ်မှုကျွမ်းကျင်မှု" : "Trade Mastery",
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
              <h2 className="text-4xl font-bold mb-2">{copy.rulesTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.rulesDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rules.map((rule) => (
                <Card key={rule.name} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{rule.name}</CardTitle>
                      <span className="text-3xl">{rule.icon}</span>
                    </div>
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

      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{copy.taxTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.taxDesc}</p>
            </div>

            <div className="space-y-4">
              {taxation.map((tax) => (
                <Card key={tax.type} className="border-border hover:border-primary/50 transition-colors">
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

      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                {copy.trendsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {copy.trends.map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation nextHref="/trade-mastery" nextLabel={copy.nextLabel} />
        </div>
      </section>
    </div>
  );
}
