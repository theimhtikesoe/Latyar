import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import PageNavigation from "@/components/PageNavigation";

export default function SampleProjects() {
  const caseStudy = {
    title: "PET Pellets တင်သွင်းခြင်း - လက်တွေ့ကုန်သွယ်မှုဥပမာ",
    description: "Polyethylene Terephthalate (PET) စေ့များကို ပလပ်စတစ်ဘူးများ၊ အထည်အလိပ်များနှင့် အခြားပလပ်စတစ်ပစ္စည်းများ ထုတ်လုပ်ရာတွင် အသုံးပြုသည်။",
    flow: [
      {
        stage: "ကုန်ပစ္စည်းပေးသွင်းသူ ရှာဖွေခြင်း",
        description: "အိန္ဒိယ သို့မဟုတ် ထိုင်းနိုင်ငံမှ PET pellet ထုတ်လုပ်သူများကို ရှာဖွေခြင်းနှင့် အကောင်းဆုံးအရည်အသွေးကို ရွေးချယ်ခြင်း။",
        duration: "၂-၃ ပတ်",
      },
      {
        stage: "ဈေးနှုန်းညှိနှိုင်းခြင်း",
        description: "ဈေးနှုန်းနှင့် အရောင်းအဝယ်ဆိုင်ရာ အချက်အလက်များကို ညှိနှိုင်းခြင်း။ အခွန်သက်သာခွင့်အတွက် လိုအပ်သော စာရွက်စာတမ်းများ ပြင်ဆင်ခြင်း။",
        duration: "၁-၂ ပတ်",
      },
      {
        stage: "လိုင်စင်လျှောက်ထားခြင်း",
        description: "DICA ၏ စည်းမျဉ်းများနှင့်အညီ Trade Net 2.0 မှတစ်ဆင့် အွန်လိုင်းလိုင်စင် လျှောက်ထားခြင်း။",
        duration: "၁ ပတ်",
      },
      {
        stage: "ငွေပေးချေမှုနှင့် သင်္ဘောတင်ခြင်း",
        description: "L/C သို့မဟုတ် TT စနစ်ဖြင့် ငွေပေးချေခြင်းနှင့် ကုန်ပစ္စည်းများကို သင်္ဘောတင်ပို့ခြင်း။",
        duration: "၂-၄ ပတ်",
      },
      {
        stage: "အကောက်ခွန်ရှင်းလင်းခြင်း",
        description: "MACCS စနစ်မှတစ်ဆင့် အကောက်ခွန်ရှင်းလင်းခြင်းနှင့် သတ်မှတ်ထားသော အခွန်များ ပေးချေခြင်း။",
        duration: "၃-၅ ရက်",
      },
      {
        stage: "ပို့ဆောင်ခြင်းနှင့် ဖြန့်ဖြူးခြင်း",
        description: "ကုန်ပစ္စည်းများကို စက်ရုံများ သို့မဟုတ် ဝယ်ယူသူများထံသို့ အရောက်ပို့ဆောင်ခြင်း။",
        duration: "၁-၂ ပတ်",
      },
    ],
  };

  const financials = [
    {
      metric: "အော်ဒါပမာဏ",
      value: "၅၀ မက်ထရစ်တန် (MT)",
      description: "ပထမဆုံးအကြိမ် မှာယူသည့် ပမာဏ",
    },
    {
      metric: "တစ်တန်ဈေးနှုန်း",
      value: "$၁,၂၀၀ (MT အလိုက်)",
      description: "အိန္ဒိယမှ FOB ဈေးနှုန်း",
    },
    {
      metric: "စုစုပေါင်း ကုန်ပစ္စည်းတန်ဖိုး",
      value: "$၆၀,၀၀၀",
      description: "ကုန်ပစ္စည်းအတွက် စုစုပေါင်းကုန်ကျစရိတ်",
    },
    {
      metric: "သယ်ယူပို့ဆောင်ခ",
      value: "$၃,၀၀၀",
      description: "အိန္ဒိယမှ ရန်ကုန်အထိ သယ်ယူခ",
    },
    {
      metric: "အကောက်ခွန် (၅%)",
      value: "$၃,၀၀၀",
      description: "၅% အကောက်ခွန်နှုန်းထားဖြင့် တွက်ချက်မှု",
    },
    {
      metric: "စုစုပေါင်း ရောက်ရှိတန်ဖိုး",
      value: "$၆၆,၀၀၀",
      description: "ရန်ကုန်သို့ အရောက် စုစုပေါင်းကုန်ကျစရိတ်",
    },
  ];

  const margins = [
    {
      scenario: "ပြည်တွင်းစက်ရုံများသို့ လက်ကားရောင်းချခြင်း",
      sellingPrice: "$၁,၃၅၀ (MT အလိုက်)",
      margin: "$၁၅၀ (MT အလိုက်)",
      totalMargin: "$၇,၅၀၀",
      description: "စက်ရုံကြီးများသို့ တိုက်ရိုက်ဖြန့်ဖြူးခြင်း",
    },
    {
      scenario: "အသေးစားလုပ်ငန်းရှင်များသို့ လက်လီရောင်းချခြင်း",
      sellingPrice: "$၁,၄၅၀ (MT အလိုက်)",
      margin: "$၂၅၀ (MT အလိုက်)",
      totalMargin: "$၁၂,၅၀၀",
      description: "လက်လီရောင်းချခြင်း - အမြတ်ပိုမိုရရှိနိုင်သည်",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="section-padding border-b border-border">
        <div className="container">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold neon-glow">နမူနာစီမံကိန်းများ</h1>
            <p className="text-xl text-muted-foreground">လက်တွေ့နယ်ပယ်မှ လေ့လာမှုမှတ်တမ်းများ</p>
            <p className="text-lg text-foreground leading-relaxed">
              သီအိုရီသည် အသုံးဝင်သော်လည်း လက်တွေ့လုပ်ဆောင်မှုသည်သာ အရာရာဖြစ်သည်။ ဤနေရာတွင် အိန္ဒိယမှ PET pellets တင်သွင်းခြင်း၊ မြန်မာ့စည်းမျဉ်းစနစ်များကို ဖြတ်ကျော်ခြင်းနှင့် အမြတ်အစွန်းရှိသော လုပ်ငန်းတစ်ခု တည်ဆောက်ခြင်းဆိုင်ရာ လက်တွေ့ဥပမာကို ဖော်ပြထားသည်။
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
              <h2 className="text-4xl font-bold mb-2">လုပ်ငန်းစဉ် အဆင့်ဆင့်</h2>
              <p className="text-lg text-muted-foreground">ကုန်ပစ္စည်းမှာယူခြင်းမှ ဝယ်ယူသူထံရောက်သည်အထိ</p>
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
              <h2 className="text-4xl font-bold mb-2">ဘဏ္ဍာရေးဆိုင်ရာ ခွဲခြမ်းစိတ်ဖြာမှု</h2>
              <p className="text-lg text-muted-foreground">မက်ထရစ်တန် ၅၀ အော်ဒါအတွက် ကုန်ကျစရိတ်ပုံစံ</p>
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
              <h2 className="text-4xl font-bold mb-2">အမြတ်အစွန်း ခန့်မှန်းချက်များ</h2>
              <p className="text-lg text-muted-foreground">ရောင်းချမှုဗျူဟာအလိုက် ရရှိနိုင်သော အကျိုးအမြတ်များ</p>
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
                        <p className="text-sm text-muted-foreground mb-1">ရောင်းဈေး</p>
                        <p className="text-2xl font-bold text-primary">{scenario.sellingPrice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">တစ်တန်အမြတ်</p>
                        <p className="text-2xl font-bold text-secondary">{scenario.margin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">စုစုပေါင်းအမြတ်</p>
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
                ဤလေ့လာမှုမှ ရရှိသော အဓိကသင်ခန်းစာများ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2">၁။ စည်းမျဉ်းလိုက်နာမှုသည် မဖြစ်မနေလိုအပ်သည်</h4>
                <p className="text-muted-foreground">လိုင်စင်မှန်ကန်စွာ ရရှိခြင်းက အချိန်နှင့် ငွေကြေးကို သက်သာစေသည်။ အမှားတစ်ခုကြောင့် ရှင်းလင်းရေးလုပ်ငန်းစဉ်များ ရက်သတ္တပတ်ပေါင်းများစွာ ကြန့်ကြာသွားနိုင်သည်။</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">၂။ အချိန်ကို စီမံခန့်ခွဲခြင်း</h4>
                <p className="text-muted-foreground">လုပ်ငန်းစဉ်တစ်ခုလုံးသည် ၈ ပတ်မှ ၁၂ ပတ်အထိ ကြာမြင့်နိုင်သည်။ ထို့ကြောင့် ကြိုတင်စီမံထားပါ။ အဆင့်တစ်ခုတွင် ကြန့်ကြာမှုသည် လုပ်ငန်းစဉ်တစ်ခုလုံးကို ထိခိုက်စေနိုင်သည်။</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">၃။ အကျိုးအမြတ်နှင့် ရင်းနှီးမြှုပ်နှံမှု</h4>
                <p className="text-muted-foreground">$၆၆,၀၀၀ ရင်းနှီးမြှုပ်နှံမှုအပေါ် $၇,၅၀၀-$၁၂,၅၀၀ အထိ အမြတ်ရရှိနိုင်သည်။ ၎င်းသည် ၁၁-၁၉% ROI ဖြစ်သည်။ တစ်နှစ်လျှင် ၅ ကြိမ်မှ ၁၀ ကြိမ်အထိ တင်သွင်းနိုင်ပါက ခိုင်မာသော လုပ်ငန်းတစ်ခု ဖြစ်လာပါလိမ့်မည်။</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2">၄။ ဆက်ဆံရေး တည်ဆောက်ခြင်း</h4>
                <p className="text-muted-foreground">ကုန်ပစ္စည်းပေးသွင်းသူ၊ ပို့ဆောင်ရေးလုပ်ငန်း၊ အကောက်ခွန်ပွဲစားနှင့် ဝယ်ယူသူများ—၎င်းတို့အားလုံးနှင့် ခိုင်မာသော ဆက်ဆံရေး တည်ဆောက်ပါ။ ၎င်းတို့သည် အခက်အခဲများကို ကျော်လွှားရန်နှင့် အခွင့်အလမ်းသစ်များ ရှာဖွေရန် ကူညီပေးပါလိမ့်မည်။</p>
              </div>
            </CardContent>
          </Card>

          <PageNavigation />
        </div>
      </section>
    </div>
  );
}
