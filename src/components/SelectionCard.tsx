import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
  isAd?: boolean;
}

export const SelectionCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  className,
  isAd = false
}: SelectionCardProps) => {
  return (
    <Button
      variant={isAd ? "warning" : "card"}
      size="card"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center space-y-2 p-6 animate-fade-in",
        isAd && "bg-gradient-accent border-accent/30",
        className
      )}
    >
      {icon && (
        <div className={cn(
          "text-2xl mb-2",
          isAd ? "text-accent-foreground" : "text-primary"
        )}>
          {icon}
        </div>
      )}
      <h3 className={cn(
        "font-semibold text-center",
        isAd ? "text-accent-foreground" : "text-foreground"
      )}>
        {title}
      </h3>
      {description && (
        <p className={cn(
          "text-sm text-center opacity-80",
          isAd ? "text-accent-foreground" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
      {isAd && (
        <span className="text-xs font-medium bg-accent-foreground/20 px-2 py-1 rounded-full">
          Ad
        </span>
      )}
    </Button>
  );
};