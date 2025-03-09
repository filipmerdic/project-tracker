import { supabase } from '@/lib/supabase';
import { Project, projectStatusOptions } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';

// Table name in Supabase
const TABLE_NAME = 'projects';

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  
  // Convert string dates back to Date objects
  return data.map((project: {
    id: string;
    name: string;
    status: string;
    finalDeadline: string;
    nextPhaseDate: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  }) => ({
    ...project,
    finalDeadline: new Date(project.finalDeadline),
    nextPhaseDate: new Date(project.nextPhaseDate),
    createdAt: project.createdAt ? new Date(project.createdAt) : undefined,
    updatedAt: project.updatedAt ? new Date(project.updatedAt) : undefined,
  }));
}

// Add a new project
export async function addProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  console.log('Adding project with data:', project);
  
  try {
    // Check if finalDeadline and nextPhaseDate are valid Date objects
    if (!(project.finalDeadline instanceof Date) || isNaN(project.finalDeadline.getTime())) {
      console.error('Invalid finalDeadline:', project.finalDeadline);
      throw new Error('Invalid finalDeadline date');
    }
    
    if (!(project.nextPhaseDate instanceof Date) || isNaN(project.nextPhaseDate.getTime())) {
      console.error('Invalid nextPhaseDate:', project.nextPhaseDate);
      throw new Error('Invalid nextPhaseDate date');
    }
    
    const now = new Date();
    const newProject = {
      ...project,
      id: uuidv4(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      // Convert Date objects to ISO strings for storage
      finalDeadline: project.finalDeadline.toISOString(),
      nextPhaseDate: project.nextPhaseDate.toISOString(),
    };
    
    console.log('Formatted project for Supabase:', newProject);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([newProject])
      .select();

    if (error) {
      console.error('Error adding project:', error);
      return null;
    }

    console.log('Project added successfully, response:', data);

    if (!data || data.length === 0) {
      console.error('No data returned after insert');
      return null;
    }

    // Convert back to the expected format with Date objects
    const addedProject = data[0];
    return {
      ...addedProject,
      finalDeadline: new Date(addedProject.finalDeadline),
      nextPhaseDate: new Date(addedProject.nextPhaseDate),
      createdAt: new Date(addedProject.createdAt),
      updatedAt: new Date(addedProject.updatedAt),
    };
  } catch (error) {
    console.error('Exception in addProject:', error);
    throw error; // Re-throw the error so it can be caught and displayed to the user
  }
}

// Update an existing project
export async function updateProject(project: Project): Promise<Project | null> {
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
    // Convert Date objects to ISO strings for storage
    finalDeadline: project.finalDeadline.toISOString(),
    nextPhaseDate: project.nextPhaseDate.toISOString(),
  };

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(updatedProject)
    .eq('id', project.id)
    .select();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Convert back to the expected format with Date objects
  const updated = data[0];
  return {
    ...updated,
    finalDeadline: new Date(updated.finalDeadline),
    nextPhaseDate: new Date(updated.nextPhaseDate),
    createdAt: new Date(updated.createdAt),
    updatedAt: new Date(updated.updatedAt),
  };
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

// Update project status
export async function updateProjectStatus(
  projectId: string, 
  newStatus: typeof projectStatusOptions[number]
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ 
      status: newStatus,
      updatedAt: new Date().toISOString()
    })
    .eq('id', projectId);

  if (error) {
    console.error('Error updating project status:', error);
    return false;
  }

  return true;
}

// Update project next phase date
export async function updateProjectNextPhaseDate(
  projectId: string, 
  newDate: Date
): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ 
      nextPhaseDate: newDate.toISOString(),
      updatedAt: new Date().toISOString()
    })
    .eq('id', projectId);

  if (error) {
    console.error('Error updating project next phase date:', error);
    return false;
  }

  return true;
} 