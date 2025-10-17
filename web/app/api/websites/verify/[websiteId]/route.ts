import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } },
) {
  const id = params.projectId;

  // 1. get the website from database
  // 2. get site html
  // 3. check site html see if the script is in there
  // 4. if there, change verified status in website in db
  // 5. if not, send false in response

  const existingWebsite = await prisma.website.findUnique({
    where: {
      projectId: id,
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

    const scriptPattern = new RegExp(
      `<script[^>]*src=["']https://cdn\\.reviseo\\.com/widget\\.js["'][^>]*data-project-id=["']${existingWebsite.projectId}["'][^>]*>`,
      "i",
    );

    const isInstalled = scriptPattern.test(html);

    await prisma.website.update({
      where: {
        id,
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
