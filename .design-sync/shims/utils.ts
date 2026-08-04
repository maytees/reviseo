// Design-sync build shim for "@/lib/utils" (mapped via tsconfig.bundle.json).
// The app's lib/utils.ts imports t3-env (process.env at module init), which
// crashes in a standalone browser bundle. The synced components only use
// `cn` — replicated here 1:1. If lib/utils.ts's cn ever changes, update this.
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
