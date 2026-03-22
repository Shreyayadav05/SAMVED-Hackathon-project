import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, Info, Droplets, Activity, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const MapViewer: React.FC = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWards();
    socket.on('sensor_update', (data) => {
      setWards(prev => (Array.isArray(prev) ? prev : []).map(w => 
        w.id === data.ward_id 
          ? { 
              ...w, 
              current_pressure: data.pressure,
              current_flow: data.flow,
              valve_opening: data.valve_opening
            } 
          : w
      ));
    });
    return () => { socket.off('sensor_update'); };
  }, []);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wards');
      setWards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch wards', err);
    } finally {
      setLoading(false);
    }
  };

  const safeWards = Array.isArray(wards) ? wards : [];

  if (loading && safeWards.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Activity className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading GIS Data...</p>
      </div>
    );
  }

  // Simple SVG Map Representation of Solapur Wards
  const renderMap = () => {
    return (
      <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Simulated Ward Shapes */}
        {safeWards.map((ward, i) => {
          let coords = [17.67, 75.91];
          try {
            if (ward.coordinates) coords = JSON.parse(ward.coordinates);
          } catch (e) {
            console.error('Invalid coordinates for ward', ward.id);
          }
          
          // Map lat/lng to SVG space (very rough approximation for demo)
          const x = (coords[1] - 75.9) * 5000 + 400;
          const y = (17.7 - coords[0]) * 5000 + 300;
          
          const pressure = Number(ward.current_pressure || 0);
          const isHigh = pressure > 3.0;
          const isLow = pressure < 1.5;
          const color = isHigh ? '#f87171' : isLow ? '#fbbf24' : '#3b82f6';

          return (
            <g 
              key={ward.id} 
              className="cursor-pointer group"
              onClick={() => setSelectedWard(ward)}
            >
              <circle
                cx={x}
                cy={y}
                r={selectedWard?.id === ward.id ? 40 : 30}
                fill={color}
                fillOpacity={0.2}
                stroke={color}
                strokeWidth={2}
                className="transition-all duration-500"
                filter="url(#glow)"
              />
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={color}
                className="animate-pulse"
              />
              <g className="pointer-events-none">
                <rect
                  x={x + 10}
                  y={y - 15}
                  width={45}
                  height={30}
                  rx={4}
                  fill="#000000"
                  fillOpacity={0.6}
                  stroke={color}
                  strokeWidth={0.5}
                />
                <text
                  x={x + 15}
                  y={y - 2}
                  fill={color}
                  className="text-[8px] font-mono font-bold"
                >
                  {Number(ward.current_pressure || 0).toFixed(1)} bar
                </text>
                <text
                  x={x + 15}
                  y={y + 8}
                  fill="#94a3b8"
                  className="text-[6px] font-mono"
                >
                  {ward.current_flow || 0} m³/h
                </text>
              </g>
              <text
                x={x}
                y={y + 50}
                textAnchor="middle"
                fill="white"
                className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {ward.name}
              </text>
            </g>
          );
        })}

        {/* Connections (Simulated Pipelines) */}
        <path
          d="M400,300 L450,350 L500,320 M400,300 L350,250 L300,280"
          fill="none"
          stroke="white"
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeDasharray="4 4"
        />
      </svg>
    );
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GIS Network Map</h1>
          <p className="text-zinc-500">Interactive pressure heatmap of Solapur Municipal Corporation.</p>
        </div>
        <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs text-zinc-400 font-medium">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-xs text-zinc-400 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-xs text-zinc-400 font-medium">High</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        <div className="lg:col-span-3 bg-black/40 border border-white/5 rounded-[32px] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]" />
          {renderMap()}
          
          {/* Map Controls */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-2">
            <button className="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
              <MapIcon className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {selectedWard ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-1">{selectedWard.name}</h3>
                <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Ward ID: SMC-{selectedWard.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Activity className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-xs text-zinc-500 font-medium">Pressure</p>
                  <p className="text-xl font-mono font-bold">{Number(selectedWard.current_pressure || 0).toFixed(2)} <span className="text-[10px] text-zinc-600">BAR</span></p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <Droplets className="w-5 h-5 text-cyan-400 mb-2" />
                  <p className="text-xs text-zinc-500 font-medium">Population</p>
                  <p className="text-xl font-bold">{(selectedWard.population / 1000).toFixed(1)}k</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Status Report</h4>
                {Math.abs((Number(selectedWard.current_pressure) || 0) - (Number(selectedWard.target_pressure) || 2.5)) > 0.5 ? (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-bold">Network Unstable</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-bold">Network Stable</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => navigate('/dashboard/alerts')}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-sm shadow-lg shadow-blue-600/20"
                >
                  Investigate Now
                </button>
                <button 
                  onClick={() => toast.info('Maintenance Logs', { description: 'Fetching historical maintenance records for ' + selectedWard.name })}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
                >
                  View Maintenance Logs
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-[32px]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <MapIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Ward Selected</h3>
              <p className="text-sm text-zinc-500">Click on a sensor node on the map to view real-time telemetry and ward details.</p>
            </div>
          )}

          {/* Alert Summary */}
          <div className="p-6 rounded-[32px] bg-red-500/5 border border-red-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold">Active Anomalies</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-4">2 wards currently reporting pressure outside optimal range.</p>
            <button 
              onClick={() => navigate('/dashboard/alerts')}
              className="text-xs font-bold text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors"
            >
              Investigate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
