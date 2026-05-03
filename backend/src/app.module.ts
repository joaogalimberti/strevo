import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { StoriesModule } from './modules/stories/stories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    WorkoutsModule,
    StreaksModule,
    StoriesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
