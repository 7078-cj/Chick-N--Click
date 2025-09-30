import { useState } from "react";
import { User, Lock, LogOut } from "lucide-react";
import UserLocationMap from "../Components/LeafletMap";
import hocLogo from "../assets/hoc_logo.png";

export default function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  
  const [location, setLocation] = useState({
      lat: null,
      lng: null,
      city: "",
      country: "",
      full: "",
    });

    const [formData, setFormData] = useState({
    fname: "Ceejay",
    lname: "Santos",
    phone: "+6391021232412",
    note: "Add note",
    location: location.full,
    lat: location.lat,
    lng: location.lng,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated user info:", formData);
    // 🔹 Here you’d call your API to update user info in backend
  };

  return (
    <div className="flex flex-row  h-screen w-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-20 bg-white flex flex-col items-center justify-between py-6 border-r h-full">
        <img
                        src={hocLogo}
                        alt="Click N' Chick"
                        className="h-14 w-auto object-contain cursor-pointer"
                        onClick={() => nav("/")}
                      />
        <div className="flex flex-col gap-6 mt-6">
          <button className="p-3 rounded-full bg-orange-200 text-orange-600">
            <User size={22} />
          </button>
          <button className="p-3 rounded-full bg-yellow-200 text-yellow-600">
            <Lock size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          
          <button className="p-3 rounded-full bg-yellow-100 text-yellow-500 mt-auto">
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col justify-self-start items-start px-10 py-6 w-screen">
        <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide uppercase mb-8">
          Settings
        </h1>

        {/* Account Information */}
        <div className="bg-white shadow-sm rounded-2xl p-6  w-[150vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Account Information</h2>
            {!isEditing && (
              <button
                className="text-orange-500 text-sm font-medium hover:underline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-gray-500 mb-1">FNAME</label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full rounded-full border px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">LNAME</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full rounded-full border px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-full border px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Note</label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full rounded-full border px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 w-full h-[30vh]">
            <label className="block text-xs text-gray-500 mb-2">
              Your Location
            </label>
            <div className="flex flex-row justify-center items-center gap-4 h-full">
              <div className="flex-1 bg-gray-50 rounded-xl p-4 relative h-full ">
                <h3 className="font-semibold">📍 {formData.location}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  2016, Lorem ipsum dolor sit amet, consectetur elit. Sed do
                  eiusmod tempor.
                </p>
                {isEditing && (
                  <button
                    className="absolute top-2 right-3 text-orange-500 text-sm font-medium hover:underline"
                    onClick={() =>
                      setFormData({ ...formData, location: "New Location" })
                    }
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="w-[40vh] h-full bg-gray-200 rounded-xl flex items-center justify-center">
                <UserLocationMap editMode={isEditing}  setLocation={setLocation} location={location}/>
              </div>
            </div>
          </div>

          {/* Save button */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600"
            >
              Save
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
