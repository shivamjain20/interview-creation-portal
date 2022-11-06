import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav>
      <div className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          Interview Creation Portal
        </Link>
        <ul className={styles.options}>
          <li>
            <Link to="/">Interview List</Link>
          </li>
          <li>
            <Link to="/create">Create Meeting</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
