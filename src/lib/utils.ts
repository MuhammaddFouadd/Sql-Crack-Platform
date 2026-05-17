import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-light text-green border-green/30',
  intermediate: 'bg-yellow-light text-yellow border-yellow/30',
  advanced: 'bg-rose-light text-rose border-rose/30',
}

export const problemDifficultyColors: Record<string, string> = {
  easy: 'bg-green-light text-green border-green/30',
  medium: 'bg-yellow-light text-yellow border-yellow/30',
  hard: 'bg-rose-light text-rose border-rose/30',
}
