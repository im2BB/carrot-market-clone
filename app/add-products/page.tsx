"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import BackButton from "@/components/back-button";

export default function AddProduct() {
  const [priview, setPreview] = useState("");
  const [uploadUrl, setuploadUrl] = useState("");
  const [photoId, setphotoId] = useState("");
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setuploadUrl(uploadURL);
      setphotoId(id);
    }
  };
  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      return;
    }
    const photoUrl = `https://imagedelivery.net/yaj69MDVrIu8_HJDUNcGIg/${photoId}`;
    formData.set("photo", photoUrl);
    return uploadProduct(_, formData);
  };
  const [state, action] = useActionState(interceptAction, null);
  return (
    <div>
      <form action={action} className="flex flex-col gap-5 p-5">
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
          accept="image/*"
          className="hidden"
        />
        <Input
          name="title"
          required
          placeholder="제목을 입력해주세요"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          required
          placeholder="가격을 입력해주세요"
          type="number"
          errors={state?.fieldErrors.price}
        />{" "}
        <Input
          name="description"
          required
          placeholder="설명을 입력해주세요"
          type="text"
          errors={state?.fieldErrors.description}
        />
        <Button text="저장하기" />
      </form>
      <BackButton />
    </div>
  );
}
