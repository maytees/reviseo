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
									You're Invited! 🎉
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									Hi <strong>{clientName}</strong>! {developerName} has invited
									you to collaborate on <strong>{websiteName}</strong> using
									Reviseo.
								</Text>

								{/* Website Info Card */}
								<Section className="mb-[24px] rounded-[8px] border border-[#e5e7eb] border-solid bg-[#f9fafb] p-[20px]">
									<Text className="mb-[4px] text-[#6b7280] text-[12px] uppercase leading-[16px] tracking-wide">
										Website
									</Text>
									<Text className="mb-[4px] font-semibold text-[#111827] text-[16px] leading-[24px]">
										{websiteName}
									</Text>
									<Link
										href={websiteUrl}
										className="break-all font-mono text-[#9c40ff] text-[14px] leading-[20px]"
									>
										{websiteUrl}
									</Link>
								</Section>

								<Text className="mb-[24px] text-[#374151] text-[14px] leading-[20px]">
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
										className="box-border w-full rounded-[6px] bg-[#9c40ff] px-[24px] py-[12px] text-center font-medium text-[#ffffff] text-[14px] no-underline"
									>
										Accept Invitation
									</Button>
								</Section>

								<Text className="mb-[8px] text-center text-[#6b7280] text-[12px] leading-[16px]">
									Or copy this link into your browser:
								</Text>
								<Section className="mb-[24px] rounded-[8px] border border-[#e5e7eb] border-solid bg-[#f9fafb] p-[12px]">
									<Link
										href={inviteUrl}
										className="break-all font-mono text-[#9c40ff] text-[12px] leading-[16px]"
									>
										{inviteUrl}
									</Link>
								</Section>

								<Section className="rounded-[8px] border border-[#fee2e2] border-solid bg-[#fef2f2] p-[16px]">
									<Text className="m-0 text-[#374151] text-[12px] leading-[18px]">
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

export const PreviewProps: ClientInviteEmailProps = {
	clientName: "Nicole",
	developerName: "Maytham",
	inviteUrl: 'https://reviseo.app/invite?token="abc"&clientName=asdf',
	websiteName: "One Life Counseling",
	websiteUrl: "https://onelifecounseling.net",
};
