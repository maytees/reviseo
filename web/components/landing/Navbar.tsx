"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { BorderBeam } from "../ui/BorderBeam";

interface MenuItem {
	title: string;
	url: string;
	description?: string;
	icon?: React.ReactNode;
	items?: MenuItem[];
}

interface NavbarProps {
	logo?: {
		url: string;
		src: string;
		alt: string;
		title: string;
	};
	menu?: MenuItem[];
	auth?: {
		getStarted: {
			title: string;
			url: string;
		};
	};
}

const Navbar = ({
	logo = {
		url: "/",
		src: "/logo.svg",
		alt: "Reviseo Logo",
		title: "Reviseo",
	},
	menu = [
		{ title: "Home", url: "/" },
		{ title: "Features", url: "/#features" },
		{ title: "Pricing", url: "/#pricing" },
		{ title: "FAQ", url: "/#faq" },
	],
	auth = {
		getStarted: { title: "Get Started", url: "#" },
	},
}: NavbarProps) => {
	const [scrolled, setScrolled] = useState(false);
	const [visible, setVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const onScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollThreshold = window.innerHeight * 0.2;

			setScrolled(currentScrollY > 10);

			if (currentScrollY < scrollThreshold) {
				setVisible(true);
			} else if (currentScrollY > lastScrollY) {
				// Scrolling down
				setVisible(false);
			} else {
				// Scrolling up
				setVisible(true);
			}

			setLastScrollY(currentScrollY);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [lastScrollY]);

	return (
		<section
			className={cn(
				"py-4 px-4 max-w-7xl rounded-3xl backdrop-blur-sm shadow-[inset_0_4px_8px_0_rgba(0,0,0,0.3)] md:px-16 lg:px-28 xl:px-32 w-full transition-all duration-300",
				scrolled ? "bg-background/30" : "bg-background/70",
				visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
			)}
		>
			{/* Desktop Menu */}
			<nav className="hidden justify-between lg:flex w-full items-center">
				{/* Logo */}
				<Link href={logo.url} className="flex items-center gap-1">
					<Image src={logo.src} width={32} height={32} alt={logo.alt} />
					<h1 className="text-4xl font-bold font-caudex">{logo.title}</h1>
				</Link>

				{/* Centered Navigation Links */}
				<div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
					<NavigationMenu>
						<NavigationMenuList>
							{menu.map((item) => renderMenuItem(item))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{/* CTA Button */}
				<div className="flex gap-2">
					<Button asChild size="lg" variant={"inset"}>
						<Link className="relative" href={auth.getStarted.url}>
							{auth.getStarted.title}
							<BorderBeam
								delay={3}
								duration={2}
								borderWidth={2}
								className="from-accent to-primary"
							/>
						</Link>
					</Button>
				</div>
			</nav>

			{/* Mobile Menu */}
			<div className="lg:hidden  w-full">
				<div className="flex items-center justify-between w-full">
					{/* Logo */}
					<Link href={logo.url} className="flex items-center gap-2">
						<Image src={logo.src} width={32} height={32} alt={logo.alt} />
						<h1 className="text-4xl font-bold font-caudex">{logo.title}</h1>
					</Link>
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="outline" size="lg" mode={"icon"}>
								<Menu />
							</Button>
						</SheetTrigger>
						<SheetContent className="overflow-y-auto">
							<SheetHeader>
								<SheetTitle>
									<Link href={logo.url} className="flex items-center gap-2">
										<Image
											src={logo.src}
											width={32}
											height={32}
											alt={logo.alt}
										/>
									</Link>
								</SheetTitle>
							</SheetHeader>
							<div className="flex flex-col gap-6 p-4">
								<Accordion
									type="single"
									collapsible
									className="flex w-full flex-col gap-4"
								>
									{menu.map((item) => renderMobileMenuItem(item))}
								</Accordion>

								<div className="flex flex-col gap-3">
									<Button asChild>
										<Link href={auth.getStarted.url}>
											{auth.getStarted.title}
										</Link>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</section>
	);
};

const renderMenuItem = (item: MenuItem) => {
	return (
		<NavigationMenuItem key={item.title}>
			<NavigationMenuLink
				href={item.url}
				className="font-inter bg-background hover:bg-muted hover:text-accent-foreground group inline-flex h-10 w-max text-lg items-center justify-center rounded-md px-4 py-2  font-medium transition-colors"
			>
				{item.title}
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
};

const renderMobileMenuItem = (item: MenuItem) => {
	return (
		<Link
			key={item.title}
			href={item.url}
			className="text-lg hover:text-accent-foreground font-semibold font-inter"
		>
			{item.title}
		</Link>
	);
};

export { Navbar };
