export interface Job {
  progress: number;
  done: boolean;
  finalUrl?: string;
  wallpaperUrl?: string;
}

const globalForJobs = globalThis as unknown as {
  jobs: Record<string, Job>;
};

export const jobs = globalForJobs.jobs || {};

if (process.env.NODE_ENV !== "production") {
  globalForJobs.jobs = jobs;
}