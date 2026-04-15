import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Briefcase } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ThePillars() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const documentation = isMyanmar
    ? {
        title: "စာရွက်စာတမ်းပိုင်း (Documentation)",
        subtitle: "တိတ်ဆိတ်သော လုပ်ငန်းစဉ်",
        description:
          "ဒါကို 'Silent Process' လို့ ခေါ်တယ်။ မှားလို့မရဘူး။ ဒါတွေဟာ စာရွက်သက်သက်တင် မဟုတ်ပါဘူး။ ဒါတွေဟာ သင့်ရဲ့ ချပ်ဝတ်တန်ဆာ၊ သင့်ရဲ့ သက်သေနဲ့ နယ်စပ်တိုင်းကို ဖြတ်ကျော်နိုင်မယ့် လက်မှတ်တွေပဲ ဖြစ်ပါတယ်။",
        items: [
          {
            name: "Invoice & Packing List",
            description:
              "အခြေခံအုတ်မြစ်ပဲ။ သင်ဘာရောင်းနေလဲ၊ ဘယ်လောက်လဲ၊ ဘယ်သူ့ကိုလဲ။ အသေးစိတ်တိုင်းက အရေးကြီးတယ်—ဒါဟာ သင့်ရဲ့ ပထမဆုံး အထင်အမြင်ပဲ။",
            icon: "📋",
          },
          {
            name: "Bill of Lading (BL)",
            description:
              "ကုန်ပစ္စည်းတင်ပို့ပြီးကြောင်း သက်သေ။ ဒီစာရွက်စာတမ်းဟာ သင့်ကုန်ပစ္စည်းတွေနဲ့အတူ ရွေ့လျားသွားတာပါ။ ဒါဟာ ပြေစာ၊ စာချုပ်နဲ့ သက်သေအထောက်အထားပဲ ဖြစ်ပါတယ်။",
            icon: "🚢",
          },
          {
            name: "Letter of Credit (L/C)",
            description:
              "အာမခံချက်။ ယုံကြည်မှုတစ်ခုတည်းနဲ့ မလုံလောက်တဲ့အခါ L/C ဟာ ဘဏ်ရဲ့ ငွေပေးချေမယ်ဆိုတဲ့ ကတိကဝတ်ပဲ ဖြစ်ပါတယ်။ နှစ်ဖက်စလုံးအတွက် အာမခံချက်ပါပဲ။",
            icon: "💳",
          },
          {
            name: "လိုင်စင်နှင့် FDA/C.O",
            description:
              "ခွင့်ပြုချက်လက်မှတ်။ စည်းမျဉ်းစည်းကမ်းတွေကို လိုက်နာမှု။ ဒါမရှိရင် သင့်ကုန်ပစ္စည်းတွေဟာ တစ်လက်မတောင် မရွေ့နိုင်ပါဘူး။ ဒါအမှန်တရားပဲ။",
            icon: "🔐",
          },
        ],
      }
    : {
        title: "Documentation",
        subtitle: "The Silent Process",
        description:
          "This is the silent process and there is no room for mistakes. These are not just papers. They are your armor, your proof, and your pass through every border.",
        items: [
          {
            name: "Invoice & Packing List",
            description:
              "The foundation. What you sell, how much, and to whom. Every detail matters because this is your first impression.",
            icon: "📋",
          },
          {
            name: "Bill of Lading (BL)",
            description:
              "Proof that the goods were shipped. It moves with your cargo and serves as receipt, contract, and legal evidence.",
            icon: "🚢",
          },
          {
            name: "Letter of Credit (L/C)",
            description:
              "A trust guarantee. When trust alone is not enough, an L/C is the bank's payment commitment for both parties.",
            icon: "💳",
          },
          {
            name: "Licenses & FDA/C.O",
            description:
              "Your legal permission to move. Without compliance documents, your goods do not move an inch.",
            icon: "🔐",
          },
        ],
      };

  const operations = isMyanmar
    ? {
        title: "လက်တွေ့လုပ်ငန်းစဉ် (Operation Procedures)",
        subtitle: "တကယ့်လက်တွေ့အလုပ်",
        description:
          "Quotation (TT/LC) မှစတင်ပြီး ငွေပေးချေမှု၊ လိုင်စင်လျှောက်ခြင်း၊ အကောက်ခွန်ရှင်းလင်းခြင်း နှင့် ကုန်ပစ္စည်းပို့ဆောင်ခြင်းအထိ လုပ်ငန်းစဉ်တစ်ခုလုံး။",
        stages: [
          {
            stage: 1,
            name: "Quotation (TT/LC)",
            description:
              "ညှိနှိုင်းမှုတွေက ဒီကနေ စတာပါ။ Telegraphic Transfer လား ဒါမှမဟုတ် Letter of Credit လား—သင်နှစ်သက်တဲ့ ငွေပေးချေမှုပုံစံကို ရွေးချယ်ပါ။ ဒါဟာ နောက်ဆက်တွဲဖြစ်လာမယ့် အရာအားလုံးအတွက် လမ်းစပဲ။",
          },
          {
            stage: 2,
            name: "လိုင်စင်နှင့် ခွင့်ပြုချက်လျှောက်ထားခြင်း",
            description:
              "ကစားကွင်းထဲဝင်ဖို့ ခွင့်ပြုချက်လိုပါတယ်။ ပို့ကုန်/သွင်းကုန် လိုင်စင်တွေကို လျှောက်ထားပါ။ ရုံးလုပ်ငန်းတွေက များပြားပေမယ့် ဒါဟာ တရားဝင်ဖြစ်ဖို့အတွက် ပေးဆပ်ရတဲ့ တန်ဖိုးပါပဲ။",
          },
          {
            stage: 3,
            name: "အကောက်ခွန်ရှင်းလင်းခြင်း (MACCS)",
            description:
              "စစ်ဆေးရေးဂိတ်ပဲ။ သင့်ကုန်ပစ္စည်းတွေကို စစ်ဆေးမယ်၊ စာရွက်စာတမ်းတွေကို အတည်ပြုမယ်။ ဒါဟာ အပျော်တမ်းသမားတွေ ဒုက္ခရောက်တတ်တဲ့ နေရာပဲ။ စည်းမျဉ်းတွေကို သိထားရင် သင်ဟာ ချောချောမွေ့မွေ့ ဖြတ်ကျော်နိုင်ပါလိမ့်မယ်။",
          },
          {
            stage: 4,
            name: "ကုန်ပစ္စည်းပို့ဆောင်ခြင်း",
            description:
              "ပန်းတိုင်ပဲ။ သင့်ကုန်ပစ္စည်းတွေ ဝယ်ယူသူဆီ ရောက်သွားပြီ။ လုပ်ငန်းစဉ် ပြီးဆုံးသွားပြီ။ ဆက်ဆံရေးအသစ် စတင်ပြီ။",
          },
        ],
      }
    : {
        title: "Operation Procedures",
        subtitle: "Execution in the Field",
        description:
          "From quotation (TT/LC) to payment, licensing, customs clearance, and final delivery, this is the full execution chain.",
        stages: [
          {
            stage: 1,
            name: "Quotation (TT/LC)",
            description:
              "Every deal starts here. Choose Telegraphic Transfer or Letter of Credit based on your risk and cash-flow strategy.",
          },
          {
            stage: 2,
            name: "Apply for Licenses and Approvals",
            description:
              "You need legal permission to enter the field. Paperwork is heavy, but it is the cost of operating correctly.",
          },
          {
            stage: 3,
            name: "Customs Clearance (MACCS)",
            description:
              "Checkpoint stage. Cargo and documents are validated. Most avoidable delays happen here when preparation is weak.",
          },
          {
            stage: 4,
            name: "Final Delivery",
            description:
              "Destination reached. Goods arrive, process is closed, and the next commercial relationship begins.",
          },
        ],
      };

  const copy = {
    headerTitle: isMyanmar ? "အဓိကမဏ္ဍိုင်များ" : "Core Pillars",
    headerSubtitle: isMyanmar ? "နိုင်ငံတကာကုန်သွယ်ရေး၏ အခြေခံအုတ်မြစ်" : "Foundation of International Trade",
    headerDesc: isMyanmar
      ? "ကုန်သွယ်မှုခရီးစဉ်တိုင်းဟာ မဏ္ဍိုင်နှစ်ခုပေါ်မှာ တည်မှီနေပါတယ်။ အဲဒါတွေကတော့ စာရွက်စာတမ်းပိုင်းနဲ့ လက်တွေ့လုပ်ငန်းစဉ်ပိုင်းတို့ပဲ ဖြစ်ပါတယ်။ ဒီနှစ်ခုလုံးကို ကျွမ်းကျင်ရင် သင်ဟာ ဒီဂိမ်းရဲ့ အရှင်သခန်ဖြစ်လာပါလိမ့်မယ်။"
      : "Every trade journey stands on two pillars: documentation and operations. Master both and you control the game.",
    integrationTitle: isMyanmar ? "ပေါင်းစပ်လုပ်ဆောင်ခြင်း" : "Integrated Execution",
    integrationDesc1: isMyanmar
      ? "စာရွက်စာတမ်းပိုင်းနှင့် လက်တွေ့လုပ်ငန်းစဉ်ပိုင်းတို့သည် သီးခြားစီမဟုတ်ဘဲ အပြန်အလှန်ဆက်နွှယ်နေပါသည်။ သင့်စာရွက်စာတမ်းများက သင့်လုပ်ငန်းစဉ်ကို သက်သေပြပြီး သင့်လုပ်ငန်းစဉ်များက သင့်စာရွက်စာတမ်းများကို အတည်ပြုပေးပါသည်။ ဤနှစ်ခုလုံးကို ကျွမ်းကျင်ပါက ကုန်သွယ်မှုနယ်ပယ်ကို သင်ကျွမ်းကျင်ပါလိမ့်မည်။"
      : "Documentation and operations are not separate systems. Your documents validate your process, and your process validates your documents.",
    integrationDesc2: isMyanmar
      ? "ဤဆက်နွှယ်မှုကို နားလည်သော ကုန်သည်များသည် ပိုမိုမြန်ဆန်စွာ လုပ်ဆောင်နိုင်ပြီး အကောက်ခွန်၊ ဘဏ်များနှင့် ဝယ်ယူသူများကြားတွင် ခိုင်မာသော ယုံကြည်မှုကို တည်ဆောက်နိုင်ပါသည်။ ၎င်းတို့သည် ကုန်စည်များကိုသာ ရွှေ့ပြောင်းနေခြင်းမဟုတ်ဘဲ စနစ်တစ်ခုကို တည်ဆောက်နေခြင်း ဖြစ်သည်။"
      : "Traders who understand this link move faster and build trust across customs, banks, and buyers. They move systems, not only goods.",
    nextLabel: isMyanmar ? "စည်းမျဉ်းလိုက်နာမှုဗဟို" : "Compliance Hub",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold neon-glow">{copy.headerTitle}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{copy.headerSubtitle}</p>
            <p className="text-base sm:text-lg text-foreground leading-relaxed">{copy.headerDesc}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{documentation.title}</h2>
                <p className="text-base sm:text-lg text-muted-foreground mt-2">{documentation.subtitle}</p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-3xl">{documentation.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documentation.items.map((item) => (
                <Card key={item.name} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-2xl">{item.name}</CardTitle>
                      <span className="text-3xl">{item.icon}</span>
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

      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/20 text-secondary">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{operations.title}</h2>
                <p className="text-base sm:text-lg text-muted-foreground mt-2">{operations.subtitle}</p>
              </div>
            </div>

            <p className="text-base sm:text-lg text-foreground leading-relaxed max-w-3xl">{operations.description}</p>

            <div className="space-y-6">
              {operations.stages.map((stage, idx) => (
                <div key={stage.name} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      {stage.stage}
                    </div>
                    {idx < operations.stages.length - 1 && <div className="w-1 h-24 bg-primary/30 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-6">
                    <Card className="border-border hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-2xl">{stage.name}</CardTitle>
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

      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">{copy.integrationTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base sm:text-lg leading-relaxed">{copy.integrationDesc1}</p>
              <p className="text-muted-foreground leading-relaxed">{copy.integrationDesc2}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation nextHref="/compliance" nextLabel={copy.nextLabel} />
        </div>
      </section>
    </div>
  );
}
