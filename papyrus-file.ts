import {
  basename,
  dateToString,
  dirname,
  ensureFileSync,
  EOL,
  existsSync,
  extname,
  isAbsolute,
  join,
  moveSync
} from "./deps.ts";

import type { Transport } from "./deps.ts";
import type { PFileOptions, Internals } from "./options.interface.ts";

export class PapyrusFile implements Transport {

  private internals: Internals;
  private static isFirst: boolean = true;

  constructor(options?: PFileOptions) {
    this.internals = {
      maxFileSize: PapyrusFile.toBytes(options?.maxFileSize),
      output: PapyrusFile.toAbsolutePath(options?.output),
      rotate: options?.rotate || false,
      timeFormat: options?.timeFormat || "yyyyMMdd-hhmmssSSS",
    };

    if(PapyrusFile.isFirst) {
      this.archiveFile();
    }
    PapyrusFile.isFirst = false;
  }

  log(str: string): void {
    if(!this.internals.rotate) return this.print(str);

    const size = existsSync(this.internals.output) ? Deno.lstatSync(this.internals.output).size : 0;

    if(size > this.internals.maxFileSize) {
      this.archiveFile();
    }

    this.print(str);
  }

  private archiveFile(): void {
    if(existsSync(this.internals.output)) {
      // birthtime works only on Unix. Windows uses the current datetime
      const birthtime = Deno.lstatSync(this.internals.output).birthtime || new Date();
      const date = dateToString(this.internals.timeFormat, birthtime);
      const extension = extname(this.internals.output);
      const base_name = basename(this.internals.output, extension);
      const rootDir = dirname(this.internals.output)
      const path = join(rootDir, base_name+"-"+date+extension);
      moveSync(this.internals.output, path, {overwrite: true});
    }
  }

  private print(str: string): void {
    ensureFileSync(this.internals.output);
    const encoder = new TextEncoder();
    const encodedLog = encoder.encode(str+EOL.LF);
    Deno.writeFileSync(this.internals.output, encodedLog, {append: true});
  }

  private static toAbsolutePath(path: string = "./output.log"): string {
    switch (isAbsolute(path)) {
      case true:
        return path;
      case false:
        return join(Deno.cwd(), path);
    }
  }

  private static toBytes(value: string | number = "10 MB"): number {
    // By default, we consider that value is expressed in MB
    let multiplicator: number = 1E6;

    if(typeof value === "string" && /^\s?\d+\s?\bB\b\s?$/i.test(value)) {
      // Value is in bytes
      multiplicator = 1;
    } else if(typeof value === "string" && /^\s?\d+\s?\bkB\b\s?$/i.test(value)) {
      // Value is in kb
      multiplicator = 1E3;
    }

    return typeof value === "number" ? value * multiplicator : parseInt(value) * multiplicator;
  }

}