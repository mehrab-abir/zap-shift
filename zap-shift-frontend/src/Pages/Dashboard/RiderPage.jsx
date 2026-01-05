import React, { use, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../Context/Auth/AuthContext";
import Swal from "sweetalert2";

const Field = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-sm opacity-70">{label}</p>
    {label === "Status" ? (
      <p
        className={`font-semibold wrap-break-words ${
          value === "approved"
            ? "text-green-500"
            : value === "pending"
            ? "text-yellow-500"
            : "text-red-500"
        }`}
      >
        {value.toUpperCase() || "—"}
      </p>
    ) : (
      <p className={`font-semibold wrap-break-words`}>{value || "—"}</p>
    )}
  </div>
);

const RiderPage = () => {
  const { user } = use(AuthContext);

  const axios = useAxios();

  const [currentWorkStatus, setCurrentWorkStatus] = useState('offline');

  const { data: rider, isLoading } = useQuery({
    queryKey: ["rider", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/rider/details/${user?.email}`);
      setCurrentWorkStatus(response.data.workStatus);
      return response.data;
    },
  });

  const updateWorkStatus = async (workStatus) => {
    try {
      const response = await axios.patch(`/rider/work-status/${rider?._id}`, {
        workStatus
      });
      if (response.data.acknowledged) {
        setCurrentWorkStatus(workStatus);
        Swal.fire(`Your are now ${workStatus}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const goOnline = () => {
    updateWorkStatus("available");
  };
  const goOffline = () => {
    updateWorkStatus("offline");
  };

  if (isLoading) {
    return (
      <p>
        <i>Loading...</i>
      </p>
    );
  }

  return (
    <div className="">
      <div className="bg-surface p-6 md:p-10 rounded-xl shadow">
        <h1 className="text-2xl md:text-4xl font-bold mb-6">Rider Page</h1>

        <h3 className="font-semibold text-2xl my-4">You are now <span className="text-blue-600">{currentWorkStatus}</span></h3>

        <div className="my-5 flex gap-4">
          <button
            onClick={() => goOnline()}
            className={`btn btn-sm text-xl text-white font-semibold border-none outline-none ${currentWorkStatus !== "offline" ? "bg-gray-300" : "bg-blue-600"}`}
            disabled={currentWorkStatus === "available" || currentWorkStatus === "On a delivery"}
          >
            Go Online
          </button>
          <button
            onClick={() => goOffline()}
            className={`btn btn-sm text-xl text-white font-semibold border-none outline-none ${currentWorkStatus === "offline" ? "bg-gray-300" : "bg-red-500"}`}
            disabled={currentWorkStatus === "offline"}
          >
            Go Offline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Name" value={rider?.riderName} />

         
          <Field label="Email" value={rider?.riderEmail} />

          <Field label="Driving License" value={rider?.drivingLicense} />

          <Field label="Phone Number" value={rider?.phoneNumber} />

          <Field label="Bike Model" value={rider?.bikeModel} />

          <Field
            label="Bike Registration Number"
            value={rider?.bikeRegistrationNumber}
          />

          <Field label="Current Address" value={rider?.currentAddress} />

          <Field label="Rider Region" value={rider?.riderRegion} />

          <Field label="Status" value={rider?.status} />

          <Field label="Applied At" value={rider?.appliedAt} />
        </div>
      </div>
    </div>
  );
};

export default RiderPage;
