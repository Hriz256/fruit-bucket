/**
 * Mathematical constants used throughout the application.
 * Extracted from production code to avoid magic numbers.
 */
export const MathConstants = {
  TWO_PI: Math.PI * 2,
  HALF_PI: Math.PI / 2,
  DEGREES_TO_RADIANS: Math.PI / 180,
  RADIANS_TO_DEGREES: 180 / Math.PI,
} as const;
