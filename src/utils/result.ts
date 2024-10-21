// result.ts

export interface Result<T> {
  status: boolean;
  message: string;
  data?: T; // data는 선택적입니다.
}

export const success = <T>(message: string, data?: T): Result<T> => {
  return {
    status: true,
    message,
    data,
  };
};

export const fail = (message: string, data?: any): Result<null> => {
  return {
    status: false,
    message,
    data,
  };
};
