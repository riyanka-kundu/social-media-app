import { cn } from "@/lib/utils";
import { type LucideIcon, PackageOpen } from "lucide-react";

interface NoDataProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

const NoData = ({
  title = "No Data Found",
  description = "There is no data to display at this time.",
  icon: Icon = PackageOpen,
  className,
  children,
}: NoDataProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center animate-in fade-in-50 zoom-in-95 duration-500",
        className,
      )}
    >
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <Icon className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 mx-auto">
        {description}
      </p>
      {children}
    </div>
  );
};

export default NoData;
