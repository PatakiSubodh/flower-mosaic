export interface Job {
  progress: number;
  done: boolean;
  finalUrl?: string;
}

export const jobs: Record<string, Job> = {};