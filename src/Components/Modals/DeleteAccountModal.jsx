import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthApi from "../../Services/Api/AuthApi";

export default function DeleteAccountModal({ loading, show, onCancel }) {
  const [message, setMessage] = useState("Deleting your account...");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm();

const deleteAccount = async (password) => {
  try {
    const res = await AuthApi.deleteAccount(password);
    
    if (res.status === 200) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowDeleteAccount(false); // zatvori modal
        storeLogout(); // izbriši iz store-a
        resetUserData();
        navigate("login"); // preusmjeri korisnika
      }, 5000);
    }
  } catch (error) {
    if(error.response.status == 400)
      console.log(error.response.data)
      setError("password", {type : "manual", message : error.response.data})
  }
};
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Deleting your posts...",
      "Deleting your follows...",
      "Deleting your followers...",
      "Finalizing account removal...",
    ];

    let index = 0;

    const interval = setInterval(() => {
      setMessage(messages[index]);
      index++;
      if (index >= messages.length) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  const confirmDeletion = (data) => {
    deleteAccount(data.password);
    reset();
  };

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

            <form
              onSubmit={handleSubmit(confirmDeletion)}
              className="flex justify-center gap-4 flex-col"
            >
                <div className="h-13">
              <input
                type="password"
                placeholder="Your password:"
                {...register("password", {
                  required: "Password is required.",
                })}
                className="w-full mt-2 px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 
                focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none 
                text-gray-100 placeholder-gray-400 transition-colors"
              />
              {errors.password && 

                  <p className="text-red-400 text-sm text-start ps-2 mt-1">{errors.password.message}</p>
                }
                </div>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
                  onClick={onCancel}
                >
                  No
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-cyan-300 text-lg">{message}</p>
        </div>
      )}
    </AnimatePresence>
  );
}
