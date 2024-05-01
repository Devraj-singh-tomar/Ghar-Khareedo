import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

// npm i swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'Swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation]);

    const [listing, setListing] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/get/${params.listingId}`)
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false)
                    return;
                }
                setListing(data);
                setError(false);
                setLoading(false);

            } catch (error) {
                setError(true);
                setLoading(false)
            }

        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>something went wrong</p>}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    className="h-[300px]"
                                    style={{
                                        background: `url(${url}) center no-repeat`,
                                        backgroundSize: 'cover',
                                    }}>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}

        </main>
    );
};

export default Listing
