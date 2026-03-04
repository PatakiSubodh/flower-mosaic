import { flowerTree } from "./flowerTree";
import { LabColor, FlowerMeta, MatchResult } from "./types";

const K_NEAREST = 5;
const REPETITION_PENALTY = 800;

/**
 * KD-Tree Version
 */
export function matchGridWithKDTree(
  labGrid: LabColor[][]
): MatchResult[][] {
  const result: MatchResult[][] = [];

  for (let y = 0; y < labGrid.length; y++) {
    const row: MatchResult[] = [];

    for (let x = 0; x < labGrid[y].length; x++) {
      const tileColor = labGrid[y][x];

      const leftNeighbor = x > 0 ? row[x - 1] : null;
      const topNeighbor = y > 0 ? result[y - 1][x] : null;

      const nearest = flowerTree.nearest(tileColor, K_NEAREST);

        let bestFlower: FlowerMeta | null = null;
        let minScore = Infinity;

        for (const [candidate, baseDistance] of nearest) {
            const flower = candidate as FlowerMeta;    
            let score = baseDistance;    

            if (leftNeighbor && flower.id === leftNeighbor.id) {
                score += REPETITION_PENALTY;
            }    

            if (topNeighbor && flower.id === topNeighbor.id) {
                score += REPETITION_PENALTY;
            }    
            
            if (score < minScore) {
                minScore = score;
                bestFlower = flower;
            }
        }

      if (!bestFlower) {
        throw new Error("No flower match found.");
      }

      row.push({
        id: bestFlower.id,
        path: bestFlower.path,
      });
    }

    result.push(row);
  }

  return result;
}