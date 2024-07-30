import { PluginOption } from 'vite';

interface Config {
    fileName?: string;
    outDir?: string;
    isDev?: boolean;
}
declare function export_default(config?: Config): PluginOption;

export { export_default as default };
