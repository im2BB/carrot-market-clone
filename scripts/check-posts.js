const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkPosts() {
  try {
    // 모든 게시글 조회
    const allPosts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log("=== 모든 게시글 ===");
    allPosts.forEach((post) => {
      console.log(
        `ID: ${post.id}, 제목: ${post.title}, 공지사항: ${post.isNotice}, 작성자: ${post.user.username} (${post.user.role})`
      );
    });

    // 공지사항만 조회
    const notices = await prisma.post.findMany({
      where: {
        isNotice: true,
      },
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });

    console.log("\n=== 공지사항만 ===");
    notices.forEach((post) => {
      console.log(
        `ID: ${post.id}, 제목: ${post.title}, 작성자: ${post.user.username} (${post.user.role})`
      );
    });

    // 일반 게시글만 조회
    const regularPosts = await prisma.post.findMany({
      where: {
        isNotice: false,
      },
      include: {
        user: {
          select: {
            username: true,
            role: true,
          },
        },
      },
    });

    console.log("\n=== 일반 게시글만 ===");
    regularPosts.forEach((post) => {
      console.log(
        `ID: ${post.id}, 제목: ${post.title}, 작성자: ${post.user.username} (${post.user.role})`
      );
    });
  } catch (error) {
    console.error("스크립트 실행 중 오류 발생:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
