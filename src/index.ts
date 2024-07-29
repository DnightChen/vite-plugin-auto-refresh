import type { PluginOption } from 'vite';
import fs from 'node:fs';

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

export default function (config: Config = {}): PluginOption {
  const options = { ...defaultConfig, ...config };
  const { fileName, isDev, outDir } = options;
  const start = process.env.NODE_ENV !== 'development' || isDev;
  return {
    name: 'auto-refresh',
    writeBundle(options) {
      const buildPath = options.dir || '';
      const outPath = `${buildPath}/${outDir}/${fileName}.json`;
      if (!fs.existsSync(buildPath)) fs.mkdirSync(buildPath);
      fs.writeFileSync(outPath, new Date().getTime().toString());
      console.log(`AutoRefresh completed and saved as ${fileName}.json`);
    },
    transformIndexHtml(html: string) {
      if (!start) return;
      const insertIndex = html.lastIndexOf('</html>') - 9;
      const insertContent = `
      <style>
        #autorefresh {
          width: 480px;
          border: none !important;
          box-shadow: none !important;
          outline:none !important;
          border-radius: 10px;
          background-color: #fff;
          padding: 32px;
        }
        #autorefresh .dialog-header {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
        }
        #autorefresh .dialog-icon {
          width: 1em;
          height: 1em;
          cursor: pointer;
          transition: 0.3s;
        }
        #autorefresh .dialog-icon:hover {
          background-color: #f3f3f3;
        }
        #autorefresh .dialog-body {
          padding: 16px 0;
          font-weight: 300;
          font-size: 14px;
        }
        #autorefresh .dialog-footer {
          padding-top: 16px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-end;
        }
        #autorefresh .dialog-footer > * {
          margin-left: 8px;
        }
        #autorefresh .dialog-btn {
          height: 32px;
          padding: 0 16px;
          cursor: pointer;
          background-color: #e8e8e8;
          border-radius: 3px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
          color: rgba(0, 0, 0, 0.9);
          transition: 0.2s;
          font-size: 14px;
        }
        #autorefresh .dialog-btn:hover {
          background-color: #ddd;
        }
        #autorefresh .dialog-confirm {
          background-color: #0052d9;
          color: #fff;
        }
        #autorefresh .dialog-confirm:hover {
          background-color: #366ef4;
        }
        #autorefresh::backdrop {
          background-color: rgba(0, 0, 0, 0.6);
        }
      </style>
      <dialog id='autorefresh'>
        <div class='autorefresh-dialog'>
          <div class='dialog-header'>
            更新提示
            <svg fill="none" viewBox="0 0 24 24" width="1em" height="1em" class="dialog-icon" onclick='autorefresh.close();'>
              <path fill="currentColor" d="M7.05 5.64L12 10.59l4.95-4.95 1.41 1.41L13.41 12l4.95 4.95-1.41 1.41L12 13.41l-4.95 4.95-1.41-1.41L10.59 12 5.64 7.05l1.41-1.41z"></path>
            </svg>
          </div>
          <div class='dialog-body'>检测到系统有更新，是否刷新页面？</div>
          <div class='dialog-footer'>
            <div class='dialog-btn dialog-default'>不再提醒</div>
            <div class='dialog-btn dialog-confirm' onclick='location.reload();'>刷新</div>
          </div>
        </div>
      </dialog>
      <script>
        const url = './${outDir}/${fileName}.json';
        function createWorker(f) {
          const blob = new Blob(["(" + f.toString() + ")()"]);
          const url = window.URL.createObjectURL(blob);
          const worker = new Worker(url);
          return worker;
        }
        const pollingWorker = createWorker(() => {
          self.onmessage = (message) => {
            let timestamp = "";
            let hasChange = false;
            setInterval(() => {
              // 检测前端资源是否有更新
              fetch(message.data + "?v=" + new Date().getTime(), {
                method: "get",
              })
                .then((res) => res.json())
                .then((res) => {
                  if (!timestamp) {
                    timestamp = res.timestamp;
                  } else if (timestamp !== res.timestamp && !hasChange) {
                    hasChange = true;
                    self.postMessage(true);
                  }
                }).catch(()=>{
                  hasChange = true;
                  self.postMessage(true)
                });
            }, 5000);
          };
        });
        pollingWorker.onmessage = (message) => {
          if (message) {
            autorefresh.showModal();
          }
        };
        pollingWorker.postMessage(url);

        document.querySelector(".dialog-default").onclick = () => {
          pollingWorker.terminate();
          autorefresh.close();
        };
      </script>
      `;
      return (
        html.slice(0, insertIndex) + insertContent + html.slice(insertIndex)
      );
    },
  };
}
