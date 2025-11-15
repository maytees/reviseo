export function getDomain(url: string): string {
	try {
		const urlObj = new URL(url);
		return urlObj.hostname;
	} catch (error) {
		// If URL is invalid, return the original string
		console.error("getDomain Error:", error);
		return url;
	}
}
