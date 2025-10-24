import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthApi from "../Services//Api/AuthApi";
import { jwtDecode } from "jwt-decode";
import { useUserDataStore } from "../Services/Stores/UserDataStore";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [unauthorized, setUnauthorized] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserId = useUserDataStore((state) => state.setUserId)

  const onSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    setUnauthorized("");
    try {
      const response = await AuthApi.login(data);

      if (response.status === 200) {
       localStorage.setItem("token", response.data);
       const token = localStorage.getItem("token")
       const userId = jwtDecode(token).nameid
       setUserId(userId);
        login(response.data);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUnauthorized("Wrong username or password.");
      } else {
        setUnauthorized("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => navigate("/register");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950/80 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
          Welcome to friendshub
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block mb-2 text-sm font-medium text-red-700 dark:text-gray-300"
            >
              Email or Username
            </label>
            <input
              id="usernameOrEmail"
              placeholder="you@example.com"
              {...register("usernameOrEmail", { required: "Please enter username or email address." })}
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            {errors.usernameOrEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.usernameOrEmail.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              {...register("password", { required: "Enter your password." })}
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Unauthorized */}
          {unauthorized && <p className="text-red-400 text-sm text-center">{unauthorized}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <span
            onClick={goToRegister}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
