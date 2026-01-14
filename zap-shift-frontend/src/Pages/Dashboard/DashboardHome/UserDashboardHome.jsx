import React from "react";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../Context/Auth/AuthContext";
import useAxios from "../../../Hook/useAxios";
import { Link } from "react-router";
import useRole from "../../../Hook/useRole";
import LoaderBar from "../../../Shared Components/LoaderBar";

const UserDashboardHome = () => {
  const { user, loading } = use(AuthContext);
  const axios = useAxios();
  const { role } = useRole();

  const { data: parcelSentCount } = useQuery({
    queryKey: ["sentParcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/count-sent-parcel/${user?.email}`);
      return response.data;
    },
  });

  const { data: latestParcels = [] } = useQuery({
    queryKey: ["latest-parcels", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `/parcels?email=${user?.email}&latest=latest`
      );
      return response.data;
    },
  });

  if (loading) {
    return (
      <div className="h-[50vh]">
        <LoaderBar></LoaderBar>
      </div>
    );
  }

  return (
    <div className="bg-surface p-5 md:p-8 rounded-lg">
      <title>Dashboard</title>
      <div className="flex flex-col md:flex-row md:items-center justify-between md:gap-10">
        <h2 className="text-lg md:text-2xl font-semibold">
          Number of parcels you sent : {parcelSentCount}
        </h2>
        <p className="text-lg flex flex-col mt-2">
          <span className="mb-1">See:</span>
          <Link
            to="/dashboard/myparcels"
            className="text-sm md:text-lg text-accent hover:underline font-semibold"
          >
            &gt;Your Parcels
          </Link>
          <Link
            to="/dashboard/payment-history"
            className="text-sm md:text-lg text-accent hover:underline font-semibold"
          >
            &gt;Payment History
          </Link>
          <Link
            to="/manage-profile"
            className="text-sm md:text-lg text-accent hover:underline font-semibold"
          >
            &gt;Profile
          </Link>
        </p>
      </div>

      <div className="flex items-center justify-center mb-10">
        <button className="btn btn-sm bg-cyan-700 border-none text-white mt-4">
          <Link to="/sendparcel"> Send a Parcel Now!</Link>
        </button>
      </div>

      {/* latest parcels sent by user */}
      <h3 className="text-2xl font-bold mb-1">Latest parcels sent by you</h3>
      {latestParcels.length > 0 ? (
        <div className="flex flex-col space-y-2.5 mb-5">
          {latestParcels.map((parcel) => {
            return (
              <div
                key={parcel._id}
                className="p-2 bg-base rounded-lg shadow-lg"
              >
                <p>
                  {" "}
                  <span className="font-semibold">Parcel Name:</span>{" "}
                  {parcel.parcelName}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">Receiver Name:</span>{" "}
                  {parcel.receiverName}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">Receiver Address:</span>{" "}
                  {parcel.receiverAddress}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold">Receiver District:</span>{" "}
                  {parcel.receiverDistrict}
                </p>
                <Link
                  to={`/track-parcel/${parcel.trackingId}`}
                  className="btn btn-sm bg-green-600 text-white font-semibold text-center md:text-start my-2 hover:underline"
                >
                  Track Parcel
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-secondary text-center my-10 h-[10vh]">
          -You have not sent any parcel yet-
        </p>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {role === "user" && (
          <div className="mt-5">
            <h3 className="text-xl font-semibold text-lime-600">
              Interested in earning as a delivery rider?{" "}
            </h3>
            <Link
              to="/rider-registration"
              className="text-accent hover:underline font-semibold text-lg mt-2"
            >
              &gt; Click here to apply
            </Link>
          </div>
        )}
        <div></div>
        <button className="btn btn-sm bg-primary text-black">
          <Link to="/">Go to Home Page</Link>
        </button>
      </div>
    </div>
  );
};

export default UserDashboardHome;
