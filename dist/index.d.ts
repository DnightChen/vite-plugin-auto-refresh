import { PluginOption } from 'vite';

interface Config {
    fileName?: string;
    outDir?: string;
    dts?: string;
    isDev?: boolean;
    change?: () => void;
}
declare function export_default(config?: Config): PluginOption;

export { export_default as default };
