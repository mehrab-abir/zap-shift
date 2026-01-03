import { createBrowserRouter } from "react-router";
import Root from "../Pages/Root";
import HomePage from "../Pages/Home/HomePage";
import ServiceCoverage from "../Pages/ServiceCoverage";
import Login from "../Pages/Auth/Login";
import AuthLayout from "../Pages/Auth/AuthLayout";
import Register from "../Pages/Auth/Register";
import ForgetPassword from "../Pages/Auth/ForgetPassword";
import SendParcel from "../Pages/SendParcel";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Pages/Dashboard/DashboardLayout";
import DashboardInterface from "../Pages/Dashboard/DashboardInterface";
import AboutUs from "../Pages/AboutUs";
import MyParcels from "../Pages/Dashboard/MyParcels";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../Pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/Payment/PaymentCancelled";
import PaymentHistory from "../Pages/Dashboard/Payment/PaymentHistory";
import RiderRegistration from "../Pages/RiderRegistration";
import AllRiders from "../Pages/Dashboard/AllRiders";
import RiderDetails from "../Pages/Dashboard/RiderDetails";
import ManageUsers from "../Pages/Dashboard/ManageUsers";
import AdminRoute from "./AdminRoute";
import PendingPickupParcels from "../Pages/Dashboard/PendingPickup";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "sendparcel",
        element: (
          <PrivateRoute>
            <SendParcel></SendParcel>
          </PrivateRoute>
        ),
        loader: () => fetch("/service_center.json"),
        hydrateFallbackElement: <p>Loading...</p>,
      },
      {
        path: "coverage",
        Component: ServiceCoverage,
      },
      {
        path: "/rider-registration",
        element: (
          <PrivateRoute>
            <RiderRegistration></RiderRegistration>
          </PrivateRoute>
        ),
        loader: () => fetch("/service_center.json"),
        hydrateFallbackElement: <p>Loading...</p>,
      },
      {
        path: "about-us",
        Component: AboutUs,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "/auth/login",
        Component: Login,
      },
      {
        path: "/auth/register",
        Component: Register,
      },
      {
        path: "/auth/resetpassword",
        Component: ForgetPassword,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: DashboardInterface,
      },
      {
        path: "/dashboard/myparcels",
        Component: MyParcels,
      },
      {
        path: "/dashboard/payment/:parcelId",
        Component: Payment,
      },
      {
        path: "/dashboard/payment-success",
        Component: PaymentSuccess,
      },
      {
        path: "/dashboard/payment-cancelled",
        Component: PaymentCancelled,
      },
      {
        path: "/dashboard/payment-history",
        Component: PaymentHistory,
      },
      {
        path: "/dashboard/riders",
        element: (
          <AdminRoute>
            <AllRiders></AllRiders>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/riders/riderdetails/:id",
        element: (
          <AdminRoute>
            <RiderDetails></RiderDetails>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/pending-pickup-parcels",
        element : <AdminRoute>
          <PendingPickupParcels></PendingPickupParcels>
        </AdminRoute>
      },
      {
        path: "/dashboard/manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;