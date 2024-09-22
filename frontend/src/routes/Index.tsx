import { Outlet } from "react-router-dom";
//import { Header } from "../components/Headers";
import Footer from "../components/Footer";
import { lazy } from "react";
//const Footer = lazy(() => import("../components/Footer"));
const Header = lazy(() => import("../components/Headers"));

export default function Index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
