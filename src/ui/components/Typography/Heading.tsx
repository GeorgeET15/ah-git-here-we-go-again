import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, as, ...props }, ref) => {
    const Component = as || (`h${level}` as const);
    
    const sizeClasses = {
      1: "text-4xl font-bold",
      2: "text-3xl font-bold",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
      5: "text-lg font-semibold",
      6: "text-base font-semibold",
    };

    return (
      <Component
        ref={ref}
        className={cn(sizeClasses[level], className)}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading };

