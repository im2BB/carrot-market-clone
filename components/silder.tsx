"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Image from "next/image";

export default function Silder() {
  const slideData = [
    {
      id: 1,
      text: "테스트 테스트1",
    },
    {
      id: 2,
      text: "테스트 테스트2",
    },
    {
      id: 3,
      text: "테스트 테스트3",
    },
    {
      id: 4,
      text: "테스트 테스트4",
    },
    {
      id: 5,
      text: "테스트 테스트5",
    },
  ];
  return (
    <Swiper
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false, // 사용자 상호작용시 슬라이더 일시 정지 비활성
      }}
      spaceBetween={50}
      slidesPerView={1}
    >
      {slideData.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="bg-orange-500 h-64 flex items-center justify-center rounded-md">
            <div>{slide.text}</div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
