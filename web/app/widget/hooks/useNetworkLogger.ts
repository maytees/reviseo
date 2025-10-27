// /** biome-ignore-all lint/suspicious/noExplicitAny: idk */
// import { useEffect, useRef } from "react";

// export type NetworkLog = {
// 	url: string;
// 	method: string;
// 	status?: number;
// 	duration?: number;
// 	success: boolean;
// 	timestamp: string;
// };

// export function useNetworkLogger() {
// 	const logsRef = useRef<NetworkLog[]>([]);

// 	useEffect(() => {
// 		const originalFetch = window.fetch;
// 		const originalXhrOpen = XMLHttpRequest.prototype.open;
// 		const originalXhrSend = XMLHttpRequest.prototype.send;

// 		// ---- PATCH FETCH ----
// 		window.fetch = async (...args: Parameters<typeof fetch>) => {
// 			const [input, init] = args;
// 			const url =
// 				typeof input === "string"
// 					? input
// 					: input instanceof URL
// 						? input.href
// 						: input.url;
// 			const method = (init?.method || "GET").toUpperCase();
// 			const start = performance.now();

// 			try {
// 				const res = await originalFetch(...args);
// 				const duration = performance.now() - start;
// 				logsRef.current.push({
// 					url,
// 					method,
// 					status: res.status,
// 					duration,
// 					success: res.ok,
// 					timestamp: new Date().toISOString(),
// 				});
// 				return res;
// 			} catch (err) {
// 				const duration = performance.now() - start;
// 				logsRef.current.push({
// 					url,
// 					method,
// 					success: false,
// 					duration,
// 					timestamp: new Date().toISOString(),
// 				});
// 				throw err;
// 			}
// 		};

// 		// ---- PATCH XHR ----
// 		interface XHRWithTracking extends XMLHttpRequest {
// 			_url?: string;
// 			_method?: string;
// 		}

// 		XMLHttpRequest.prototype.open = function (
// 			this: XHRWithTracking,
// 			method: string,
// 			url: string | URL,
// 			...rest: unknown[]
// 		) {
// 			this._url = typeof url === "string" ? url : url.href;
// 			this._method = method;
// 			return originalXhrOpen.call(this, method, url as string, ...rest);
// 		};

// 		XMLHttpRequest.prototype.send = function (
// 			this: XHRWithTracking,
// 			...args: any[]
// 		) {
// 			const start = performance.now();

// 			this.addEventListener("loadend", () => {
// 				const duration = performance.now() - start;
// 				logsRef.current.push({
// 					url: this._url || "unknown",
// 					method: this._method || "GET",
// 					status: this.status,
// 					duration,
// 					success: this.status >= 200 && this.status < 400,
// 					timestamp: new Date().toISOString(),
// 				});
// 			});

// 			return originalXhrSend.apply(this, args as any);
// 		};

// 		// Cleanup
// 		return () => {
// 			window.fetch = originalFetch;
// 			XMLHttpRequest.prototype.open = originalXhrOpen;
// 			XMLHttpRequest.prototype.send = originalXhrSend;
// 		};
// 	}, []);

// 	return logsRef.current;
// }
