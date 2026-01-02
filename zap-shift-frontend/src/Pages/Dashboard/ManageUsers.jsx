import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";
import { FaFileShield } from "react-icons/fa6";
import { FiShieldOff } from "react-icons/fi";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axios = useAxios();

  const {
    isLoading,
    data: users = [],
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/users");
      return response.data;
    },
  });

  const updateUserRole = async (user, newRole) => {
    const roleInfo = {
      currentRole: newRole,
      previousRole: user.currentRole,
    };

    const response = await axios.patch(`/users/${user._id}`, roleInfo);
    if (response.data.modifiedCount) {
      refetch();
      Swal.fire({
        title: `${newRole === 'admin' ? `${user.displayName} is now an Admin` : `${user.displayName} is no more an Admin`}`,
        icon: "success",
        draggable: true,
      });
    }
  };

  const makeAdmin = (user) => {
    updateUserRole(user, "admin");
  };

  const removeFromAdmin = (user) => {
    updateUserRole(user, "");
  };

  if (isLoading) {
    return (
      <p>
        <i>Loading...</i>
      </p>
    );
  }
  return (
    <div className="w-11/12 md:w-10/12 mx-auto my-10 bg-surface p-10">
      <h1 className="text-2xl md:text-4xl font-bold my-6">
        Manage Users ({users.length})
      </h1>

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
              {users.map((user, index) => {
                return (
                  <tr key={user._id}>
                    <th>{index + 1}</th>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={user.photoURL}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </td>
                    <td>{user.currentRole}</td>
                    <td className="align-middle space-x-4">
                      <button
                        onClick={() => makeAdmin(user)}
                        className="cursor-pointer"
                        disabled={user.currentRole === "admin"}
                        title="make admin"
                      >
                        <FaFileShield
                          className={`text-2xl  ${
                            user.currentRole === "admin"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-blue-600"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => removeFromAdmin(user)}
                        className="cursor-pointer"
                        disabled={user.currentRole !== "admin"}
                        title="remove from admin"
                      >
                        <FiShieldOff
                          className={`text-2xl  ${
                            user.currentRole !== "admin"
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-500"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
