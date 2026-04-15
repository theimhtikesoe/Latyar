import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function MarketPulse() {
  const rules = [
    {
      name: "၁၅/၈၅ စည်းမျဉ်း",
      description: "ပို့ကုန်ရငွေ၏ ၁၅% ကို သတ်မှတ်နှုန်းထားဖြင့် လဲလှယ်ရပြီး ကျန် ၈၅% ကို မိမိစိတ်ကြိုက် အသုံးပြုနိုင်သည်။ ဤစည်းမျဉ်းသည် နိုင်ငံခြားငွေ စီးဆင်းမှုအတွက် အလွန်အရေးကြီးသည်။",
      icon: "📊",
    },
    {
      name: "ဒေသတွင်း ပါဝင်မှု လိုအပ်ချက်",
      description: "အချို့ကုန်ပစ္စည်းများသည် ပြည်တွင်းမှ ထုတ်လုပ်သော ပစ္စည်းများ သတ်မှတ်ရာခိုင်နှုန်း ပါဝင်ရမည်။ ၎င်းသည် ပြည်တွင်းထုတ်လုပ်မှုကို အားပေးရန် ဖြစ်သည်။",
      icon: "🏭",
    },
    {
      name: "ဈေးနှုန်းစောင့်ကြည့်ခြင်း",
      description: "အရေးကြီးကုန်စည်များ၏ ဈေးနှုန်းကို အစိုးရမှ စောင့်ကြည့်ထိန်းချုပ်လေ့ရှိသည်။ သတ်မှတ်ထားသော ဈေးနှုန်းဘောင်အတွင်း ရောင်းဝယ်ရန် လိုအပ်သည်။",
      icon: "💰",
    },
  ];

  const taxation = [
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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">ဈေးကွက်စီးဆင်းမှု</h1>
            <p className="text-xl text-muted-foreground">လက်တွေ့ကမ္ဘာမှ ကုန်သွယ်မှု အပြောင်းအလဲများ</p>
            <p className="text-lg text-foreground leading-relaxed">
              မြန်မာ့ကုန်သွယ်မှုဈေးကွက်သည် စနစ်တကျ လည်ပတ်နေခြင်း ဖြစ်သည်။ ၁၅/၈၅ စည်းမျဉ်း၊ ဒေသတွင်းပါဝင်မှု လိုအပ်ချက်နှင့် ဈေးနှုန်းစောင့်ကြည့်မှုများကဲ့သို့သော စည်းမျဉ်းများကို နားလည်ထားခြင်းဖြင့် ဈေးကွက်အပြောင်းအလဲများကို ကြိုတင်ခန့်မှန်းနိုင်ပါလိမ့်မည်။
            </p>
          </div>
        </div>
      </section>

      {/* Market Rules */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">ဈေးကွက်စည်းမျဉ်းများ</h2>
              <p className="text-lg text-muted-foreground">မြန်မာ့ကုန်သွယ်ရေးကို လမ်းညွှန်နေသော မမြင်ရသည့် လက်များ</p>
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
              <h2 className="text-4xl font-bold mb-2">အခွန်ကောက်ခံမှု ပုံစံ</h2>
              <p className="text-lg text-muted-foreground">မြန်မာနိုင်ငံ၏ သွင်းကုန်အကောက်ခွန် တွက်ချက်ပုံ</p>
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
                ၂၀၂၆-၂၀၂၇ ဈေးကွက်လမ်းကြောင်းများ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">ဓာတ်ခွဲခန်းထုတ် အသား (Lab-Grown Meat)</h4>
                <p className="text-muted-foreground">Cell-based meat များသည် မြန်မာ့ဈေးကွက်သို့ ဇိမ်ခံပစ္စည်းအဖြစ် ဝင်ရောက်လာနေသည်။ အကောက်ခွန် အမျိုးအစားခွဲခြားမှုများ ပြောင်းလဲလာမည်ဟု မျှော်လင့်ရသည်။ စောစီးစွာ စတင်သူများက ဈေးကွက်ဝေစုကို ရရှိပါလိမ့်မည်။</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">EV အပိုပစ္စည်းများ (၂၀၂၆ မတ်လအထိ အကောက်ခွန် ၀%)</h4>
                <p className="text-muted-foreground">လျှပ်စစ်ကား အပိုပစ္စည်းများသည် ၂၀၂၆ မတ်လအထိ အကောက်ခွန် ကင်းလွတ်ခွင့် ရရှိထားသည်။ ထို့နောက်ပိုင်းတွင် အခွန်နှုန်းထားများ တိုးလာနိုင်သဖြင့် ယခုအချိန်သည် အကောင်းဆုံး အခွင့်အရေး ဖြစ်သည်။</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">ဒီဂျစ်တယ်ကုန်သွယ်မှု ပေါင်းစည်းခြင်း</h4>
                <p className="text-muted-foreground">Trade Net 2.0 သည် ပိုမိုမြန်ဆန်လာပြီး အလိုအလျောက် ရှင်းလင်းရေးစနစ်များ လာတော့မည်ဖြစ်သည်။ ယခုကတည်းက ဒီဂျစ်တယ်စနစ်သို့ ပြောင်းလဲထားသော ကုန်သည်များသည် အသာစီးရပါလိမ့်မည်။</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation 
            nextHref="/trade-mastery" 
            nextLabel="ကုန်သွယ်မှုကျွမ်းကျင်မှု" 
          />
        </div>
      </section>
    </div>
  );
}
