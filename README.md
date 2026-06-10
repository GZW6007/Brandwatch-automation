# Brandwatch Extract Builder

A lightweight static page for turning repeat Brandwatch extraction requests into a structured prompt.

Open `index.html` in a browser or publish the folder with GitHub Pages.

## What It Does

- Collects the reusable inputs:
  - Dashboard
  - Date range
  - Tab
  - Chart
  - Return format
- Generates a `Brandwatch extract:` prompt that can be pasted into Codex.
- Keeps Brandwatch account and password fields local to the current page session.

## Security Note

This static page does not store, submit, or include Brandwatch credentials in the generated prompt. If the automation browser is not logged in, the user should log in manually before the extraction continues.

