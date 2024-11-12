import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { pathname } = useLocation();
  const storageKey = "userData";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const onLogout = () => {
    setIsLoading(true);
    localStorage.removeItem(storageKey);
    location.replace(pathname);
    setIsLoading(false);
  };
  return (
    <nav className="max-w-lg mx-auto mt-7 mb-20 px-3 py-5 rounded-md">
      <ul className="flex items-center justify-between">
        <li className="text-black duration-200 font-semibold text-lg">
          <NavLink to="/">Home</NavLink>
        </li>
        {userData ? (
          <div className="flex items-center text-indigo-600 space-x-4">
            <li className="duration-200 text-lg">
              <NavLink to="/todos">todos</NavLink>
            </li>
            <li className="duration-200 text-lg">
              <p className="cursor-default">{userData.user.username}</p>
            </li>
            <button
              className="bg-indigo-500 text-white p-2 rounded-md cursor-pointer"
              onClick={onLogout}
            >
              {isLoading ? "isLoading..." : "Logout"}
            </button>
          </div>
        ) : (
          <p className="flex items-center space-x-3">
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/register">Register</NavLink>
            </li>
            <li className="text-black duration-200 font-semibold text-lg">
              <NavLink to="/login">Login</NavLink>
            </li>
          </p>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
