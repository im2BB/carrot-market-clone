"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

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
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  return (
    <div>
      <form className="flex flex-col gap-5 p-5">
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
          placeholder="가격격을 입력해주세요"
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
