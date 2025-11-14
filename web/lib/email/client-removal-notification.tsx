import {
	Body,
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

interface ClientRemovalNotificationEmailProps {
	clientName: string;
	developerName: string;
	websiteName: string;
	developerEmail: string;
}

export default function ClientRemovalNotificationEmail({
	clientName,
	developerName,
	websiteName,
	developerEmail,
}: ClientRemovalNotificationEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>You've been removed from {websiteName} on Reviseo</Preview>
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
									Access Removed
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									{clientName === "No Name" ? (
										"Hi,"
									) : (
										<>
											Hi <strong>{clientName}</strong>,
										</>
									)}
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									We're writing to let you know that{" "}
									<strong>{developerName}</strong> has removed your access to{" "}
									<strong>{websiteName}</strong> on Reviseo. You will no longer
									be able to submit feedback on the website via the Reviseo
									widget.
								</Text>

								{/* Info Card */}
								<Section className="bg-[#f9fafb] rounded-[8px] p-[20px] mb-[24px] border border-solid border-[#e5e7eb]">
									<Text className="text-[#6b7280] text-[12px] mb-[4px] leading-[16px] uppercase tracking-wide">
										Website
									</Text>
									<Text className="text-[#111827] text-[16px] font-semibold mb-[4px] leading-[24px]">
										{websiteName}
									</Text>
									<Text className="text-[#6b7280] text-[12px] mb-[4px] leading-[16px] uppercase tracking-wide mt-[12px]">
										Developer
									</Text>
									<Text className="text-[#111827] text-[14px] mb-0 leading-[20px]">
										{developerName}
									</Text>
								</Section>

								<Text className="text-[#374151] text-[14px] mb-[24px] leading-[20px]">
									If you believe this was done in error or have any questions,
									please reach out directly to{" "}
									<Link
										href={`mailto:${developerEmail}`}
										className="text-[#9c40ff] no-underline"
									>
										{developerName}
									</Link>
									.
								</Text>

								<Section className="bg-[#fef2f2] rounded-[8px] p-[16px] border border-solid border-[#fee2e2]">
									<Text className="text-[#374151] text-[12px] leading-[18px] m-0">
										💡 <strong>Note:</strong> Your previous feedback submissions
										for {websiteName} are still retained and accessible to{" "}
										{developerName}.
									</Text>
								</Section>
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

export const PreviewProps: ClientRemovalNotificationEmailProps = {
	clientName: "Sarah Johnson",
	developerName: "Alex Chen",
	websiteName: "Acme Corp Website",
	developerEmail: "alex@example.com",
};
