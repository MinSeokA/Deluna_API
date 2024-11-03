import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GiveawayService } from './giveaway.service';
import { CreateGiveawayDto, GiveawayResponseDto, UpdateGiveawayDto } from './dto/giveaway.dto';
import { Result } from 'src/utils/result';
@Controller('giveaway')
export class GiveawayController {
  constructor(private readonly giveawayService: GiveawayService) {}

  @Post()
  async createGiveaway(
    @Body() createGiveawayDto: CreateGiveawayDto,
  ): Promise<Result<GiveawayResponseDto>> {
    return await this.giveawayService.createGiveaway(createGiveawayDto);
  }

  @Get()
  async getGiveaways(): Promise<Result<GiveawayResponseDto[]>> {
    return await this.giveawayService.getGiveaways();
  }

  @Get(':id')
  async getGiveawayById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Result<GiveawayResponseDto>> {
    return await this.giveawayService.getGiveawayById(id);
  }

  @Put(':id')
  async updateGiveaway(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGiveawayDto: UpdateGiveawayDto,
  ): Promise<Result<GiveawayResponseDto>> {
    return await this.giveawayService.updateGiveaway(id, updateGiveawayDto);
  }

  @Delete(':id')
  async deleteGiveaway(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.giveawayService.deleteGiveaway(id);
  }

// 참가자 추가 API
@Post(':id/register')
@HttpCode(HttpStatus.OK)
async registerParticipant(
    @Param('id', ParseIntPipe) giveawayId: number,
    @Body('participants') participants: string[], // 요청 본문에서 사용자 ID 배열을 받음
) {
    if (!participants || participants.length === 0) {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'No participant ID provided',
        };
    }

    const updatedGiveaway = await this.giveawayService.addParticipants(giveawayId, participants);

    return {
        statusCode: HttpStatus.OK,
        message: 'Participants registered successfully',
        giveaway: updatedGiveaway,
    };
  }
}