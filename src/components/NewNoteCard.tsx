import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let SpeechRecognition: SpeechRecognition | null = null

const NewNoteCard = ({onNoteCreated}: NewNoteCardProps) => {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true as boolean)
    const [content, setContent] = useState('' as string)
    const [isRecording, setIsRecording] = useState(false as boolean)

    const handleStartEditor = () => {
        setShouldShowOnboarding(false)
    }

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    const handleSaveNote = (event: React.FormEvent) => {
        event.preventDefault()

        if (content === '') {
            return
        }

        onNoteCreated(content)
        setContent('')
        setShouldShowOnboarding(true)

        toast.success('Nota salva com sucesso!')
    }

    const handleStartRecording = () => {
        const isSpeechRecognitionSupported = 'webkitSpeechRecognition' in window
         || 'SpeechRecognition' in window

        if (!isSpeechRecognitionSupported) {
            toast.error('Seu navegador não suporta a funcionalidade de reconhecimento de voz.')
            setIsRecording(false)
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
        SpeechRecognition = new SpeechRecognitionAPI()

        SpeechRecognition.lang = 'pt-BR'
        SpeechRecognition.continuous = true
        SpeechRecognition.maxAlternatives = 1
        SpeechRecognition.interimResults = true

        SpeechRecognition.onresult = (event) => {
            const transcript = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcript)
        }

        SpeechRecognition.onerror = (event) => {
            console.error(event.error)
            setIsRecording(false)
        }

        SpeechRecognition.start()
    }

    const handleStopRecording = () => {
        setIsRecording(false)

        if (SpeechRecognition !== null) {
            SpeechRecognition.stop()
        }
    }
    
    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md flex flex-col text-left bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none'>
            <span className='text-sm font-medium text-slate-200'>Adicionar nota</span>
            <p className='text-sm leading-6 text-slate-400'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
                <Dialog.Content className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none '>
                    <Dialog.Close className='absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5'/>
                    </Dialog.Close>
                    <form className='flex-1 flex flex-col'>
                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300'>
                                Adicionar nota
                            </span>
                            {shouldShowOnboarding ? (
                                <p className='text-sm leading-6 text-slate-400'>
                                Comece&nbsp;
                                <button
                                    type='button'
                                    className='font-medium text-lime-400 hover:underline'
                                    onClick={handleStartRecording}
                                >
                                    gravando uma nota
                                </button> 
                                &nbsp;em áudio ou se preferir&nbsp;
                                <button
                                    type='button'
                                    className='font-medium text-lime-400 hover:underline'
                                    onClick={handleStartEditor}
                                >
                                    utilize apenas texto
                                </button>.
                                </p>
                            ) : (
                                <textarea 
                                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none' 
                                    autoFocus
                                    onChange={handleContentChange}
                                    value={content}
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button 
                                type='button'
                                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100'
                                onClick={handleStopRecording}
                            >
                                <div className='size-3 rounded-full bg-red-500 animate-pulse'/>
                                Gravando (clique para parar)
                            </button>
                        ) : (
                            <button 
                                type='button'
                                className='w-full bg-lime-400 py-4 text-center text-sm text-slate-950 outline-none font-medium hover:bg-lime-500'
                                onClick={handleSaveNote}
                            >
                                Salvar nota
                            </button>
                        )}

                        
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
        
    )
}

export { NewNoteCard }