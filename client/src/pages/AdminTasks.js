import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminTasks = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data);
    } catch (err) {
      alert("Admin access only");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchAllTasks();
    // eslint-disable-next-line
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, status } : task
        )
      );
    } catch (err) {
      alert("Status update failed");
    }
  };

  const statusBadge = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">
            Admin Task Management
          </h2>

          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="border rounded p-4 flex flex-col md:flex-row md:justify-between md:items-center"
                >
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">User:</span>{" "}
                      {task.user?.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>

                    <button
                      onClick={() =>
                        updateStatus(task._id, "Approved")
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(task._id, "Completed")
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
