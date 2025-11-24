import React, { useEffect, useRef } from 'react';
import { RefreshCw, Play, Maximize } from 'lucide-react';

interface SimulationViewportProps {
  isRunning: boolean;
  codeOutput: any[]; // Simulated commands
  resetSimulation: () => void;
}

const SimulationViewport: React.FC<SimulationViewportProps> = ({ isRunning, codeOutput, resetSimulation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotState = useRef({ x: 50, y: 50, angle: 0 }); // Grid coordinates
  const animationFrameId = useRef<number>();

  // Draw the grid and robot
  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Grid Background
    const gridSize = 40;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Obstacles (Simulated)
    ctx.fillStyle = '#334155';
    ctx.fillRect(200, 100, 40, 120);
    ctx.fillRect(350, 250, 120, 40);

    // Draw Robot
    ctx.save();
    ctx.translate(robotState.current.x, robotState.current.y);
    ctx.rotate((robotState.current.angle * Math.PI) / 180);

    // Robot Body
    ctx.fillStyle = '#10b981'; // Emerald 500
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.rect(-15, -15, 30, 30);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Direction Indicator
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-18, -18, 36, 6); // Top
    ctx.fillRect(-18, 12, 36, 6);  // Bottom

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        draw(ctx, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation Loop
    let commandIndex = 0;
    let progress = 0;
    let currentCommand = null;
    let startX = robotState.current.x;
    let startY = robotState.current.y;
    let startAngle = robotState.current.angle;

    const animate = () => {
      if (isRunning && commandIndex < codeOutput.length) {
         currentCommand = codeOutput[commandIndex];
         
         // Simple linear interpolation for movement
         if (progress < 1) {
             progress += 0.05; // Speed
             
             if (currentCommand.type === 'move_forward') {
                 const dist = currentCommand.value;
                 const rad = (startAngle * Math.PI) / 180;
                 robotState.current.x = startX + (Math.cos(rad) * dist * progress);
                 robotState.current.y = startY + (Math.sin(rad) * dist * progress);
             } else if (currentCommand.type === 'turn_right') {
                 robotState.current.angle = startAngle + (currentCommand.value * progress);
             } else if (currentCommand.type === 'turn_left') {
                 robotState.current.angle = startAngle - (currentCommand.value * progress);
             }
         } else {
             // Command finished, setup next
             startX = robotState.current.x;
             startY = robotState.current.y;
             startAngle = robotState.current.angle;
             progress = 0;
             commandIndex++;
         }
      }

      draw(ctx, canvas.width, canvas.height);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRunning, codeOutput]);

  // Reset Logic
  useEffect(() => {
    if (!isRunning && codeOutput.length === 0) {
      robotState.current = { x: 50, y: 50, angle: 0 };
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if(ctx) draw(ctx, canvas.width, canvas.height);
      }
    }
  }, [isRunning, codeOutput]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-xs text-slate-400 font-mono border border-slate-700">
           X: {Math.round(robotState.current.x)} Y: {Math.round(robotState.current.y)}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <button onClick={resetSimulation} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors border border-slate-600">
            <RefreshCw size={18} />
         </button>
      </div>
      
      {/* Overlay when not running */}
      {!isRunning && codeOutput.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-600 px-6 py-3 rounded-xl flex items-center gap-3">
                 <Play className="text-emerald-500 animate-pulse" size={20} />
                 <span className="text-slate-200">الروبوت جاهز للتشغيل</span>
             </div>
          </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SimulationViewport;