import { Field } from "../types/form";

export const calculateAge = (dobStr: string): number | string => {
  if (!dobStr) return "";
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return "";
  const diffMs = Date.now() - dob.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export const evaluateFormula = (
  formula: string,
  parents: string[],
  currentValues: Record<string, any>
): string | number => {
  const match = formula.match(/^(\w+)\s*\(([^)]*)\)$/);
  if (!match) return "";

  const funcName = match[1].toLowerCase();

  switch (funcName) {
    case "calculateage": {
      if (parents.length !== 1) return "";
      const parentId = parents[0];
      const parentValue = currentValues[parentId];
      if (typeof parentValue === "string" && parentValue) {
        return calculateAge(parentValue);
      }
      return "";
    }

    case "sum": {
      let total = 0;
      for (const pid of parents) {
        const val = Number(currentValues[pid]);
        if (!isNaN(val)) total += val;
      }
      return total.toString();
    }

    case "average":
    case "avg": {
      let sum = 0;
      let count = 0;
      for (const pid of parents) {
        const val = Number(currentValues[pid]);
        if (!isNaN(val)) {
          sum += val;
          count++;
        }
      }
      return count > 0 ? (sum / count).toString() : "";
    }

    case "max": {
      let maxVal: number | null = null;
      for (const pid of parents) {
        const val = Number(currentValues[pid]);
        if (!isNaN(val)) {
          if (maxVal === null || val > maxVal) maxVal = val;
        }
      }
      return maxVal !== null ? maxVal.toString() : "";
    }

    case "min": {
      let minVal: number | null = null;
      for (const pid of parents) {
        const val = Number(currentValues[pid]);
        if (!isNaN(val)) {
          if (minVal === null || val < minVal) minVal = val;
        }
      }
      return minVal !== null ? minVal.toString() : "";
    }

    default:
      return "";
  }
};
