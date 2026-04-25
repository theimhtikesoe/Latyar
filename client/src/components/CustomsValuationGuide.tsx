import { useState } from "react";
import {
  Anchor,
  Calculator,
  Coins,
  KeyRound,
  Package,
  Receipt,
  Truck,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

function toCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseAmount(value: string) {
  const normalized = value.replace(/,/g, "").trim();
  if (!normalized) {
    return 0;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

type AmountFieldProps = {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function AmountField({ label, description, value, onChange, placeholder }: AmountFieldProps) {
  return (
    <label className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <Input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      <p className="text-sm text-muted-foreground">{description}</p>
    </label>
  );
}

export default function CustomsValuationGuide() {
  const { language } = useLanguage();
  const isMyanmar = language === "my";

  const [papp, setPapp] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [packing, setPacking] = useState("");
  const [assists, setAssists] = useState("");
  const [royalties, setRoyalties] = useState("");
  const [installation, setInstallation] = useState("");
  const [localFreight, setLocalFreight] = useState("");
  const [taxes, setTaxes] = useState("");
  const [interest, setInterest] = useState("");

  const additionTotal =
    parseAmount(brokerage) +
    parseAmount(packing) +
    parseAmount(assists) +
    parseAmount(royalties);
  const deductionTotal =
    parseAmount(installation) +
    parseAmount(localFreight) +
    parseAmount(taxes) +
    parseAmount(interest);
  const assessableValue = parseAmount(papp) + additionTotal - deductionTotal;

  const copy = {
    eyebrow: isMyanmar ? "Customs Valuation Guide" : "Customs Valuation Guide",
    title: isMyanmar ? "Assessable Value (CIF) ကို WTO စံနှုန်းနဲ့ တွက်ချက်ပါ" : "Calculate Assessable Value (CIF) with WTO logic",
    description: isMyanmar
      ? "PAPP ကို အခြေခံပြီး ဆိပ်ကမ်းမရောက်ခင် စရိတ်ကို ပေါင်း၊ ဆိပ်ကမ်းရောက်ပြီးနောက် စရိတ်ကို နှုတ်ကာ Myanmar customs valuation logic ကို နားလည်အောင် ဖော်ပြထားပါတယ်။"
      : "Understand Myanmar customs valuation by starting from PAPP, adding costs incurred before the port, and deducting costs incurred after arrival.",
    formulaLabel: isMyanmar ? "Formula" : "Formula",
    formulaNote: isMyanmar
      ? "Assessable Value ကို Customs Value လို့လည်း ခေါ်ပြီး အခွန်ကောက်ခံရန် သတ်မှတ်ထားတဲ့ CIF တန်ဖိုးကို ဆိုလိုပါတယ်။"
      : "Assessable Value is the customs value used to determine the taxable CIF amount.",
    hookTitle: isMyanmar ? "လျှို့ဝှက်ချက်" : "The Secret",
    beforePort: isMyanmar ? "ဆိပ်ကမ်း မရောက်ခင် ကုန်ကျစရိတ် = ပေါင်းထည့်" : "Costs BEFORE port = ADD",
    afterPort: isMyanmar ? "ဆိပ်ကမ်း ရောက်ပြီးနောက် ကုန်ကျစရိတ် = နှုတ်" : "Costs AFTER port = DEDUCT",
    principle: isMyanmar
      ? 'Customs valuation ရဲ့ အဓိကရည်ရွယ်ချက်က "ဆိပ်ကမ်း သို့မဟုတ် နယ်စပ်ဂိတ်မှာ ရှိနေတဲ့ ပစ္စည်းရဲ့ တန်ဖိုးအစစ်အမှန်" ကိုပဲ ဖော်ထုတ်ချင်တာပါ။'
      : 'The core principle is to capture the item’s true value at the port or border, not the costs that happen later inland.',
    pappTitle: "PAPP",
    pappSubtitle: isMyanmar ? "Price Actually Paid or Payable" : "Price Actually Paid or Payable",
    pappBody: isMyanmar
      ? "ဝယ်သူက ရောင်းသူကို တိုက်ရိုက်ဖြစ်စေ သွယ်ဝိုက်၍ဖြစ်စေ တကယ်ပေးထားတဲ့ဈေး သို့မဟုတ် ပေးရန်ရှိတဲ့ဈေး ဖြစ်ပြီး transaction value ရဲ့ အခြေခံဖြစ်ပါတယ်။"
      : "The actual price paid or payable by the buyer to the seller, directly or indirectly. This is the starting point of transaction value.",
    additionsTitle: isMyanmar ? "Additions" : "Additions",
    additionsSubtitle: isMyanmar ? "WTO Article 8 အရ ပေါင်းထည့်ရမယ့် စရိတ်များ" : "Costs to add under WTO Article 8",
    additionsBody: isMyanmar
      ? "PAPP ထဲမှာ မပါသေးတဲ့ ဆိပ်ကမ်းမရောက်ခင် စရိတ်တွေကို customs value ထဲ ထည့်သွင်းပေါင်းရပါမယ်။"
      : "If these pre-port costs are not already inside PAPP, they must be added into the customs value.",
    deductionsTitle: isMyanmar ? "Deductions" : "Deductions",
    deductionsSubtitle: isMyanmar ? "ဆိပ်ကမ်းရောက်ပြီးမှ ဖြစ်ပေါ်တဲ့ စရိတ်များ" : "Costs that happen after reaching the port",
    deductionsBody: isMyanmar
      ? "မြန်မာနိုင်ငံအတွင်း တပ်ဆင်ခ၊ ပြည်တွင်းသယ်ယူပို့ဆောင်ခ၊ taxes နဲ့ interest လို စရိတ်များကို ပြန်နှုတ်ပေးရပါမယ်။"
      : "Installation, inland freight, taxes, and interest that occur after arrival should be deducted back out.",
    calculatorTitle: isMyanmar ? "Assessable Value Calculator" : "Assessable Value Calculator",
    calculatorDesc: isMyanmar
      ? "အောက်က field များကို ဖြည့်သွင်းလိုက်တာနဲ့ Assessable Value (CIF) ကို real-time နဲ့ ပြပေးပါမယ်။"
      : "Enter the values below and the Assessable Value (CIF) updates in real time.",
    pappLabel: isMyanmar ? "PAPP တန်ဖိုး" : "PAPP value",
    pappPlaceholder: "0.00",
    additionsSummary: isMyanmar ? "စုစုပေါင်း Additions" : "Total additions",
    deductionsSummary: isMyanmar ? "စုစုပေါင်း Deductions" : "Total deductions",
    resultLabel: isMyanmar ? "Assessable Value (CIF)" : "Assessable Value (CIF)",
    resultCaption: isMyanmar
      ? "Formula: (PAPP + Additions) - Deductions"
      : "Formula: (PAPP + Additions) - Deductions",
    brokerage: isMyanmar ? "Brokerage & Commissions" : "Brokerage & Commissions",
    brokerageDesc: isMyanmar ? "ဝယ်ယူသူဘက်က ပေးရတဲ့ commission စရိတ်" : "Commission or brokerage paid by the buyer",
    packing: isMyanmar ? "Packing & Containers" : "Packing & Containers",
    packingDesc: isMyanmar ? "ထုပ်ပိုးမှုနဲ့ container ဆိုင်ရာ စရိတ်" : "Packing and container-related charges",
    assists: "Assists",
    assistsDesc: isMyanmar
      ? "အခမဲ့ သို့မဟုတ် ဈေးလျှော့ပေးထားတဲ့ ကုန်ကြမ်း၊ mould, design input များ"
      : "Buyer-supplied materials, molds, or design support given free or below cost",
    royalties: isMyanmar ? "Royalties & License Fees" : "Royalties & License Fees",
    royaltiesDesc: isMyanmar ? "မူပိုင်ခွင့်ကြေးနဲ့ လိုင်စင်ကြေး" : "Royalties or licensing fees tied to the goods",
    installation: isMyanmar ? "Installation" : "Installation",
    installationDesc: isMyanmar ? "မြန်မာနိုင်ငံအတွင်း တပ်ဆင်ခ" : "Post-arrival installation costs in Myanmar",
    localFreight: isMyanmar ? "Local Freight" : "Local Freight",
    localFreightDesc: isMyanmar ? "ပြည်တွင်း သယ်ယူပို့ဆောင်ခ" : "Inland transport after the port",
    taxes: isMyanmar ? "Duties / Taxes" : "Duties / Taxes",
    taxesDesc: isMyanmar ? "ဆိပ်ကမ်းရောက်ပြီးနောက် ဆောင်ရတဲ့ အခွန်အခများ" : "Duties or taxes charged after arrival",
    interest: isMyanmar ? "Interest" : "Interest",
    interestDesc: isMyanmar ? "ငွေကြေးဆိုင်ရာ အတိုးနှုန်း စရိတ်" : "Financing or interest charges",
  };

  const explainerCards = [
    {
      title: copy.pappTitle,
      subtitle: copy.pappSubtitle,
      body: copy.pappBody,
      accent: "border-primary/40 bg-primary/5",
      icon: Coins,
    },
    {
      title: copy.additionsTitle,
      subtitle: copy.additionsSubtitle,
      body: copy.additionsBody,
      accent: "border-secondary/40 bg-secondary/5",
      icon: Anchor,
    },
    {
      title: copy.deductionsTitle,
      subtitle: copy.deductionsSubtitle,
      body: copy.deductionsBody,
      accent: "border-accent/40 bg-accent/5",
      icon: Truck,
    },
  ];

  const additionFields = [
    {
      icon: Coins,
      label: copy.brokerage,
      description: copy.brokerageDesc,
      value: brokerage,
      onChange: setBrokerage,
    },
    {
      icon: Package,
      label: copy.packing,
      description: copy.packingDesc,
      value: packing,
      onChange: setPacking,
    },
    {
      icon: Wrench,
      label: copy.assists,
      description: copy.assistsDesc,
      value: assists,
      onChange: setAssists,
    },
    {
      icon: KeyRound,
      label: copy.royalties,
      description: copy.royaltiesDesc,
      value: royalties,
      onChange: setRoyalties,
    },
  ];

  const deductionFields = [
    {
      icon: Wrench,
      label: copy.installation,
      description: copy.installationDesc,
      value: installation,
      onChange: setInstallation,
    },
    {
      icon: Truck,
      label: copy.localFreight,
      description: copy.localFreightDesc,
      value: localFreight,
      onChange: setLocalFreight,
    },
    {
      icon: Receipt,
      label: copy.taxes,
      description: copy.taxesDesc,
      value: taxes,
      onChange: setTaxes,
    },
    {
      icon: Coins,
      label: copy.interest,
      description: copy.interestDesc,
      value: interest,
      onChange: setInterest,
    },
  ];

  return (
    <section className="section-padding bg-card/40">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{copy.eyebrow}</p>
            <h2 className="text-4xl md:text-5xl font-bold">{copy.title}</h2>
            <p className="mx-auto max-w-3xl text-muted-foreground">{copy.description}</p>
          </div>

          <Card className="border-primary/40 bg-background/70 neon-border">
            <CardContent className="grid gap-6 px-6 py-6 md:grid-cols-[1.35fr_0.95fr]">
              <div className="space-y-4">
                <div className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {copy.formulaLabel}
                </div>
                <div className="rounded-2xl border border-border/70 bg-card/70 p-5">
                  <p className="font-mono text-lg text-foreground md:text-2xl">
                    Assessable Value (CIF) = (PAPP + Additions) - Deductions
                  </p>
                </div>
                <p className="text-muted-foreground">{copy.formulaNote}</p>
              </div>

              <div className="grid gap-4 md:grid-rows-2">
                <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">{copy.hookTitle}</p>
                  <p className="mt-3 text-lg font-semibold text-foreground">{copy.beforePort}</p>
                </div>
                <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
                  <p className="text-lg font-semibold text-foreground">{copy.afterPort}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{copy.principle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {explainerCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className={`border-border/70 ${card.accent}`}>
                  <CardHeader className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-background/70 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{card.title}</CardTitle>
                      <CardDescription className="text-sm uppercase tracking-[0.16em]">{card.subtitle}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{card.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className="border-primary/30 bg-background/70">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Calculator className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-2xl md:text-3xl">{copy.calculatorTitle}</CardTitle>
                    <CardDescription>{copy.calculatorDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <AmountField
                  label={copy.pappLabel}
                  description={copy.pappBody}
                  value={papp}
                  onChange={setPapp}
                  placeholder={copy.pappPlaceholder}
                />

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="space-y-4 rounded-2xl border border-secondary/30 bg-secondary/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{copy.additionsTitle}</h3>
                        <p className="text-sm text-muted-foreground">{copy.beforePort}</p>
                      </div>
                      <span className="rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
                        + {toCurrency(additionTotal)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {additionFields.map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.label} className="rounded-xl border border-border/60 bg-background/50 p-4">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{field.label}</p>
                              </div>
                            </div>
                            <AmountField
                              label={field.label}
                              description={field.description}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="0.00"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-accent/30 bg-accent/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{copy.deductionsTitle}</h3>
                        <p className="text-sm text-muted-foreground">{copy.afterPort}</p>
                      </div>
                      <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                        - {toCurrency(deductionTotal)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {deductionFields.map((field) => {
                        const Icon = field.icon;
                        return (
                          <div key={field.label} className="rounded-xl border border-border/60 bg-background/50 p-4">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground">{field.label}</p>
                              </div>
                            </div>
                            <AmountField
                              label={field.label}
                              description={field.description}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="0.00"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card className="border-primary/40 bg-primary/5">
                <CardHeader>
                  <CardTitle>{copy.resultLabel}</CardTitle>
                  <CardDescription>{copy.resultCaption}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-2xl border border-primary/30 bg-background/70 p-6">
                    <p className="text-sm uppercase tracking-[0.18em] text-primary">{copy.resultLabel}</p>
                    <p className="mt-3 text-4xl font-bold text-foreground md:text-5xl">{toCurrency(assessableValue)}</p>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                      <span>{copy.pappLabel}</span>
                      <span className="font-medium text-foreground">{toCurrency(parseAmount(papp))}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                      <span>{copy.additionsSummary}</span>
                      <span className="font-medium text-secondary">+ {toCurrency(additionTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                      <span>{copy.deductionsSummary}</span>
                      <span className="font-medium text-accent">- {toCurrency(deductionTotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-2xl">{copy.hookTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
                    <p className="font-semibold text-secondary">{copy.beforePort}</p>
                  </div>
                  <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
                    <p className="font-semibold text-accent">{copy.afterPort}</p>
                  </div>
                  <p className="text-muted-foreground">{copy.principle}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
