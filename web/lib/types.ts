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
