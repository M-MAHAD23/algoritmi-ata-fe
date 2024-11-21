import { useState, useContext, useRef } from "react";
import { useProfileEdit } from "../../hooks/hooks";
import GenericModal from "../../components/GenericModal";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../../common/Loader";
import getUserProfile from "../../hooks/profile";
import LaunchATAContext from "../../context/AppContext";
import { FaEdit } from "react-icons/fa";
import profileImage from "../../images/ata/profile.png"

const UserProfileEditModal = ({ setIsModalOpen, userProfile, onSubmit }) => {
    const fileInputRef = useRef(null);
    const { profile, setProfile } = useContext(LaunchATAContext);
    const { updateProfile, loading } = useProfileEdit();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: profile?.name || "",
        image: profile?.image || "",
        password: profile?.rawPassword || "",
        contact: profile?.contact || [],
        social: profile?.social || [],
        education: profile?.education || [],
        work: profile?.work || [],
        profileImage: null,
    });
    const [errors, setErrors] = useState({
        name: "",
        password: "",
        contact: "",
        social: "",
        education: "",
        work: "",
    });

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        if (name === "contact") {
            const index = dataset.index;
            const updatedContact = [...formData.contact];
            updatedContact[index] = value;
            setFormData((prev) => ({ ...prev, contact: updatedContact }));
            if (updatedContact.every((contact) => contact.trim() !== "")) {
                setErrors((prev) => ({ ...prev, contact: "" }));
            }
        } else if (name === "social") {
            const index = dataset.index;
            const updatedSocial = [...formData.social];
            updatedSocial[index] = value;
            setFormData((prev) => ({ ...prev, social: updatedSocial }));
            if (updatedSocial.every((social) => social.trim() !== "")) {
                setErrors((prev) => ({ ...prev, social: "" }));
            }
        } else if (name.startsWith("education") || name.startsWith("work")) {
            const [key, index] = name.split("-");
            const updatedArray = [...formData[key]];
            const fieldKey = dataset.key; // Get the correct field key
            updatedArray[index][fieldKey] = value; // Update the correct field
            setFormData((prev) => ({ ...prev, [key]: updatedArray }));

            if (updatedArray.every((item) => !Object.values(item).some((field) => field.trim() === ""))) {
                setErrors((prev) => ({ ...prev, [key]: "" }));
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddItem = (field) => {
        const isFieldEmpty = (item) => {
            if (typeof item === "string") {
                return item.trim() === "";
            }
            if (typeof item === "object") {
                return Object.values(item).some((value) => value.trim() === "");
            }
            return false;
        };

        if (field === "contact") {
            if (formData.contact.some(isFieldEmpty)) {
                setErrors((prev) => ({
                    ...prev,
                    contact: "Please complete all contact fields before adding more.",
                }));
                return;
            }
            setFormData((prev) => ({ ...prev, contact: [...prev.contact, ""] }));
        } else if (field === "social") {
            if (formData.social.some(isFieldEmpty)) {
                setErrors((prev) => ({
                    ...prev,
                    social: "Please complete all social fields before adding more.",
                }));
                return;
            }
            setFormData((prev) => ({ ...prev, social: [...prev.social, ""] }));
        } else if (field === "education") {
            if (formData.education.some(isFieldEmpty)) {
                setErrors((prev) => ({
                    ...prev,
                    education: "Please complete all education fields before adding more.",
                }));
                return;
            }
            setFormData((prev) => ({
                ...prev,
                education: [...prev.education, { degree: "", role: "", started: "", ended: "" }],
            }));
        } else if (field === "work") {
            if (formData.work.some(isFieldEmpty)) {
                setErrors((prev) => ({
                    ...prev,
                    work: "Please complete all work fields before adding more.",
                }));
                return;
            }
            setFormData((prev) => ({
                ...prev,
                work: [...prev.work, { work: "", role: "", started: "", ended: "" }],
            }));
        }
    };

    const handleRemoveItem = (field, index) => {
        if (field === "contact") {
            const updatedContact = formData.contact.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, contact: updatedContact }));
        } else if (field === "social") {
            const updatedSocial = formData.social.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, social: updatedSocial }));
        } else if (field === "education") {
            const updatedEducation = formData.education.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, education: updatedEducation }));
        } else if (field === "work") {
            const updatedWork = formData.work.filter((_, i) => i !== index);
            setFormData((prev) => ({ ...prev, work: updatedWork }));
        }
    };

    const isValidPakistaniNumber = (number) => {
        const pakistaniNumberRegex = /^(?:\+92|92|03\d)\s?\d{3}\s?\d{7}$/;
        return pakistaniNumberRegex.test(number);
    };

    const validateForm = () => {
        const newErrors = {
            // name: formData.name ? "" : "Name is required",
            // password: formData.password ? "" : "Password is required",
            contact: formData.contact.every((num) => isValidPakistaniNumber(num))
                ? ""
                : "Please enter valid Pakistani contact numbers (e.g., +92 300 1234567).",
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const save = async () => {
        if (!validateForm()) return;

        try {
            const { profileImage, ...restFormData } = formData;
            const updatedFormData = new FormData();
            updatedFormData.append("name", restFormData.name);
            updatedFormData.append("password", restFormData.password);
            updatedFormData.append("contact", JSON.stringify(restFormData.contact));
            updatedFormData.append("social", JSON.stringify(restFormData.social));
            updatedFormData.append("education", JSON.stringify(restFormData.education));
            updatedFormData.append("work", JSON.stringify(restFormData.work));
            updatedFormData.append("id", profile._id);

            if (profileImage instanceof File) {
                updatedFormData.append("files", profileImage);
            }

            for (let [key, value] of updatedFormData.entries()) {
                console.log(`${key}: ${value}`);
            }

            await updateProfile(updatedFormData);
            const userProfileFromAPI = await getUserProfile();
            setProfile(userProfileFromAPI);
            setIsModalOpen(false);
            onSubmit(updatedFormData);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile!");
        }
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
        toast.promise(save(), {
            loading: 'Saving...',
            success: <b>Settings saved!</b>,
            error: <b>Could not save.</b>,
        });
    };

    const handleCancel = () => {
        setFormData({          // Reset formData to initial state
            name: profile?.name || "",
            image: profile?.image || "",
            password: profile?.rawPassword || "",
            contact: profile?.contact || [""],
            social: profile?.social || [""],
            education: profile?.education || [{ degree: "", role: "", started: "", ended: "" }],
            work: profile?.work || [{ work: "", role: "", started: "", ended: "" }],
            profileImage: null,
        });
        setErrors({           // Reset errors state
            name: "",
            password: "",
            contact: "",
            social: "",
            education: "",
            work: "",
        });
        setIsModalOpen(false);  // Close the modal
    };

    const modalContent = (
        <>
            <div className="space-y-4">

                {/* Profile Image Section */}
                <div className="flex items-center flex-col justify-center mb-6">
                    <div className="relative">
                        <img
                            src={
                                formData.profileImage
                                    ? URL.createObjectURL(formData.profileImage)
                                    : profile.image ? profile.image : profileImage
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
                    <div className="mt-5 text-sm text-gray-500">
                        {formData.profileImage ? "Click to change image" : "No image selected"}
                    </div>
                </div>


                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <span
                            className="absolute right-4 top-2 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94a10 10 0 0 1-13.88 0M12 12c0-1.5 1.5-2.5 3-2.5s2.5 1 2.5 2.5M3.5 3.5l17 17" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M2 12c2-4 5.5-7 10-7s8 3 10 7-5.5 7-10 7-8-3-10-7z" />
                                </svg>
                            )}
                        </span>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                </div>

                {/* Contact Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    {formData.contact.map((contact, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                name="contact"
                                data-index={index}
                                value={contact}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => handleRemoveItem("contact", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
                    <button
                        type="button"
                        className="mt-2 text-blue-500"
                        onClick={() => handleAddItem("contact")}
                    >
                        Add Contact
                    </button>
                </div>

                {/* Social Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Social</label>
                    {formData.social.map((social, index) => (
                        <div key={index} className="flex items-center">
                            <input
                                type="text"
                                name="social"
                                data-index={index}
                                value={social}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                className="ml-2 text-red-500"
                                onClick={() => handleRemoveItem("social", index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    {errors.social && <p className="text-red-500 text-xs mt-1">{errors.social}</p>}
                    <button
                        type="button"
                        className="mt-2 text-blue-500"
                        onClick={() => handleAddItem("social")}
                    >
                        Add Social
                    </button>
                </div>

                {/* Education Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Education</label>
                    {formData.education.map((edu, index) => (
                        <div key={index} className="space-y-2 border p-2 rounded-md mt-2">
                            <input
                                type="text"
                                name={`education-${index}`}
                                data-key="degree"
                                value={edu.degree}
                                onChange={handleChange}
                                placeholder="Degree"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                name={`education-${index}`}
                                data-key="role"
                                value={edu.role}
                                onChange={handleChange}
                                placeholder="Role"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    name={`education-${index}`}
                                    data-key="started"
                                    value={edu.started}
                                    onChange={handleChange}
                                    placeholder="Started"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                    type="date"
                                    name={`education-${index}`}
                                    data-key="ended"
                                    value={edu.ended}
                                    onChange={handleChange}
                                    placeholder="Ended"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="button"
                                className="text-red-500 mt-2"
                                onClick={() => handleRemoveItem("education", index)}
                            >
                                Remove Education
                            </button>
                        </div>
                    ))}
                    {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
                    <button
                        type="button"
                        className="mt-2 text-blue-500"
                        onClick={() => handleAddItem("education")}
                    >
                        Add Education
                    </button>
                </div>


                {/* Work Section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Work</label>
                    {formData.work.map((job, index) => (
                        <div key={index} className="space-y-2 border p-2 rounded-md mt-2">
                            <input
                                type="text"
                                name={`work-${index}`}
                                data-key="work"
                                value={job.work}
                                onChange={handleChange}
                                placeholder="Work"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="text"
                                name={`work-${index}`}
                                data-key="role"
                                value={job.role}
                                onChange={handleChange}
                                placeholder="Role"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="flex space-x-2">
                                <input
                                    type="date"
                                    name={`work-${index}`}
                                    data-key="started"
                                    value={job.started}
                                    onChange={handleChange}
                                    placeholder="Started"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <input
                                    type="date"
                                    name={`work-${index}`}
                                    data-key="ended"
                                    value={job.ended}
                                    onChange={handleChange}
                                    placeholder="Ended"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <button
                                type="button"
                                className="text-red-500 mt-2"
                                onClick={() => handleRemoveItem("work", index)}
                            >
                                Remove Work
                            </button>
                        </div>
                    ))}
                    {errors.work && <p className="text-red-500 text-xs mt-1">{errors.work}</p>}
                    <button
                        type="button"
                        className="mt-2 text-blue-500"
                        onClick={() => handleAddItem("work")}
                    >
                        Add Work
                    </button>
                </div>

            </div>
        </>
    );

    return (
        <>
            {loading && <Loader />}
            <Toaster />
            <GenericModal
                isOpen={true}
                closeModal={handleCancel}
                title="Edit Profile"
                content={modalContent}
                onOkClick={handleSave}
            />
        </>
    );
};

export default UserProfileEditModal;
