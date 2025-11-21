"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Mail, Rocket } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Footer } from "@/components/landing/Footer";
import Noise from "@/components/landing/Noise";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@/components/ui/alert";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input, InputWrapper } from "@/components/ui/input";
import { LineShadowText } from "@/components/ui/ShadowText";
import { ShootingStars } from "@/components/ui/shadcn-io/shooting-stars";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useConfetti } from "@/lib/hooks/use-confetti";
import { tryCatch } from "@/lib/try-catch";
import { type WaitlistFormData, waitlistSchema } from "@/lib/validations";
import { sendWaitlistInvite } from "./actions";

const WAITLIST_STORAGE_KEY = "reviseo_waitlist_joined";
const WAITLIST_EMAILS_KEY = "reviseo_waitlist_emails";

const WaitlistPage = () => {
	const formId = useId();
	const { triggerConfetti } = useConfetti();
	const { theme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false);
	const [usedEmails, setUsedEmails] = useState<string[]>([]);
	const router = useRouter();

	const form = useForm<WaitlistFormData>({
		resolver: zodResolver(waitlistSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (values: WaitlistFormData) => {
		startTransition(async () => {
			// Check if the email has already been used
			const emailLower = values.email.toLowerCase();
			if (usedEmails.some((email) => email.toLowerCase() === emailLower)) {
				toast.error(
					"This email address has already been used to join the waitlist.",
				);
				return;
			}

			const { data: result, error } = await tryCatch(
				sendWaitlistInvite(values),
			);

			if (error) {
				toast.error("An unexpected error occurred. Please try again.");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				triggerConfetti();
				form.reset();

				// Add the email to the list of used emails
				const updatedEmails = [...usedEmails, values.email];
				localStorage.setItem(WAITLIST_STORAGE_KEY, "true");
				localStorage.setItem(
					WAITLIST_EMAILS_KEY,
					JSON.stringify(updatedEmails),
				);
				setHasJoinedWaitlist(true);
				setUsedEmails(updatedEmails);
				router.push("/");
			} else if (result.status === "error") {
				toast.error(result.message);
			}
		});
	};

	const handleDismissAlert = () => {
		localStorage.removeItem(WAITLIST_STORAGE_KEY);
		setHasJoinedWaitlist(false);
	};

	useEffect(() => {
		setMounted(true);
		const hasJoined = localStorage.getItem(WAITLIST_STORAGE_KEY) === "true";
		const storedEmails = localStorage.getItem(WAITLIST_EMAILS_KEY);

		setHasJoinedWaitlist(hasJoined);

		if (storedEmails) {
			try {
				const emails = JSON.parse(storedEmails);
				setUsedEmails(Array.isArray(emails) ? emails : []);
			} catch {
				setUsedEmails([]);
			}
		}
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="relative min-h-screen min-h-scren w-full overflow-x-hidden">
			<Spotlight />
			<ShootingStars
				starColor="#9E00FF"
				className="-z-30"
				trailColor="#2EB9DF"
				minDelay={400}
				maxDelay={3000}
			/>
			<ShootingStars
				starColor="#FF0099"
				className="-z-30"
				trailColor="#FFB800"
				minDelay={500}
				maxDelay={4000}
			/>
			<ShootingStars
				starColor="#00FF9E"
				className="-z-30"
				trailColor="#00B8FF"
				minDelay={200}
				maxDelay={3500}
			/>
			<ShootingStars
				starColor="#FF6B35"
				className="-z-30"
				trailColor="#FFC857"
				minDelay={600}
				maxDelay={3200}
			/>
			<ShootingStars
				starColor="#7B2CBF"
				className="-z-30"
				trailColor="#C77DFF"
				minDelay={300}
				maxDelay={4200}
			/>
			<ShootingStars
				starColor="#06FFA5"
				className="-z-30"
				trailColor="#00D9FF"
				minDelay={450}
				maxDelay={3800}
			/>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 1, ease: "easeIn" }}
				className="mask-contain mask-alpha -z-50 absolute h-[100vh] w-[100dvw] [mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]"
			>
				<Noise
					patternSize={250}
					patternScaleX={1}
					patternScaleY={1}
					patternRefreshInterval={2}
					patternAlpha={10}
				/>
			</motion.div>
			{/* Hero Section Gradient */}
			<motion.div
				initial={{ opacity: 0, x: -200 }}
				animate={{ opacity: 0.3, x: 0 }}
				transition={{ duration: 1.2, ease: "easeOut" }}
				className="-top-10 -left-56 -z-30 pointer-events-none absolute h-[700px] w-[700px] max-w-screen blur-3xl"
				style={{
					background:
						"radial-gradient(circle, oklch(0.5053 0.2350 286.8637), transparent 70%)",
				}}
			/>
			<div
				className="-z-50 pointer-events-none fixed inset-0 h-full w-full"
				style={{
					backgroundImage: `radial-gradient(circle, #562a2a 1px, transparent 1px)`,
					backgroundSize: "32px 32px",
				}}
			/>
			{/* <div className="sticky z-50 flex items-center justify-center w-full px-2 pt-6 sm:px-4 md:px-6 top-4">
				<Navbar />
			</div> */}

			<div className="z-40 my-18 flex w-full flex-col items-center justify-start pb-42">
				<Link
					href={"/"}
					className="z-40 mb-56 flex flex-row items-center gap-1"
				>
					<Image
						src={"/logo.svg"}
						alt={"Reviseo Logo"}
						width={28}
						height={28}
					/>
					<h1 className="font-caudex font-extrabold text-3xl">Reviseo</h1>
				</Link>
				<Link href={"/blog/release"}>
					<Badge
						size={"lg"}
						variant={"info"}
						appearance={"outline"}
						className="group mb-5 gap-2 p-3 hover:cursor-pointer"
					>
						<Rocket />
						Launching December 2025
						<ChevronRight className="transition-transform duration-100 ease-in-out group-hover:translate-x-0.5" />
					</Badge>
				</Link>
				<h1 className="flex flex-row flex-wrap items-center justify-center space-x-5 text-center font-extrabold text-8xl md:text-6xl">
					<LineShadowText
						shadowColor={theme === "dark" ? "white" : "black"}
						className="italic"
					>
						Join
					</LineShadowText>
					<LineShadowText
						shadowColor={theme === "dark" ? "white" : "black"}
						className="italic"
					>
						the
					</LineShadowText>
					<LineShadowText
						shadowColor={theme === "dark" ? "white" : "black"}
						className="italic"
					>
						Waitlist
					</LineShadowText>
				</h1>
				<span className="mt-1 max-w-md text-center font-medium text-muted-foreground">
					Are your eady to declutter your inbox from endless nonsense from
					clients. Enter your email to be the first to know when Reviseo
					launches.
				</span>
				{hasJoinedWaitlist && (
					<Alert
						variant="success"
						appearance="light"
						size="md"
						close
						onClose={handleDismissAlert}
						className="z-40 mt-6 max-w-md"
					>
						<AlertIcon>
							<Mail />
						</AlertIcon>
						<AlertContent>
							<AlertTitle>You're already on the waitlist!</AlertTitle>
							<AlertDescription>
								We'll notify you as soon as Reviseo launches. Thanks for your
								interest!
							</AlertDescription>
						</AlertContent>
					</Alert>
				)}
				<Form {...form}>
					<form
						id={formId}
						onSubmit={form.handleSubmit(onSubmit)}
						className="z-40 mt-10"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center gap-2">
									<FormControl>
										<InputWrapper variant={"lg"} className="w-xs md:w-xs">
											<Mail />
											<Input
												disabled={isPending}
												placeholder="my@email.com"
												variant={"lg"}
												className="rounded-none"
												{...field}
												type="email"
											/>
										</InputWrapper>
									</FormControl>
									<Button
										type="submit"
										className="relative"
										variant={"inset"}
										disabled={isPending}
										size={"lg"}
									>
										Join Waitlist
										<BorderBeam
											delay={0}
											duration={1.5}
											borderWidth={1}
											className="from-accent to-primary"
										/>
									</Button>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</div>
			<Footer />
		</div>
	);
};

export default WaitlistPage;
