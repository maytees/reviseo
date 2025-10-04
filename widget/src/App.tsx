import { Zap } from "lucide-react";
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
							<a href="#" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
							<a href="#" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
							<a href="#" className="text-sm text-muted-foreground hover:text-foreground">Docs</a>
							<a href="#" className="text-sm text-muted-foreground hover:text-foreground">Blog</a>
						</nav>
						<div className="flex items-center gap-2">
							<button className="px-4 py-2 text-sm">Sign In</button>
							<button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Get Started</button>
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
							Why spend valuable time learning how to build complex infrastructure when you can focus on building your business and shipping features.
						</p>
						<div className="flex flex-wrap gap-4 mb-12">
							<button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium">
								Access Entire SaaS
							</button>
							<button className="px-6 py-3 border rounded-md hover:bg-accent font-medium">
								See Demo →
							</button>
						</div>
						{/* Tabs */}
						<div className="mb-6">
							<div className="flex flex-wrap gap-4 border-b">
								<button className="px-4 py-2 text-sm font-medium border-b-2 border-primary">Minimal</button>
								<button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Modern Pack</button>
								<button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Earth Tones</button>
								<button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">GPTChat</button>
								<button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Dashboard</button>
								<button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Learn</button>
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