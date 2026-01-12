import React, { use, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import authImage from "../../assets/authImage.png";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../Context/Auth/AuthContext";
import GoogleLogin from "./GoogleLogin";

const Login = () => {
  const { logIn, setLoading, forgotPassword } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const resetPasswordModalRef = useRef();
  const emailRef = useRef();
  const [resetPasswordMsg, setResetPasswordMsg] = useState('');

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
          closeOnClick: true,
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

  //reset password
  const resetPassword = async ()=>{
    setResetPasswordMsg('');

    const email = emailRef.current.value;
    if(!email){
      setResetPasswordMsg("*Please enter your account email");
      return;
    }
    
    await forgotPassword(email);

    setResetPasswordMsg("Password reset link has been sent. Please check your email, including spams");
  }

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

            <p onClick={()=>resetPasswordModalRef.current.showModal()} className="hover:underline hover:text-lime-500 mt-1 text-sm cursor-pointer">Forgot Password?</p>

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
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />

      {/* reset password modal */}
      <dialog ref={resetPasswordModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">Enter the email associated with your account</h3>
          <input ref={emailRef} type="email" className="input outline-none w-full" placeholder="Your email" />

          <p className={`mt-1 text-sm ${resetPasswordMsg.includes("Password") ? 'text-blue-500' : 'text-red-500'}`}>{resetPasswordMsg}</p>

          <button onClick={()=>resetPassword()} className="mt-3 btn btn-sm md:btn-md bg-primary text-black">Reset Password</button>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Login;
