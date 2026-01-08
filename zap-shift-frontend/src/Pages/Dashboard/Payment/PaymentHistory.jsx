import { useQuery } from "@tanstack/react-query";
import React from "react";
import { use } from "react";
import { AuthContext } from "../../../Context/Auth/AuthContext";
import useAxios from "../../../Hook/useAxios";
import LoaderBar from "../../../Shared Components/LoaderBar";

const PaymentHistory = () => {
  const { user } = use(AuthContext);
  const axios = useAxios();

  const { isLoading, data: payments = [] } = useQuery({
    queryKey: ["payment", user?.email],
    queryFn: async () => {
      const response = await axios.get(`/payment-history?email=${user?.email}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <LoaderBar></LoaderBar>
    );
  }

  return (
    <div className="w-11/12 md:w-10/12 mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold">Payment History</h1>

      <div className="bg-surface mt-5">
        <div className={`overflow-x-auto ${payments.length <=4 ? 'h-[50vh]' : 'h-auto'}`}>
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Parcel Name</th>
                <th>Receipent Info</th>
                <th>Amount</th>
                <th>Transaction ID</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => {
                return (
                  <tr key={payment._id}>
                    <th>{index + 1}</th>
                    <td>{payment.parcelName}</td>
                    <td>{payment.receiverName}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.transactionId}</td>
                    <td>{new Date(payment.paidAt).toDateString()}</td>
                    <td>
                      <button className="btn btn-sm bg-primary text-black">
                        View
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

export default PaymentHistory;
