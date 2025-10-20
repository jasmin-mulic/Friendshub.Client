import { useForm } from "react-hook-form";
import { isAdult } from "../Helpers";
import { useNavigate } from "react-router-dom";
import AuthApi from "../Services/Api/AuthApi";

const Register = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await AuthApi.register(data);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (exc) {
      const apiErrors = exc.response?.data.validationErrors;
      if (apiErrors && Array.isArray(apiErrors)) {
        apiErrors.forEach(({ propertyName, errorMessage }) => {

          setError(propertyName, { type: "manual", message: errorMessage });
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 dark:bg-gray-950 px-4">
      <div className="w-full max-w-xl dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
          Join our friendliest<span className="text-red-400"> Hub</span>
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* USERNAME */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              placeholder="your-cool-username"
              {...register("username", {
                required: "We need your username",
                pattern: {
                  value: /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{1,30}$/,
                  message:
                    "Username can contain letters, numbers, underscores and dots (no spaces).",
                },
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters long",
                },
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-600 focus:border-blue-400 bg-transparent outline-none text-gray-100 placeholder-gray-500 transition-colors"
              onChange={() => clearErrors("Username")}
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label
              htmlFor="EmailAddress"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="EmailAddress"
              placeholder="your-fav@mail.com"
              {...register("EmailAddress", {
                required: "Your email is missing.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-600 focus:border-blue-400 bg-transparent outline-none text-gray-100 placeholder-gray-500 transition-colors"
              onChange={() => clearErrors("EmailAddress")}
            />
            {errors.EmailAddress && (
              <p className="text-red-400 text-sm mt-1">
                {errors.EmailAddress.message}
              </p>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <label
              htmlFor="DateOfBirth"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="DateOfBirth"
              {...register("DateOfBirth", {
                required: "Please enter your date of birth.",
                validate: (value) => isAdult(value) || "You must be at least 18.",
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-600 focus:border-blue-400 bg-transparent outline-none text-gray-100 placeholder-gray-500 transition-colors"
              onChange={() => clearErrors("DateOfBirth")}
            />
            {errors.DateOfBirth && (
              <p className="text-red-400 text-sm mt-1">
                {errors.DateOfBirth.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="Password"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="Password"
              placeholder="**********"
              {...register("Password", {
                required: "Enter your password.",
                minLength: {
                  value: 7,
                  message: "Password must be at least 7 characters long.",
                },
              })}
              className="w-full px-4 py-2 border-b-2 border-gray-600 focus:border-blue-400 bg-transparent outline-none text-gray-100 placeholder-gray-500 transition-colors"
              onChange={() => clearErrors("Password")}
            />
            {errors.Password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.Password.message}
              </p>
            )}
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
