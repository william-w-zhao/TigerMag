import ArticleList from "../components/ArticleList"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus} from "@fortawesome/free-solid-svg-icons";

const EditorConsole = () => {

    return (
        <div className="flex-col">
            <div className="flex justify-between">
                <h1 className="text-4xl font-bold mb-4" >Article Directory</h1>
                <button className="font-semibold hover:underline">
                    <FontAwesomeIcon className="hover:underline" icon={faPlus} />
                    New Article
                </button>
            </div>
            <ArticleList/>
        </div>
    )



}

export default EditorConsole
