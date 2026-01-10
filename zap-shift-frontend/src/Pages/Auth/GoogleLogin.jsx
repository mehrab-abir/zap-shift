import React, { use } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { useLocation, useNavigate } from "react-router";
import useAxios from "../../Hook/useAxios";
import { useState } from "react";
import { Bounce, toast } from "react-toastify";

const GoogleLogin = () => {
  const { googleSignIn, setUser } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosHook = useAxios();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleLogin = async () => {
    setIsSubmitting(true);

    try {
      const result = await googleSignIn();
      setUser(result.user);

      const newUser = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        currentRole: "user",
        createdAt: new Date(),
      };

      const postNewUser = await axiosHook.post("/users", newUser);
      if (postNewUser.data.insertedId) {
        navigate(location?.state || "/", { replace: true });
        toast.success("Welcome!", {
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
      } else if (postNewUser.data.userExists) {
        navigate(location?.state || "/", { replace: true });
      }
    } catch (error) {
      toast.error(`${error.code}`, {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={googleLogin}
        className="btn bg-surface w-full"
        disabled={isSubmitting === true}
      >
        <FcGoogle className="text-2xl" />
        {isSubmitting ? <i>Logging In...</i> : "Log In With Google"}
      </button>

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

export default GoogleLogin;
