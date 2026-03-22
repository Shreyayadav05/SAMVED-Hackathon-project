import React, { useState, useEffect } from 'react';
import { Save, RefreshCcw, Sliders, Database, ShieldAlert, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [wards, setWards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wards');
      setWards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch configuration:', err);
      toast.error('Failed to fetch system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handlePressureChange = (id: number, value: string) => {
    setWards(prev => (Array.isArray(prev) ? prev : []).map(w => w.id === id ? { ...w, target_pressure: parseFloat(value) } : w));
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      await api.put('/system/config', { wards });
      toast.success('System configuration updated', {
        description: 'New target pressures have been synchronized with virtual IoT nodes.'
      });
    } catch (err) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <RefreshCcw className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Change Maker</h1>
          <p className="text-zinc-500">Manually override AI targets and adjust network parameters.</p>
        </div>
        <button
          onClick={saveConfiguration}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {saving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Apply Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ward Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8">
              <Sliders className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold">Target Pressure Overrides</h3>
            </div>
            
            <div className="space-y-6">
              {Array.isArray(wards) && wards.length > 0 ? (
                wards.map((ward) => (
                  <div key={ward.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <p className="font-bold text-lg">{ward.name}</p>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Node: P-SENS-{ward.id}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1 sm:w-48">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.1"
                          value={ward.target_pressure}
                          onChange={(e) => handlePressureChange(ward.id, e.target.value)}
                          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="text-xl font-mono font-bold text-blue-400">{ward.target_pressure.toFixed(1)}</span>
                        <span className="text-[10px] text-zinc-600 font-bold ml-1 uppercase">BAR</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center border border-dashed border-white/10 rounded-2xl">
                  <p className="text-zinc-500">No wards found in system configuration.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Settings */}
        <div className="space-y-8">
          <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Data Retention</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">History Depth</p>
                <select className="w-full bg-transparent border-none outline-none text-sm font-bold">
                  <option>30 Days (Standard)</option>
                  <option>90 Days (Extended)</option>
                  <option>365 Days (Compliance)</option>
                </select>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Sampling Rate</p>
                <select className="w-full bg-transparent border-none outline-none text-sm font-bold">
                  <option>1 Hz (Real-time)</option>
                  <option>0.1 Hz (Balanced)</option>
                  <option>0.01 Hz (Eco Mode)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-amber-500/5 border border-amber-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">Security</h3>
            </div>
            <p className="text-sm text-zinc-400 mb-6">Manual overrides will be logged in the system audit trail for compliance.</p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest">Audit Logging Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
