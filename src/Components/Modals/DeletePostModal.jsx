import { motion, AnimatePresence } from "framer-motion";

export default function DeletePostModal({ show, onConfirm, onCancel }) {
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
            className="bg-gray-800 text-white p-6 rounded-2xl shadow-2xl w-[320px] text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} 
          >
            <p className="text-lg font-semibold mb-5">
              Do you want to delete this post?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                onClick={onConfirm}
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
