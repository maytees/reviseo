import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Row,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface OrgInviteEmailProps {
	organizationName: string;
	inviterName: string;
	inviterEmail: string;
	inviteUrl: string;
}

export default function OrgInviteEmail({
	organizationName,
	inviterName,
	inviterEmail,
	inviteUrl,
}: OrgInviteEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>
					{inviterName} invited you to join {organizationName} on Reviseo
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
									Join {organizationName}
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									<strong>{inviterName}</strong> ({inviterEmail}) has invited
									you to join the <strong>{organizationName}</strong> workspace
									on Reviseo — collect and manage visual feedback together.
								</Text>

								<Section className="mb-[24px] text-center">
									<Button
										href={inviteUrl}
										className="rounded-[8px] bg-[#9c40ff] px-[32px] py-[14px] font-semibold text-[#ffffff] text-[16px] no-underline"
									>
										Accept Invitation
									</Button>
								</Section>

								<Text className="mb-[24px] text-[#6b7280] text-[14px] leading-[20px]">
									This invitation will expire in 48 hours. If you weren't
									expecting it, you can safely ignore this email.
								</Text>
							</Section>

							<Hr className="my-[24px] border-[#e5e7eb]" />

							<Text className="text-[#9ca3af] text-[12px] leading-[16px]">
								Sent by Reviseo — visual feedback for web teams.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
