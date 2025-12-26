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

  const handleSearch = (e)=>{
    e.preventDefault();

    const location = e.target.location.value;

    const city = serviceCenters.find((center)=>center.city.toLowerCase().includes(location.toLowerCase()));

    if(city){
        const co_ordinate = [city.latitude, city.longitude];

        //fly to that location
        mapRef.current.flyTo(co_ordinate,14);
    }
  }

  const position = [23.685, 90.3563];
  return (
    <div className="w-11/12 md:10/12 mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-primary text-center my-5">
          We are available in 64 districts
        </h2>
        <form className="mb-5" onSubmit={(e) => handleSearch(e)}>
          <input
            type="text"
            name="location"
            className="input outline-none"
            placeholder="Enter a city to fly there..."
          />
          <button type="submit" className="btn bg-primary">
            Go
          </button>
        </form>
      </div>
      <MapContainer
        center={position}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-200"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {serviceCenters.map((center, index) => {
          return (
            <Marker key={index} position={[center.latitude, center.longitude]}>
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
  );
};

export default ServiceCoverage;
