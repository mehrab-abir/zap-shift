import React, { useRef, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import LoaderBar from "../../Shared Components/LoaderBar";

const AssignRider = () => {
  const axios = useAxios();

  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const assignRiderModalRef = useRef();
  const parcelDetailsModalRef = useRef();

  const [selectedParcel, setSelectedParcel] = useState({});

  const {
    data: parcels = [],
    isLoading,
    refetch: refetchParcel,
  } = useQuery({
    queryKey: ["requested-parcels", deliveryStatus, searchText],
    queryFn: async () => {
      const response = await axios.get(
        `/admin/parcels?deliveryStatus=${deliveryStatus}&searchText=${searchText}`
      );
      return response.data;
    },
  });

  //query for assigning rider
  const { data: riders = [] } = useQuery({
    queryKey: ["riders", selectedParcel],
    queryFn: async () => {
      const response = await axios.get(
        `/assign-to-parcel/riders?status=approved&riderDistrict=${selectedParcel?.senderDistrict}&workStatus=Available`
      );
      return response.data;
    },
  });

  const openModal = (parcel) => {
    setSelectedParcel(parcel);
    assignRiderModalRef.current.showModal();
  };

  const parcelDetailsModal = (parcel) => {
    setSelectedParcel(parcel);
    parcelDetailsModalRef.current.showModal();
  };

  //assign rider
  const assignRider = async (rider) => {
    const assignedRiderInfo = {
      riderId: rider._id,
      riderName: rider.riderName,
      riderEmail: rider.riderEmail,
      parcelId: selectedParcel._id,
      trackingId: selectedParcel.trackingId,
    };

    const response = await axios.patch(
      "/parcels/rider-assigned",
      assignedRiderInfo
    );
    console.log(response);
    if (response.data.updatedParcel.acknowledged) {
      assignRiderModalRef.current.close();
      refetchParcel();
      Swal.fire(`Rider assigned`);
    }
  };

  return (
    <div className="bg-surface p-10 rounded-xl">
      <title>All Parcels</title>
      <h1 className="text-2xl md:text-4xl font-bold my-5">
        All Parcels ({parcels.length})
      </h1>

      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by sender email"
          className="input outline-none w-full"
        />
        <select
          className="select focus:outline-2 focus:outline-lime-500 cursor-pointer w-full mt-2 md:mt-0"
          value={deliveryStatus}
          onChange={(e) => setDeliveryStatus(e.target.value)}
        >
          <option value="all">All Parcels</option>
          <option value="Looking for rider">Looking for rider</option>
          <option value="Rider Assigned">Rider assigned</option>
          <option value="In transit">In transit</option>
          <option value="Delivered">Delivered</option>
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
                  <td colSpan={6} className="text-center h-[25vh]">
                    <LoaderBar />
                  </td>
                </tr>
              ) : (
                parcels.map((parcel, index) => {
                  return (
                    <tr key={parcel._id}>
                      <th>{index + 1}</th>
                      <td
                        className="font-semibold hover:underline cursor-pointer"
                        onClick={() => parcelDetailsModal(parcel)}
                      >
                        {parcel.parcelName}
                      </td>
                      <td>{parcel.senderEmail}</td>
                      <td>{parcel.senderDistrict}</td>
                      <td>${parcel.deliveryFee}</td>
                      <td
                        className={`${
                          parcel.paymentStatus === "Paid" && "text-green-500"
                        }`}
                      >
                        {parcel.paymentStatus}
                      </td>
                      <td
                        className={`${
                          parcel.deliveryStatus === "Looking for rider"
                            ? "text-yellow-500"
                            : parcel.deliveryStatus === "Rider Assigned"
                            ? "text-blue-500"
                            : parcel.deliveryStatus === "Rider arriving"
                            ? "text-purple-500"
                            : parcel.deliveryStatus === "In transit"
                            ? "text-accent"
                            : parcel.deliveryStatus === "Delivered"
                            ? "text-green-500"
                            : "text-primary"
                        } font-semibold`}
                      >
                        {parcel.deliveryStatus
                          ? parcel.deliveryStatus
                          : "Parcel Created"}
                      </td>
                      <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => openModal(parcel)}
                          className={`btn btn-sm ${
                            parcel.deliveryStatus !== "Looking for rider"
                              ? "bg-gray-200 text-gray-600"
                              : "bg-primary text-black"
                          }`}
                          disabled={
                            parcel.deliveryStatus !== "Looking for rider"
                          }
                        >
                          Find Riders
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

      {/* assign rider modal */}
      <dialog
        ref={assignRiderModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Available Riders ({riders.length})
          </h3>
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Rider District</th>
                  <th>Work Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, index) => {
                  return (
                    <tr key={rider._id}>
                      <th>{index + 1}</th>
                      <td>{rider.riderName}</td>
                      <td>{rider.riderDistrict}</td>
                      <td>{rider.workStatus}</td>
                      <td>
                        <button
                          onClick={() => assignRider(rider)}
                          className={`btn btn-sm ${
                            rider.workStatus !== "Available"
                              ? "bg-gray-300 text-black"
                              : "bg-green-800 text-[#ebebeb]"
                          }`}
                        >
                          {rider.workStatus !== "Available"
                            ? "Not Available"
                            : "Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/*Parcel Details modal */}
      <dialog
        ref={parcelDetailsModalRef}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          {
            <div className="p-2 rounded-md">
              <p>
                <span className="font-bold">Parcel Type: </span>
                {selectedParcel.parcelType}
              </p>
              <p>
                <span className="font-bold">Parcel Name: </span>
                {selectedParcel.parcelName}
              </p>
              <p>
                <span className="font-bold">Parcel Weight: </span>
                {selectedParcel.parcelWeight} Kg
              </p>
              <p>
                <span className="font-bold">Sender Name: </span>
                {selectedParcel.senderName}
              </p>
              <p>
                <span className="font-bold">Sender Email: </span>
                {selectedParcel.senderEmail}
              </p>
              <p>
                <span className="font-bold">Receiver Name: </span>
                {selectedParcel.receiverName}
              </p>
              <p>
                <span className="font-bold">Receiver Email: </span>
                {selectedParcel.receiverEmail}
              </p>
              <p>
                <span className="font-bold">Sender Region: </span>
                {selectedParcel.senderRegion}
              </p>
              <p>
                <span className="font-bold">Sender District: </span>
                {selectedParcel.senderDistrict}
              </p>
              <p>
                <span className="font-bold">Receiver Region: </span>
                {selectedParcel.receiverRegion}
              </p>
              <p>
                <span className="font-bold">Receiver District: </span>
                {selectedParcel.receiverDistrict}
              </p>
              <p>
                <span className="font-bold">Delivery Fee: </span>$
                {selectedParcel.deliveryFee}
              </p>
              <p>
                <span className="font-bold">Payment Status: </span>
                {selectedParcel.paymentStatus}
              </p>
              <p>
                <span className="font-bold">Delivery Status: </span>
                {selectedParcel.deliveryStatus}
              </p>
              <p>
                <span className="text-lime-600 font-bold">Rider Name: </span>
                {selectedParcel.riderName}
              </p>
              <p>
                <span className="text-lime-600 font-bold">Rider Email: </span>
                {selectedParcel.riderEmail}
              </p>
            </div>
          }
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

export default AssignRider;
