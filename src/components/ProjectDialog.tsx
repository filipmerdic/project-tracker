"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";

interface ProjectDialogProps {
  project?: Project;
  onSubmit: (data: Project) => void;
  trigger?: React.ReactNode;
}

export function ProjectDialog({
  project,
  onSubmit,
  trigger,
}: ProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: Project) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="btn-modern-primary">
            {project ? "Edit Project" : "Add Project"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border-border shadow-lg rounded-xl dialog-content">
        <DialogHeader>
          <DialogTitle className="dialog-title">
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription className="dialog-description">
            {project
              ? "Update the project details below."
              : "Fill in the project details below to add a new project."}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
} 