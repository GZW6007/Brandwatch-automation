# Brandwatch dashboard extraction workflow

This workflow captures the successful Brandwatch steps so future requests can be run with only new parameters.

## Inputs

- Project: usually `Gigabyte`
- Dashboard name: example `【Test】Global Mention & Reach`
- Dashboard URL or ID: example `/project/1998345587/dashboards/1930609`
- Date range: example `May 01, 2026 - May 31, 2026`
- Tab name: example `【Overall】4 Product Lines`
- Chart title: example `Media Reach Share (Overall)`
- Desired values: chart percentages and/or `Series 1` values
- Optional target series/brand: example `Brand - GIGABYTE`

## Proven Steps

1. Open Brandwatch dashboards:
   `https://app.brandwatch.com/project/1998345587/dashboards`
2. If not logged in, stop and ask the user to log in manually.
3. Search dashboard list with a short phrase from the dashboard title, such as `Global Mention`.
4. Open the exact dashboard link.
5. If the date range button is not visible or has no clickable bounding box, widen the browser viewport.
   - The narrow layout can hide `Date range` even when the DOM contains it.
   - A wide viewport around `1600 x 1000` exposed the button reliably.
6. Click `Date range`.
7. Click the date input inside the date popover.
8. Fill the input directly through its label `Date`, for example:
   `May 01, 2026 - May 31, 2026`
9. Click the inner calendar `Apply` if the calendar popover is open.
10. Click the outer date range `Apply`.
11. Wait for dashboard components to refresh and verify component dates changed.
12. Select the requested dashboard tab.
    - Example tabs from `【Test】Global Mention & Reach`: `【Overall】4 Product Lines`, `1. Motherboard`, `2. Graphics Card`, `3. Monitor`, `4. Laptop`.
    - Different dashboards may have different tabs, so the tab name should be treated as an input.
    - If the tab is already selected, do not click it again.
13. Find the target chart heading exactly.
14. Extract the chart section from the DOM around that heading.
15. Read:
    - The `Series 1` labels, for example `Brand - ASUS - Infinity%: 64212408`
    - The rendered percentage labels, for example `59.32%`
    - The legend order, for example `Brand - ASUS`, `Brand - GIGABYTE`, `Brand - MSI`
16. Map percentages to brands by the chart's visible legend/order.

## Successful Example

Request:

- Dashboard: `【Test】Global Mention & Reach`
- Date range: `May 01, 2026 - May 31, 2026`
- Tab: `【Overall】4 Product Lines`
- Chart: `Media Reach Share (Overall)`

Result:

| Brand | Percentage | Series 1 |
|---|---:|---:|
| Brand - ASUS | 59.32% | 64,212,408 |
| Brand - GIGABYTE | 18.93% | 20,490,873 |
| Brand - MSI | 21.75% | 23,546,642 |

## Known Pitfalls

- Existing Edge login cannot be reused directly from the Codex in-app browser. If the in-app browser is logged out, the user must log in once.
- The Brandwatch date toolbar collapses in narrower viewports. Widen the viewport before interacting with `Date range`.
- Coordinate clicks can hit the time zone button instead of date range in narrow layout. Prefer a visible `Date range` button after widening.
- The date input should be filled by locator/label (`Date`) rather than keyboard shortcuts; the custom date picker may ignore `Ctrl+A` via coordinate focus.
- Some chart `aria-label` values show `Infinity%`, but the actual percentages are separate visible labels in the chart region.

## Future Prompt Template

Use this format for the next extraction:

```text
Brandwatch extract:
Dashboard: <dashboard name or URL>
Date range: <MMM DD, YYYY - MMM DD, YYYY>
Tab: <exact tab name>
Chart: <exact chart title>
Return: <all brands / specific brand / percentages / Series 1>
Then update Google Sheet: <sheet URL and target row/column rules, if needed>
```
