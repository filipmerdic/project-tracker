"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project, projectStatusOptions } from "@/types/project";
import { ProjectTable } from "@/components/ProjectTable";
import { ProjectDialog } from "@/components/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  // Load projects from localStorage on initial render
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Convert string dates back to Date objects
        const projectsWithDates = parsedProjects.map((project: Omit<Project, 'finalDeadline' | 'nextPhaseDate' | 'createdAt' | 'updatedAt'> & {
          finalDeadline: string;
          nextPhaseDate: string;
          createdAt?: string;
          updatedAt?: string;
        }) => ({
          ...project,
          finalDeadline: new Date(project.finalDeadline),
          nextPhaseDate: new Date(project.nextPhaseDate),
          createdAt: project.createdAt ? new Date(project.createdAt) : undefined,
          updatedAt: project.updatedAt ? new Date(project.updatedAt) : undefined,
        }));
        setProjects(projectsWithDates);
      } catch (error) {
        console.error("Error parsing saved projects:", error);
      }
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (data: Project) => {
    const newProject = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const handleEditProject = (data: Project) => {
    setProjects(
      projects.map((project) =>
        project.id === data.id
          ? { ...data, updatedAt: new Date() }
          : project
      )
    );
    setEditingProject(undefined);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
  };

  const handleStatusChange = (projectId: string, newStatus: typeof projectStatusOptions[number]) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, status: newStatus, updatedAt: new Date() }
          : project
      )
    );
  };

  const handleNextPhaseDateChange = (projectId: string, newDate: Date) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, nextPhaseDate: newDate, updatedAt: new Date() }
          : project
      )
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-5xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Project Tracker</CardTitle>
            <CardDescription>
              Manage your projects, track deadlines, and monitor progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-6">
              <ProjectDialog
                onSubmit={handleAddProject}
                trigger={
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                }
              />
            </div>
            <ProjectTable
              projects={projects}
              onEdit={openEditDialog}
              onDelete={handleDeleteProject}
              onStatusChange={handleStatusChange}
              onNextPhaseDateChange={handleNextPhaseDateChange}
            />
          </CardContent>
        </Card>

        {editingProject && (
          <ProjectDialog
            project={editingProject}
            onSubmit={handleEditProject}
            trigger={<></>}
          />
        )}
      </div>
    </main>
  );
}
