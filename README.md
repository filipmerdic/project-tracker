# Project Tracker

A simple application to track your projects, deadlines, and progress.

## Features

- Add new projects with name, status, final deadline, and next phase date
- Edit existing projects
- Delete projects
- View all projects in a table format
- Data is stored in Supabase (PostgreSQL database) for persistence across all users

## Project Status Options

- Research
- Copywriting
- Design
- Development

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier is sufficient)

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/)
2. Once your project is created, go to the SQL Editor
3. Run the following SQL to create the projects table:

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  finalDeadline TIMESTAMP WITH TIME ZONE NOT NULL,
  nextPhaseDate TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In a production app, you would want more restrictive policies
CREATE POLICY "Allow all operations for all users" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Go to Project Settings > API to get your API credentials
5. Copy the URL and anon key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project-tracker
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Click the "Add Project" button to create a new project.
2. Fill in the project details:
   - Project Name
   - Status (Research, Copywriting, Design, Development)
   - Final Deadline
   - Next Phase Date
3. Click "Add Project" to save the project.
4. To edit a project, click the edit icon in the Actions column.
5. To delete a project, click the delete icon in the Actions column.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- date-fns
- UUID
- Supabase (PostgreSQL database)
- React Hot Toast

## License

This project is licensed under the MIT License.
# project-tracker
