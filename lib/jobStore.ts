export interface Job {
  progress: number;
  done: boolean;
  finalUrl?: string;
  wallpaperUrl?: string;
}

export const jobs: Record<string, Job> = {};