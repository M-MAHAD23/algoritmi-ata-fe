import React, { useState, useRef } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useProfile, useProfileEdit } from '../hooks/hooks';

const UserProfileEditModal = ({ setIsModalOpen, userProfile }) => {
    const fileInputRef = useRef(null);
    const { updateProfile, isLoading, error } = useProfileEdit();
    const [formData, setFormData] = useState({
        name: userProfile?.name || '',
        email: userProfile?.email || '',
        image: userProfile?.image || '',
        password: '',
        section: userProfile?.section || '',
        cnic: userProfile?.cnic || '',
        profileImage: null, // Default null to store the file object directly
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profileImage: file, // Save the actual file object instead of base64
            }));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();

            // Append regular fields
            formData.append("name", formData.name);
            formData.append("email", formData.email);
            formData.append("password", formData.password);
            formData.append("section", formData.section);
            formData.append("cnic", formData.cnic);

            // Append image file if it exists
            if (formData.profileImage instanceof File) {
                formData.append("files", formData.profileImage);
            }

            // Log each entry in FormData for debugging
            for (const [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            // Send formData to your API
            const response = await updateProfile(formData);


            const updatedProfile = await updateProfile(formDataToSend);
            console.log("Profile updated successfully:", updatedProfile);
            // setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

                {/* Profile Image Section */}
                <div className="flex items-center flex-col justify-center mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img
                                src={
                                    formData.profileImage
                                        ? URL.createObjectURL(formData.profileImage)
                                        : formData.image
                                }
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer"
                            >
                                <FaEdit />
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    <div className="mt-5 text-sm text-gray-500">
                        {formData.profileImage ? "Click to change image" : "No image selected"}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Section</label>
                        <input
                            type="text"
                            name="section"
                            value={formData.section}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">CNIC</label>
                        <input
                            type="text"
                            name="cnic"
                            value={formData.cnic}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEditModal;
