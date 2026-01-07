import Tiger from "../assets/Tiger.png";

const NAV_BTN =
  "bg-transparent border-0 outline-none shadow-none px-4 py-4 font-medium text-[1.2rem] text-black cursor-pointer hover:text-gray-600";


const Navbar = () => {
  return (
    <div>
      <nav className="w-full bg-white">
        <div className="w-full mx-auto flex justify-between items-center">
          <div>
            <img src={Tiger} alt="Logo" className="h-16 w-auto" />
          </div>

          <div className="flex items-center">
            <button className={NAV_BTN}>News</button>
            <button className={NAV_BTN}>Opinion</button>
            <button className={NAV_BTN}>Archives</button>
            <button className={NAV_BTN}>Masthead</button>
            <button className={NAV_BTN}>About</button>
          </div>
        </div>
      </nav>

      <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-px mx-auto" />
    </div>
  );
};

export default Navbar;
