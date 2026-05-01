import { Module, Global } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from '../../config/env';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: env.JWT.SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
