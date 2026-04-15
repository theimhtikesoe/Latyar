import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ComplianceHub() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const dica = isMyanmar
    ? {
        title: "DICA - အမျိုးအစားခွဲခြားခြင်း ကဏ္ဍ",
        description: "ရင်းနှီးမြှုပ်နှံမှုနှင့် ကုမ္ပဏီများ ညွှန်ကြားမှု ဦးစီးဌာန",
        systems: [
          {
            name: "Quota စနစ်",
            description:
              "ကုန်ပစ္စည်းအချို့ကို အရေအတွက် ကန့်သတ်ချက်ဖြင့်သာ တင်သွင်း/တင်ပို့ခွင့်ရှိသည်။ သင်ဘယ်လောက်လုပ်ဆောင်နိုင်သလဲဆိုသည်မှာ အရေးကြီးသော မေးခွန်းဖြစ်သည်။ ၎င်းအတွက် DICA ၏ စည်းမျဉ်းများကို လေ့လာပါ။",
            icon: "📊",
          },
          {
            name: "ဈေးနှုန်းထိန်းချုပ်မှု",
            description:
              "အချို့ကုန်ပစ္စည်းများသည် ဈေးကွက်အတွင်း ဈေးနှုန်းထိန်းချုပ်မှုအောက်တွင် ရှိသည်။ သတ်မှတ်ထားသော ဘောင်အတွင်းရှိနေမှသာ ကောင်းမွန်သော ကုန်သွယ်မှုဖြစ်စဉ်တစ်ခု ဖြစ်လာပါလိမ့်မည်။",
            icon: "💰",
          },
          {
            name: "လိုင်စင်လိုအပ်ချက်များ",
            description:
              "အချို့သော ကုန်သွယ်မှုများအတွက် အထူးခွင့်ပြုချက် လိုင်စင်များ လိုအပ်သည်။ ၎င်းမရှိဘဲ လုပ်ဆောင်ခြင်းသည် ဥပဒေကြောင်းအရ အခက်အခဲများ ရှိလာနိုင်ပါသည်။",
            icon: "🔐",
          },
        ],
      }
    : {
        title: "DICA - Classification and Controls",
        description: "Directorate of Investment and Company Administration",
        systems: [
          {
            name: "Quota System",
            description:
              "Some goods can only be imported/exported within fixed quantity limits. Capacity planning starts with quota awareness.",
            icon: "📊",
          },
          {
            name: "Price Controls",
            description:
              "Certain goods are monitored under market price controls. Staying inside allowed ranges reduces regulatory risk.",
            icon: "💰",
          },
          {
            name: "License Requirements",
            description:
              "Some transactions require special permits. Operating without proper licenses can create legal and operational issues.",
            icon: "🔐",
          },
        ],
      };

  const tradenet = isMyanmar
    ? {
        title: "Trade Net 2.0 - ဒီဂျစ်တယ်ကုန်သွယ်မှုစနစ်",
        description: "မြန်မာနိုင်ငံ၏ အွန်လိုင်းကုန်သွယ်မှုစနစ်",
        features: [
          {
            feature: "အွန်လိုင်းလိုင်စင်လျှောက်ထားခြင်း",
            status: "အသုံးပြုနိုင်သည်",
            description: "အွန်လိုင်းမှတစ်ဆင့် လိုင်စင်များကို လွယ်ကူစွာ လျှောက်ထားနိုင်သည်။ အချိန်ကုန်သက်သာပြီး ပိုမိုထိရောက်သည်။",
          },
          {
            feature: "အချိန်နှင့်တပြေးညီ ခြေရာခံခြင်း",
            status: "အသုံးပြုနိုင်သည်",
            description: "သင့်ကုန်ပစ္စည်းများ၏ အခြေအနေကို အချိန်မရွေး သိရှိနိုင်သည်။ အဆင့်မြင့် ဒီဂျစ်တယ်စနစ်တစ်ခု ဖြစ်သည်။",
          },
          {
            feature: "အလိုအလျောက် ရှင်းလင်းရေးစနစ်",
            status: "မကြာမီလာမည်",
            description: "အကောက်ခွန်ရှင်းလင်းရေး လုပ်ငန်းစဉ်များကို အလိုအလျောက် လုပ်ဆောင်ပေးမည့် စနစ်ဖြစ်သည်။",
          },
        ],
      }
    : {
        title: "Trade Net 2.0 - Digital Trade System",
        description: "Myanmar's national online trade platform",
        features: [
          {
            feature: "Online License Submission",
            status: "Available",
            description: "Apply for licenses online to reduce processing time and improve efficiency.",
          },
          {
            feature: "Real-Time Tracking",
            status: "Available",
            description: "Track cargo and application status at any time through the platform.",
          },
          {
            feature: "Automated Clearance Workflows",
            status: "Coming Soon",
            description: "Upcoming automation is expected to reduce manual customs processing steps.",
          },
        ],
      };

  const maccs = isMyanmar
    ? {
        title: "MACCS - အကောက်ခွန်ရှင်းလင်းမှုစနစ်",
        description: "Myanmar Automated Cargo Clearance System",
        process: [
          {
            step: 1,
            name: "စာရွက်စာတမ်းတင်သွင်းခြင်း",
            details: "Invoice, BL, LC, License အစရှိသည်တို့ကို အွန်လိုင်းမှ တင်သွင်းရမည်။ အချက်အလက်မှန်ကန်ရန် အထူးအရေးကြီးသည်။",
          },
          {
            step: 2,
            name: "အခြေခံအချက်အလက်စစ်ဆေးခြင်း",
            details: "စနစ်မှ သင့်စာရွက်စာတမ်းများကို အလိုအလျောက် စစ်ဆေးမည်ဖြစ်သည်။ အမှားအယွင်းရှိပါက ပြန်လည်ပြင်ဆင်ရမည်။",
          },
          {
            step: 3,
            name: "ကုန်ပစ္စည်းစစ်ဆေးခြင်း",
            details: "ကုန်ပစ္စည်းအမျိုးအစား၊ အရေအတွက်နှင့် အခြေအနေများကို အကောက်ခွန်အရာရှိများက စစ်ဆေးမည်ဖြစ်သည်။",
          },
          {
            step: 4,
            name: "အကောက်ခွန်ပေးချေခြင်း",
            details: "သတ်မှတ်ထားသော အကောက်ခွန်နှုန်းထားများအတိုင်း ပေးချေရမည်။ ထို့နောက်မှသာ ကုန်ပစ္စည်းထုတ်ယူခွင့် ရရှိမည်ဖြစ်သည်။",
          },
          {
            step: 5,
            name: "ကုန်ပစ္စည်းထုတ်ယူခြင်း",
            details: "လုပ်ငန်းစဉ်အားလုံး ပြီးဆုံးပါက သင့်ကုန်ပစ္စည်းများကို ဆိပ်ကမ်း သို့မဟုတ် ဂိုဒေါင်မှ ထုတ်ယူနိုင်ပြီဖြစ်သည်။",
          },
        ],
      }
    : {
        title: "MACCS - Customs Clearance System",
        description: "Myanmar Automated Cargo Clearance System",
        process: [
          {
            step: 1,
            name: "Submit Documents",
            details: "Upload invoice, BL, LC, licenses, and related files online with correct and complete data.",
          },
          {
            step: 2,
            name: "System Validation",
            details: "The platform validates submitted data. Any mismatch requires correction before progressing.",
          },
          {
            step: 3,
            name: "Cargo Inspection",
            details: "Customs officers verify type, quantity, and condition of goods.",
          },
          {
            step: 4,
            name: "Duty and Tax Payment",
            details: "Pay according to applicable tariff and tax structure to unlock release approval.",
          },
          {
            step: 5,
            name: "Cargo Release",
            details: "After completion, goods can be collected from port or warehouse for onward distribution.",
          },
        ],
      };

  const copy = {
    headerTitle: isMyanmar ? "စည်းမျဉ်းလိုက်နာမှုဗဟို" : "Compliance Hub",
    headerSubtitle: isMyanmar
      ? "စနစ်ကို နားလည်ပါ - စည်းမျဉ်းစည်းကမ်းများကို ကျွမ်းကျင်စွာ အသုံးချခြင်း"
      : "Understand the system - master regulatory execution",
    headerDesc: isMyanmar
      ? "မြန်မာနိုင်ငံ၏ ကုန်သွယ်မှုစနစ်သည် ပြောင်းလဲတိုးတက်နေသည်။ DICA က စည်းမျဉ်းများကို သတ်မှတ်သည်။ Trade Net 2.0 က လုပ်ငန်းစဉ်များကို ဒီဂျစ်တယ်ပြောင်းလဲပေးသည်။ MACCS က ရှင်းလင်းရေးလုပ်ငန်းစဉ်များကို လုပ်ဆောင်သည်။ ဤသုံးခုစလုံးကို နားလည်ခြင်းဖြင့် သင်သည် ကုန်သွယ်မှုနယ်ပယ်တွင် အမြဲအဆင်သင့် ဖြစ်နေပါလိမ့်မည်။"
      : "Myanmar's trade system is evolving. DICA sets regulatory rules, Trade Net 2.0 digitizes flows, and MACCS executes customs clearance. Understanding all three keeps you operationally ready.",
    available: isMyanmar ? "အသုံးပြုနိုင်သည်" : "Available",
    comingSoon: isMyanmar ? "မကြာမီလာမည်" : "Coming Soon",
    takeawayTitle: isMyanmar ? "အဓိကမှတ်သားဖွယ်များ" : "Key Takeaways",
    takeaways: isMyanmar
      ? [
          {
            title: "DICA က စည်းမျဉ်းများကို သတ်မှတ်သည်",
            body: "Quota များ၊ ဈေးနှုန်းထိန်းချုပ်မှုများနှင့် လိုင်စင်လိုအပ်ချက်များကို မကုန်သွယ်မီ ကြိုတင်လေ့လာပါ။",
          },
          {
            title: "Trade Net 2.0 က အရာအားလုံးကို ဒီဂျစ်တယ်ပြောင်းလဲသည်",
            body: "အွန်လိုင်းလိုင်စင်၊ အချိန်နှင့်တပြေးညီ ခြေရာခံခြင်း။ စနစ်က ဒီဂျစ်တယ်သို့ ကူးပြောင်းနေပြီဖြစ်ရာ သင်လည်း လိုက်ပါပြောင်းလဲပါ။",
          },
          {
            title: "MACCS က ရှင်းလင်းရေးကို လုပ်ဆောင်သည်",
            body: "စာရွက်စာတမ်းတင်သွင်းခြင်းမှ ကုန်ပစ္စည်းထုတ်ယူခြင်းအထိ အဆင့် ၅ ဆင့်ရှိသည်။ ဤလုပ်ငန်းစဉ်ကို ကျွမ်းကျင်ပါက အခြားသူများထက် ပိုမိုမြန်ဆန်ပါလိမ့်မည်။",
          },
        ]
      : [
          {
            title: "DICA Defines the Rulebook",
            body: "Understand quotas, price controls, and licensing requirements before committing to a deal.",
          },
          {
            title: "Trade Net 2.0 Drives Digitization",
            body: "Online licensing and real-time status tracking are now core execution tools.",
          },
          {
            title: "MACCS Runs Clearance",
            body: "From document submission to release, mastering the 5-step process improves speed and reliability.",
          },
        ],
    nextLabel: isMyanmar ? "ဈေးကွက်စီးဆင်းမှု" : "Market Pulse",
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
              <h2 className="text-4xl font-bold mb-2">{dica.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{dica.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dica.systems.map((system) => (
                <Card key={system.name} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{system.name}</CardTitle>
                      <span className="text-3xl">{system.icon}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{system.description}</p>
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
              <h2 className="text-4xl font-bold mb-2">{tradenet.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{tradenet.description}</p>
            </div>

            <div className="space-y-4">
              {tradenet.features.map((item) => (
                <Card key={item.feature} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{item.feature}</CardTitle>
                      <div className="flex items-center gap-2">
                        {item.status === copy.available ? (
                          <div className="flex items-center gap-2 text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-semibold">{item.status}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-semibold">{item.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{maccs.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{maccs.description}</p>
            </div>

            <div className="space-y-6">
              {maccs.process.map((item, idx) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    {idx < maccs.process.length - 1 && <div className="w-1 h-24 bg-secondary/30 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-6">
                    <Card className="border-border hover:border-secondary/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-card/50">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                {copy.takeawayTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {copy.takeaways.map((item) => (
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
          <PageNavigation nextHref="/market-pulse" nextLabel={copy.nextLabel} />
        </div>
      </section>
    </div>
  );
}
