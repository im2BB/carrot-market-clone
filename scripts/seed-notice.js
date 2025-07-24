const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedNotice() {
  try {
    // 먼저 관리자 사용자가 있는지 확인
    const adminUser = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (!adminUser) {
      console.log("관리자 사용자가 없습니다. 먼저 관리자 계정을 생성해주세요.");
      return;
    }

    // 테스트용 공지사항 생성
    const notice = await prisma.post.create({
      data: {
        title: "테스트 공지사항",
        description:
          "이것은 테스트용 공지사항입니다. 404 에러 문제를 해결하기 위해 생성되었습니다.",
        isNotice: true,
        userId: adminUser.id,
        views: 0,
      },
    });

    console.log("공지사항이 성공적으로 생성되었습니다:", notice);

    // 일반 게시글도 하나 생성
    const post = await prisma.post.create({
      data: {
        title: "테스트 게시글",
        description: "이것은 테스트용 일반 게시글입니다.",
        isNotice: false,
        userId: adminUser.id,
        views: 0,
      },
    });

    console.log("일반 게시글도 성공적으로 생성되었습니다:", post);
  } catch (error) {
    console.error("스크립트 실행 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotice();
