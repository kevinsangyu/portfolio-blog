import { TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Button } from 'flowbite-react'

export default function ProjectsQR() {
    const [text, setText] = useState('')
    const [qr, setQr] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')
        try {
            const res = await fetch("/api/qr/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text: text}),
            })
            const data = await res.json()
            setQr(data.qrCode)
        } catch (error) {
            setErrorMessage(error)
        }
    }

    return (
        <div className="p-3 max-w-5xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Convert text to QR code</h1>
            <span>This tool allows you to convert any text into a QR code, which can then be scanned to access. Said text can link to a video, form, image, or anywhere that can be accessed with a link.</span>
            <form className="flex flex-col gap-4 py-5" onSubmit={handleSubmit}>
                <TextInput type='text' placeholder='https://kevincodex.com' required onChange={(e) => {setText(e.target.value)}}/>
                <Button type="submit">
                    Generate QR code
                </Button>
            </form>
            {qr && <><img src={qr} alt='Generated QR Code' className='p-5 mx-auto'/>
            <span>Right click and select 'Save image as...' to download the image.</span></>}
        </div>
    )
}