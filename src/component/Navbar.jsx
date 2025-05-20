import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">داشبورد</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav mb-2 mb-lg-0">
            {user ? (
              <li className="nav-item">
                <button className="btn btn-success" onClick={handleLogout}>
                  خروج
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-success">
                  ورود
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
