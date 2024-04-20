import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>

        <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>

        <form className='flex flex-col gap-3'>
          <img className='rounded-full w-20 h-2w-20 object-cover cursor-pointer self-center mt-0' src={currentUser.avatar} alt="profile" />
          <input className='border border-black rounded-lg p-3' type="text" id='username' placeholder='username' />
          <input className='border border-black rounded-lg p-3' type="email" id='email' placeholder='email' />
          <input className='border border-black rounded-lg p-3' type="text" id='password' placeholder='password' />
          <button className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
        </form>

        <div className="flex justify-between mt-5">
          <span className="text-red-600 cursor-pointer">Delete Account</span>
          <span className="text-red-600 cursor-pointer">Sign Out</span>
        </div>

      </div>
    </>
  )
}

export default Profile
