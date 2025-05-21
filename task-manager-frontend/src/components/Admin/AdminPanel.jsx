import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data);
      } catch {
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Panel - Users</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
