# vite-plugin-auto-refresh

auto refresh your website to the latest version

## Install

`npm i vite-plugin-auto-refresh`

## vite.config.ts

```ts
import { defineConfig } from 'vite';
import AutoRefresh from 'vite-plugin-auto-refresh';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [AutoRefresh()],
});
```

## Config Options

```ts
interface Config {
  fileName?: string;
  outDir?: string;
  dts?: string;
  isDev?: boolean;
  change?: () => void;
}
const defaultConfig = {
  fileName: 'manifest',
  outDir: 'public',
  dts: 'src/utils/pinia-auto-refresh.ts',
  isDev: false,
};
```
