import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async generateStory(userId: string, workoutId: string, style: string, photoBase64?: string) {
    const workout = await this.prisma.workout.findFirst({ where: { id: workoutId, userId }, include: { user: { include: { streak: true } } } });
    if (!workout) throw new NotFoundException('Workout not found');

    const phrases = [
      "Won even without motivation",
      "Consistency beats everything",
      "Another day done",
      "No excuses today",
      "Discipline in action",
      "One day or day one?"
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    // Draw user photo if provided
    let hasPhoto = false;
    if (photoBase64) {
      try {
        const image = await loadImage(`data:image/jpeg;base64,${photoBase64}`);
        
        // cover image (center crop)
        const scale = Math.max(1080 / image.width, 1920 / image.height);
        const x = (1080 / 2) - (image.width / 2) * scale;
        const y = (1920 / 2) - (image.height / 2) * scale;
        
        ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
        
        // dark gradient overlay so text remains legible
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, 'rgba(0,0,0,0.4)');
        grad.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);
        
        hasPhoto = true;
      } catch (e) {
        console.error('Failed to load user photo', e);
      }
    }

    if (!hasPhoto) {
      // Background based on style
      if (style === 'dark minimal') {
        ctx.fillStyle = '#111';
      } else if (style === 'neon fitness') {
        ctx.fillStyle = '#1A0033';
      } else { // clean white
        ctx.fillStyle = '#FFF';
      }
      ctx.fillRect(0, 0, 1080, 1920);

      // Grid lines for premium feel
      ctx.strokeStyle = (style === 'clean white') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 2;
      for(let i = 0; i < 1080; i += 100) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1920); ctx.stroke();
      }
      for(let i = 0; i < 1920; i += 100) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1080, i); ctx.stroke();
      }
    }

    // Text color
    ctx.fillStyle = (style === 'clean white') ? '#111' : '#FFF';
    
    // Logo
    ctx.font = 'bold 80px sans-serif';
    ctx.fillText('STREVO', 100, 200);

    // Phrase
    ctx.fillStyle = (style === 'neon fitness') ? '#00FFCC' : ((style === 'clean white') ? '#111' : '#FFF');
    ctx.font = 'italic 70px sans-serif';
    ctx.fillText(`"${phrase}"`, 100, 400);

    // Workout Details
    ctx.fillStyle = (style === 'clean white') ? '#333' : '#FFF';
    ctx.font = 'bold 120px sans-serif';
    ctx.fillText(workout.type.toUpperCase(), 100, 800);

    ctx.font = '50px sans-serif';
    ctx.fillStyle = (style === 'clean white') ? '#666' : '#CCC';
    
    const date = new Date(workout.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    ctx.fillText(date, 100, 950);
    ctx.fillText(`DURATION • ${Math.floor(workout.duration / 60)} MIN`, 100, 1050);
    
    // Streak Highlight
    ctx.fillStyle = (style === 'neon fitness') ? '#FF007F' : ((style === 'clean white') ? '#FF3366' : '#FF4444');
    ctx.font = 'bold 90px sans-serif';
    ctx.fillText(`🔥 ${workout.user.streak?.currentStreak || 1} DAY STREAK`, 100, 1300);

    // User tag
    ctx.fillStyle = (style === 'clean white') ? '#888' : '#888';
    ctx.font = '40px sans-serif';
    ctx.fillText(`@${workout.user.username}`, 100, 1800);

    const buffer = canvas.toBuffer('image/png');
    
    const publicDir = path.join(__dirname, '..', '..', '..', 'public', 'stories');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const filename = `${workoutId}-${Date.now()}.png`;
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/stories/${filename}`;

    await this.prisma.story.create({
      data: {
        userId,
        workoutId,
        imageUrl
      }
    });

    return { imageUrl };
  }
}
