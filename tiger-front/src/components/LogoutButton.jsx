import { logout } from "../auth";

const LogoutButton = () => {

  const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.error("Logout failed:", err);
  }}

  return (
    <button type="button" onClick={handleLogout} className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50">Logout</button>
  )
}

export default LogoutButton
