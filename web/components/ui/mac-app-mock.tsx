"use client";

import { motion } from "motion/react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface MacAppMockProps extends React.HTMLAttributes<HTMLDivElement> {
	dark?: boolean;
}

const MacAppMock = React.forwardRef<HTMLDivElement, MacAppMockProps>(
	({ className, children, dark = false, ...props }, ref) => {
		const [isHovered, setIsHovered] = React.useState(false);

		return (
			<div className="relative">
				{/* 3D Background Layer */}
				<motion.div
					initial={{
						scale: 1,
						skewX: -1,
						skewY: 0,
					}}
					className={cn(
						"-z-10 absolute inset-0 mr-4 translate-x-4 translate-y-4 rounded-lg border opacity-40 shadow-xl",
						dark ? "border-zinc-700 bg-zinc-800" : "border-border bg-card",
					)}
					animate={{
						scale: isHovered ? 0.95 : 1,
						skewX: isHovered ? 0 : -1,
						skewY: 0,
					}}
					transition={{ duration: 0.3 }}
				/>
				{/* Main Content */}
				<motion.div
					ref={ref}
					initial={{
						scale: 1,
						skewX: -1,
						skewY: 0,
					}}
					className={cn(
						"relative m-4 overflow-hidden rounded-lg border shadow-3xl",
						dark ? "border-zinc-700 bg-zinc-800" : "border-border bg-card",
						className,
					)}
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					whileHover={{
						scale: 0.95,
						skewX: 0,
						skewY: 0,
					}}
					transition={{
						duration: 0.3,
						type: "spring",
						stiffness: 300,
						damping: 10,
					}}
					// {...props}
				>
					{children}
				</motion.div>
			</div>
		);
	},
);
MacAppMock.displayName = "MacAppMock";

interface MacAppMockHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	dark?: boolean;
}

const MacAppMockHeader = React.forwardRef<
	HTMLDivElement,
	MacAppMockHeaderProps
>(({ className, children, dark = false, ...props }, ref) => {
	const [isHovered, setIsHovered] = React.useState(false);

	return (
		<motion.div
			ref={ref}
			initial={{
				backgroundColor: dark ? "rgba(24, 24, 27, 0.5)" : "rgba(0, 0, 0, 0.03)",
			}}
			className={cn(
				"flex items-center gap-2 border-b px-4 py-3",
				dark ? "border-zinc-700" : "border-border",
				className,
			)}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			animate={{
				backgroundColor: isHovered
					? dark
						? "rgba(24, 24, 27, 0.7)"
						: "rgba(0, 0, 0, 0.05)"
					: dark
						? "rgba(24, 24, 27, 0.5)"
						: "rgba(0, 0, 0, 0.03)",
			}}
			transition={{ duration: 0.2 }}
			// {...props}
		>
			<div className="flex items-center gap-2">
				<motion.div
					initial={{ scale: 1 }}
					className="h-3 w-3 cursor-pointer rounded-full bg-red-500"
					whileHover={{ scale: 1.2 }}
					animate={{ scale: isHovered ? 1.1 : 1 }}
					transition={{ duration: 0.2 }}
				/>
				<motion.div
					initial={{ scale: 1 }}
					className="h-3 w-3 cursor-pointer rounded-full bg-yellow-500"
					whileHover={{ scale: 1.2 }}
					animate={{ scale: isHovered ? 1.1 : 1 }}
					transition={{ duration: 0.2 }}
				/>
				<motion.div
					initial={{ scale: 1 }}
					className="h-3 w-3 cursor-pointer rounded-full bg-green-500"
					whileHover={{ scale: 1.2 }}
					animate={{ scale: isHovered ? 1.1 : 1 }}
					transition={{ duration: 0.2 }}
				/>
			</div>
			{children}
		</motion.div>
	);
});
MacAppMockHeader.displayName = "MacAppMockHeader";

interface MacAppMockTitleProps extends React.HTMLAttributes<HTMLDivElement> {
	dark?: boolean;
}

const MacAppMockTitle = React.forwardRef<HTMLDivElement, MacAppMockTitleProps>(
	({ className, children, dark = false, ...props }, ref) => (
		<motion.div
			ref={ref}
			initial={{
				color: dark ? "rgb(228, 228, 231)" : "currentColor",
			}}
			className={cn(
				"flex-1 cursor-default text-center font-medium text-sm",
				dark ? "text-zinc-200" : "text-foreground",
				className,
			)}
			transition={{ duration: 0.2 }}
			// {...props}
		>
			{children}
		</motion.div>
	),
);
MacAppMockTitle.displayName = "MacAppMockTitle";

interface MacAppMockContentProps extends React.HTMLAttributes<HTMLDivElement> {
	dark?: boolean;
}

const MacAppMockContent = React.forwardRef<
	HTMLDivElement,
	MacAppMockContentProps
>(({ className, children, dark = false, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("p-6", dark && "text-zinc-100", className)}
		{...props}
	>
		{children}
	</div>
));
MacAppMockContent.displayName = "MacAppMockContent";

export { MacAppMock, MacAppMockContent, MacAppMockHeader, MacAppMockTitle };
