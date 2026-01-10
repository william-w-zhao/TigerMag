import Tiger from "../assets/Tiger.png";
import TigerWhite from "../assets/TigerWhite.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate()
    const NAV_BTN = "bg-transparent border-0 outline-none shadow-none px-4 font-medium text-base text-white cursor-pointer hover:text-orange-400 transition-colors duration-300";

    return (
        <div>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-px mx-auto" />
            <footer className="bg-black">
            <div className="mx-auto py-2 flex justify-between items-center lg:w-4/5">
            <div className="flex items-center gap-4">
                <img src={TigerWhite} alt="Logo" onClick={() => navigate("/")} className="h-8 w-auto cursor-pointer"/>
                <h2 className="px-4 text-base font-medium text-white hover:text-orange-400 transition-colors duration-300">Weather in Princeton: 80°F  ☀️  Sunny</h2>
            </div>
            <div className="hidden lg:flex items-center gap-4">
                <button className={NAV_BTN} onClick={() => navigate("/news")}>News</button>
                <button className={NAV_BTN} onClick={() => navigate("/opinion")}>Opinion</button>
                <button className={NAV_BTN} onClick={() => navigate("/archives")}>Archives</button>
            </div>
        </div>
    </footer>
  </div>
);
}

export default Footer