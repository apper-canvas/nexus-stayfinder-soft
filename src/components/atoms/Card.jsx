import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({
  children,
  className,
  padding = "default",
  hover = false,
  ...props
}, ref) => {
  const baseStyles = "bg-white rounded-lg border border-gray-100 shadow-soft transition-all duration-200";
  
  const paddings = {
    none: "",
    sm: "p-3",
    default: "p-4",
    lg: "p-6",
    xl: "p-8"
  };
  
  const hoverStyles = hover ? "hover:shadow-medium hover:-translate-y-1" : "";

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        paddings[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;