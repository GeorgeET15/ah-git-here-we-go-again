import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Surface } from "../Surface";

export interface InfoBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

const InfoBanner = React.forwardRef<HTMLDivElement, InfoBannerProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        variant="muted"
        elevation="sm"
        className={cn(
          "p-4 bg-primary/10 border-primary/30 animate-fade-in",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon || <Info className="w-4 h-4 text-primary flex-shrink-0" />}
          <div className="text-foreground text-sm">{children}</div>
        </div>
      </Surface>
    );
  }
);
InfoBanner.displayName = "InfoBanner";

export { InfoBanner };

