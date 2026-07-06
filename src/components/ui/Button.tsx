import { cn } from "@/src/lib/cn";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                primary: "bg-primary text-primary-content font-bold cursor-pointer hover:opacity-90 focus-visible:ring-primary",
                secondary: "bg-secondary text-secondary-content font-bold cursor-pointer hover:opacity-90 focus-visible:ring-secondary",
                outline: "border border-base-300 bg-transparent font-bold cursor-pointer hover:bg-base-200 text-base-content",
                ghost: "hover:bg-base-200 data-[state=open]:bg-transparent text-base-content font-bold cursor-pointer",
            },
            size: {
                sm: "h-9 px-3 rounded-md text-xs",
                md: "h-10 px-4 py-2",
                lg: "h-11 px-8 rounded-md",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0112-7.25V4M20 12a8 8 0 01-8 8v-2.5" />
                        </svg>
                        Loading...
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };