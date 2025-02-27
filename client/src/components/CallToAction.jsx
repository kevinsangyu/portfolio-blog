import { Button } from 'flowbite-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CallToAction({ header, body, image, button, button_address}) {
    const navigate = useNavigate()
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-3xl font-semibold'>
                {header}
            </h2>
            <p className='text-gray-500 my-2'>
                {body}
            </p>
            {button && (
                <Button color='blue' onClick={() => navigate(button_address)}>{button}</Button>
            )}
        </div>
        <div className="p-7 flex-1">
            <img src={image} alt='CTA image' />
        </div>
    </div>
  )
}
