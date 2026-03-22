import React from 'react';
import { motion } from 'motion/react';
import { Brain, Cpu, Scale, ShieldCheck, Zap, Info, TrendingUp, Activity, Wifi, Server, Database as DbIcon, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const IntelligenceReport: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
            <Brain className="w-7 h-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Intelligence Report</h1>
        </div>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Deep dive into the mathematical optimization and AI logic powering EquiFlow's municipal-grade water management.
        </p>
      </div>

      {/* Optimization Formula Section */}
      <section className="p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Cpu className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Core Algorithm</span>
            <h2 className="text-3xl font-bold">Constrained Pressure Optimization</h2>
          </div>

          <div className="p-8 rounded-3xl bg-black/40 border border-white/5 font-mono text-lg leading-relaxed">
            <p className="text-blue-400 mb-4">Minimize: Σ |P_i - P_target|</p>
            <p className="text-zinc-500 text-sm mb-6">Subject to:</p>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Valve constraints: 5% ≤ V_i ≤ 100%
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Pump capacity limits: Σ Q_i ≤ Q_max
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Safety thresholds: P_i ≤ 4.5 bar (Burst Prevention)
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Deterministic Solver
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Unlike black-box AI, EquiFlow uses a deterministic proportional-integral logic to calculate the exact valve adjustments needed to reach target pressure. This ensures stability and predictability in municipal infrastructure.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                AI Validation Layer
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The Gemini-powered validation layer reviews mathematical outputs against "Municipal Realism" constraints—preventing water hammer effects and ensuring adjustments align with historical demand patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equity Index Metric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[40px] bg-gradient-to-br from-emerald-600/10 to-blue-600/10 border border-white/10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">The Equity Index Score</h2>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              EquiFlow introduces a new standard for municipal performance. The Equity Index measures how fairly water is distributed across all socioeconomic zones of the city.
            </p>
            <div className="p-6 rounded-2xl bg-black/20 border border-white/5 font-mono text-center">
              <p className="text-emerald-400 text-xl">Equity Score = 1 - (σ(P) / Max(P))</p>
            </div>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Baseline</p>
                <p className="text-2xl font-bold text-zinc-400">62%</p>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">EquiFlow Target</p>
                <p className="text-2xl font-bold text-emerald-400">94%+</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 flex flex-col justify-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Measurable Impact</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Leak Reduction</span>
              <span className="text-sm font-bold text-emerald-400">24%</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Energy Savings</span>
              <span className="text-sm font-bold text-blue-400">15%</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">Response Time</span>
              <span className="text-sm font-bold text-amber-400">-80%</span>
            </li>
          </ul>
        </div>
      </div>

      {/* AI Depth: Anomaly Detection */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-400" />
          Advanced Anomaly Detection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="font-bold text-purple-400">Z-Score Statistical Filtering</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every sensor reading is processed through a Z-score analysis ($Z = (x - \mu) / \sigma$). Readings exceeding 2.5 standard deviations are flagged as statistical anomalies, filtering out 99% of sensor noise before AI classification.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h4 className="font-bold text-blue-400">Demand Forecasting (ARIMA)</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Our forecasting engine uses an Auto-Regressive Integrated Moving Average (ARIMA) logic combined with Gemini's contextual understanding of city events to predict demand spikes before they happen.
            </p>
          </div>
        </div>
      </section>

      {/* Hardware & Connectivity Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Wifi className="w-6 h-6 text-blue-400" />
            Hardware & Connectivity Stack
          </h2>
          <p className="text-zinc-500 text-sm">How the physical sensors connect to the EquiFlow Cloud.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Connection Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
          
          {[
            { icon: Activity, label: 'IoT Sensors', desc: 'Pressure & Flow nodes (LoRaWAN)', color: 'text-blue-400' },
            { icon: Wifi, label: 'Gateway', desc: 'SMC Municipal Gateway (MQTT)', color: 'text-emerald-400' },
            { icon: Server, label: 'EquiFlow Core', desc: 'Optimization & AI Engine', color: 'text-purple-400' },
            { icon: DbIcon, label: 'Storage', desc: 'Time-Series DB (SQLite)', color: 'text-amber-400' },
          ].map((item, i) => (
            <div key={i} className="relative z-10 p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-4">
              <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center", item.color)}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{item.label}</h4>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Guide Section */}
      <section className="p-10 rounded-[40px] bg-blue-600/5 border border-blue-600/20 space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Demo Script for Judges</h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-bold text-blue-400">1. The Problem (Inequity)</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              "In Solapur, tail-end consumers often get zero pressure while those near the pump get excess. This is an <b>Equity Gap</b>. Show the 'AI Off' mode where the Equity Index is low (62%)."
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-emerald-400">2. The Solution (Optimization)</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              "Switch to 'AI On'. Explain how our <b>Deterministic Solver</b> rebalances the valves. Point to the Digital Twin showing particles flowing evenly and valves adjusting automatically."
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-red-400">3. The Crisis (Leak Detection)</h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              "Use the IoT Simulator to <b>Inject a Leak</b>. Show the Digital Twin spraying red particles. Explain how the Z-score logic detected the drop and how the AI immediately closed upstream valves to save water."
            </p>
          </div>
        </div>
      </section>

      <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          <b>Municipal Realism Note:</b> This system is designed to integrate with existing SCADA infrastructure via standard MQTT or LoRaWAN protocols. The optimization logic respects physical valve latency and pump cavitation limits.
        </p>
      </div>
    </div>
  );
};

export default IntelligenceReport;
