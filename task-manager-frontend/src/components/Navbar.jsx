import { Link } from "react-router-dom";

const Navbar = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  return (
    <nav
      style={{
        backgroundColor: "#1890ff",
        padding: "1rem 2rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: "bold", fontSize: "1.5rem" }}>
        Task Manager
      </h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
        >
          Tasks
        </Link>
        {currentUser.role==='admin'&&<><Link
          to="/admin"
          style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
        >
          Users
        </Link>
        <Link
          to="/register"
          style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
        >
          Register
        </Link></>}
      </div>
    </nav>
  );
};

export default Navbar;
