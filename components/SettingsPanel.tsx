import { Card } from "@/components/ui/card";
import {
  MODEL_OPTIONS,
  ROLE_OPTIONS,
  TONE_OPTIONS,
  LENGTH_OPTIONS,
} from "@/lib/constants";

interface SettingsPanelProps {
  modelType: string;
  setModelType: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  isMounted: boolean;
}

const SelectControl = ({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="flex flex-col gap-2 mb-4">
    <label
      htmlFor={id}
      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="p-2 border rounded-md text-sm bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-zinc-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export function SettingsPanel({
  modelType,
  setModelType,
  role,
  setRole,
  tone,
  setTone,
  length,
  setLength,
  isMounted,
}: SettingsPanelProps) {
  return (
    <aside
      className={`flex flex-col gap-4 transition-opacity duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Card className="flex-1 p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Writting setup</h2>

        <SelectControl
          id="modelType"
          label="Model"
          value={modelType}
          onChange={(e) => setModelType(e.target.value)}
          options={MODEL_OPTIONS}
        />

        <SelectControl
          id="role"
          label="Assistant role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLE_OPTIONS}
        />

        <SelectControl
          id="tone"
          label="Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          options={TONE_OPTIONS}
        />

        <SelectControl
          id="length"
          label="Length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          options={LENGTH_OPTIONS}
        />
      </Card>
    </aside>
  );
}
