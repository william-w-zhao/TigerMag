import MarqueeBar from "./StockMarquee"
import Tiger from "../assets/Tiger.png";
import TigerLogoText from "../assets/TigerLogoText.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";

const NAV_BTN =
  "bg-transparent border-0 outline-none shadow-none px-4 font-medium text-[1.2rem] text-black cursor-pointer hover:text-orange-400 transition-colors duration-300";

const Navbar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)

  const go = (path) => {
    navigate(path)
    setOpen(false)
  }

  return (
    <div className="mb-4">
    <div className="pr-5 pl-5 mb-4">
      <MarqueeBar className="pb-2"/>
      <nav className="w-full bg-white">
        <div className="relative w-full flex items-center px-4">
          <div className="hidden lg:flex items-center gap-2">
            <img src={Tiger} alt="Logo" onClick = {() => navigate('/')} className="h-16 w-auto" />
            <button className={NAV_BTN} onClick = {() => navigate('/news')}>News</button>
            <button className={NAV_BTN} onClick = {() => navigate('/opinion')}>Opinion</button>
            <button className={NAV_BTN} onClick = {() => navigate('/archives')}>Archives</button>
          </div>
          <div className="justify-self-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <img src={TigerLogoText} alt="Logo" onClick = {() => navigate('/')} className="h-16 w-auto" />
          </div>
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <button className={NAV_BTN} onClick = {() => navigate('/masthead')}>Masthead</button>
            <button className={NAV_BTN} onClick = {() => navigate('/about')}>About</button>
            <button className={NAV_BTN} onClick = {() => navigate('/contact')}>Contact</button>
            <a href="https://www.instagram.com/theprincetontiger" target="_blank" rel="noopener noreferrer" className="text-black hover:text-pink-500 transition-colors">
            <FaInstagram size={25} />
            </a>
          </div>
          <button onClick={() => setOpen(existing => !existing)} className="ml-auto lg:hidden">
            {open ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden border-t border-gray-200 transition-all duration-300 ease-out ${open ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 items-center"}`}>
          <div className="flex flex-col px-4 py-3 gap-4">
            <button className={NAV_BTN} onClick = {() => go('/news')}>News</button>
            <button className={NAV_BTN} onClick = {() => go('/opinion')}>Opinion</button>
            <button className={NAV_BTN} onClick = {() => go('/archives')}>Archives</button>
            <button className={NAV_BTN} onClick = {() => go('/masthead')}>Masthead</button>
            <button className={NAV_BTN} onClick = {() => go('/about')}>About</button>
            <button className={NAV_BTN} onClick = {() => go('/contact')}>Contact</button>
            <a href="https://www.instagram.com/theprincetontiger" target="_blank" rel="noopener noreferrer" className="self-center text-black hover:text-pink-500 transition-colors">
            <FaInstagram size={22} />
            </a>
          </div>
        </div>
      </nav>
      <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-px mx-auto" />
    </div>
  );
};

export default Navbar;
