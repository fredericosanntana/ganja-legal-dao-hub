import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RangeInputProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
}

const RangeInput: React.FC<RangeInputProps> = ({
  id,
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
  minLabel,
  maxLabel,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1"
        />
        <span className="w-16 text-center">
          {value}
          {unit}
        </span>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{minLabel || min}{unit}</span>
        <span>{maxLabel || max}{unit}</span>
      </div>
    </div>
  );
};

export default RangeInput;
