"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";

interface Task {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  dueDate: string;
  description?: string;
}

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? "http://localhost:3000" 
  : "https://fb-network-demo.vercel.app";

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_BASE_URL}/api/dashboard/tasks`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks";
        setError(errorMessage);
        console.warn("Tasks fetch error:", err);
        
        // No fallback data - let error state handle it
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTask = async (id: number) => {
    const updatedTasks = tasks.map((task) => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Update task on server
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      if (taskToUpdate) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/api/dashboard/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !taskToUpdate.completed }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (err) {
      console.warn("Failed to update task:", err);
      // Revert the change if server update fails
      setTasks(tasks);
    }
  };

  const addTask = async () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        priority: "medium" as const,
        completed: false,
        dueDate: "Today",
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE_URL}/api/dashboard/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const savedTask = await response.json();
          setTasks([...tasks, savedTask]);
          setNewTask("");
          setShowAddTask(false);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (err) {
        console.warn("Failed to add task:", err);
        // Don't add task locally if server fails
        console.error("Failed to add task to server");
      }
    }
  };

  if (loading) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
          <p className="text-sm text-gray-600">Your upcoming and completed tasks</p>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p>Failed to load tasks</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
        <p className="text-sm text-gray-600">Your upcoming and completed tasks</p>
      </CardHeader>
      <CardContent>
        {showAddTask ? (
          <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
            <Input
              placeholder="Enter new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <Button size="sm" onClick={addTask}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowAddTask(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowAddTask(true)} className="w-full mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        )}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">{task.dueDate}</p>
              </div>
              <Badge
                variant={
                  task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                }
              >
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Completed: {tasks.filter((t) => t.completed).length}</span>
            <span>Remaining: {tasks.filter((t) => !t.completed).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
