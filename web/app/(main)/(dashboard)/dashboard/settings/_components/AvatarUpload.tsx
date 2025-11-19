// import type { UserDataType } from "@/app/data/user/get-user-data";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const AvatarUpload = ({ user }: { user: NonNullable<UserDataType> }) => {
// 	return (
// 		<div className="flex items-center gap-4">
// 			<Avatar className="size-16">
// 				<AvatarImage src={user.image || undefined} />
// 				<AvatarFallback className="text-xl">
// 					{user.name
// 						.split(" ")
// 						.map((n) => n[0])
// 						.join("")
// 						.toUpperCase()
// 						.slice(0, 2)}
// 				</AvatarFallback>
// 			</Avatar>
// 			<p className="text-sm text-muted-foreground">
// 				Avatar customization coming soon
// 			</p>
// 		</div>
// 	);
// };
"use client";

import { TriangleAlert } from "lucide-react";
import Image from "next/image";
import {
	Alert,
	AlertContent,
	AlertDescription,
	AlertIcon,
	AlertTitle,
} from "@/components/ui/alert";
import {
	type FileWithPreview,
	formatBytes,
	useFileUpload,
} from "@/lib/hooks/useFileUpload";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
	maxSize?: number;
	className?: string;
	onFileChange?: (file: FileWithPreview | null) => void;
	defaultAvatar?: string;
	name: string;
}

export default function AvatarUpload({
	maxSize = 2 * 1024 * 1024, // 2MB
	className,
	onFileChange,
	defaultAvatar,
	name,
}: AvatarUploadProps) {
	const [
		{ files, isDragging, errors },
		{
			removeFile,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			getInputProps,
		},
	] = useFileUpload({
		maxFiles: 1,
		maxSize,
		accept: "image/png,image/jpeg",
		multiple: false,
		onFilesAdded: (files) => {
			onFileChange?.(files[0] || null);
		},
	});

	const currentFile = files[0];
	const previewUrl = currentFile?.preview || defaultAvatar;

	// const handleRemove = () => {
	// 	if (currentFile) {
	// 		removeFile(currentFile.id);
	// 	}
	// };

	return (
		<div className={cn("flex flex-col items-center gap-4 ", className)}>
			{/* Avatar Preview */}
			<div className="relative">
				{/** biome-ignore lint/a11y/noStaticElementInteractions: goon */}
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: goon */}
				<div
					className={cn(
						"group/avatar relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border border-dashed transition-colors",
						isDragging
							? "border-primary bg-primary/5"
							: "border-muted-foreground/25 hover:border-muted-foreground/20",
						previewUrl && "border-solid",
					)}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={openFileDialog}
				>
					<input {...getInputProps()} className="sr-only" />

					{previewUrl ? (
						<Image
							src={previewUrl}
							width={96}
							height={96}
							alt={name}
							className="h-full w-full object-cover"
						/>
					) : (
						<Image
							src={`https://avatar.vercel.sh/${name}`}
							width={96}
							height={96}
							alt={name}
							className="h-full w-full object-cover"
						/>
					)}
				</div>

				{/* Remove Button - only show when file is uploaded */}
				{/* {currentFile && (
					<Button
						size="icon"
						variant="outline"
						onClick={handleRemove}
						className="size-6 absolute end-0 top-0 rounded-full"
						aria-label="Remove avatar"
					>
						<X className="size-3.5" />
					</Button>
				)} */}
			</div>

			{/* Upload Instructions */}
			<div className="text-center space-y-0.5">
				<p className="text-sm font-medium">
					{currentFile ? "Avatar uploaded" : "Upload avatar"}
				</p>
				<p className="text-xs text-muted-foreground">
					PNG, JPG up to {formatBytes(maxSize)}
				</p>
			</div>

			{/* Error Messages */}
			{errors.length > 0 && (
				<Alert variant="destructive" appearance="light" className="mt-5">
					<AlertIcon>
						<TriangleAlert />
					</AlertIcon>
					<AlertContent>
						<AlertTitle>File upload error(s)</AlertTitle>
						<AlertDescription>
							{errors.map((error, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: goon
								<p key={index} className="last:mb-0">
									{error}
								</p>
							))}
						</AlertDescription>
					</AlertContent>
				</Alert>
			)}
		</div>
	);
}
