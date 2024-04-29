import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice.js'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'


const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));

    }

  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async () => {

    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingError(true)
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return
      };

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>

        <h1 className='text-3xl font-semibold text-center my-5'>Profile</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>

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
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
          <input
            className='border border-black rounded-lg p-3'
            type="email"
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
          <input
            className='border border-black rounded-lg p-3'
            type="password"
            id='password'
            placeholder='password'
            onChange={handleChange}
          />
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-2 uppercase hover:opacity-95 disabled:opacity-80'>
            {loading ? 'Loading...' : "update"}
          </button>

          <Link to={"/create-listing"} className='bg-green-700 text-white rounded-lg p-2 uppercase hover:opacity-95 text-center'>
            Create Listing
          </Link>

        </form>

        <div className="flex justify-between mt-5">

          <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-red-600 cursor-pointer">Sign Out</span>

        </div>

        <p className='text-red-500 mt-5'>{error ? error : ""}</p>
        <p className='text-green-500 mt-5'>{updateSuccess ? 'user is updated successfully' : ""}</p>
        <button onClick={handleShowListing} className='text-green-700 w-full'>Show listing</button>

        <p className='text-red-600 mt-5'>
          {showListingError ? " error in showing listing" : ""}
        </p>

        {userListings &&
          userListings.length > 0 &&
          <div className="flex flex-col ">
            <h1 className='text-center text-2xl my-7 font-semibold'>Your Listings</h1>
            {userListings.map((listing) =>
              <div key={listing._id} className="flex justify-between items-center gap-4 border border-black rounded-lg my-4 p-3">
                <Link to={`/listing/${listing._id}`}>
                  <img className='w-16 h-16 object-contain rounded-lg' src={listing.imageUrls[0]} alt="listing cover" />
                </Link>

                <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing._id}`}>
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col items-center'>
                  <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                  <button className='text-green-700 uppercase'>Edit</button>
                </div>

              </div>
            )}
          </div>}
      </div>
    </>
  )
}

export default Profile
