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

export default function ThankYouWaitlistEmail() {
	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>Thank you for joining the Reviseo waitlist!</Preview>
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
									Hey! 👋
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									Thanks for signing up! You're now on the Reviseo waitlist, and
									we couldn't be more excited to have you.
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									We're working hard to launch something you'll actually want to
									use. No more email threads trying to decode "make it more
									modern."
								</Text>

								<Text className="mb-[24px] text-[#374151] text-[16px] leading-[24px]">
									Curious what we're up to? Head to our{" "}
									<Link
										href="https://reviseo.app/blog"
										className="text-[#9c40ff] no-underline"
									>
										blog
									</Link>{" "}
									for behind the scenes updates and client management tips.
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
