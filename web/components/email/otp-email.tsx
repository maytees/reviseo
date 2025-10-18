import {
  Body,
  CodeInline,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function OtpEmail({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for Reviseo</Preview>
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
                  Verify Your Email
                </Text>
                <Text className="m-0 mt-2 text-sm text-white/80">
                  Welcome to Reviseo
                </Text>
              </Section>

              {/* Content */}
              <Section className="px-8 py-8">
                <Text className="mb-6 text-base text-gray-700">
                  Hi there! Enter this verification code to sign in to your
                  account:
                </Text>

                {/* OTP Code Box */}
                <Section
                  className="mb-6 p-6 rounded-xl text-center"
                  style={{
                    backgroundColor: "oklch(0.9708 0.0045 134.8496)",
                    border: "2px dashed oklch(0.5053 0.2350 286.8637)",
                  }}
                >
                  <CodeInline
                    className="font-mono text-4xl font-bold tracking-[0.5em]"
                    style={{
                      color: "oklch(0.5053 0.2350 286.8637)",
                    }}
                  >
                    {otp}
                  </CodeInline>
                </Section>

                <Text className="mb-2 text-sm text-gray-600">
                  <strong>Email:</strong> {email}
                </Text>
                <Text className="mb-4 text-xs text-gray-500">
                  This code expires in 10 minutes. If you didn&apos;t request
                  this, please ignore this email.
                </Text>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="mt-8 text-center">
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
