"use client";

import { motion, type Variants } from "framer-motion";

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};

export function AnimatedHeadline({
  text,
  className = "",
  as = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "p";
}) {
  const words = text.split(" ");
  const Tag = as === "p" ? motion.p : motion.h1;

  return (
    <Tag
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.25em]">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
