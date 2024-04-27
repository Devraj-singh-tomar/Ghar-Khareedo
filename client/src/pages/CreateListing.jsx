import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const CreateListing = () => {
    const [files, setFiles] = useState({});

    const [formData, setFormData] = useState({
        imageUrls: [],
    });

    const [imageUploadError, setImageUploadError] = useState(false);

    const [uploading, setUploading] = useState(false);
    console.log(formData);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            };
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false)

            }).catch((err) => {
                setImageUploadError('image upload failed (2 mb max per image ');
                setUploading(false)
            })
        } else {
            setImageUploadError('you can only upload 6 images per listing ')
            setUploading(false)
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            )
        })
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1 '>
                    <input
                        className='border p-3 rounded-lg'
                        type="text"
                        placeholder='Name'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                    />
                    <textarea
                        className='border p-3 rounded-lg'
                        type="text"
                        placeholder='Description'
                        id='description'
                        required
                    />
                    <input
                        className='border p-3 rounded-lg'
                        type="text"
                        placeholder='Address'
                        id='address'
                        required
                    />

                    <div className="flex gap-8 flex-wrap">
                        <div className="flex gap-2">
                            <input className='w-5' id='sell' type="checkbox" />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' id='rent' type="checkbox" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' id='parking' type="checkbox" />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' id='furnished' type="checkbox" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input className='w-5' id='offer' type="checkbox" />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8">

                        <div className="flex items-center gap-2">
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required />
                            <p>Bedrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required />
                            <p>Bathrooms</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='1' max='10' required />

                            <div className="flex flex-col items-center">
                                <p>Regular price</p>
                                <span className='text-xs'>(&#8377; / month)</span>
                            </div>
                        </div>


                        <div className="flex items-center gap-2">
                            <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discountPrice' min='1' max='10' required />

                            <div className="flex flex-col items-center">
                                <p>Discount price</p>
                                <span className='text-xs'>(&#8377; / month)</span>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-4 ">
                    <p className='font-semibold '>Images:
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='images/*' multiple />

                        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-md disabled:opacity-80'>{uploading ? 'uploading...' : 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border border-black rounded-lg items-center">
                                <img className='w-20 h-20 object-contain rounded-lg' src={url} alt="listing image" />
                                <button onClick={() => handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase hover: opacity-75'>Delete</button>
                            </div>
                        ))
                    }

                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-75'>Create Listing</button>
                </div>

            </form>

        </main>


    )
}

export default CreateListing
