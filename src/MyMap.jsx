import { GeoSearchControl, MapBoxProvider } from "leaflet-geosearch";
import {
  MapContainer,
  useMap,
  TileLayer,
  useMapEvent,
  useMapEvents,
} from "react-leaflet";
import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import L, { marker } from "leaflet";
import { Geocoder } from "leaflet-control-geocoder";

const SearchField = ({ apiKey }) => {

  const initialCenter = [-8.0456, -34.8981];
  const map = useMap();
  const [marker, setMarker] = useState(L.marker(initialCenter));
  const [markerQ, setMarkerQ] = useState();
  const [state, setState] = useState("");

  map.setView(initialCenter, 10);

  const provider = new MapBoxProvider({
    params: {
      access_token: apiKey,
    },
  });

  const searchControl = new GeoSearchControl({
    provider: provider,
    searchLabel: "Insira o endereço",
    notFoundMessage: "Endereço não encontrado. Tente novamente.",
    style: "bar",
    //keepResult: true
  });

  // Bug: Marcador inicial não é arrastável
  // fixar ponto flutuante em 7 antes de fazer queries
  //console.log("before drag: ", marker.getLatLng());

  map.on("click", (e) => {
    if (marker) {
      marker.removeFrom(map);
    }

    let mrk = L.marker(e.latlng, { draggable: true, autoPan: true }).on(
      "dragend",
      (e) => {
        /* console.log("dragend: ", e.target._latlng) */
        //dragendlatlng = e.target._latlng;
        mrk.setLatLng(e.target._latlng);
        //setMarker(mrk);
        //console.log("dragend: ", dragendlatlng)
      }
    );
    /* console.log("dragend: ", dragendlatlng)  */
    setMarker(mrk);
    
  });
  //console.log("after drag: ", marker.getLatLng())
  marker.addTo(map);
  map.setView(marker.getLatLng(), 20);
  
  // Geocoder
  //let geocoder = new Geocoder({ defaultMarkGeocode: false })
  //  .on('markgeocode', function (e) {
  //    let marker = L.marker(e.geocode.center).addTo(map);
  //    map.fitBounds(marker.getBounds());
  //  }).addTo(map);

  useEffect(() => {
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

const MyMap = () => {
  
  return (
    <>
      <MapContainer style={{ height: "60vh", width: "60vh" }}
      >
        {/* {showSearch && <SearchField apiKey={import.meta.env.VITE_APP_MAPBOX_GEOSEARCH_API_TOKEN} />} */}

        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          //style={{minHeight:"50vh", display:"block", margin:"15px 0px 15px 10px"}}
        > */}
          <SearchField
            apiKey={import.meta.env.VITE_APP_MAPBOX_GEOSEARCH_API_TOKEN}
          />
        {/* </form> */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </>
  );
};

export default MyMap;