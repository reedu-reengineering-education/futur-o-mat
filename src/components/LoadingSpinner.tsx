/**
 * LoadingSpinner Component
 *
 * Reusable loading spinner component with customizable size and color
 */

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-brand-primary/30 border-t-brand-primary rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-4 text-lg font-medium text-brand-primary">{message}</p>
      )}
    </div>
  );
}
