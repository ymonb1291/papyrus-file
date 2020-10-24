# Papyrus-File
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ymonb1291/papyrus-file?include_prereleases)
![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/ymonb1291/papyrus-file/latest?sort=semver)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/papyrus-file)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/papyrus-file/mod.ts)
![GitHub](https://img.shields.io/github/license/ymonb1291/papyrus-file)

A transport for [Papyrus](https://github.com/ymonb1291/papyrus) that outputs your logs to files. Rotating logs are supported.

# How to use
Basic usage:
```
import { Papyrus } from "https://deno.land/x/papyrus/mod.ts";
import { PapyrusFile } from "https://deno.land/x/papyrus-file/mod.ts";

const logger = new Papyrus({
  transport: {
    use: new PapyrusFile
  }
});

logger.info("This is an info");
```

Or with rotating logs:
```
import { Papyrus } from "https://deno.land/x/papyrus@v1.0.0/mod.ts";
import { PapyrusFile } from "https://deno.land/x/papyrus-file/mod.ts";

const logger = new Papyrus({
  transport: {
    use: new PapyrusFile({
      maxFileSize: "2 kB",
      rotate: true,
      timeFormat: "yyyyMMdd-hhmmssSSS"
    })
  }
});

setInterval(() => {
  logger.warn("This is a warning");
}, 200);
```

# Table of contents
- [Table of contents](#table-of-contents)
- [Options](#options)
  - [PFileOptions](##pfileoptions)
- [Contributions](#contributions)

# Options

## PFileOptions
`Papyrus-File` can be configured through an object that implements the interface `PFileOptions`. All properties are optional.
```
interface PFileOptions {
  maxFileSize?: string | number;
  output?: string;
  rotate?: boolean;
  timeFormat?: string;
}
```

Property | Type | Default | Description
-------- | ---- | ------- | -----------
`maxFileSize` | string \| number | "10 MB" | When log rotation is enabled, defines when to rotate. Values in bytes (B), kilobytes (kB) and megabytes (MB) are accepted. Megabytes is the default unit.
`output` | string | "./output.log" | Relative or absolute path to the log file
`rotate` | boolean | false | Enables log rotation
`timeFormat` | string | "yyyyMMdd-hhmmssSSS" | Time format according to [date_format_deno](https://deno.land/x/date_format_deno#format-keys)

# Contributions
PRs are welcome!