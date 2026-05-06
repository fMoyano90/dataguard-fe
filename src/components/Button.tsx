"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

export function Button({
  variant = "primary",
  icon,
  fullWidth = false,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-3 text-body-lg";
  const width = fullWidth ? "w-full" : "";
  return (
    <button
      className={`${base} ${variantClass[variant]} ${width} ${className}`.trim()}
      type={type}
      {...rest}
    >
      {icon ? <span aria-hidden className="text-lg leading-none">{icon}</span> : null}
      {children}
    </button>
  );
}
