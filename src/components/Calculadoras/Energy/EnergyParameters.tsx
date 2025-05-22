import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import RangeInput from "../common/RangeInput";
import { EquipmentItem, COMMON_EQUIPMENT } from "./energyUtils";

interface EnergyParametersProps {
  equipmentList: EquipmentItem[];
  addEquipment: () => void;
  removeEquipment: (id: string) => void;
  updateEquipment: (id: string, field: keyof EquipmentItem, value: any) => void;
  kwhPrice: number;
  setKwhPrice: (value: number) => void;
  handleCalculate: () => void;
}

const EnergyParameters: React.FC<EnergyParametersProps> = ({
  equipmentList,
  addEquipment,
  removeEquipment,
  updateEquipment,
  kwhPrice,
  setKwhPrice,
  handleCalculate,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kwh-price">Preço do kWh na sua região (R$)</Label>
        <Input
          type="number"
          id="kwh-price"
          min={0.1}
          max={2}
          step={0.01}
          value={kwhPrice}
          onChange={(e) => setKwhPrice(parseFloat(e.target.value))}
        />
        <p className="text-sm text-muted-foreground">
          Média nacional: R$ 0,95/kWh
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Equipamentos</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addEquipment}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>

        {equipmentList.map((equipment) => (
          <div
            key={equipment.id}
            className="border rounded-md p-3 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <Label htmlFor={`equipment-name-${equipment.id}`}>
                  Equipamento
                </Label>
                <div className="flex gap-2">
                  <select
                    id={`equipment-name-${equipment.id}`}
                    value={equipment.name}
                    onChange={(e) => {
                      const selectedEquipment = COMMON_EQUIPMENT.find(
                        (item) => item.name === e.target.value
                      );
                      updateEquipment(equipment.id, "name", e.target.value);
                      if (selectedEquipment) {
                        updateEquipment(
                          equipment.id,
                          "power",
                          selectedEquipment.power
                        );
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Selecione ou digite</option>
                    {COMMON_EQUIPMENT.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name} ({item.power}W)
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEquipment(equipment.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`equipment-power-${equipment.id}`}>
                  Potência (W)
                </Label>
                <Input
                  type="number"
                  id={`equipment-power-${equipment.id}`}
                  min={1}
                  max={5000}
                  step={1}
                  value={equipment.power}
                  onChange={(e) =>
                    updateEquipment(
                      equipment.id,
                      "power",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor={`equipment-quantity-${equipment.id}`}>
                  Quantidade
                </Label>
                <Input
                  type="number"
                  id={`equipment-quantity-${equipment.id}`}
                  min={1}
                  max={100}
                  step={1}
                  value={equipment.quantity}
                  onChange={(e) =>
                    updateEquipment(
                      equipment.id,
                      "quantity",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <RangeInput
              id={`equipment-hours-${equipment.id}`}
              label="Horas ligado por dia"
              min={0}
              max={24}
              step={0.5}
              value={equipment.hoursPerDay}
              onChange={(value) =>
                updateEquipment(equipment.id, "hoursPerDay", value)
              }
              unit="h"
            />

            <div>
              <Label htmlFor={`equipment-days-${equipment.id}`}>
                Dias por mês
              </Label>
              <Input
                type="number"
                id={`equipment-days-${equipment.id}`}
                min={1}
                max={31}
                step={1}
                value={equipment.daysPerMonth}
                onChange={(e) =>
                  updateEquipment(
                    equipment.id,
                    "daysPerMonth",
                    parseInt(e.target.value)
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full" onClick={handleCalculate}>
        Calcular Consumo de Energia
      </Button>
    </div>
  );
};

export default EnergyParameters;
