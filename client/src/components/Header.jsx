import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'


const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { currentUser } = useSelector(state => state.user)

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    return (
        <header className='bg-slate-400 shadow-md '>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
                <Link to={'/'}>
                    <h1 className='font-bold text-sm sm:text-2xl flex flex-wrap'>
                        <span className='text-slate-500'>House</span>
                        <span className='text-slate-700'>Hunter</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-2 rounded-full flex items-center ' >
                    <input
                        type="text"
                        placeholder='Search...'
                        className='bg-transparent outline-none w-24 sm:w-64 '
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <FaSearch className='text-slate-600 cursor-pointer' />
                    </button>

                </form>
                <ul className='flex gap-6 text-lg font-semibold'>
                    <Link to={"/"}>
                        <li className='hidden sm:inline text-slate-700 cursor-pointer'>Home</li>
                    </Link>
                    <Link to={"/about"}>
                        <li className='hidden sm:inline text-slate-700 cursor-pointer'>About</li>
                    </Link>

                    <Link to={"/profile"}>

                        {currentUser ? (
                            <img className='w-7 h-7 rounded-full object-cover' src={currentUser.avatar} alt="profile" />
                        ) : (
                            <li className='text-slate-700 cursor-pointer'>Sign in</li>
                        )}

                    </Link>
                </ul>
            </div>

        </header >
    )
}

export default Header
