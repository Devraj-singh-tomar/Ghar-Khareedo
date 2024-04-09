import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className='bg-slate-400 shadow-md '>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-2xl flex flex-wrap'>
                        <span className='text-slate-500'>House</span>
                        <span className='text-slate-700'>Hunter</span>
                    </h1>
                </Link>
                <form className='bg-slate-100 p-2 rounded-full flex items-center ' >
                    <input
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent outline-none w-24 sm:w-64 ' />
                    <FaSearch className='text-slate-600 cursor-pointer' />
                </form>
                <ul className='flex gap-6 text-lg font-semibold'>
                    <Link to={"/"}>
                        <li className='hidden sm:inline text-slate-700 cursor-pointer'>Home</li>
                    </Link>
                    <Link to={"about"}>
                        <li className='hidden sm:inline text-slate-700 cursor-pointer'>About</li>
                    </Link>
                    <Link to={"Sign-in"}>
                        <li className='text-slate-700 cursor-pointer'>Sign in</li>
                    </Link>
                </ul>
            </div>

        </header>
    )
}

export default Header
