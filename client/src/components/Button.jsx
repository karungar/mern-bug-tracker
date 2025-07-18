function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  // Define base classes
  const baseClasses = "font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
  // Define variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400",
    outline: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300"
  };
  
  // Define size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-2.5 text-lg"
  };
  
  // Define disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;