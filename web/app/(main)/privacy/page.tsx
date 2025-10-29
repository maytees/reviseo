import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = {
	title: "Privacy Policy",
};

export default function PrivacyPage() {
	return (
		<div className="relative w-full min-h-screen overflow-x-hidden">
			<div className="sticky z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div>

			<article className="max-w-4xl px-4 py-24 mx-auto mt-32 sm:px-6 md:px-8">
				<h1 className="text-4xl font-bold sm:text-5xl md:text-6xl font-caudex">
					Privacy Policy
				</h1>
				<p className="mt-4 text-sm text-muted-foreground">
					<strong>Last updated:</strong> October 29, 2025
				</p>

				<div className="mt-12 space-y-8 prose prose-neutral dark:prose-invert max-w-none">
					<p className="text-lg leading-relaxed">
						Reviseo ("we," "our," or "us") provides tools that help web
						developers collect feedback from their clients. This Privacy Policy
						explains how we collect, use, and protect your information when you
						use{" "}
						<a
							href="https://reviseo.app"
							className="text-primary hover:underline"
						>
							https://reviseo.app
						</a>{" "}
						or our related services.
					</p>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							1. Information We Collect
						</h2>
						<p className="leading-relaxed">
							We collect the following types of information:
						</p>
						<ul className="space-y-2 list-disc list-inside">
							<li>
								<strong>Account Information:</strong> When you sign up, we
								collect your name and email address. You can sign in using
								Google, GitHub, or email one-time passwords (no passwords are
								stored).
							</li>
							<li>
								<strong>Payment Information:</strong> Payments are handled
								securely through{" "}
								<a
									href="https://polar.sh"
									className="text-primary hover:underline"
								>
									Polar.sh
								</a>{" "}
								and Stripe. We do not store your full payment details, though
								Polar and Stripe may keep billing data as required for legal or
								tax purposes.
							</li>
							<li>
								<strong>Cookies and Authentication:</strong> We use cookies —
								including third-party cookies — to manage login sessions and to
								let clients access the Reviseo widget on their websites.
							</li>
							<li>
								<strong>Analytics:</strong> We may use analytics tools such as
								Plausible and PostHog to understand usage and improve Reviseo.
								These services collect anonymous usage data.
							</li>
							<li>
								<strong>Communications:</strong> If you join a waitlist or agree
								to updates, we may send you newsletters or marketing emails. You
								can unsubscribe anytime.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							2. How We Use Your Information
						</h2>
						<p className="leading-relaxed">We use your information to:</p>
						<ul className="space-y-2 list-disc list-inside">
							<li>Provide and improve the Reviseo service</li>
							<li>Process payments and manage subscriptions</li>
							<li>Authenticate users and manage sessions</li>
							<li>Send service updates and optional newsletters</li>
							<li>Comply with legal and tax obligations</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							3. Data Sharing
						</h2>
						<p className="leading-relaxed">
							We share information only with trusted third parties necessary to
							operate Reviseo:
						</p>
						<ul className="space-y-2 list-disc list-inside">
							<li>
								<strong>BetterAuth</strong> (authentication)
							</li>
							<li>
								<strong>Polar.sh / Stripe</strong> (payments)
							</li>
							<li>
								<strong>Plausible / PostHog</strong> (analytics, when enabled)
							</li>
						</ul>
						<p className="mt-4 leading-relaxed">
							We do <strong>not</strong> sell your personal data to anyone.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							4. Data Retention and Deletion
						</h2>
						<p className="leading-relaxed">
							If you delete your account, your personal data is removed
							immediately. Billing and payment records may be retained as
							required by tax or financial laws.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							5. International Users
						</h2>
						<p className="leading-relaxed">
							Reviseo primarily operates in the United States but may be
							accessed worldwide. We comply with applicable privacy laws,
							including GDPR, when required.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							6. Children's Privacy
						</h2>
						<p className="leading-relaxed">
							Reviseo is designed for adults and professionals. We do not
							knowingly collect data from anyone under 18.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							7. Your Rights
						</h2>
						<p className="leading-relaxed">You can:</p>
						<ul className="space-y-2 list-disc list-inside">
							<li>Access or delete your personal data</li>
							<li>Opt out of marketing emails</li>
							<li>Contact us for privacy-related requests</li>
						</ul>
						<p className="mt-4 leading-relaxed">
							You can reach us anytime through our contact form:{" "}
							<a href="/#contact" className="text-primary hover:underline">
								https://reviseo.app/#contact
							</a>
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold sm:text-3xl font-caudex">
							8. Changes to This Policy
						</h2>
						<p className="leading-relaxed">
							We may update this Privacy Policy occasionally. The latest version
							will always be available at{" "}
							<a href="/privacy" className="text-primary hover:underline">
								https://reviseo.app/privacy
							</a>
							.
						</p>
					</section>
				</div>
			</article>

			<Footer />
		</div>
	);
}
