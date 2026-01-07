import './Navbar.css'
import Tiger from '../assets/Tiger.png'
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle } from "../auth"; 


const Navbar = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return unsub;
  }, []);

  return (
    <div>
    <nav className="navbar">
    <div className = "navbar-inner">

      <div className="navbar-logo">
        <img src={Tiger} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-links">
        <button>News</button>
        <button>Opinion</button>
        <button>Archives</button>
        <button>Masthead</button>
        <button>About</button>
      </div>
    </div>
    </nav>
    <hr></hr>
    </div>
  )
}

export default Navbar
