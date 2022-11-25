import React from 'react'
import { observer } from "mobx-react-lite"
import ProductItem from "./ProductItem";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
SwiperCore.use([Navigation, Pagination]);

const RecommendList = observer(({ list }) => {
    if (list) {
        return (
            <Swiper
                className="swiper-6 mb-3 mt-4"
                slidesPerView={1}
                spaceBetween={4}
                breakpoints={{
                    767: {
                        slidesPerView: 3,
                        spaceBetween: 16,
                    },
                    992: {
                        slidesPerView: 4,
                        spaceBetween: 16,
                    }
                }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
            >
                {
                    list.map((item, i) => (
                        <SwiperSlide>
                            <ProductItem key={i} product={item} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        )
    } else {
        return false
    }
})

export default RecommendList
