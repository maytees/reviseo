/** biome-ignore-all lint/a11y/useValidAnchor: mock website */
import { Check, Shield, Star, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "./components/ui/button";

import FeedbackWidget from "./FeedbackWidget";

const App = () => {
	return (
		<div>
			<div className="min-h-screen bg-background relative">
				{/* Gradient Background */}
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
				<div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />

				{/* Header */}
				<header className="border-b backdrop-blur-sm bg-background/80 relative z-10">
					<div className="container mx-auto px-4 py-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
								<Zap className="w-6 h-6 text-white" />
							</div>
							<span className="font-bold text-xl">Acme</span>
						</div>
						<nav className="hidden md:flex items-center gap-6">
							<a
								href="#"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Features
							</a>
							<a
								href="#"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Pricing
							</a>
							<a
								href="#"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Docs
							</a>
							<a
								href="#"
								className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
							>
								Blog
							</a>
						</nav>
						<div className="flex items-center gap-2">
							<Button variant="ghost" className="px-4 py-2 text-sm font-medium">
								Sign In
							</Button>
							<Button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
								Get Started
							</Button>
						</div>
					</div>
				</header>

				{/* Hero Section */}
				<main className="container w-full mx-auto px-4 py-16 md:py-24 relative z-10">
					<div className="max-w-6xl mx-auto">
						{/* Hero Content */}
						<div className="text-center mb-16">
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
								<Star className="w-4 h-4" />
								Trusted by 10,000+ developers
							</div>
							<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
								Building your SaaS just got unfairly easy
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
								Why spend valuable time learning how to build complex
								infrastructure when you can focus on building your business and
								shipping features that matter.
							</p>
							<div className="flex flex-wrap gap-4 justify-center mb-12">
								<Button size="lg" className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
									Access Entire SaaS
								</Button>
								<Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent">
									See Demo →
								</Button>
							</div>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border shadow-lg">
								<div className="text-4xl font-bold mb-2">
									99.9%
								</div>
								<div className="text-sm text-muted-foreground">Uptime Guarantee</div>
							</div>
							<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border shadow-lg">
								<div className="text-4xl font-bold mb-2">
									10k+
								</div>
								<div className="text-sm text-muted-foreground">Active Users</div>
							</div>
							<div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border shadow-lg">
								<div className="text-4xl font-bold mb-2">
									24/7
								</div>
								<div className="text-sm text-muted-foreground">Support Available</div>
							</div>
						</div>

						{/* Tabs */}
						<div className="mb-6 w-full">
							<div className="flex w-full flex-wrap gap-4 border-b backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-t-xl p-2">
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30"
								>
									Minimal
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									Modern Pack
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									Earth Tones
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									GPTChat
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									Dashboard
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
								>
									Learn
								</Button>
							</div>
						</div>

						{/* Mock Image */}
						<div className="rounded-2xl border-2 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-2xl w-full mb-16">
							<img
								src="https://placehold.co/1200x800/e2e8f0/64748b?text=Dashboard+Preview"
								alt="Dashboard Preview"
								className="w-full h-auto"
							/>
						</div>

						{/* Features Section */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
							<div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border shadow-lg">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
									<TrendingUp className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
								<p className="text-muted-foreground">
									Built with performance in mind. Experience blazing fast load times and smooth interactions.
								</p>
							</div>
							<div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border shadow-lg">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
									<Shield className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">Secure by Default</h3>
								<p className="text-muted-foreground">
									Enterprise-grade security built in. Your data is encrypted and protected at all times.
								</p>
							</div>
							<div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border shadow-lg">
								<div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
									<Users className="w-6 h-6 text-white" />
								</div>
								<h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
								<p className="text-muted-foreground">
									Work together seamlessly. Invite your team and collaborate in real-time.
								</p>
							</div>
						</div>

						{/* Pricing Section */}
						<div className="text-center mb-12">
							<h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
							<p className="text-lg text-muted-foreground mb-12">
								Choose the plan that's right for you
							</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								<div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border shadow-lg hover:shadow-xl transition-shadow">
									<h3 className="text-2xl font-bold mb-2">Starter</h3>
									<div className="text-4xl font-bold mb-4">
										$29<span className="text-lg text-muted-foreground">/mo</span>
									</div>
									<ul className="space-y-3 mb-8 text-left">
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Up to 10 projects</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Basic analytics</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Email support</span>
										</li>
									</ul>
									<Button variant="outline" className="w-full">
										Get Started
									</Button>
								</div>
								<div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl transition-shadow transform scale-105">
									<div className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
										Most Popular
									</div>
									<h3 className="text-2xl font-bold mb-2">Pro</h3>
									<div className="text-4xl font-bold mb-4">
										$79<span className="text-lg opacity-80">/mo</span>
									</div>
									<ul className="space-y-3 mb-8 text-left">
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5" />
											<span>Unlimited projects</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5" />
											<span>Advanced analytics</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5" />
											<span>Priority support</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5" />
											<span>Custom integrations</span>
										</li>
									</ul>
									<Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">
										Get Started
									</Button>
								</div>
								<div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border shadow-lg hover:shadow-xl transition-shadow">
									<h3 className="text-2xl font-bold mb-2">Enterprise</h3>
									<div className="text-4xl font-bold mb-4">
										Custom
									</div>
									<ul className="space-y-3 mb-8 text-left">
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Everything in Pro</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Dedicated support</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>Custom SLA</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="w-5 h-5 text-green-500" />
											<span>On-premise option</span>
										</li>
									</ul>
									<Button variant="outline" className="w-full">
										Contact Sales
									</Button>
								</div>
							</div>
						</div>
					</div>
				</main>

				{/* Footer */}
				<footer className="border-t backdrop-blur-sm bg-background/80 relative z-10 py-12">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
							<div>
								<div className="flex items-center gap-2 mb-4">
									<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
										<Zap className="w-5 h-5 text-white" />
									</div>
									<span className="font-bold">Acme</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Building the future of SaaS development.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-4">Product</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li><a href="#" className="hover:text-foreground">Features</a></li>
									<li><a href="#" className="hover:text-foreground">Pricing</a></li>
									<li><a href="#" className="hover:text-foreground">Changelog</a></li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-4">Resources</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li><a href="#" className="hover:text-foreground">Documentation</a></li>
									<li><a href="#" className="hover:text-foreground">Blog</a></li>
									<li><a href="#" className="hover:text-foreground">Support</a></li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold mb-4">Company</h4>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li><a href="#" className="hover:text-foreground">About</a></li>
									<li><a href="#" className="hover:text-foreground">Careers</a></li>
									<li><a href="#" className="hover:text-foreground">Contact</a></li>
								</ul>
							</div>
						</div>
						<div className="border-t pt-8 text-center text-sm text-muted-foreground">
							© 2024 Acme. All rights reserved.
						</div>
					</div>
				</footer>
			</div>
			<FeedbackWidget />
		</div>
	);
};

export default App;
