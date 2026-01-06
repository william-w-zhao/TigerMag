import './Navbar.css'
import Tiger from '../assets/Tiger.png'

const Navbar = () => {
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
