"use client";

import { ChevronDownIcon, LogOutIcon, Menu } from "lucide-react";
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
import { authClient } from "@/lib/auth-client";
import { useSignOut } from "@/lib/hooks/useSignOut";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BorderBeam } from "../ui/BorderBeam";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
	authcta?: {
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
		{ title: "Pricing", url: "/pricing" },
		{ title: "FAQ", url: "/#faq" },
		{ title: "About", url: "/about" },
		{ title: "Blog", url: "/blog" },
	],
	authcta = {
		getStarted: { title: "Get Started", url: "/login" },
	},
}: NavbarProps) => {
	const { data: session } = authClient.useSession();
	const handleSignOut = useSignOut();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-4 sm:px-6">
			<section
				className={cn(
					"w-full max-w-7xl rounded-3xl px-4 py-4 shadow-[inset_0_4px_8px_0_rgba(0,0,0,0.3)] backdrop-blur-sm transition-all duration-300 sm:px-6 md:px-16 lg:px-20",
				)}
			>
				{/* Desktop Menu */}
				<nav className="hidden w-full items-center justify-between gap-2 lg:flex">
					{/* Logo */}
					<Link href={logo.url} className="flex items-center gap-1">
						<Image src={logo.src} width={32} height={32} alt={logo.alt} />
						<h1 className="font-bold font-caudex text-4xl">{logo.title}</h1>
					</Link>

					{/* Centered Navigation Links */}
					<div className="-translate-x-1/2 absolute left-1/2 flex transform items-center">
						<NavigationMenu>
							<NavigationMenuList>
								{menu.map((item) => renderMenuItem(item))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* CTA Button or User Menu */}
					{session?.user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-auto p-0 hover:bg-transparent"
								>
									<Avatar>
										<AvatarImage
											src={
												session.user.image ??
												`https://avatar.vercel.sh/${session.user.email}`
											}
											alt={session.user.name ?? "User avatar"}
										/>
										<AvatarFallback>
											{session.user.name && session.user.name.length > 0
												? session.user.name.charAt(0).toUpperCase()
												: session.user.email.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<ChevronDownIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="max-w-64" align="end">
								<DropdownMenuLabel className="flex min-w-0 flex-col">
									<span className="truncate font-medium text-foreground text-sm">
										{session.user.name && session.user.name.length > 0
											? session.user.name
											: session.user.email.split("@")[0]}
									</span>
									<span className="truncate font-normal text-muted-foreground text-xs">
										{session.user.email}
									</span>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard">Dashboard</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleSignOut}>
									<LogOutIcon
										size={16}
										className="opacity-60"
										aria-hidden="true"
									/>
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex gap-2">
							<Button asChild className="relative" size="lg" variant={"inset"}>
								<Link className="relative" href={authcta.getStarted.url}>
									{authcta.getStarted.title}
									<BorderBeam
										delay={3}
										duration={2}
										borderWidth={2}
										className="from-accent to-primary"
									/>
								</Link>
							</Button>
						</div>
					)}
				</nav>

				{/* Mobile Menu */}
				<div className="w-full lg:hidden">
					<div className="flex w-full items-center justify-between">
						{/* Logo */}
						<Link href={logo.url} className="flex items-center gap-2">
							<Image src={logo.src} width={32} height={32} alt={logo.alt} />
							<h1 className="font-bold font-caudex text-4xl">{logo.title}</h1>
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
										{session?.user ? (
											<>
												<Button asChild variant="outline">
													<Link href="/dashboard">Dashboard</Link>
												</Button>
												<Button variant="destructive" onClick={handleSignOut}>
													Log out
												</Button>
											</>
										) : (
											<Button asChild>
												<Link href={authcta.getStarted.url}>
													{authcta.getStarted.title}
												</Link>
											</Button>
										)}
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</section>
		</div>
	);
};

const renderMenuItem = (item: MenuItem) => {
	return (
		<NavigationMenuItem key={item.title}>
			<NavigationMenuLink
				href={item.url}
				className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-caudex font-medium text-lg transition-colors hover:bg-muted hover:text-accent-foreground"
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
			className="font-inter font-semibold text-lg hover:text-accent-foreground"
		>
			{item.title}
		</Link>
	);
};

export { Navbar };
