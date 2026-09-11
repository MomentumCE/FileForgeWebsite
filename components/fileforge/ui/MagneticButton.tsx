"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

export function MagneticButton({
  children,
  className = "",
  wrapperClassName = "inline-block",
  href,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  href?: string;
  onClick?: () => void;
}) {
  const Tag = href ? "a" : "button";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={wrapperClassName}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={`inline-flex items-center justify-center transition-shadow hover:shadow-lg ${className}`}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
