import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RangeInput from "../common/RangeInput";

interface ECFlushParametersProps {
  currentEC: number;
  setCurrentEC: (value: number) => void;
  ecUnit: string;
  setEcUnit: (value: string) => void;
  waterEC: number;
  setWaterEC: (value: number) => void;
  potSize: number;
  setPotSize: (value: number) => void;
  substrate: string;
  setSubstrate: (value: string) => void;
  daysRemaining: number;
  setDaysRemaining: (value: number) => void;
}

const ECFlushParameters: React.FC<ECFlushParametersProps> = ({
  currentEC,
  setCurrentEC,
  ecUnit,
  setEcUnit,
  waterEC,
  setWaterEC,
  potSize,
  setPotSize,
  substrate,
  setSubstrate,
  daysRemaining,
  setDaysRemaining,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-ec">EC Atual do Runoff</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            id="current-ec"
            min={0.1}
            max={5}
            step={0.1}
            value={currentEC}
            onChange={(e) => setCurrentEC(parseFloat(e.target.value))}
            className="flex-1"
          />
          <select
            value={ecUnit}
            onChange={(e) => setEcUnit(e.target.value)}
            className="w-24 p-2 border rounded-md"
          >
            <option value="ec">EC</option>
            <option value="ppm500">PPM 500</option>
            <option value="ppm700">PPM 700</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="water-ec">EC da Água de Irrigação</Label>
        <Input
          type="number"
          id="water-ec"
          min={0}
          max={1}
          step={0.05}
          value={waterEC}
          onChange={(e) => setWaterEC(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pot-size">Tamanho do Vaso (litros)</Label>
        <Input
          type="number"
          id="pot-size"
          min={1}
          max={100}
          step={1}
          value={potSize}
          onChange={(e) => setPotSize(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="substrate">Substrato</Label>
        <select
          id="substrate"
          value={substrate}
          onChange={(e) => setSubstrate(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="solo">Solo</option>
          <option value="coco">Coco/Fibra</option>
          <option value="hidroponia">Hidroponia</option>
        </select>
      </div>

      <RangeInput
        id="days-remaining"
        label="Dias Restantes até Colheita"
        min={1}
        max={30}
        step={1}
        value={daysRemaining}
        onChange={setDaysRemaining}
        unit=" dias"
      />
    </div>
  );
};

export default ECFlushParameters;
