import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContentAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const ContentArea = React.forwardRef<HTMLDivElement, ContentAreaProps>(
  (
    { className, maxWidth = "full", padding = "md", children, ...props },
    ref
  ) => {
    const maxWidthClasses = {
      sm: "max-w-screen-sm",
      md: "max-w-screen-md",
      lg: "max-w-screen-lg",
      xl: "max-w-screen-xl",
      "2xl": "max-w-screen-2xl",
      full: "max-w-full",
    };

    const paddingClasses = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto",
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          "mx-auto w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContentArea.displayName = "ContentArea";

export { ContentArea };
