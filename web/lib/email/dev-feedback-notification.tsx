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

interface FeedbackNotificationEmailProps {
	developerName: string;
	feedbackTitle: string;
	feedbackType: string;
	priority: string;
	pageUrl: string;
	description: string;
	submittedAt: string;
	websiteName: string;
	feedbackUrl: string;
	allFeedbackUrl: string;
	dashboardUrl: string;
}

const FeedbackNotificationEmail = (props: FeedbackNotificationEmailProps) => {
	const {
		developerName,
		feedbackTitle,
		feedbackType,
		priority,
		pageUrl,
		description,
		submittedAt,
		websiteName,
		feedbackUrl,
		allFeedbackUrl,
		dashboardUrl,
	} = props;

	const getTypeIcon = (type: string) => {
		return type?.toLowerCase() === "bug" ? "🐛" : "✨";
	};

	const getPriorityIcon = (priorityLevel: string) => {
		switch (priorityLevel?.toLowerCase()) {
			case "high":
				return "🔴";
			case "medium":
				return "⚠️";
			case "low":
				return "🟢";
			default:
				return "⚪";
		}
	};

	const getTypeBadgeStyles = (type: string) => {
		const isBug = type?.toLowerCase() === "bug";
		return {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "4px 8px",
			borderRadius: "6px",
			fontSize: "12px",
			fontWeight: "500",
			backgroundColor: isBug ? "#fef2f2" : "#f5f3ff",
			color: isBug ? "#b91c1c" : "#6d28d9",
			border: "1px solid",
			borderColor: isBug ? "#fee2e2" : "#ede9fe",
		};
	};

	const getPriorityBadgeStyles = (priorityLevel: string) => {
		const level = priorityLevel?.toLowerCase();
		let bgColor = "#f0fdf4";
		let textColor = "#15803d";
		let borderColor = "#dcfce7";

		if (level === "high") {
			bgColor = "#fef2f2";
			textColor = "#b91c1c";
			borderColor = "#fee2e2";
		} else if (level === "medium") {
			bgColor = "#fefce8";
			textColor = "#a16207";
			borderColor = "#fef9c3";
		}

		return {
			display: "inline-flex",
			alignItems: "center",
			gap: "6px",
			padding: "4px 8px",
			borderRadius: "6px",
			fontSize: "12px",
			fontWeight: "500",
			backgroundColor: bgColor,
			color: textColor,
			border: "1px solid",
			borderColor: borderColor,
		};
	};

	return (
		<Html lang="en" dir="ltr">
			<Tailwind>
				<Head />
				<Preview>{websiteName} - New Feedback Submitted</Preview>
				<Body className="bg-[#f9fafb] font-sans py-[40px]">
					<Container className="mx-auto px-[20px] max-w-[600px]">
						<Section className="bg-[#ffffff] rounded-[8px] px-[32px] py-[40px] border border-solid border-[#e5e7eb]">
							{/* Header */}
							<Row>
								<Img
									src="https://reviseo.app/logo.svg"
									alt="Reviseo"
									className="size-10 h-auto mb-[12px]"
								/>
							</Row>

							{/* Main Content */}
							<Section>
								<Text className="text-[#111827] text-[24px] font-bold mb-[8px] leading-[32px]">
									Hey {developerName}! 👋
								</Text>

								<Text className="text-[#374151] text-[16px] mb-[24px] leading-[24px]">
									A client just submitted feedback for{" "}
									<strong>{websiteName}</strong>. Time to make some magic
									happen! ✨
								</Text>

								{/* Feedback Card */}
								<Section className="bg-[#f9fafb] rounded-[8px] p-[24px] py-4 mb-[32px] border border-solid border-[#e5e7eb]">
									<Row className="mb-[12px]">
										<Column>
											<Text className="text-[#111827] truncate max-w-sm text-[18px] font-bold mb-[8px] leading-[24px]">
												{getTypeIcon(feedbackType)} {feedbackTitle}
											</Text>
										</Column>
									</Row>

									<Row className="mb-[12px]">
										<Column className="w-[50%] pr-[8px]">
											<Text className="text-[#6b7280] text-[14px] mb-[8px] leading-[20px]">
												Type
											</Text>
											<div style={getTypeBadgeStyles(feedbackType)}>
												<span>{getTypeIcon(feedbackType)}</span>
												<span style={{ textTransform: "capitalize" }}>
													{feedbackType}
												</span>
											</div>
										</Column>
										<Column className="w-[50%] pl-[8px]">
											<Text className="text-[#6b7280] text-[14px] mb-[8px] leading-[20px]">
												Priority
											</Text>
											<div style={getPriorityBadgeStyles(priority)}>
												<span>{getPriorityIcon(priority)}</span>
												<span style={{ textTransform: "capitalize" }}>
													{priority}
												</span>
											</div>
										</Column>
									</Row>

									<Row>
										<Column>
											<Text className="text-[#6b7280] text-[14px] mb-[4px] leading-[20px]">
												Page
											</Text>
											<Link
												href={pageUrl}
												className="text-[#9c40ff] text-[14px] font-mono leading-[20px]"
											>
												{pageUrl}
											</Link>
										</Column>
									</Row>

									<Row>
										<Column>
											<Text className="text-[#6b7280] text-[14px] mb-[4px] leading-[20px]">
												Description
											</Text>
											<Text className="text-[#374151] text-[14px] leading-[20px]">
												{description}
											</Text>
										</Column>
									</Row>

									<Row>
										<Column>
											<Text className="text-[#6b7280] text-[12px] leading-[16px]">
												Submitted on {submittedAt}
											</Text>
										</Column>
									</Row>
								</Section>

								{/* Action Buttons */}
								<Section className="mb-[32px]">
									<Row>
										<Column className="pr-[8px]">
											<Button
												href={feedbackUrl}
												className="bg-[#9c40ff] text-[#ffffff] px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium no-underline text-center box-border w-full"
											>
												View Feedback
											</Button>
										</Column>
										<Column className="pl-[8px]">
											<Button
												href={allFeedbackUrl}
												className="bg-[#ffffff] text-[#9c40ff] px-[24px] py-[12px] rounded-[6px] text-[14px] font-medium no-underline text-center border border-solid border-[#9c40ff] box-border w-full"
											>
												All Feedback
											</Button>
										</Column>
									</Row>
								</Section>

								<Text className="text-[#6b7280] text-[14px] leading-[20px] mb-[24px]">
									Need to check other projects? Head to your{" "}
									<Link
										href={dashboardUrl}
										className="text-[#9c40ff] no-underline"
									>
										dashboard
									</Link>{" "}
									to see everything at a glance.
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
};

export const PreviewProps = {
	developerName: "Alex",
	feedbackTitle:
		"Button alignment issue on mobile asdfija sdlkfj alksdjf lkasjd fklj",
	feedbackType: "bug",
	priority: "high",
	pageUrl: "website.com/contact",
	description:
		"The submit button appears to be misaligned on mobile devices, particularly on iOS Safari. It's overlapping with the form fields and making it difficult for users to complete the contact form. This seems to affect the conversion rate significantly.",
	submittedAt: "November 13, 2025 at 1:51 AM EST",
	websiteName: "Portfolio Website",
	feedbackUrl: "https://reviseo.app/dashboard/websites/123/feedback/456",
	allFeedbackUrl: "https://reviseo.app/dashboard/websites/123/feedback",
	dashboardUrl: "https://reviseo.app/dashboard",
};

export default FeedbackNotificationEmail;
