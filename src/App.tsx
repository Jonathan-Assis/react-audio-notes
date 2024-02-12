import { useState } from 'react'
import { toast } from 'sonner'

import { NewNoteCard, NoteCard } from './components'
import { INote } from './interfaces/Note'
import logo from './assets/logo-nlw-expert.svg'

export function App() {
    const [search, setSearch] = useState('')
    const [notes, setNotes] = useState<INote[]>(() => {
        const notesOnStorage = localStorage.getItem('notes')

        if (notesOnStorage) {
            return JSON.parse(notesOnStorage)
        }

        return []
    })

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        setSearch(query)
    }

    const filteredNotes =
        search !== ''
            ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
            : notes

    const onNoteCreated = (content: string) => {
        const newNote = {
            id: crypto.randomUUID(),
            date: new Date(),
            content,
        }

        const notesArray = [newNote, ...notes]

        handleSaveNotes(notesArray)
    }

    const handleSaveNotes = (currentNotes: INote[]) => {
        localStorage.setItem('notes', JSON.stringify(currentNotes))
        setNotes(currentNotes)
    }

    const onNoteDeleted = (id: string) => {
        const notesArray = notes.filter((note) => note.id !== id)
        handleSaveNotes(notesArray)
        toast.success('Nota deletada com sucesso.')
    }

    const renderNotes = () => {
        return filteredNotes.map((note) => <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />)
    }

    return (
        <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
            <img src={logo} />
            <form className="w-full">
                <input
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
                    type="text"
                    placeholder="Busque em suas notas..."
                    onChange={handleSearch}
                />
            </form>

            <div className="h-px bg-slate-700" />

            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                <NewNoteCard onNoteCreated={onNoteCreated} />
                {renderNotes()}
            </div>
        </div>
    )
}

