import React from 'react'
import { AnimatedHamburgerButton } from './AnimatedHamburguerButton'

export const Header = () => {
    return (
        <div className='flex justify-center'>
            <div className="justify-between flex items-center w-[90%] mt-4 mb-4">
                <div className="mb-3.5">
                    master
                </div>
                <div className="">
                    <AnimatedHamburgerButton />
                </div>
            </div>
        </div>
    )
}