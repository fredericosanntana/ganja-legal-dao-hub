
import React from "react";

// A simple QR Code display component that uses an SVG placeholder or img tag
interface QRCodeProps {
  value: string;
  size?: number;
  style?: React.CSSProperties;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 128, style }) => {
  // If value is empty, show a placeholder
  if (!value) {
    return (
      <div 
        style={{ 
          width: size, 
          height: size, 
          background: "#f0f0f0", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          ...style
        }}
      >
        <svg 
          width={size * 0.8} 
          height={size * 0.8} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="10" width="30" height="30" fill="#888888" />
          <rect x="60" y="10" width="30" height="30" fill="#888888" />
          <rect x="10" y="60" width="30" height="30" fill="#888888" />
          <rect x="45" y="45" width="10" height="10" fill="#888888" />
          <rect x="60" y="60" width="10" height="10" fill="#888888" />
          <rect x="75" y="60" width="15" height="10" fill="#888888" />
          <rect x="60" y="75" width="30" height="15" fill="#888888" />
        </svg>
      </div>
    );
  }
  
  // Here we use a simple QR API to generate the QR code image
  // Note: For production, consider using a local QR generation or a reliable service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  
  return (
    <img 
      src={qrCodeUrl} 
      alt="QR Code" 
      width={size} 
      height={size} 
      style={style}
    />
  );
};

export default QRCode;
