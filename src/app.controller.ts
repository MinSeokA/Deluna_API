import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Result } from './utils/result';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<Result<string>> {
    return this.appService.getHello();
  }
}
