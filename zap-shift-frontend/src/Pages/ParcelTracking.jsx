import React from "react";
import useBasicAxios from "../Hook/useBasicAxios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import LoaderBar from "../Shared Components/LoaderBar";

const ParcelTracking = () => {
  const axiosBasic = useBasicAxios();
  const { trackingId } = useParams();

  const { data: trackLogs = [], isLoading } = useQuery({
    queryKey: ["track-logs", trackingId],
    queryFn: async () => {
      const response = await axiosBasic.get(`/tracking-log/${trackingId}`);
      return response.data;
    },
  });

  return (
    <div className="w-11/12 bg-surface mx-auto my-10 p-10">
      <title>Track Parcel</title>
      <h2 className="text-2xl font-bold text-center">Track your parcel</h2>

      <div className="mt-5">
        {isLoading ? (
          <div className="h-[50vh]">
            <LoaderBar></LoaderBar>
          </div>
        ) : (
          <ul className={`timeline timeline-vertical ${trackLogs.length <= 3 && 'h-[50vh]'}`}>
            {trackLogs.map((log) => {
              return (
                <li key={log._id}>
                  <div className="timeline-start">
                    {new Date(log.updatedAt).toLocaleString()}
                  </div>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="timeline-end timeline-box text-lg">
                    {log.deliveryStatus}
                  </div>
                  <hr />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ParcelTracking;
