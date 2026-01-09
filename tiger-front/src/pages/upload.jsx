import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {useState} from 'react'
import { db } from "../firebase/db";
import LogoutButton from "../components/LogoutButton";

const Upload = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [section, setSection] = useState('')
    const [image, setImage] = useState('')
    const [status, setStatus] = useState('')

    // What happens when you press submit
    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault()
        // Print that it is saving
        setStatus("Saving...");

        // Add this document to the collection titles 'articles'
        try {
            const docRef = await addDoc(collection(db, "articles"), {
                title,
                description,
                author,
                content,
                section,
                image,
                createdAt: serverTimestamp(),
            })
        
            // Clear the textarea forms
            setTitle("")
            setDescription("")
            setAuthor("")
            setContent("")
            setSection("")
            setImage("")
            setStatus(`Saved! id: ${docRef.id}`)}
        
        catch (err) { // else print the error that occured
            console.error("Firestore addDoc failed:", err);
            setStatus(err?.message || "Could not save")}
    }

    return (
        <div>
            <h1 className ="text-3xl font-bold">Upload Articles</h1>
            <div className="
            grid
            grid-cols-[minmax(420px,1fr)_minmax(0,1fr)]
            gap-12
            items-start
            p-6
            ">
            <form onSubmit={handleSubmit} className="
                 flex
                 flex-col
                 w-full
                 max-w-100
                 gap-2"
                 >
            <label className = "text-xl font-bold">Upload</label>
            <label className = "text-l">Article Title</label>
            <textarea rows={2} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" style={{ resize: "none" }} className="form-textarea"/>
            <label className = "text-l">Article Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" style={{ resize: "none" }} className="form-textarea"/>
            <label className = "text-l">Article Author</label>
            <textarea rows={2} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author" style={{ resize: "none" }} className="form-textarea"/>
            <label className = "text-l">Article Content</label>
            <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter content" style={{ resize: "none" }} className="form-textarea"/>
            <label className = "text-l">Section (News/Opinion)</label>
            <textarea rows={2} value={section} onChange={(e) => setSection(e.target.value)} placeholder="Enter section" style={{ resize: "none" }} className="form-textarea"/>
            <label className = "text-l">Article Image</label>
            <textarea rows={2} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter image" style={{ resize: "none" }} className="form-textarea"/>
            <button type="submit" className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50">Submit</button>
            {status && <p>{status}</p>}
        </form>
      </div>
      <LogoutButton/>
    </div>
    )
}

export default Upload
