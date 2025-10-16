import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "md",
  children,
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  const variants = {
    primary: "btn-primary text-white focus:ring-accent/20",
    secondary: "btn-secondary bg-transparent focus:ring-primary/20",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/20",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray/20"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
    xl: "px-8 py-4 text-lg gap-3"
  };

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <ApperIcon name="Loader2" className={`animate-spin`} size={iconSize[size]} />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ApperIcon name={icon} size={iconSize[size]} />
          )}
        </>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;