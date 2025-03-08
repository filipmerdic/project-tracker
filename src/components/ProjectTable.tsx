"use client";

import { format, differenceInHours } from "date-fns";
import { Trash2, Calendar, AlertCircle } from "lucide-react";

import { Project, projectStatusOptions } from "@/types/project";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onStatusChange?: (projectId: string, newStatus: typeof projectStatusOptions[number]) => void;
  onNextPhaseDateChange?: (projectId: string, newDate: Date) => void;
}

export function ProjectTable({
  projects,
  onEdit,
  onDelete,
  onStatusChange,
  onNextPhaseDateChange,
}: ProjectTableProps) {
  // Function to get status badge class based on status
  const getStatusClass = (status: typeof projectStatusOptions[number]) => {
    switch (status) {
      case "Research":
        return "bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium";
      case "Copywriting":
        return "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium";
      case "Design":
        return "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium";
      case "Development":
        return "bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium";
    }
  };

  // Function to check if next phase date is within 48 hours
  const isWithin48Hours = (date: Date) => {
    const now = new Date();
    const hoursDifference = differenceInHours(date, now);
    return hoursDifference >= 0 && hoursDifference <= 48;
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <Table className="table-modern">
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-gray-800">Project Name</TableHead>
            <TableHead className="font-medium text-gray-800">Status</TableHead>
            <TableHead className="font-medium text-gray-800">Final Deadline</TableHead>
            <TableHead className="font-medium text-gray-800">Next Phase Date</TableHead>
            <TableHead className="font-medium text-gray-800">Attention</TableHead>
            <TableHead className="font-medium text-gray-800 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No projects found. Add a project to get started.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id} className="transition-colors hover:bg-secondary/30">
                <TableCell className="font-medium text-gray-800">{project.name}</TableCell>
                <TableCell>
                  {onStatusChange ? (
                    <Select
                      defaultValue={project.status}
                      onValueChange={(value) => onStatusChange(project.id!, value as typeof projectStatusOptions[number])}
                    >
                      <SelectTrigger className="w-[140px] border-border text-gray-800">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            <span className={getStatusClass(status)}>{status}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={getStatusClass(project.status)}>{project.status}</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {format(project.finalDeadline, "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {onNextPhaseDateChange ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[140px] justify-start text-left font-normal border-border text-gray-700">
                          <Calendar className="mr-2 h-4 w-4 text-primary" />
                          {format(project.nextPhaseDate, "MMM d, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white border-border shadow-md rounded-lg" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={project.nextPhaseDate}
                          onSelect={(date) => {
                            if (date) onNextPhaseDateChange(project.id!, date);
                          }}
                          initialFocus
                          className="bg-white text-gray-800"
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    format(project.nextPhaseDate, "MMM d, yyyy")
                  )}
                </TableCell>
                <TableCell>
                  {isWithin48Hours(project.nextPhaseDate) && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(project.id!)}
                      className="border-border hover:bg-destructive/10 hover:text-destructive text-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 