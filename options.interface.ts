export interface Internals {
  maxFileSize: number;
  output: string;
  rotate: boolean;
  timeFormat: string;
}

export interface PFileOptions {
  maxFileSize?: string | number;
  output?: string;
  rotate?: boolean;
  timeFormat?: string;
}