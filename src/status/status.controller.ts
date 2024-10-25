import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  constructor() {}

  @Get()
  getStatus() {
    return {
      status: 'ok',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
    };
  }
}
