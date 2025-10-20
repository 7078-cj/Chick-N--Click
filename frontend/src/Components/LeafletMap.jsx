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
import { OpenStreetMapProvider } from "leaflet-geosearch";

// 🔹 Helper component: change map center when user location updates
function SetViewOnLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [map, position]);
  return null;
}

// 🔹 Handles map clicks only in edit mode
function ClickHandler({ setLocation, editMode }) {
  useMapEvents({
    click: async (e) => {
      if (!editMode) return; // only active in edit mode
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

  // Initialize location once
  useEffect(() => {
    // Use prop location first
    if (location?.lat && location?.lng) {
      setUserLoc(location);
      return;
    }

    // Use user lat/lng if available
    if (user?.latitude && user?.longitude) {
      setUserLoc({
        lat: user.latitude,
        lng: user.longitude,
        city: user.location || "",
        country: "",
        full: user.location || "",
      });
      setLocation({
        lat: user.latitude,
        lng: user.longitude,
        city: user.location || "",
        country: "",
        full: user.location || "",
      });
      return;
    }

    // Fallback: browser geolocation
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
  }, [location, user, setLocation]);

  // Handle search
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

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {editMode && (
        <form
          onSubmit={handleSearch}
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
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            width: "300px",
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
                marginRight: "5px",
              }}
            >
              ×
            </button>
          )}
          <button
            type="submit"
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
        </form>
      )}

      <MapContainer
        center={[userLoc.lat, userLoc.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        {userLoc.lat && userLoc.lng && (
          <Marker position={[userLoc.lat, userLoc.lng]}>
            <Popup>
              📍 <b>{userLoc.city}</b> <br />
              {userLoc.country} <br />
              <small>{userLoc.full}</small>
            </Popup>
          </Marker>
        )}
        <ClickHandler setLocation={setLocation} editMode={editMode} />
        <SetViewOnLocation position={[userLoc.lat, userLoc.lng]} />
      </MapContainer>
    </div>
  );
}
