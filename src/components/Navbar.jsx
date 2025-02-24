import React from "react";

const Navbar = () => {
  return (
    <nav className="absolute right-0 left-0 top-0 rounded-full w-[55vw] mx-auto flex items-center justify-center gap-10 py-4 my-5 text-[18px] drop-shadow-lg bg-white bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-300">
      <ul className="flex items-center justify-center max-w-5xl gap-10">
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/">Home</a>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/finance-tracker">Finance Tracker</a>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/dashboard">Dashboard</a>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/committee-allocation">Committee Allocation</a>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/profile">Profile</a>
        </li>
        <li className="hover:text-blue-500 transition-all 700ms ease-in-out">
          <a href="/contact">Contact</a>
        </li>
      </ul>

      <button className="px-6 py-1.5 rounded-lg border border-[#2c2c2c] bg-[#2c2c2c] cursor-pointer text-white hover:border-[#767676] hover:bg-[#e3e3e3] hover:text-black transition-all 300ms">
        Sign in
      </button>
    </nav>
  );
};

export default Navbar;
