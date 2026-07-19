import React, { useMemo } from 'react';
import { createAvatar } from "@dicebear/core";
import * as openPeeps from "@dicebear/open-peeps";
import * as avataaars from "@dicebear/avataaars";
import * as bottts from "@dicebear/bottts";
import * as micah from "@dicebear/micah";
import * as pixelArt from "@dicebear/pixel-art";
import * as lorelei from "@dicebear/lorelei";
import './AvatarImage.scss';

const STYLE_MAP: Record<string, any> = {
  "open-peeps": openPeeps,
  "avataaars": avataaars,
  "bottts": bottts,
  "micah": micah,
  "pixel-art": pixelArt,
  "lorelei": lorelei,
};

interface AvatarImageProps {
  avatarString?: string;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
  onClick?: () => void;
}

const AvatarImage: React.FC<AvatarImageProps> = ({ avatarString, size = 150, className, fallback = null, onClick }) => {
  const avatarUri = useMemo(() => {
    if (!avatarString) return "";
    try {
      const config = JSON.parse(avatarString);
      const selectedStyle = config.style ? STYLE_MAP[config.style] : openPeeps;
      return createAvatar(selectedStyle || openPeeps, {
        seed: config.seed || "Akash",
        head: [config.head || "short1"],
        face: [config.expression || "smile"],
        accessories: [config.accessory || "glasses"],
        skinColor: [config.skin || "ffdbb4"],
        clothingColor: [config.shirt || "8fa7df"],
        size,
      }).toDataUri();
    } catch (e) {
      console.error("Failed to parse avatar config", e);
      return "";
    }
  }, [avatarString, size]);

  return (
    <div 
      className={`avatar-container ${className || ""}`} 
      style={{ width: size, height: size, cursor: onClick ? 'pointer' : 'default' }} 
      onClick={onClick}
    >
      {avatarUri ? (
        <img src={avatarUri} alt="Avatar" width={size} height={size} />
      ) : (
        <div className="avatar-fallback" style={{ fontSize: size * 0.55 }}>
          {fallback}
        </div>
      )}
    </div>
  );
};

export default AvatarImage;
