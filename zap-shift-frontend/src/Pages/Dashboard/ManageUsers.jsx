import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxios from "../../Hook/useAxios";

const ManageUsers = () => {
  const axios = useAxios();

  const { isLoading, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/users");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <p>
        <i>Loading...</i>
      </p>
    );
  }
  return (
    <div className="w-11/12 md:w-10/12 mx-auto my-10 bg-surface">
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
                    <td>{user.role}</td>
                    <td>
                        <button className="btn btn-sm bg-blue-600 text-white cursor-pointer">Make Admin</button>
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
