import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

import { INewNoteCard } from '../../interfaces/components/NewNoteCard'

let speechRecognition: SpeechRecognition | null = null

export const NewNoteCard = ({ onNoteCreated }: INewNoteCard) => {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [content, setContent] = useState('')

    const handleShowEditor = () => setShouldShowOnboarding(false)

    const handleContentChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setContent(value)

        if (value === '') {
            setShouldShowOnboarding(true)
        }
    }

    const handleSaveNote = () => {
        if (content) {
            onNoteCreated(content)

            setContent('')
            setShouldShowOnboarding(true)

            toast.success('Nota criada com sucesso.')
        } else {
            toast.warning('Não há nada a ser salvo.')
        }
    }

    const handleStartRecording = () => {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            toast.warning('Infelizmente seu navegador não suporta a API de gravação!')

            return
        }
        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()
        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true
        speechRecognition.maxAlternatives = 1
        speechRecognition.interimResults = true

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        if (speechRecognition) {
            speechRecognition.stop()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md flex flex-col text-left bg-slate-700 p-5 space-y-3 outline-none hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-400">
                <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
                <p className="text-sm leading-6 text-slate-400">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
                        <X className="size-5" />
                    </Dialog.Close>

                    <form className="flex flex-1 flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-300">Adicionar nota</span>

                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-400">
                                    Comece{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-lime-400 hover:underline"
                                        onClick={handleStartRecording}
                                    >
                                        gravando uma nota
                                    </button>{' '}
                                    em áudio ou se preferir{' '}
                                    <button
                                        type="button"
                                        className="font-medium text-lime-400 hover:underline"
                                        onClick={handleShowEditor}
                                    >
                                        utilize apenas texto
                                    </button>
                                    .
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                    value={content}
                                    onChange={handleContentChanged}
                                />
                            )}
                        </div>
                        {isRecording ? (
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:text-slate-100"
                                onClick={handleStopRecording}
                            >
                                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                Gravando! (clique p/ interromper)
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500"
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
