"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Project, projectSchema, projectStatusOptions } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: Project) => void;
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const form = useForm<Project>({
    resolver: zodResolver(projectSchema),
    defaultValues: project || {
      name: "",
      status: "Research",
      finalDeadline: new Date(),
      nextPhaseDate: new Date(),
    },
  });

  const handleSubmit = (data: Project) => {
    onSubmit(data);
    if (!project) {
      form.reset();
    }
  };

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Project Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter project name" 
                  className="form-input" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="form-label">Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="border-border text-gray-800">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {projectStatusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="text-gray-800">
                      <span className={getStatusClass(status)}>{status}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="finalDeadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="form-label">Final Deadline</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal border-border text-gray-800"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-border shadow-md rounded-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="text-gray-800 bg-white"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="form-message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nextPhaseDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="form-label">Next Phase Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full pl-3 text-left font-normal border-border text-gray-800"
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 text-gray-500" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border-border shadow-md rounded-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="text-gray-800 bg-white"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="form-message" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" className="btn-modern-primary">
            {project ? "Update Project" : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 