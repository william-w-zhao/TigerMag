import { addDoc, collection} from "firebase/firestore";
import {useState} from 'react'
import { db } from "../firebaseconfig";
import LogoutButton from "../components/LogoutButton";

const Staff = () => {
    const [title, setTitle] = useState('')
    const [name, setName] = useState('')
    const [year, setYear] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()
        setStatus('Saving...')

        try {
            const deleteDoc = await deleteDoc(collection(db, "staff", "board"))
        }
        catch (err) {
            console.log(err)
            setStatus('Failed to delete old board')
        }

        try { 
            const docRef = await addDoc(collection(db, "staff", "board"), {
            title, 
            name, 
            year, 
            description
        })
        setTitle('')
        setName('')
        setYear('')
        setDescription('')
        setStatus('Saved')
        }

        catch (err){
            console.log(err)
            setStatus('Failed to save new board')
        }
    }

    return (
        <div>
            <h1 className ="text-3xl font-bold">Upload Board</h1>
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
                    <label className = "text-l">Title</label>
                    <textarea rows={2} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" style={{ resize: "none" }} className="form-textarea"/>
                    <label className = "text-l">Name</label>
                    <textarea rows={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" style={{ resize: "none" }} className="form-textarea"/>
                    <label className = "text-l">Class Year</label>
                    <textarea rows={2} value={year} onChange={(e) => setYear(e.target.value)} placeholder="Enter class year" style={{ resize: "none" }} className="form-textarea"/>
                    <label className = "text-l">Description</label>
                    <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" style={{ resize: "none" }} className="form-textarea"/>
                    <button type="submit" className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50">Submit</button>
                </form>
                {status && <p>{status}</p>}
            </div>
            <LogoutButton/>
        </div>
    )
}

export default Staff