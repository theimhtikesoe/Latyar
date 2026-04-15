import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TradeMastery() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const incoterms = isMyanmar
    ? [
        {
          term: "FOB (Free on Board)",
          description:
            "ကုန်ပစ္စည်းများကို သင်္ဘောပေါ်သို့ တင်ဆောင်ပြီးသည်နှင့် တာဝန်မှာ ဝယ်ယူသူထံသို့ ကူးပြောင်းသွားသည်။ သင်သည် ပို့ဆောင်ခအတွက် ပေးချေရန် မလိုအပ်ပါ။",
          icon: "🚢",
        },
        {
          term: "CIF (Cost, Insurance & Freight)",
          description:
            "ကုန်ပစ္စည်းတန်ဖိုး၊ အာမခံကြေးနှင့် သယ်ယူပို့ဆောင်ခများကို သင်က ပေးချေရသည်။ ဝယ်ယူသူထံသို့ ကုန်ပစ္စည်းများ ရောက်ရှိသည်အထိ သင်က တာဝန်ယူရသည်။",
          icon: "📦",
        },
        {
          term: "DDP (Delivered Duty Paid)",
          description:
            "ကုန်ကျစရိတ်အားလုံးနှင့် အခွန်အခများကို သင်က ပေးချေရသည်။ ဝယ်ယူသူထံသို့ ကုန်ပစ္စည်းများ အရောက်ပို့ဆောင်ပေးရသည့် အဆင့်မြင့်စနစ်ဖြစ်သည်။",
          icon: "✈️",
        },
        {
          term: "EXW (Ex Works)",
          description:
            "ကုန်ပစ္စည်းများကို သင့်စက်ရုံ သို့မဟုတ် ဂိုဒေါင်မှ ထုတ်ယူသည်နှင့် သင့်တာဝန် ပြီးဆုံးသည်။ ဝယ်ယူသူက သယ်ယူပို့ဆောင်ရေးအတွက် တာဝန်ယူရသည်။",
          icon: "🏭",
        },
      ]
    : [
        {
          term: "FOB (Free on Board)",
          description:
            "Responsibility transfers to the buyer once goods are loaded on board. You are not responsible for main freight cost.",
          icon: "🚢",
        },
        {
          term: "CIF (Cost, Insurance & Freight)",
          description:
            "You cover product value, insurance, and freight until goods arrive at the destination port.",
          icon: "📦",
        },
        {
          term: "DDP (Delivered Duty Paid)",
          description:
            "You cover all costs and duties and deliver goods directly to the buyer's destination.",
          icon: "✈️",
        },
        {
          term: "EXW (Ex Works)",
          description:
            "Your responsibility ends when goods are collected from your factory/warehouse. Buyer handles transport.",
          icon: "🏭",
        },
      ];

  const logistics = isMyanmar
    ? [
        {
          step: "သိုလှောင်ခြင်း (Warehousing)",
          details: "ကုန်ပစ္စည်းများ သိုလှောင်ရန် သင့်လျော်သော နေရာများ လိုအပ်သည်။ အပူချိန်၊ စိုထိုင်းဆနှင့် လုံခြုံရေးတို့မှာ အလွန်အရေးကြီးသည်။",
        },
        {
          step: "သယ်ယူပို့ဆောင်ခြင်း (Shipping)",
          details: "ဝယ်ယူသူထံ ရောက်ရှိရန် အကောင်းဆုံးလမ်းကြောင်းကို ရွေးချယ်ရမည်။ ရေလမ်း၊ လေလမ်း သို့မဟုတ် ကုန်းလမ်း—အခြေအနေပေါ်မူတည်၍ ဆုံးဖြတ်ရမည်။",
        },
        {
          step: "အကောက်ခွန်ရှင်းလင်းခြင်း (Customs Clearance)",
          details: "နိုင်ငံတကာနယ်စပ်ကို ဖြတ်ကျော်ရာတွင် အကောက်ခွန်လုပ်ငန်းစဉ်များ လိုအပ်သည်။ ကျွမ်းကျင်သော အကောက်ခွန်ပွဲစားများဖြင့် လုပ်ဆောင်ရန် လိုအပ်သည်။",
        },
        {
          step: "နောက်ဆုံးအဆင့် ပို့ဆောင်ခြင်း (Last Mile Delivery)",
          details: "ဝယ်ယူသူ၏ လက်ဝယ်သို့ အရောက်ပို့ဆောင်ပေးသည့် နောက်ဆုံးအဆင့်ဖြစ်သည်။ ကုန်ပစ္စည်းများ ကောင်းမွန်သော အခြေအနေဖြင့် ရောက်ရှိရန် အရေးကြီးသည်။",
        },
      ]
    : [
        {
          step: "Warehousing",
          details: "Use storage environments that match product requirements, including temperature, humidity, and security.",
        },
        {
          step: "Shipping",
          details: "Choose the most efficient route by sea, air, or land based on urgency, cost, and risk.",
        },
        {
          step: "Customs Clearance",
          details: "Border movement requires strong customs execution and documentation accuracy.",
        },
        {
          step: "Last Mile Delivery",
          details: "Final delivery quality determines customer trust and repeat business outcomes.",
        },
      ];

  const copy = {
    headerTitle: isMyanmar ? "ကုန်သွယ်မှုကျွမ်းကျင်မှု" : "Trade Mastery",
    headerSubtitle: isMyanmar ? "အဆင့်မြင့်မဟာဗျူဟာများနှင့် လုပ်ငန်းစဉ်များ" : "Advanced strategy and execution",
    headerDesc: isMyanmar
      ? "Incoterms က ကုန်ကျစရိတ်များကို မည်သူက ပေးချေရမည်ကို သတ်မှတ်ပေးသည်။ ပို့ဆောင်ရေးစနစ် (Logistics) က ကုန်စည်များ မည်သို့ရွေ့လျားမည်ကို ဆုံးဖြတ်ပေးသည်။ ဤနှစ်ခုလုံးကို ကျွမ်းကျင်ပါက သင်၏ ကုန်သွယ်မှုတိုင်းကို အကောင်းဆုံး ဖြစ်စေပါလိမ့်မည်။"
      : "Incoterms define cost and risk allocation. Logistics defines movement quality. Mastering both makes execution faster, safer, and more profitable.",
    incotermTitle: isMyanmar ? "Incoterms ၂၀၂၀" : "Incoterms 2020",
    incotermDesc: isMyanmar
      ? "နိုင်ငံတကာ ကုန်သွယ်မှုဆိုင်ရာ သတ်မှတ်ချက်များ - မည်သူက ဘာအတွက် ပေးချေရမည်နည်း?"
      : "International trade terms - who pays for what, and when risk transfers",
    logisticsTitle: isMyanmar ? "ပို့ဆောင်ရေးစနစ် (Logistics Framework)" : "Logistics Framework",
    logisticsDesc: isMyanmar ? "ဂိုဒေါင်မှ ဝယ်ယူသူ၏ အိမ်တံခါးဝအထိ" : "From warehouse to customer doorstep",
    costTitle: isMyanmar ? "ကုန်ကျစရိတ် လျှော့ချရန် အကြံပြုချက်များ" : "Cost Optimization Tips",
    tips: isMyanmar
      ? [
          {
            title: "၁။ မှန်ကန်သော Incoterm ကို ရွေးချယ်ပါ",
            body: "FOB က သယ်ယူခ သက်သာစေသော်လည်း ဝယ်ယူသူအတွက် စွန့်စားမှု များစေသည်။ CIF နှင့် DDP တို့က ဝယ်ယူသူ၏ ယုံကြည်မှုကို ရရှိစေသည်။ သင့်ငွေကြေးစီးဆင်းမှုအပေါ် မူတည်၍ ရွေးချယ်ပါ။",
          },
          {
            title: "၂။ ကုန်ပစ္စည်းများကို စုပေါင်းတင်ပို့ပါ",
            body: "အနည်းငယ်စီ ခွဲပို့ခြင်းက ကုန်ကျစရိတ် ပိုများစေသည်။ Container အပြည့် (FCL) တင်ပို့ခြင်းက တစ်ယူနစ်ချင်းစီ၏ သယ်ယူခကို လျှော့ချပေးနိုင်သည်။",
          },
          {
            title: "၃။ ဒေသတွင်း ပို့ဆောင်ရေး ဗဟိုချက်များကို အသုံးပြုပါ",
            body: "မြန်မာနိုင်ငံ၏ တည်နေရာအရ ဘန်ကောက်၊ စင်ကာပူကဲ့သို့သော ဗဟိုချက်များကို အသုံးပြု၍ လမ်းကြောင်းများကို အကောင်းဆုံးဖြစ်အောင် လုပ်ဆောင်နိုင်သည်။",
          },
          {
            title: "၄။ ပို့ဆောင်ရေးလုပ်ငန်းများနှင့် ညှိနှိုင်းပါ",
            body: "ပို့ဆောင်ရမည့် ပမာဏများပါက ဈေးနှုန်းညှိနှိုင်းနိုင်သော အားသာချက် ရှိသည်။ ၎င်းတို့နှင့် ခိုင်မာသော ဆက်ဆံရေး တည်ဆောက်ထားပါက ပိုမိုသက်သာသော နှုန်းထားနှင့် မြန်ဆန်သော ဝန်ဆောင်မှုကို ရရှိပါလိမ့်မည်။",
          },
        ]
      : [
          {
            title: "1. Choose the Right Incoterm",
            body: "FOB can reduce your freight burden but shifts more risk to the buyer. CIF/DDP can improve buyer confidence when structured correctly.",
          },
          {
            title: "2. Consolidate Shipments",
            body: "Small split shipments increase unit cost. Full container strategies can reduce freight cost per unit.",
          },
          {
            title: "3. Use Regional Logistics Hubs",
            body: "Myanmar's location allows route optimization through hubs like Bangkok and Singapore depending on lanes and cargo type.",
          },
          {
            title: "4. Negotiate with Carriers",
            body: "Higher and consistent volume improves leverage for better rates and service reliability.",
          },
        ],
    nextLabel: isMyanmar ? "ပထဝီနိုင်ငံရေး" : "Geopolitics",
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
              <h2 className="text-4xl font-bold mb-2">{copy.incotermTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.incotermDesc}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incoterms.map((term) => (
                <Card key={term.term} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{term.term}</CardTitle>
                      <span className="text-3xl">{term.icon}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{term.description}</p>
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
              <h2 className="text-4xl font-bold mb-2">{copy.logisticsTitle}</h2>
              <p className="text-lg text-muted-foreground">{copy.logisticsDesc}</p>
            </div>

            <div className="space-y-6">
              {logistics.map((item, idx) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                      {idx + 1}
                    </div>
                    {idx < logistics.length - 1 && <div className="w-1 h-24 bg-accent/30 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-6">
                    <Card className="border-border hover:border-accent/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-xl">{item.step}</CardTitle>
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

      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                {copy.costTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {copy.tips.map((tip) => (
                <div key={tip.title}>
                  <h4 className="font-semibold text-lg mb-2">{tip.title}</h4>
                  <p className="text-muted-foreground">{tip.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation nextHref="/geopolitics" nextLabel={copy.nextLabel} />
        </div>
      </section>
    </div>
  );
}
