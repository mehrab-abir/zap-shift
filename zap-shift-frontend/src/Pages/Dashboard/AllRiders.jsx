import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";
import { IoMdCheckmark } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router";
import LoaderBar from "../../Shared Components/LoaderBar";

const AllRiders = () => {
  const axios = useAxios();

  const [riderStatus, setRiderStatus] = useState("all");

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["riders", riderStatus],
    queryFn: async () => {
      const response = await axios.get(`/riders?status=${riderStatus}`);
      return response.data;
    },
  });

  const updateRiderStatus = async (rider, status) => {
    // console.log("Rider email while updating status: ", rider.riderEmail);
    const response = await axios.patch(`/riders/${rider._id}`, {
      status,
      email: rider.riderEmail,
    });
    // console.log(response);
    if (response.data.afterUpdate.modifiedCount) {
      // console.log("After rider status update: ",response.data);
      Swal.fire({
        title: `Rider status set to ${status}`,
        icon: "success",
        draggable: true,
      });
      refetch();
    }
  };

  const handleApproval = async (rider) => {
    updateRiderStatus(rider, "approved");
  };
  const handleRejection = (rider) => {
    updateRiderStatus(rider, "rejected");
  };

  return (
    <div className="bg-surface p-10 rounded-xl">
      <title>All Riders</title>
      <h1 className="text-2xl md:text-4xl font-bold my-5">
        All Riders ({riders.length})
      </h1>

      {/* filter riders based on status */}
      <select
        className="select focus:outline-2 focus:outline-lime-500 cursor-pointer"
        value={riderStatus}
        onChange={(e) => setRiderStatus(e.target.value)}
      >
        <option value="all">All riders</option>
        <option value="pending">Pending Riders</option>
        <option value="approved">Approved Riders</option>
        <option value="rejected">Rejected Riders</option>
      </select>

      {/* all riders  */}
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center h-[25vh]">
                  <LoaderBar />
                </td>
              </tr>
            ) : (
              <>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Region</th>
                    <th>District</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {riders.map((rider, index) => {
                    return (
                      <tr key={rider._id}>
                        <th>{index + 1}</th>
                        <td>{rider.riderName}</td>
                        <td>{rider.riderEmail}</td>
                        <td>{rider.riderRegion}</td>
                        <td>{rider.riderDistrict}</td>
                        <td
                          className={`${
                            rider.status === "approved"
                              ? "text-green-500"
                              : rider.status === "pending"
                              ? "text-yellow-500"
                              : "text-red-500"
                          } font-semibold`}
                        >
                          {rider.status.toUpperCase()}
                        </td>
                        <td className="flex gap-2">
                          <button
                            onClick={() => handleApproval(rider)}
                            className={`btn btn-sm bg-base text-primary cursor-pointer`}
                            disabled={rider.status === "approved"}
                          >
                            <IoMdCheckmark
                              className={`text-2xl ${
                                rider.status === "approved" && "text-gray-300"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => handleRejection(rider)}
                            className={`btn btn-sm bg-base text-primary cursor-pointer`}
                            disabled={rider.status === "rejected"}
                          >
                            <LiaTimesSolid
                              className={`text-2xl ${
                                rider.status === "rejected" && "text-gray-300"
                              }`}
                            />
                          </button>
                          <Link
                            to={`/dashboard/riders/riderdetails/${rider._id}`}
                            className="btn btn-sm bg-base text-primary cursor-pointer"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllRiders;
