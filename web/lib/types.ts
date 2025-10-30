// export type ApiResponse = {
// 	status: "success" | "error";

// 	message: string;
// };

export type ApiResponse<T = void> =
	| (T extends void
			? {
					status: "success";
					message: string;
				}
			: {
					status: "success";
					message: string;
					data: T;
				})
	| {
			status: "error";
			message: string;
	  };

export type BlogItem = {
	id: string;
	title: string;
	date: string;
	category: string;
	author: string;
	authorImage?: string;
	description?: string;
	authorLinkedIn: string;
	seeMore: string[];
	cover?: string;
	slug?: string;
	authorRole?: string;
	lastModified: Date;
};

export const categoryMap = {
	story: "info",
	product: "success",
	guide: "warning",
};
