import { logout } from "../auth";

const LogoutButton = () => {

  const handleLogout = async () => {
  try {
    await logout();
  } catch (err) {
    console.error("Logout failed:", err);
  }}

  return (
    <button type="button" onClick={handleLogout}>Logout</button>
  )
}

export default LogoutButton
