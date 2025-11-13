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

interface ClientInviteEmailProps {
	clientName: string;
	developerName: string;
	websiteName: string;
	websiteUrl: string;
	inviteUrl: string;
}

export default function ClientInviteEmail({
	clientName,
	developerName,
	websiteName,
	websiteUrl,
	inviteUrl,
}: ClientInviteEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>
					{developerName} invited you to give feedback on {websiteName}
				</Preview>
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
									You're Invited! 🎉
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									Hi <strong>{clientName}</strong>! {developerName} has invited
									you to collaborate on <strong>{websiteName}</strong> using
									Reviseo.
								</Text>

								{/* Website Info Card */}
								<Section className="bg-[#f9fafb] rounded-[8px] p-[20px] mb-[24px] border border-solid border-[#e5e7eb]">
									<Text className="text-[#6b7280] text-[12px] mb-[4px] leading-[16px] uppercase tracking-wide">
										Website
									</Text>
									<Text className="text-[#111827] text-[16px] font-semibold mb-[4px] leading-[24px]">
										{websiteName}
									</Text>
									<Link
										href={websiteUrl}
										className="text-[#9c40ff] text-[14px] font-mono leading-[20px] break-all"
									>
										{websiteUrl}
									</Link>
								</Section>

								<Text className="text-[#374151] text-[14px] mb-[24px] leading-[20px]">
									{developerName} wants to make getting your feedback easier.
									With Reviseo, you can click the widget and a screenshot will
									show up which you can annotate to explain in detail what you
									want {developerName} to change. Simply click, annotate, and
									submit. No more confusing email threads!
								</Text>

								{/* CTA Button */}
								<Section className="mb-[24px]">
									<Button
										href={inviteUrl}
										className="bg-[#9c40ff] text-[#ffffff] px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium no-underline text-center box-border w-full"
									>
										Accept Invitation
									</Button>
								</Section>

								<Text className="text-[#6b7280] text-[12px] mb-[8px] leading-[16px] text-center">
									Or copy this link into your browser:
								</Text>
								<Section className="bg-[#f9fafb] rounded-[8px] p-[12px] mb-[24px] border border-solid border-[#e5e7eb]">
									<Link
										href={inviteUrl}
										className="text-[#9c40ff] text-[12px] font-mono leading-[16px] break-all"
									>
										{inviteUrl}
									</Link>
								</Section>

								<Section className="bg-[#fef2f2] rounded-[8px] p-[16px] border border-solid border-[#fee2e2]">
									<Text className="text-[#374151] text-[12px] leading-[18px] m-0">
										💡 <strong>Tip:</strong> Once you accept, you'll be able to
										give feedback on any page of {websiteName} by clicking on
										the feedback widget. Make sure you're logged into{" "}
										<Link
											href="https://reviseo.app"
											className="text-[#9c40ff] no-underline"
										>
											Reviseo
										</Link>{" "}
										and have{" "}
										<Link
											href="https://reviseo.app/blog/cookies"
											className="text-[#9c40ff] underline"
										>
											third party cookies enabled
										</Link>
										!
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

export const PreviewProps: ClientInviteEmailProps = {
	clientName: "Nicole",
	developerName: "Maytham",
	inviteUrl: 'https://reviseo.app/invite?token="abc"&clientName=asdf',
	websiteName: "One Life Counseling",
	websiteUrl: "https://onelifecounseling.net",
};
