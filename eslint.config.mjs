import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships flat configs directly, so there's no need for
// FlatCompat (which crashes on this version with a circular-structure error).
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: ["out/**", ".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
