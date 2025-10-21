import {
	Body,
	CodeInline,
	Container,
	Head,
	Html,
	Img,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface OtpEmailProps {
	otp: string;
	email: string;
}

export default function OtpEmail({ otp, email }: OtpEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Your verification code for Reviseo</Preview>
			<Tailwind>
				<Body className="font-sans">
					<Container className="px-4 py-12 mx-auto">
						{/* Main Card */}
						<Section className="max-w-md mt-10 mx-auto text-left border-solid overflow-hidden border-gray-200 border-2 bg-white rounded-2xl">
							{/* Header */}
							<Section
								className="px-8 pt-8 pb-6"
								style={{
									backgroundColor: "#6538e0",
								}}
							>
								<Img
									src="https://reviseo.app/logo.svg"
									srcSet="https://reviseo.app/logo.svg"
									width="40"
									height="40"
									alt="Reviseo"
									className="mb-4"
								/>
								<Text className="m-0 text-2xl font-bold text-white">
									Verify Your Email
								</Text>
								<Text className="m-0 mt-2 text-sm text-white/80">
									Welcome to Reviseo
								</Text>
							</Section>

							{/* Content */}
							<Section className="px-8 py-8">
								<Text className="mb-6 text-base text-gray-700">
									Hi there! Enter this verification code to sign in to your
									account:
								</Text>

								{/* OTP Code Box */}
								<Section
									style={{
										backgroundColor: "#f4f6f3",
										border: "1px solid #dfe2dc",
									}}
									className="mb-6 p-4 rounded-xl text-center"
								>
									<CodeInline className="font-mono text-gray-700 text-4xl font-bold tracking-[0.7em]">
										{otp}
									</CodeInline>
								</Section>

								<Text className="mb-2 text-sm text-gray-600">
									<strong>Email:</strong> {email}
								</Text>
								<Text className="mb-4 text-xs text-gray-500">
									This code expires in 10 minutes. If you didn&apos;t request
									this, please ignore the email.
								</Text>
							</Section>
						</Section>

						{/* Footer */}
						<Section className="mt-8 text-center">
							<Text className="m-0 mb-2 text-xs text-gray-400">
								© 2025 Reviseo. All rights reserved.
							</Text>
							<Text className="m-0 text-xs text-gray-500">
								Visual feedback, simplified.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

export const PreviewProps: OtpEmailProps = {
	otp: "902349",
	email: "adam@gmail.com",
};
