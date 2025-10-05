/** biome-ignore-all lint/a11y/useValidAnchor: mock website */
import { Zap } from "lucide-react";
import { Button } from "./components/ui/button";

import FeedbackWidget from "./FeedbackWidget";

const App = () => {
	return (
		<div>
			<div className="min-h-screen bg-background">
				{/* Header */}
				<header className="border-b">
					<div className="container mx-auto px-4 py-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Zap className="w-6 h-6 text-primary" />
							<span className="font-semibold">Acme</span>
						</div>
						<nav className="hidden md:flex items-center gap-6">
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Features
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Pricing
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Docs
							</a>
							<a
								href="#"
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								Blog
							</a>
						</nav>
						<div className="flex items-center gap-2">
							<Button variant="ghost" className="px-4 py-2 text-sm">
								Sign In
							</Button>
							<Button className="px-4 py-2 text-sm">Get Started</Button>
						</div>
					</div>
				</header>
				{/* Hero Section */}
				<main className="container mx-auto px-4 py-16 md:py-24">
					<div className="max-w-3xl">
						<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
							Building your SaaS just got unfairly easy
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
							Why spend valuable time learning how to build complex
							infrastructure when you can focus on building your business and
							shipping features.
						</p>
						<div className="flex flex-wrap gap-4 mb-12">
							<Button size="lg" className="px-6 py-3">
								Access Entire SaaS
							</Button>
							<Button size="lg" variant="outline" className="px-6 py-3">
								See Demo →
							</Button>
						</div>
						{/* Tabs */}
						<div className="mb-6">
							<div className="flex flex-wrap gap-4 border-b">
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm font-medium border-b-2 border-primary"
								>
									Minimal
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
								>
									Modern Pack
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
								>
									Earth Tones
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
								>
									GPTChat
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
								>
									Dashboard
								</Button>
								<Button
									variant="ghost"
									className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
								>
									Learn
								</Button>
							</div>
						</div>
						{/* Mock Image */}
						<div className="rounded-lg border bg-card shadow-2xl overflow-hidden w-full">
							<img
								src="https://placehold.co/1200x800/e2e8f0/64748b?text=Dashboard+Preview"
								alt="Dashboard Preview"
								className="w-full h-auto"
							/>
						</div>
					</div>
				</main>
			</div>
			<FeedbackWidget />
		</div>
	);
};

export default App;
