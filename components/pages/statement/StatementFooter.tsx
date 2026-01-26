import { format } from "date-fns/format";
import { ar } from "date-fns/locale/ar";

export default function StatementFooter() {
  return (
    <div className="hidden print:flex flex-col items-center mt-12 gap-4 border-t-2 pt-8">
      <div className="text-center">
        <p className="text-xl font-black text-primary">
          نظام المحاسبة المتكامل
        </p>
        <p className="text-sm font-bold text-muted-foreground mt-1">
          تم استخراج هذا الكشف بتاريخ:{" "}
          {format(new Date(), "PPPP", { locale: ar })}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-20 mt-10 w-full px-20">
        <div className="text-center border-t-2 border-dashed pt-4">
          <p className="font-black">توقيع المحاسب</p>
        </div>
        <div className="text-center border-t-2 border-dashed pt-4">
          <p className="font-black">ختم الشركة</p>
        </div>
      </div>
    </div>
  );
}
