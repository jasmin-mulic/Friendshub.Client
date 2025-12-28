import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Home as HomeIcon, User, Bell } from "lucide-react";
import { useUserDataStore } from "../Services/Stores/UserDataStore";
import { useAuthStore } from "../Services/Stores/AuthStore";
import  UsersApi from "../Services/Api/UsersApi"
import AuthApi from "../Services/Api/AuthApi";
import "../index.css";
import { startSignalR } from "../Services/signalR";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1)
  const storeLogout = useAuthStore((state) => state.logout);
  const resetUserData = useUserDataStore((state) => state.resetUserData);

  const dropdownRef = useRef(null);
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
  useEffect(() =>{
    const getNotifications = async () =>{
      try {
        const response = await  UsersApi.getNotifications(page);
        console.log(response);
      } catch (error) {
        console.log(error.response)
      }
    }
    getNotifications()
  },[])
  // SignalR
  useEffect(() => {
    let conn;

    startSignalR().then((connection) => {
      conn = connection;

      console.log("ConnectionId:", connection.connectionId);

      conn.on("ReceiveNotification", (notification) => {
        setNotifications((prev) => [...prev, notification]);
        setUnreadCount((prev) => prev + 1);
        console.log(notification)
      });
    });

    return () => {
      if (conn) {
        conn.off("ReceiveNotification");
        conn.stop();
      }
    };
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full z-10">
      <nav className="flex justify-between items-center rounded-xl py-3 px-5 bg-gray-800/50 backdrop-blur-md shadow-md w-full">
        <div className="flex items-center gap-6 text-xl">
          <Link to="/" className="hover:text-cyan-400 transition">
            <HomeIcon size={20} />
          </Link>

          <Link to="/me" className="hover:text-cyan-400 transition">
            <User size={20} />
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications((prev) => {
                  if (!prev) setUnreadCount(0);
                  return !prev;
                });
              }}
              className="relative flex items-center hover:text-cyan-400 transition"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    bg-red-500 text-white text-xs
                    w-5 h-5 rounded-full
                    flex items-center justify-center
                    font-semibold
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-3 w-64 bg-gray-800 text-white rounded-xl shadow-lg p-3 z-50">
                <p className="text-sm text-gray-400 border-b border-gray-700 pb-2 mb-2">
                  Notifications
                </p>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No notifications
                    </p>
                  )}

                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="text-sm bg-gray-700/50 rounded-lg p-2"
                    >
                      {notification.message}
                    </div>
                  ))}
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

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
