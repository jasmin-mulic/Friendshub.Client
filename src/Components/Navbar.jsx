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
    return (
        <div className='relative  w-full'>

        <nav className="flex justify-between items-center rounded-xl py-3 bg-gray-800/50 backdrop-blur-md top-0 z-50 shadow-md w-full ">
            <div className="flex items-center gap-6 text-xl w-full xl:w-2/5  ps-5 ">
                <Link to="/" className="flex items-center gap-2 hover:text-cyan-400 transition">
                    <HomeIcon size={20} /> Home
                </Link>
                <Link to="/me" className="flex items-center gap-2 hover:text-cyan-400 transition">
                    <User size={20} /> Profile
                </Link>
            </div>
            <button
                onClick={logout}
                className=" flex items-center gap-2  transition- px-3 py-1 rounded-lg hover:text-red-400 cursor-pointer transition"
            >
                <LogOut size={20} />Logout
            </button>
        </nav>

        </div>
    )
}

export default Navbar
