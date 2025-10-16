import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No results found",
  description = "Try adjusting your search criteria or explore other options.",
  action,
  actionText = "Start Over",
  icon = "Search",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full p-6 mb-8">
        <ApperIcon name={icon} className="w-16 h-16 text-primary" />
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <button
            onClick={action}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-200"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
        {[
          { icon: "MapPin", text: "Explore destinations" },
          { icon: "Calendar", text: "Flexible dates" },
          { icon: "Filter", text: "Adjust filters" }
        ].map((suggestion, index) => (
          <div key={index} className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <ApperIcon name={suggestion.icon} className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600">{suggestion.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Empty;