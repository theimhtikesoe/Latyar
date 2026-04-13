import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Zap } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function ComplianceHub() {
  const dica = {
    title: "DICA - အမျိုးအစားခွဲခြားခြင်း ကဏ္ဍ",
    description: "Department of Internal Commerce Affairs",
    systems: [
      {
        name: "Quota System",
        description: "ကုန်ပစ္စည်းအချို့မျိုးတွေ အကန့်အသတ်ရှိတယ်။ သင်ဘယ်လောက်ထုတ်လုပ်နိုင်ပါသလဲ။ ဒါဟာ အရေးကြီးတဲ့ မေးခွန်းပဲ။ အဖြေကို DICA ကို မေးပါ။",
        icon: "📊",
      },
      {
        name: "Price Control",
        description: "အချို့ကုန်ပစ္စည်းတွေ ဈေးကွက်ထိန်းချုပ်ခံရတယ်။ သင်မကြေးမုံရဲ့ အကွာအဝေးထဲမှာ ရှိရမယ်။ ဒါမှ ကောင်းမွန်တဲ့ အဆင့်ပြည့်ဝတဲ့ ကုန်သွယ်မှုပဲ ဖြစ်ပါတယ်။",
        icon: "💰",
      },
      {
        name: "License Requirements",
        description: "အချို့အရောင်းအဝယ်တွေ အထူးခွင့်ပြုချက်လိုတယ်။ ဒါမရှိရင် သင်ဟာ ကုန်သွယ်မှုမှုခြင်းတွေ ကျူးလွန်သူတစ်ယောက်ပဲ ဖြစ်သွားပါလိမ့်မယ်။",
        icon: "🔐",
      },
    ],
  };

  const tradenet = {
    title: "Trade Net 2.0 - ဒီဂျစ်တယ်ကုန်သွယ်မှုစနစ်",
    description: "Digital Trade System for Myanmar",
    features: [
      {
        feature: "Online Licensing",
        status: "Active",
        description: "အွန်လိုင်းမှတစ်ဆင့် လိုင်စင်လျှောက်ထားနိုင်တယ်။ အချိန်သက်သာတယ်။ အဆင့်မြင့်တယ်။ ဒါဟာ အနာဂတ်ပါပဲ။",
      },
      {
        feature: "Real-time Tracking",
        status: "Active",
        description: "သင့်ကုန်ပစ္စည်းတွေ ဘယ်မှာ ရှိလဲ။ အခုအချိန်မှာ သိနိုင်ပါတယ်။ အဆင့်မြင့်တဲ့ ဒီဂျစ်တယ်စနစ်တစ်ခုပဲ ဖြစ်ပါတယ်။",
      },
      {
        feature: "Automated Clearance",
        status: "Coming Soon",
        description: "အကောက်ခွန်ရှင်းလင်းမှုကို အလိုအလျောက်လုပ်ဆောင်မယ်။ အချိန်ကုန်သည်။ ဒါဟာ အနာဂတ်ပါပဲ။",
      },
    ],
  };

  const maccs = {
    title: "MACCS - အကောက်ခွန်ရှင်းလင်းမှုစနစ်",
    description: "Myanmar Automated Cargo Clearance System",
    process: [
      {
        step: 1,
        name: "စာရွက်စာတမ်းတင်သွင်းခြင်း",
        details: "Invoice, BL, LC, License အားလုံး အွန်လိုင်းမှတစ်ဆင့် တင်သွင်းပါ။ ဒါတွေ မှားမှားမခြင်းမှုမရှိရင် အဆင့်သွားမယ်။",
      },
      {
        step: 2,
        name: "အခြေခံအချက်အလက်စစ်ဆေးခြင်း",
        details: "စနစ်ကို သင့်စာရွက်စာတမ်းတွေ စစ်ဆေးမယ်။ အမှားအယွင်းတွေ ရှာမယ်။ ရှိရင် ပြန်လည်ပြင်ဆင်ရမယ်။",
      },
      {
        step: 3,
        name: "ကုန်ပစ္စည်းကို ရုံးတွင်း ပြသခြင်း",
        details: "သင့်ကုန်ပစ္စည်းတွေကို အကောက်ခွန်ရုံးတွင်း ပြသရမယ်။ ကုန်ပစ္စည်းအမျိုးအစား၊ အရေအတွက်၊ အခြေအနေတွေ စစ်ဆေးမယ်။",
      },
      {
        step: 4,
        name: "အကောက်ခွန်ပေးချေခြင်း",
        details: "အကောက်ခွန်တွေ ဆုံးဖြတ်မယ်။ သင်ပေးချေရမယ်။ အဲဒါပြီးရင် ကုန်ပစ္စည်းတွေ ထုတ်ယူနိုင်ပါတယ်။",
      },
      {
        step: 5,
        name: "ကုန်ပစ္စည်းထုတ်ယူခြင်း",
        details: "အကောက်ခွန်ပေးချေပြီးရင် သင့်ကုန်ပစ္စည်းတွေကို ထုတ်ယူနိုင်ပါတယ်။ လုပ်ငန်းစဉ်ပြီးဆုံးပါပြီ။",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">Compliance Hub</h1>
            <p className="text-xl text-muted-foreground">Navigate the System - စည်းမျဉ်းစည်းကမ်းတွေကို နည်းပညာအရ ကျော်လွန်ခြင်း</p>
            <p className="text-lg text-foreground leading-relaxed">
              Myanmar's trade compliance system is evolving. DICA sets the rules. Trade Net 2.0 digitizes the process. MACCS executes the clearance. Understand all three, and you'll never be caught off guard.
            </p>
          </div>
        </div>
      </section>

      {/* DICA Section */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{dica.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{dica.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dica.systems.map((system, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
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

      {/* Trade Net 2.0 Section */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{tradenet.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{tradenet.description}</p>
            </div>

            <div className="space-y-4">
              {tradenet.features.map((item, idx) => (
                <Card key={idx} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{item.feature}</CardTitle>
                      <div className="flex items-center gap-2">
                        {item.status === "Active" ? (
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

      {/* MACCS Section */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{maccs.title}</h2>
              <p className="text-lg text-muted-foreground mb-8">{maccs.description}</p>
            </div>

            <div className="space-y-6">
              {maccs.process.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    {idx < maccs.process.length - 1 && (
                      <div className="w-1 h-24 bg-secondary/30 mt-2"></div>
                    )}
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

      {/* Key Takeaways Section */}
      <section className="section-padding bg-card/50">
        <div className="container">
          <Card className="border-primary/50 neon-border">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Zap className="w-8 h-8 text-primary" />
                Key Takeaways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2">DICA Sets the Rules</h4>
                <p className="text-muted-foreground">Quotas, price controls, and licensing requirements. Know them before you trade.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Trade Net 2.0 Digitizes Everything</h4>
                <p className="text-muted-foreground">Online licensing, real-time tracking, automated processes. The system is moving digital. Move with it.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">MACCS Executes the Clearance</h4>
                <p className="text-muted-foreground">Five steps from documentation to delivery. Master this process, and you'll clear goods faster than your competitors.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Navigation Footer */}
      <section className="section-padding border-t border-border">
        <div className="container">
          <PageNavigation 
            nextHref="/market-pulse" 
            nextLabel="Market Pulse" 
          />
        </div>
      </section>
    </div>
  );
}
