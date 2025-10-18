"use server";

import { requireUser } from "@/app/data/require-user";
import { prisma } from "@/lib/db";
import { getDomain } from "@/lib/getDomain";
import type { ApiResponse } from "@/lib/types";
import type { ClientFormData, WebsiteFormData } from "@/lib/validations";
import { PrismaClientKnownRequestError } from "@/prisma/generated/client/runtime/library";

export async function inviteClient({
  clientName,
  clientEmail,
}: ClientFormData): Promise<ApiResponse> {
  const user = await requireUser();

  try {
  } catch {
    // if (e instanceof PrismaClientKnownRequestError) {
    //   switch (e.code) {
    //     case "P2002": {
    //       return {
    //         status: "error",
    //         message: `Website domain ${url} already taken!`,
    //       };
    //     }
    //     default:
    //       return {
    //         status: "error",
    //         message: `Failed to create website: ${e.code}`,
    //       };
    //   }
    // }

    console.error("Failed to send email:\n", e);
    return {
      status: "error",
      message: `Failed to send email`,
    };
  }
}

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
        url: websiteUrl,
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
  } catch (e: unknown) {
    if (e instanceof PrismaClientKnownRequestError) {
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

    console.error("Failed to create website:\n", e);
    return {
      status: "error",
      message: `Failed to create website`,
    };
  }
}
