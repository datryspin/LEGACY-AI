import { useTheme } from "next-themes";
import { Check, Palette } from "lucide-react";

const themes = [
  {
    id: "purple-dark",
    name: "Purple Dark",
    description: "Deep violet surfaces with a vivid purple reactor.",
    swatch: ["#160d20", "#301d3d", "#b78cff"],
  },
  {
    id: "purple-light",
    name: "Purple Light",
    description: "Lighter lavender surfaces with white interface text.",
    swatch: ["#302044", "#50366a", "#d0b3ff"],
  },
  {
    id: "maroon-dark",
    name: "Maroon Dark",
    description: "Deep maroon surfaces with a rose reactor.",
    swatch: ["#240812", "#43152a", "#e08aa9"],
  },
  {
    id: "maroon-light",
    name: "Maroon Light",
    description: "Lighter burgundy surfaces with white interface text.",
    swatch: ["#3b1427", "#65304a", "#f0a9c2"],
  },
] as const;

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="mb-5 rounded-xl border border-purple-500/25 bg-[#310d1c]/50 p-3">
      <div className="mb-3 flex items-center gap-2">
        <Palette className="h-4 w-4 text-purple-300" />
        <div>
          <h3 className="text-sm font-semibold text-white">Appearance</h3>
          <p className="text-[10px] text-white/60">Choose the LEGACY interface theme</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {themes.map((item) => {
          const selected = theme === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              aria-pressed={selected}
              className={`rounded-lg border p-2 text-left transition ${
                selected
                  ? "border-purple-300 ring-1 ring-purple-300/50"
                  : "border-white/15 hover:border-white/40"
              }`}
            >
              <span className="mb-2 flex h-7 overflow-hidden rounded-md">
                {item.swatch.map((color) => (
                  <span key={color} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </span>
              <span className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-white">{item.name}</span>
                {selected && <Check className="h-3.5 w-3.5 text-white" />}
              </span>
              <span className="mt-1 block text-[10px] leading-4 text-white/60">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AppearanceSettings;
