import { Injectable } from '@nestjs/common';

@Injectable()
export class StatusService {
  constructor() {}

  getStatus() {
    return {
      status: 'ok',
    };
  }

  getHealth() {
    return {
      status: 'ok',
    };
  }
}
