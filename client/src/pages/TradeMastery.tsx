import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function TradeMastery() {
  const incoterms = [
    {
      term: "FOB (Free on Board)",
      description: "သင်ဘူတ်ပေါ်တွင် ကုန်ပစ္စည်းများ ထည့်သွင်းပြီးအခါ ဝယ်ယူသူ၏ တာဝန်ဖြစ်သွားပါတယ်။ သင်ဟာ ပို့ဆောင်ခ ခြင်းအတွက် ကုန်ကျမည်မရှိပါဘူး။",
      icon: "🚢",
    },
    {
      term: "CIF (Cost, Insurance & Freight)",
      description: "သင်ဟာ ကုန်ကျ၊ အာမခံ နှင့် ပို့ဆောင်ခြင်းအတွက် ကုန်ကျမည်ကို ပေးချေရပါတယ်။ ဝယ်ယူသူ ကုန်ပစ္စည်းများ လက်ခံရယူသည်အထိ သင့်ကုန်ကျမည်ဖြစ်ပါတယ်။",
      icon: "📦",
    },
    {
      term: "DDP (Delivered Duty Paid)",
      description: "သင်ဟာ အားလုံးကုန်ကျမည်ကို ပေးချေရပါတယ်။ ဝယ်ယူသူ ကုန်ပစ္စည်းများ လက်ခံရယူသည်အထိ။ ဒါဟာ အဆင့်မြင့်တဲ့ ကုန်သွယ်မှုစနစ်ပါပဲ။",
      icon: "✈️",
    },
    {
      term: "EXW (Ex Works)",
      description: "ကုန်ပစ္စည်းများ သင့်ရုံးမှ ထုတ်ယူသည်အခါ သင့်တာဝန် ကုန်ဆုံးပါတယ်။ ဝယ်ယူသူ ကုန်ပစ္စည်းများ ပို့ဆောင်ရန် တာဝန်ယူရပါတယ်။",
      icon: "🏭",
    },
  ];

  const logistics = [
    {
      step: "သင်ခြင်း (Warehousing)",
      details: "ကုန်ပစ္စည်းများ သင်ခြင်းအတွက် သင့်လျော်သော သင်ခန်းများ လိုအပ်ပါတယ်။ အပူချိန်ထိန်းချုပ်မှု၊ စိုထိုင်းမှုထိန်းချုပ်မှု နှင့် လုံခြုံရေးတွေ အရေးကြီးပါတယ်။",
    },
    {
      step: "ကုန်ပစ္စည်းတင်ပို့ခြင်း (Shipping)",
      details: "ကုန်ပစ္စည်းများ သင့်ဝယ်ယူသူထံ ရောက်သွားရန် အကောင်းဆုံး ကုန်ပစ္စည်းတင်ပို့ခြင်းနည်းလမ်း ရွေးချယ်ရပါတယ်။ ရေလမ်း၊ လေလမ်း၊ ကုန်တင်ယာဉ်လမ်း သို့မဟုတ် ရထားလမ်း။",
    },
    {
      step: "အကောက်ခွန်ရှင်းလင်းခြင်း (Customs Clearance)",
      details: "ကုန်ပစ္စည်းများ နိုင်ငံတကာ နယ်စပ်ကို ဖြတ်ကျော်သည်အခါ အကောက်ခွန်ရှင်းလင်းခြင်း လုပ်ငန်းစဉ် လိုအပ်ပါတယ်။ ဒါဟာ အချိန်ကုန်သည်။ အဆင့်မြင့်တဲ့ အကောက်ခွန်ကုန်သည်များ လိုအပ်ပါတယ်။",
    },
    {
      step: "နောက်ဆုံးမိုင်းတွင် ပို့ဆောင်ခြင်း (Last Mile Delivery)",
      details: "ကုန်ပစ္စည်းများ ဝယ်ယူသူထံ ရောက်သွားရန် နောက်ဆုံးအဆင့်ပါပဲ။ ဒါဟာ အရေးကြီးတဲ့ အဆင့်ပါပဲ။ ဝယ်ယူသူ ကုန်ပစ္စည်းများ ကောင်းမွန်သောအခြေအနေတွင် လက်ခံရယူရမယ်။",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">Trade Mastery</h1>
            <p className="text-xl text-muted-foreground">Advanced Strategies & Frameworks - အဆင့်မြင့်တဲ့ ကုန်သွယ်မှုလုပ်ငန်းစဉ်များ</p>
            <p className="text-lg text-foreground leading-relaxed">
              Incoterms define who pays for what. Logistics determines how goods move. Master both, and you'll optimize every transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Incoterms */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Incoterms 2020</h2>
              <p className="text-lg text-muted-foreground">International Commercial Terms - Who pays for what?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incoterms.map((term, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
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

      {/* Logistics */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Logistics Framework</h2>
              <p className="text-lg text-muted-foreground">From warehouse to doorstep</p>
            </div>

            <div className="space-y-6">
              {logistics.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                      {idx + 1}
                    </div>
                    {idx < logistics.length - 1 && (
                      <div className="w-1 h-24 bg-accent/30 mt-2"></div>
                    )}
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

      {/* Cost Optimization */}
      <section className="section-padding">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                Cost Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">1. Choose the Right Incoterm</h4>
                <p className="text-muted-foreground">FOB saves you money on shipping but increases buyer risk. CIF and DDP shift risk to you but build buyer confidence. Choose based on your relationship and cash flow.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">2. Consolidate Shipments</h4>
                <p className="text-muted-foreground">Multiple small shipments are expensive. Consolidate into full container loads (FCL) to reduce per-unit shipping costs.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">3. Use Regional Logistics Hubs</h4>
                <p className="text-muted-foreground">Myanmar's strategic location means you can use regional hubs (Bangkok, Singapore) to optimize routes and reduce delays.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">4. Negotiate with Freight Forwarders</h4>
                <p className="text-muted-foreground">Volume gives you leverage. Build relationships with freight forwarders—they'll give you better rates and faster service.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation 
            nextHref="/geopolitics" 
            nextLabel="Geopolitics" 
          />
        </div>
      </section>
    </div>
  );
}
