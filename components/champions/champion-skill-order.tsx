import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

interface ChampionSkillOrderProps {
  skillOrder: number[][];
}

const SKILL_LABELS = ["Q", "W", "E", "R"] as const;
const SKILL_COLORS: Record<string, string> = {
  Q: "bg-[#3B82F6] text-white",
  W: "bg-[#22C55E] text-white",
  E: "bg-[#EF4444] text-white",
  R: "bg-[#D4A843] text-white",
};

export function ChampionSkillOrder({ skillOrder }: ChampionSkillOrderProps) {
  if (skillOrder.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
          <Zap className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Not enough data yet. Skill order will appear as more matches are
            analyzed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground">
          Skill Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr>
                <th className="w-10 pb-2 text-left text-muted-foreground">
                  Skill
                </th>
                {Array.from({ length: 18 }).map((_, i) => (
                  <th
                    key={i}
                    className="w-8 pb-2 font-mono text-muted-foreground"
                  >
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SKILL_LABELS.map((skill, skillIdx) => (
                <tr key={skill}>
                  <td className="py-1 text-left">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold",
                        SKILL_COLORS[skill]
                      )}
                    >
                      {skill}
                    </span>
                  </td>
                  {Array.from({ length: 18 }).map((_, levelIdx) => {
                    const isSelected =
                      skillOrder[levelIdx] !== undefined &&
                      skillOrder[levelIdx][0] === skillIdx;

                    return (
                      <td key={levelIdx} className="py-1">
                        <div
                          className={cn(
                            "mx-auto h-6 w-6 rounded border text-xs leading-6",
                            isSelected
                              ? cn(
                                  SKILL_COLORS[skill],
                                  "border-transparent font-bold"
                                )
                              : "border-border bg-surface text-muted-foreground"
                          )}
                        >
                          {isSelected ? levelIdx + 1 : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
