import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Shield, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import api from '../services/api';
import { cn } from '../lib/utils';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  const avatars = [
    'https://picsum.photos/seed/user1/200',
    'https://picsum.photos/seed/user2/200',
    'https://picsum.photos/seed/user3/200',
    'https://picsum.photos/seed/user4/200',
    'https://picsum.photos/seed/user5/200',
    'https://picsum.photos/seed/user6/200',
  ];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Operator',
    avatar: user?.avatar || avatars[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/user/profile', formData);
      updateUser(formData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const selectAvatar = (url: string) => {
    setFormData({ ...formData, avatar: url });
    setShowAvatarPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-zinc-500">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="p-8 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0a0a0a] bg-zinc-800">
              <img 
                src={formData.avatar} 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 border-2 border-[#0a0a0a] hover:bg-blue-500 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showAvatarPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 p-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 w-64"
                >
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Select Avatar</p>
                  <div className="grid grid-cols-3 gap-2">
                    {avatars.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => selectAvatar(url)}
                        className={cn(
                          "w-12 h-12 rounded-full overflow-hidden border-2 transition-all",
                          formData.avatar === url ? "border-blue-500 scale-110" : "border-transparent hover:border-white/20"
                        )}
                      >
                        <img src={url} alt="Option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <h3 className="text-xl font-bold mb-1">{formData.name}</h3>
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold mb-4">{formData.role}</p>
          <div className="w-full pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-widest">Status</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-bold uppercase tracking-widest">Joined</span>
              <span className="text-white">Feb 2024</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="md:col-span-2 p-8 rounded-4xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">System Role</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                >
                  <option value="Operator">System Operator</option>
                  <option value="Engineer">Maintenance Engineer</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
