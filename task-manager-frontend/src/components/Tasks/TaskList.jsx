import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));


  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/tasks?page=${page}`);
      console.log(tasks)
      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff4d4f"; // red
      case "medium":
        return "#faad14"; // orange
      case "low":
        return "#52c41a"; // green
      default:
        return "#d9d9d9"; // gray
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
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

  const searchuser=(id)=>{
    return users.find(item=>item._id===id)?.email||" "
  }


  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Task List</h2>
      {(currentUser&&currentUser.role==='admin')&&<Link to="/tasks/new">
        <button style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>+ Add Task</button>
      </Link>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: `2px solid ${getPriorityColor(task.priority)}`,
              borderRadius: "8px",
              padding: "1rem",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{task.title}</h3>
            <p><strong>Assigned To:</strong>{searchuser(task?.assignedTo)}</p>
            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p>
              <strong>Priority: </strong>
              <span style={{ color: getPriorityColor(task.priority), fontWeight: "bold" }}>{task.priority}</span>
            </p>
            <Link to={`/tasks/${task._id}`}>
              <button style={{ marginTop: "0.5rem", padding: "0.4rem 0.8rem" }}>View</button>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
        <button disabled={page === 1} onClick={handlePrev} style={{ padding: "0.5rem 1rem" }}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={handleNext} style={{ padding: "0.5rem 1rem" }}>Next</button>
      </div>
    </div>
  );
};

export default TaskList;
