import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-06.png';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon
import Panel from '../layout/Panel';
import { useEffect, useState } from 'react';
import UserProfileEditModal from '../components/UserProfileEditModal'; // Importing the modal
import Loader from '../common/Loader';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null); // Add state for userProfile
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserProfile(JSON.parse(userInfo)); // Set the userProfile state
    }
    setLoading(false); // Set loading to false once the data is fetched
  }, []);

  const handleEditClick = () => {
    setIsModalOpen(true); // Open the modal when the edit icon is clicked
  };

  return (
    <>
      <Panel>
        {loading && <Loader />}
        <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            <img
              src={CoverOne}
              alt="profile cover"
              className="h-full w-full rounded-tl-lg rounded-tr-lg object-cover object-center"
            />
            {/* Edit Icon in top-right corner */}
            <button
              onClick={handleEditClick}
              className="absolute top-4 right-4 text-white bg-indigo-500 rounded-full p-2 shadow-lg hover:bg-indigo-600"
            >
              <FaEdit />
            </button>
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <img src={userProfile?.image || userSix} alt={`${userProfile?.name || 'User'}'s profile`} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{userProfile?.name || 'Name Unavailable'}</h1>
            <p className="text-sm text-gray-600">{userProfile?.about || userProfile?.about === "" ? userProfile?.about : 'No information available'}</p>
          </div>

          {/* Professional Styling for Form Inputs */}
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={userProfile?.email || 'Email Unavailable'}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="text"
                  value={userProfile?.password ? '*****' : 'Password Unavailable'}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll Id</label>
                <input
                  type="text"
                  value={userProfile?.rollId || 'ID Unavailable'}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CNIC</label>
                <input
                  type="text"
                  value={userProfile?.cnic || 'CNIC Unavailable'}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Section</label>
              <input
                type="text"
                value={userProfile?.section || 'Section Unavailable'}
                readOnly
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* UserProfileEditModal */}
        {isModalOpen && userProfile && <UserProfileEditModal setIsModalOpen={setIsModalOpen} userProfile={userProfile} />}
      </Panel>
    </>
  );
};

export default Profile;
