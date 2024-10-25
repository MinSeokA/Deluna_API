import { IsNotEmpty, IsString } from 'class-validator';

export class KickDto {
    @IsNotEmpty()
    @IsString()
    moderatorId: string; // 차단하는 사용자 ID

    @IsNotEmpty()
    @IsString()
    userId: string; // 차단될 사용자 ID

    @IsNotEmpty()
    @IsString()
    guildId: string; // 서버 ID

    @IsNotEmpty()
    @IsString()
    reason: string; // 차단 사유
}
