// warn.dto.ts
export default class WarnDto {
  // 경고가 발생한 서버의 ID
  guildId: string;

  // 경고를 받을 사용자 ID
  userId: string;

  // 경고 사유
  reason: string | "사유 없음";

  // 경고를 부여한 관리자 ID
  moderatorId: string;

  // 경고가 부여된 시간 (자동 생성될 수 있음)
  createdAt?: Date;
}
