import { useState } from "react";
import { LeadForm } from "./LeadForm";
import { Button } from "@/components/ui/button";
const NEEDS = ["Купить", "Продать", "Ипотека"];

export function FinalForm() {
  const [need, setNeed] = useState("Купить");
  return (
    <LeadForm title="Оставьте заявку" type={need === "Купить" ? "selection" : need === "Продать" ? "valuation" : "mortgage"} details={{ task: need }} extra={<fieldset>
        <legend className="mb-2 text-xs font-semibold text-muted-foreground">Что нужно</legend>
        <div className="grid grid-cols-3 gap-2">
          {NEEDS.map((n) => (
            <Button type="button" key={n} onClick={() => setNeed(n)} aria-pressed={need === n}
              className={`h-11 rounded-xl text-sm font-semibold transition ${need === n ? "bg-primary text-primary-foreground" : "border border-input bg-background text-primary"}`}>
              {n}
            </Button>
          ))}
        </div>
      </fieldset>} />
  );
}
