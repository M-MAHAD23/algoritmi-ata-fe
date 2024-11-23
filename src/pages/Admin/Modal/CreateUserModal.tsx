import { useState, useContext, useRef } from "react";
import { useProfileEdit } from "../../../hooks/hooks";
import { toast, Toaster } from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import LaunchATAContext from "../../../context/AppContext";
import getUserProfile from "../../../hooks/profile";
import Loader from "../../../common/Loader";
import GenericModal from "../../../components/GenericModal";
import profileImage from "../../../images/ata/profile.png"
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const CreateUserModal = ({ setIsModalOpen, onSubmit, batchId, existingTeachers, existingStudents }) => {
    const fileInputRef = useRef(null);
    const { profile, setProfile } = useContext(LaunchATAContext);
    const { updateProfile, loading } = useProfileEdit();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        image: "",
        rollId: "",
        cnic: "",
        role: "",
        contact: [],
        social: [],
        education: [],
        work: [],
        profileImage: null,
    });
    const [errors, setErrors] = useState({
        email: "",
        name: "",
        image: "",
        rollId: "",
        cnic: "",
        role: "",
        contact: "",
        social: "",
        education: "",
        work: "",
    });
    const [viewMode, setViewMode] = useState('initial');
    const [selectedUser, setSelectedUser] = useState(null);

    const handleAddExisting = async () => {
        if (selectedUser) {
            try {
                const response = await axios.post(`${API_BASE_URL}/user/addExisting`, {
                    user: selectedUser,
                    batchId: batchId,
                });

                if (response.data.success) {
                    toast.success('User successfully added to the batch!');
                    setIsModalOpen(false);
                } else {
                    toast.error('Failed to add user. Please try again.');
                }
            } catch (error) {
                toast.error(`Error: ${error.response?.data?.error || 'Something went wrong!'}`);
            }
        } else {
            toast.warn('Please select a user to add.');
        }
    };

    const handleModeChange = (mode) => {
        setViewMode(mode);
    };

    const handleChange = (e) => {
        const { name, value, dataset } = e.target;

        // Helper functions to format input with hyphens
        const formatRollId = (value) => {
            // Remove non-numeric characters, then insert hyphen after first two digits
            return value.replace(/\D/g, '').slice(0, 6).replace(/^(\d{2})(\d{4})$/, '$1-$2');
        };

        const formatCnic = (value) => {
            // Remove non-numeric characters, then insert hyphen in the correct format
            return value.replace(/\D/g, '').slice(0, 15).replace(/^(\d{5})(\d{7})(\d{1})$/, '$1-$2-$3');
        };

        const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        const validateCnic = (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic);
        const validateRollId = (rollId) => /^\d{2}-\d{4}$/.test(rollId);
        const validateRole = (role) => role === "Teacher" || role === "Student";

        if (name === "contact") {
            const index = dataset.index;
            const updatedContact = [...formData.contact];
            updatedContact[index] = value;
            setFormData((prev) => ({ ...prev, contact: updatedContact }));

            // Validate and clear errors
            if (updatedContact.every((contact) => contact.trim() !== "")) {
                setErrors((prev) => ({ ...prev, contact: "" }));
            }
        } else if (name === "social") {
            const index = dataset.index;
            const updatedSocial = [...formData.social];
            updatedSocial[index] = value;
            setFormData((prev) => ({ ...prev, social: updatedSocial }));

            // Validate and clear errors
            if (updatedSocial.every((social) => social.trim() !== "")) {
                setErrors((prev) => ({ ...prev, social: "" }));
            }
        } else if (name.startsWith("education") || name.startsWith("work")) {
            const [key, index] = name.split("-");
            const updatedArray = [...formData[key]];
            const fieldKey = dataset.key;
            updatedArray[index][fieldKey] = value; // Update the correct field
            setFormData((prev) => ({ ...prev, [key]: updatedArray }));

            // Validate and clear errors
            if (updatedArray.every((item) => !Object.values(item).some((field) => field.trim() === ""))) {
                setErrors((prev) => ({ ...prev, [key]: "" }));
            }
        } else if (name === "email") {
            setFormData((prev) => ({ ...prev, email: value }));

            // Email validation
            if (value.trim() === "") {
                setErrors((prev) => ({ ...prev, email: "Email is required" }));
            } else if (!validateEmail(value)) {
                setErrors((prev) => ({ ...prev, email: "Invalid email format. Use x@platform.com" }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
        } else if (name === "rollId") {
            const formattedRollId = formatRollId(value); // Format rollId
            setFormData((prev) => ({ ...prev, rollId: formattedRollId }));

            // Roll ID validation
            if (formattedRollId.trim() === "") {
                setErrors((prev) => ({ ...prev, rollId: "Roll ID is required" }));
            } else if (!validateRollId(formattedRollId)) {
                setErrors((prev) => ({ ...prev, rollId: "Invalid Roll ID format. Use XX-XXXX" }));
            } else {
                setErrors((prev) => ({ ...prev, rollId: "" }));
            }
        } else if (name === "cnic") {
            const formattedCnic = formatCnic(value); // Format cnic
            setFormData((prev) => ({ ...prev, cnic: formattedCnic }));

            // CNIC validation
            if (formattedCnic.trim() === "") {
                setErrors((prev) => ({ ...prev, cnic: "CNIC is required" }));
            } else if (!validateCnic(formattedCnic)) {
                setErrors((prev) => ({ ...prev, cnic: "Invalid CNIC format. Use XXXXX-XXXXXXX-X" }));
            } else {
                setErrors((prev) => ({ ...prev, cnic: "" }));
            }
        } else if (name === "role") {
            setFormData((prev) => ({ ...prev, role: value }));

            // Role validation
            if (value.trim() === "") {
                setErrors((prev) => ({ ...prev, role: "Role is required" }));
            } else if (!validateRole(value)) {
                setErrors((prev) => ({ ...prev, role: "Role must be either 'Teacher' or 'Student'" }));
            } else {
                setErrors((prev) => ({ ...prev, role: "" }));
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
            name: formData.name ? "" : "Name is required",
            email: formData.email ? "" : "Email is required",
            rollId: formData.rollId ? "" : "Roll Id is required",
            role: formData.role ? "" : "Role is required",
            cnic: formData.cnic ? "" : "Cnic is required",
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
            updatedFormData.append("email", restFormData.email);
            updatedFormData.append("name", restFormData.name);
            updatedFormData.append("rollId", restFormData.rollId);
            updatedFormData.append("cnic", restFormData.cnic);
            updatedFormData.append("role", restFormData.role);
            updatedFormData.append("batchId", batchId);
            updatedFormData.append("contact", JSON.stringify(restFormData.contact));
            updatedFormData.append("social", JSON.stringify(restFormData.social));
            updatedFormData.append("education", JSON.stringify(restFormData.education));
            updatedFormData.append("work", JSON.stringify(restFormData.work));

            if (profileImage instanceof File) {
                updatedFormData.append("files", profileImage);
            }

            for (let [key, value] of updatedFormData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const userProfileFromAPI = await getUserProfile();
            setProfile(userProfileFromAPI);
            setIsModalOpen(false);
            onSubmit(updatedFormData);
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
        setFormData({
            email: "",
            name: "",
            image: "",
            contact: [""],
            social: [""],
            education: [{ degree: "", role: "", started: "", ended: "" }],
            work: [{ work: "", role: "", started: "", ended: "" }],
            profileImage: null,
        });
        setErrors({
            email: "",
            name: "",
            image: "",
            rollId: "",
            cnic: "",
            role: "",
            contact: "",
            social: "",
            education: "",
            work: "",
        });
        setIsModalOpen(false);
    };

    const modalContent1 = (
        <>
            <div className="space-y-4">
                <button
                    onClick={() => handleModeChange('initial')}
                    className="text-black hover:underline"
                >
                    {`← Go Back`}
                </button>
                {/* Profile Image Section */}
                <div className="flex items-center flex-col justify-center mb-6">
                    <div className="relative">
                        <img
                            src={
                                formData.profileImage
                                    ? URL.createObjectURL(formData.profileImage)
                                    : profileImage
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

                {/* Name */}
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

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Roll ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Roll ID</label>
                    <input
                        type="text"
                        name="rollId"
                        value={formData.rollId}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.rollId && <p className="text-red-500 text-xs mt-1">{errors.rollId}</p>}
                </div>

                {/* CNIC */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">CNIC</label>
                    <input
                        type="text"
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="XXXXX-XXXXXXX-X"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.cnic && <p className="text-red-500 text-xs mt-1">{errors.cnic}</p>}
                </div>

                {/* Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Role</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
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

    const modalContent2 = (
        <>
            <div className="space-y-4">
                <button
                    onClick={() => handleModeChange('initial')}
                    className="text-black hover:underline"
                >
                    {`← Go Back`}
                </button>
                <h3 className="text-lg font-semibold">Select an Existing User</h3>
                <select
                    onChange={(e) => setSelectedUser(JSON.parse(e.target.value))}
                    className="block w-full px-3 py-2 border rounded-md"
                >
                    <option value="">Select User</option>
                    <optgroup label="Teachers">
                        {existingTeachers?.map((teacher) => (
                            <option key={teacher.id} value={JSON.stringify(teacher)}>
                                {teacher.name}
                            </option>
                        ))}
                    </optgroup>
                    {/* <optgroup label="Students">
                        {existingStudents?.map((student) => (
                            <option key={student.id} value={JSON.stringify(student)}>
                                {student.name}
                            </option>
                        ))}
                    </optgroup> */}
                </select>
                <button
                    onClick={handleAddExisting}
                    className="w-full px-4 py-2 text-white bg-black hover:bg-gray-500 rounded-md"
                >
                    Add Teacher
                </button>
            </div>
        </>
    );

    const modalContent3 = (
        <>
            {/* Buttons */}
            <div className=" flex justify-around space-x-4 mt-4">
                <button
                    onClick={() => handleModeChange('existing')}
                    className=" px-4 py-2 text-white bg-black hover:bg-gray-500 rounded-md"
                >
                    Add Existing Teacher
                </button>
                <button
                    onClick={() => handleModeChange('new')}
                    className=" px-4 py-2 text-white bg-black hover:bg-gray-500 rounded-md"
                >
                    Add New Teacher/Student
                </button>
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
                title="Create User"
                content={viewMode === "initial" ? modalContent3 : viewMode === "existing" ? modalContent2 : viewMode === "new" ? modalContent1 : null}
                onOkClick={handleSave}
                modalClass="relative flex items-center justify-center z-50 bg-black bg-opacity-50"
                modalContentClass="bg-white dark:bg-boxdark rounded-lg w-full max-w-lg sm:max-w-md lg:max-w-4xl p-6"
                hideButtons={viewMode === "existing" ? true : false}
            />
        </>
    );
};

export default CreateUserModal;
