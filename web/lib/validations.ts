import { z } from "zod";

export const websiteSchema = z.object({
	websiteName: z.string().min(1, "Website name is required"),
	websiteUrl: z
		.string()
		.min(1, "Website URL is required")
		.url("Please enter a valid URL")
		.refine(
			(url) => url.startsWith("http://") || url.startsWith("https://"),
			"URL must start with http:// or https://",
		),
});

export const clientSchema = z.object({
	clientName: z.string().min(1, "Client name is required"),
	clientEmail: z
		.string()
		.min(1, "Client email is required")
		.email("Please enter a valid email address"),
});

export type WebsiteFormData = z.infer<typeof websiteSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
