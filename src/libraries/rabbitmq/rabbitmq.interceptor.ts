import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class RabbitMQInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(map((response: { statusCode: number; }) => {
      if (!response || !response.statusCode) return response;
      throw new HttpException(response, response.statusCode);
    }));
  }
}