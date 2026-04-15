import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface PageNavigationProps {
  prevHref?: string;
  prevLabel?: string;
  nextHref?: string;
  nextLabel?: string;
}

export default function PageNavigation({
  prevHref = "/",
  prevLabel = "ပင်မစာမျက်နှာသို့",
  nextHref,
  nextLabel,
}: PageNavigationProps) {
  const [, navigate] = useLocation();

  return (
    <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 py-8 border-t border-border">
      <Button
        variant="ghost"
        className="group text-muted-foreground hover:text-primary"
        onClick={() => navigate(prevHref)}
      >
        <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {prevLabel}
      </Button>

      {nextHref && nextLabel && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">နောက်ထပ်ကဏ္ဍ:</span>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 group"
            onClick={() => navigate(nextHref)}
          >
            {nextLabel}
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
