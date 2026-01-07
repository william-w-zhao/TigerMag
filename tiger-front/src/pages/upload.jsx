import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {useState} from 'react'
import { db } from "../firebaseconfig";
import Navbar from '../components/Navbar'
import ArticlePreview from '../components/ArticlePreview'
import LogoutButton from "../components/LogoutButton";

const Upload = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [section, setSection] = useState('')
    const [image, setImage] = useState('')
    const [status, setStatus] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setStatus("Saving...");

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
        
            setTitle("")
            setDescription("")
            setAuthor("")
            setContent("")
            setSection("")
            setImage("")
            setStatus(`Saved! id: ${docRef.id}`)}

        catch (err) {
            console.error("Firestore addDoc failed:", err);
            setStatus(err?.message || "Could not save")}
    }

    return (
        <div className = "UploadFrame">
            <Navbar></Navbar>
            <h1>Upload Articles</h1>
            <div style={{
                display: "grid",
                gridTemplateColumns: "minmax(420px, 1fr) minmax(0, 1fr)",
                gap: "48px",
                alignItems: "start",
                padding: "24px",}}>
            <form onSubmit={handleSubmit} style={{
                 display: "flex",
                 flexDirection: "column",
                 width: "400px",
                 gap: "8px"
                 }}>
            <label className = "UploadBox">Article Title</label>
            <textarea rows={4} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" style={{ resize: "none" } }/>
            <label className = "UploadBox">Article Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" style={{ resize: "none" }}/>
            <label className = "UploadBox">Article Author</label>
            <textarea rows={2} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author" style={{ resize: "none" }}/>
            <label className = "UploadBox">Article Content</label>
            <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter content" style={{ resize: "none" }}/>
            <label className = "UploadBox">Section (News/Opinion)</label>
            <textarea rows={2} value={section} onChange={(e) => setSection(e.target.value)} placeholder="Enter section" style={{ resize: "none" }}/>
            <label className = "UploadBox">Article Image</label>
            <textarea rows={4} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter image" style={{ resize: "none" }}/>
            <button type="submit">Submit</button>
            {status && <p>{status}</p>}
        </form>
        <ArticlePreview title={title} description={description} author={author} content={content} section={section} image={image}/>
      </div>
      <LogoutButton/>
    </div>
    )
}

export default Upload