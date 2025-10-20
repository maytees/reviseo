import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
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
		<Html>
			<Head />
			<Preview>
				{developerName} invited you to give feedback on {websiteName}
			</Preview>
			<Tailwind>
				<Body className="font-sans">
					<Container className="px-4 py-12 mx-auto">
						{/* Main Card */}
						<Section
							className="border-solid border-gray-200 border-2 max-w-md mx-auto text-left bg-white rounded-2xl overflow-hidden"
							style={{
								boxShadow:
									"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
							}}
						>
							{/* Header */}
							<Section
								className="px-8 pt-8 pb-6"
								style={{
									backgroundColor: "#6538e0",
								}}
							>
								<Img
									src="https://reviseo.app/logo.png"
									width="40"
									height="40"
									alt="Reviseo"
									className="mb-4"
								/>
								<Text className="m-0 text-2xl font-bold text-white">
									You&apos;re Invited!
								</Text>
								<Text className="m-0 mt-2 text-sm text-white/80">
									Share your feedback with Reviseo
								</Text>
							</Section>

							{/* Content */}
							<Section className="px-8 py-8">
								<Text className="mb-4 text-base text-gray-700">
									Hi <strong>{clientName}</strong>,
								</Text>

								<Text className="mb-6 text-base text-gray-700">
									<strong>{developerName}</strong> has invited you to{" "}
									<em>Reviseo</em>.
								</Text>

								{/* Website Info Box */}
								<Section
									className="mb-6 p-3.5 rounded-lg"
									style={{
										backgroundColor: "#f4f6f3",
										border: "1px solid #dfe2dc",
									}}
								>
									<Text className="m-0 mb-1 text-xs text-gray-500 uppercase tracking-wide">
										Website
									</Text>
									<Text className="m-0 mb-0 text-sm font-semibold text-gray-900">
										{websiteName}
									</Text>
									<Link href={websiteUrl} className="m-0 text-sm  break-all">
										{websiteUrl}
									</Link>
								</Section>

								<Text className="mb-6 text-sm text-gray-600">
									{/* With Reviseo, you can click anywhere on the website, draw
									annotations, and send feedback directly to {developerName}.
									It&apos;s fast, visual, and easy. */}
									{developerName} wants to make getting your feedback easier.
									With Reviseo, you can point directly at what needs to change
									on your website. Just click, annotate, and submit.
								</Text>

								{/* CTA Button */}
								<Section className="text-center mb-6">
									<Button
										href={inviteUrl}
										className="w-full py-2 text-base font-semibold text-white rounded-lg"
										style={{
											backgroundColor: "#6538e0",
											boxShadow:
												"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
										}}
									>
										Accept Invitation
									</Button>
								</Section>

								<Text className="mb-4 text-sm text-gray-500 text-center">
									Or click this link into your browser:
								</Text>
								<Container
									style={{
										backgroundColor: "#f4f6f3",
										border: "1px solid #dfe2dc",
									}}
									className="mb-6 rounded-xl  p-3"
								>
									<Link className="text-xs break-all" href={inviteUrl}>
										{inviteUrl}
									</Link>
								</Container>

								<Section
									className="p-4 rounded-lg"
									style={{
										backgroundColor: "#f0d6d6",
										border: "1px solid #dfe2dc",
									}}
								>
									<Text className="m-0 text-xs text-gray-600">
										💡 <strong>Tip:</strong> Once you accept, you&apos;ll be
										able to give feedback on any page of {websiteName} by
										clicking on the feedback widget. You must be logged into{" "}
										<Link href={"https://reviseo.app"}>Reviseo</Link>
									</Text>
								</Section>
							</Section>
						</Section>

						{/* Footer */}
						<Section className="mt-8 text-center">
							<Text className="m-0 mb-2 text-xs text-gray-400">
								This invitation was sent by {developerName} via Reviseo
							</Text>
							<Text className="m-0 mb-2 text-xs text-gray-400">
								© 2025 Reviseo. All rights reserved.
							</Text>
							<Text className="m-0 text-xs text-gray-500">
								Visual feedback, simplified.
							</Text>
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
	inviteUrl: 'https://reviseo.app/invite?token="abc"',
	websiteName: "One Life Counseling",
	websiteUrl: "https://onelifecounseling.net",
};
