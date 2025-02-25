import React, { useEffect, useState } from 'react'
import { Button, Navbar, NavbarToggle, TextInput, Avatar, Dropdown, DropdownHeader, DropdownItem } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signOutSuccess } from '../redux/user/userSlice'


export default function Header() {
    const path = useLocation().pathname
    const location = useLocation()
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    const { theme } = useSelector((state) => state.theme)
    const [searchTerm, setSearchTerm] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signOutSuccess())
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <Navbar className='border-b-2'>
            {/* Below is a link to the portfolio when it deploys. */}
            {/* <Link to="/link-to-portfolio" className='text-small sm:text-xl font-semibold dark:text-white'>Back to Portfolio</Link> */}
            <Link to="/" className='text-small sm:text-xl font-semibold dark:text-white'>
            <div className="flex space-x-2">
                <Avatar img="/images/blogicon.jpg" size="md"/>
                <span className='px-0 py-1'>Kevin's Blog</span>
            </div>
            </Link>
        <form action="" onSubmit={handleSubmit}>
            <TextInput type='text' placeholder='Search...' rightIcon={AiOutlineSearch} className='hidden lg:inline' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() =>dispatch(toggleTheme())}>
                {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
            {currentUser ? (
                <Dropdown className='' arrowIcon={false} inline label={<Avatar alt='usericon' img={currentUser.profilePicture} rounded/>}>
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                    <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
                </Dropdown>
            ): 
            (
            <Link to='/sign-in'>
            <Button gradientMonochrome="cyan" outline>
                Sign In
            </Button>
            </Link>
            )}
            <NavbarToggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link active={path === "/"} as={'div'}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as={'div'}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as={'div'}>
                <Link to='/projects'>
                    Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
