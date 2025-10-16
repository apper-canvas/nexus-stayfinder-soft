import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ message, onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <div className="bg-error/10 rounded-full p-4 mb-6">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message || "We encountered an error while loading your data. Please try again."}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If the problem persists, please{" "}
          <a href="#" className="text-primary hover:text-primary/80 font-medium">
            contact our support team
          </a>
        </p>
      </div>
    </div>
  );
};

export default Error;