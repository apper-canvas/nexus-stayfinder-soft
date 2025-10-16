import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({
  className,
  type = "text",
  label,
  placeholder,
  error,
  icon,
  iconPosition = "left",
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={cn(
            "block w-full px-3 py-2 border border-gray-200 rounded-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-error focus:ring-error focus:border-error",
            className
          )}
          placeholder={placeholder}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;