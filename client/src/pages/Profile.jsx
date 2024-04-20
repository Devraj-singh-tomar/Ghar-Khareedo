import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined)
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercent(Math.round(progress));
    },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({
            ...formData, avatar: downloadURL
          })
        );
      },
    );
  };

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>

        <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>

        <form className='flex flex-col gap-3'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className='rounded-full w-20 h-2w-20 object-cover cursor-pointer self-center mt-0'
          />
          <p className='text-center text-sm'>
            {
              fileUploadError ? (
                <span className='text-red-700'>Error while uploading (image must be less than 2 MB)</span>
              ) : filePercent > 0 && filePercent < 100 ? (
                <span className='text-slate-700'>{`Uploading ${filePercent}%`}</span>
              ) : filePercent === 100 ? (
                <span className='text-green-700'>Image uploaded successfully</span>
              ) : (
                ""
              )}
          </p>
          <input
            className='border border-black rounded-lg p-3'
            type="text"
            id='username'
            placeholder='username'
          />
          <input
            className='border border-black rounded-lg p-3'
            type="email"
            id='email'
            placeholder='email'
          />
          <input
            className='border border-black rounded-lg p-3'
            type="text"
            id='password'
            placeholder='password'
          />
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
