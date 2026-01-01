import React, { use } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { useLocation, useNavigate } from "react-router";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";
import { useState } from "react";

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
        role: "user",
        createdAt: new Date(),
      };

      const postNewUser = await axiosHook.post("/users", newUser);
      if (postNewUser.data.insertedId) {
        navigate(location?.state || "/", { replace: true });
        Swal.fire({
          title: "Account created!",
          icon: "success",
          draggable: true,
        });
      } else if (postNewUser.data.userExists) {
        navigate(location?.state || "/", { replace: true });
      }
    } catch (error) {
      console.log("Error: ", error);
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
      >
        <FcGoogle className="text-2xl" />
        {isSubmitting ? <i>Logging In...</i> : "Log In With Google"}
      </button>
    </div>
  );
};

export default GoogleLogin;
