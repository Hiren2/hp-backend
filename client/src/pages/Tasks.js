import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Failed to load tasks");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {task.title}
                </h3>

                <p className="text-gray-600 mb-3">
                  {task.description}
                </p>

                <span className="text-sm text-gray-500">
                  Assigned on:{" "}
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;
