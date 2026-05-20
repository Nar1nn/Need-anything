import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { LinktreeProfile, WheelLinkItem, IconType } from '../types';
import { compressProfile, formatWhatsappUrl, formatMailtoUrl } from '../utils/helpers';

interface EditorPanelProps {
  profile: LinktreeProfile;
  onChange: (updated: LinktreeProfile) => void;
  onReset: () => void;
}

const AVAILABLE_ICONS: { name: IconType; label: string }[] = [
  { name: 'User', label: 'About Me (User)' },
  { name: 'Instagram', label: 'Instagram' },
  { name: 'Linkedin', label: 'LinkedIn' },
  { name: 'Briefcase', label: 'Project (Portfolio)' },
  { name: 'MessageSquare', label: 'WhatsApp (Message)' },
  { name: 'Mail', label: 'Gmail (Envelope)' },
  { name: 'Github', label: 'GitHub' },
  { name: 'Music', label: 'Music/Spotify' },
  { name: 'Gamepad', label: 'Gaming/Discord' },
  { name: 'ExternalLink', label: 'Lainnya (Link)' },
];

export default function EditorPanel({ profile, onChange, onReset }: EditorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'presets'>('profile');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  // Quick preset avatars
  const avatarPresets = [
    {
      name: 'Default Caesar (Latest Portrait)',
      url: '/src/assets/images/Caesar.jpg',
    },
    {
      name: 'Professional Male',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    },
    {
      name: 'Elegant Female',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    },
    {
      name: 'Minimalist Abstract',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150&h=150',
    },
  ];

  const handleFieldChange = (field: keyof LinktreeProfile, value: any) => {
    onChange({
      ...profile,
      [field]: value,
    });
  };

  const handleItemChange = (index: number, field: keyof WheelLinkItem, value: any) => {
    const updatedItems = [...profile.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    onChange({
      ...profile,
      items: updatedItems,
    });
  };

  // Build the shareable link base64
  const handleCopyShareLink = () => {
    const base64Str = compressProfile(profile);
    const origin = window.location.origin + window.location.pathname;
    const shareableUrl = `${origin}#data=${base64Str}`;

    navigator.clipboard.writeText(shareableUrl).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 3000);
    }).catch(err => {
      console.error('Failed to copy shareable url', err);
    });
  };

  const getThemeAccentBorder = () => {
    switch (profile.themeColor) {
      case 'emerald': return 'border-emerald-500/80 text-emerald-400';
      case 'ruby': return 'border-red-500/80 text-red-400';
      case 'sapphire': return 'border-blue-500/80 text-blue-400';
      case 'violet': return 'border-violet-500/80 text-violet-400';
      case 'gold':
      default:
        return 'border-amber-500/80 text-amber-400';
    }
  };

  const getThemeAccentBg = () => {
    switch (profile.themeColor) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'ruby': return 'bg-red-600 hover:bg-red-500';
      case 'sapphire': return 'bg-blue-600 hover:bg-blue-500';
      case 'violet': return 'bg-violet-600 hover:bg-violet-500';
      case 'gold':
      default:
        return 'bg-amber-600 hover:bg-amber-500';
    }
  };

  return (
    <>
      {/* Floating Editor Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 py-3 px-4 rounded-full border border-solid font-medium text-sm text-neutral-900 bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 shadow-lg active:scale-95 transition-all focus:outline-none cursor-pointer`}
          style={{ boxShadow: '0 8px 24px rgba(212,175,55,0.3)' }}
        >
          <Icons.Settings className={`animate-spin-slow`} size={18} />
          <span>Atur Linktree</span>
        </button>
      </div>

      {/* Editor Slideway Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex justify-end">
            {/* Backdrop Blur screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Editor Container Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="relative w-full max-w-md h-full flex flex-col bg-[#0f1115] border-l border-[#20242c] shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#20242c] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-neutral-900 border border-amber-500/30">
                    <Icons.Sliders className="text-amber-500 animate-pulse" size={18} />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-white tracking-wide">Konfigurasi Roda</h2>
                    <p className="text-[10px] text-neutral-400">Rancang dan bagikan Linktree interaktifmu</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-950 text-neutral-400 hover:text-white transition-colors border border-neutral-800"
                >
                  <Icons.X size={16} />
                </button>
              </div>

              {/* Sub-navigation tabs */}
              <div className="grid grid-cols-3 border-b border-[#1c1f26] bg-[#0c0e11] px-2 py-1.5 gap-1">
                {(['profile', 'links', 'presets'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 text-[11px] font-medium tracking-wide rounded-lg uppercase transition-all focus:outline-none cursor-pointer ${
                      activeTab === tab
                        ? 'bg-neutral-920 text-amber-400 border border-amber-500/20'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {tab === 'profile' ? 'Profil' : tab === 'links' ? 'Roda Link' : 'Tema & Urut'}
                  </button>
                ))}
              </div>

              {/* Scrollable editor elements container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* 1. PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-5 animate-fade-in">
                    
                    {/* Character Details */}
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest flex items-center space-x-1">
                        <span>Detail Profil Utama</span>
                      </h3>

                      {/* Display name */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400 font-medium">Nama Anda</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          className="w-full bg-[#161a22] border border-neutral-800/80 rounded-[10px] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                          placeholder="Caesar AR"
                        />
                      </div>

                      {/* Bio line */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400 font-medium font-sans">Deskripsi / Bio Ringkas</label>
                        <input
                          type="text"
                          value={profile.bio}
                          onChange={(e) => handleFieldChange('bio', e.target.value)}
                          className="w-full bg-[#161a22] border border-neutral-800/80 rounded-[10px] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                          placeholder="Turning Big Dreams Into Reality"
                        />
                      </div>

                      {/* Main Title ("Pilih Menu") */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400 font-medium">Judul Board Utama</label>
                        <input
                          type="text"
                          value={profile.title}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          className="w-full bg-[#161a22] border border-neutral-800/80 rounded-[10px] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                          placeholder="Pilih Menu"
                        />
                      </div>

                      {/* Subtitle ("Putar dan pilih tujuanmu!") */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400 font-medium">Sub-deskripsi Board</label>
                        <input
                          type="text"
                          value={profile.subtitle}
                          onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                          className="w-full bg-[#161a22] border border-neutral-800/80 rounded-[10px] px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                          placeholder="Putar dan pilih tujuanmu!"
                        />
                      </div>
                    </div>

                    {/* Avatar URL Choice */}
                    <div className="space-y-3 pt-3 border-t border-neutral-900">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest">
                        Foto Profil (Avatar)
                      </h3>

                      {/* Presets images list selector */}
                      <div className="grid grid-cols-4 gap-2.5">
                        {avatarPresets.map((preset) => {
                          const isSelected = profile.avatarUrl === preset.url;
                          return (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => handleFieldChange('avatarUrl', preset.url)}
                              className={`relative aspect-square rounded-[14px] overflow-hidden border-2 bg-neutral-950 transition-all focus:outline-none cursor-pointer ${
                                isSelected ? 'border-amber-500 scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Manual avatar URL Input field */}
                      <div className="space-y-1.5 pt-1.5">
                        <label className="text-[10px] text-neutral-500 font-medium uppercase tracking-wide">
                          Atau Tulis Link Gambar Kustom Anda
                        </label>
                        <input
                          type="url"
                          value={profile.avatarUrl}
                          onChange={(e) => handleFieldChange('avatarUrl', e.target.value)}
                          className="w-full bg-[#161a22] border border-neutral-800/80 rounded-[10px] px-3 py-2 text-xs font-mono text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500/50"
                          placeholder="https://example.com/avatar.png"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. LINKS EDIT TAB (6 segments customizable items) */}
                {activeTab === 'links' && (
                  <div className="space-y-4 animate-fade-in pb-12">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest">
                        Sesuaikan 6 Sektor Roda
                      </h3>
                      <span className="text-[10px] text-amber-500/80 font-mono">Harus Genap 6 Bagian</span>
                    </div>

                    {profile.items.map((item, idx) => {
                      return (
                        <div
                          key={item.id}
                          className="relative p-4 rounded-[16px] bg-[#13161c] border border-neutral-800/80 hover:border-amber-500/25 transition-all space-y-3"
                        >
                          {/* Segment header badge tag */}
                          <div className="flex items-center justify-between border-b border-[#20242e] pb-2">
                            <span className="text-[11px] font-serif font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                              Sektor #{idx + 1}
                            </span>
                          </div>

                          {/* 2.1 Label and Icon inputs */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 space-y-1">
                              <label className="text-[10px] text-neutral-400 font-medium">Label Sektor</label>
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                                className="w-full bg-[#1a1f29] border border-neutral-800 rounded-[8px] px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                                placeholder={`Label ${idx + 1}`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] text-neutral-400 font-medium">Ikon</label>
                              <select
                                value={item.iconName}
                                onChange={(e) => handleItemChange(idx, 'iconName', e.target.value)}
                                className="w-full bg-[#1a1f29] border border-neutral-800 rounded-[8px] px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-amber-500/30"
                              >
                                {AVAILABLE_ICONS.map((it) => (
                                  <option key={it.name} value={it.name}>
                                    {it.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* 2.2 Sub-description field */}
                          <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400 font-medium">Pemerian / Keterangan Sektor</label>
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="w-full bg-[#1a1f29] border border-neutral-800 rounded-[8px] px-2.5 py-1.5 text-xs text-neutral-100 placeholder-neutral-600 focus:outline-none"
                              placeholder="Deskripsi singkat link"
                            />
                          </div>

                          {/* 2.3 URL link location input */}
                          <div className="space-y-1 bg-[#0d0f13] p-2.5 rounded-[10px]">
                            <label className="text-[9px] text-amber-500/70 uppercase font-bold tracking-wide">
                              URL Tujuan / Tautan
                            </label>
                            
                            {/* Check for WhatsApp / Email smart converters helper tips */}
                            {item.iconName === 'MessageSquare' && (
                              <p className="text-[8px] text-neutral-500 leading-tight mb-1">
                                Tips: Masukkan nomor lengkap, misal <b>628123456789</b>
                              </p>
                            )}
                            {item.iconName === 'Mail' && (
                              <p className="text-[8px] text-neutral-500 leading-tight mb-1">
                                Tips: Masukkan email lengkap, misal <b>kamu@email.com</b>
                              </p>
                            )}

                            <input
                              type="text"
                              value={item.url}
                              onChange={(e) => {
                                let val = e.target.value;
                                // Automatically assist formatting for raw numbers/emails depending on current icon selected
                                if (item.iconName === 'MessageSquare' && /^\d+$/.test(val)) {
                                  val = formatWhatsappUrl(val);
                                } else if (item.iconName === 'Mail' && val.includes('@') && !val.startsWith('mailto:')) {
                                  val = formatMailtoUrl(val);
                                }
                                handleItemChange(idx, 'url', val);
                              }}
                              className="w-full bg-[#151921] border border-neutral-800 rounded-[6px] px-2 py-1 text-xs font-mono text-neutral-300 focus:outline-none"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. THEME & ADVANCED CONFIGS TAB */}
                {activeTab === 'presets' && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Visual Styling Aesthetics choices */}
                    <div className="space-y-3.5">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest">
                        Aset Nuansa / Tema Warna
                      </h3>

                      <div className="grid grid-cols-5 gap-2">
                        {([
                          { key: 'gold', name: 'emas', color: 'bg-amber-500 border-amber-300' },
                          { key: 'emerald', name: 'hijau', color: 'bg-emerald-500 border-emerald-300' },
                          { key: 'ruby', name: 'merah', color: 'bg-red-500 border-red-300' },
                          { key: 'sapphire', name: 'biru', color: 'bg-blue-500 border-blue-300' },
                          { key: 'violet', name: 'ungu', color: 'bg-violet-500 border-violet-300' },
                        ] as const).map((col) => {
                          const active = profile.themeColor === col.key;
                          return (
                            <button
                              key={col.key}
                              onClick={() => handleFieldChange('themeColor', col.key)}
                              className={`group p-2.5 rounded-[12px] flex flex-col items-center justify-center space-y-1 transition-all border cursor-pointer ${
                                active ? 'bg-[#181d26] border-amber-500 shadow-md scale-95' : 'bg-neutral-900 border-[#242933] opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full ${col.color}`} />
                              <span className="text-[9px] font-sans font-medium capitalize text-neutral-300">{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Audio system options */}
                    <div className="space-y-3 pt-4 border-t border-[#1c1f26]">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest">
                        Pengaturan Audio Sektor
                      </h3>
                      
                      <div className="flex items-center justify-between p-3.5 rounded-[14px] bg-[#12151a] border border-neutral-900">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1.5 rounded-full ${profile.soundEnabled ? 'bg-amber-500/10 text-amber-400' : 'bg-neutral-900 text-neutral-500'}`}>
                            {profile.soundEnabled ? <Icons.Volume2 size={16} /> : <Icons.VolumeX size={16} />}
                          </div>
                          <div>
                            <span className="text-xs font-medium text-neutral-100 block">Efek Suara Roda</span>
                            <span className="text-[9px] text-neutral-500">Mainkan suara klik ketukan mekanis</span>
                          </div>
                        </div>

                        {/* Slide Toggle box */}
                        <button
                          onClick={() => handleFieldChange('soundEnabled', !profile.soundEnabled)}
                          className={`relative w-12 h-6.5 rounded-full transition-colors cursor-pointer ${
                            profile.soundEnabled ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-[22px] h-[22px] bg-white rounded-full transition-transform ${
                            profile.soundEnabled ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Presets and Defaults operations */}
                    <div className="space-y-3 pt-4 border-t border-[#1c1f26]">
                      <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-widest">
                        Konfigurasi Sistem
                      </h3>

                      <div className="grid grid-cols-2 gap-3.5">
                        {/* Reset profile state */}
                        <button
                          onClick={() => {
                            if (window.confirm('Revert all settings entirely back to Caesar\'s default profile visual layout?')) {
                              onReset();
                            }
                          }}
                          className="py-3 px-4 rounded-[12px] text-center border-neutral-850 hover:bg-neutral-900/60 border border-solid text-xs font-medium text-amber-500/80 transition-colors cursor-pointer active:brightness-95 select-none"
                        >
                          Bersihkan / Reset
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm('Do you want to save this customized configuration structure locally in your browser storage?')) {
                              localStorage.setItem('interactive_wheel_profile', JSON.stringify(profile));
                              alert('Sucessfully saved configuration in localStorage!');
                            }
                          }}
                          className="py-3 px-4 rounded-[12px] text-center bg-neutral-900 hover:bg-neutral-850 text-xs font-medium text-neutral-100 border border-[#232832] transition-colors cursor-pointer active:brightness-95"
                        >
                          Simpan Lokal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer sharing panel generation */}
              <div className="p-4 bg-[#0a0c0e] border-t border-[#1c1f26] space-y-3 select-none">
                <div className="flex flex-col">
                  <span className="text-xs font-serif font-bold text-neutral-100">Bagikan Roda Linktree Anda</span>
                  <span className="text-[9px] text-neutral-500">Salin link shareable self-contained di bawah</span>
                </div>

                {/* Action CTA link copy */}
                <button
                  onClick={handleCopyShareLink}
                  className={`w-full py-3.5 px-4 rounded-[12px] bg-gradient-to-r text-center font-bold text-xs text-white transition-all flex items-center justify-center space-x-2 ${getThemeAccentBg()}`}
                  style={{ textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}
                >
                  {copyStatus === 'copied' ? (
                    <>
                      <Icons.CheckCheck size={16} />
                      <span>Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Icons.Share2 size={16} />
                      <span>Salin Link Shareable</span>
                    </>
                  )}
                </button>

                {copyStatus === 'copied' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center"
                  >
                    <span className="text-[10px] text-amber-400 font-sans block leading-tight">
                      Link tersalin ke clipboard! Siapapun yang mengunjungi link ini akan melihat roda interaktif rancangan Anda secara instan.
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
