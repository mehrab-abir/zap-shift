import React, { useRef } from "react";
import { use } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import userAvatar from "../../assets/userAvatar.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";

const Profile = () => {
  const { user, updateUser, setUser, setLoading } = use(AuthContext);
  const axios = useAxios();

  const [editName, setEditName] = useState(false);
  const nameRef = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveName = async () => {
    setIsSubmitting(true);

    const displayName = nameRef.current.value;
    // console.log(displayName);

    try {
      //update in firebase
      await updateUser({ displayName });

      setUser((prevUser) => ({
        ...prevUser,
        displayName,
      }));

      //update in mongodb
      const response = await axios.patch(`/update-user-name/${user?.email}`, { displayName });
      console.log(response);

      if (response.data.modifiedCount) {
        Swal.fire({
          title: "Name updated!",
          icon: "success",
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const userProfilePic =
    user?.photoURL || user?.providerData[0]?.photoURL || userAvatar;

  return (
    <div>
      <title>Profile</title>
      <div className="w-full md:w-11/12 mx-auto flex flex-col items-center justify-center bg-surface mt-10 rounded-xl">
        <h1 className="text-2xl font-semibold text-center mt-5">My Profile</h1>
        <div className="w-full md:w-1/2 px-2 py-6 shadow-2xl mb-10 bg-surface md:rounded-lg mt-10">
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <img
                src={userProfilePic}
                alt=""
                className="w-28 h-auto object-cover rounded-md"
              />
              <FaEdit className="absolute text-3xl -right-8 bottom-1 text-gray-600 cursor-pointer" />
            </div>

            <h3 className="text-xl font-semibold text-secondary mt-2">
              {user?.displayName}
            </h3>
          </div>

          <div className="mt-10 px-5">
            <div className="bg-base p-2 mb-5 rounded-xl relative">
              <span className="text-gray-500 flex items-center gap-2">
                <FaRegUser className="text-lg" />
                Name
              </span>
              <input
                defaultValue={user?.displayName}
                className={`outline-none w-full ${
                  editName
                    ? "pointer-events-auto text-gray-800"
                    : "pointer-events-none text-gray-600"
                }`}
                ref={nameRef}
              />
              <FaEdit
                onClick={() => setEditName(true)}
                className="absolute text-2xl text-gray-500 right-3 bottom-5 cursor-pointer"
              />
            </div>

            <div className="bg-base p-2 mb-5 rounded-xl">
              <span className="text-gray-500 flex items-center gap-2">
                <MdOutlineMailOutline className="text-lg" />
                Email Address
              </span>
              <p className="text-gray-700">{user?.email}</p>
            </div>
            <button
              onClick={() => handleSaveName()}
              className="btn bg-primary outline-none border-none text-black w-full"
            >
              {isSubmitting ? <i>Saving...</i>: "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* update profile modal  */}
    </div>
  );
};

export default Profile;
