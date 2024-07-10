"use client";

// Import required modules and components
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import trashIcon from "@/assets/icons/trash.png";
import saveIcon from "@/assets/icons/save.png";
import addIcon from "@/assets/icons/add.png";
import backIcon from "@/assets/icons/back.png";
import withAuthenticated from "@/components/withAuthenticated";
import customRequestInit from "@/utils/customRequestInit";
import { API_URL } from "@/utils/constants";

/**
 * ConfigureAppointmentPage component
 * Renders the configure appointment page
 */
function ConfigureAppointmentPage() {
  // Define state variables
  const [fields, setFields] = useState<Array<string>>([]);
  const [inputField, setInputField] = useState<string>("");
  const [saveFields, setSaveFields] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isTokenOk, setIsTokenOk] = useState(false);
  const [loadingFields, setLoadingFields] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsTokenOk(true);
    } else {
      location.href = "/auth";
    }
    const options: RequestInit = customRequestInit(token, "PUT", fields);
    if (saveFields) {
      // Save the fields
      fetch(`${API_URL}/appointment-fields`, options)
        .then((data) => {
          localStorage.removeItem("fields");
          // Check if the token is valid
          if (data.status === 422 || data.status === 401) {
            localStorage.removeItem("token");
            location.href = "/auth";
          } else {
            setIsSaved(true);
          }
          return data.json();
        })
        .then((data) => {
          // Save the fields to the local storage
          localStorage.setItem("fields", JSON.stringify(data));
        });
    }
  }, [saveFields, fields]);

  // Fetch the fields from the API and set the state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const options: RequestInit = {
      // Set the headers
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    // Fetch the fields
    fetch(`${API_URL}/appointment-fields`, options)
      .then((data) => data.json())
      .then((data) => {
        let fields = localStorage.getItem("fields");
        // Check if the token has expired
        if (
          data.msg === "Token has expired" ||
          (fields && JSON.parse(fields)?.msg === "Token has expired")
        ) {
          // Remove the token and fields from the local storage
          localStorage.removeItem("token");
          localStorage.removeItem("fields");
        }
        // Add the fields to the local storage.
        else {
          setFields(data);
          localStorage.setItem("fields", JSON.stringify(data));
          setLoadingFields(false);
        }
      });
  }, []);

  // Reusable component for displaying a field
  const FieldItem = ({ field, index }: { field: string; index: number }) => (
    <div
      className="mb-2 flex justify-between list-none items-center"
      key={index}
    >
      <div>
        <p>{field}</p>
      </div>
      <button
        className="flex items-center"
        onClick={() => {
          // Remove the field from the fields array
          const newFields = fields.filter((_, i) => i !== index);
          localStorage.setItem("fields", JSON.stringify(newFields));
          setFields(newFields);
        }}
      >
        <Image src={trashIcon} alt="remove icon" width={15} height={15} />
        <span className="text-sm ml-1">Remove</span>
      </button>
    </div>
  );

  // Render the component
  return isTokenOk ? (
    <main className="lg:px-20 pt-10">
      <ConfigureAppointmentHeader backIcon={backIcon} />
      <section className="w-10/12 max-w-lg bg-slate-50 mx-auto mt-14 p-10 box-border border border-gray-400 rounded-md">
        {isSaved && (
          <p className="text-xs text-green-600 my-2">Changes were successful</p>
        )}
        <h3 className="mb-1 font-semibold text-xl">Add appointment fields</h3>
        <p className="text-gray-600 text-xs mb-5">
          Appointments fields are the fields you want to be available when
          adding a patient appointment to the appointments list
        </p>
        <div className="mb-10">
          {loadingFields && <p className="text-sm my-2">Loading fields ...</p>}
          <h3 className="underline font-semibold">Fields</h3>
          {fields.map((field, index) => (
            <FieldItem field={field} index={index} key={index} />
          ))}
        </div>
        <input
          className="text-xs py-2 px-4 w-full rounded-lg mb-2 border border-gray-400"
          type="text"
          placeholder="Type in the appointment field you want to create"
          onChange={(e) => {
            setSaveFields(false);
            setInputField(e.target.value);
          }}
          value={inputField}
        />
        <div className="flex justify-end mt-2">
          <button
            className="mr-2 border rounded-2xl border-black px-4 py-1 text-sm flex items-center"
            onClick={() => {
              // Add the input field to the fields array
              if (inputField !== "")
                setFields([...fields, inputField.trim().toLowerCase()]);
              // Clear the input field
              setInputField("");
            }}
          >
            <Image src={addIcon} alt="add fields" width={13} height={13} />
            <span className="text-sm ml-1"> Add field</span>
          </button>
          <button
            className="border rounded-2xl border-black px-4 py-1 text-sm flex items-center"
            onClick={() => {
              setSaveFields(true);
            }}
          >
            <Image src={saveIcon} alt="save fields" width={15} height={15} />
            <span className="text-sm ml-1">Save</span>
          </button>
        </div>
      </section>
      {/* Logo and app name */}
      <div className="flex justify-center items-center mt-10 mb-6">
        <Image
          src="/logo.svg"
          alt="Omnihale logo"
          width={30}
          height={30}
          className="mr-3 rounded-md"
        />
        <p className="font-semibold mr-1">Omnihale</p>
        <p className="text-gray-500">for Business</p>
      </div>
    </main>
  ) : (
    <div></div>
  );
}

export default withAuthenticated(ConfigureAppointmentPage);

function ConfigureAppointmentHeader({
  backIcon,
}: {
  backIcon: StaticImageData;
}) {
  return (
    <header className="flex items-center justify-between mx-2 lg:mx-0">
      {/* Go back home */}
      <a href="/">
        <Image
          src={backIcon}
          alt="back home"
          width={25}
          height={25}
          className="mr-2"
        />
      </a>
      <h1 className="text-md lg:text-2xl font-semibold">
        Configure Appointment
      </h1>
    </header>
  );
}
