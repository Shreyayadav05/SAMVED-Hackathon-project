import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Circle, Rect, Text, Group, Arc } from 'react-konva';
import { motion } from 'motion/react';
import { Cpu, Droplets, Zap, Activity } from 'lucide-react';

interface WardData {
  id: number;
  name: string;
  pressure: number;
  flow: number;
  valve_opening: number;
}

interface DigitalTwinProps {
  wards: WardData[];
  leakWardId?: number | null;
}

const DigitalTwin: React.FC<DigitalTwinProps> = ({ wards, leakWardId }) => {
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; wardId: number; progress: number }[]>([]);
  const [leakParticles, setLeakParticles] = useState<{ x: number; y: number; vx: number; vy: number; life: number }[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      setDimensions({ width: clientWidth, height: 400 });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height: 400 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setRotation(prev => (prev + 2) % 360);
      
      setParticles(prev => {
        const newParticles = prev.map(p => ({
          ...p,
          progress: p.progress + 0.01 * (wards.find(w => w.id === p.wardId)?.flow || 10) / 100
        })).filter(p => p.progress < 1);

        // Add new particles
        wards.forEach(ward => {
          if (Math.random() < (ward.flow / 500)) {
            newParticles.push({ x: 0, y: 0, wardId: ward.id, progress: 0 });
          }
        });

        return newParticles;
      });

      // Leak animation
      if (leakWardId) {
        setLeakParticles(prev => {
          const newLeak = [...prev.map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1, // gravity
            life: p.life - 0.02
          })).filter(p => p.life > 0)];

          // Add new leak particles
          for (let i = 0; i < 3; i++) {
            newLeak.push({
              x: 0,
              y: 0,
              vx: (Math.random() - 0.5) * 4,
              vy: -Math.random() * 5,
              life: 1
            });
          }
          return newLeak;
        });
      } else {
        setLeakParticles([]);
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [wards, leakWardId]);

  const centerX = 100;
  const centerY = dimensions.height / 2;
  const wardSpacing = dimensions.height / (wards.length + 1);

  return (
    <div ref={containerRef} className="w-full bg-black/40 rounded-[32px] border border-white/10 overflow-hidden relative">
      <div className="absolute top-6 left-8 z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Digital Twin Simulation</h3>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Real-time Hydraulic Model</p>
        </div>
      </div>

      <div className="absolute top-6 right-8 z-10 flex gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Pump: Active</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Droplets className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Flow: Stable</span>
        </div>
      </div>

      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Main Pump Station */}
          <Group x={centerX} y={centerY}>
            <Circle radius={40} fill="#1a1a1a" stroke="#3b82f6" strokeWidth={2} />
            <Arc
              innerRadius={30}
              outerRadius={35}
              angle={60}
              fill="#3b82f6"
              rotation={rotation}
            />
            <Arc
              innerRadius={30}
              outerRadius={35}
              angle={60}
              fill="#3b82f6"
              rotation={rotation + 120}
            />
            <Arc
              innerRadius={30}
              outerRadius={35}
              angle={60}
              fill="#3b82f6"
              rotation={rotation + 240}
            />
            <Text
              text="MAIN PUMP"
              y={50}
              x={-35}
              fill="#3b82f6"
              fontSize={10}
              fontStyle="bold"
            />
          </Group>

          {/* Main Pipe Line */}
          <Line
            points={[centerX + 40, centerY, centerX + 100, centerY]}
            stroke="#ffffff10"
            strokeWidth={12}
          />

          {/* Ward Distribution Pipes */}
          {wards.map((ward, i) => {
            const wardY = (i + 1) * wardSpacing;
            const wardX = dimensions.width - 150;
            
            return (
              <Group key={ward.id}>
                {/* Vertical Distribution Line */}
                <Line
                  points={[centerX + 100, centerY, centerX + 100, wardY]}
                  stroke="#ffffff10"
                  strokeWidth={8}
                />
                {/* Horizontal Ward Line */}
                <Line
                  points={[centerX + 100, wardY, wardX, wardY]}
                  stroke="#ffffff10"
                  strokeWidth={8}
                />

                {/* Particles */}
                {particles.filter(p => p.wardId === ward.id).map((p, pi) => {
                  let px = centerX + 100;
                  let py = centerY;
                  
                  if (p.progress < 0.3) {
                    // Moving vertically
                    const subProgress = p.progress / 0.3;
                    py = centerY + (wardY - centerY) * subProgress;
                  } else {
                    // Moving horizontally
                    const subProgress = (p.progress - 0.3) / 0.7;
                    py = wardY;
                    px = (centerX + 100) + (wardX - (centerX + 100)) * subProgress;
                  }

                  return (
                    <Circle
                      key={pi}
                      x={px}
                      y={py}
                      radius={2}
                      fill="#3b82f6"
                      opacity={0.6}
                    />
                  );
                })}

                {/* Valve Station */}
                <Group x={wardX - 100} y={wardY}>
                  <Rect
                    width={30}
                    height={20}
                    x={-15}
                    y={-10}
                    fill="#1a1a1a"
                    stroke={ward.valve_opening > 70 ? "#10b981" : ward.valve_opening < 30 ? "#f59e0b" : "#3b82f6"}
                    strokeWidth={1}
                    cornerRadius={4}
                  />
                  <Text
                    text={`${ward.valve_opening}%`}
                    fontSize={8}
                    fill="#ffffff"
                    x={-10}
                    y={-4}
                  />
                  <Text
                    text="VALVE"
                    fontSize={7}
                    fill="#zinc-500"
                    x={-10}
                    y={12}
                    fontStyle="bold"
                  />
                </Group>

                {/* Ward Node */}
                <Group x={wardX} y={wardY}>
                  <Circle
                    radius={25}
                    fill="#1a1a1a"
                    stroke={ward.pressure > 3.5 || leakWardId === ward.id ? "#ef4444" : "#3b82f6"}
                    strokeWidth={2}
                  />
                  
                  {/* Leak Spray Visualization */}
                  {leakWardId === ward.id && (
                    <Group>
                      {leakParticles.map((lp, lpi) => (
                        <Circle
                          key={lpi}
                          x={lp.x}
                          y={lp.y}
                          radius={1.5}
                          fill="#ef4444"
                          opacity={lp.life}
                        />
                      ))}
                    </Group>
                  )}

                  <Text
                    text={ward.name.split('-')[1]?.trim() || ward.name}
                    fontSize={9}
                    fill="#ffffff"
                    x={-20}
                    y={-35}
                    fontStyle="bold"
                  />
                  <Text
                    text={`${ward.pressure} bar`}
                    fontSize={10}
                    fill={ward.pressure > 3.5 ? "#ef4444" : "#3b82f6"}
                    x={-18}
                    y={-5}
                    fontStyle="bold"
                  />
                </Group>
              </Group>
            );
          })}
        </Layer>
      </Stage>

      <div className="absolute bottom-6 left-8 z-10 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pressure Sensor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Flow Meter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Smart Valve</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
