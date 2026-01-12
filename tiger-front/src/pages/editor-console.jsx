import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"

import ArticleList from "../components/ArticleList"

const EditorConsole = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold mb-4" >Article Directory</h1>
                <button onClick={() => {navigate("/article-new")}} className="font-semibold hover:underline hover:cursor-pointer">
                    <FontAwesomeIcon className="hover:underline " icon={faPlus} />
                    New Article
                </button>
            </div>
            <ArticleList/>
        </div>
    )



}

export default EditorConsole
