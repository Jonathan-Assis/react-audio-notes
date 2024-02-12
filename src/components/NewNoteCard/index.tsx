import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

export interface INewNoteCard {
    onNoteCreated: (content: string) => void
}

export const NewNoteCard = ({ onNoteCreated }: INewNoteCard) => {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')

    const handleShowEditor = () => setShouldShowOnboarding((prev) => !prev)

    const handleContentChanged = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setContent(value)

        if (value === '') {
            handleShowEditor()
        }
    }

    const handleSaveNote = (event: React.FormEvent) => {
        event.preventDefault()

        onNoteCreated(content)

        setContent('')
        handleShowEditor()

        toast.success('Nota criada com sucesso')
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
                <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
                        <X className="size-5" />
                    </Dialog.Close>

                    <form onSubmit={handleSaveNote} className="flex flex-1 flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-300">Adicionar nota</span>

                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-400">
                                    Comece{' '}
                                    <button className="font-medium text-lime-400 hover:underline">
                                        gravando uma nota
                                    </button>{' '}
                                    em áudio ou se preferir{' '}
                                    <button
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

                        <button
                            type="submit"
                            className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium group hover:bg-lime-500"
                        >
                            Salvar nota
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
