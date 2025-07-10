"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Image from "next/image";
import Link from "next/link";

interface Event {
  id: number;
  title: string;
  image: string;
  link?: string | null;
}

export default function Slider({ events }: { events: Event[] }) {
  // events가 undefined이거나 빈 배열인 경우 처리
  if (!events || events.length === 0) {
    return (
      <div className="rounded-lg overflow-hidden bg-neutral-800 h-64 flex items-center justify-center">
        <p className="text-neutral-400">등록된 이벤트가 없습니다.</p>
      </div>
    );
  }

  const DEFAULT_IMAGE = "/기본사용자.jpg";
  function getSafeImageSrc(src?: string) {
    if (!src || typeof src !== "string" || src.trim() === "")
      return DEFAULT_IMAGE;
    if (src.startsWith("data:image")) return src;
    if (src.startsWith("/")) return src;

    try {
      const url = new URL(src);
      if (
        url.hostname.includes("imagedelivery.net") ||
        url.hostname.includes("cloudflare")
      ) {
        // Cloudflare Images URL이 이미 완전한 형태인지 확인
        if (src.includes("/public")) {
          return src; // 이미 완전한 URL이면 그대로 사용
        }
        // 기존 형식에 width/height 추가
        return `${src}/width=400,height=400`;
      }
      if (url.protocol === "http:" || url.protocol === "https:") return src;
    } catch {
      return DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  }

  return (
    <Swiper
      modules={[Autoplay]}
      loop={true}
      autoplay={{
        delay: 10000,
        disableOnInteraction: false,
      }}
      spaceBetween={0}
      slidesPerView={1}
      className="rounded-lg bg-white overflow-hidden hover:cursor-pointer"
    >
      {events.map((event) => {
        const imgSrc = getSafeImageSrc(event.image);
        return (
          <SwiperSlide key={event.id}>
            <Link href={`/events/${event.id}`}>
              <div className="relative h-64 w-full">
                <Image
                  src={imgSrc}
                  alt={event.title}
                  fill
                  className="object-cover"
                  unoptimized={imgSrc.includes("imagedelivery.net")}
                />
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
