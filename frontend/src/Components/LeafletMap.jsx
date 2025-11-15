import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import markerIcon from "../assets/custom_marker.svg";

// =============================
// 🔹 HOC Destination
// =============================
const HOC_LOCATION = {
  lat: 14.958753194320153,
  lng: 120.75846924744896,
  name: "HOC - House of Chicken",
};

// =============================
// 🔹 Custom Leaflet Marker Icon
// =============================
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40], 
  iconAnchor: [20, 40], 
  popupAnchor: [0, -38], 
  className: "custom-marker",
});

// =============================
// 🔹 Routing Component
// =============================
function RouteToHOC({ userLoc }) {
  const map = useMap();

  useEffect(() => {
    if (!userLoc?.lat || !userLoc?.lng) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLoc.lat, userLoc.lng),
        L.latLng(HOC_LOCATION.lat, HOC_LOCATION.lng),
      ],
      lineOptions: {
        addWaypoints: true,
        styles: [{ color: "#007bff", weight: 4 }],
      },
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false, 
      createMarker: function (i, wp, nWps) {
        
        let icon = customIcon;
        if (i === 1) {
          
          icon = L.icon({
            iconUrl: markerIcon, 
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });
        }
        return L.marker(wp.latLng, { icon });
      },
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [userLoc, map]);

  return null;
}

// =============================
// 🔹 Helper component: Update map center when location changes
// =============================
function SetViewOnLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.flyTo(position, 15, { duration: 1.2 });
    }
  }, [map, position]);
  return null;
}

// =============================
// 🔹 Handle map clicks (only in edit mode)
// =============================
function ClickHandler({ setLocation, editMode }) {
  useMapEvents({
    click: async (e) => {
      if (!editMode) return;
      const { lat, lng } = e.latlng;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();

        setLocation({
          lat,
          lng,
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          country: data.address.country || "",
          full: data.display_name || "",
        });
      } catch {
        setLocation({ lat, lng, city: "", country: "", full: "" });
      }
    },
  });
  return null;
}

// =============================
// 🔹 Main Map Component
// =============================
export default function UserLocationMap({ editMode, setLocation, location, user }) {
  const [search, setSearch] = useState("");
  const provider = new OpenStreetMapProvider();

  const [userLoc, setUserLoc] = useState({
    lat: 14.5995,
    lng: 120.9842,
    city: "",
    country: "",
    full: "",
  });

  // =============================
  // 🔸 Initialize User Location
  // =============================
  useEffect(() => {
    const initLocation = async () => {
      if (location?.lat && location?.lng) {
        setUserLoc(location);
        return;
      }

      if (user?.latitude && user?.longitude) {
        const newLoc = {
          lat: user.latitude,
          lng: user.longitude,
          city: user.location || "",
          country: "",
          full: user.location || "",
        };
        setUserLoc(newLoc);
        setLocation(newLoc);
        return;
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
              );
              const data = await res.json();
              const newLoc = {
                lat,
                lng,
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  "",
                country: data.address.country || "",
                full: data.display_name || "",
              };
              setUserLoc(newLoc);
              setLocation(newLoc);
            } catch {
              setUserLoc({ lat, lng, city: "", country: "", full: "" });
              setLocation({ lat, lng, city: "", country: "", full: "" });
            }
          },
          (err) => console.error("Geolocation error:", err)
        );
      }
    };

    initLocation();
  }, [location, user, setLocation]);

  // =============================
  // 🔸 Keep location in sync with user prop
  // =============================
  useEffect(() => {
    if (user?.latitude && user?.longitude) {
      setLocation({
        lat: user.latitude,
        lng: user.longitude,
        city: user.location || "",
        country: "",
        full: user.location || "",
      });
    }
  }, [user, setLocation]);

  // =============================
  // 🔸 Handle Search Input
  // =============================
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const results = await provider.search({ query: search });
    if (results.length > 0) {
      const { x: lng, y: lat, label } = results[0];
      const newLoc = {
        lat,
        lng,
        city: label.split(",")[0] || "",
        country: label.split(",").pop() || "",
        full: label,
      };

      setUserLoc(newLoc);
      setLocation(newLoc);
    }
  };

  // =============================
  // 🔹 UI Render
  // =============================
  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* 🔍 Search bar */}
      {editMode && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: "30px",
            padding: "5px 10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            width: "320px",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search location..."
            style={{
              border: "none",
              outline: "none",
              flex: 1,
              fontSize: "14px",
              padding: "8px",
              borderRadius: "30px",
              color: "#333",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
                color: "#888",
                marginRight: "5px",
              }}
            >
              ×
            </button>
          )}
          <button
            type="button"
            onClick={handleSearch}
            style={{
              border: "none",
              background: "#007bff",
              color: "#fff",
              borderRadius: "20px",
              padding: "6px 15px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "0.3s",
            }}
          >
            Go
          </button>
        </div>
      )}

      {/* 🗺️ Map */}
      <MapContainer
        center={[userLoc.lat, userLoc.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* USER Marker */}
        {userLoc.lat && userLoc.lng && (
          <Marker position={[userLoc.lat, userLoc.lng]} icon={customIcon}>
            <Popup>
              📍 <b>{userLoc.city || "Unknown"}</b> <br />
              {userLoc.country} <br />
              <small>{userLoc.full}</small>
            </Popup>
          </Marker>
        )}

        {/* HOC Marker */}
        <Marker position={[HOC_LOCATION.lat, HOC_LOCATION.lng]} icon={customIcon}>
          <Popup>
            🍗 <b>{HOC_LOCATION.name}</b>
          </Popup>
        </Marker>

        {/* Route */}
        {userLoc.lat && userLoc.lng && <RouteToHOC userLoc={userLoc} />}

        <ClickHandler setLocation={setLocation} editMode={editMode} />
        <SetViewOnLocation position={[userLoc.lat, userLoc.lng]} />
      </MapContainer>
    </div>
  );
}
