"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";

export default function AddProduct() {
  const [priview, setPreview] = useState("");
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];

    // 이미지 파일인지 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 3MB 이하인지 체크
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      alert("이미지 크기는 3MB를 넘을 수 없습니다.");
      return;
    }

    const url = URL.createObjectURL(file);
    //URL.createObjectURL(file); 업로드한 파일에 대한 URL을 생성
    // 해당 사용 브라우져에 일시적으로 생성 새로고침시 삭제
    setPreview(url);
  };
  return (
    <div>
      <form action={uploadProduct} className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center 
          justify-center flex-col text-neutral-300 border-neutral-300 
          rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${priview})` }}
        >
          {priview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목을 입력해주세요"
          type="text"
        />
        <Input
          name="price"
          required
          placeholder="가격을 입력해주세요"
          type="number"
        />{" "}
        <Input
          name="description"
          required
          placeholder="설명을 입력해주세요"
          type="text"
        />
        <Button text="완료" />
      </form>
    </div>
  );
}
