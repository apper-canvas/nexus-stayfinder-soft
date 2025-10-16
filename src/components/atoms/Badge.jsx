import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  variant = "default", 
  size = "md",
  className 
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    confirmed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    cancelled: "bg-error/10 text-error"
  };
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };

  return (
    <span className={cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;