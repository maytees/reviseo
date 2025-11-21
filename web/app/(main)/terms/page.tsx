import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export const metadata: Metadata = {
	title: "Terms of Service",
};

export default function TermsPage() {
	return (
		<div className="relative min-h-screen w-full overflow-x-hidden">
			<div className="sticky top-4 z-50 flex w-full items-center justify-center px-2 pt-6 sm:px-4 md:px-6">
				<Navbar />
			</div>

			<article className="mx-auto mt-32 max-w-4xl px-4 py-24 sm:px-6 md:px-8">
				<h1 className="font-bold font-caudex text-4xl sm:text-5xl md:text-6xl">
					Terms of Service
				</h1>
				<p className="mt-4 text-muted-foreground text-sm">
					<strong>Last updated:</strong> October 29, 2025
				</p>

				<div className="prose prose-neutral dark:prose-invert mt-12 max-w-none space-y-8">
					<p className="text-lg leading-relaxed">
						These Terms of Service ("Terms") govern your use of Reviseo,
						provided by Maytham Ajam (CTO) & Ansh Seghal (CEO) ("we," "our," or
						"us"). By signing up or using Reviseo at{" "}
						<a
							href="https://reviseo.app"
							className="text-primary hover:underline"
						>
							https://reviseo.app
						</a>
						, you agree to these Terms.
					</p>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							1. Early Access / Beta
						</h2>
						<p className="leading-relaxed">
							Reviseo is currently in early access/waitlist mode. Features may
							change, be delayed, or be unavailable. By using Reviseo, you
							acknowledge that the service is experimental and provided "as-is."
						</p>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							2. Account Eligibility
						</h2>
						<ul className="list-inside list-disc space-y-2">
							<li>You must be at least 18 years old.</li>
							<li>
								Accounts are for individual use only. Sharing your account with
								others is not allowed.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							3. Account Information
						</h2>
						<ul className="list-inside list-disc space-y-2">
							<li>
								You are responsible for keeping your login credentials secure.
							</li>
							<li>
								You agree to provide accurate information when signing up.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							4. Payments
						</h2>
						<ul className="list-inside list-disc space-y-2">
							<li>
								All payments are processed via{" "}
								<a
									href="https://polar.sh"
									className="text-primary hover:underline"
								>
									Polar.sh
								</a>
								.
							</li>
							<li>Refunds and cancellations follow Polar's policies.</li>
							<li>
								You are responsible for taxes associated with any payments.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							5. Acceptable Use
						</h2>
						<p className="leading-relaxed">You may not use Reviseo to:</p>
						<ul className="list-inside list-disc space-y-2">
							<li>Violate any laws or regulations</li>
							<li>Spam, harass, or harm others</li>
							<li>Attempt to disrupt, hack, or reverse-engineer the service</li>
							<li>Misuse the widget or analytics data</li>
						</ul>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							6. Limitation of Liability
						</h2>
						<ul className="list-inside list-disc space-y-2">
							<li>Reviseo is provided "as-is" without warranties.</li>
							<li>
								We are not liable for lost data, downtime, or other damages
								arising from your use.
							</li>
							<li>Your use of Reviseo is at your own risk.</li>
						</ul>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							7. Changes to Terms
						</h2>
						<p className="leading-relaxed">
							We may update these Terms at any time. We will notify users via
							email or on the website. Continued use after changes constitutes
							acceptance of the updated Terms.
						</p>
					</section>

					<section>
						<h2 className="font-bold font-caudex text-2xl sm:text-3xl">
							8. Contact
						</h2>
						<p className="leading-relaxed">
							For questions about these Terms, contact us via the contact form:{" "}
							<Link href="/#contact" className="text-primary hover:underline">
								https://reviseo.app/#contact
							</Link>
						</p>
					</section>
				</div>
			</article>

			<Footer />
		</div>
	);
}
