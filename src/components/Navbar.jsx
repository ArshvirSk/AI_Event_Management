import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase/config";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="z-[100] sticky top-6 rounded-full w-[55vw] mx-auto flex items-center justify-center gap-10 py-4 my-5 text-[18px] drop-shadow-lg bg-white bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 border border-gray-300">
      <ul className="flex items-center justify-center max-w-5xl gap-10">
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <NavLink to="/">Home</NavLink>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <NavLink to="/finance-tracker">Finance Tracker</NavLink>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <NavLink to="/committee-allocation">Committee Allocation</NavLink>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <NavLink to="/event-ideas">Event Ideas</NavLink>
        </li>
        {user && (
          <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
        )}
      </ul>

      {user ? (
        <div className="relative" ref={dropdownRef}>
          <img
            src={
              user.photoURL ||
              "https://api.dicebear.com/7.x/avatars/svg?seed=" + user.email
            }
            alt="Profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition-all"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Click to open menu"
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700">
                  {user.displayName || user.email}
                </div>
              </div>
              <div className="py-1">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </NavLink>
              </div>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleGoogleSignIn}
          className="px-6 py-1.5 rounded-lg border border-[#2c2c2c] bg-[#2c2c2c] cursor-pointer text-white hover:border-[#767676] hover:bg-[#e3e3e3] hover:text-black transition-all 300ms"
        >
          Sign in
        </button>
      )}
    </nav>
  );
};

export default Navbar;
