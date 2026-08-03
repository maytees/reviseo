import "server-only";

import { cache } from "react";
import { prisma as db } from "@/lib/db";
import { requireMember } from "../require-member";
import { websiteSelect } from "../selects";

/** A website by id, scoped to the caller's active organization. */
export const getWebsiteByIdAndDevId = cache(async (id: string) => {
	const { organization } = await requireMember();

	const data = await db.website.findFirst({
		where: {
			id,
			organizationId: organization.id,
		},
		select: websiteSelect,
	});

	return data;
});

export type WebsiteDataType = Awaited<
	ReturnType<typeof getWebsiteByIdAndDevId>
>;

export type WebsiteDataTypeNonNullable = NonNullable<WebsiteDataType>;
