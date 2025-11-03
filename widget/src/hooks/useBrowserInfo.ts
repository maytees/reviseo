import { useEffect, useState } from "react";

type Browser = "Firefox" | "Edge" | "Chrome" | "Safari" | "Opera" | "Unknown";
type OS = "Windows" | "MacOS" | "Linux" | "Android" | "iOS" | "Unknown";

interface BrowserInfo {
	browser: Browser;
	browserVersion: string;
	os: OS;
	isMobile: boolean;
}

function useBrowserAndOS(): BrowserInfo {
	const [info, setInfo] = useState<BrowserInfo>({
		browser: "Unknown",
		browserVersion: "Unknown",
		os: "Unknown",
		isMobile: false,
	});

	useEffect(() => {
		const userAgent = navigator.userAgent;
		let browser: Browser = "Unknown";
		let browserVersion = "Unknown";
		let os: OS = "Unknown";
		const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);

		// Browser detection with version
		if (userAgent.indexOf("Firefox") > -1) {
			browser = "Firefox";
			browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || "Unknown";
		} else if (userAgent.indexOf("Edg") > -1) {
			browser = "Edge";
			browserVersion = userAgent.match(/Edg\/(\d+)/)?.[1] || "Unknown";
		} else if (userAgent.indexOf("Chrome") > -1) {
			browser = "Chrome";
			browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || "Unknown";
		} else if (userAgent.indexOf("Safari") > -1) {
			browser = "Safari";
			browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || "Unknown";
		} else if (
			userAgent.indexOf("Opera") > -1 ||
			userAgent.indexOf("OPR") > -1
		) {
			browser = "Opera";
			browserVersion =
				userAgent.match(/(?:Opera|OPR)\/(\d+)/)?.[1] || "Unknown";
		}

		// OS detection
		if (userAgent.indexOf("Win") > -1) {
			os = "Windows";
		} else if (userAgent.indexOf("Mac") > -1) {
			os = "MacOS";
		} else if (userAgent.indexOf("Linux") > -1) {
			os = "Linux";
		} else if (userAgent.indexOf("Android") > -1) {
			os = "Android";
		} else if (/iPhone|iPad|iPod/.test(userAgent)) {
			os = "iOS";
		}

		setInfo({ browser, browserVersion, os, isMobile });
	}, []);

	return info;
}

export default useBrowserAndOS;
