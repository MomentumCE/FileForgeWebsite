"use client";

import { motion } from "framer-motion";

export function PaperToDigital() {
  return (
    <div className="absolute inset-0 mesh-gradient overflow-hidden">
      <svg
        viewBox="0 0 600 450"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="scanBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="paperShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f5f2ec" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="3" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.18" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* PAPER stack */}
        <g transform="translate(45, 175)" filter="url(#softShadow)">
          {[4, 3, 2, 1, 0].map((i) => (
            <motion.rect
              key={i}
              x={i * 2}
              y={i * -3}
              width="90"
              height="120"
              rx="4"
              fill="url(#paperShade)"
              stroke="rgba(120,113,108,0.18)"
              strokeWidth="1"
              initial={{ opacity: 0, y: i * -3 + 10 }}
              animate={{ opacity: 1, y: i * -3 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
            />
          ))}
          {/* Top paper content lines */}
          <g transform="translate(10, -15)">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x="0"
                y={i * 12 + 6}
                width={i === 0 ? 55 : i === 4 ? 40 : 72}
                height={i === 0 ? 5 : 2.5}
                rx="1.5"
                fill={i === 0 ? "#1c1917" : "rgba(120,113,108,0.35)"}
                opacity={i === 0 ? 0.7 : 1}
              />
            ))}
          </g>
        </g>

        {/* Label: PAPER */}
        <g transform="translate(95, 355)">
          <text
            textAnchor="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="10"
            fontWeight="500"
            fill="#78716c"
            letterSpacing="1.5"
          >
            PAPER
          </text>
        </g>

        {/* SCAN + OCR - scanner */}
        <g transform="translate(195, 153)">
          {/* Body */}
          <rect
            x="0"
            y="32"
            width="80"
            height="80"
            rx="10"
            fill="#1c1917"
            opacity="0.92"
          />
          {/* Glass */}
          <rect
            x="8"
            y="42"
            width="64"
            height="48"
            rx="3"
            fill="#0a0907"
          />
          {/* LED */}
          <circle cx="68" cy="106" r="2" fill="#d97706">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Scanning beam */}
          <motion.rect
            x="10"
            width="60"
            height="6"
            rx="1.5"
            fill="url(#scanBeam)"
            initial={{ y: 42 }}
            animate={{ y: [42, 84, 42] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Intake paper - fed in from left */}
          <motion.rect
            x="-24"
            y="71"
            width="24"
            height="1.5"
            rx="0.75"
            fill="rgba(120,113,108,0.4)"
            animate={{ x: [-24, 8] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Output data dots - emit to the right */}
          <motion.circle
            cx="80"
            cy="68"
            r="1.8"
            fill="#d97706"
            animate={{
              cx: [80, 128],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="80"
            cy="76"
            r="1.3"
            fill="#d97706"
            animate={{
              cx: [80, 128],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </g>

        {/* Label: SCAN + OCR */}
        <g transform="translate(235, 355)">
          <text
            textAnchor="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="10"
            fontWeight="500"
            fill="#78716c"
            letterSpacing="1.5"
          >
            SCAN + OCR
          </text>
        </g>

        {/* RENAMING + SORTING - organized file rows */}
        <g transform="translate(330, 186)" filter="url(#softShadow)">
          {/* Output dots - emit to organized files on the right */}
          <motion.circle
            cx="80"
            cy="35"
            r="1.8"
            fill="#d97706"
            animate={{
              cx: [80, 135],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="80"
            cy="43"
            r="1.3"
            fill="#d97706"
            animate={{
              cx: [80, 135],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
          {[
            { y: 0, hl: false, nameW: 42, subW: 26 },
            { y: 28, hl: true, nameW: 50, subW: 34 },
            { y: 56, hl: false, nameW: 38, subW: 28 },
          ].map((row, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
            >
              <rect
                x="0"
                y={row.y}
                width="80"
                height="22"
                rx="3"
                fill="#ffffff"
                stroke={
                  row.hl
                    ? "rgba(217,119,6,0.35)"
                    : "rgba(120,113,108,0.18)"
                }
                strokeWidth="1"
              />
              {/* File icon */}
              <rect
                x="6"
                y={row.y + 5}
                width="10"
                height="12"
                rx="1"
                fill={
                  row.hl
                    ? "rgba(217,119,6,0.18)"
                    : "rgba(120,113,108,0.12)"
                }
                stroke={
                  row.hl
                    ? "rgba(217,119,6,0.4)"
                    : "rgba(120,113,108,0.25)"
                }
                strokeWidth="0.5"
              />
              <rect
                x="8"
                y={row.y + 8}
                width="5"
                height="0.8"
                rx="0.4"
                fill="rgba(120,113,108,0.5)"
              />
              <rect
                x="8"
                y={row.y + 10}
                width="4"
                height="0.8"
                rx="0.4"
                fill="rgba(120,113,108,0.5)"
              />
              {/* Filename */}
              <rect
                x="22"
                y={row.y + 7}
                width={row.nameW}
                height="2.2"
                rx="1"
                fill={row.hl ? "#d97706" : "rgba(28,25,23,0.8)"}
              />
              {/* Sub / meta */}
              <rect
                x="22"
                y={row.y + 12}
                width={row.subW}
                height="1.5"
                rx="0.75"
                fill="rgba(120,113,108,0.45)"
              />
            </motion.g>
          ))}
        </g>

        {/* Label: RENAMING + SORTING */}
        <g transform="translate(370, 355)">
          <text
            textAnchor="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="10"
            fontWeight="500"
            fill="#78716c"
            letterSpacing="1.5"
          >
            RENAME + SORT
          </text>
        </g>

        {/* ORGANIZED FILES - indexed digital document */}
        <g transform="translate(465, 160)" filter="url(#softShadow)">
          <rect
            x="0"
            y="0"
            width="100"
            height="130"
            rx="6"
            fill="#ffffff"
            stroke="rgba(217,119,6,0.3)"
            strokeWidth="1"
          />
          {/* Window chrome */}
          <rect x="0" y="0" width="100" height="16" rx="6" fill="#f5f2ec" />
          <rect x="0" y="10" width="100" height="6" fill="#f5f2ec" />
          <circle cx="8" cy="8" r="1.8" fill="#FF5F57" />
          <circle cx="16" cy="8" r="1.8" fill="#FFBD2E" />
          <circle cx="24" cy="8" r="1.8" fill="#28CA42" />

          {/* Search bar */}
          <rect
            x="8"
            y="22"
            width="84"
            height="10"
            rx="2"
            fill="#faf9f7"
            stroke="rgba(120,113,108,0.2)"
            strokeWidth="0.75"
          />
          <circle
            cx="13"
            cy="27"
            r="2"
            fill="none"
            stroke="#78716c"
            strokeWidth="0.8"
          />
          <line
            x1="14.5"
            y1="28.5"
            x2="16"
            y2="30"
            stroke="#78716c"
            strokeWidth="0.8"
          />

          {/* Structured data rows with highlights */}
          <g transform="translate(8, 42)">
            {[
              { y: 0, w: 78, hl: false, key: 30 },
              { y: 11, w: 62, hl: true, key: 22 },
              { y: 22, w: 82, hl: false, key: 34 },
              { y: 33, w: 54, hl: true, key: 18 },
              { y: 44, w: 74, hl: false, key: 28 },
              { y: 55, w: 66, hl: false, key: 26 },
              { y: 66, w: 46, hl: true, key: 16 },
              { y: 77, w: 78, hl: false, key: 32 },
            ].map((row, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3 + i * 0.06, duration: 0.4 }}
              >
                {row.hl && (
                  <rect
                    x="-2"
                    y={row.y - 1.5}
                    width="88"
                    height="6"
                    rx="1"
                    fill="rgba(217,119,6,0.08)"
                  />
                )}
                <rect
                  x="0"
                  y={row.y}
                  width={row.key / 2}
                  height="2"
                  rx="0.75"
                  fill={row.hl ? "#d97706" : "rgba(120,113,108,0.5)"}
                />
                <rect
                  x={row.key / 2 + 3}
                  y={row.y}
                  width={row.w - row.key / 2 - 3}
                  height="2"
                  rx="0.75"
                  fill={row.hl ? "#1c1917" : "rgba(120,113,108,0.3)"}
                />
              </motion.g>
            ))}
          </g>
        </g>

        {/* Label: ORGANIZED FILES */}
        <g transform="translate(515, 355)">
          <text
            textAnchor="middle"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="10"
            fontWeight="500"
            fill="#78716c"
            letterSpacing="1.5"
          >
            ORGANIZED FILES
          </text>
        </g>

        {/* Flow arrows */}
        <g
          stroke="rgba(120,113,108,0.3)"
          strokeWidth="1"
          strokeDasharray="2 3"
          fill="none"
        >
          <line x1="145" y1="225" x2="190" y2="225" />
          <line x1="280" y1="225" x2="325" y2="225" />
          <line x1="415" y1="225" x2="460" y2="225" />
        </g>
      </svg>
    </div>
  );
}
