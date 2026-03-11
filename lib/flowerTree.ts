import { kdTree } from "kd-tree-javascript";
// import flowersData from "@/data/flower-metadata.json";
import { LabColor, FlowerMeta } from "./types";

import fs from "fs"
import path from "path"

const flowersData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data/flower-metadata.json"), "utf8")
)

function weightedDistance(a: LabColor, b: LabColor): number {
  const dL = a.L - b.L;
  const da = a.a - b.a;
  const db = a.b - b.b;

  return 2 * dL * dL + da * da + db * db;
}

const flowers = flowersData as FlowerMeta[];

export const flowerTree = new kdTree<LabColor>(
  flowers,
  weightedDistance,
  ["L", "a", "b"]
);