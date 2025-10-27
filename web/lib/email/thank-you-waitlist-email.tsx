import {
	Body,
	Container,
	Head,
	Heading,
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
		<Html>
			<Head />
			<Preview>Thank you for joining the Reviseo waitlist!</Preview>
			<Tailwind>
				<Body className="font-sans">
					<Container className="px-4 pt-12 mx-auto my-auto border rounded-lg w-[676px]">
						<Heading className="mb-0">Hey!</Heading>
						<Text className="text-base">
							Thanks for signing up! You're now on the Reviseo waitlist, and we
							couldn't be more excited to have you.
						</Text>
						<Text className="text-base">
							We're working hard to launch something you'll actually want to
							use. No more email threads trying to decode "make it more modern."
						</Text>
						<Text className="text-base">
							Curious what we're up to? Head to our blog for behind-the-scenes
							updates and client management tips.
						</Text>
					</Container>
					<Row className="w-[576px]">
						<Hr className="!border-gray-300 my-[16px]" />
						<Section className="mt-[5px] inline-block max-h-[32px] max-w-[32px] text-left">
							<Img
								alt="Reviseo Logo"
								className="rounded-none"
								height={48}
								src="https://www.reviseo.app/logo48.png"
								width={48}
							/>
						</Section>
						<Section className="ml-[18px] inline-block max-w-[120px] text-left align-top">
							<Heading
								as="h3"
								className="m-[0px] font-medium text-[14px] text-gray-800 leading-[20px]"
							>
								Thank you,
							</Heading>
							<Text className="m-[0px] font-medium text-[12px] text-gray-500 leading-[14px]">
								The Reviseo team
							</Text>
							<Section className="mt-[4px]">
								<Link
									className="inline-flex h-[12px] w-[12px]"
									href="https://www.linkedin.com/company/reviseoapp"
								>
									<Img
										alt="LinkedIn"
										src="https://react.email/static/in-icon.png"
										style={{ height: "12px", width: "12px" }}
									/>
								</Link>
							</Section>
						</Section>
					</Row>
				</Body>
			</Tailwind>
		</Html>
	);
}
