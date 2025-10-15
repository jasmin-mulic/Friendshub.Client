import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Home as HomeIcon, User } from "lucide-react";
import { useUserDataStore } from '../Services/Stores/useUserDataStore';
import { useAuthStore } from '../Services/Stores/AuthStore';
import { div } from 'motion/react-client';

const Navbar = () => {

    const [loading, setLoading] = useState(false)
    const authLogOut = useAuthStore((state) => state.logout);
    const storeLogout = useAuthStore.getState().logout;
    const resetUserData = useUserDataStore((state) => state.resetUserData)

    const logout = async () => {
        try {
            setLoading(true);
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
    return (
        <div>

        <nav className="flex justify-center items-center px-10 py-3 bg-gray-800/50 backdrop-blur-md sticky top-0 z-50 shadow-md mx-auto ">
            <div className="flex items-center gap-6 text-xl w-full xl:w-2/5 relative ps-5 ">
                <Link to="/" className="flex items-center gap-2 hover:text-cyan-400 transition">
                    <HomeIcon size={20} /> Home
                </Link>
                <Link to="/me" className="flex items-center gap-2 hover:text-cyan-400 transition">
                    <User size={20} /> Profile
                </Link>
            <button
                onClick={logout}
                className="absolute  right-2 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow transition-all"
            >
                <LogOut size={18} /> Logout
            </button>
            </div>
        </nav>

        </div>
    )
}

export default Navbar
