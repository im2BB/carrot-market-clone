"use client";

import BackButton from "@/components/back-button";
import Button from "@/components/button";
import Input from "@/components/Input";
import { UserIcon } from "@heroicons/react/24/solid";
import { useFormState } from "react-dom";
import { updateProfile } from "./action";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getSafeAvatarSrc, DEFAULT_AVATAR } from "@/lib/utils";

interface EditProfileProps {
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
}

type ProfileActionResult = {
  error?: string;
  redirect?: string;
};

export default function EditProfileClient({ user }: EditProfileProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar
  );
  const [formError, setFormError] = useState<string | null>(null);

  const currentAvatarSrc = getSafeAvatarSrc(user.avatar);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = (await updateProfile(formData)) as ProfileActionResult;
      if (result.error) {
        setFormError(result.error || null);
      } else if (result.redirect) {
        window.location.href = result.redirect;
      }
    } catch (error) {
      setFormError("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-8">
        <BackButton />
        <span className="text-white font-medium text-lg">프로필 수정</span>
      </div>{" "}
      <form action={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3">
          <label htmlFor="avatar" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center relative overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized={avatarPreview.startsWith("data:image")}
                />
              ) : currentAvatarSrc !== DEFAULT_AVATAR ? (
                <Image
                  src={currentAvatarSrc}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  unoptimized={currentAvatarSrc.includes("imagedelivery.net")}
                />
              ) : (
                <UserIcon className="w-12 h-12 text-gray-600" />
              )}
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <span className="text-sm text-neutral-400">프로필 이미지 변경</span>
        </div>

        {formError && <p className="text-red-500 text-center">{formError}</p>}

        <Input
          name="username"
          labelText="사용자 이름"
          required
          defaultValue={user.username}
        />

        <Input name="password" labelText="새 비밀번호" type="password" />

        <Input
          name="confirmPassword"
          labelText="비밀번호 확인"
          type="password"
        />

        <Button text="수정하기" />
      </form>
    </div>
  );
}
