import profileImage from '../images/ata/profile.png'
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon
import { useEffect, useState, useContext } from 'react';
import UserProfileEditModal from './Modal/UserProfileEditModal'; // Importing the modal
import Loader from '../common/Loader';
import getUserProfile from '../hooks/profile';
import LaunchATAContext from '../context/AppContext';

const Profile = () => {
  const { profile, setProfile } = useContext(LaunchATAContext)
  const [userProfile, setUserProfile] = useState(null); // Add state for userProfile
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true); // Set loading to true initially


  // Callback function to handle form submission
  const handleProfileSubmit = (updatedProfile) => {
    setUserProfile(updatedProfile); // Update the profile with the new data
    // useGetUserInfo();
  };

  useEffect(() => {
    // Re-fetch batch details when the page becomes visible again
    const handleVisibilityChange = () => {
      if (document.hidden === false) {
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      fetchProfile()
      // setProfile(JSON.parse(userInfo))
    }
    setLoading(false); // Set loading to false once the data is fetched
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserProfile(profile)
    }
    setLoading(false); // Set loading to false once the data is fetched
  }, []);
  const fetchProfile = async () => {

    const res = await getUserProfile();
    setProfile(res);

  }

  const handleEditClick = () => {
    setIsModalOpen(true); // Open the modal when the edit icon is clicked
  };

  return (
    <>
      {loading && <Loader />}
      <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
        <div className="relative bg-black z-20 h-35 md:h-65">
          {/* <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-lg rounded-tr-lg object-cover object-center"
          /> */}
          {/* Edit Icon in top-right corner */}
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4 text-white bg-black rounded-full p-2 shadow-lg"
          >
            <FaEdit className="text-3xl" />
          </button>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <img className='rounded-full bg-white' src={profile?.image || profileImage} alt={`${profile?.name || 'User'}'s profile`} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{profile?.name || 'Name Unavailable'}</h1>
          <p className="text-sm text-gray-600">{profile?.about || profile?.about === "" ? profile?.about : 'No information available'}</p>
        </div>

        {/* Professional Styling for Form Inputs */}
        <div className="px-6 py-4 space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile?.name || "Name Unavailable"}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={profile?.email || "Email Unavailable"}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="text"
                value={profile?.password ? '*****' : 'Password Unavailable'}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <div className="space-y-2">
              {profile?.contact?.length ? (
                profile.contact.map((contact, index) => (
                  <input
                    key={index}
                    type="text"
                    value={contact}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="Not Provided"
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                />
              )}
            </div>
          </div>



          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Education</label>
            <div className="space-y-4">
              {profile?.education?.length ? (
                profile.education.map((edu, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={edu.degree || "Degree Unavailable"}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      value={`${edu.started || "Start Unavailable"} - ${edu.ended || "End Unavailable"}`}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value="Not Provided"
                    disabled
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                  />
                  <input
                    type="text"
                    value="Not Provided"
                    disabled
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>


          {/* Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Work</label>
            <div className="space-y-4">
              {profile?.work?.length ? (
                profile.work.map((job, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={job.work || "Work Unavailable"}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                    <input
                      type="text"
                      value={`${job.started || "Start Unavailable"} - ${job.ended || "End Unavailable"}`}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value="Not Provided"
                    disabled
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                  />
                  <input
                    type="text"
                    value="Not Provided"
                    disabled
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                  />
                </div>
              )}
            </div>
          </div>


          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <div className="space-y-2">
              {profile?.social?.length ? (
                profile.social.map((link, index) => (
                  <input
                    key={index}
                    type="text"
                    value={link}
                    readOnly
                    className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  />
                ))
              ) : (
                <input
                  type="text"
                  value="Not Provided"
                  disabled
                  className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500"
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* UserProfileEditModal */}
      {isModalOpen
        && profile
        &&
        <UserProfileEditModal
          setIsModalOpen={setIsModalOpen}
          userProfile={userProfile}
          onSubmit={handleProfileSubmit}
        />}
    </>
  );
};

export default Profile;
