import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/AuthStore";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthApi from "../Services/AuthApi";
export default function Login() {

  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const {errors} = formState
  const login = useAuthStore((effect) => effect.login)
  const navigate = useNavigate()
  const [unauthorized, setUnauthorized] = useState("")
  const [loading, setLoading] = useState(false)
  const isAuthenticated = useAuthStore((effect) => effect.isAuthenticated)
  const goToRegister = () => {
    navigate("/register")
  }
  const onSubmit = async (data) =>{
    setLoading(true)
    try {
      const response = await AuthApi.post("login/", data)
      console.log("Login response: " + response.status)
      if (response.status === 200) {
        localStorage.setItem("token", response.data)
        login(response.data)
        navigate("/")
      }
    } catch (error) {
      if(error.response?.status == 401) 
        setUnauthorized("Wrong username or password.")
    }
    finally{
      setLoading(false)
    }
  }
  useEffect(() =>{
      console.log(isAuthenticated)
  },[])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-xl h-105 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
          Welcome to riends<span className="text-red-400">Hub</span>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="h-26">
            <label
              htmlFor="email"
              className="block mb-4 text-sm font-medium text-red-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="usernameOrEmail"
              name="usernameOrEmail"
              placeholder="you@example.com"
              {...register("usernameOrEmail", {
                required : "Please enter username or email address."
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            {errors.usernameOrEmail?.message && <p className="text-red-400 text-sm pt-2">{errors.usernameOrEmail.message}</p>}
          </div>

          <div className="h-18">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              {...register("password", {
                required : "Enter your password."
              })}

              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              required
            />
            {errors.password?.message && <p className="text-red-400 text-sm pt-2">{errors.password.message}</p>}

                {unauthorized && <p className="text-red-400">{unauthorized}</p>}
          </div>
          <button type="submit"
            className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <a onClick={goToRegister} className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
      {loading == true && <div className="loading"></div>}
    </div>
  );
}
