import { NavLink } from "react-router-dom";
import logoSvg from "@/assets/logo.svg";

export const Logo = () => (
  <NavLink className="text-2xl font-italic text-primary logo flex gap-2 items-center" to="/">
    <img src={logoSvg} alt="logo" />
    <span className="font-semibold tracking-tighter">scis.sors</span>
  </NavLink>
)