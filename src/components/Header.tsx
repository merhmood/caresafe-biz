import React from "react";
import Image from "next/image";
import profileIcon from "@/assets/icons/profile.png";
import signoutIcon from "@/assets/icons/signout.png";
import consultationIcon from "@/assets/icons/consultation.png";

const Header = () => {
  return (
    <header className="lg:flex mb-10 lg:justify-between">
      <div className="mb-6 lg:mb-0 flex items-center">
        <Image
          src="/logo.svg"
          alt="Omnihale Logo"
          width={35}
          height={35}
          className="rounded-md lg:rounded-md mr-2"
        />
        <h1 className="text-xl font-semibold mr-2">caresafe</h1>
        <p className="text-gray-400">for Business</p>
      </div>
      <div className="lg:flex">
        <button
          className="flex items-center mb-2 lg:mb-0 lg:mr-6"
          onClick={() => {
            location.href = "/consultation";
          }}
        >
          <Image
            src={consultationIcon}
            alt="consultation"
            width={24}
            height={24}
            className="mr-1"
          />
          <span>consultation</span>
        </button>
        <button
          className="flex items-center mb-2 lg:mb-0 lg:mr-6"
          onClick={() => {
            location.href = "/profile";
          }}
        >
          <Image
            src={profileIcon}
            alt="profile"
            width={14}
            height={14}
            className="mr-1"
          />
          <span>profile</span>
        </button>
        <button
          className="flex items-center"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("fields");
            localStorage.removeItem("appointments");
            localStorage.removeItem("user_id");
            location.reload();
          }}
        >
          <Image
            src={signoutIcon}
            alt="profile"
            width={14}
            height={14}
            className="mr-1"
          />
          sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
