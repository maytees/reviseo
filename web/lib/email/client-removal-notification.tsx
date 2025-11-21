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
									Access Removed
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									{clientName === "No Name" ? (
										"Hi,"
									) : (
										<>
											Hi <strong>{clientName}</strong>,
										</>
									)}
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									We're writing to let you know that{" "}
									<strong>{developerName}</strong> has removed your access to{" "}
									<strong>{websiteName}</strong> on Reviseo. You will no longer
									be able to submit feedback on the website via the Reviseo
									widget.
								</Text>

								{/* Info Card */}
								<Section className="mb-[24px] rounded-[8px] border border-[#e5e7eb] border-solid bg-[#f9fafb] p-[20px]">
									<Text className="mb-[4px] text-[#6b7280] text-[12px] uppercase leading-[16px] tracking-wide">
										Website
									</Text>
									<Text className="mb-[4px] font-semibold text-[#111827] text-[16px] leading-[24px]">
										{websiteName}
									</Text>
									<Text className="mt-[12px] mb-[4px] text-[#6b7280] text-[12px] uppercase leading-[16px] tracking-wide">
										Developer
									</Text>
									<Text className="mb-0 text-[#111827] text-[14px] leading-[20px]">
										{developerName}
									</Text>
								</Section>

								<Text className="mb-[24px] text-[#374151] text-[14px] leading-[20px]">
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

								<Section className="rounded-[8px] border border-[#fee2e2] border-solid bg-[#fef2f2] p-[16px]">
									<Text className="m-0 text-[#374151] text-[12px] leading-[18px]">
										💡 <strong>Note:</strong> Your previous feedback submissions
										for {websiteName} are still retained and accessible to{" "}
										{developerName}.
									</Text>
								</Section>
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

export const PreviewProps: ClientRemovalNotificationEmailProps = {
	clientName: "Sarah Johnson",
	developerName: "Alex Chen",
	websiteName: "Acme Corp Website",
	developerEmail: "alex@example.com",
};
