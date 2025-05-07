import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ToDoWebApp() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Configure axios with auth header
  const axiosWithAuth = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  // Load tasks from backend when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axiosWithAuth.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axiosWithAuth.post("/tasks", {
          name: newTask
        });
        setTasks([...tasks, response.data.task]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axiosWithAuth.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTaskText(task.name);
  };

  const saveEdit = async (taskId) => {
    try {
      const response = await axiosWithAuth.put(`/tasks/${taskId}`, {
        name: editTaskText
      });
      setTasks(tasks.map(task =>
        task._id === taskId ? response.data.task : task
      ));
      setEditingTaskId(null);
      setEditTaskText("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-200 ">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-blue-500">ToDo WebApp</h1>
      
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4 sm:mb-6 px-2 sm:px-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-400"
        />
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Add Task Section */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-4 sm:mb-6 px-2 sm:px-4">
        <input
          type="text"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-400"
        />
        <button
          onClick={addTask}
          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-black transition-colors"
        >
          Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-3 sm:space-y-4 px-2 sm:px-4">
        {filteredTasks.map(task => (
          <div
            key={task._id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg shadow"
          >
            {editingTaskId === task._id ? (
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={editTaskText}
                  onChange={(e) => setEditTaskText(e.target.value)}
                  className="w-full px-2 py-1 border rounded bg-white text-gray-400"
                />
                <button
                  onClick={() => saveEdit(task._id)}
                  className="w-full sm:w-auto px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="text-black break-words">{task.name}</span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => startEditing(task)}
                    className="flex-1 sm:flex-none px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="flex-1 sm:flex-none px-3 py-1 bg-black text-white rounded hover:bg-black"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

