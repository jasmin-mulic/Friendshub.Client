import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DeleteAccountModal({ show, onConfirm, onCancel }) {
const [password, setPassword] = useState()
    const confirmDeletion = () =>{
        onConfirm(password)
    }
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-gray-800 text-white p-6 rounded-2xl shadow-2xl w-[400px] text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        onClick={(e) => e.defaultPrevented}
                    >
                        <p className="text-lg font-semibold mb-5">
                            All your data will be deleted. Are you sure you want to delete your account?
                        </p>
                        <div className="flex justify-center gap-4  flex-col">
                            <input
                             placeholder="Your password:" 
                             onChange={(e) => setPassword(e.target.value)}
                             className="w-full mt-5 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                            />
                            <button
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                                onClick={confirmDeletion }
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                                onClick={onCancel}
                            >
                                No
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
