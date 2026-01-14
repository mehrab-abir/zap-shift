import React, { use, useState } from "react";
import authImage from "../../assets/authImage.png";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/Auth/AuthContext";
import GoogleLogin from "./GoogleLogin";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";
import uploadToImgbb from "../../Utils/utils";

const Register = () => {
  const { createAccount, updateUser, setUser, setLoading } = use(AuthContext);
  const axiosHook = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data) => {
    // console.log(data.profileImg[0])

    setIsSubmitting(true);

    let photoURL = null;

    if (data.profileImg[0]) {
      const imageFile = data.profileImg[0];
      photoURL = await uploadToImgbb(imageFile);
    }

    // console.log("PhotoURL : ", photoURL);

    const result = await createAccount(data.email, data.password);

    const userInfo = {
      displayName: data.name,
      photoURL: photoURL,
    };

    await updateUser(userInfo);

    //post the user to db
    const newUser = {
      displayName: data.name,
      email: data.email,
      photoURL: photoURL,
      currentRole: "user",
      createdAt: new Date(),
    };

    const response = await axiosHook.post(`/users`, newUser);
    if (response.data.insertedId) {
      navigate("/", { replace: true });
      Swal.fire({
        title: "Account created!",
        icon: "success",
        draggable: true,
      });
    }

    const user = result.user;
    setUser({ ...user, userInfo });

    setIsSubmitting(false);
    setLoading(false);
  };

  return (
    <div className="bg-surface pb-10">
      <title>Register</title>
      <div className="w-10/12 mx-auto mt-10 bg-base p-5 shadow-lg rounded-md flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2">
          <div className="text-center my-5">
            <h1 className="text-2xl font-bold my-3">Create an Account</h1>
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                state={location.pathname}
                to="/auth/login"
                className="text-lime-600 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleRegister)}
            className="px-2 md:px-8 py-5 space-y-2"
          >
            <div className="flex flex-col">
              <label>Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                placeholder="Enter your name"
                className="input border-input outline-none w-full"
              />
              {errors.name?.type === "required" && (
                <p className="text-error text-sm">Name is required</p>
              )}
            </div>

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

            <div className="flex flex-col">
              <label>Profile Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                {...register("profileImg")}
                className="file-input file-input-bordered w-full"
              />
            </div>

            <div className="flex flex-col relative">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: true,
                  minLength: 6,
                  pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/,
                })}
                placeholder="Enter password"
                className="input border-input outline-none w-full"
              />
              {errors.password?.type === "required" && (
                <p className="text-error text-sm">Password is required</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-error text-sm">
                  Password must be at least 6 characters long
                </p>
              )}
              {errors.password?.type === "pattern" && (
                <p className="text-error text-sm">
                  Password must be at least 6 characters long and include at
                  least one uppercase letter, one lowercase letter and a digit.
                </p>
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

            <p className="text-red-500 text-sm">{}</p>

            <button
              type="submit"
              className="btn bg-primary w-full text-black rounded-md border-none mt-4 hover:shadow-md hover:shadow-indigo-300"
              disabled={isSubmitting === true}
            >
              {isSubmitting ? <i>Signing Up...</i> : "Sign Up"}
            </button>

            <p className="text-center my-4">Or</p>
            <GoogleLogin></GoogleLogin>
          </form>
        </div>

        <div>
          <img src={authImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Register;
