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

function SetViewOnLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [map, position]);
  return null;
}

function ClickHandler({ setLocation, editMode }) {
  useMapEvents({
    click: async (e) => {
      if (!editMode) return; // ✅ only active in edit mode

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

export default function UserLocationMap({editMode, setLocation, location}) {
  
  const [search, setSearch] = useState("");
  
  const provider = new OpenStreetMapProvider();

  useEffect(() => {
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
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;

    const results = await provider.search({ query: search });
    if (results.length > 0) {
      const { x: lng, y: lat, label } = results[0];

      setLocation({
        lat,
        lng,
        city: label.split(",")[0] || "",
        country: label.split(",").pop() || "",
        full: label,
      });
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      {/* 🔄 Toggle Buttons */}
    

      {/* 🔍 Search Bar (only in edit mode) */}
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

      {/* 🌍 Map */}
      <MapContainer
        center={[location.lat || 14.5995, location.lng || 120.9842]} // fallback: Manila
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {location.lat && location.lng && (
          <Marker position={[location.lat, location.lng]}>
            <Popup>
              📍 <b>{location.city}</b> <br />
              {location.country} <br />
              <small>{location.full}</small>
            </Popup>
          </Marker>
        )}

        <ClickHandler setLocation={setLocation} editMode={editMode} />
        <SetViewOnLocation
          position={location.lat && [location.lat, location.lng]}
        />
      </MapContainer>
    </div>
  );
}
