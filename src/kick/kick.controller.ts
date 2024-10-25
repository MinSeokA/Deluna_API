import { Body, Controller, Post } from '@nestjs/common';
import { KickService } from './kick.service';
import { KickDto } from './dto/kick.dto';
import { Result } from 'src/utils/result';
import { KickedUser } from './entity/kick.entity';

@Controller('kick')
export class KickController {
  constructor(
    private readonly kickService: KickService,
  ) {}

  // kick/user
  @Post('user')
  async kickUser(@Body() kickDto: KickDto): Promise<Result<KickedUser>> {
    return this.kickService.kickUser(kickDto);
  }
}
