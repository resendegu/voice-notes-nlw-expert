import { useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/NewNoteCard';
import { NoteCard } from './components/NoteCard';

interface Note {
  id: number
  date: Date
  content: string
}

function App() {
  const [search, setSearch] = useState('' as string)
  const [notes, setNotes] = useState<Note[]>(() => {
    
    const notesOnLocalStorage = localStorage.getItem('notes')

    if (notesOnLocalStorage) {
      return JSON.parse(notesOnLocalStorage)
    }
    
    return []
  })

  const onNoteCreated = (content: string) => {
    const newNote = {
        id: crypto.randomUUID(),
        date: new Date(),
        content
    }

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const onNoteDeleted = (id: number) => {
    const notesArray = notes.filter(note => note.id !== id)

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes

  return (
    <div className='mx max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt="NLW Expert" />

      <form className='w-full'>
        <input 
          type="text" 
          placeholder='Busque em suas notas'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
           onChange={handleSearch}
        />
      </form>
      
      <div className='h-px bg-slate-700'/>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        })}
      </div>
    </div>
    
  )
}

export { App }
