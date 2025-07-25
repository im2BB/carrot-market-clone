import db from "@/lib/db";

export default async function TestPage() {
  try {
    // 환경 변수 확인
    const ironSecret = process.env.IRON_SECRET;
    const databaseUrl = process.env.DATABASE_URL;

    // 데이터베이스 연결 테스트
    await db.$connect();
    const userCount = await db.user.count();

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">시스템 상태 확인</h1>
        <div className="space-y-4">
          <div>
            <strong>IRON_SECRET:</strong>{" "}
            {ironSecret ? "설정됨" : "설정되지 않음"}
          </div>
          <div>
            <strong>DATABASE_URL:</strong>{" "}
            {databaseUrl ? "설정됨" : "설정되지 않음"}
          </div>
          <div>
            <strong>데이터베이스 연결:</strong> 성공
          </div>
          <div>
            <strong>사용자 수:</strong> {userCount}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">오류 발생</h1>
        <div className="space-y-4">
          <div>
            <strong>IRON_SECRET:</strong>{" "}
            {process.env.IRON_SECRET ? "설정됨" : "설정되지 않음"}
          </div>
          <div>
            <strong>DATABASE_URL:</strong>{" "}
            {process.env.DATABASE_URL ? "설정됨" : "설정되지 않음"}
          </div>
          <div>
            <strong>오류:</strong>{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </div>
        </div>
      </div>
    );
  }
}
