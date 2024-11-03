// giveaway.dto.ts

import { IsString, IsInt, IsDate, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateGiveawayDto {
    @IsString()
    @IsNotEmpty()
    guildId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    channelId: string;

    @IsString()
    @IsNotEmpty()
    messageId: string;

    @IsString()
    @IsNotEmpty()
    prize: string;

    @IsInt()
    winnerCount: number;

    @IsDate()
    endDate: Date;
}

export class UpdateGiveawayDto {
    @IsString()
    @IsNotEmpty()
    prize?: string;

    @IsInt()
    winnerCount?: number;

    @IsDate()
    endDate?: Date;

    @IsArray()
    participants?: string[];

    @IsBoolean()
    isEnded?: boolean;
}

export class GiveawayResponseDto {
    id: number;
    guildId: string;
    title: string;
    channelId: string;
    messageId: string;
    prize: string;
    winnerCount: number;
    endDate: Date;
    participants: string[];
    isEnded: boolean;
    createdAt: Date;
    updatedAt: Date;
}
