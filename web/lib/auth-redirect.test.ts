import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DASHBOARD_CHOOSER_PATH, safeNextPath } from "./auth-redirect";

describe("safeNextPath", () => {
	it("uses no return path when the value is absent", () => {
		for (const value of [undefined, null, ""]) {
			assert.equal(safeNextPath(value), null);
		}
	});

	const safePaths = [
		"/dashboard/websites/project-123?tab=text#feedback",
		"/client/dashboard?site=site-123",
		"/accept-invitation/invite-123",
		"/invite?token=abc%2Fdef%2Bghi",
		"/widget/connect?site=site-123",
		"/widget/trigger?projectId=project-123#reviseo-connect",
		DASHBOARD_CHOOSER_PATH,
	];

	for (const path of safePaths) {
		it(`preserves the safe return path ${path}`, () => {
			assert.equal(safeNextPath(path), path);
		});
	}

	const unsafePaths = [
		"https://example.com/dashboard",
		"javascript:alert(1)",
		"//example.com/dashboard",
		"///example.com/dashboard",
		"/\\example.com/dashboard",
		"/dashboard\\settings",
		"/%5Cexample.com/dashboard",
		"/%2Fexample.com/dashboard",
		"/%2f%2fexample.com/dashboard",
		"/\n/example.com/dashboard",
		"/\r/example.com/dashboard",
		"/\t/example.com/dashboard",
		"/invalid%ZZ",
		"/%E0%A4%A",
	];

	for (const path of unsafePaths) {
		it(`rejects the unsafe or malformed path ${JSON.stringify(path)}`, () => {
			assert.equal(safeNextPath(path), null);
		});
	}

	const signInLoops = [
		"/login",
		"/login/?next=%2Fdashboard",
		"/%6cogin",
		"/login%2F",
		"/lo\ngin",
		"/dashboard/../login",
		"/verify-request",
		"/verify-request/?email=person%40example.com",
	];

	for (const path of signInLoops) {
		it(`rejects the sign-in loop ${JSON.stringify(path)}`, () => {
			assert.equal(safeNextPath(path), null);
		});
	}

	it("normalizes a same-origin path before returning it", () => {
		assert.equal(
			safeNextPath("/dashboard/../client/dashboard?site=site-123#feedback"),
			"/client/dashboard?site=site-123#feedback",
		);
	});
});
