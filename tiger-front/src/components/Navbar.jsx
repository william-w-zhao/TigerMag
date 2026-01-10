
import MarqueeBar from "./StockMarquee"
import Tiger from "../assets/Tiger.png";
import TigerLogoText from "../assets/TigerLogoText.png";
import { useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";

const NAV_BTN =
  "bg-transparent border-0 outline-none shadow-none px-4 font-medium text-[1.2rem] text-black cursor-pointer hover:text-orange-400 transition-colors duration-300";

const Navbar = () => {

  const navigate = useNavigate();

  return (
    <div>
      <MarqueeBar className="pb-2"/>
      <nav className="w-full bg-white">
        <div className="relative w-full flex items-center px-4">
          <div className="flex items-center gap-2">
            <img src={Tiger} alt="Logo" onClick = {() => navigate('/')} className="h-16 w-auto" />
            <button className={NAV_BTN} onClick = {() => navigate('/news')}>News</button>
            <button className={NAV_BTN} onClick = {() => navigate('/opinion')}>Opinion</button>
            <button className={NAV_BTN} onClick = {() => navigate('/archives')}>Archives</button>
          </div>
          <div className = "absolute left-1/2 -translate-x-1/2">
            <img src={TigerLogoText} alt="Logo" onClick = {() => navigate('/')} className="h-16 w-auto" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className={NAV_BTN} onClick = {() => navigate('/masthead')}>Masthead</button>
            <button className={NAV_BTN} onClick = {() => navigate('/about')}>About</button>
            <button className={NAV_BTN} onClick = {() => navigate('/contact')}>Contact</button>
            <a href="https://www.instagram.com/theprincetontiger" target="_blank" rel="noopener noreferrer" className="text-black hover:text-pink-500 transition-colors">
            <FaInstagram size={25} />
            </a>
          </div>
        </div>
      </nav>
      <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-px mx-auto" />
    </div>
  );
};

export default Navbar;
