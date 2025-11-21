import {
	Body,
	Button,
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

interface DeleteAccountEmailProps {
	userName: string;
	userEmail: string;
	verificationUrl: string;
}

export default function DeleteAccountEmail({
	userName,
	userEmail,
	verificationUrl,
}: DeleteAccountEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Confirm your account deletion request</Preview>
				<Body className="bg-[#f9fafb] py-[40px] font-sans">
					<Container className="mx-auto max-w-[600px] px-[20px]">
						<Section className="rounded-[8px] border border-[#e5e7eb] border-solid bg-[#ffffff] px-[32px] py-[40px]">
							{/* Header */}
							<Row>
								<Column className="p-1">
									<Img
										src="https://reviseo.app/logo.png"
										alt="Reviseo"
										className="mb-[12px] size-10 h-auto"
									/>
								</Column>
							</Row>

							{/* Main Content */}
							<Section>
								<Text className="mb-[8px] font-bold text-[#111827] text-[24px] leading-[32px]">
									Confirm Account Deletion
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									Hi <strong>{userName}</strong>, we received a request to
									delete your Reviseo account.
								</Text>

								{/* Warning Box */}
								<Section className="mb-[24px] rounded-[8px] border border-[#fee2e2] border-solid bg-[#fef2f2] p-[20px]">
									<Text className="m-0 mb-[8px] font-semibold text-[#991b1b] text-[14px] leading-[20px]">
										⚠️ Warning: This action is permanent
									</Text>
									<Text className="m-0 mt-[8px] text-[#374151] text-[14px] leading-[20px]">
										Deleting your account will permanently remove:
									</Text>
									<Text className="m-0 ml-[16px] text-[#374151] text-[14px] leading-[20px]">
										• All your websites
										<br />• All feedback submissions
										<br />• Your profile and settings
										<br />• All associated data
									</Text>
								</Section>

								<Text className="mb-[24px] text-[#374151] text-[14px] leading-[20px]">
									<strong>Email:</strong> {userEmail}
								</Text>

								{/* CTA Button */}
								<Section className="mb-[24px]">
									<Button
										href={verificationUrl}
										className="box-border w-full rounded-[6px] bg-[#dc2626] px-[24px] py-[12px] text-center font-medium text-[#ffffff] text-[14px] no-underline"
									>
										Confirm Account Deletion
									</Button>
								</Section>

								<Text className="mb-[8px] text-center text-[#6b7280] text-[12px] leading-[16px]">
									Or copy this link into your browser:
								</Text>
								<Section className="mb-[24px] rounded-[8px] border border-[#e5e7eb] border-solid bg-[#f9fafb] p-[12px]">
									<Link
										href={verificationUrl}
										className="break-all font-mono text-[#9c40ff] text-[12px] leading-[16px]"
									>
										{verificationUrl}
									</Link>
								</Section>

								<Text className="text-[#6b7280] text-[12px] leading-[18px]">
									If you didn't request this, please ignore this email. Your
									account will remain active.
								</Text>
							</Section>

							<Hr className="border-[#e5e7eb]" />

							{/* Footer */}
							<Section>
								<Text className="mb-[16px] text-[#6b7280] text-[14px] leading-[20px]">
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

								<Text className="mt-0 text-[#9ca3af] text-[12px] leading-[16px]">
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

export const PreviewProps: DeleteAccountEmailProps = {
	userName: "John Doe",
	userEmail: "john@example.com",
	verificationUrl:
		"https://reviseo.app/api/auth/delete-user/verify?token=abc123",
};
