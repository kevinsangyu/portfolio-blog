import { Footer, Avatar } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function FooterComponent() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className="w-full max-w-7xl mx-auto">
            <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                <div className="mt-5">
                    {/* Icon */}
                    <Link to="/" className='text-lg sm:text-xl font-semibold dark:text-white'>
                        <div className="flex space-x-2">
                        <Avatar img="/images/blogicon.jpg" size="md"/>
                        <span className='px-0 py-1'>Kevin's Blog</span>
                        </div>
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
                    <div>
                        <Footer.Title title='About' />
                        <Footer.LinkGroup col>
                            <Footer.Link href="/about" target='_blank' rel='noopener noreferrer'>
                                About
                            </Footer.Link>
                            <Footer.Link href="/" target='_blank' rel='noopener noreferrer'>
                                Portfolio
                            </Footer.Link>
                            <Footer.Link href="https://linktr.ee/kevinsangyu" target='_blank' rel='noopener noreferrer'>
                                Linktree
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Follow me' />
                        <Footer.LinkGroup col>
                            <Footer.Link href="https://github.com/kevinsangyu" target='_blank' rel='noopener noreferrer'>
                                GitHub
                            </Footer.Link>
                            <Footer.Link href="https://www.instagram.com/kevim3618/" target='_blank' rel='noopener noreferrer'>
                                Instagram
                            </Footer.Link>
                            <Footer.Link href="https://www.linkedin.com/in/kevinsangyu/" target='_blank' rel='noopener noreferrer'>
                                LinkedIn
                            </Footer.Link>
                            <Footer.Link href="mailto:kevin.sang.yu+blog@gmail.com" target='_blank' rel='noopener noreferrer'>
                                Email me
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                    <div>
                        <Footer.Title title='Legal' />
                        <Footer.LinkGroup col>
                            <Footer.Link href="https://github.com/kevinsangyu" target='_blank' rel='noopener noreferrer'>
                                Privacy Policy
                            </Footer.Link>
                            <Footer.Link href="https://www.instagram.com/kevim3618/" target='_blank' rel='noopener noreferrer'>
                                Terms & Conditions
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>
                </div>
            </div>
            <Footer.Divider />
            <div className="">
                <Footer.Copyright href='#' by="Kevin's blog" year={new Date().getFullYear()}/>
            </div>
        </div>
    </Footer>
  )
}
