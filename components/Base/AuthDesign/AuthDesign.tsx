import React from "react";
import Image from "next/image";
import TakshahubLogo from "../../../public/Takshahub_logo.png";

const AuthDesign = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Image
        src={TakshahubLogo}
        alt="TakshaHub Logo"
        className="w-48 h-48 mt-12"
        loading="eager"
      />
      <span className="theme-text text-4xl text-theme-text mb-4">
        Takshahub
      </span>
      <div className="flex min-[1270px]:flex-row max-[1269px]:flex-col items-center gap-6 text-white text-lg font-semibold">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-cyan-400"></span>
          <span>Learn</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full  bg-violet-600"></span>
          <span>Manage</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full bg-pink-500"></span>
          <span>Empower</span>
        </div>
      </div>
    </div>
  );
};

export default AuthDesign;
