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
				<Body className="bg-[#f9fafb] font-sans py-[40px]">
					<Container className="mx-auto px-[20px] max-w-[600px]">
						<Section className="bg-[#ffffff] rounded-[8px] px-[32px] py-[40px] border border-solid border-[#e5e7eb]">
							{/* Header */}
							<Row>
								<Column className="p-1">
									<Img
										src="https://reviseo.app/logo.png"
										alt="Reviseo"
										className="size-10 h-auto mb-[12px]"
									/>
								</Column>
							</Row>

							{/* Main Content */}
							<Section>
								<Text className="text-[#111827] text-[24px] font-bold mb-[8px] leading-[32px]">
									Verify Your Email
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									Hi there! Enter this verification code to sign in to your
									account:
								</Text>

								{/* OTP Code Box */}
								<Section className="bg-[#f9fafb] rounded-[8px] p-[24px] mb-[24px] border border-solid border-[#e5e7eb] text-center">
									<CodeInline className="font-mono text-[#111827] text-[32px] font-bold tracking-[0.5em]">
										{otp}
									</CodeInline>
								</Section>

								<Text className="text-[#6b7280] text-[14px] mb-[8px] leading-[20px]">
									<strong>Email:</strong> {email}
								</Text>

								<Text className="text-[#6b7280] text-[12px] mb-[24px] leading-[18px]">
									This code expires in 10 minutes. If you didn't request this,
									please ignore this email.
								</Text>
							</Section>

							<Hr className="border-[#e5e7eb]" />

							{/* Footer */}
							<Section>
								<Text className="text-[#6b7280] text-[14px] leading-[20px] mb-[16px]">
									Visual feedback for web freelancers.
								</Text>

								<Row className="mb-[6px]">
									<Column>
										<Link
											href="https://www.linkedin.com/company/reviseoapp/"
											className="mr-[16px]"
										>
											<Img
												src="https://new.email/static/emails/social/social-linkedin.png"
												alt="LinkedIn"
												className="size-6"
											/>
										</Link>
									</Column>
								</Row>

								<Text className="text-[#9ca3af] text-[12px] leading-[16px] mt-0">
									© 2025 Reviseo. All rights reserved.
								</Text>

								<Text className="text-[#9ca3af] text-[12px] leading-[16px]">
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
