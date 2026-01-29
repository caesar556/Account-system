"use client";

import { useState } from "react";
import ObligationHeader from "./ObligationHeader";
import ObligationStats from "./ObligationStats";
import ObligationTable from "./ObligationTable";

export default function ObligationsMain() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "OPEN" | "DONE" | "overdue">("all");

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <ObligationHeader open={open} setOpen={setOpen} />
      <ObligationStats filter={filter} setFilter={setFilter} />
      <ObligationTable filter={filter} />
    </div>
  );
}
