"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

export default function TestSupabase() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);
      setResult("Testing connection...");

      // Test if we can connect to Supabase
      const { data: connectionData, error: connectionError } = await supabase.from("projects").select("count").limit(1);

      if (connectionError) {
        setResult(`Connection Error: ${connectionError.message}\nDetails: ${JSON.stringify(connectionError, null, 2)}`);
        console.error("Supabase connection error:", connectionError);
        return;
      }

      setResult(`Connection successful! Data: ${JSON.stringify(connectionData)}\n\nNow testing insert operation...`);
      
      // Test if we can insert data
      const testProject = {
        id: uuidv4(),
        name: "Test Project",
        status: "Research",
        finalDeadline: new Date().toISOString(),
        nextPhaseDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from("projects")
        .insert([testProject])
        .select();
        
      if (insertError) {
        setResult(prev => `${prev}\n\nInsert Error: ${insertError.message}\nDetails: ${JSON.stringify(insertError, null, 2)}`);
        console.error("Supabase insert error:", insertError);
        return;
      }
      
      setResult(prev => `${prev}\n\nInsert successful! Data: ${JSON.stringify(insertData, null, 2)}`);
      
      // Test if we can delete the test data
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", testProject.id);
        
      if (deleteError) {
        setResult(prev => `${prev}\n\nDelete Error: ${deleteError.message}\nDetails: ${JSON.stringify(deleteError, null, 2)}`);
        console.error("Supabase delete error:", deleteError);
        return;
      }
      
      setResult(prev => `${prev}\n\nDelete successful! All tests passed.`);
      
      // Show environment info (without exposing the full key)
      setResult(prev => `${prev}\n\nEnvironment Info:
Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}
Supabase Key Available: ${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
      
    } catch (error) {
      setResult(`Exception: ${error instanceof Error ? error.message : "Unknown error"}\n${error instanceof Error ? error.stack : ""}`);
      console.error("Exception during test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <Button 
        onClick={testConnection} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? "Testing..." : "Test Connection"}
      </Button>
      <div className="p-4 border rounded bg-gray-50 max-h-[500px] overflow-auto">
        <pre className="whitespace-pre-wrap">{result}</pre>
      </div>
    </div>
  );
} 