import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function nullToUndefined<T>(value: T | null): T | undefined {
	return value === null ? undefined : value;
}

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

function objectToStringWithoutQuotedKeys(obj: Record<string, string>) {
	const parts = [];
	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			let value = obj[key];
			if (typeof value === "string") {
				value = `"${value}"`; // Quote string values with single quotes for JS literal
			} else if (typeof value === "object" && value !== null) {
				value = objectToStringWithoutQuotedKeys(value); // Recursively handle nested objects
			}
			parts.push(`${key}: ${value}`);
		}
	}
	return `{${parts.join(", ")}}`;
}

/** The single source of truth for the widget loader snippet body. */
function widgetSnippetBody(
	projectId: string,
	config?: { position?: string; theme?: string },
): { configStr: string; scriptSrc: string } {
	const scriptSrc = env.NEXT_PUBLIC_WIDGET_SCRIPT_URL;

	const configObj = {
		projectId,
		...(config?.position && { position: config.position }),
		...(config?.theme && { theme: config.theme }),
	};

	return { configStr: objectToStringWithoutQuotedKeys(configObj), scriptSrc };
}

/**
 * Loader body without <script> tags — for frameworks that inject scripts
 * programmatically (next/script, Nuxt app.head, etc).
 */
export function generateWidgetScriptInnerJs(
	projectId: string,
	config?: { position?: string; theme?: string },
): string {
	const { configStr, scriptSrc } = widgetSnippetBody(projectId, config);

	return `window.ReviseoConfig = ${configStr};
(function (e, t) {
  if (e.__Reviseo) return;
  e.__Reviseo = {};
  const i = t.createElement("script");
  i.src = "${scriptSrc}";
  const n = t.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(i, n);
})(window, document);`;
}

/**
 * Generates a minified widget installation snippet (for copy-paste).
 */
export function generateWidgetScriptMinified(
	projectId: string,
	config?: { position?: string; theme?: string },
): string {
	const { configStr, scriptSrc } = widgetSnippetBody(projectId, config);

	return `<script>window.ReviseoConfig=${configStr},function(e,t){if(e.__Reviseo)return;e.__Reviseo={};const i=t.createElement("script");i.src="${scriptSrc}";const n=t.getElementsByTagName("script")[0];n.parentNode.insertBefore(i,n)}(window,document);</script>`;
}

/**
 * Generates a formatted widget installation snippet (for display).
 */
export function generateWidgetScriptFormatted(
	projectId: string,
	config?: { position?: string; theme?: string },
): string {
	const { configStr, scriptSrc } = widgetSnippetBody(projectId, config);

	return `<script>
  window.ReviseoConfig = ${configStr},
  function (e, t) {
    if (e.__Reviseo) return;
    e.__Reviseo = {};
    const i = t.createElement("script");
    i.src = "${scriptSrc}";
    const n = t.getElementsByTagName("script")[0];
    n.parentNode.insertBefore(i, n)
  }(window, document);
</script>`;
}
