
import React, { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 128,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'L',
  includeMargin = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        if (canvasRef.current) {
          await QRCodeLib.toCanvas(canvasRef.current, value, {
            width: size,
            margin: includeMargin ? 4 : 0,
            color: {
              dark: fgColor,
              light: bgColor,
            },
            errorCorrectionLevel: level,
          });
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    loadQRCode();
  }, [value, size, bgColor, fgColor, level, includeMargin]);

  return (
    <canvas
      ref={canvasRef}
      style={{ height: size, width: size }}
      className="rounded-md"
    />
  );
};

export default QRCode;
