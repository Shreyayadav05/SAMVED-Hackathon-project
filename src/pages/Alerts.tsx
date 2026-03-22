import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Clock, Filter, Search, MoreVertical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { cn } from '../lib/utils';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/alerts');
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setLoading(false);
    }
  };

  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const filteredAlerts = safeAlerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  if (loading && safeAlerts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Clock className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
          <p className="text-zinc-500">Manage and respond to system anomalies and leak detections.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm w-64"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
              filter === t ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center gap-6"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                alert.severity === 'HIGH' ? "bg-red-500/10 text-red-400" : 
                alert.severity === 'MEDIUM' ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
              )}>
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg">{alert.ward_name}</h3>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest",
                    alert.severity === 'HIGH' ? "bg-red-500/20 text-red-400" : 
                    alert.severity === 'MEDIUM' ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                  )}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{alert.description}</p>
              </div>

              <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20 transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Resolve
                  </button>
                  <button className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <MoreVertical className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-zinc-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">All Clear</h3>
            <p className="text-zinc-500">No active alerts found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
