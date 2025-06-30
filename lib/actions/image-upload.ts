"use server";

export async function getCloudflareUploadUrl() {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    console.log("Cloudflare upload URL response:", data);
    return data;
  } catch (error) {
    console.error("Cloudflare URL 가져오기 실패:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return {
      success: false,
      error: "이미지 업로드 URL을 가져오는데 실패했습니다.",
    };
  }
}

export async function uploadImageToCloudflare(imageFile: File) {
  try {
    const uploadFormData = new FormData();
    uploadFormData.append("file", imageFile);

    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        body: uploadFormData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const uploadResult = await uploadResponse.json();
    return { success: true, imageUrl: uploadResult.result.variants[0] };
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    return { success: false, error: "이미지 업로드에 실패했습니다." };
  }
}
