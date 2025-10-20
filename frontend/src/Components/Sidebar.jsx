import { LayoutGrid, CreditCard, ShoppingCart, LogOut } from "lucide-react";

export default function Sidebar({setActiveTab, activeTab}) {

  const active = "bg-orange-500 text-white"
  const inactive = "bg-yellow-300 text-orange-500"
  
  return (
    <div className="fixed top-0 left-0 h-full w-20 bg-white shadow-lg flex flex-col items-center justify-center py-6">
      {/* Logo */}
      <div className="mb-12">
        <img
          src="/logo.png" 
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-6">
        <button  onClick={() => setActiveTab("foods")} className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab == "foods" ? active : inactive} shadow-md hover:scale-110 transition`}>
          <LayoutGrid size={20} />
        </button>

        <button onClick={() => setActiveTab("categories")} className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab == "categories" ? active : inactive} shadow-md hover:scale-110 transition`}>
          <CreditCard size={20} />
        </button>

        <button onClick={() => setActiveTab("orders")} className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab == "orders" ? active : inactive} shadow-md hover:scale-110 transition`}>
          <ShoppingCart size={20} />
        </button>

        
      </div>

      {/* Spacer pushes logout to bottom */}
      <div className="flex-1"></div>

      {/* Logout */}
      <button className="w-12 h-12 mb-4 rounded-full flex items-center justify-center bg-yellow-300 text-orange-500 shadow-md hover:scale-110 transition">
        <LogOut size={20} />
      </button>
    </div>
  );
}
