import {
	Body,
	CodeInline,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

export default function OtpEmail({
	otp,
	email,
}: {
	otp: string;
	email: string;
}) {
	return (
		<Html>
			<Head />
			<Preview>Your verification code for Molnr</Preview>
			<Tailwind
				config={{
					darkMode: "class",
					theme: {
						extend: {
							fontFamily: {
								sans: ["var(--font-sans)"],
							},
							colors: {
								brand: "#0a0a0a",
								muted: "#fafafa",
								background: "hsl(var(--background))",
								foreground: "hsl(var(--foreground))",
								card: {
									DEFAULT: "hsl(var(--card))",
									foreground: "hsl(var(--card-foreground))",
								},
								popover: {
									DEFAULT: "hsl(var(--popover))",
									foreground: "hsl(var(--popover-foreground))",
								},
								primary: {
									DEFAULT: "hsl(var(--primary))",
									foreground: "hsl(var(--primary-foreground))",
								},
								secondary: {
									DEFAULT: "hsl(var(--secondary))",
									foreground: "hsl(var(--secondary-foreground))",
								},
								accent: {
									DEFAULT: "hsl(var(--accent))",
									foreground: "hsl(var(--accent-foreground))",
								},
								destructive: {
									DEFAULT: "hsl(var(--destructive))",
									foreground: "hsl(var(--destructive-foreground))",
								},
								border: "hsl(var(--border))",
								input: "hsl(var(--input))",
								ring: "hsl(var(--ring))",
								chart: {
									"1": "hsl(var(--chart-1))",
									"2": "hsl(var(--chart-2))",
									"3": "hsl(var(--chart-3))",
									"4": "hsl(var(--chart-4))",
									"5": "hsl(var(--chart-5))",
								},
							},
							borderRadius: {
								lg: "var(--radius)",
								md: "calc(var(--radius) - 3.5px)",
								sm: "calc(var(--radius) - 4px)",
							},
						},
					},
				}}
			>
				<Body className="font-sans bg-gray-50">
					<Container className="px-4 py-8 mx-auto">
						<Section className="max-w-md p-8 mx-auto text-left bg-white border border-gray-200 rounded-lg">
							<Section className="flex justify-start mb-6">
								<Img
									src={`https://molnr.t3.storage.dev/molnr-logo.png`}
									width="32"
									height="32"
									alt="Molnr"
								/>
							</Section>

							<Section className="mb-4">
								<Text className="m-0 text-xl font-bold text-gray-900">
									Molnr
								</Text>
								<Text className="m-0 mt-1 text-sm text-gray-600">
									Your verification code
								</Text>
							</Section>

							<Section className="mb-6">
								<Text className="mb-4 text-base text-gray-700">
									Here&apos;s your verification code for {email}. Enter this
									code to complete your sign-in:
								</Text>
							</Section>

							<Section className="mb-6">
								<CodeInline className="px-4 py-2 font-mono text-2xl font-bold tracking-wider text-gray-900 bg-gray-100 rounded-md">
									{otp}
								</CodeInline>
							</Section>

							<Section className="mb-4">
								<Text className="text-sm text-gray-500">
									This code will expire in 10 minutes. If you didn&apos;t
									request this code, you can safely ignore this email.
								</Text>
							</Section>
						</Section>

						<Hr className="mt-8 mb-6 border-gray-200" />

						<Section className="mb-4 text-sm text-left text-gray-500">
							<Text className="p-0 m-0">
								© 2025 Molnr. All rights reserved.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
