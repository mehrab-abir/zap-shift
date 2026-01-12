import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";
import { FaFileShield } from "react-icons/fa6";
import { FiShieldOff } from "react-icons/fi";
import Swal from "sweetalert2";
import userAvatar from "../../assets/userAvatar.png";
import LoaderBar from "../../Shared Components/LoaderBar";

const ManageUsers = () => {
  const axios = useAxios();
  const [searchText, setSearchText] = useState("");

  const {
    isLoading,
    data: users = [],
    refetch,
  } = useQuery({
    queryKey: ["users", searchText],
    queryFn: async () => {
      const response = await axios.get(`/users?searchText=${searchText}`);
      return response.data;
    },
  });

  const updateUserRole = async (user, newRole) => {
    const result = await Swal.fire({
      title: "Are you sure to change the user role?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    });

    if (result.isConfirmed) {
      const roleInfo = {
        currentRole: newRole,
        previousRole: user.currentRole,
      };

      const response = await axios.patch(`/users/${user._id}`, roleInfo);
      if (response.data.modifiedCount) {
        refetch();
        Swal.fire({
          title: `${
            newRole === "admin"
              ? `${user.displayName} is now an Admin`
              : `${user.displayName} is no more an Admin`
          }`,
          icon: "success",
          draggable: true,
        });
      }
    } else if (result.isDenied) {
      Swal.fire("Nothing changed");
    }
  };

  const makeAdmin = (user) => {
    updateUserRole(user, "admin");
  };

  const removeFromAdmin = (user) => {
    updateUserRole(user, "");
  };

  return (
    <div className="bg-surface p-10">
      <h1 className="text-2xl md:text-4xl font-bold my-6">
        Manage Users ({users.length})
      </h1>

      <div>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          type="text"
          className="input outline-none"
          value={searchText}
          placeholder="Search by name or email"
        />
      </div>

      {/* users table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Photo</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    <div className="h-[25vh]">
                      <LoaderBar></LoaderBar>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, index) => {
                  const userProfile =
                    user?.photoURL ||
                    user?.providerData[0]?.photoURL ||
                    userAvatar;
                  return (
                    <tr key={user._id}>
                      <th>{index + 1}</th>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={userProfile}
                            referrerPolicy="no-referrer"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </td>
                      <td
                        className={`${
                          user.currentRole === "admin" && "text-lime-600"
                        } font-semibold`}
                      >
                        {user.currentRole.toUpperCase()}
                      </td>
                      <td className="align-middle space-x-4">
                        <div className="flex justify-between">
                          <button
                            onClick={() => makeAdmin(user)}
                            className="cursor-pointer tooltip"
                            disabled={user.currentRole === "admin"}
                            data-tip="make admin"
                          >
                            <FaFileShield
                              className={`text-lg md:text-2xl  ${
                                user.currentRole === "admin"
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-blue-600"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => removeFromAdmin(user)}
                            className="cursor-pointer tooltip"
                            disabled={user.currentRole !== "admin"}
                            data-tip="remove from admin"
                          >
                            <FiShieldOff
                              className={`text-lg md:text-2xl  ${
                                user.currentRole !== "admin"
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-red-500"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
