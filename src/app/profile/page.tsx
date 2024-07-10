"use client";

import { useState, useRef, useEffect, FormEventHandler } from "react";
import DOMpurify from "dompurify";

import Image, { StaticImageData } from "next/image";

import backIcon from "@/assets/icons/back.png";
import saveIcon from "@/assets/icons/save.png";
import withAuthenticated from "@/components/withAuthenticated";
import { API_URL } from "@/utils/constants";
import customRequestInit from "@/utils/customRequestInit";

type ProfileDetails = {
  name: string;
  address: string;
  remoteAppointmentsThreshold: number;
  dailyAppointmentsThreshold: number;
};

function ProfilePage() {
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    address: "",
    name: "",
    remoteAppointmentsThreshold: 0,
    dailyAppointmentsThreshold: 0,
  });
  const [updated, setUpdated] = useState(false);
  const [inValidThreshold, setInValidThreshold] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      location.href = "/auth";
    }
    const options: RequestInit = customRequestInit(token, "GET");
    // Get user profile details
    fetch(`${API_URL}/profile`, options)
      .then((res) => res.json())
      .then((data: ProfileDetails) => {
        setProfileDetails(data);
      });
  }, []);

  const saveProfile = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      location.href = "/auth";
    }
    const options: RequestInit = customRequestInit(
      token,
      "PUT",
      profileDetails
    );

    // update user profile details
    fetch(`${API_URL}/profile`, options)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "profile updated") {
          setUpdated(true);
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      });
  };
  return (
    <main>
      <ProfileHeader backIcon={backIcon} />
      <section className="grid place-items-center">
        <div className="w-8/12">
          {updated && (
            <p className="mb-3 text-green-700 text-center">Profile Updated</p>
          )}
          {inValidThreshold && (
            <p className="mb-3 text-red-700 text-center">
              remote threshold should be smaller than daily threshold
            </p>
          )}
          <div className="flex justify-center mb-6">
            <ProfileDetails
              setProfileDetails={setProfileDetails}
              profileDetails={profileDetails}
              saveProfile={saveProfile}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default withAuthenticated(ProfilePage);

function ProfileHeader({ backIcon }: { backIcon: string | StaticImageData }) {
  return (
    <header className="flex items-center justify-between w-4/6 mb-40 mt-12 m-auto">
      {/* go back home */}
      <a href="/">
        <Image
          src={backIcon}
          alt="back home"
          width={25}
          height={25}
          className="mr-2"
        />
      </a>
      <h1 className="text-2xl font-semibold">Profile</h1>
    </header>
  );
}

function ProfileDetails({
  profileDetails,
  setProfileDetails,
  saveProfile,
}: {
  profileDetails: ProfileDetails;
  setProfileDetails: React.Dispatch<React.SetStateAction<ProfileDetails>>;
  saveProfile: () => void;
}) {
  return (
    <div className="ml-4 p-2 w-96">
      <p className="text-xs mb-3">
        To edit kindly click on the individual details and after editing your
        details ensure you click on save button to implement changes
      </p>
      <ProfileDetail
        label="Name"
        value={profileDetails.name}
        onInput={(e: any) =>
          setProfileDetails((state) => ({
            ...state,
            name: DOMpurify.sanitize(e.target.innerHTML),
          }))
        }
      />
      <ProfileDetail
        label="Address"
        value={profileDetails.address}
        onInput={(e: any) =>
          setProfileDetails((state) => ({
            ...state,
            address: DOMpurify.sanitize(e.target.innerHTML),
          }))
        }
      />
      <h3 className="font-black mt-3 mb-1">Appointments Threshold</h3>
      <ProfileDetail
        label="Remote"
        value={profileDetails.remoteAppointmentsThreshold}
        onInput={(e: any) =>
          setProfileDetails((state) => ({
            ...state,
            remoteAppointmentsThreshold: parseInt(
              DOMpurify.sanitize(e.target.innerHTML)
            ),
          }))
        }
      />
      <ProfileDetail
        label="Daily"
        value={profileDetails.dailyAppointmentsThreshold}
        onInput={(e: any) =>
          setProfileDetails((state) => ({
            ...state,
            dailyAppointmentsThreshold: parseInt(
              DOMpurify.sanitize(e.target.innerHTML)
            ),
          }))
        }
      />
      <div className="mt-8"></div>
      <SaveProfileDetails saveIcon={saveIcon} onSaveProfile={saveProfile} />
    </div>
  );
}

function ProfileDetail({
  label,
  value,
  onInput,
}: {
  label: string;
  value: string | number;
  onInput?: FormEventHandler<HTMLSpanElement>;
}) {
  return (
    <div>
      <span className="font-semibold">{label}</span>:
      <span
        contentEditable
        onBlur={onInput}
        suppressContentEditableWarning={true}
        className="px-2"
      >
        {value}
      </span>
    </div>
  );
}

function SaveProfileDetails({
  saveIcon,
  onSaveProfile,
}: {
  saveIcon: string | StaticImageData;
  onSaveProfile: () => void;
}) {
  return (
    <div className="flex justify-end">
      <button
        className="border rounded-2xl border-black px-4 py-1 text-sm flex items-center"
        onClick={onSaveProfile}
      >
        <Image src={saveIcon} alt="save fields" width={15} height={15} />
        <span className="text-sm ml-1">Save</span>
      </button>
    </div>
  );
}
