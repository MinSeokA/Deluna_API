import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Giveaway } from './entity/giveaway.entity';
import { CreateGiveawayDto, UpdateGiveawayDto } from './dto/giveaway.dto';
import { Result, success, fail } from '../utils/result'; // Result 인터페이스와 함수들 가져오기

@Injectable()
export class GiveawayService {
  constructor(
    @InjectRepository(Giveaway)
    private readonly giveawayRepository: Repository<Giveaway>,
  ) {}

  async createGiveaway(
    createGiveawayDto: CreateGiveawayDto,
  ): Promise<Result<Giveaway>> {
    const giveaway = this.giveawayRepository.create(createGiveawayDto);
    const savedGiveaway = await this.giveawayRepository.save(giveaway);
    return success('Giveaway created successfully', savedGiveaway);
  }

  async getGiveaways(): Promise<Result<Giveaway[]>> {
    const giveaways = await this.giveawayRepository.find();
    return success('Giveaways fetched successfully', giveaways);
  }

  async getGiveawayById(id: number): Promise<Result<Giveaway>> {
    const giveaway = await this.giveawayRepository.findOne({ where: { id } });
    if (!giveaway) {
      return fail(`Giveaway with ID ${id} not found`);
    }
    return success('Giveaway fetched successfully', giveaway);
  }

  async updateGiveaway(
    id: number,
    updateGiveawayDto: UpdateGiveawayDto,
  ): Promise<Result<Giveaway>> {
    const giveaway = await this.getGiveawayById(id);
    Object.assign(giveaway.data, updateGiveawayDto);
    const updatedGiveaway = await this.giveawayRepository.save(giveaway.data);
    return success('Giveaway updated successfully', updatedGiveaway);
  }

  async deleteGiveaway(id: number): Promise<Result<void>> {
    const result = await this.giveawayRepository.delete(id);
    if (result.affected === 0) {
      return fail(`Giveaway with ID ${id} not found`);
    }
    return success('Giveaway deleted successfully');
  }

  // 참가자 추가 메서드
  async addParticipants(
    giveawayId: number,
    userIds: string[],
  ): Promise<Result<Giveaway>> {
    const giveaway = await this.giveawayRepository.findOne({
      where: { id: giveawayId },
    });

    if (!giveaway) {
      return fail(`Giveaway with ID ${giveawayId} not found`);
    }

    // 이미 등록된 참가자 필터링
    const newParticipants = userIds.filter(
      (userId) => !giveaway.participants.includes(userId),
    );

    if (newParticipants.length === 0) {
      return fail('All users are already registered for this giveaway');
    }

    // 참가자 추가
    giveaway.participants.push(...newParticipants);
    const updatedGiveaway = await this.giveawayRepository.save(giveaway); // 업데이트된 이벤트 저장

    return success('Participants added successfully', updatedGiveaway); // 성공 응답
  }
}
