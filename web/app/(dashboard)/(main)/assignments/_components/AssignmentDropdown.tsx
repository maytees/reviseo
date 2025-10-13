import { AssignmentsType } from "@/app/data/user/get-all-assignments"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExternalLink, LinkIcon, MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"

const AssignmentDropdown = ({ assignment }: { assignment: AssignmentsType }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href={`/assignments/${assignment.id}`}>
                        <ExternalLink />
                        Open (Molnr)
                    </Link>
                </DropdownMenuItem>
                {assignment.url && (
                    <DropdownMenuItem asChild>
                        <Link href={assignment.url}>
                            <LinkIcon />
                            Open (External)
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {/* TODO: Handle edit assignment */}
                <DropdownMenuItem>
                    <Pencil />
                    Edit
                </DropdownMenuItem>
                {/* TODO: Handle delete assignment */}
                <DropdownMenuItem variant="destructive">
                    <Trash />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default AssignmentDropdown