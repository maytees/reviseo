/** Check a Prisma known-request error by code without relying on instanceof
 *  (fragile across the custom generated-client runtime). */
export function isPrismaError(e: unknown, code: string): boolean {
	return (
		typeof e === "object" &&
		e !== null &&
		"code" in e &&
		(e as { code?: unknown }).code === code
	);
}
