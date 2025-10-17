"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import { getDomain } from "@/lib/getDomain";
import type { ApiResponse } from "@/lib/types";
import type { WebsiteFormData } from "@/lib/validations";

export async function createWebsiteOnboarding({
  websiteName,
  websiteUrl,
}: WebsiteFormData): Promise<ApiResponse> {
  const user = await requireUser();
  const url = getDomain(websiteUrl);

  try {
    const newWebsite = await prisma.website.create({
      data: {
        name: websiteName,
        url: url,
        developerId: user.id,
      },
    });

    return {
      status: "success",
      message: newWebsite.projectId,
      // data: {
      // 	websiteId: newWebsite.id,
      // 	projectId: newWebsite.projectId,
      // },
    };
  } catch (e) {
    switch (e.code) {
      case "P2002": {
        return {
          status: "error",
          message: `Website domain ${url} already taken!`,
        };
      }
      default:
        return {
          status: "error",
          message: `Failed to create website: ${e.code}`,
        };
    }
  }
}
