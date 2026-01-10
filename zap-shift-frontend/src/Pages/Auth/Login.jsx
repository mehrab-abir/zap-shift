import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import authImage from "../../assets/authImage.png";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../Context/Auth/AuthContext";
import GoogleLogin from "./GoogleLogin";

const Login = () => {
  const { logIn, setLoading } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (data) => {
    setIsSubmitting(true);
    logIn(data.email, data.password)
      .then(() => {
        navigate(location?.state || "/", { replace: true });

        toast.success("Welcome Back!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      })
      .catch((err) =>
        toast.error(`${err.code}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      )
      .finally(() => {
        setIsSubmitting(false);
        setLoading(false);
      });
  };

  return (
    <div className="bg-surface pb-10">
      <div className="w-10/12 mx-auto mt-10 bg-base p-5 shadow-lg rounded-md flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2">
          <div className="text-center my-5">
            <h1 className="text-2xl font-bold my-3">Log In to Your Account</h1>
            <p className="text-sm">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                state={location.pathname}
                className="text-lime-600 hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleLogin)}
            className="md:px-8 py-5 space-y-2 w-full"
          >
            <div className="flex flex-col">
              <label>Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                placeholder="Enter email"
                className="input border-input outline-none w-full"
              />
              {errors.email?.type === "required" && (
                <p className="text-error text-sm">Email is required</p>
              )}
            </div>

            <div className="flex flex-col relative">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                })}
                placeholder="Enter password"
                className="input border-input outline-none w-full"
              />
              {errors.password?.type === "required" && (
                <p className="text-error text-sm">Password is required</p>
              )}

              {showPassword ? (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xl absolute top-8.5 right-3 cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xl absolute top-8.5 right-3 cursor-pointer"
                />
              )}
            </div>

            <button
              type="submit"
              className="btn bg-primary w-full text-black rounded-md border-none mt-4 hover:shadow-md hover:shadow-indigo-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? <i>Logging in...</i> : "Log In"}
            </button>

            <p className="text-center my-4">Or</p>
            <GoogleLogin></GoogleLogin>
          </form>
        </div>

        <div>
          <img src={authImage} alt="" />
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Login;
