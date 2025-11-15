declare global {
	interface Window {
		ReviseoConfig: {
			projectId: string;
			position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
			theme?: "light" | "dark" | "auto";
		};
	}
}

export {};
