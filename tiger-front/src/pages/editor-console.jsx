import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import { signOut } from "../services/auth";
import { posthog } from "../services/posthog";

import ArticleList from "../components/ArticleList"

const EditorConsole = () => {
    const navigate = useNavigate()

    const handleLogout = async () => {
    try {
        posthog.capture("user_logged_out");
        await signOut();
        posthog.reset();
    } catch (err) {
        console.error("Logout failed:", err);
    }}

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold mb-4" >Article Directory</h1>
                <button onClick={() => {navigate("/article-new")}} className="font-semibold hover:underline hover:cursor-pointer">
                    <FontAwesomeIcon className="hover:underline" icon={faPlus} />
                    New Article
                </button>
            </div>
            <ArticleList/>
            <div className="flex justify-end items-center gap-2 mt-4">
                <button onClick={handleLogout} className="font-semibold hover:underline hover:cursor-pointer">
                    Logout
                    <FontAwesomeIcon className="hover:underline" icon={faArrowRightFromBracket}/>
                </button>
            </div>
        </div>
        
    )
}

export default EditorConsole
