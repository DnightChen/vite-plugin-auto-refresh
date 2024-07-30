"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_node_fs = __toESM(require("fs"));
var defaultConfig = {
  fileName: "manifest",
  outDir: "public",
  isDev: false
};
function src_default(config = {}) {
  const options = { ...defaultConfig, ...config };
  const { fileName, isDev, outDir } = options;
  const start = process.env.NODE_ENV !== "development" || isDev;
  return {
    name: "auto-refresh",
    writeBundle(options2) {
      const buildPath = options2.dir || "";
      const outPath = `${buildPath}/${outDir}/${fileName}.json`;
      if (!import_node_fs.default.existsSync(buildPath))
        import_node_fs.default.mkdirSync(buildPath);
      import_node_fs.default.writeFileSync(outPath, (/* @__PURE__ */ new Date()).getTime().toString());
      console.log(`AutoRefresh completed and saved as ${fileName}.json`);
    },
    transformIndexHtml(html) {
      if (!start)
        return;
      const insertIndex = html.lastIndexOf("</html>") - 9;
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
            \u66F4\u65B0\u63D0\u793A
            <svg fill="none" viewBox="0 0 24 24" width="1em" height="1em" class="dialog-icon" onclick='autorefresh.close();'>
              <path fill="currentColor" d="M7.05 5.64L12 10.59l4.95-4.95 1.41 1.41L13.41 12l4.95 4.95-1.41 1.41L12 13.41l-4.95 4.95-1.41-1.41L10.59 12 5.64 7.05l1.41-1.41z"></path>
            </svg>
          </div>
          <div class='dialog-body'>\u68C0\u6D4B\u5230\u7CFB\u7EDF\u6709\u66F4\u65B0\uFF0C\u662F\u5426\u5237\u65B0\u9875\u9762\uFF1F</div>
          <div class='dialog-footer'>
            <div class='dialog-btn dialog-default'>\u4E0D\u518D\u63D0\u9192</div>
            <div class='dialog-btn dialog-confirm' onclick='location.reload();'>\u5237\u65B0</div>
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
              // \u68C0\u6D4B\u524D\u7AEF\u8D44\u6E90\u662F\u5426\u6709\u66F4\u65B0
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
      return html.slice(0, insertIndex) + insertContent + html.slice(insertIndex);
    }
  };
}
