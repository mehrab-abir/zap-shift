import React, { useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";

const PendingPickupParcels = () => {
  const axios = useAxios();
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [searchText, setSearchText] = useState("");

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["pending-pickup", deliveryStatus, searchText],
    queryFn: async () => {
      const response = await axios.get(
        `/admin/parcels?deliveryStatus=${deliveryStatus}&searchText=${searchText}`
      );
      return response.data;
    },
  });
  return (
    <div className="bg-surface p-10 rounded-xl">
      <h1 className="text-2xl md:text-4xl font-bold my-5">
        All Parcels ({parcels.length})
      </h1>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by sender email"
          className="input outline-none"
        />
        <select
          className="select focus:outline-2 focus:outline-lime-500 cursor-pointer"
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
        >
          <option value="all">All Parcels</option>
          <option value="Pending to pickup">Pending to Pickup</option>
          <option value="In-transit">In transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table table-s">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Sender Email</th>
                <th>Sender District</th>
                <th>Delivery Fee</th>
                <th>Payment Status</th>
                <th>Delivery Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td>
                    <i>Loading...</i>
                  </td>
                </tr>
              ) : (
                parcels.map((parcel, index) => {
                  return (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{parcel.parcelName}</td>
                      <td>{parcel.senderEmail}</td>
                      <td>{parcel.senderDistrict}</td>
                      <td>${parcel.deliveryFee}</td>
                      <td className={`${parcel.paymentStatus === "Paid" && "text-green-500"}`}>
                        {parcel.paymentStatus}
                      </td>
                      <td className="text-yellow-500">
                        {parcel.deliveryStatus}
                      </td>
                      <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm bg-primary text-black">
                          Assign Rider
                        </button>
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

export default PendingPickupParcels;
