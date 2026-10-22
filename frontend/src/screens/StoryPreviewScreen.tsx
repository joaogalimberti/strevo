import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import {
  ChevronLeft, Download, Share2, Check
} from 'lucide-react';
import './StoryPreviewScreen.css';

const LUXURY_THEMES = [
  { id: 'obsidian', label: 'Obsidian Black', accent: '#e8c887', bg: '#08080a', text: '#f5f5f7' },
  { id: 'titanium', label: 'Titanium Slate', accent: '#ffffff', bg: '#16161c', text: '#ffffff' },
  { id: 'ember', label: 'Dark Terracotta', accent: '#e25c38', bg: '#0f0c0b', text: '#f5f5f7' },
];

export default function StoryPreviewScreen() {
  const { activeStoryData, user, streak, setView } = useStore();
  const [selectedTheme, setSelectedTheme] = useState('obsidian');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const story = activeStoryData || {
    workoutId: 'demo-w',
    type: 'Upper Body Power',
    duration: 3600,
    calories: 460,
    date: new Date().toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    streak: streak || 7,
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1080;
    const h = 1920;
    canvas.width = w;
    canvas.height = h;

    const currentTheme = LUXURY_THEMES.find((t) => t.id === selectedTheme) || LUXURY_THEMES[0];

    const drawContent = () => {
      // 1. Background
      if (story.photoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = story.photoUrl;
        img.onload = () => {
          const scale = Math.max(w / img.width, h / img.height);
          const x = (w / 2) - (img.width / 2) * scale;
          const y = (h / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          // Elegant dark film grain & luxury vignette overlay
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, 'rgba(8, 8, 10, 0.88)');
          grad.addColorStop(0.35, 'rgba(8, 8, 10, 0.45)');
          grad.addColorStop(0.7, 'rgba(8, 8, 10, 0.88)');
          grad.addColorStop(1, 'rgba(8, 8, 10, 0.98)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          drawTypography(ctx, currentTheme, w, h);
        };
        img.onerror = () => {
          drawBaseBg(ctx, currentTheme, w, h);
          drawTypography(ctx, currentTheme, w, h);
        };
      } else {
        drawBaseBg(ctx, currentTheme, w, h);
        drawTypography(ctx, currentTheme, w, h);
      }
    };

    drawContent();
  };

  const drawBaseBg = (ctx: CanvasRenderingContext2D, theme: any, w: number, h: number) => {
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle dark gradient sheen
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };

  const drawTypography = (ctx: CanvasRenderingContext2D, theme: any, w: number, h: number) => {
    // Top Minimalist Wordmark
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '8px';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('STREVO', w / 2, 210);

    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('PERFORMANCE DOSSIER', w / 2, 255);

    // Subtle hairline separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, 290);
    ctx.lineTo(w / 2 + 80, 290);
    ctx.stroke();

    // Center Luxury Glass Card
    const cardW = 900;
    const cardH = 920;
    const cardX = (w - cardW) / 2;
    const cardY = 480;

    ctx.save();
    ctx.fillStyle = 'rgba(20, 20, 26, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 44);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Streak badge in card
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = theme.accent;
    ctx.textAlign = 'center';
    ctx.fillText(`CONSISTENCY PROTOCOL • ${story.streak} DAYS`, w / 2, cardY + 110);

    // Workout Title
    ctx.font = '800 64px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '-1px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(story.type.toUpperCase(), w / 2, cardY + 260);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 90, cardY + 340);
    ctx.lineTo(cardX + cardW - 90, cardY + 340);
    ctx.stroke();

    // Metrics Row
    const durationMin = Math.floor(story.duration / 60);

    // Duration Column
    ctx.font = '700 84px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#f5f5f7';
    ctx.textAlign = 'center';
    ctx.fillText(`${durationMin}`, w / 2 - 210, cardY + 500);

    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('MINUTES', w / 2 - 210, cardY + 545);

    // Calories Column
    ctx.font = '700 84px "Space Grotesk", sans-serif';
    ctx.fillStyle = theme.accent;
    ctx.fillText(`${story.calories || 460}`, w / 2 + 210, cardY + 500);

    ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.letterSpacing = '1.5px';
    ctx.fillText('EXERTION KCAL', w / 2 + 210, cardY + 545);

    // Quote / Manifesto
    ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.letterSpacing = '0.5px';
    ctx.fillText('Uncompromising standard. Every single day.', w / 2, cardY + 740);

    // Footer Athlete Tag
    ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '0.5px';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`@${user?.username || 'athlete'}`, w / 2, 1680);

    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.letterSpacing = '0.8px';
    ctx.fillText(new Date(story.date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
    }).toUpperCase(), w / 2, 1724);
  };

  useEffect(() => {
    renderCanvas();
  }, [selectedTheme, story]);

  const handleDownload = () => {
    setDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `strevo-session-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    setTimeout(() => setDownloading(false), 800);
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share) {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'strevo-story.png', { type: 'image/png' });
        try {
          await navigator.share({
            title: 'STREVO Session',
            text: `Consistent output: ${story.streak} days active on STREVO.`,
            files: [file],
          });
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      handleDownload();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="story-screen scroll-content">
      {/* Header */}
      <div className="story-nav anim-fade-up">
        <button className="icon-btn" onClick={() => setView('home')} title="Back">
          <ChevronLeft size={20} />
        </button>
        <span className="story-nav-title">Editorial Story</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Story Viewport (Luxury Phone Screen Frame) */}
      <div className="story-frame-wrap anim-fade-up" style={{ animationDelay: '0.04s' }}>
        <div className="story-frame">
          <canvas ref={canvasRef} className="story-canvas" />
        </div>
      </div>

      {/* Aesthetic Palette Chooser */}
      <div className="story-options anim-fade-up" style={{ animationDelay: '0.08s' }}>
        <div className="section-label">Atmosphere Theme</div>
        <div className="theme-pills">
          {LUXURY_THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-pill ${selectedTheme === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTheme(t.id)}
            >
              <span className="theme-bullet" style={{ background: t.accent }} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="story-actions anim-fade-up" style={{ animationDelay: '0.12s' }}>
        <button
          className="btn-primary"
          onClick={handleDownload}
          disabled={downloading}
          id="btn-download-story"
        >
          <Download size={17} />
          <span>{downloading ? 'Rendering Image...' : 'Export 1080x1920 Story'}</span>
        </button>

        <button
          className="btn-secondary"
          onClick={handleShare}
          id="btn-share-story"
        >
          {copied ? <Check size={17} /> : <Share2 size={17} />}
          <span>{copied ? 'Story Exported' : 'Share to Instagram / Socials'}</span>
        </button>

        <button
          className="return-overview-link"
          onClick={() => setView('home')}
        >
          Return to Overview
        </button>
      </div>
    </div>
  );
}
