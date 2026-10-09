import React from 'react';

interface IconProps {
  isFocused?: boolean;
  className?: string;
}

/**
 * 1. TV AO VIVO (Live TV)
 * Authentic Retro CRT TV with V rabbit-ear antennas, golden tips,
 * glossy curved screen with live broadcast wave & play badge,
 * dual rotary control knobs (channel & volume), speaker grilles, and angled retro feet.
 */
export const LiveTvLauncherIcon: React.FC<IconProps> = ({ isFocused, className = 'w-20 h-20 md:w-24 md:h-24' }) => (
  <div className={`relative ${className} flex items-center justify-center transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}>
    {/* Ambient Glow */}
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-600/50 via-amber-500/40 to-rose-600/50 blur-xl transition-all duration-300 ${
        isFocused ? 'opacity-100 scale-125' : 'opacity-50'
      }`}
    />

    <svg
      viewBox="0 0 100 100"
      className="relative w-full h-full filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.8)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Antennas gradient */}
        <linearGradient id="tvAntennaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* TV Outer Cabinet gradient */}
        <linearGradient id="tvCabinetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2e0f18" />
          <stop offset="50%" stopColor="#1a060d" />
          <stop offset="100%" stopColor="#0d0206" />
        </linearGradient>

        {/* TV Bezel Gold / Red Rim gradient */}
        <linearGradient id="tvBezelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="35%" stopColor="#ea580c" />
          <stop offset="75%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>

        {/* TV Inner Screen gradient */}
        <radialGradient id="tvScreenGrad" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#1c2b3a" />
          <stop offset="60%" stopColor="#0b131c" />
          <stop offset="100%" stopColor="#05080c" />
        </radialGradient>

        {/* Golden Play Badge */}
        <linearGradient id="goldPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Screen Glass Reflection */}
        <linearGradient id="screenGlare" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Retro Antennas (Rabbit Ears) */}
      {/* Center antenna mount */}
      <path
        d="M 44 26 L 56 26 L 53 23 L 47 23 Z"
        fill="url(#tvAntennaGrad)"
        stroke="#78350f"
        strokeWidth="0.8"
      />
      {/* Left Antenna */}
      <line
        x1="47"
        y1="23"
        x2="24"
        y2="5"
        stroke="url(#tvAntennaGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Left tip ball */}
      <circle cx="23" cy="4" r="3.2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      <circle cx="22" cy="3" r="1.2" fill="#ffffff" />

      {/* Right Antenna */}
      <line
        x1="53"
        y1="23"
        x2="76"
        y2="5"
        stroke="url(#tvAntennaGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Right tip ball */}
      <circle cx="77" cy="4" r="3.2" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
      <circle cx="76" cy="3" r="1.2" fill="#ffffff" />

      {/* Retro TV Feet / Legs at bottom */}
      <polygon points="22,82 17,94 23,94 27,82" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
      <polygon points="78,82 83,94 77,94 73,82" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
      {/* Feet rubber tips */}
      <rect x="16" y="93" width="7" height="2" rx="1" fill="#18181b" />
      <rect x="77" y="93" width="7" height="2" rx="1" fill="#18181b" />

      {/* TV Cabinet Outer Body (Curved TV Frame) */}
      <rect
        x="10"
        y="25"
        width="80"
        height="58"
        rx="12"
        fill="url(#tvCabinetGrad)"
        stroke="url(#tvBezelGrad)"
        strokeWidth="3"
      />

      {/* Inner Bezel Inset */}
      <rect
        x="13"
        y="28"
        width="74"
        height="52"
        rx="9"
        fill="none"
        stroke="#450a0a"
        strokeWidth="1.2"
      />

      {/* TV CRT Screen (Curved tube on left) */}
      <rect
        x="16"
        y="31"
        width="52"
        height="46"
        rx="7"
        fill="url(#tvScreenGrad)"
        stroke="#1e293b"
        strokeWidth="1.5"
      />

      {/* Screen Glare Highlight (Arc across top of screen) */}
      <path
        d="M 18 33 Q 42 30 66 33 L 64 45 Q 42 38 20 45 Z"
        fill="url(#screenGlare)"
      />

      {/* Screen Signal / Play Triangle with Broadcast Waves */}
      <g transform="translate(38, 54)">
        {/* Play triangle in screen center */}
        <polygon
          points="-8,-10 -8,10 9,0"
          fill="url(#goldPlayGrad)"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
        />
        {/* Radio Broadcast Signal Arcs */}
        <path
          d="M 11 -7 A 10 10 0 0 1 11 7"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 15 -11 A 15 15 0 0 1 15 11"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>

      {/* Right Control Panel (Knobs & Speaker) */}
      {/* Top Channel Knob */}
      <circle cx="79" cy="38" r="5" fill="#27272a" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="79" cy="38" r="3.2" fill="#18181b" />
      <line x1="79" y1="35" x2="79" y2="38" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

      {/* Bottom Volume Knob */}
      <circle cx="79" cy="52" r="5" fill="#27272a" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="79" cy="52" r="3.2" fill="#18181b" />
      <line x1="77" y1="52" x2="80" y2="52" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />

      {/* Speaker Grille Horizontal Slits */}
      <line x1="73" y1="64" x2="85" y2="64" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="73" y1="68" x2="85" y2="68" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="73" y1="72" x2="85" y2="72" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" />

      {/* Power Status LED at bottom right */}
      <circle cx="79" cy="78" r="1.5" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
    </svg>
  </div>
);

/**
 * 2. FILMES (Movies)
 * Authentic Cinema Clapperboard (Claquete de Cinema Profissional)
 * with angled top clapper arm, alternating diagonal zebra stripes,
 * hinge bolt, slate body with production chalk lines & golden movie seal.
 */
export const MoviesLauncherIcon: React.FC<IconProps> = ({ isFocused, className = 'w-20 h-20 md:w-24 md:h-24' }) => (
  <div className={`relative ${className} flex items-center justify-center transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}>
    {/* Ambient Glow */}
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-600/50 via-red-600/40 to-orange-500/50 blur-xl transition-all duration-300 ${
        isFocused ? 'opacity-100 scale-125' : 'opacity-50'
      }`}
    />

    <svg
      viewBox="0 0 100 100"
      className="relative w-full h-full filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.8)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clapperboard Slate Body Gradient */}
        <linearGradient id="slateBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#250912" />
          <stop offset="50%" stopColor="#17050b" />
          <stop offset="100%" stopColor="#0b0205" />
        </linearGradient>

        {/* Clapper Bezel Rim */}
        <linearGradient id="clapperRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>

        {/* Yellow Stripe Fill */}
        <linearGradient id="stripeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Dark Stripe Fill */}
        <linearGradient id="stripeDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e0a15" />
          <stop offset="100%" stopColor="#120308" />
        </linearGradient>

        {/* Golden Cinema Star / Emblem */}
        <linearGradient id="cinemaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Clip path for base clapper strip */}
        <clipPath id="baseStripClip">
          <rect x="12" y="38" width="76" height="13" rx="2" />
        </clipPath>

        {/* Clip path for angled arm */}
        <clipPath id="angledArmClip">
          <rect x="10" y="24" width="76" height="14" rx="3" />
        </clipPath>
      </defs>

      {/* Main Slate Body (Bottom Rectangle) */}
      <rect
        x="12"
        y="38"
        width="76"
        height="50"
        rx="8"
        fill="url(#slateBodyGrad)"
        stroke="url(#clapperRimGrad)"
        strokeWidth="2.5"
      />

      {/* Base Clapper Horizontal Strip (Fixed Top Bar of Slate) */}
      <rect
        x="12"
        y="38"
        width="76"
        height="13"
        fill="url(#stripeDark)"
        stroke="url(#clapperRimGrad)"
        strokeWidth="1.2"
      />

      {/* Base Bar Alternating Diagonal Stripes */}
      <g clipPath="url(#baseStripClip)">
        <polygon points="17,38 25,38 18,51 10,51" fill="url(#stripeYellow)" />
        <polygon points="33,38 41,38 34,51 26,51" fill="url(#stripeYellow)" />
        <polygon points="49,38 57,38 50,51 42,51" fill="url(#stripeYellow)" />
        <polygon points="65,38 73,38 66,51 58,51" fill="url(#stripeYellow)" />
        <polygon points="81,38 88,38 82,51 74,51" fill="url(#stripeYellow)" />
      </g>

      {/* Lower Slate Chalk Lines / Production Info Section */}
      <g opacity="0.6">
        <line x1="16" y1="62" x2="84" y2="62" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="38" y1="52" x2="38" y2="62" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
        <line x1="62" y1="52" x2="62" y2="62" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5" />
      </g>

      {/* Slate Center Cinema Play / Film Reel Seal */}
      <circle
        cx="50"
        cy="74"
        r="11"
        fill="#1e0710"
        stroke="url(#cinemaGold)"
        strokeWidth="1.8"
      />
      {/* Central Play Triangle */}
      <polygon
        points="47,68 47,80 57,74"
        fill="url(#cinemaGold)"
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
      />

      {/* Top Angled Clapper Arm (Open Action Clapper, tilted at ~18 degrees) */}
      <g transform="rotate(-18 14 38)">
        {/* Angled Arm Body */}
        <rect
          x="10"
          y="24"
          width="76"
          height="14"
          rx="3"
          fill="url(#stripeDark)"
          stroke="url(#clapperRimGrad)"
          strokeWidth="2"
        />
        {/* Angled Arm Alternating Diagonal Stripes */}
        <g clipPath="url(#angledArmClip)">
          <polygon points="18,24 26,24 19,38 11,38" fill="url(#stripeYellow)" />
          <polygon points="34,24 42,24 35,38 27,38" fill="url(#stripeYellow)" />
          <polygon points="50,24 58,24 51,38 43,38" fill="url(#stripeYellow)" />
          <polygon points="66,24 74,24 67,38 59,38" fill="url(#stripeYellow)" />
          <polygon points="82,24 88,24 83,38 75,38" fill="url(#stripeYellow)" />
        </g>
      </g>

      {/* Hinge Bolt / Screw on Top Left */}
      <circle cx="14" cy="38" r="4.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="14" cy="38" r="2" fill="#18040a" />
      <circle cx="13" cy="37" r="0.8" fill="#ffffff" />
    </svg>
  </div>
);

/**
 * 3. SÉRIES (Series)
 * Authentic 35mm Cinema Film Reel (Carretel de Película de Cinema)
 * with cascading curling celluloid film strip, rectangular sprocket perforations,
 * 5 circular spool windows, and center spindle star key.
 */
export const SeriesLauncherIcon: React.FC<IconProps> = ({ isFocused, className = 'w-20 h-20 md:w-24 md:h-24' }) => (
  <div className={`relative ${className} flex items-center justify-center transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}>
    {/* Ambient Glow */}
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-rose-600/50 via-red-600/40 to-amber-500/50 blur-xl transition-all duration-300 ${
        isFocused ? 'opacity-100 scale-125' : 'opacity-50'
      }`}
    />

    <svg
      viewBox="0 0 100 100"
      className="relative w-full h-full filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.8)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Film Reel Outer Rim Gradient */}
        <linearGradient id="reelRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="35%" stopColor="#f97316" />
          <stop offset="70%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Film Reel Hub Metal Gradient */}
        <radialGradient id="reelMetalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3d141e" />
          <stop offset="70%" stopColor="#22070f" />
          <stop offset="100%" stopColor="#0f0206" />
        </radialGradient>

        {/* Spool Hole Inset Shadow */}
        <radialGradient id="holeGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#050103" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Gold Center Badge */}
        <linearGradient id="reelGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Cascading Film Strip curling out from behind the reel */}
      <path
        d="M 68 56 C 82 58 92 68 90 80 C 88 88 78 92 64 92 C 50 92 42 86 36 82"
        fill="none"
        stroke="url(#reelRimGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Film Strip Inner Dark Body */}
      <path
        d="M 68 56 C 82 58 92 68 90 80 C 88 88 78 92 64 92 C 50 92 42 86 36 82"
        fill="none"
        stroke="#1a050d"
        strokeWidth="8.5"
        strokeLinecap="round"
      />
      {/* Film Strip Perforation Sprocket Holes */}
      <circle cx="75" cy="62" r="1.3" fill="#fbbf24" />
      <circle cx="83" cy="70" r="1.3" fill="#fbbf24" />
      <circle cx="85" cy="78" r="1.3" fill="#fbbf24" />
      <circle cx="78" cy="86" r="1.3" fill="#fbbf24" />
      <circle cx="68" cy="89" r="1.3" fill="#fbbf24" />
      <circle cx="56" cy="89" r="1.3" fill="#fbbf24" />
      <circle cx="44" cy="85" r="1.3" fill="#fbbf24" />

      {/* Main Cinema Film Reel (Large Circular Spool Wheel) */}
      <circle
        cx="46"
        cy="44"
        r="34"
        fill="url(#reelMetalGrad)"
        stroke="url(#reelRimGrad)"
        strokeWidth="3.5"
      />

      {/* Inner Concentric Bevel Ring */}
      <circle
        cx="46"
        cy="44"
        r="30"
        fill="none"
        stroke="#500718"
        strokeWidth="1.2"
      />

      {/* 5 Classic Film Reel Cutout Holes (Distributed around center hub) */}
      <circle cx="46" cy="24" r="5.8" fill="url(#holeGrad)" stroke="url(#reelRimGrad)" strokeWidth="1.2" />
      <circle cx="65" cy="38" r="5.8" fill="url(#holeGrad)" stroke="url(#reelRimGrad)" strokeWidth="1.2" />
      <circle cx="58" cy="60" r="5.8" fill="url(#holeGrad)" stroke="url(#reelRimGrad)" strokeWidth="1.2" />
      <circle cx="34" cy="60" r="5.8" fill="url(#holeGrad)" stroke="url(#reelRimGrad)" strokeWidth="1.2" />
      <circle cx="27" cy="38" r="5.8" fill="url(#holeGrad)" stroke="url(#reelRimGrad)" strokeWidth="1.2" />

      {/* Center Wheel Hub */}
      <circle
        cx="46"
        cy="44"
        r="12"
        fill="url(#reelRimGrad)"
        stroke="#78350f"
        strokeWidth="1.2"
      />
      <circle
        cx="46"
        cy="44"
        r="8.5"
        fill="#120308"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
      />

      {/* Center Axle Star / Key Notch */}
      <polygon
        points="46,39 48,43 51,44 48,46 46,50 44,46 41,44 44,43"
        fill="url(#reelGold)"
      />
      <circle cx="46" cy="44" r="2.2" fill="#000000" />
    </svg>
  </div>
);

/**
 * 4. CONFIGURAÇÕES (Settings)
 * Authentic Mechanical Interlocking Dual Gear Cogs
 * with beveled precision teeth, spoke cutouts, and central axle nut.
 */
export const SettingsLauncherIcon: React.FC<IconProps> = ({ isFocused, className = 'w-20 h-20 md:w-24 md:h-24' }) => (
  <div className={`relative ${className} flex items-center justify-center transition-transform duration-300 ${isFocused ? 'scale-110' : ''}`}>
    {/* Ambient Glow */}
    <div
      className={`absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-600/50 via-red-600/40 to-zinc-600/50 blur-xl transition-all duration-300 ${
        isFocused ? 'opacity-100 scale-125' : 'opacity-50'
      }`}
    />

    <svg
      viewBox="0 0 100 100"
      className="relative w-full h-full filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.8)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Main Cog Metallic Gradient */}
        <linearGradient id="gearMainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="80%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Small Cog Silver/Gold Gradient */}
        <linearGradient id="gearSecGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Inner Hub Shadow */}
        <radialGradient id="gearHubDark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0b0205" />
          <stop offset="70%" stopColor="#1a050d" />
          <stop offset="100%" stopColor="#2e0a16" />
        </radialGradient>
      </defs>

      {/* Secondary Smaller Upper-Right Interlocking Gear (Offset, meshing with main gear) */}
      <g transform="translate(68, 30)">
        <circle cx="0" cy="0" r="16" fill="none" stroke="url(#gearSecGrad)" strokeWidth="6" strokeDasharray="9 7.7" />
        <circle cx="0" cy="0" r="14" fill="#200711" stroke="url(#gearSecGrad)" strokeWidth="1.5" />
        <circle cx="0" cy="0" r="5" fill="#0c0205" stroke="#fbbf24" strokeWidth="1.2" />
      </g>

      {/* Main Large Gear (Center-Left) */}
      <g transform="translate(42, 54)">
        {/* Precision Cog Teeth Outer Rim */}
        <circle
          cx="0"
          cy="0"
          r="28"
          fill="none"
          stroke="url(#gearMainGrad)"
          strokeWidth="11"
          strokeDasharray="14 8"
        />

        {/* Solid Main Gear Rim Base */}
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="url(#gearHubDark)"
          stroke="url(#gearMainGrad)"
          strokeWidth="2.5"
        />

        {/* Inner Concentric Bevel Ring */}
        <circle
          cx="0"
          cy="0"
          r="19"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* 4 Inner Wheel Spokes / Cutouts */}
        <circle cx="0" cy="-12" r="3" fill="#080104" stroke="url(#gearMainGrad)" strokeWidth="0.8" />
        <circle cx="12" cy="0" r="3" fill="#080104" stroke="url(#gearMainGrad)" strokeWidth="0.8" />
        <circle cx="0" cy="12" r="3" fill="#080104" stroke="url(#gearMainGrad)" strokeWidth="0.8" />
        <circle cx="-12" cy="0" r="3" fill="#080104" stroke="url(#gearMainGrad)" strokeWidth="0.8" />

        {/* Center Metallic Axle Nut */}
        <circle
          cx="0"
          cy="0"
          r="7.5"
          fill="url(#gearSecGrad)"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        <polygon
          points="0,-4 3.5,-2 3.5,2 0,4 -3.5,2 -3.5,-2"
          fill="#17030a"
        />
        <circle cx="0" cy="0" r="1.5" fill="#fbbf24" />
      </g>
    </svg>
  </div>
);
