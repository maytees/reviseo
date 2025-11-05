"use client";

import type { WebsiteDataTypeNonNullable } from "@/app/data/website/get-website-by-id-and-dev-id";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const FeedbackTable = ({
	website,
}: {
	website: WebsiteDataTypeNonNullable;
}) => {
	return (
		<div className="w-full">
			<DataTable columns={columns} data={website.feedback} />
		</div>
	);
};

export default FeedbackTable;
