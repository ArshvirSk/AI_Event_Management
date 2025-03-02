import React from "react";
import EventoImg from "../assets/EVENTO.png";

const LandingPage = () => {
  return (
    <div className="p-2.5 bg-gray-200">
      <div className="bg-landing border border-gray-500 h-screen flex flex-col items-center justify-center text-center gap-2 rounded-3xl">
        <div>
          <img
            src={EventoImg}
            alt="Evento Image"
            className="select-none"
            width={600}
            draggable={false}
          />
          <p className="text-gray-600 text-xl -mt-10">
            The AI-powered Event Manager Solution
          </p>
        </div>
        {/* Presents text */}
        <p className="text-gray-800 text-3xl mt-2 font-bold">at</p>

        {/* Main heading */}
        <h1 className="text-3xl md:text-7xl font-bold">Techspark &apos;25</h1>

        {/* Subtitle */}

        {/* Learn more button */}
        {/* <button className="mt-4 cursor-pointer bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors">
          Learn more
        </button> */}
      </div>
      <div className="flex gap-6 mt-5">
        <div className="flex-1 border border-black rounded-xl p-10">
          <h1 className="text-4xl font-bold bg-[#b9ff66] p-3 w-full">Tasks</h1>
        </div>
        <div className="flex-1">
          <div className="border border-black rounded-xl p-10">
            <h1 className="text-4xl font-bold bg-[#b9ff66] p-3 w-full">
              Events
            </h1>
            <a href="/event-ideas" className="mt-4 flex items-center gap-3 group mt-12">
              <div className="bg-[#191a23] rounded-full p-2 transition-transform duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b9ff66"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-300"
                >
                  <line x1="5" y1="19" x2="19" y2="5"></line>
                  <polyline points="12 5 19 5 19 12"></polyline>
                </svg>
              </div>

              <h1 className="text-2xl">Learn more</h1>
            </a>
          </div>
          <div className="flex gap-6 mt-6">
            <div className="flex-1 border border-black rounded-xl p-10">
              <h1 className="text-4xl font-bold bg-[#b9ff66] p-3 w-full">
                Finance Tracker
              </h1>
              <a href="/finance-tracker" className="mt-4 flex items-center gap-3 group mt-12">
                <div className="bg-[#191a23] rounded-full p-2 transition-transform duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b9ff66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-300"
                  >
                    <line x1="5" y1="19" x2="19" y2="5"></line>
                    <polyline points="12 5 19 5 19 12"></polyline>
                  </svg>
                </div>

                <h1 className="text-2xl">Learn more</h1>
              </a>
            </div>
            <div className="flex-1 border border-black rounded-xl p-10">
              <h1 className="text-4xl font-bold bg-[#b9ff66] p-3 w-full">
                Pending Tasks
              </h1>
              <a href="/committee-allocation" className="mt-4 flex items-center gap-3 group mt-12">
                <div className="bg-[#191a23] rounded-full p-2 transition-transform duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b9ff66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-300"
                  >
                    <line x1="5" y1="19" x2="19" y2="5"></line>
                    <polyline points="12 5 19 5 19 12"></polyline>
                  </svg>
                </div>

                <h1 className="text-2xl">Learn more</h1>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
