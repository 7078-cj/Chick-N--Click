import React from "react";

const useCaseVariants = {
  signin: "bg-orange-400 text-white hover:bg-amber-800",
  signup: "bg-orange-400 text-white hover:bg-amber-800",
  order: "bg-orange-400 text-white hover:bg-orange-500",
  checkout: "bg-yellow-500 text-white hover:bg-yellow-600",
  remove: "bg-red-500 text-white hover:bg-red-600",
  confirm: "bg-orange-500 text-white hover:bg-orange-600",
  link: "bg-yellow-400 text-white hover:bg-yellow-500",
  verify: "bg-yellow-400 text-white hover:bg-yellow-500",
  menu: "bg-orange-500 text-white hover:bg-orange-600",
  outline: " bg-orange-400  text-white hover:bg-amber-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const roundness = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export default function AppButton({
  children,
  useCase = "order",
  size = "md",
  icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  roundedType = "full", // default rounded-full
  bgColor,
  hoverColor,
  ...props
}) {
  // If user provides custom bgColor/hoverColor, override variant
  const customColors =
    bgColor || hoverColor
      ? `${bgColor || ""} ${hoverColor || ""} text-white`
      : useCaseVariants[useCase] || useCaseVariants.order;

  const baseClasses = `
    flex items-center justify-center gap-2 font-semibold transition-all duration-200
    ${customColors}
    ${sizes[size] || sizes.md}
    ${fullWidth ? "w-full" : ""}
    ${roundness[roundedType] || roundness.full}
    ${className}
  `;

  return (
    <button className={baseClasses} {...props}>
      {icon && iconPosition === "left" && React.createElement(icon, { size: 18 })}
      {children}
      {icon && iconPosition === "right" && React.createElement(icon, { size: 18 })}
    </button>
  );
}
