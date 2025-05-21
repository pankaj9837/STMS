import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
const currentUser = JSON.parse(localStorage.getItem("user"));
  const fetchTask = async () => {
    try {
      const res = await axios.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      setError("Failed to load task");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await axios.patch(`/tasks/${id}/status`, {
        status: task.status === "pending" ? "completed" : "pending",
      });
      fetchTask(); // Refresh
    } catch (err) {
      setError("Status update failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/tasks/${id}`);
      navigate("/");
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>{task.title}</h2>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleStatusChange} style={{ padding: "0.5rem 1rem" }}>
          Mark as {task.status === "pending" ? "Completed" : "Pending"}
        </button>

        {currentUser.role==='admin'&&<><Link to={`/tasks/${task._id}/edit`}>
          <button style={{ padding: "0.5rem 1rem" }}>Edit</button>
        </Link>

        <button onClick={handleDelete} style={{ padding: "0.5rem 1rem", backgroundColor: "#ff4d4f", color: "#fff" }}>
          Delete
        </button></>}
      </div>
    </div>
  );
};

export default TaskDetail;
