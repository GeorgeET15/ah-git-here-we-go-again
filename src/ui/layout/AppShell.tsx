import * as React from "react";
import { cn } from "@/lib/utils";
import { AppBar, AppBarProps } from "./AppBar";
import { ContentArea, ContentAreaProps } from "./ContentArea";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  appBarProps?: Partial<AppBarProps>;
  contentProps?: Partial<ContentAreaProps>;
  children: React.ReactNode;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ 
    className, 
    appBarProps, 
    contentProps, 
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col h-screen bg-background",
          className
        )}
        {...props}
      >
        <AppBar {...appBarProps} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <ContentArea {...contentProps}>
            {children}
          </ContentArea>
        </div>
      </div>
    );
  }
);
AppShell.displayName = "AppShell";

export { AppShell };

