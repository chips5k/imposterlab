# Imposterlab

A desktop TV interface experiment replicating a streaming media client with full keyboard navigation and cross-origin API proxies. Built with React, Electron, and styled-components.

## Demo:

<p align="center">
  <video src="[[https://github.com](https://github.com/chips5k/imposterlab/releases/download/0.0.1/imposterlab-demo.mov)](https://github.com/chips5k/imposterlab/releases/download/0.0.1/imposterlab-demo.mov)" width="80%" controls></video>
</p>

https://github.com/chips5k/imposterlab/releases/download/0.0.1/imposterlab-demo.mov

## Quickstart

1. Clone the repository:
   ```bash
   git clone https://github.com/chips5k/imposterlab.git
   ```
2. Install dependencies:
   ```bash
   cd imposterlab && yarn install
   ```
3. Start the desktop application:
   ```bash
   yarn electron-dev
   ```

## Design Notes

After seeing `tv.animelab.com`, I wanted to build a similar leanback experience in React to understand spatial navigation and 10-foot UI constraints.

Electron was selected for two reasons:
1. To proxy streaming API endpoints and bypass cross-origin restrictions cleanly.
2. To approximate building and testing for dedicated desktop/console environments.
