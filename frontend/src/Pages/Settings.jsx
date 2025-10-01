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
    <div className="flex flex-row w-screen h-screen bg-gray-50">
      {/* Sidebar */}
      
      <aside className="flex flex-col items-center justify-between w-20 h-full py-6 bg-white border-r">
        <img
                        src={hocLogo}
                        alt="Click N' Chick"
                        className="object-contain w-auto cursor-pointer h-14"
                        onClick={() => nav("/")}
                      />
        <div className="flex flex-col gap-6 mt-6">
          <button className="p-3 text-orange-600 bg-orange-200 rounded-full">
            <User size={22} />
          </button>
          <button className="p-3 text-yellow-600 bg-yellow-200 rounded-full">
            <Lock size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          
          <button className="p-3 mt-auto text-yellow-500 bg-yellow-100 rounded-full">
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-col items-start w-screen px-10 py-6 justify-self-start">
        <h1 className="mb-8 text-4xl font-medium tracking-wide text-orange-500 uppercase hoc_font">
          Settings
        </h1>

        {/* Account Information */}
        <div className="bg-white shadow-sm rounded-2xl p-6  w-[150vh]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Account Information</h2>
            {!isEditing && (
              <button
                className="text-sm font-medium text-orange-500 hover:underline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 text-xs text-gray-500">FNAME</label>
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">LNAME</label>
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-gray-500">Note</label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-400"
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Location */}
          <div className="mb-6 w-full h-[30vh]">
            <label className="block mb-2 text-xs text-gray-500">
              Your Location
            </label>
            <div className="flex flex-row items-center justify-center h-full gap-4">
              <div className="relative flex-1 h-full p-4 bg-gray-50 rounded-xl ">
                <h3 className="font-semibold">📍 {formData.location}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {location.full}
                </p>
                {isEditing && (
                  <button
                    className="absolute text-sm font-medium text-orange-500 top-2 right-3 hover:underline"
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
              className="px-6 py-2 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
            >
              Save
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
