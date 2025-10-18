import { motion } from "framer-motion";

const AnimatedToggle = ({ isChecked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!isChecked)}
      className={`relative w-14 h-8 flex items-center rounded-full cursor-pointer p-1 transition-colors duration-300 
        ${isChecked ? "bg-green-500" : "bg-gray-400"}`}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-md absolute"
        animate={{
          x: isChecked ? 24 : 0, //  pomjeraj kuglice
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </div>
  );
};

export default AnimatedToggle;
