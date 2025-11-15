import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(
	_req: Request,
	context: { params: Promise<{ projectId: string }> },
) {
	const { projectId } = await context.params;

	const existingWebsite = await prisma.website.findUnique({
		where: {
			projectId,
		},
	});

	if (!existingWebsite) {
		return Response.json(
			{
				error: "Could not find site",
			},
			{
				status: 404,
			},
		);
	}

	try {
		const response = await fetch(existingWebsite.url, {
			headers: {
				"User-Agent": "ReviseoBot/1.0 (Installation Verification)",
			},
		});
		const html = await response.text();

		// Remove all whitespace and newlines for comparison
		const normalizedHtml = html.replace(/\s+/g, "");

		// Use environment variable for the script source
		const scriptSrc =
			env.NEXT_PUBLIC_WIDGET_SCRIPT_URL || "./dist/widget.iife.js";

		// Check for all required parts of the script
		const checks = [
			// Script tag opening
			normalizedHtml.includes("<script>"),
			// Config object with projectId
			normalizedHtml.includes(
				`window.ReviseoConfig={projectId:"${existingWebsite.projectId}"`,
			),
			// IIFE parameters
			normalizedHtml.includes("function(e,t){"),
			// Early return check
			normalizedHtml.includes("if(e.__Reviseo)return;"),
			// Reviseo object initialization
			normalizedHtml.includes("e.__Reviseo={};"),
			// Script element creation
			normalizedHtml.includes('consti=t.createElement("script");'),
			// Script source assignment
			normalizedHtml.includes(`i.src="${scriptSrc}"`),
			// Get first script tag
			normalizedHtml.includes('constn=t.getElementsByTagName("script")[0];'),
			// Insert before
			normalizedHtml.includes("n.parentNode.insertBefore(i,n)"),
			// IIFE invocation
			normalizedHtml.includes("}(window,document);") ||
				normalizedHtml.includes("})(window,document);"),
			// Script tag closing
			normalizedHtml.includes("</script>"),
		];

		// All checks must pass
		const isInstalled = checks.every((check) => check === true);

		// Debug;
		// const checksWithLabels = {
		// 	hasScriptTag: normalizedHtml.includes("<script>"),
		// 	hasConfig: normalizedHtml.includes(
		// 		`window.ReviseoConfig={projectId:"${existingWebsite.projectId}"`,
		// 	),
		// 	hasIIFE: normalizedHtml.includes("function(e,t){"),
		// 	hasEarlyReturn: normalizedHtml.includes("if(e.__Reviseo)return;"),
		// 	hasReviseoInit: normalizedHtml.includes("e.__Reviseo={};"),
		// 	hasCreateElement: normalizedHtml.includes(
		// 		'consti=t.createElement("script");',
		// 	),
		// 	hasScriptSrc: normalizedHtml.includes(`i.src="${scriptSrc}"`),
		// 	hasGetByTagName: normalizedHtml.includes(
		// 		'constn=t.getElementsByTagName("script")[0];',
		// 	),
		// 	hasInsertBefore: normalizedHtml.includes(
		// 		"n.parentNode.insertBefore(i,n)",
		// 	),
		// 	hasIIFEInvoke:
		// 		normalizedHtml.includes("}(window,document);") ||
		// 		normalizedHtml.includes("})(window,document);"),
		// 	hasClosingTag: normalizedHtml.includes("</script>"),
		// };
		// console.log("Installation checks:", checksWithLabels);

		await prisma.website.update({
			where: {
				projectId,
			},
			data: {
				widgetInstalled: isInstalled,
				verifiedAt: isInstalled ? new Date() : existingWebsite.verifiedAt,
			},
		});

		return Response.json(
			{
				installed: isInstalled,
				verifiedAt: isInstalled ? new Date() : null,
			},
			{
				status: 200,
			},
		);
	} catch (error) {
		return Response.json(
			{
				installed: false,
				error: `Could not verify installation: ${error}`,
			},
			{ status: 500 },
		);
	}
}
