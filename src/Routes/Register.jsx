import { useForm } from "react-hook-form";
import isAdult from "../Helpers"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const form = useForm();
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const [apiValidationErrors, setApiValidationErrors] = useState([])
  const onSubmit = async (data) => {
    console.log(data)
    try {
        const response = await axios.post("https://localhost:44326/api/Auth/Register", data)
        if(response.status === 200)
          navigate
    } catch (exc) {
            var validationErrors = exc.response.data
            setApiValidationErrors(Object.fromEntries(
              validationErrors.map(e =>[e.propertyName, e.errorMessage])
            ))   
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 dark:bg-gray-950 px-4">
      <div className="w-full max-w-xl dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
          Join our friendliest<span className="text-red-400"> Hub</span>
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="h-22">
            <label
              htmlFor="Username"
              className="block mb-2 text-sm font-medium text-red-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="Username"
              name="Username"
              placeholder="your-cool-username"
              {...register("Username", {
                required: "We need your username",
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            {errors.Username?.message && (
              <p className="text-red-400 p-1">{errors.Username.message}</p>
            )}
            {apiValidationErrors.Username &&  <p className="text-red-400 p-1">{apiValidationErrors.Username}</p>}
          </div>

          <div className="h-22">
            <label
              htmlFor="EmailAddress"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="EmailAddress"
              name="EmailAddress"
              placeholder="your-fav@mail.com"
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register("EmailAddress", { required: "Your email is missing." })}
            />
            {errors.EmailAddress?.message && (
              <p className="text-red-400 p-1">{errors.EmailAddress.message}</p>
            )}
            {apiValidationErrors.EmailAddress && <p className="text-red-400">{apiValidationErrors.EmailAddress}</p>}
          </div>

          <div className="h-22">
            <label
              htmlFor="emailAddress"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date of birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register("dateOfBirth", {
                required: "Are you even born yet?.",
                validate : (value) => isAdult(value) || "You must be at least 18 buddy."
              })}
            />
            {errors.dateOfBirth?.message && (
              <p className="text-red-400 p-1">{errors.dateOfBirth.message}</p>
            )}
             {apiValidationErrors.DateOfBirth &&  <p className="text-red-400 p-1">{apiValidationErrors.DateOfBirth}</p>}
          </div>

          <div className="h-20">
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
              placeholder="**********"
              className="w-full px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              {...register("password", {
                required: "You are not safe.",
                minLength :
                {
                  value : 6,
                  message : "Password must be a minimum of 6 characters."
                }
              })}
              
            />
            {errors.password?.message && (
              <p className="text-red-400 p-1">{errors.password.message}</p>
            )}
             {apiValidationErrors.Password &&  <p className="text-red-400 p-1">{apiValidationErrors.DateOfBirth}</p>}

          </div>

          <button className="w-full py-2 mt-4 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl shadow-md transition-colors">
            Complete registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
