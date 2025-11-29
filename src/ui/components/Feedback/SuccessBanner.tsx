import * as React from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Surface } from "../Surface";

export interface SuccessBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

const SuccessBanner = React.forwardRef<HTMLDivElement, SuccessBannerProps>(
  ({ className, icon, children, ...props }, ref) => {
    // If icon is explicitly null, don't show icon container
    const showIcon = icon !== null;
    const iconToShow = icon !== undefined ? icon : <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />;
    
    return (
      <Surface
        ref={ref}
        variant="accent"
        elevation="sm"
        className={cn(
          "p-4 bg-success/10 border-success/30 animate-fade-in",
          className
        )}
        {...props}
      >
        {showIcon ? (
          <div className="flex items-center gap-2">
            {iconToShow}
            <div className="text-success text-sm">{children}</div>
          </div>
        ) : (
          <div className="text-success text-sm">{children}</div>
        )}
      </Surface>
    );
  }
);
SuccessBanner.displayName = "SuccessBanner";

export { SuccessBanner };

