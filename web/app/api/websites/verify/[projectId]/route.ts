import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;

  // 1. get the website from database
  // 2. get site html
  // 3. check site html see if the script is in there
  // 4. if there, change verified status in website in db
  // 5. if not, send false in response

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

    // Check for the link tag (stylesheet)
    const linkPattern = new RegExp(
      `<link[^>]*rel=["']stylesheet["'][^>]*href=["']https://reviseo\\.app/cdn/reviseo\\.css["'][^>]*>`,
      "i",
    );

    // Check for the script tag with project ID
    const scriptPattern = new RegExp(
      `<script[^>]*src=["']https://reviseo\\.app/cdn/reviseo\\.js["'][^>]*data-project-id=["']${existingWebsite.projectId}["'][^>]*>`,
      "i",
    );

    // Both tags must be present for successful installation
    const isInstalled = linkPattern.test(html) && scriptPattern.test(html);

    await prisma.website.update({
      where: {
        projectId,
      },
      data: {
        widgetInstalled: isInstalled,
        // WARN: VerifiedAt is alawys set, should it be?
        verifiedAt: new Date(),
      },
    });

    return Response.json(
      {
        installed: isInstalled,
        verifiedAt: new Date(),
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
