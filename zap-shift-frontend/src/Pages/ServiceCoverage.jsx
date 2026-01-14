import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ServiceCoverage = () => {
  const [serviceCenters, setServiceCenters] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    fetch("/service_center.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data))
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const location = e.target.location.value;

    const city = serviceCenters.find((center) =>
      center.city.toLowerCase().includes(location.toLowerCase())
    );

    if (city) {
      const co_ordinate = [city.latitude, city.longitude];

      //fly to that location
      mapRef.current.flyTo(co_ordinate, 12);
    }
  };

  const position = [23.685, 90.3563];
  return (
    <div className="w-10/12 md:10/12 mx-auto mb-10 bg-surface rounded-xl">
      <title>Service Coverage</title>
      <div className=" pt-5 my-5">
        <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-5">
          We deliver all over Bangladesh
        </h2>
        <form className="mb-2 px-2 md:px-10 flex" onSubmit={(e) => handleSearch(e)}>
          <input
            type="text"
            name="location"
            className="input outline-none w-full md:w-1/2 rounded-r-none"
            placeholder="Enter a city"
          />
          <button type="submit" className="btn bg-primary hover:bg-primary-hover text-black rounded-l-none border-none">
            Go
          </button>
        </form>
      </div>
      <div className="p-2 md:p-10">
        <MapContainer
          center={position}
          zoom={8}
          scrollWheelZoom={false}
          className="w-full h-100 md:h-200 z-30"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {serviceCenters.map((center, index) => {
            return (
              <Marker
                key={index}
                position={[center.latitude, center.longitude]}
              >
                <Popup>
                  <strong>
                    {center.city} <br />
                  </strong>
                  Service area:{center.covered_area.join(",")}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default ServiceCoverage;
