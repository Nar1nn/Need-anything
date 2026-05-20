import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { WheelLinkItem, LinktreeProfile } from '../types';
import { playTick, playFanfare } from '../utils/audio';

interface WheelProps {
  profile: LinktreeProfile;
  onSelect: (item: WheelLinkItem) => void;
  selectedItem: WheelLinkItem | null;
}

export default function Wheel({ profile, onSelect, selectedItem }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);

  // Update ref to avoid stale closure in animation loops
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  // Handle direct sector clicks
  const handleSectorClick = (index: number) => {
    if (isSpinning) return;

    // Direct selection: we spin the wheel to put this segment at the top (12 o'clock)
    // The center angle for sector index `i` is: i * 60 + 240 degrees
    const centerAngle = index * 60 + 240;
    
    // We want local angle `centerAngle` to point to global 270 degrees (top pointer)
    let targetLocalRotation = (270 - centerAngle) % 360;
    if (targetLocalRotation < 0) {
      targetLocalRotation += 360;
    }
    
    // Keep spin relative to current full rotation to prevent backward snaps
    const currentBase = Math.floor(rotationRef.current / 360) * 360;
    let targetRot = currentBase + targetLocalRotation;
    if (targetRot < rotationRef.current) {
      targetRot += 360;
    }

    if (profile.soundEnabled) {
      playTick(0.25, 550);
    }

    setIsSpinning(true);
    animateToAngle(targetRot, () => {
      setIsSpinning(false);
      onSelect(profile.items[index]);
      if (profile.soundEnabled) {
        playFanfare(0.25);
      }
    });
  };

  // Perform smooth deceleration animation using JS requestAnimationFrame for clean tick sound triggering
  const animateToAngle = (targetAngle: number, callback: () => void) => {
    const startAngle = rotationRef.current;
    const duration = 2400; // ms
    const startTime = performance.now();
    let lastTickBoundary = Math.floor(startAngle / 60);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Dynamic cubic bezier easeOutExpo deceleration formula
      // f(t) = 1 - 2^(-10t)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentAngle = startAngle + (targetAngle - startAngle) * easeOut;
      
      setRotation(currentAngle);

      // Track sector crossings for physical mechanical sound effects
      const currentTickBoundary = Math.floor(currentAngle / 60);
      if (currentTickBoundary !== lastTickBoundary) {
        if (profile.soundEnabled) {
          // Pitch drops slightly as the wheel slows down (adds physics flavor!)
          const speedFactor = 1 - easeOut;
          const tickPitch = 300 + speedFactor * 350;
          playTick(0.18, tickPitch);
        }
        lastTickBoundary = currentTickBoundary;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        callback();
      }
    };

    requestAnimationFrame(step);
  };

  // Dynamic Spin Button
  const handleSpinGo = () => {
    if (isSpinning) return;

    // Pick a random segment
    const randomIndex = Math.floor(Math.random() * profile.items.length);
    
    // Add multiple rotations (5 to 8 full spins) for momentum sensation
    const fullSpins = 5 + Math.floor(Math.random() * 4);
    const centerAngle = randomIndex * 60 + 240;
    let targetLocalRotation = (270 - centerAngle) % 360;
    if (targetLocalRotation < 0) {
      targetLocalRotation += 360;
    }
    
    const targetRot = rotationRef.current + (fullSpins * 360) + targetLocalRotation - (rotationRef.current % 360);

    setIsSpinning(true);
    animateToAngle(targetRot, () => {
      setIsSpinning(false);
      onSelect(profile.items[randomIndex]);
      if (profile.soundEnabled) {
        playFanfare(0.25);
      }
    });
  };

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName: string, active: boolean, accentColor: string) => {
    const IconComp = (Icons as any)[iconName] || Icons.ExternalLink;
    return (
      <IconComp
        size={active ? 28 : 24}
        className={`transition-all duration-300 ${
          active 
            ? 'scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' 
            : 'opacity-85 hover:opacity-100 hover:scale-105'
        }`}
        style={{ color: active ? accentColor : '#facc15' }}
      />
    );
  };

  const getThemeAccentColor = () => {
    switch (profile.themeColor) {
      case 'emerald': return '#10b981';
      case 'ruby': return '#ef4444';
      case 'sapphire': return '#3b82f6';
      case 'violet': return '#8b5cf6';
      case 'gold':
      default:
        return '#eab308';
    }
  };

  const accentColor = getThemeAccentColor();

  // Draw the SVG Wheel sectors
  return (
    <div id="interactive-wheel-layout" className="relative flex flex-col items-center justify-center py-6 select-none my-4">
      {/* Top Gold Pointer Needle indicator */}
      <div className="absolute top-1 z-30 flex flex-col items-center pointer-events-none">
        <svg width="28" height="28" viewBox="0 0 24 24" className="drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]">
          <path
            d="M12 21L4 5h16z"
            fill="url(#goldGradient)"
            stroke="#101216"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Wheel Ring Wrapper */}
      <div className="relative w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full flex items-center justify-center p-2.5 bg-[#0e1013] border-4 border-[#1c1f24] shadow-[0_15px_45px_rgba(0,0,0,0.85)] group">
        
        {/* Shiny Outer Metal Rim Ring with Gold Screws/rivets */}
        <div 
          className="absolute inset-[2px] rounded-full border border-neutral-800/40 pointer-events-none" 
          style={{ boxShadow: `inset 0 0 15px ${accentColor}1c` }} 
        />
        
        {/* Dotted metallic golden rivets around the frame ring */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1.5 rounded-full border border-amber-600/50 bg-gradient-to-b from-amber-200 to-amber-500 shadow-[0_0_2px_rgba(0,0,0,0.5)] pointer-events-none"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-164px) sm:translateY(-184px)`,
              left: 'calc(50% - 2px)',
              top: 'calc(50% - 3px)',
            }}
          />
        ))}

        {/* Rotating SVG Stage */}
        <div
          id="rotating-svg-canvas"
          className="w-full h-full rounded-full overflow-hidden relative cursor-grab active:cursor-grabbing"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
          >
            <defs>
              {/* Golden metallic gradient definition */}
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b4923e" />
                <stop offset="30%" stopColor="#f3e5ab" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="85%" stopColor="#aa7c11" />
                <stop offset="100%" stopColor="#f3e5ab" />
              </linearGradient>

              {/* Slate gradient for segments backgrounds */}
              <linearGradient id="segmentGrad1" x1="0%" y1="0%" x2="150%" y2="150%">
                <stop offset="0%" stopColor="#15171b" />
                <stop offset="100%" stopColor="#0e0f12" />
              </linearGradient>

              {/* Radial pointer shading gloss */}
              <radialGradient id="ringShadow" cx="50%" cy="50%" r="50%">
                <stop offset="80%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
              </radialGradient>
            </defs>

            {/* Render 6 Segment Sectors */}
            {profile.items.map((item, index) => {
              // Mathematical angles calculation
              const startAngleDeg = index * 60 + 210; // divider lines at 210, 270, 330, 30, 90, 150
              const endAngleDeg = startAngleDeg + 60;
              const startRad = (startAngleDeg * Math.PI) / 180;
              const endRad = (endAngleDeg * Math.PI) / 180;

              // Radius of sectors drawing
              const r = 192;
              const cx = 200;
              const cy = 200;

              // Arc coordinates
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);

              // SVG Path for slice
              const pathData = `
                M ${cx} ${cy}
                L ${x1} ${y1}
                A ${r} ${r} 0 0 1 ${x2} ${y2}
                Z
              `;

              // Check if currently pointed under pointer at 12 o'clock, which has a global top pointer.
              const localAngleCenter = index * 60 - 30;
              // Normalize rotation offset
              const normalizedRot = ((rotation % 360) + 360) % 360;
              const localIndicatorPos = ((270 - normalizedRot) % 360 + 360) % 360;
              
              // Angle bounds for detection
              let isPointed = false;
              const normalizedStart = (startAngleDeg + 360) % 360;
              const normalizedEnd = (endAngleDeg + 360) % 360;
              
              if (normalizedStart > normalizedEnd) {
                isPointed = localIndicatorPos >= normalizedStart || localIndicatorPos < normalizedEnd;
              } else {
                isPointed = localIndicatorPos >= normalizedStart && localIndicatorPos < normalizedEnd;
              }

              const isCurrentSelected = selectedItem?.id === item.id;
              const active = isPointed || isCurrentSelected;

              return (
                <g
                  key={item.id}
                  className="cursor-pointer group"
                  onClick={() => handleSectorClick(index)}
                >
                  {/* Segment Surface background */}
                  <path
                    d={pathData}
                    fill={active ? '#1c1f25' : 'url(#segmentGrad1)'}
                    stroke="rgba(180, 146, 62, 0.18)"
                    strokeWidth="1"
                    className="transition-colors duration-300"
                  />

                  {/* Highlights sector borders */}
                  {active && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2.5"
                      opacity="0.32"
                      className="pointer-events-none"
                    />
                  )}
                </g>
              );
            })}

            {/* Radial glow layer lines (drawn separately over slices to keep divider contrast high) */}
            {[...Array(6)].map((_, i) => {
              const boundaryDeg = i * 60 + 210;
              const rad = (boundaryDeg * Math.PI) / 180;
              const r = 192;
              const tx = 200 + r * Math.cos(rad);
              const ty = 200 + r * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={tx}
                  y2={ty}
                  stroke="#b4923e"
                  strokeWidth="1.2"
                  opacity="0.25"
                />
              );
            })}

            {/* Centered Wheel Inner Gloss boundary Ring */}
            <circle cx="200" cy="200" r="191" fill="none" stroke="url(#goldGradient)" strokeWidth="1.8" />
          </svg>

          {/* Place Interactive Segment Labels and Icons floating directly over the Canvas (keeps text un-curved and fully readable) */}
          {profile.items.map((item, index) => {
            // Sector center angle
            const centerAngleDeg = index * 60 + 240;
            const centerRad = (centerAngleDeg * Math.PI) / 180;
            
            // Layout placement coordinates (centroid offset relative to container center)
            const labelRadius = 115; // float distance from center

            // Angle of item label rotation (so labels are always horizontally easily readable, we don't rotate label wrappers much!)
            // However, to make it feel extremely aligned, we can keep tags completely upright. Let's keep them completely upright! It is 10x easier to read.
            const isCurrentSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                className="absolute flex flex-col items-center justify-center text-center w-[100px] h-[100px] pointer-events-none"
                style={{
                  left: `calc(50% + ${labelRadius * Math.cos(centerRad)}px)`,
                  top: `calc(50% + ${labelRadius * Math.sin(centerRad)}px)`,
                  // Cancel the wheel's rotation on the labels to keep them upright and perfectly legible regardless of rotations!
                  // This is a premium design trick: user's text remains un-inverted and completely legible!
                  transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                  transition: isSpinning ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                }}
              >
                {/* Dynamically Styled Icon based on highlight status */}
                <div className="mb-1 flex items-center justify-center">
                  {renderIcon(item.iconName, isCurrentSelected, accentColor)}
                </div>

                {/* Index & Section Label */}
                <span className={`text-[11px] font-sans font-medium tracking-tight whitespace-nowrap ${
                  isCurrentSelected ? 'text-white scale-105 font-semibold' : 'text-neutral-200'
                }`}>
                  {item.label}
                </span>

                {/* Micro Subtitle Description (Responsive Hide for smaller viewports) */}
                <span className="hidden sm:inline-block text-[8px] opacity-60 text-neutral-400 whitespace-nowrap scale-90 w-24 overflow-hidden truncate">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* Satisfying Double-Concentric Gold Core GO SPIN Button */}
        {/* ======================================================== */}
        <div className="absolute z-20 w-24 h-24 sm:w-26 sm:h-26 rounded-full flex items-center justify-center">
          {/* Outer Gold Button Outer Rim Ring */}
          <div 
            className={`absolute inset-0 rounded-full border border-double p-0.5 shadow-2xl transition-all duration-300 ${
              isSpinning 
                ? 'scale-95' 
                : 'hover:scale-105 active:scale-95 border-amber-500/70'
            }`}
            style={{
              background: 'radial-gradient(circle, #21252d 0%, #0d0f11 100%)',
              borderColor: accentColor,
              boxShadow: `0 4px 20px rgba(0,0,0,0.65), inset 0 0 10px ${accentColor}30`,
            }}
          >
            {/* Inner Shiny Gold Bezel Ring */}
            <button
              onClick={handleSpinGo}
              disabled={isSpinning}
              className="w-full h-full rounded-full flex flex-col items-center justify-center relative cursor-pointer active:brightness-95 group focus:outline-none"
            >
              <div 
                className="absolute inset-2.5 rounded-full border border-solid transition-all duration-300 group-hover:opacity-90"
                style={{
                  borderColor: `${accentColor}aa`,
                  background: 'linear-gradient(135deg, #2a2e37 0%, #15171c 100%)',
                }}
              />
              
              {/* GO Label with luxurious font style */}
              <span className={`font-serif text-lg tracking-widest font-bold z-10 transition-transform duration-300 ${
                isSpinning ? 'scale-90 text-neutral-500' : 'text-transparent bg-gradient-to-b bg-clip-text group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
              }`}
                style={{
                  backgroundImage: isSpinning 
                    ? 'none' 
                    : `linear-gradient(to bottom, #fff 0%, ${accentColor} 80%, #aaa 100%)`
                }}
              >
                GO
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
