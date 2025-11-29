import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Surface } from "../Surface";

export interface ErrorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

const ErrorBanner = React.forwardRef<HTMLDivElement, ErrorBannerProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <Surface
        ref={ref}
        variant="accent"
        elevation="sm"
        className={cn(
          "p-4 bg-error/10 border-error/30 animate-fade-in",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          {icon || <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />}
          <div className="text-error text-sm">{children}</div>
        </div>
      </Surface>
    );
  }
);
ErrorBanner.displayName = "ErrorBanner";

export { ErrorBanner };

