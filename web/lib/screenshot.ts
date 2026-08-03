import "server-only";

import { v4 as uuidv4 } from "uuid";
import { prisma } from "./db";
import { env } from "./env";
import { deleteObject, putObject } from "./storage";

/**
 * Capture a screenshot of a URL with Puppeteer.
 * Uses @sparticuz/chromium on Vercel, local puppeteer elsewhere.
 */
export async function captureScreenshot(url: string): Promise<Buffer> {
	// biome-ignore lint/suspicious/noExplicitAny: dynamic dual-import (puppeteer vs puppeteer-core)
	let browser: any;
	try {
		const isVercel = !!process.env.VERCEL_ENV;
		// biome-ignore lint/suspicious/noExplicitAny: dynamic dual-import
		let puppeteer: any;
		// biome-ignore lint/suspicious/noExplicitAny: launch options differ per runtime
		let launchOptions: any = { headless: true };

		if (isVercel) {
			const chromium = (await import("@sparticuz/chromium")).default;
			puppeteer = await import("puppeteer-core");
			launchOptions = {
				...launchOptions,
				args: chromium.args,
				executablePath: await chromium.executablePath(),
			};
		} else {
			puppeteer = await import("puppeteer");
		}

		browser = await puppeteer.launch(launchOptions);
		const page = await browser.newPage();
		await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
		await page.goto(url, { waitUntil: "networkidle2", timeout: 20_000 });

		const screenshot = await page.screenshot({
			type: "png",
			clip: { x: 0, y: 0, width: 1920, height: 1080 },
		});

		return Buffer.from(screenshot);
	} finally {
		if (browser) await browser.close();
	}
}

/** Basic SSRF guard: only allow http(s) URLs to public-looking hosts. */
export function isSafeExternalUrl(raw: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		return false;
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

	const host = parsed.hostname.toLowerCase();

	// In local dev the user's own test sites live on localhost — allow them.
	if (env.NODE_ENV === "development") return true;

	if (
		host === "localhost" ||
		host === "0.0.0.0" ||
		host.endsWith(".localhost") ||
		host.endsWith(".local") ||
		host.endsWith(".internal")
	) {
		return false;
	}

	// Block IP-literal hosts in private/reserved ranges.
	const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
	if (ipv4) {
		const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
		if (
			a === 10 ||
			a === 127 ||
			a === 0 ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 192 && b === 168) ||
			(a === 169 && b === 254) ||
			(a === 100 && b >= 64 && b <= 127)
		) {
			return false;
		}
	}
	// IPv6 literals: block outright (no legitimate customer site needs one).
	if (host.includes(":")) return false;

	return true;
}

/**
 * Capture a site preview and store it, replacing any previous one.
 * Fire-and-forget safe: all failures are logged, never thrown.
 */
export async function captureAndStoreSiteScreenshot(
	websiteUrl: string,
	websiteId: string,
) {
	try {
		if (!isSafeExternalUrl(websiteUrl)) {
			console.error(`Refusing to screenshot unsafe URL: ${websiteUrl}`);
			return;
		}

		const png = await captureScreenshot(websiteUrl);
		const key = uuidv4();

		await putObject(
			env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
			key,
			png,
			"image/png",
		);

		const previous = await prisma.website.findUnique({
			where: { id: websiteId },
			select: { screenshotKey: true },
		});

		await prisma.website.update({
			where: { id: websiteId },
			data: { screenshotKey: key },
		});

		if (previous?.screenshotKey) {
			await deleteObject(
				env.NEXT_PUBLIC_S3_BUCKET_NAME_SITE_SCREENSHOTS,
				previous.screenshotKey,
			);
		}
	} catch (error) {
		console.error(`Failed to capture screenshot for ${websiteUrl}:`, error);
	}
}
