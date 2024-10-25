import { Injectable } from '@nestjs/common';
import { fail, Result } from './utils/result';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      status: true,
      message: "Not Found",
      data: []
    }
  }
}
