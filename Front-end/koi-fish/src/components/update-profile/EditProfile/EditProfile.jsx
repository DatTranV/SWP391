import { useState } from "react";
import { FaUser, FaCamera } from "react-icons/fa";

import axios from "axios";

import api from "../../../config/axios.js";

import { toast } from "react-toastify";

export function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",

    phoneNumber: "",
    birthDate: "",
    gender: "",
    avatar: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  const handleImageReview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/ddqgjy50x/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile");

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData((prevData) => ({
        ...prevData,
        avatar: response.data.secure_url,
      }));

      console.log("Image uploaded to Cloudinary:", response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo đối tượng chứa chỉ các trường có giá trị
    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "") {
        updatedData[key] = formData[key];
      }
    });

    try {
      const response = await api.put(
        `v1/user/updateProfile/id=${userId}`,
        updatedData
      );
      console.log("Profile updated successfully:", response.data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      const regex = /^[A-Za-zÀ-ỹ ]*$/;
      if (!regex.test(value)) {
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <span className="inline-block h-32 w-32 rounded-full overflow-hidden bg-gray-100">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUser
                className="h-full w-full text-gray-300"
                aria-hidden="true"
              />
            )}
          </span>
          <label
            htmlFor="avatar"
            className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
          >
            <FaCamera className="h-5 w-5 text-gray-400" />
          </label>
          <input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleImageReview}
            className="hidden"
          />
        </div>

        <h1 className="text-3xl font-bold mt-4 text-gray-800">Your Profile</h1>
      </div>
      {isUploading && <p>Uploading you avatar...</p>}
      {uploadError && <p className="text-red-500">{uploadError}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            pattern="[A-Za-zÀ-ỹ ]+"
            placeholder="Name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phoneNumber"
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            pattern="^(\+84|0)(9|8|7|5|3)[0-9]{8}$"
            title="Phone number must start with +84 or 0 and followed by 9, 8, 7, 5, or 3, with a total of 10 digits."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="birthdate"
            className="block text-sm font-medium text-gray-700"
          >
            Birthdate
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select gender</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
            <option value="2">Other</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            // style={{ backgroundColor: "#d9534f" }}

            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
