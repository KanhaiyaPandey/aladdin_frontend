"use client";

import { customerFetch } from "@/utils/helpers";
import { PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import InfoCards from "./InfoCards";

const UserInfo = ({
  setDominantColor,
  dominantColor,
  user,
  setUser,
  setUserInfo,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [editing, setEditing] = useState({ name: false, email: false });
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const imageRef = useRef(null);
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    if (!user?.profilePicture) {
      setImageUrl(null);
      return;
    }
    setImageUrl(user.profilePicture);
  }, [user]);

  useEffect(() => {
    setFormValues({
      name: user?.name || "",
      email: user?.email || "",
    });
    setHasChanges(false);
  }, [user]);

  // Check for changes
  useEffect(() => {
    const hasFormChanges =
      formValues.name !== user?.name || formValues.email !== user?.email;
    setHasChanges(hasFormChanges);
  }, [formValues, user]);

  const toggleEdit = (field) => {
    setEditing((s) => ({ ...s, [field]: !s[field] }));
    setTimeout(() => {
      if (field === "name") nameRef.current?.focus();
      if (field === "email") emailRef.current?.focus();
    }, 0);
  };

  const handleChange = (field, value) =>
    setFormValues((s) => ({ ...s, [field]: value }));

  const handleSave = (field) => {
    // Just close the edit mode, don't update user yet
    setEditing((s) => ({ ...s, [field]: false }));
  };

  const handleCancel = (field) => {
    setFormValues((s) => ({ ...s, [field]: user?.[field] || "" }));
    setEditing((s) => ({ ...s, [field]: false }));
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = {
        ...user,
        name: formValues.name,
        email: formValues.email,
      };
      const response = await customerFetch.put("/update-profile", updatedUser);
      console.log(response.data.data);
      setUserInfo(response.data.data);
      setUser(response.data.data);
      setHasChanges(false);
      setEditing({ name: false, email: false });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDiscard = () => {
    setFormValues({
      name: user?.name || "",
      email: user?.email || "",
    });
    setEditing({ name: false, email: false });
    setHasChanges(false);
    console.log("Changes discarded");
  };

  const getBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => cb(reader.result));
    reader.readAsDataURL(file);
  };

  const handleImageChange = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    // basic validation
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      console.error("You can only upload JPG/PNG file!");
      return;
    }
    if (!isLt2M) {
      console.error("Image must be smaller than 2MB!");
      return;
    }

    // show preview immediately
    getBase64(file, (url) => {
      setImageUrl(url);
    });

    // upload to server using handleImageSave
    await handleImageSave(file);
  };

  const handleImageSave = async (file) => {
    if (!file) return;
    try {
      setImgUploading(true);
      const formData = new FormData();
      // send file under key "media" per requirement
      formData.append("media", file);

      const response = await customerFetch.post(
        "/update-profile-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = response?.data?.data;
      if (updated) {
        setUserInfo(updated);
        setUser(updated);
        if (updated.profilePicture) setImageUrl(updated.profilePicture);
      } else {
        console.warn("Image uploaded but no user data returned");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setImgUploading(false);
      // clear input to allow re-upload same file if needed
      if (imageRef.current) imageRef.current.value = "";
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white rounded-t-3xl z-10">
      <div className="w-full flex items-center justify-center pt-8">
        <div className="absolute w-52 h-52 group duration-300 transition-all ease-in-out overflow-hidden rounded-full flex items-center border justify-center border-black z-20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Profile Picture"
              width={208}
              height={208}
              className="object-cover w-52 h-52"
            />
          ) : (
            <div className="w-52 h-52 bg-gray-200 flex items-center justify-center">
              <PlusOutlined style={{ fontSize: "48px", color: "#999" }} />
            </div>
          )}
          <button
            className="absolute z-30 bottom-2 bg-white p-2 rounded-full border border-black flex items-center justify-center"
            type="button"
            onClick={() => imageRef.current?.click()}
          >
            <CiEdit />
          </button>

          <input
            ref={imageRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="w-full mt-40 px-6 flex flex-col gap-y-2">
        <div className="flex md:w-1/4 w-full justify-between items-end gap-x-7">
          <input
            ref={nameRef}
            type="text"
            disabled={!editing.name}
            value={formValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`text-xl w-full font-bold focus:border-0 focus:ring-0 focus:outline-none bg-white ${
              editing.name ? "border-b border-gray-300" : ""
            }`}
          />
          {!editing.name ? (
            <button onClick={() => toggleEdit("name")} aria-label="Edit name">
              <CiEdit />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("name")}
                className="text-sm px-2 py-1 bg-black text-white rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleCancel("name")}
                className="text-sm px-2 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex md:w-1/4 w-full justify-between items-end gap-x-7 ">
          <input
            ref={emailRef}
            type="text"
            disabled={!editing.email}
            value={formValues.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={` w-full focus:border-0 focus:ring-0 focus:outline-none bg-white ${
              editing.email ? "border-b border-gray-300" : ""
            }`}
          />
          {!editing.email ? (
            <button onClick={() => toggleEdit("email")} aria-label="Edit email">
              <CiEdit />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave("email")}
                className="text-sm px-3 py-1 bg-black text-white rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleCancel("email")}
                className="text-sm px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Only show Save/Discard buttons if there are changes */}
        {hasChanges && (
          <div className="md:w-1/6 w-full flex items-center justify-start gap-2 mt-4">
            <button
              onClick={() => handleUpdate()}
              className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-slate-200 hover:text-black transition"
            >
              Save All
            </button>
            <button
              onClick={() => handleDiscard()}
              className="px-3 py-1 text-sm bg-gray-300 text-black rounded hover:bg-gray-400 transition"
            >
              Discard
            </button>
          </div>
        )}
      </div>

      <InfoCards user={user} setUser={setUser} handleUpdate={handleUpdate} />
    </div>
  );
};

export default UserInfo;
