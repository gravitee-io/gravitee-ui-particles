# Misleading description for step values that don't evenly divide the range (e.g. `*/50 * * * *`)

## Description

When using step values that don't evenly divide the field range (60 for minutes, 24 for hours), the generated description is misleading.

For example, `*/50 * * * *` returns **"Every 50 minutes"**, which implies a consistent 50-minute interval. In reality, `*/50` means "every minute value divisible by 50", so it fires at **minute 0 and minute 50** — producing alternating intervals of 50 min and 10 min.

## Examples

| Expression | Current output | Actual behavior | Suggested output |
|---|---|---|---|
| `*/50 * * * *` | Every 50 minutes | Fires at minute 0 and 50 (intervals: 50m, 10m) | Every 50 minutes, starting at minute 0 (at minute 0 and 50) |
| `*/40 * * * *` | Every 40 minutes | Fires at minute 0 and 40 (intervals: 40m, 20m) | Every 40 minutes, starting at minute 0 (at minute 0 and 40) |
| `*/7 * * * *` | Every 7 minutes | Fires at 0,7,14,21,28,35,42,49,56 — then resets at 0 (last interval is 4m, not 7m) | Every 7 minutes, starting at minute 0 (at minute 0, 7, 14, 21, 28, 35, 42, 49, and 56) |

This does **not** affect step values that evenly divide the range (e.g. `*/15`, `*/20`, `*/30`), where the description is accurate.

## Related

This is related to #360 which was closed, but the scope there was limited to `*/59`. This issue covers the general case for any step value that doesn't evenly divide the field range (minutes: 60, hours: 24, days of month: varies, months: 12).

## Proposal

When a step value `N` does not evenly divide the field range, append clarification to the description. For example:
- Expand the actual matching values: `"At minute 0 and 50"`
- Or add a qualifier: `"Every 50 minutes, starting at minute 0 (wraps at each hour)"`

This would help users avoid misconfiguring schedules, which is a common pitfall (see [crontab.guru](https://crontab.guru/#*/50_*_*_*_*) for reference).