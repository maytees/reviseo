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
									Confirm Account Deletion
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									Hi <strong>{userName}</strong>, we received a request to
									delete your Reviseo account.
								</Text>

								{/* Warning Box */}
								<Section className="bg-[#fef2f2] rounded-[8px] p-[20px] mb-[24px] border border-solid border-[#fee2e2]">
									<Text className="text-[#991b1b] text-[14px] font-semibold mb-[8px] leading-[20px] m-0">
										⚠️ Warning: This action is permanent
									</Text>
									<Text className="text-[#374151] text-[14px] leading-[20px] m-0 mt-[8px]">
										Deleting your account will permanently remove:
									</Text>
									<Text className="text-[#374151] text-[14px] leading-[20px] m-0 ml-[16px]">
										• All your websites
										<br />• All feedback submissions
										<br />• Your profile and settings
										<br />• All associated data
									</Text>
								</Section>

								<Text className="text-[#374151] text-[14px] mb-[24px] leading-[20px]">
									<strong>Email:</strong> {userEmail}
								</Text>

								{/* CTA Button */}
								<Section className="mb-[24px]">
									<Button
										href={verificationUrl}
										className="bg-[#dc2626] text-[#ffffff] px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium no-underline text-center box-border w-full"
									>
										Confirm Account Deletion
									</Button>
								</Section>

								<Text className="text-[#6b7280] text-[12px] mb-[8px] leading-[16px] text-center">
									Or copy this link into your browser:
								</Text>
								<Section className="bg-[#f9fafb] rounded-[8px] p-[12px] mb-[24px] border border-solid border-[#e5e7eb]">
									<Link
										href={verificationUrl}
										className="text-[#9c40ff] text-[12px] font-mono leading-[16px] break-all"
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

export const PreviewProps: DeleteAccountEmailProps = {
	userName: "John Doe",
	userEmail: "john@example.com",
	verificationUrl:
		"https://reviseo.app/api/auth/delete-user/verify?token=abc123",
};
