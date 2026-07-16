import { NavLink } from "react-router-dom";

function Navbar() {
  const active = ({ isActive }) => ({
    color: isActive ? "red" : "blue",
    fontWeight: "bold",
    textDecoration: "none",
    marginRight: "20px"
  });

  return (
    <nav style={{ padding: "20px", textAlign: "center" }}>
      <NavLink to="/" style={active}>
        Home
      </NavLink>

      <NavLink to="/projects" style={active}>
        Projects
      </NavLink>

      <NavLink to="/contact" style={active}>
        Contact
      </NavLink>
    </nav>
  );
}

export default Navbar;