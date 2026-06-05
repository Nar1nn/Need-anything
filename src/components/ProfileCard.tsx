import { motion } from 'motion/react';
import { LinktreeProfile } from '../types';

interface ProfileCardProps {
  profile: LinktreeProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  // Theme color maps for text style highlights
  const getThemeTextClass = () => {
    switch (profile.themeColor) {
      case 'emerald':
        return 'from-emerald-300 via-emerald-100 to-emerald-400';
      case 'ruby':
        return 'from-red-300 via-red-100 to-red-400';
      case 'sapphire':
        return 'from-blue-300 via-blue-100 to-blue-400';
      case 'violet':
        return 'from-violet-300 via-violet-100 to-violet-400';
      case 'gold':
      default:
        return 'from-amber-200 via-yellow-100 to-amber-400';
    }
  };

  const getThemeRingClass = () => {
    switch (profile.themeColor) {
      case 'emerald':
        return 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
      case 'ruby':
        return 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
      case 'sapphire':
        return 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]';
      case 'violet':
        return 'border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]';
      case 'gold':
      default:
        return 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]';
    }
  };

  const getThemeDividerClass = () => {
    switch (profile.themeColor) {
      case 'emerald':
        return 'bg-emerald-500/40';
      case 'ruby':
        return 'bg-red-500/40';
      case 'sapphire':
        return 'bg-blue-500/40';
      case 'violet':
        return 'bg-violet-500/40';
      case 'gold':
      default:
        return 'bg-amber-500/40';
    }
  };

  const getThemeDiamondClass = () => {
    switch (profile.themeColor) {
      case 'emerald':
        return 'border-emerald-500/80 bg-[#101216]';
      case 'ruby':
        return 'border-red-500/80 bg-[#101216]';
      case 'sapphire':
        return 'border-blue-500/80 bg-[#101216]';
      case 'violet':
        return 'border-violet-500/80 bg-[#101216]';
      case 'gold':
      default:
        return 'border-amber-500/80 bg-[#101216]';
    }
  };

  return (
    <div id="profile-card-header" className="flex flex-col items-center text-center px-4 pt-8 pb-3 select-none">
      {/* Glow Rings around Avatar */}
      <motion.div
        id="profile-avatar-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative group cursor-pointer"
      >
        <div className={`absolute -inset-1 rounded-full blur-md opacity-75 transition duration-500 group-hover:opacity-100 ${
          profile.themeColor === 'gold' ? 'bg-amber-500/20' : 
          profile.themeColor === 'emerald' ? 'bg-emerald-500/20' : 
          profile.themeColor === 'ruby' ? 'bg-red-500/20' : 
          profile.themeColor === 'sapphire' ? 'bg-blue-500/20' : 'bg-violet-500/20'
        }`} />
        <div className={`relative w-28 h-28 rounded-full border-2 overflow-hidden bg-neutral-900 flex items-center justify-center ${getThemeRingClass()}`}>
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Return fallback if fails to load
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(profile.name)}`;
              }}
            />
          ) : (
            <div className="text-3xl font-bold text-amber-500/80">
              {profile.name ? profile.name.charAt(0) : '?'}
            </div>
          )}
        </div>
      </motion.div>

      {/* Name with subtle metal-shine gradient rendering */}
      <motion.h1
        id="profile-name"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className={`mt-4 text-3xl font-semibold tracking-wide bg-gradient-to-r bg-clip-text text-transparent ${getThemeTextClass()} font-serif`}
      >
        {profile.name || "Unnamed"}
      </motion.h1>

      {/* Bio text */}
      <motion.p
        id="profile-bio"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mt-1 text-sm text-neutral-400 font-sans tracking-wide max-w-xs"
      >
        {profile.bio || "No description set"}
      </motion.p>

      {/* Choose Title */}
      <motion.div
        id="profile-title-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="mt-8 flex flex-col items-center"
      >
        <h2 className={`text-3xl tracking-widest font-normal bg-gradient-to-r bg-clip-text text-transparent ${getThemeTextClass()} font-serif uppercase`}>
          {profile.title || "Choose Menu"}
        </h2>
        <p className="mt-1.5 text-xs text-neutral-400 font-sans tracking-widest">
          {profile.subtitle || "Spin and choose your destination!"}
        </p>

        {/* Elegant Gold Diamond Line Connector */}
        <div className="flex items-center justify-center space-x-3 w-40 mt-3.5">
          <div className={`h-[1px] flex-1 ${getThemeDividerClass()}`} />
          <div className={`w-2.5 h-2.5 rotate-45 border border-solid ${getThemeDiamondClass()}`} />
          <div className={`h-[1px] flex-1 ${getThemeDividerClass()}`} />
        </div>
      </motion.div>
    </div>
  );
}
