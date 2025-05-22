import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const TaskForm = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: currentUser._id,
  });

  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/users`);
      console.log(res.data)
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/tasks", task);
      alert('Task Added Succesfully')
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Task creation failed");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>Create New Task</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <select
          name="assignedTo"
          value={task.assignedTo}
          onChange={handleChange}
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        >
          <option value="">-- Assign to user --</option>
          {users.length>0&&users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={task.title}
          onChange={handleChange}
          required
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          required
          rows={4}
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        />

        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          required
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        />

        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          style={{ padding: "0.6rem", fontSize: "1rem" }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button type="submit" style={{ padding: "0.8rem", backgroundColor: "#1890ff", color: "#fff", border: "none" }}>
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
