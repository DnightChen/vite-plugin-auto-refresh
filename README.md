# vite-plugin-auto-refresh

auto refresh your website to the latest version

## Install

`npm i vite-plugin-auto-refresh`

## vite.config.ts

```ts
import { defineConfig } from 'vite';
import AutoRefresh from 'vite-plugin-auto-refresh';

export default defineConfig({
  ...
  plugins: [AutoRefresh()],
  ...
});
```

## Config Options

```ts
interface Config {
  fileName?: string;
  outDir?: string;
  isDev?: boolean;
  language?: 'EN' | 'CN';
}

const defaultConfig = {
  fileName: 'manifest',
  outDir: 'public',
  isDev: false,
  language: 'CN',
};
```
