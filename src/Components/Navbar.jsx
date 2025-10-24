import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home as HomeIcon, User, Bell } from "lucide-react";
import { useUserDataStore } from "../Services/Stores/UserDataStore";
import { useAuthStore } from "../Services/Stores/AuthStore";
import AuthApi from "../Services/Api/AuthApi";
import '../index.css'

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const authLogOut = useAuthStore((state) => state.logout);
  const storeLogout = useAuthStore.getState().logout;
  const resetUserData = useUserDataStore((state) => state.resetUserData);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthApi.logout();
      if (response.status === 200) {
        storeLogout();
        resetUserData();
        navigate("login");
      }
    } catch {
      localStorage.removeItem("token");
      storeLogout();
      resetUserData();
      navigate("login");
    } finally {
      setLoading(false);
    }
  };

  // Klik izvan dropdowna zatvara meni
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full z-40">
      <nav className="flex justify-between items-center rounded-xl py-3 px-5 bg-gray-800/50 backdrop-blur-md top-0 z-40 shadow-md w-full">
        <div className="flex items-center gap-6 text-xl">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <HomeIcon size={20} /> Home
          </Link>

          <Link
            to="/me"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <User size={20} /> Profile
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex items-center gap-2 hover:text-cyan-400 transition"
            >
              <Bell size={20} />
              {/* Badge za nove notifikacije */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5"></span>
            </button>

            {/* Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-64 bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700/40 p-3 z-50 animate-fadeIn">
                <p className="text-sm text-gray-400 border-b border-gray-700 pb-2 mb-2">
                  Notifications
                </p>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar scrollbar-hide" >
                  {/* Dummy notifications */}
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    💬 Someone commented on your post
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    💬 Someone commented on your post
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    💬 Someone commented on your post
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    💬 Someone commented on your post
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    💬 Someone commented on your post
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    👤 New follower: John Doe
                  </div>
                  <div className="bg-gray-700/40 hover:bg-gray-700/60 p-2 rounded-lg transition text-sm">
                    ❤️ Your post got 5 new likes
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 transition px-3 py-1 rounded-lg hover:text-red-400 cursor-pointer"
        >
          <LogOut size={20} /> Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
