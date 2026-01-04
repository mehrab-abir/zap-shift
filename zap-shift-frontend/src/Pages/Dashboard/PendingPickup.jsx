import React, { useRef, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const PendingPickupParcels = () => {
  const axios = useAxios();
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const assignRiderModalRef = useRef();

  const [selectedParcel, setSelectedParcel] = useState({});

  const { data: parcels = [], isLoading , refetch : refetchParcel} = useQuery({
    queryKey: ["pending-pickup", deliveryStatus, searchText],
    queryFn: async () => {
      const response = await axios.get(
        `/admin/parcels?deliveryStatus=${deliveryStatus}&searchText=${searchText}`
      );
      return response.data;
    },
  });

  //query for assigning rider
  const { data: riders = [] } = useQuery({
    queryKey: ["'riders", selectedParcel],
    queryFn: async () => {
      const response = await axios.get(
        `/assign-pickup/riders?status=approved&riderDistrict=${selectedParcel?.senderDistrict}&workStatus=available`
      );
      return response.data;
    },
  });

  const openModal = (parcel) => {
    setSelectedParcel(parcel);
    assignRiderModalRef.current.showModal();
  };

  //assign rider
  const assignRider = async (rider)=>{
    const assignedRiderInfo = {
        riderId : rider._id, 
        riderName : rider.riderName,
        riderEmail : rider.riderEmail,
        parcelId : selectedParcel._id
    }

    const response = await axios.patch("/parcels/rider-assigned",assignedRiderInfo);
    console.log(response);
    if(response.data.updatedParcel.acknowledged){
        assignRiderModalRef.current.close();
        refetchParcel();
        Swal.fire(`Rider assigned`);
    }
  }

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
                    <tr key={parcel._id}>
                      <th>{index + 1}</th>
                      <td>{parcel.parcelName}</td>
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
                      <td className="text-yellow-500">
                        {parcel.deliveryStatus}
                      </td>
                      <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => openModal(parcel)}
                          className="btn btn-sm bg-primary text-black"
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
                            <button onClick={()=>assignRider(rider)} className="btn btn-sm bg-green-800 text-[#ebebeb]">
                              Assign
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
    </div>
  );
};

export default PendingPickupParcels;
