import React, { useEffect, useRef } from 'react';
import { VoiceState } from '../../voice/VoiceTypes';

interface VoiceWaveformProps {
  state: VoiceState;
  audioLevel?: number; // 0.0 - 1.0
  height?: number;
  width?: number;
  className?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  state,
  audioLevel = 0,
  height = 40,
  width = 240,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const midY = height / 2;
      const barCount = 28;
      const barWidth = 3;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      if (state === 'LISTENING') {
        // Audio-reactive bars
        const amp = Math.max(0.15, audioLevel * 1.8);

        for (let i = 0; i < barCount; i++) {
          const norm = i / (barCount - 1);
          const bell = Math.sin(norm * Math.PI);
          const wave = Math.sin(phase * 4 + i * 0.45);
          const barHeight = Math.max(3, bell * (height * 0.8) * amp * (0.6 + 0.4 * wave));

          const x = i * (barWidth + gap);
          const y = midY - barHeight / 2;

          const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          grad.addColorStop(0, '#18C8C8');
          grad.addColorStop(1, '#4FA8FF');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
          ctx.fill();
        }
      } else if (state === 'SPEAKING') {
        // Smooth sine wave pulses
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, '#27C98A');
        grad.addColorStop(0.5, '#18C8C8');
        grad.addColorStop(1, '#9B7CFF');
        ctx.strokeStyle = grad;

        for (let x = 0; x <= width; x += 3) {
          const norm = x / width;
          const envelope = Math.sin(norm * Math.PI);
          const y = midY + Math.sin(norm * 14 + phase * 6) * (height * 0.35) * envelope;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (state === 'PROCESSING' || state === 'UNDERSTANDING' || state === 'EXECUTING') {
        // Rotating energy beam
        for (let i = 0; i < barCount; i++) {
          const norm = i / barCount;
          const offset = (norm + phase) % 1;
          const h = Math.max(3, Math.sin(offset * Math.PI * 2) * (height * 0.4) + 6);
          const x = i * (barWidth + gap);
          const y = midY - h / 2;

          ctx.fillStyle = '#9B7CFF';
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(x, y, barWidth, h, 2) : ctx.rect(x, y, barWidth, h);
          ctx.fill();
        }
      } else {
        // Idle baseline with gentle ripple
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        for (let x = 0; x <= width; x += 4) {
          const y = midY + Math.sin(x * 0.05 + phase * 1.5) * 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.04;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [state, audioLevel, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`block ${className}`}
    />
  );
};
