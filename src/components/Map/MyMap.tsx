import { useState } from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MyMapProps {
  latitude: number;
  longitude: number;
  token: string;
  style: string;
  zoom: number;
}

function MyMap({ latitude, longitude, token, style, zoom }: MyMapProps) {
  const [viewport, setViewport] = useState({
    latitude: isNaN(latitude) ? 0 : latitude,
    longitude: isNaN(longitude) ? 0 : longitude,
    zoom: zoom || 10,
  });

  const mapDimensions = {
    width: "100%",
    height: "100%",
  };

  return (
    <ReactMapGL
      {...viewport}
      {...mapDimensions}
      mapStyle={style || "mapbox://styles/mapbox/streets-v11"}
      mapboxAccessToken={token}
      onMove={(evt) => setViewport(evt.viewState)}
      attributionControl={false}
      scrollZoom={false}
    >
      <NavigationControl position="top-right" />
    </ReactMapGL>
  );
}

export default MyMap;
