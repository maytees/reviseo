import {
	Body,
	CodeInline,
	Column,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Row,
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
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Your verification code for Reviseo</Preview>
				<Body className="bg-[#f9fafb] py-10 font-sans">
					<Container className="mx-auto max-w-[600px] px-5">
						<Section className="rounded-xl border border-[#e5e7eb] border-solid bg-[#ffffff] px-8 py-10">
							{/* Header */}
							<Row>
								<Column className="p-1">
									<Img
										src="https://reviseo.app/logo.png"
										alt="Reviseo"
										className="mb-3 size-10 h-auto"
									/>
								</Column>
							</Row>

							{/* Main Content */}
							<Section>
								<Text className="mb-2 font-bold text-[#111827] text-[24px] leading-8">
									Verify Your Email
								</Text>

								<Text className="mb-6 text-[#374151] text-[16px] leading-6">
									Hi there! Enter this verification code to sign in to your
									account:
								</Text>

								{/* OTP Code Box */}
								<Section className="mb-6 rounded-xl border border-[#e5e7eb] border-solid bg-[#f9fafb] p-6 text-center">
									<CodeInline className="font-bold font-mono text-[#111827] text-[32px] tracking-[0.5em]">
										{otp}
									</CodeInline>
								</Section>

								<Text className="mb-2 text-[#6b7280] text-[14px] leading-5">
									<strong>Email:</strong> {email}
								</Text>

								<Text className="mb-6 text-[#6b7280] text-[12px] leading-[18px]">
									This code expires in 10 minutes. If you didn't request this,
									please ignore this email.
								</Text>
							</Section>

							<Hr className="border-[#e5e7eb]" />

							{/* Footer */}
							<Section>
								<Text className="mb-4 text-[#6b7280] text-[14px] leading-5">
									Visual feedback for web freelancers.
								</Text>

								<Row className="mb-1.5">
									<Column>
										<Link
											href="https://www.linkedin.com/company/reviseoapp/"
											className="mr-4"
										>
											<Img
												src="https://new.email/static/emails/social/social-linkedin.png"
												alt="LinkedIn"
												className="size-6"
											/>
										</Link>
									</Column>
								</Row>

								<Text className="mt-0 text-[#9ca3af] text-[12px] leading-4">
									© 2025 Reviseo. All rights reserved.
								</Text>

								<Text className="text-[#9ca3af] text-[12px] leading-4">
									<Link
										href="https://reviseo.app"
										className="text-[#9c40ff] no-underline"
									>
										Visit Reviseo
									</Link>
								</Text>
							</Section>
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
