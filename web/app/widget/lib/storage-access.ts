"use client";

/**
 * Storage Access API helpers for the widget iframes.
 *
 * The widget runs on reviseo.app inside customer-site iframes, where our
 * session cookie is third-party. Modern browsers block or partition those
 * by default. The Storage Access API lets an embedded document request
 * access to its own first-party cookies — natively, per-site, with at most
 * a one-time browser prompt — instead of asking users to flip global
 * "allow third-party cookies" settings.
 *
 * Notes:
 * - Same-site embedding (and local dev) trivially has access; all of this
 *   no-ops there.
 * - `requestStorageAccess()` must be called from a user gesture unless the
 *   permission was already granted — the trigger button click provides it.
 * - A grant requires prior first-party interaction with reviseo.app, which
 *   our flow guarantees (clients accept their invite on reviseo.app).
 */

export function storageAccessSupported(): boolean {
	return typeof document !== "undefined" && "requestStorageAccess" in document;
}

/** Whether this document can already use its unpartitioned cookies. */
export async function hasStorageAccess(): Promise<boolean> {
	if (!storageAccessSupported()) {
		// Old browser without the API: cookie behavior is whatever it is —
		// report true so callers fall back to the plain cookie path.
		return true;
	}
	try {
		return await document.hasStorageAccess();
	} catch {
		return false;
	}
}

/** Request cookie access. Returns true when granted (or already granted). */
export async function requestStorageAccess(): Promise<boolean> {
	if (!storageAccessSupported()) return false;
	try {
		await document.requestStorageAccess();
		return true;
	} catch {
		// Rejected: no permission, prompt denied, or no prior first-party
		// interaction with our origin in this browser.
		return false;
	}
}

/** Best-effort: ensure access, requesting it if needed. */
export async function ensureStorageAccess(): Promise<boolean> {
	if (await hasStorageAccess()) return true;
	return requestStorageAccess();
}

/**
 * Whether the storage-access permission is already granted for this
 * embed — queryable WITHOUT a user gesture, which makes fully silent
 * reconnection possible: when granted, `requestStorageAccess()` resolves
 * gesture-free and cookies start flowing.
 *
 * Chromium & Firefox support the query; Safari doesn't (returns false via
 * catch → widget simply stays hidden there until cookies work another way).
 */
export async function storageAccessPermissionGranted(): Promise<boolean> {
	if (typeof navigator === "undefined" || !navigator.permissions) return false;
	try {
		const status = await navigator.permissions.query({
			// Not in TS's PermissionName union yet
			name: "storage-access" as PermissionName,
		});
		return status.state === "granted";
	} catch {
		return false;
	}
}
