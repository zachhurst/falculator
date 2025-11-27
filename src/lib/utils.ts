import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// v2.1 Pricing calculation utilities
export function calculateMegapixels(width: number, height: number): number {
  return (width * height) / 1_000_000;
}

export function calculateCostPerImage(
  baseCost: number,
  pricingUnit: string,
  width?: number,
  height?: number
): number {
  if (pricingUnit === "PER_MEGAPIXEL" && width && height) {
    return baseCost * calculateMegapixels(width, height);
  }
  if (pricingUnit === "PER_IMAGE" || pricingUnit === "FREE") {
    return baseCost;
  }
  return baseCost; // Fallback for other units
}

export function calculateRunsPerDollar(costPerImage: number): number {
  if (costPerImage <= 0) return Infinity;
  return Math.floor(1 / costPerImage);
}
