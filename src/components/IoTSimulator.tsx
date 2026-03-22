import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, AlertTriangle, Droplets, Play, X, Settings2, RefreshCcw, TrendingUp } from 'lucide-react';
import api from '../services/api';

import { toast } from 'sonner';

const IoTSimulator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const triggerEvent = async (type: string, wardId?: string) => {
    setLoading(type);
    try {
      await api.post('/simulation/trigger', { type, wardId });
      
      if (type === 'LEAK') {
        toast.error('CRITICAL: Major Leak Detected!', {
          description: `AI System has identified a sudden pressure drop in Ward ${wardId}.`,
          duration: 5000,
        });
      } else if (type === 'RANDOMIZE') {
        toast.success('Network State Randomized', {
          description: 'All virtual IoT nodes have updated their telemetry.',
        });
      } else if (type === 'DEMAND_SPIKE') {
        toast.warning('Demand Spike Simulated', {
          description: `High water demand detected in Ward ${wardId}.`,
        });
      } else if (type === 'SENSOR_FAILURE') {
        toast.info('Sensor Failure Simulated', {
          description: `Node P-SENS-${wardId} is now reporting OFFLINE status.`,
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Check your network connection to the virtual gateway.';
      toast.error('Simulation Failed', {
        description: errorMessage,
      });
    } finally {
      setTimeout(() => setLoading(null), 500);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl shadow-blue-500/40 border border-white/20 hover:scale-110 active:scale-95 transition-all group"
      >
        <Settings2 className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 w-80 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest">IoT Simulator</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Visual Schematic Mini-View */}
              <div className="h-24 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-blue-500" />
                  <div className="absolute top-1/2 left-1/4 w-[1px] h-4 bg-blue-500 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-1/2 w-[1px] h-4 bg-blue-500 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-3/4 w-[1px] h-4 bg-blue-500 -translate-y-1/2" />
                </div>
                <div className="relative flex items-center gap-8">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Pump</span>
                  </div>
                  <div className="w-12 h-[2px] bg-blue-500/30 relative">
                    <motion.div 
                      animate={{ x: [0, 48] }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="absolute top-[-1px] left-0 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_5px_#3b82f6]"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                      <Settings2 className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-bold text-zinc-500 uppercase">Valve</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Controls</p>
                <button
                  onClick={() => triggerEvent('RANDOMIZE')}
                  disabled={!!loading}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCcw className={`w-4 h-4 text-blue-400 ${loading === 'RANDOMIZE' ? 'animate-spin' : ''}`} />
                    <span className="text-sm font-bold">Resync IoT Nodes</span>
                  </div>
                  <Play className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Anomaly Injection</p>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => triggerEvent('LEAK', '1')}
                    disabled={!!loading}
                    className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-bold text-red-400">Inject Leak (Ward 1)</span>
                    </div>
                    <Zap className="w-3 h-3 text-red-600" />
                  </button>
                  
                  <button
                    onClick={() => triggerEvent('DEMAND_SPIKE', '2')}
                    disabled={!!loading}
                    className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-amber-400">Demand Spike (Ward 2)</span>
                    </div>
                    <Zap className="w-3 h-3 text-amber-600" />
                  </button>

                  <button
                    onClick={() => triggerEvent('SENSOR_FAILURE', '3')}
                    disabled={!!loading}
                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800 border border-white/5 hover:bg-zinc-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-400">Sensor Offline (Ward 3)</span>
                    </div>
                    <X className="w-3 h-3 text-zinc-600" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Demo Tip</p>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  The <b>Simulation Gateway</b> is the backend engine that manages virtual IoT nodes and telemetry. Inject a leak to see the AI automatically adjust valves.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default IoTSimulator;
