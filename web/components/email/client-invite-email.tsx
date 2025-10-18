import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
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
              className="max-w-md mx-auto text-left bg-white rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Header */}
              <Section
                className="px-8 pt-8 pb-6"
                style={{
                  backgroundColor: "oklch(0.5053 0.2350 286.8637)",
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
                  Hi {clientName},
                </Text>

                <Text className="mb-6 text-base text-gray-700">
                  <strong>{developerName}</strong> has invited you to give
                  visual feedback on their website{" "}
                  <strong>{websiteName}</strong>.
                </Text>

                {/* Website Info Box */}
                <Section
                  className="mb-6 p-4 rounded-lg"
                  style={{
                    backgroundColor: "oklch(0.9708 0.0045 134.8496)",
                    border: "1px solid oklch(0.9088 0.0087 128.5670)",
                  }}
                >
                  <Text className="m-0 mb-1 text-xs text-gray-500 uppercase tracking-wide">
                    Website
                  </Text>
                  <Text className="m-0 mb-2 text-base font-semibold text-gray-900">
                    {websiteName}
                  </Text>
                  <Text className="m-0 text-sm text-gray-600 break-all">
                    {websiteUrl}
                  </Text>
                </Section>

                <Text className="mb-6 text-sm text-gray-600">
                  With Reviseo, you can click anywhere on the website, draw
                  annotations, and send feedback directly to {developerName}.
                  It&apos;s fast, visual, and easy.
                </Text>

                {/* CTA Button */}
                <Section className="text-center mb-6">
                  <Button
                    href={inviteUrl}
                    className="px-6 py-3 text-base font-semibold text-white rounded-lg inline-block no-underline"
                    style={{
                      backgroundColor: "oklch(0.5053 0.2350 286.8637)",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    Accept Invitation
                  </Button>
                </Section>

                <Text className="mb-4 text-xs text-gray-500 text-center">
                  Or copy and paste this link into your browser:
                </Text>
                <Text
                  className="mb-6 text-xs text-gray-600 text-center break-all"
                  style={{
                    padding: "8px 12px",
                    background: "#f9fafb",
                    borderRadius: "6px",
                    fontFamily: "monospace",
                  }}
                >
                  {inviteUrl}
                </Text>

                <Section
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "oklch(0.8975 0.0290 17.7043)",
                    border: "1px solid oklch(0.9088 0.0087 128.5670)",
                  }}
                >
                  <Text className="m-0 text-xs text-gray-600">
                    💡 <strong>Tip:</strong> Once you accept, you&apos;ll be
                    able to give feedback on any page of {websiteName} by
                    clicking on elements and adding comments.
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
