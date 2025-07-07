"use client";

import BackButton from "@/components/back-button";
import { createEvent, getUploadUrl } from "./action";
import { useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/Input";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

export default function AddEventForm() {
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setPhotoId] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [imageSelected, setImageSelected] = useState(false);

  // 오늘 날짜를 YYYY-MM-DDTHH:mm 형식으로 설정
  const today = new Date();
  const todayString = today.toISOString().slice(0, 16);

  // 내일 날짜를 기본 종료일로 설정
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().slice(0, 16);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;

    const file = files[0];
    setImageSelected(true);

    // 이미지 파일 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      setImageSelected(false);
      return;
    }

    // 5MB 크기 제한
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("이미지 크기는 5MB를 넘을 수 없습니다.");
      setImageSelected(false);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setUploadError("");

    try {
      const response = await getUploadUrl();
      console.log("Upload URL response:", response);

      if (response.success) {
        const { id, uploadURL } = response.result;
        setUploadUrl(uploadURL);
        setPhotoId(id);
      } else {
        setUploadError("이미지 업로드 URL을 가져오는데 실패했습니다.");
        setImageSelected(false);
      }
    } catch (error) {
      console.error("Upload URL error:", error);
      setUploadError("이미지 업로드 준비 중 오류가 발생했습니다.");
      setImageSelected(false);
    }
  };

  const interceptAction = async (_: unknown, formData: FormData) => {
    try {
      if (!imageSelected) {
        return { fieldErrors: { image: ["이미지를 선택해주세요."] } };
      }

      const file = formData.get("image");
      if (!file) {
        return { fieldErrors: { image: ["이미지를 선택해주세요."] } };
      }

      if (!uploadUrl || !photoId) {
        return {
          fieldErrors: { image: ["이미지 업로드 URL이 준비되지 않았습니다."] },
        };
      }

      const cloudflareForm = new FormData();
      cloudflareForm.append("file", file);

      console.log("Uploading to Cloudflare...");
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: cloudflareForm,
      });

      if (!uploadResponse.ok) {
        console.error("Cloudflare upload failed:", await uploadResponse.text());
        return { fieldErrors: { image: ["이미지 업로드에 실패했습니다."] } };
      }

      // Cloudflare Images URL 형식 수정
      const imageUrl = `https://imagedelivery.net/yaj69MDVrIu8_HJDUNcGIg/${photoId}/public`;
      formData.set("image", imageUrl);

      console.log("Submitting form with image URL:", imageUrl);
      const result = await createEvent(_, formData);
      console.log("Create event result:", result);
      return result;
    } catch (error) {
      console.error("Form submission error:", error);
      return {
        fieldErrors: { _form: ["이벤트 등록 중 오류가 발생했습니다."] },
      };
    }
  };

  const [state, action] = useFormState(interceptAction, null);

  // 성공 시 리다이렉트 처리
  useEffect(() => {
    if (
      state &&
      "fieldErrors" in state &&
      !state.fieldErrors &&
      "formErrors" in state &&
      !state.formErrors
    ) {
      // 성공적으로 등록되었을 때 프로필 페이지로 이동
      router.push("/profile");
    }
  }, [state, router]);

  const handleSubmit = async (formData: FormData) => {
    if (!imageSelected) {
      setUploadError("이미지를 선택해주세요.");
      return;
    }
    return action(formData);
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <h1 className="text-2xl font-bold">이벤트 등록</h1>
      </div>
      <form action={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="image"
            className={`border-2 aspect-video w-full flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover ${
              !imageSelected && uploadError ? "border-red-500" : ""
            }`}
            style={{ backgroundImage: `url(${preview})` }}
          >
            {!preview && (
              <>
                <PhotoIcon className="w-20" />
                <div className="text-neutral-400 text-sm">
                  이벤트 이미지 추가
                </div>
              </>
            )}
          </label>
          <input
            onChange={onImageChange}
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="hidden"
          />
          {uploadError && (
            <div className="text-red-500 text-sm mt-1">{uploadError}</div>
          )}
          {state && "fieldErrors" in state && state.fieldErrors?.image && (
            <div className="text-red-500 text-sm mt-1">
              {state.fieldErrors.image.join(", ")}
            </div>
          )}
        </div>

        <Input
          name="title"
          required
          placeholder="이벤트 제목을 입력해주세요"
          errors={
            state &&
            "fieldErrors" in state &&
            state.fieldErrors &&
            "title" in state.fieldErrors
              ? state.fieldErrors.title
              : undefined
          }
        />

        <div>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-md bg-neutral-800 border-neutral-700 text-white px-4 py-2 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-700 focus:ring-orange-500 border-none placeholder:text-neutral-400"
            placeholder="이벤트 설명을 입력해주세요"
          />
          {state &&
            "fieldErrors" in state &&
            state.fieldErrors &&
            "description" in state.fieldErrors && (
              <div className="text-red-500 text-sm mt-1">
                {state.fieldErrors.description}
              </div>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="start_date"
            type="datetime-local"
            required
            labelText="시작일"
            defaultValue={todayString}
            errors={
              state &&
              "fieldErrors" in state &&
              state.fieldErrors &&
              "start_date" in state.fieldErrors
                ? state.fieldErrors.start_date
                : undefined
            }
          />
          <Input
            name="end_date"
            type="datetime-local"
            required
            labelText="종료일"
            defaultValue={tomorrowString}
            errors={
              state &&
              "fieldErrors" in state &&
              state.fieldErrors &&
              "end_date" in state.fieldErrors
                ? state.fieldErrors.end_date
                : undefined
            }
          />
        </div>

        <Input
          name="link"
          type="url"
          placeholder="이벤트 링크를 입력해주세요 (선택사항)"
          errors={
            state &&
            "fieldErrors" in state &&
            state.fieldErrors &&
            "link" in state.fieldErrors
              ? state.fieldErrors.link
              : undefined
          }
        />

        {state &&
          "fieldErrors" in state &&
          state.fieldErrors &&
          "_form" in state.fieldErrors && (
            <div className="text-red-500 text-sm mt-1">
              {state.fieldErrors._form}
            </div>
          )}

        <Button
          text={
            state && "pending" in state && state.pending
              ? "등록 중..."
              : "등록하기"
          }
        />
      </form>
    </div>
  );
}
