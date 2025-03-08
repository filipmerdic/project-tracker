"use client";

import { useState, useEffect } from "react";
import { Project, projectStatusOptions } from "@/types/project";
import { ProjectTable } from "@/components/ProjectTable";
import { ProjectDialog } from "@/components/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import { 
  getAllProjects, 
  addProject, 
  updateProject, 
  deleteProject as deleteProjectService,
  updateProjectStatus as updateProjectStatusService,
  updateProjectNextPhaseDate as updateProjectNextPhaseDateService
} from "@/services/projectService";
import { toast } from "react-hot-toast";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load projects from Supabase on initial render
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const projectsData = await getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleAddProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      console.log('Submitting project data:', data);
      
      const newProject = await addProject(data);
      
      if (newProject) {
        setProjects([...projects, newProject]);
        toast.success("Project added successfully");
      } else {
        toast.error("Failed to add project - server returned null");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to add project: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = async (data: Project) => {
    try {
      setLoading(true);
      const updatedProjectData = await updateProject(data);
      if (updatedProjectData) {
        setProjects(
          projects.map((project) =>
            project.id === data.id ? updatedProjectData : project
          )
        );
        toast.success("Project updated successfully");
      }
      setEditingProject(undefined);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      const success = await deleteProjectService(projectId);
      if (success) {
        setProjects(projects.filter((project) => project.id !== projectId));
        toast.success("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setEditingProject(project);
  };

  const handleStatusChange = async (projectId: string, newStatus: typeof projectStatusOptions[number]) => {
    try {
      setLoading(true);
      const success = await updateProjectStatusService(projectId, newStatus);
      if (success) {
        setProjects(
          projects.map((project) =>
            project.id === projectId
              ? { ...project, status: newStatus, updatedAt: new Date() }
              : project
          )
        );
        toast.success("Status updated successfully");
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPhaseDateChange = async (projectId: string, newDate: Date) => {
    try {
      setLoading(true);
      const success = await updateProjectNextPhaseDateService(projectId, newDate);
      if (success) {
        setProjects(
          projects.map((project) =>
            project.id === projectId
              ? { ...project, nextPhaseDate: newDate, updatedAt: new Date() }
              : project
          )
        );
        toast.success("Next phase date updated successfully");
      }
    } catch (error) {
      console.error("Error updating next phase date:", error);
      toast.error("Failed to update next phase date");
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary statistics
  const totalProjects = projects.length;
  const inProgressProjects = projects.filter(p => p.status === "Development").length;
  const completedProjects = projects.filter(p => p.status === "Design").length;
  
  // Find upcoming deadlines (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const upcomingDeadlines = projects.filter(p => 
    p.nextPhaseDate >= today && p.nextPhaseDate <= nextWeek
  ).length;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-8">
          <div className="bg-primary rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Project Tracker</h1>
                <p className="text-white/80 mt-1">
                  Manage your projects, track deadlines, and monitor progress.
                </p>
              </div>
              <div className="text-3xl font-bold tracking-tight text-white">
                {(() => {
                  const date = new Date();
                  const day = date.getDate();
                  const month = date.toLocaleDateString('en-US', { month: 'long' });
                  const year = date.getFullYear();
                  
                  // Function to get the correct ordinal suffix
                  const getOrdinalSuffix = (day: number) => {
                    if (day > 3 && day < 21) return 'th';
                    switch (day % 10) {
                      case 1: return 'st';
                      case 2: return 'nd';
                      case 3: return 'rd';
                      default: return 'th';
                    }
                  };
                  
                  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
                })()}
              </div>
            </div>
          </div>
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="card-modern">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-black">{totalProjects}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold text-black">{inProgressProjects}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Design</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-2xl font-bold text-black">{completedProjects}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-amber-500 mr-2" />
                  <div className="text-2xl font-bold text-black">{upcomingDeadlines}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Table */}
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-semibold text-black">Projects</CardTitle>
                <CardDescription className="text-gray-700">
                  Manage and track all your projects in one place.
                </CardDescription>
              </div>
              <ProjectDialog
                onSubmit={handleAddProject}
                trigger={
                  <Button className="btn-modern-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ProjectTable
                  projects={projects}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteProject}
                  onStatusChange={handleStatusChange}
                  onNextPhaseDateChange={handleNextPhaseDateChange}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {editingProject && (
        <ProjectDialog
          project={editingProject}
          onSubmit={handleEditProject}
          trigger={<></>}
        />
      )}
    </main>
  );
}
