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
import uploadToImgbb from "../../Utils/utils";

const Profile = () => {
  const { user, updateUser, setUser, setLoading } = use(AuthContext);
  const axios = useAxios();

  const [editName, setEditName] = useState(false);
  const nameRef = useRef();

  const imageModalRef = useRef();
  const imageRef = useRef(null);
  const [noImageError, setNoImageError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  //update name
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
      const response = await axios.patch(`/update-user-name/${user?.email}`, {
        displayName,
      });
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

  //update profile image
  const handleUpdateImage = async () => {
    setIsSubmitting(true);
    setNoImageError("");

    const imageFile = imageRef.current.files[0];

    if (!imageFile) {
      setNoImageError("Select an image");
      setIsSubmitting(false);
      return;
    }

    try {
      const photoURL = await uploadToImgbb(imageFile);

      // console.log(imageFile);

      //update in firebase
      await updateUser({ photoURL });

      setUser((prevUser) => ({
        ...prevUser,
        photoURL,
      }));

      //update in mongodb
      const response = await axios.patch(`/user-photo-update/${user?.email}`, {
        photoURL,
      });

      if (response.data.modifiedCount) {
        Swal.fire({
          title: "Image updated!",
          icon: "success",
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
      imageModalRef.current.close();
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
                className="w-28 h-28 object-cover rounded-md"
                referrerPolicy="no-referrer"
              />
              <FaEdit
                onClick={() => imageModalRef.current.showModal()}
                className="absolute text-3xl -right-8 bottom-1 text-gray-600 cursor-pointer"
              />
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
                    ? "pointer-events-auto text-accent"
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
              {isSubmitting ? <i>Saving...</i> : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* update image modal  */}
      <dialog
        ref={imageModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Upload Image</h3>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="file-input file-input-bordered w-full outline-none"
            ref={imageRef}
          />
          <p className="mt-1 text-red-500 text-sm">{noImageError}</p>

          <button
            onClick={() => handleUpdateImage()}
            className="btn btn-sm bg-primary mt-5 text-black"
          >
            {isSubmitting ? <i>Saving...</i> : 'Save'}
          </button>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
