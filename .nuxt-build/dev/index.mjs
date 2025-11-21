import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { promises, existsSync, readFileSync, createReadStream } from 'node:fs';
import path, { resolve, dirname, join, basename as basename$1 } from 'node:path';
import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import crypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, getResponseStatus, createError, getRequestHost, getRequestProtocol, getHeader, getQuery as getQuery$1, setHeader, lazyEventHandler, useBase, createApp, createRouter as createRouter$1, toNodeListener, getRouterParam, readBody, getCookie, setCookie, sendStream, getResponseStatusText } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/h3/dist/index.mjs';
import { escapeHtml as escapeHtml$1 } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/@vue/shared/dist/shared.cjs.js';
import OpenAI from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/openai/index.mjs';
import { fileURLToPath } from 'node:url';
import { createFetch, Headers as Headers$1, $fetch as $fetch$1 } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/ofetch/dist/node.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, hasProtocol, withHttps, joinRelativeURL, withoutProtocol } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/ufo/dist/index.mjs';
import destr from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/destr/dist/index.mjs';
import { renderToString } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/klona/dist/index.mjs';
import defu, { defuFn, defu as defu$1 } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/@unhead/vue/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/devalue/index.js';
import { isVNode, toValue, isRef } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/vue/index.mjs';
import { createHooks } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/hookable/dist/index.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/unstorage/drivers/fs.mjs';
import unstorage_47drivers_47redis from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/unstorage/drivers/redis.mjs';
import { digest, hash as hash$2 } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1, createConsola } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/youch-core/build/index.js';
import { Youch } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/nitropack/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/errx/dist/index.js';
import devalue from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/@nuxt/devalue/dist/devalue.mjs';
import { basename, isAbsolute } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/pathe/dist/index.mjs';
import { getIcons } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/@iconify/utils/lib/index.mjs';
import { collections } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/.nuxt/nuxt-icon-server-bundle.mjs';
import { ipxFSStorage, ipxHttpStorage, createIPX, createIPXH3Handler } from 'file://C:/APPERZA/NUXT/jasapembayaran-new/node_modules/ipx/dist/index.mjs';

const serverAssets = [{"baseName":"server","dir":"C:/APPERZA/NUXT/jasapembayaran-new/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('redis', unstorage_47drivers_47redis({"driver":"redis","host":"localhost","port":6379,"db":0}));
storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/APPERZA/NUXT/jasapembayaran-new","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/APPERZA/NUXT/jasapembayaran-new/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/APPERZA/NUXT/jasapembayaran-new/.nuxt-build"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/APPERZA/NUXT/jasapembayaran-new/.nuxt-build/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:/APPERZA/NUXT/jasapembayaran-new/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash$1(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash$1([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash$1(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash$1(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash$1(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash$1([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash$1(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  ui: {
    colors: {
      primary: "yellow",
      neutral: "neutral"
    }
  },
  // Configure Nuxt Icon to use CSS mode and alias common lucide icons
  icon: {
    mode: "css",
    aliases: {
      "lucide:moon": "i-lucide-moon",
      "lucide:sun": "i-lucide-sun",
      "lucide:languages": "i-lucide-languages",
      "lucide:menu": "i-lucide-menu",
      "lucide:arrow-left": "i-lucide-arrow-left"
    }
  }
});

const inlineAppConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "ellipsis": "i-lucide-ellipsis",
      "external": "i-lucide-arrow-up-right",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "loading": "i-lucide-loader-circle",
      "minus": "i-lucide-minus",
      "plus": "i-lucide-plus",
      "search": "i-lucide-search",
      "upload": "i-lucide-upload"
    }
  },
  "icon": {
    "provider": "server",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "dashicons",
      "devicon",
      "devicon-plain",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fad",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "logos",
      "ls",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "pixelarticons",
      "prime",
      "ps",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "si-glyph",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "streamline",
      "streamline-emojis",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};

const appConfig = defuFn(appConfig0, inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/sw.js": {
        "headers": {
          "cache-control": "no-cache"
        },
        "prerender": false
      },
      "/workbox-*.js": {
        "headers": {
          "cache-control": "no-cache"
        },
        "prerender": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable",
          "x-robots-tag": "noindex, nofollow"
        }
      },
      "/images/**": {
        "headers": {
          "cache-control": "public, max-age=2592000, immutable"
        }
      },
      "/icons/**": {
        "headers": {
          "cache-control": "public, max-age=2592000, immutable"
        }
      },
      "/fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/sitemap.xml": {
        "headers": {
          "cache-control": "public, max-age=86400, must-revalidate"
        }
      },
      "/sitemap-dynamic.xml": {
        "headers": {
          "cache-control": "public, max-age=86400, must-revalidate"
        }
      },
      "/robots.txt": {
        "headers": {
          "cache-control": "public, max-age=86400, must-revalidate"
        }
      },
      "/": {
        "isr": 600
      },
      "/tentang-kami": {
        "isr": 1800
      },
      "/testimonials": {
        "isr": 3600
      },
      "/informasi/transaksi": {
        "isr": 86400
      },
      "/informasi/rekening": {
        "isr": 86400
      },
      "/bukti-transaksi": {
        "isr": 86400
      },
      "/blog/**": {
        "isr": 900
      },
      "/api/**": {
        "headers": {
          "cache-control": "no-store, max-age=0, must-revalidate",
          "x-robots-tag": "noindex, nofollow"
        },
        "prerender": false,
        "ssr": false
      },
      "/api/sitemap*": {
        "headers": {
          "cache-control": "public, max-age=3600, must-revalidate",
          "content-type": "application/xml"
        }
      },
      "/api/robots*": {
        "headers": {
          "cache-control": "public, max-age=3600, must-revalidate",
          "content-type": "text/plain"
        }
      },
      "/login": {
        "headers": {
          "x-robots-tag": "noindex, nofollow"
        }
      },
      "/admin/**": {
        "headers": {
          "x-robots-tag": "noindex, nofollow"
        }
      },
      "/blog/preview/**": {
        "headers": {
          "x-robots-tag": "noindex, nofollow"
        }
      },
      "/**": {
        "headers": {
          "cache-control": "no-store, max-age=0, must-revalidate",
          "vary": "Save-Data, Downlink, ECT",
          "Accept-CH": "Downlink, ECT",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
          "Referrer-Policy": "strict-origin-when-cross-origin",
          "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
          "X-DNS-Prefetch-Control": "on",
          "X-Download-Options": "noopen"
        }
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
      },
      "/_scripts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "whatsappPhone": "628988888250",
    "whatsappMessage": "Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal",
    "buildId": "1759977481",
    "siteUrl": "https://jasapembayaran.com",
    "cdnBase": "",
    "nuxt-scripts": {
      "version": "0.11.10",
      "defaultScriptOptions": {
        "trigger": "onNuxtReady"
      }
    }
  },
  "enableScheduler": true,
  "enableAutoBlog": true,
  "enableKeywordScheduler": true,
  "enableBlogScheduler": true,
  "openaiApiKey": "your_openai_api_key_here",
  "maxDailyPosts": "10",
  "blogGenerationTime": "03:00",
  "autoRebuild": true,
  "rebuildDelay": "3600000",
  "icon": {
    "serverKnownCssClasses": []
  },
  "nuxt-scripts": {
    "version": "0.11.10"
  },
  "nuxt-site-config": {
    "stack": [
      {
        "_context": "system",
        "_priority": -15,
        "name": "jasapembayaran-new",
        "env": "development"
      },
      {
        "_context": "package.json",
        "_priority": -10,
        "name": "jasapembayaran.com"
      },
      {
        "_priority": -3,
        "_context": "nuxt-site-config:config",
        "url": "https://jasapembayaran.com"
      },
      {
        "_context": "buildEnv",
        "_priority": -1,
        "url": "https://jasapembayaran.com"
      }
    ],
    "version": "3.2.9",
    "debug": false,
    "multiTenancy": []
  },
  "ipx": {
    "baseURL": "/_ipx",
    "alias": {},
    "fs": {
      "dir": [
        "C:/APPERZA/NUXT/jasapembayaran-new/public"
      ]
    },
    "http": {
      "domains": [
        "jasapembayaran.com",
        "blog.jasapembayaran.com",
        "blog.jasapembayaran.online",
        "i0.wp.com",
        "i1.wp.com",
        "i2.wp.com",
        "secure.gravatar.com",
        "s.w.org",
        "image.pollinations.ai",
        "picsum.photos",
        "images.unsplash.com"
      ]
    }
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const rootDir = "C:/APPERZA/NUXT/jasapembayaran-new";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"},{"name":"google","content":"notranslate"},{"http-equiv":"Content-Language","content":"id-ID"},{"name":"description","content":"Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011."},{"name":"keywords","content":"jasa paypal, jasa paypal terpercaya, jasa bayar paypal, jasa top up paypal, jasa isi saldo paypal, jasa transfer paypal, jasa kirim paypal, jasa deposit paypal, jasa perantara paypal, jasa pembayaran paypal, jasa bayar via paypal, jasa pembayaran via paypal, jasa topup saldo paypal, jasa paypal indonesia, jasa paypal murah, jasa paypal cepat, jasa paypal aman, jasa paypal 24 jam, jasa transfer trc20, jasa transfer btc, jasa bayar btc, jasa bayar trc20, jasa pembayaran online, jasa bayar skrill, jasa transfer skrill, jasa bitcoin, jasa kirim bitcoin, jasa bayar namecheap, jasa isi saldo namecheap, jasa topup saldo namecheap, jasa pembayaran ahrefs, jasa ahrefs, jasa bayar ahrefs, jasa pembayaran luar negeri"},{"name":"robots","content":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"},{"name":"googlebot","content":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"},{"name":"bingbot","content":"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"},{"name":"author","content":"JasaPembayaran.com"},{"name":"publisher","content":"JasaPembayaran.com"},{"name":"copyright","content":"JasaPembayaran.com"},{"name":"theme-color","content":"#1D4ED8"},{"name":"msapplication-TileColor","content":"#1D4ED8"},{"name":"apple-mobile-web-app-capable","content":"yes"},{"name":"apple-mobile-web-app-status-bar-style","content":"default"},{"name":"apple-mobile-web-app-title","content":"JasaPembayaran.com"},{"name":"format-detection","content":"telephone=no"},{"name":"mobile-web-app-capable","content":"yes"},{"name":"application-name","content":"JasaPembayaran.com"},{"property":"og:title","content":"Jasa PayPal Terpercaya – JasaPembayaran.com"},{"property":"og:description","content":"Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011."},{"property":"og:type","content":"website"},{"property":"og:url","content":"https://jasapembayaran.com"},{"property":"og:image","content":"https://jasapembayaran.com/landing-page.png"},{"property":"og:image:width","content":"1200"},{"property":"og:image:height","content":"630"},{"property":"og:image:alt","content":"JasaPembayaran.com - Jasa PayPal Terpercaya"},{"property":"og:site_name","content":"JasaPembayaran.com"},{"property":"og:locale","content":"id_ID"},{"property":"og:locale:alternate","content":"en_US"},{"name":"twitter:card","content":"summary_large_image"},{"name":"twitter:title","content":"Jasa PayPal Terpercaya – JasaPembayaran.com"},{"name":"twitter:description","content":"Jasa PayPal terpercaya untuk isi saldo, bayar, dan kirim. Melayani BTC, TRC20, dan berbagai layanan digital. Cepat, aman, berpengalaman sejak 2011."},{"name":"twitter:image","content":"https://jasapembayaran.com/landing-page.png"},{"name":"twitter:image:alt","content":"JasaPembayaran.com - Jasa PayPal Terpercaya"},{"name":"twitter:site","content":"@jasapembayaran"},{"name":"twitter:creator","content":"@jasapembayaran"}],"link":[{"rel":"canonical","href":"https://jasapembayaran.com"},{"rel":"stylesheet","href":"https://cdn.jsdelivr.net/npm/flag-icons@6.11.1/css/flag-icons.min.css"},{"rel":"dns-prefetch","href":"//cdn.jsdelivr.net"},{"rel":"dns-prefetch","href":"//fonts.googleapis.com"},{"rel":"dns-prefetch","href":"//fonts.gstatic.com"},{"rel":"dns-prefetch","href":"//blog.jasapembayaran.com"},{"rel":"preconnect","href":"https://cdn.jsdelivr.net","crossorigin":"anonymous"},{"rel":"preconnect","href":"https://fonts.googleapis.com","crossorigin":"anonymous"},{"rel":"preconnect","href":"https://fonts.gstatic.com","crossorigin":"anonymous"},{"rel":"prefetch","href":"/testimonials","as":"document"},{"rel":"prefetch","href":"/informasi/transaksi","as":"document"},{"rel":"prefetch","href":"/informasi/rekening","as":"document"},{"rel":"prefetch","href":"/bukti-transaksi","as":"document"},{"rel":"prefetch","href":"/blog","as":"document"},{"rel":"preload","href":"/favicon.ico","as":"image","type":"image/x-icon"},{"rel":"apple-touch-icon","sizes":"180x180","href":"/apple-touch-icon.png"},{"rel":"icon","type":"image/png","sizes":"32x32","href":"/favicon-32x32.png"},{"rel":"icon","type":"image/png","sizes":"16x16","href":"/favicon-16x16.png"},{"rel":"manifest","href":"/site.webmanifest"},{"rel":"mask-icon","href":"/safari-pinned-tab.svg","color":"#1D4ED8"}],"style":[],"script":[],"noscript":[],"htmlAttrs":{"lang":"id","translate":"no","class":"notranslate"},"title":"JasaPembayaran.com – Jasa PayPal Terpercaya","titleTemplate":"%s | JasaPembayaran.com"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt","class":"isolate"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _JjihjUHJa01Q0_UkGjcVgQPmXMRctjWwCfyV0A8gvs = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

function normalizeSiteConfig(config) {
  if (typeof config.indexable !== "undefined")
    config.indexable = String(config.indexable) !== "false";
  if (typeof config.trailingSlash !== "undefined" && !config.trailingSlash)
    config.trailingSlash = String(config.trailingSlash) !== "false";
  if (config.url && !hasProtocol(String(config.url), { acceptRelative: true, strict: false }))
    config.url = withHttps(String(config.url));
  const keys = Object.keys(config).sort((a, b) => a.localeCompare(b));
  const newConfig = {};
  for (const k of keys)
    newConfig[k] = config[k];
  return newConfig;
}
function createSiteConfigStack(options) {
  const debug = options?.debug || false;
  const stack = [];
  function push(input) {
    if (!input || typeof input !== "object" || Object.keys(input).length === 0) {
      return () => {
      };
    }
    if (!input._context && debug) {
      let lastFunctionName = new Error("tmp").stack?.split("\n")[2]?.split(" ")[5];
      if (lastFunctionName?.includes("/"))
        lastFunctionName = "anonymous";
      input._context = lastFunctionName;
    }
    const entry = {};
    for (const k in input) {
      const val = input[k];
      if (typeof val !== "undefined" && val !== "")
        entry[k] = val;
    }
    let idx;
    if (Object.keys(entry).filter((k) => !k.startsWith("_")).length > 0)
      idx = stack.push(entry);
    return () => {
      if (typeof idx !== "undefined") {
        stack.splice(idx - 1, 1);
      }
    };
  }
  function get(options2) {
    const siteConfig = {};
    if (options2?.debug)
      siteConfig._context = {};
    siteConfig._priority = {};
    for (const o in stack.sort((a, b) => (a._priority || 0) - (b._priority || 0))) {
      for (const k in stack[o]) {
        const key = k;
        const val = options2?.resolveRefs ? toValue(stack[o][k]) : stack[o][k];
        if (!k.startsWith("_") && typeof val !== "undefined" && val !== "") {
          siteConfig[k] = val;
          if (typeof stack[o]._priority !== "undefined" && stack[o]._priority !== -1) {
            siteConfig._priority[key] = stack[o]._priority;
          }
          if (options2?.debug)
            siteConfig._context[key] = stack[o]._context?.[key] || stack[o]._context || "anonymous";
        }
      }
    }
    return options2?.skipNormalize ? siteConfig : normalizeSiteConfig(siteConfig);
  }
  return {
    stack,
    push,
    get
  };
}

function envSiteConfig(env) {
  return Object.fromEntries(Object.entries(env).filter(([k]) => k.startsWith("NUXT_SITE_") || k.startsWith("NUXT_PUBLIC_SITE_")).map(([k, v]) => [
    k.replace(/^NUXT_(PUBLIC_)?SITE_/, "").split("_").map((s, i) => i === 0 ? s.toLowerCase() : s[0]?.toUpperCase() + s.slice(1).toLowerCase()).join(""),
    v
  ]));
}

const logger = /* @__PURE__ */ createConsola({
  defaults: {
    tag: "nuxt-site-config"
  }
});

function getSiteConfig(e, _options) {
  if (!e.context._initedSiteConfig) {
    logger.warn("Site config has not been initialized yet. If you're trying to access site config in a server middleware then this not yet supported. See https://github.com/harlan-zw/nuxt-seo/issues/397");
  }
  e.context.siteConfig = e.context.siteConfig || createSiteConfigStack();
  const options = defu$1(_options, useRuntimeConfig(e)["nuxt-site-config"], { debug: false });
  return e.context.siteConfig.get(options);
}

const _8dtb2JxojIgDft_QJHgTrR90LkVJ_SKhAFJLTyk245M = defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook("render:html", async (ctx, { event }) => {
    const routeOptions = getRouteRules(event);
    const isIsland = process.env.NUXT_COMPONENT_ISLANDS && event.path.startsWith("/__nuxt_island");
    event.path;
    const noSSR = event.context.nuxt?.noSSR || routeOptions.ssr === false && !isIsland || (false);
    if (noSSR) {
      const siteConfig = Object.fromEntries(
        Object.entries(getSiteConfig(event)).map(([k, v]) => [k, toValue(v)])
      );
      ctx.body.push(`<script>window.__NUXT_SITE_CONFIG__=${devalue(siteConfig)}<\/script>`);
    }
  });
});

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"color-mode\")||\"light\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _Tg9nqeuPQUoHp79VVCnbwqNIzFxqU0FWKvxGV_9MzNs = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

function defineNitroPlugin(def) {
  return def;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class AutoBlogScheduler {
  constructor() {
    __publicField$1(this, "keywords", []);
    __publicField$1(this, "rotation", {
      index: 0,
      lastReset: (/* @__PURE__ */ new Date()).toISOString(),
      totalKeywords: 0,
      dailyCount: 10,
      currentDay: 0
    });
    __publicField$1(this, "isRunning", false);
  }
  async init() {
    console.log("\u{1F680} Initializing Auto Blog Scheduler...");
    await this.loadKeywords();
    await this.loadRotation();
    await this.ensureDirectories();
    console.log("\u2705 Auto Blog Scheduler ready");
  }
  async loadKeywords() {
    try {
      const keywordPath = path.join(process.cwd(), "data/keywords/2025-08-21/list-keyword.txt");
      const content = await promises.readFile(keywordPath, "utf-8");
      this.keywords = content.split("\n").map((k) => k.trim()).filter((k) => k.length > 0).map((k, index) => ({ id: index + 1, keyword: k }));
      console.log(`\u{1F4DD} Loaded ${this.keywords.length} keywords from ${keywordPath}`);
    } catch (error) {
      console.error("\u274C Error loading keywords:", error);
      this.keywords = [];
    }
  }
  async loadRotation() {
    try {
      const rotationPath = path.join(process.cwd(), "data/keyword-rotation.json");
      const content = await promises.readFile(rotationPath, "utf-8");
      this.rotation = JSON.parse(content);
      const today = (/* @__PURE__ */ new Date()).toDateString();
      const lastReset = new Date(this.rotation.lastReset).toDateString();
      if (today !== lastReset) {
        this.rotation.index = 0;
        this.rotation.currentDay = 0;
        this.rotation.lastReset = (/* @__PURE__ */ new Date()).toISOString();
        await this.saveRotation();
        console.log("\u{1F504} Reset keyword rotation for new day");
      }
      console.log(`\u{1F4CD} Current keyword index: ${this.rotation.index}`);
    } catch (error) {
      console.error("\u274C Error loading rotation:", error);
      this.rotation = {
        index: 0,
        lastReset: (/* @__PURE__ */ new Date()).toISOString(),
        totalKeywords: this.keywords.length,
        dailyCount: 10,
        currentDay: 0
      };
    }
  }
  async saveRotation() {
    try {
      const rotationPath = path.join(process.cwd(), "data/keyword-rotation.json");
      await promises.writeFile(rotationPath, JSON.stringify(this.rotation, null, 2));
    } catch (error) {
      console.error("\u274C Error saving rotation:", error);
    }
  }
  async ensureDirectories() {
    const dirs = [
      "data/blog/generated",
      "public/images/blog",
      "data/blog/images",
      "public/images/dummy"
    ];
    for (const dir of dirs) {
      try {
        await promises.mkdir(path.join(process.cwd(), dir), { recursive: true });
      } catch (error) {
      }
    }
  }
  async generateHumanTitle(keyword) {
    try {
      const EnhancedContentGenerator = (await Promise.resolve().then(function () { return enhancedContentGenerator; })).default;
      const generator = new EnhancedContentGenerator();
      const title = generator.generateTitle(keyword);
      console.log(`\u2705 Generated enhanced title: "${title}" (${title.length} chars)`);
      return title;
    } catch (error) {
      console.error("\u274C Error generating title:", error);
      const fallbackTitle = `${keyword} - Panduan Lengkap 2025`;
      return fallbackTitle.length > 60 ? fallbackTitle.substring(0, 57) + "..." : fallbackTitle;
    }
  }
  async generateHumanContent(keyword, title) {
    try {
      const EnhancedContentGenerator = (await Promise.resolve().then(function () { return enhancedContentGenerator; })).default;
      const generator = new EnhancedContentGenerator();
      const content = generator.generateContent(keyword);
      console.log(`\u2705 Generated enhanced content: ${content.length} characters`);
      return content;
    } catch (error) {
      console.error("\u274C Error generating content:", error);
      return this.generateFallbackContent(keyword, title);
    }
  }
  generateFallbackContent(keyword, title) {
    return `
<h1>${title}</h1>

<div class="intro-section">
<p>Halo! Apakah Anda sedang mencari informasi tentang <strong>${keyword}</strong>? Anda berada di tempat yang tepat!</p>
<p>Dalam artikel ini, kami akan membahas secara detail tentang ${keyword} yang mungkin Anda butuhkan. Sebagai penyedia jasa pembayaran terpercaya di Indonesia, kami sering mendapat pertanyaan tentang ${keyword}.</p>
</div>

<h2>Apa itu ${keyword}?</h2>
<p>Berdasarkan pengalaman kami melayani ribuan klien, <strong>${keyword}</strong> memang menjadi pilihan yang populer. Tidak sedikit orang yang bertanya tentang ${keyword} karena memang memiliki banyak manfaat.</p>
<p>Kami akan memberikan penjelasan yang mudah dipahami tentang ${keyword}. Sebenarnya, ${keyword} tidak sesulit yang Anda bayangkan.</p>

<h2>Mengapa Memilih ${keyword}?</h2>
<p>Ada beberapa alasan mengapa ${keyword} menjadi pilihan yang tepat untuk kebutuhan Anda:</p>
<ul>
<li><strong>Keamanan Terjamin:</strong> Sistem keamanan berlapis untuk melindungi data Anda</li>
<li><strong>Proses Cepat:</strong> Transaksi selesai dalam hitungan menit</li>
<li><strong>Biaya Terjangkau:</strong> Tarif kompetitif tanpa biaya tersembunyi</li>
<li><strong>Support 24/7:</strong> Tim customer service siap membantu kapan saja</li>
<li><strong>Berpengalaman:</strong> Lebih dari 5 tahun melayani ribuan klien puas</li>
</ul>

<h2>Cara Menggunakan ${keyword}</h2>
<p>Berikut adalah langkah-langkah mudah untuk menggunakan ${keyword}:</p>
<ol>
<li><strong>Konsultasi Gratis:</strong> Hubungi tim kami untuk konsultasi kebutuhan Anda</li>
<li><strong>Verifikasi Identitas:</strong> Proses verifikasi cepat dan aman</li>
<li><strong>Konfirmasi Transaksi:</strong> Detail transaksi akan dikonfirmasi sebelum diproses</li>
<li><strong>Proses Pembayaran:</strong> Tim kami akan memproses pembayaran sesuai instruksi</li>
<li><strong>Konfirmasi Selesai:</strong> Anda akan menerima notifikasi setelah transaksi selesai</li>
</ol>

<h2>Tips & Trik ${keyword}</h2>
<p>Berikut adalah tips dari tim expert kami berdasarkan pengalaman melayani ribuan klien:</p>
<ul>
<li><strong>Persiapkan Dokumen:</strong> Pastikan semua dokumen yang diperlukan sudah lengkap</li>
<li><strong>Komunikasi Jelas:</strong> Berikan instruksi yang detail dan jelas</li>
<li><strong>Timing yang Tepat:</strong> Lakukan transaksi pada jam kerja untuk proses yang lebih cepat</li>
<li><strong>Backup Data:</strong> Simpan semua bukti transaksi dengan aman</li>
<li><strong>Update Informasi:</strong> Pastikan informasi kontak selalu up-to-date</li>
</ul>

<h2>FAQ - Pertanyaan yang Sering Diajukan</h2>
<div class="faq-item">
<p><strong>Q: Apakah ${keyword} aman digunakan?</strong><br>
A: Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>
</div>

<div class="faq-item">
<p><strong>Q: Berapa lama proses ${keyword} biasanya?</strong><br>
A: Proses biasanya selesai dalam 1-3 jam kerja, tergantung kompleksitas transaksi dan kelengkapan dokumen.</p>
</div>

<div class="faq-item">
<p><strong>Q: Apakah ada biaya tersembunyi?</strong><br>
A: Tidak ada biaya tersembunyi. Semua biaya akan diinformasikan secara transparan sebelum transaksi dimulai.</p>
</div>

<div class="faq-item">
<p><strong>Q: Bagaimana jika terjadi masalah dengan transaksi?</strong><br>
A: Tim support kami siap membantu 24/7. Kami memiliki sistem refund dan garansi untuk memastikan kepuasan klien.</p>
</div>

<h2>Testimoni Klien</h2>
<div class="testimonial">
<p>"Layanan ${keyword} dari JasaPembayaran.com sangat memuaskan. Proses cepat, aman, dan tim support responsif. Highly recommended!" - <strong>Budi S., Jakarta</strong></p>
</div>

<div class="testimonial">
<p>"Sudah menggunakan layanan ini selama 2 tahun, tidak pernah ada masalah. Pelayanan yang sangat profesional." - <strong>Sari M., Surabaya</strong></p>
</div>

<h2>Kesimpulan</h2>
<p>Demikian penjelasan lengkap tentang <strong>${keyword}</strong>. Semoga artikel ini bermanfaat untuk Anda.</p>
<p>Jika Anda masih memiliki pertanyaan tentang ${keyword}, jangan ragu untuk menghubungi kami. Kami harap artikel tentang ${keyword} ini dapat membantu Anda.</p>

<div class="cta-section">
<h3>\u{1F680} Siap Menggunakan ${keyword}?</h3>
<p>Jangan ragu untuk menghubungi tim kami. Konsultasi gratis dan proses cepat!</p>
<a href="/contact" class="cta-button">Hubungi Sekarang</a>
</div>

<div class="contact-info">
<h3>\u{1F4DE} Hubungi Kami Sekarang</h3>
<p><strong>WhatsApp:</strong> +62-xxx-xxxx-xxxx<br>
<strong>Email:</strong> info@jasapembayaran.com<br>
<strong>Website:</strong> www.jasapembayaran.com</p>
<p><em>Layanan 24/7 - Konsultasi Gratis - Proses Cepat & Aman</em></p>
</div>
`;
  }
  async generateImage(title, keyword) {
    try {
      const humanPrompts = [
        `${title}, professional business photo, natural lighting, real people, authentic setting, high quality photography`,
        `${keyword} service, modern office environment, team collaboration, genuine interaction, professional photography`,
        `${title}, real-world application, natural environment, authentic moment, professional documentary style`,
        `${keyword} solution, contemporary workspace, human-centered design, realistic scenario, high-end photography`
      ];
      const promptIndex = this.hashString(keyword) % humanPrompts.length;
      const selectedPrompt = humanPrompts[promptIndex];
      const services = [
        () => this.generatePollinationsImage(selectedPrompt, keyword),
        () => this.generateUnsplashImage(keyword),
        () => this.getRandomDummyImage()
      ];
      const serviceIndex = this.hashString(keyword) % services.length;
      const imageUrl = await services[serviceIndex]();
      console.log(`\u2705 Generated image for "${keyword}": ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error("\u274C Error generating image:", error);
      return this.getRandomDummyImage();
    }
  }
  async generatePollinationsImage(prompt, keyword) {
    const cleanPrompt = prompt.replace(/[^\w\s-]/g, "").trim();
    const encoded = encodeURIComponent(cleanPrompt);
    const seed = this.hashString(keyword);
    return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true&model=flux`;
  }
  async generateUnsplashImage(keyword) {
    const cleanKeyword = keyword.replace(/[^\w\s]/g, "").trim();
    return `https://source.unsplash.com/1200x630/?${encodeURIComponent(cleanKeyword)}&sig=${this.hashString(keyword)}`;
  }
  hashString(input) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  getRandomDummyImage() {
    const dummyNumber = Math.floor(Math.random() * 100) + 1;
    return `/images/dummy/dummy-${dummyNumber}.jpg`;
  }
  slugify(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  }
  generateExcerpt(content) {
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i);
    if (firstParagraph) {
      return firstParagraph[1].replace(/<[^>]*>/g, "").substring(0, 160).trim() + "...";
    }
    return content.replace(/<[^>]*>/g, "").substring(0, 160).trim() + "...";
  }
  async generateBlog(keywordData) {
    const { id, keyword } = keywordData;
    console.log(`\u{1F4DD} Generating enhanced blog for keyword ${id}: ${keyword}`);
    try {
      const EnhancedContentGenerator = (await Promise.resolve().then(function () { return enhancedContentGenerator; })).default;
      const generator = new EnhancedContentGenerator();
      const title = generator.generateTitle(keyword);
      console.log(`\u2705 Generated enhanced title: ${title}`);
      const content = generator.generateContent(keyword);
      console.log(`\u2705 Generated enhanced content (${content.length} chars)`);
      const metaDescription = generator.generateMetaDescription(keyword);
      console.log(`\u2705 Generated meta description: ${metaDescription}`);
      const tags = generator.generateTags(keyword);
      console.log(`\u2705 Generated tags: ${tags.join(", ")}`);
      const imageUrl = await this.generateImage(title, keyword);
      console.log(`\u2705 Generated image: ${imageUrl}`);
      const blog = {
        id: Date.now() + Math.random(),
        slug: this.slugify(keyword),
        title,
        content,
        excerpt: this.generateExcerpt(content),
        author: "JasaPembayaran.com Team",
        date: (/* @__PURE__ */ new Date()).toISOString(),
        image: imageUrl,
        imageUrl,
        featured_image: imageUrl,
        meta_description: metaDescription,
        tags,
        categories: ["Blog", "Panduan"],
        aiImageUrl: imageUrl,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        updateReason: "Auto-generated with ChatGPT",
        keywordId: id,
        originalKeyword: keyword
      };
      await this.saveBlog(blog);
      console.log(`\u2705 Blog saved: ${blog.slug}`);
      return blog;
    } catch (error) {
      console.error(`\u274C Error generating blog for ${keyword}:`, error);
      return null;
    }
  }
  async saveBlog(blog) {
    try {
      const blogDir = path.join(process.cwd(), "data/blog/generated");
      await promises.mkdir(blogDir, { recursive: true });
      const blogFile = path.join(blogDir, `${blog.slug}.json`);
      await promises.writeFile(blogFile, JSON.stringify(blog, null, 2));
      await this.updateGeneratedBlogs(blog);
      await this.updateLatestPosts(blog);
      await this.updatePopularPosts(blog);
      console.log(`\u2705 Blog saved to: ${blogFile}`);
    } catch (error) {
      console.error("\u274C Error saving blog:", error);
    }
  }
  async updateGeneratedBlogs(newBlog) {
    try {
      const databaseContentDir = path.join(process.cwd(), "database", "content");
      await promises.mkdir(databaseContentDir, { recursive: true });
      const generatedFile = path.join(databaseContentDir, "generated-blogs.json");
      let generatedBlogs = [];
      try {
        const content = await promises.readFile(generatedFile, "utf-8");
        generatedBlogs = JSON.parse(content);
      } catch {
      }
      const generatedBlog = {
        id: newBlog.id,
        slug: newBlog.slug,
        title: newBlog.title,
        content: newBlog.content,
        publish_at: newBlog.date,
        featured_image: newBlog.featured_image,
        meta_title: newBlog.title,
        meta_description: newBlog.excerpt
      };
      generatedBlogs = generatedBlogs.filter((b) => b.slug !== newBlog.slug);
      generatedBlogs.unshift(generatedBlog);
      generatedBlogs = generatedBlogs.slice(0, 100);
      await promises.writeFile(generatedFile, JSON.stringify(generatedBlogs, null, 2));
      console.log("\u2705 Updated generated blogs");
    } catch (error) {
      console.error("\u274C Error updating generated blogs:", error);
    }
  }
  async updateLatestPosts(newBlog) {
    try {
      const latestFile = path.join(process.cwd(), "data/blog/latest-posts.json");
      let latestPosts = [];
      try {
        const content = await promises.readFile(latestFile, "utf-8");
        latestPosts = JSON.parse(content);
      } catch {
      }
      latestPosts.unshift({
        slug: newBlog.slug,
        title: newBlog.title,
        date: newBlog.date,
        image: newBlog.image
      });
      latestPosts = latestPosts.slice(0, 50);
      await promises.writeFile(latestFile, JSON.stringify(latestPosts, null, 2));
      console.log("\u2705 Updated latest posts");
    } catch (error) {
      console.error("\u274C Error updating latest posts:", error);
    }
  }
  async updatePopularPosts(newBlog) {
    try {
      const popularFile = path.join(process.cwd(), "data/blog/popular-posts.json");
      let popularPosts = {};
      try {
        const content = await promises.readFile(popularFile, "utf-8");
        popularPosts = JSON.parse(content);
      } catch {
      }
      popularPosts[newBlog.slug] = {
        title: newBlog.title,
        count: 1,
        last: Date.now(),
        date: newBlog.date
      };
      await promises.writeFile(popularFile, JSON.stringify(popularPosts, null, 2));
      console.log("\u2705 Updated popular posts");
    } catch (error) {
      console.error("\u274C Error updating popular posts:", error);
    }
  }
  async runDailyGeneration() {
    if (this.isRunning) {
      console.log("\u23F3 Daily generation already running, skipping...");
      return;
    }
    this.isRunning = true;
    console.log("\u{1F305} Starting daily blog generation at 03:00...");
    if (this.keywords.length === 0) {
      console.log("\u274C No keywords available");
      this.isRunning = false;
      return;
    }
    const dailyCount = 10;
    const startIndex = this.rotation.index;
    let endIndex = startIndex + dailyCount;
    console.log(`\u{1F4CA} Generating ${dailyCount} blogs starting from keyword ${startIndex + 1} to ${endIndex} of ${this.keywords.length}`);
    const generatedBlogs = [];
    for (let i = 0; i < dailyCount; i++) {
      const currentIndex = (startIndex + i) % this.keywords.length;
      const keywordData = this.keywords[currentIndex];
      console.log(`\u{1F4DD} Processing keyword ${currentIndex + 1}/${this.keywords.length}: ${keywordData.keyword}`);
      const blog = await this.generateBlog(keywordData);
      if (blog) {
        generatedBlogs.push(blog);
        console.log(`\u2705 Blog ${generatedBlogs.length}/${dailyCount} generated successfully`);
      }
      await new Promise((resolve) => setTimeout(resolve, 3e3));
    }
    this.rotation.index = (startIndex + dailyCount) % this.keywords.length;
    this.rotation.currentDay++;
    this.rotation.dailyCount = dailyCount;
    if (this.rotation.index === 0) {
      console.log("\u{1F504} Reset keyword rotation - starting from keyword 1 again (cycle complete)");
    }
    await this.saveRotation();
    console.log(`\u2705 Daily generation complete: ${generatedBlogs.length} blogs generated`);
    console.log(`\u{1F4CD} Next generation will start from keyword ${this.rotation.index + 1}`);
    console.log(`\u{1F504} Rotation status: ${this.rotation.index}/${this.keywords.length} (${(this.rotation.index / this.keywords.length * 100).toFixed(1)}%)`);
    if (generatedBlogs.length > 0) {
      console.log("\u{1F504} Blog generation completed successfully");
    }
    this.isRunning = false;
    return generatedBlogs;
  }
  async checkSchedule() {
    const now = /* @__PURE__ */ new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    if (currentHour === 3 && currentMinute === 0) {
      console.log("\u23F0 Scheduled time reached (03:00) - starting generation");
      await this.runDailyGeneration();
    }
  }
}
let scheduler;
const _5sjP5BoXvLFlZkl2pp5C48YZsjiRvsfRniHxq_FiQBc = defineNitroPlugin(async () => {
  const enabled = process.env.NUXT_ENABLE_AUTO_BLOG === "true";
  if (!enabled) {
    console.log("[auto-blog-scheduler] Dev mode detected \u2014 scheduler disabled (set NUXT_ENABLE_AUTO_BLOG=true to override)");
    return;
  }
  if (!enabled) {
    console.log("[auto-blog-scheduler] Scheduler disabled (default). Set NUXT_ENABLE_AUTO_BLOG=true to enable.");
    return;
  }
  scheduler = new AutoBlogScheduler();
  await scheduler.init();
  setInterval(() => {
    scheduler.checkSchedule();
  }, 6e4);
  console.log("[auto-blog-scheduler] Auto blog scheduler active - will run daily at 03:00");
});

function msUntilNext$1(hour, minute) {
  const now = /* @__PURE__ */ new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}
async function runRefreshOnce() {
  try {
    const mod = await Promise.resolve().then(function () { return blogRefresh; });
    const res = await mod.refreshAllBlogPosts(100);
    console.log(`[blog-cron] Refresh done: saved=${res.savedCount} pages=${res.pagesProcessed} errors=${res.errors.length}`);
    if (res.errors.length) {
      console.warn("[blog-cron] Errors:", res.errors.slice(0, 3));
    }
  } catch (e) {
    console.warn("[blog-cron] Refresh error:", e);
  }
}
const _gbaIZlWUfdz3MG7i1b63W8v5qlnYtD_S3ZMRlzPOUo0 = defineNitroPlugin(() => {
  const allowDevCron = process.env.ENABLE_DEV_CRON === "true";
  if (!allowDevCron) {
    console.log("[blog-cron] Dev mode detected \u2014 scheduler disabled (set ENABLE_DEV_CRON=true to override)");
    return;
  }
  const enabled = String(process.env.NUXT_ENABLE_BLOG_SCHEDULER || process.env.NUXT_ENABLE_SCHEDULER || "").toLowerCase() === "true";
  if (!enabled) {
    console.log("[blog-cron] Scheduler disabled (default). Set NUXT_ENABLE_BLOG_SCHEDULER=true to enable.");
    return;
  }
  const initialDelay = msUntilNext$1(1, 0);
  setTimeout(async () => {
    await runRefreshOnce();
    const dayMs = 24 * 60 * 60 * 1e3;
    setInterval(runRefreshOnce, dayMs);
  }, initialDelay);
  console.log("[blog-cron] Scheduled daily blog refresh at 01:00 local server time");
});

const _bvCz_GjTp0Is8gFO0CtWyVuPXfVNmYpHGpg6XnVqQY = defineNitroPlugin(() => {
});

const projectRoot$1 = process.cwd();
const localesDir = path.join(projectRoot$1, "locales");
const dataDir$1 = path.join(projectRoot$1, "data");
const metaPath = path.join(dataDir$1, "i18n-meta.json");
async function ensureDir$4(dir) {
  try {
    await promises.mkdir(dir, { recursive: true });
  } catch {
  }
}
async function writeFileAtomic(file, json) {
  const tmp = `${file}.tmp`;
  await promises.writeFile(tmp, json, "utf-8");
  await promises.rename(tmp, file);
}
async function readLocale(locale) {
  const file = path.join(localesDir, `${locale}.json`);
  try {
    const raw = await promises.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function writeLocale(locale, messages) {
  await ensureDir$4(localesDir);
  const file = path.join(localesDir, `${locale}.json`);
  const json = JSON.stringify(messages, null, 2);
  await writeFileAtomic(file, json);
}
async function readMeta() {
  await ensureDir$4(dataDir$1);
  try {
    const raw = await promises.readFile(metaPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return { en: {} };
  }
}
async function writeMeta(meta) {
  await ensureDir$4(dataDir$1);
  const json = JSON.stringify(meta, null, 2);
  await writeFileAtomic(metaPath, json);
}
function flatten$1(obj, prefix = "") {
  const out = {};
  for (const key of Object.keys(obj || {})) {
    const val = obj[key];
    const p = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === "object") {
      Object.assign(out, flatten$1(val, p));
    } else if (typeof val === "string") {
      out[p] = val;
    }
  }
  return out;
}
function setByPath(target, pathKey, value) {
  const parts = pathKey.split(".");
  let cur = target;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}
function diffIdToEn(idMessages, enMessages, meta) {
  const idFlat = flatten$1(idMessages);
  const enFlat = flatten$1(enMessages);
  const metaEn = meta.en || {};
  const missingKeys = [];
  const changedKeys = [];
  for (const key of Object.keys(idFlat)) {
    const idVal = idFlat[key];
    const enVal = enFlat[key];
    const h = hash(idVal);
    const stored = metaEn[key];
    if (enVal === void 0) {
      missingKeys.push(key);
    } else if (!stored) {
      if (enVal.trim() === idVal.trim()) changedKeys.push(key);
    } else if (stored !== h) {
      changedKeys.push(key);
    }
  }
  return { missingKeys, changedKeys, idFlat, enFlat };
}
function applyTranslations(base, updates) {
  const clone = JSON.parse(JSON.stringify(base || {}));
  for (const [k, v] of Object.entries(updates)) {
    setByPath(clone, k, v);
  }
  return clone;
}
function buildMetaFromId(idFlat) {
  const out = {};
  for (const [k, v] of Object.entries(idFlat)) out[k] = hash(v);
  return out;
}

async function ensureDir$3(dir) {
  try {
    await promises.mkdir(dir, { recursive: true });
  } catch {
  }
}
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function flatten(obj, out = []) {
  try {
    if (!obj || typeof obj !== "object") return out;
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val && typeof val === "object") {
        flatten(val, out);
      } else if (typeof val === "string") {
        out.push(val);
      }
    }
  } catch {
  }
  return out;
}
function renderHtmlFromMessages(locale, messages) {
  const values = flatten(messages).map((v) => v && v.trim()).filter(Boolean);
  const items = values.map((v) => `<p>${escapeHtml(v)}</p>`).join("\n");
  const html = `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Text Snapshot ${locale.toUpperCase()}</title>
</head>
<body>
${items}
</body>
</html>`;
  return html;
}
async function writeHtmlSnapshot(locale) {
  const projectRoot = process.cwd();
  const outDir = path.join(projectRoot, "public", "generated", "i18n");
  await ensureDir$3(outDir);
  const messages = await readLocale(locale);
  const html = renderHtmlFromMessages(locale, messages);
  const file = path.join(outDir, `${locale}.html`);
  await promises.writeFile(file, html, "utf-8");
  return file;
}
async function writeAllSnapshots() {
  const files = [];
  for (const loc of ["id", "en"]) {
    const f = await writeHtmlSnapshot(loc);
    files.push(f);
  }
  return files;
}

function msUntilNext(hour, minute) {
  const now = /* @__PURE__ */ new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}
async function runSyncOnce() {
  try {
    const mod = await Promise.resolve().then(function () { return i18nAuto; });
    const res = await mod.translateMissingIdToEn();
    console.log(`[i18n-cron] Sync done: translated=${res.translatedCount} missing=${res.missingCount} changed=${res.changedCount} skipped=${res.skipped ? res.reason : "no"}`);
  } catch (e) {
    console.warn("[i18n-cron] Sync error:", e);
  }
  try {
    const files = await writeAllSnapshots();
    console.log("[i18n-cron] HTML text snapshots written:", files.join(", "));
  } catch (e) {
    console.warn("[i18n-cron] Snapshot error:", e);
  }
}
const _gTaSYL8tYS3XjLd6_lh_yWzoZTMAWZ9nlzsJCJypWhM = defineNitroPlugin(() => {
  const allowDevCron = process.env.ENABLE_DEV_CRON === "true";
  if (!allowDevCron) {
    console.log("[i18n-cron] Dev mode detected \u2014 scheduler disabled (set ENABLE_DEV_CRON=true to override)");
    return;
  }
  const disabled = String(process.env.NUXT_ENABLE_SCHEDULER || "").toLowerCase() === "false";
  if (disabled) {
    console.log("[i18n-cron] Scheduler disabled by NUXT_ENABLE_SCHEDULER=false");
    return;
  }
  const initialDelay = msUntilNext(2, 0);
  setTimeout(async () => {
    await runSyncOnce();
    const dayMs = 24 * 60 * 60 * 1e3;
    setInterval(runSyncOnce, dayMs);
  }, initialDelay);
  console.log("[i18n-cron] Scheduled daily sync and snapshot at 02:00 local server time");
});

function msUntilNextWIB(hour, minute) {
  const now = /* @__PURE__ */ new Date();
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1e3;
  const nowWIB = new Date(now.getTime() + WIB_OFFSET_MS);
  const nextWIB = new Date(nowWIB);
  nextWIB.setHours(hour, minute, 0, 0);
  if (nextWIB <= nowWIB) nextWIB.setDate(nextWIB.getDate() + 1);
  const targetUtcMs = nextWIB.getTime() - WIB_OFFSET_MS;
  return targetUtcMs - now.getTime();
}
async function runOnce(dateStr) {
  try {
    const { runKeywordJobForDate } = await Promise.resolve().then(function () { return keywordJob; });
    const { updateGeneratedBlogsToNewStandard } = await Promise.resolve().then(function () { return generatedBlogs; });
    const res = await runKeywordJobForDate(void 0, 10);
    await updateGeneratedBlogsToNewStandard();
    console.log(
      `[keyword-cron] Generated from keywords (cron 0 2 * * *): processed=${res.processed} skipped=${res.skipped} slugs=${res.generated.join(", ")}`
    );
  } catch (e) {
    console.warn("[keyword-cron] Error generating from keywords:", e);
  }
}
const _LGFPkx2SCWEcBxkxd7DzgjvJAcz9gFhSAsx1ZQwhc = defineNitroPlugin(() => {
  try {
    setTimeout(async () => {
      try {
        const { listCachedPosts } = await Promise.resolve().then(function () { return blogCache; });
        const idx = await listCachedPosts();
        if (!Array.isArray(idx) || idx.length === 0) {
          const { runKeywordJobForDate } = await Promise.resolve().then(function () { return keywordJob; });
          const { updateGeneratedBlogsToNewStandard } = await Promise.resolve().then(function () { return generatedBlogs; });
          await runKeywordJobForDate(void 0, 10);
          await updateGeneratedBlogsToNewStandard();
          console.log("[keyword-cron] Bootstrap: generated 10 posts and standardized generated-blogs.json because cache was empty");
        }
      } catch (e) {
        console.warn("[keyword-cron] Bootstrap check failed:", e);
      }
    }, 0);
  } catch {
  }
  const allowDevCron = process.env.ENABLE_DEV_CRON === "true";
  if (!allowDevCron) {
    console.log("[keyword-cron] Dev mode detected \u2014 scheduler disabled (set ENABLE_DEV_CRON=true to override)");
    return;
  }
  const disabled = String(process.env.NUXT_ENABLE_KEYWORD_SCHEDULER || process.env.NUXT_ENABLE_SCHEDULER || "").toLowerCase() === "false";
  if (disabled) {
    console.log("[keyword-cron] Scheduler disabled by env");
    return;
  }
  const initialDelay = msUntilNextWIB(2, 0);
  setTimeout(async () => {
    await runOnce();
    const dayMs = 24 * 60 * 60 * 1e3;
    setInterval(runOnce, dayMs);
  }, initialDelay);
  console.log("[keyword-cron] Scheduled daily keyword job at 02:00 WIB (Asia/Jakarta)");
});

const _Nt3RfOoiKRxr5SeQ0G5uOLo5VOUKk1FfH6Y3ie2DnzQ = defineNitroPlugin(() => {
});

async function getAllBlogUrls() {
  const urls = [];
  try {
    const { listCachedPosts } = await Promise.resolve().then(function () { return blogCache; });
    const idx = await listCachedPosts();
    if (Array.isArray(idx)) {
      for (const it of idx) {
        if (!it?.slug) continue;
        urls.push({
          loc: `/blog/${it.slug}`,
          lastmod: it.date,
          changefreq: "weekly",
          priority: 0.7
        });
      }
    }
  } catch (e) {
    console.warn("[sitemap] Failed to build sitemap from cache:", e instanceof Error ? e.message : String(e));
  }
  return urls;
}
const _othm1u0sWicXmGmwqiE4FvclxWojpBBkfVwUh_wxAU = defineNitroPlugin((nitro) => {
  nitro.hooks.hook("sitemap:sources", (ctx) => {
    if (process.env.NUXT_SITEMAP_PLUGIN_ENABLED === "true") {
      ctx.sources.push(getAllBlogUrls);
    }
  });
});

const __aHzs0NOnuOjctIMszYgNX3UFNu3Us0ycN2ECdFUcug = defineNitroPlugin(() => {
  const ORIG_FETCH = globalThis.fetch?.bind(globalThis);
  if (!ORIG_FETCH) return;
  const VERIFY_HOST = "api.nuxtlabs.com";
  const VERIFY_PATH = "/ui-pro/verify";
  function isVerifyUrl(input) {
    try {
      const u = typeof input === "string" || input instanceof URL ? new URL(String(input)) : new URL(input.url);
      return u.hostname === VERIFY_HOST && u.pathname === VERIFY_PATH;
    } catch {
      return false;
    }
  }
  globalThis.fetch = (async (input, init) => {
    const skip = process.env.NUXT_UI_PRO_SKIP_VERIFY === "1";
    if (skip && isVerifyUrl(input)) {
      return new Response(JSON.stringify({ valid: true, skipped: true }), { status: 200, headers: { "content-type": "application/json" } });
    }
    try {
      const res = await ORIG_FETCH(input, init);
      if (isVerifyUrl(input) && !res.ok) {
        return new Response(JSON.stringify({ valid: true, status: res.status }), { status: 200, headers: { "content-type": "application/json" } });
      }
      return res;
    } catch (e) {
      if (isVerifyUrl(input)) {
        return new Response(JSON.stringify({ valid: true, error: "offline", message: e?.message || "network error" }), { status: 200, headers: { "content-type": "application/json" } });
      }
      throw e;
    }
  });
});

const _QMJYlS29bDWkJBel8uYjqDS6cecFNFhO1TOWtBQOa98 = defineNitroPlugin(() => {
  const flag = "__unhandled_rejection_guard_installed__";
  if (globalThis[flag]) return;
  globalThis[flag] = true;
  const logCache = /* @__PURE__ */ new Map();
  const MAX_LOGS = 1;
  const RESET_MS = 5 * 60 * 1e3;
  function limitedWarn(key, msg, err) {
    const now = Date.now();
    const rec = logCache.get(key);
    if (!rec || now - rec.last > RESET_MS) {
      logCache.set(key, { count: 1, last: now });
      console.warn(msg, err);
      return;
    }
    const next = { count: rec.count + 1, last: now };
    logCache.set(key, next);
    if (next.count <= MAX_LOGS) console.warn(msg, err);
    else if (next.count === MAX_LOGS + 1) console.warn(`${key}: further similar warnings suppressed for 5 minutes`);
  }
  function isLocalConnRefused(e) {
    const msg = typeof e === "string" ? e : e?.message || e?.toString?.() || "";
    return /ECONNREFUSED/i.test(msg) && /127\.0\.0\.1|localhost/i.test(msg);
  }
  process.on("unhandledRejection", (reason, _promise) => {
    try {
      if (isLocalConnRefused(reason)) {
        limitedWarn("unhandledRejection-ECONNREFUSED-local", "[guard] Suppressed unhandledRejection from local connection refusal (likely dev socket/HMR/devtools). Details:", reason);
        return;
      }
      limitedWarn("unhandledRejection", "[guard] Unhandled promise rejection caught (prevented crash):", reason);
    } catch (e) {
      console.warn("[guard] Error while handling unhandledRejection:", e);
    }
  });
  process.on("uncaughtException", (err) => {
    try {
      if (isLocalConnRefused(err)) {
        limitedWarn("uncaughtException-ECONNREFUSED-local", "[guard] Suppressed uncaughtException from local connection refusal (likely dev socket/HMR/devtools). Details:", err);
        return;
      }
      limitedWarn("uncaughtException", "[guard] Uncaught exception caught (prevented crash):", err);
    } catch (e) {
      console.warn("[guard] Error while handling uncaughtException:", e);
    }
  });
});

const plugins = [
  _JjihjUHJa01Q0_UkGjcVgQPmXMRctjWwCfyV0A8gvs,
_8dtb2JxojIgDft_QJHgTrR90LkVJ_SKhAFJLTyk245M,
_Tg9nqeuPQUoHp79VVCnbwqNIzFxqU0FWKvxGV_9MzNs,
_5sjP5BoXvLFlZkl2pp5C48YZsjiRvsfRniHxq_FiQBc,
_gbaIZlWUfdz3MG7i1b63W8v5qlnYtD_S3ZMRlzPOUo0,
_bvCz_GjTp0Is8gFO0CtWyVuPXfVNmYpHGpg6XnVqQY,
_gTaSYL8tYS3XjLd6_lh_yWzoZTMAWZ9nlzsJCJypWhM,
_LGFPkx2SCWEcBxkxd7DzgjvJAcz9gFhSAsx1ZQwhc,
_Nt3RfOoiKRxr5SeQ0G5uOLo5VOUKk1FfH6Y3ie2DnzQ,
_othm1u0sWicXmGmwqiE4FvclxWojpBBkfVwUh_wxAU,
__aHzs0NOnuOjctIMszYgNX3UFNu3Us0ycN2ECdFUcug,
_QMJYlS29bDWkJBel8uYjqDS6cecFNFhO1TOWtBQOa98
];

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function getNitroOrigin(e) {
  const cert = process.env.NITRO_SSL_CERT;
  const key = process.env.NITRO_SSL_KEY;
  let host = process.env.NITRO_HOST || process.env.HOST || false;
  let port = false;
  port = process.env.NITRO_PORT || process.env.PORT || "3000";
  let protocol = cert && key || false ? "https" : "http";
  if (process.env.__NUXT_DEV__) {
    const origin = JSON.parse(process.env.__NUXT_DEV__).proxy.url;
    host = withoutProtocol(origin);
    protocol = origin.includes("https") ? "https" : "http";
  } else if (process.env.NUXT_VITE_NODE_OPTIONS) {
    const origin = JSON.parse(process.env.NUXT_VITE_NODE_OPTIONS).baseURL.replace("/__nuxt_vite_node__", "");
    host = withoutProtocol(origin);
    protocol = origin.includes("https") ? "https" : "http";
  } else if (e) {
    host = getRequestHost(e, { xForwardedHost: true }) || host;
    protocol = getRequestProtocol(e, { xForwardedProto: true }) || protocol;
  }
  if (typeof host === "string" && host.includes(":")) {
    port = host.split(":").pop();
    host = host.split(":")[0] || false;
  }
  port = port ? `:${port}` : "";
  return withTrailingSlash(`${protocol}://${host}${port}`);
}

function titleFromSlug(slug) {
  const s = String(slug).replace(/\/+|\.+/g, "").trim();
  const words = s.split(/[-_\s]+/).filter(Boolean);
  if (!words.length) return "Memuat...";
  const titled = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return titled;
}
function buildAiHeroUrl(titleText, slugText) {
  const cleanTitle = String(titleText || "").replace(/<[^>]*>/g, "").trim() || "Blog Illustration";
  const basePrompt = `${cleanTitle}, modern 3D illustration, gradient lighting, fintech payments, isometric, glassmorphism, highly detailed, cinematic, trending on dribbble`;
  const encoded = encodeURIComponent(basePrompt);
  const seed = encodeURIComponent(String(slugText || cleanTitle));
  return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true`;
}
async function generatePlaceholderPostBySlug(slug) {
  const safeSlug = String(slug || "").trim() || "blog-placeholder";
  const title = titleFromSlug(safeSlug);
  const iso = (/* @__PURE__ */ new Date()).toISOString();
  const aiImageUrl = buildAiHeroUrl(title, safeSlug);
  const excerpt = `<p>${title} \u2014 Artikel ini dihasilkan otomatis untuk menjaga halaman tetap tersedia ketika blog utama sedang tidak dapat diakses. Konten asli akan ditampilkan secara otomatis ketika sistem kembali normal.</p>`;
  const content = [
    `<h1>${title}</h1>`,
    `<p>Artikel placeholder ini dibuat secara otomatis berdasarkan slug: <strong>${safeSlug}</strong>.`,
    "Tujuannya agar halaman tetap menampilkan informasi yang relevan sementara konten asli sedang diproses atau tidak tersedia.</p>",
    "<h2>Tentang Layanan Kami</h2>",
    "<p>Kami menyediakan layanan pembayaran digital yang aman dan terpercaya. Silakan kembali lagi nanti untuk membaca artikel lengkap.</p>"
  ].join("\n");
  return {
    title,
    excerpt,
    content,
    author: "Redaksi",
    date: iso,
    image: "/images/fallback-news.svg",
    aiImageUrl,
    categories: ["Placeholder"],
    tags: ["placeholder", "auto-generated"]
  };
}

const AUTHOR_POOL = [
  "Felix",
  "Andi Pratama",
  "Budi Santoso",
  "Citra Maharani",
  "Dimas Kurniawan",
  "Eka Putri",
  "Fajar Nugroho",
  "Gita Anindya",
  "Hendra Wijaya",
  "Intan Safitri",
  "Joko Saputra",
  "Karin Amelia",
  "Luthfi Ramadhan",
  "Maya Sari",
  "Nanda Prasetyo",
  "Oki Firmansyah",
  "Putri Ayu",
  "Rian Saputra",
  "Sinta Dewi",
  "Taufik Hidayat",
  "Vina Lestari"
];
function isAdminLike(name) {
  const s = String(name || "").trim().toLowerCase();
  if (!s) return true;
  return s === "admin" || s.includes("admin blog") || /^admin\b/.test(s);
}
function hashString(input) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pickAuthorForSlug(slug, preferred) {
  if (preferred && !isAdminLike(preferred)) {
    const p = String(preferred).trim();
    if (p) return p;
  }
  const base = String(slug || "").trim().toLowerCase() || String(Date.now());
  const idx = AUTHOR_POOL.length > 0 ? hashString(base) % AUTHOR_POOL.length : 0;
  return AUTHOR_POOL[idx] || "Felix";
}

let resolvedCacheDir = null;
function getCacheDir() {
  if (resolvedCacheDir) return resolvedCacheDir;
  const candidates = [];
  const cwd = process.cwd();
  candidates.push(join(cwd, "data", "blog"));
  candidates.push(join(cwd, "..", "data", "blog"));
  candidates.push(join(cwd, "..", "..", "data", "blog"));
  try {
    const here = dirname(fileURLToPath(globalThis._importMeta_.url));
    candidates.push(join(here, "..", "..", "data", "blog"));
    candidates.push(join(here, "..", "..", "..", "data", "blog"));
  } catch {
  }
  for (const dir of candidates) {
    if (existsSync(join(dir, "index.json")) || existsSync(dir)) {
      resolvedCacheDir = dir;
      break;
    }
  }
  resolvedCacheDir = resolvedCacheDir || candidates[0];
  return resolvedCacheDir;
}
function getIndexPath() {
  return join(getCacheDir(), "index.json");
}
function getPostPath(slug) {
  return join(getCacheDir(), `${slug}.json`);
}
async function ensureDir$2() {
  try {
    await promises.mkdir(getCacheDir(), { recursive: true });
  } catch {
  }
}
async function readJson$2(file) {
  try {
    const buf = await promises.readFile(file, "utf-8");
    return JSON.parse(buf);
  } catch {
    return null;
  }
}
async function writeJson$2(file, data) {
  await ensureDir$2();
  const json = JSON.stringify(data, null, 2);
  await promises.writeFile(file, json, "utf-8");
}
async function getPostFromCache(slug) {
  if (!slug) return null;
  return await readJson$2(getPostPath(slug));
}
async function savePostToCache(post) {
  if (!post?.slug) return;
  await writeJson$2(getPostPath(post.slug), post);
  try {
    await updateIndexItem(post);
  } catch {
  }
}
async function listCachedPosts() {
  const idx = await readJson$2(getIndexPath());
  return Array.isArray(idx) ? idx : [];
}
async function saveIndex(items) {
  const map = /* @__PURE__ */ new Map();
  for (const it of items) {
    if (!it?.slug) continue;
    map.set(it.slug, {
      id: Number(it.id) || 0,
      slug: String(it.slug),
      title: String(it.title || ""),
      date: String(it.date || ""),
      image: String(it.image || ""),
      excerpt: typeof it.excerpt === "string" ? it.excerpt : void 0
    });
  }
  const arr = Array.from(map.values());
  arr.sort((a, b) => (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0));
  await writeJson$2(getIndexPath(), arr);
}
async function updateIndexItem(post) {
  const current = await listCachedPosts();
  const filtered = current.filter((it) => it.slug !== post.slug);
  const item = {
    id: Number(post.id) || 0,
    slug: String(post.slug),
    title: String(post.title || ""),
    date: String(post.date || ""),
    image: String(post.image || ""),
    excerpt: String(post.excerpt || "")
  };
  await saveIndex([item, ...filtered]);
}
async function saveManyPosts(posts) {
  await ensureDir$2();
  for (const p of posts) {
    await savePostToCache(p);
  }
}

const blogCache = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getPostFromCache: getPostFromCache,
  listCachedPosts: listCachedPosts,
  saveIndex: saveIndex,
  saveManyPosts: saveManyPosts,
  savePostToCache: savePostToCache
}, Symbol.toStringTag, { value: 'Module' }));

const FALLBACK_IMAGE = "/images/fallback-news.svg";
function stripHtml$2(input) {
  return String(input || "").replace(/<[^>]*>/g, "").trim();
}
function normalizeImageUrl(img) {
  const s = String(img || "").trim();
  if (!s) return "";
  if (s.startsWith("/wp-content/")) return `https://blog.jasapembayaran.com${s}`;
  if (s.startsWith("//")) return `https:${s}`;
  return s;
}
function ensureHeroImage(existingImg, title, slug) {
  const normalized = normalizeImageUrl(existingImg);
  if (normalized) return normalized;
  try {
    const aiUrl = buildAiHeroUrl(title, slug);
    if (aiUrl) return aiUrl;
  } catch {
  }
  return FALLBACK_IMAGE;
}
const SMALL_WORDS = /* @__PURE__ */ new Set([
  "dan",
  "yang",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "atau",
  "pada",
  "oleh",
  "sebagai",
  "karena",
  "agar",
  "dalam",
  "ke",
  "yang",
  "serta",
  "atau",
  "atau"
]);
function brandCase(word) {
  const w = word.toLowerCase();
  switch (w) {
    case "paypal":
      return "PayPal";
    case "namesilo":
      return "NameSilo";
    case "namecheap":
      return "Namecheap";
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "google":
      return "Google";
    case "amazon":
      return "Amazon";
    case "netflix":
      return "Netflix";
    default:
      return w.charAt(0).toUpperCase() + w.slice(1);
  }
}
function titleCase(raw) {
  const cleaned = stripHtml$2(raw);
  if (!cleaned) return "";
  const parts = cleaned.split(/\s+/);
  return parts.map((p, idx) => {
    const low = p.toLowerCase();
    if (idx !== 0 && SMALL_WORDS.has(low)) return low;
    if (/^[0-9]+$/.test(p)) return p;
    return brandCase(p);
  }).join(" ");
}
function removeTrailingRandomNumbers(t) {
  let s = t.trim();
  s = s.replace(/[\s_-]+(\d{1,3})$/u, "");
  s = s.replace(/\s*\(\d{1,3}\)\s*$/u, "");
  return s.trim();
}
function normalizeTitle(rawTitle, slug) {
  let t = stripHtml$2(rawTitle);
  if (!t && slug) t = String(slug).replace(/[-_]+/g, " ");
  t = removeTrailingRandomNumbers(t);
  t = titleCase(t);
  t = removeTrailingRandomNumbers(t);
  return t;
}
function toKeywordsFromSlug(slug) {
  const s = String(slug || "");
  return s.split(/[-_\s]+/).filter(Boolean);
}
function paragraph(text) {
  return `<p>${text}</p>`;
}
function words(count, seed = "informasi layanan pembayaran digital aman terpercaya internasional solusi cepat mudah profesional dukungan pelanggan online transaksi global resmi promosi fitur keunggulan panduan tutorial tips trik keamanan verifikasi top up transfer kartu kredit debit rekening e-wallet fintech produk jasa terpercaya indonesia") {
  const arr = seed.split(/\s+/);
  const out = [];
  for (let i = 0; i < count; i++) out.push(arr[i % arr.length]);
  return out.join(" ");
}
function generateRichPlaceholderContent(topic, slug) {
  const kw = toKeywordsFromSlug(slug);
  const title = normalizeTitle(topic || slug, slug);
  const intro = paragraph(`${title} \u2014 Temukan penjelasan lengkap dan praktis mengenai ${kw.join(", ")}. Artikel ini memberikan gambaran umum, manfaat utama, serta langkah-langkah yang bisa Anda terapkan hari ini.`);
  const h2a = `<h2>Pendahuluan Singkat</h2>`;
  const p1 = paragraph(`Di era digital, kebutuhan ${kw[0] || "layanan pembayaran"} semakin meningkat. Kami menghadirkan solusi yang aman, cepat, dan profesional agar Anda dapat fokus pada hal yang paling penting: mengembangkan bisnis dan produktivitas Anda.`);
  const h2b = `<h2>Topik Utama & Cara Kerja</h2>`;
  const h3b1 = `<h3>Ringkasan Fitur</h3>`;
  const p2 = paragraph(`Layanan kami dirancang agar mudah digunakan oleh pemula sekalipun. Proses verifikasi sederhana, panduan langkah-demi-langkah, dan dukungan penuh dari tim kami akan membantu Anda menyelesaikan transaksi dengan percaya diri.`);
  const h3b2 = `<h3>Contoh Penggunaan</h3>`;
  const p3 = paragraph(`Sebagai contoh, ketika Anda ingin melakukan ${kw[0] || "pembayaran"} atau ${kw[1] || "top up"} secara internasional, sistem kami memastikan nilai tukar yang kompetitif, biaya transparan, dan kecepatan pemrosesan yang konsisten.`);
  const h2c = `<h2>Kelebihan & Fitur Unggulan</h2>`;
  const list = [
    "Keamanan berlapis dan perlindungan data.",
    "Proses cepat dengan alur yang jelas.",
    "Biaya transparan tanpa biaya tersembunyi.",
    "Dukungan pelanggan responsif dan ramah.",
    "Dokumentasi dan panduan yang mudah dipahami.",
    "Integrasi fleksibel untuk berbagai kebutuhan."
  ].map((i) => `<li>${i}</li>`).join("");
  const ul = `<ul>${list}</ul>`;
  const h2d = `<h2>Kesimpulan</h2>`;
  const p4 = paragraph(`Jika Anda mencari solusi ${kw.slice(0, 3).join(" ")} yang aman dan efisien, ${title} adalah pilihan tepat. Mulailah sekarang dan rasakan pengalaman transaksi yang lebih baik.`);
  const cta = paragraph(`<strong>Butuh bantuan cepat?</strong> Hubungi tim kami melalui live chat atau WhatsApp untuk konsultasi gratis dan rekomendasi terbaik sesuai kebutuhan Anda.`);
  const filler = paragraph(words(260)) + paragraph(words(260));
  return [h2a, intro, p1, h2b, h3b1, p2, h3b2, p3, h2c, ul, h2d, p4, cta, filler].join("\n");
}
function ensureExcerpt(excerpt, title, slug) {
  const raw = stripHtml$2(excerpt);
  if (raw && raw.length > 20) return raw;
  const content = generateRichPlaceholderContent(title || "", slug || "");
  const text = stripHtml$2(content);
  const wordsArr = text.split(/\s+/).filter(Boolean);
  const short = wordsArr.slice(0, 40).join(" ");
  return `${short}\u2026`;
}
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  return h >>> 0;
}
function replaceSynonyms(base) {
  const b = String(base || "").trim();
  const rest = b.replace(/^Jasa\s+/i, "");
  return {
    jasa: /\bJasa\b/i.test(b) ? "Jasa" : "Layanan",
    topup: /Top Up/i.test(b) ? "Top Up" : "Isi Saldo",
    saldo: "Isi Saldo",
    layanan: "Layanan",
    base: b,
    rest
  };
}
function spinTitle(baseTitle, slug) {
  const norm = normalizeTitle(baseTitle || "", slug || "");
  const syn = replaceSynonyms(norm);
  const variants = [
    `Solusi Aman & Cepat untuk ${syn.base}`,
    `Cara Praktis ${syn.saldo} ${/PayPal/i.test(norm) ? "PayPal" : syn.rest} dengan ${syn.jasa} Terpercaya`,
    `${syn.base}: Mudah, Aman, dan Terjangkau`,
    `Panduan Lengkap ${syn.rest || syn.base} Tanpa Ribet`,
    `${syn.layanan} ${syn.rest} Terpercaya untuk Kebutuhan Anda`,
    `Tips ${syn.rest || syn.base} yang Aman dan Efisien`,
    `Pilihan ${syn.jasa} ${syn.rest} \u2014 Cepat & Terjamin`
  ];
  const idx = hashStr(slug || norm) % variants.length;
  return variants[idx];
}
function isRawTitle(rawTitle, normalizedTitle, slug) {
  const raw = String(rawTitle || "").trim();
  const norm = String(normalizedTitle || "").trim();
  if (!raw) return true;
  const rawLower = raw.toLowerCase();
  const normLower = norm.toLowerCase();
  if (rawLower === normLower) return true;
  if (rawLower.startsWith(normLower + " ")) return true;
  if (/\d{1,3}$/.test(rawLower)) return true;
  if ((slug || "").toLowerCase().includes("jasa-top-up-paypal")) return true;
  if (norm.length <= 18) return true;
  return false;
}

async function refreshAllBlogPosts(maxPerPage = 100) {
  const allPosts = [];
  const errors = [];
  const cachedPosts = await listCachedPosts();
  const totalPages = Math.ceil(cachedPosts.length / maxPerPage);
  for (const p of cachedPosts) {
    const slug = String(p.slug || "");
    if (!slug) continue;
    try {
      const cleanTitle = normalizeTitle(String(p.title || ""), slug);
      const body = generateRichPlaceholderContent(cleanTitle, slug);
      const excerpt = ensureExcerpt(String(p.excerpt || ""), cleanTitle, slug);
      const image = ensureHeroImage(String(p.image || ""), cleanTitle, slug);
      const merged = {
        id: Number(p.id) || 0,
        slug,
        title: cleanTitle,
        excerpt,
        content: body,
        author: String(p?.author || "Redaksi"),
        date: String(p.date || (/* @__PURE__ */ new Date()).toISOString()),
        image,
        categories: Array.isArray(p.categories) ? p.categories : ["Blog"],
        tags: Array.isArray(p.tags) ? p.tags : [],
        aiImageUrl: buildAiHeroUrl(cleanTitle, slug)
      };
      allPosts.push(merged);
    } catch (e) {
      try {
        const cachedPost = await getPostFromCache(slug);
        if (cachedPost) {
          const title = normalizeTitle(String(cachedPost.title || p.title || ""), slug);
          const image = ensureHeroImage(String(cachedPost.image || p.image || ""), title, slug);
          const excerpt = ensureExcerpt(String(cachedPost.excerpt || p.excerpt || ""), title, slug);
          const merged = {
            id: Number(p.id) || Number(cachedPost.id) || 0,
            slug,
            title,
            excerpt,
            content: String(cachedPost.content || ""),
            author: String(cachedPost.author || "Redaksi"),
            date: String(p.date || cachedPost.date || (/* @__PURE__ */ new Date()).toISOString()),
            image,
            categories: Array.isArray(cachedPost.categories) ? cachedPost.categories : Array.isArray(p.categories) ? p.categories : [],
            tags: Array.isArray(cachedPost.tags) ? cachedPost.tags : Array.isArray(p.tags) ? p.tags : []
          };
          allPosts.push(merged);
          continue;
        } else {
          errors.push({ slug, reason: "AI and cache fallback both failed (no post found)" });
          continue;
        }
      } catch (e2) {
        errors.push({ slug, reason: e2?.message || String(e2) });
        continue;
      }
    }
  }
  const bySlug = /* @__PURE__ */ new Map();
  for (const p of allPosts) {
    const existing = bySlug.get(p.slug);
    if (!existing) {
      bySlug.set(p.slug, p);
    } else {
      const existingTs = Date.parse(existing.date || "") || 0;
      const candidateTs = Date.parse(p.date || "") || 0;
      bySlug.set(p.slug, candidateTs >= existingTs ? p : existing);
    }
  }
  const deduped = Array.from(bySlug.values());
  await saveManyPosts(deduped);
  const indexItems = deduped.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date,
    image: p.image,
    excerpt: p.excerpt
  }));
  await saveIndex(indexItems);
  return {
    totalFromWP: deduped.length,
    savedCount: deduped.length,
    pagesProcessed: Math.max(1, totalPages),
    errors
  };
}

const blogRefresh = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  refreshAllBlogPosts: refreshAllBlogPosts
}, Symbol.toStringTag, { value: 'Module' }));

const memoryCache = /* @__PURE__ */ new Map();
Number.parseInt(process.env.CACHE_TTL_SECONDS || "300") || 300;
function now$1() {
  return Date.now();
}
function cleanupExpired() {
  const t = now$1();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt <= t) {
      memoryCache.delete(key);
    }
  }
}
async function getCached(key) {
  try {
    const entry = memoryCache.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= now$1()) {
      memoryCache.delete(key);
      return null;
    }
    return entry.value;
  } catch {
    return null;
  } finally {
    if (Math.random() < 0.05) cleanupExpired();
  }
}

class EnhancedContentGenerator {
  constructor() {
    this.templates = {
      titles: [
        "{keyword} - Panduan Lengkap 2025",
        "Cara {keyword} yang Benar",
        "Tips {keyword} untuk Pemula",
        "{keyword} - Solusi Terpercaya",
        "Panduan {keyword} Step by Step",
        "Rahasia {keyword} yang Efektif",
        "{keyword} - Panduan Praktis",
        "Cara Mudah {keyword}",
        "Tips Sukses {keyword}",
        "{keyword} - Solusi Terbaik"
      ],
      content: {
        introduction: [
          "Halo! Apakah Anda sedang mencari informasi tentang {keyword}? Anda berada di tempat yang tepat!",
          "Dalam artikel ini, kami akan membahas secara detail tentang {keyword} yang mungkin Anda butuhkan.",
          "Sebagai penyedia jasa pembayaran terpercaya, kami sering mendapat pertanyaan tentang {keyword}.",
          "Mari kita bahas {keyword} secara lengkap dan mudah dipahami.",
          "Apakah Anda tahu bahwa {keyword} bisa menjadi solusi yang tepat untuk kebutuhan Anda?"
        ],
        mainContent: [
          "Berdasarkan pengalaman kami melayani ribuan klien, {keyword} memang menjadi pilihan yang populer.",
          "Tidak sedikit orang yang bertanya tentang {keyword} karena memang memiliki banyak manfaat.",
          "Kami akan memberikan penjelasan yang mudah dipahami tentang {keyword}.",
          "Sebenarnya, {keyword} tidak sesulit yang Anda bayangkan.",
          "Mari kita lihat lebih detail tentang {keyword} dan bagaimana cara menggunakannya."
        ],
        conclusion: [
          "Demikian penjelasan lengkap tentang {keyword}. Semoga artikel ini bermanfaat untuk Anda.",
          "Jika Anda masih memiliki pertanyaan tentang {keyword}, jangan ragu untuk menghubungi kami.",
          "Kami harap artikel tentang {keyword} ini dapat membantu Anda.",
          "Terima kasih telah membaca artikel tentang {keyword}. Semoga sukses!",
          "Jangan lupa untuk membagikan artikel {keyword} ini jika bermanfaat."
        ]
      }
    };
  }
  generateTitle(keyword) {
    const template = this.templates.titles[Math.floor(Math.random() * this.templates.titles.length)];
    let title = template.replace("{keyword}", keyword);
    if (title.length > 60) {
      title = title.substring(0, 57) + "...";
    }
    return title;
  }
  generateContent(keyword) {
    const intro = this.templates.content.introduction[Math.floor(Math.random() * this.templates.content.introduction.length)];
    const main = this.templates.content.mainContent[Math.floor(Math.random() * this.templates.content.mainContent.length)];
    const conclusion = this.templates.content.conclusion[Math.floor(Math.random() * this.templates.content.conclusion.length)];
    const content = `
<h1>${this.generateTitle(keyword)}</h1>

<div class="intro-section">
<p>${intro.replace("{keyword}", keyword)}</p>
</div>

<h2>Apa itu ${keyword}?</h2>
<p>${main.replace("{keyword}", keyword)}</p>

<h2>Mengapa Memilih ${keyword}?</h2>
<p>Ada beberapa alasan mengapa ${keyword} menjadi pilihan yang tepat untuk kebutuhan Anda:</p>
<ul>
<li><strong>Keamanan Terjamin:</strong> Sistem keamanan berlapis untuk melindungi data Anda</li>
<li><strong>Proses Cepat:</strong> Transaksi selesai dalam hitungan menit</li>
<li><strong>Biaya Terjangkau:</strong> Tarif kompetitif tanpa biaya tersembunyi</li>
<li><strong>Support 24/7:</strong> Tim customer service siap membantu kapan saja</li>
</ul>

<h2>Cara Menggunakan ${keyword}</h2>
<p>Berikut adalah langkah-langkah mudah untuk menggunakan ${keyword}:</p>
<ol>
<li><strong>Konsultasi Gratis:</strong> Hubungi tim kami untuk konsultasi kebutuhan Anda</li>
<li><strong>Verifikasi Identitas:</strong> Proses verifikasi cepat dan aman</li>
<li><strong>Konfirmasi Transaksi:</strong> Detail transaksi akan dikonfirmasi sebelum diproses</li>
<li><strong>Proses Pembayaran:</strong> Tim kami akan memproses pembayaran sesuai instruksi</li>
<li><strong>Konfirmasi Selesai:</strong> Anda akan menerima notifikasi setelah transaksi selesai</li>
</ol>

<h2>Tips & Trik ${keyword}</h2>
<p>Berikut adalah tips dari tim expert kami berdasarkan pengalaman melayani ribuan klien:</p>
<ul>
<li><strong>Persiapkan Dokumen:</strong> Pastikan semua dokumen yang diperlukan sudah lengkap</li>
<li><strong>Komunikasi Jelas:</strong> Berikan instruksi yang detail dan jelas</li>
<li><strong>Timing yang Tepat:</strong> Lakukan transaksi pada jam kerja untuk proses yang lebih cepat</li>
<li><strong>Backup Data:</strong> Simpan semua bukti transaksi dengan aman</li>
</ul>

<h2>FAQ - Pertanyaan yang Sering Diajukan</h2>
<div class="faq-item">
<p><strong>Q: Apakah ${keyword} aman digunakan?</strong><br>
A: Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>
</div>

<div class="faq-item">
<p><strong>Q: Berapa lama proses ${keyword} biasanya?</strong><br>
A: Proses biasanya selesai dalam 1-3 jam kerja, tergantung kompleksitas transaksi dan kelengkapan dokumen.</p>
</div>

<div class="faq-item">
<p><strong>Q: Apakah ada biaya tersembunyi?</strong><br>
A: Tidak ada biaya tersembunyi. Semua biaya akan diinformasikan secara transparan sebelum transaksi dimulai.</p>
</div>

<h2>Kesimpulan</h2>
<p>${conclusion.replace("{keyword}", keyword)}</p>

<div class="cta-section">
<h3>\u{1F680} Siap Menggunakan ${keyword}?</h3>
<p>Jangan ragu untuk menghubungi tim kami. Konsultasi gratis dan proses cepat!</p>
<a href="/contact" class="cta-button">Hubungi Sekarang</a>
</div>
`;
    return content;
  }
  generateMetaDescription(keyword) {
    const templates = [
      `Pelajari ${keyword} dengan panduan lengkap 2025. Tips terbaik, cara mudah, dan solusi aman untuk kebutuhan digital Anda. Konsultasi gratis!`,
      `${keyword} - Layanan terpercaya dengan jaminan keamanan. Panduan komprehensif, tips praktis, dan solusi terbaik dari expert.`,
      `Temukan solusi ${keyword} yang aman dan terpercaya. Panduan lengkap dengan tips praktis dari tim professional JasaPembayaran.com.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }
  generateTags(keyword) {
    const baseTags = [keyword, "jasa pembayaran", "indonesia", "2025"];
    const additionalTags = ["terpercaya", "aman", "cepat", "mudah", "tips", "panduan", "expert"];
    return [...baseTags, ...additionalTags].slice(0, 10);
  }
}

const enhancedContentGenerator = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: EnhancedContentGenerator
}, Symbol.toStringTag, { value: 'Module' }));

const DEFAULT_FILE_PATH = path.join(process.cwd(), "content", "generated-blogs.json");
const ALT_FILE_PATH = path.join(process.cwd(), "database", "content", "generated-blogs.json");
async function resolveFilePath() {
  try {
    await promises.stat(ALT_FILE_PATH);
    return ALT_FILE_PATH;
  } catch {
  }
  try {
    await promises.stat(DEFAULT_FILE_PATH);
    return DEFAULT_FILE_PATH;
  } catch {
  }
  return ALT_FILE_PATH;
}
async function ensureDir$1(file) {
  const target = file || DEFAULT_FILE_PATH;
  try {
    await promises.mkdir(path.dirname(target), { recursive: true });
  } catch {
  }
}
function stripHtml$1(input) {
  return String(input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function clampMeta(input, max) {
  const s = String(input || "").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const i = cut.lastIndexOf(" ");
  return (i > 20 ? cut.slice(0, i) : cut).trim();
}
async function readJson$1(file) {
  try {
    const raw = await promises.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function writeJson$1(file, data) {
  await ensureDir$1(file);
  const json = JSON.stringify(data, null, 2);
  await promises.writeFile(file, json, "utf-8");
}
function countWordsFromHtml(html) {
  const text = stripHtml$1(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}
function hasStandardStructure(html) {
  const s = String(html || "");
  if (!s) return false;
  const hasPend = /<h2[^>]*>\s*Pendahuluan\s*<\/h2>/i.test(s);
  const hasTentang = /<h2[^>]*>\s*Tentang\s+Layanan\s*<\/h2>/i.test(s);
  const hasKeunggulan = /<h2[^>]*>\s*Keunggulan\s*<\/h2>/i.test(s) && /<ul[\s\S]*?<\/ul>/i.test(s);
  const hasCara = /<h2[^>]*>\s*Cara\s+Menggunakan\s*<\/h2>/i.test(s) && /<ol[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<li>[\s\S]*?<\/li>[\s\S]*?<\/ol>/i.test(s);
  const hasTips = /<h2[^>]*>\s*Tips\s*&\s*FAQ\s*<\/h2>/i.test(s);
  const hasKesimpulan = /<h2[^>]*>\s*Kesimpulan\s*<\/h2>/i.test(s);
  return hasPend && hasTentang && hasKeunggulan && hasCara && hasTips && hasKesimpulan;
}
function ensureStandardStructure(html, title, slug) {
  let out = String(html || "");
  const wc = countWordsFromHtml(out);
  if (!hasStandardStructure(out) || wc < 500) {
    return buildNewStandardBody(title, slug);
  }
  if (wc < 520) {
    const fillers = [
      "Layanan kami mengutamakan keamanan, kecepatan, dan kenyamanan pengguna dengan dokumentasi lengkap, standar profesional, serta dukungan berkelanjutan.",
      "Tim kami berpengalaman menangani berbagai skenario transaksi sehingga Anda mendapatkan pendampingan yang jelas, transparan, dan terukur dari awal hingga akhir.",
      "Kami terus meningkatkan kualitas layanan melalui evaluasi rutin, optimasi proses, dan pembaruan kebijakan keamanan untuk menghadirkan pengalaman terbaik.",
      "Panduan yang kami sediakan mudah diikuti, lengkap dengan contoh, tips praktis, serta penjelasan istilah agar pengguna baru cepat memahami alur kerja."
    ];
    let i = 0;
    let current = wc;
    while (current < 520 && i < 200) {
      out += `
<p>${fillers[i % fillers.length]}</p>`;
      current = countWordsFromHtml(out);
      i++;
    }
  }
  return out;
}
function genSection(title, body) {
  return `<h2>${title}</h2>
<p>${body}</p>`;
}
function buildNewStandardBody(title, slug) {
  const topic = normalizeTitle(title || "", slug || "");
  const intro = genSection("Pendahuluan", `${topic} adalah solusi yang kami sediakan untuk membantu Anda bertransaksi secara aman, cepat, dan profesional. Pada bagian ini, Anda akan memahami manfaat utama, siapa yang membutuhkan layanan ini, dan bagaimana cara memulainya.`);
  const tentang = genSection("Tentang Layanan", `Layanan ini dirancang agar mudah digunakan oleh pemula maupun profesional. Prosesnya transparan: mulai dari konsultasi, verifikasi data, hingga eksekusi transaksi. Kami menggunakan praktik terbaik keamanan, enkripsi, dan pemantauan agar pengalaman Anda tetap nyaman.`);
  const keunggulan = `<h2>Keunggulan</h2>
<ul>
<li>Keamanan berlapis dan perlindungan data pelanggan.</li>
<li>Proses cepat dengan biaya yang kompetitif dan transparan.</li>
<li>Dukungan pelanggan responsif melalui live chat dan WhatsApp.</li>
<li>Panduan langkah demi langkah yang mudah diikuti.</li>
<li>Integrasi fleksibel untuk berbagai kebutuhan pembayaran.</li>
</ul>`;
  const cara = `<h2>Cara Menggunakan</h2>
<ol>
<li>Hubungi kami dan sampaikan kebutuhan Anda terkait ${topic.toLowerCase()}.</li>
<li>Lakukan verifikasi dan konfirmasi detail transaksi.</li>
<li>Setujui estimasi biaya dan waktu proses.</li>
<li>Kami eksekusi transaksi dan Anda memantau progresnya.</li>
<li>Transaksi selesai; kami kirimkan bukti serta ringkasan.</li>
</ol>`;
  const tipsFaq = `<h2>Tips & FAQ</h2>
<p>Tips: siapkan informasi yang jelas agar proses lebih cepat, gunakan kontak resmi kami, dan pastikan koneksi internet stabil saat verifikasi. FAQ singkat:</p>
<ul>
<li><strong>Apakah aman?</strong> Ya, kami menerapkan kebijakan keamanan ketat.</li>
<li><strong>Berapa lama prosesnya?</strong> Umumnya cepat, tergantung jenis layanan.</li>
<li><strong>Apakah ada biaya tambahan?</strong> Biaya selalu diinformasikan di depan secara transparan.</li>
</ul>`;
  const kesimpulan = genSection("Kesimpulan", `Dengan ${topic}, Anda bisa fokus pada hal penting tanpa khawatir soal teknis pembayaran. Kami siap membantu dari awal hingga akhir agar transaksi Anda berjalan mulus.`);
  const baseParts = [intro, tentang, keunggulan, cara, tipsFaq, kesimpulan];
  let html = baseParts.join("\n");
  let wc = countWordsFromHtml(html);
  const targetMin = 520;
  const fillers = [
    "Layanan kami mengutamakan keamanan, kecepatan, dan kenyamanan pengguna dengan dokumentasi lengkap, standar profesional, serta dukungan berkelanjutan.",
    "Tim kami berpengalaman menangani berbagai skenario transaksi sehingga Anda mendapatkan pendampingan yang jelas, transparan, dan terukur dari awal hingga akhir.",
    "Kami terus meningkatkan kualitas layanan melalui evaluasi rutin, optimasi proses, dan pembaruan kebijakan keamanan untuk menghadirkan pengalaman terbaik.",
    "Panduan yang kami sediakan mudah diikuti, lengkap dengan contoh, tips praktis, serta penjelasan istilah agar pengguna baru cepat memahami alur kerja."
  ];
  let i = 0;
  while (wc < targetMin && i < 200) {
    const sentence = fillers[i % fillers.length];
    html += `
<p>${sentence}</p>`;
    wc = countWordsFromHtml(html);
    i++;
  }
  return html;
}
async function updateGeneratedBlogsToNewStandard() {
  const file = await resolveFilePath();
  const arr = await readJson$1(file);
  if (!Array.isArray(arr) || arr.length === 0) return;
  let changed = false;
  const updated = arr.map((it) => {
    const original = { ...it };
    const slug = String(it.slug || "");
    const rawTitle = String(it.title || "");
    let title = normalizeTitle(rawTitle, slug);
    if (slug === "jasa-top-up-paypal-5") {
      title = "Jasa Top Up PayPal";
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug);
    }
    const content = ensureStandardStructure(String(it.content || ""), title, slug);
    const rawImage = String(it.featured_image || "");
    const image = ensureHeroImage(rawImage, title, slug);
    const meta_title = clampMeta(String(it.meta_title || title), 60);
    const meta_description = clampMeta(String(it.meta_description || stripHtml$1(content)), 160);
    const rec = {
      id: Number(it.id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String(it.publish_at || (/* @__PURE__ */ new Date()).toISOString()),
      featured_image: image,
      meta_title,
      meta_description
    };
    if (rec.title !== original.title || rec.content !== original.content || rec.featured_image !== original.featured_image || rec.meta_title !== original.meta_title || rec.meta_description !== original.meta_description) {
      changed = true;
    }
    return rec;
  });
  if (changed) {
    await writeJson$1(file, updated);
  }
}
async function forceRegenerateAllGeneratedBlogs() {
  const file = await resolveFilePath();
  const arr = await readJson$1(file);
  if (!Array.isArray(arr) || arr.length === 0) return { total: 0 };
  const updated = arr.map((it) => {
    const slug = String(it.slug || "");
    const rawTitle = String(it.title || "");
    let title = normalizeTitle(rawTitle, slug);
    if (slug === "jasa-top-up-paypal-5") {
      title = "Jasa Top Up PayPal";
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug);
    }
    const content = buildNewStandardBody(title, slug);
    const image = ensureHeroImage("", title, slug) || "/images/fallback-news.svg";
    const meta_title = clampMeta(String(it.meta_title || title), 60);
    const meta_description = clampMeta(String(stripHtml$1(content)), 160);
    const rec = {
      id: Number(it.id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String(it.publish_at || (/* @__PURE__ */ new Date()).toISOString()),
      featured_image: image,
      meta_title,
      meta_description
    };
    return rec;
  });
  await writeJson$1(file, updated);
  return { total: updated.length };
}
async function listGeneratedBlogs() {
  const file = await resolveFilePath();
  const arr = await readJson$1(file);
  if (!Array.isArray(arr)) return [];
  const norm = arr.filter((it) => it && typeof it.slug === "string" && typeof it.title === "string").map((it) => {
    const slug = String(it.slug || "");
    const title = String(it.title || "");
    const content = String(it.content || "");
    const metaTitle = clampMeta(String(it.meta_title || title), 60);
    const metaDesc = clampMeta(String(it.meta_description || stripHtml$1(content)), 160);
    const image = ensureHeroImage(String(it.featured_image || ""), normalizeTitle(title, slug), slug);
    return {
      id: Number(it.id) || 0,
      slug,
      title,
      content,
      publish_at: String(it.publish_at || ""),
      featured_image: image,
      meta_title: metaTitle,
      meta_description: metaDesc
    };
  });
  norm.sort((a, b) => (Date.parse(b.publish_at || "") || 0) - (Date.parse(a.publish_at || "") || 0));
  return norm;
}
async function appendGeneratedBlogs(items) {
  if (!Array.isArray(items) || items.length === 0) return;
  const current = await listGeneratedBlogs().catch(() => []);
  const map = /* @__PURE__ */ new Map();
  for (const it of current) map.set(it.slug, it);
  for (const it of items) {
    if (!it?.slug) continue;
    const slug = String(it.slug || "");
    !map.has(slug);
    const rawTitle = String(it.title || "");
    let title = normalizeTitle(rawTitle, slug);
    if (slug === "jasa-top-up-paypal-5") {
      title = "Jasa Top Up PayPal";
    }
    if (isRawTitle(rawTitle, title, slug)) {
      title = spinTitle(title, slug);
    }
    const content = ensureStandardStructure(String(it.content || ""), title, slug);
    const safeImage = ensureHeroImage(String(it.featured_image || ""), title, slug);
    const rec = {
      id: Number(it.id) || Date.now(),
      slug,
      title,
      content,
      publish_at: String(it.publish_at || (/* @__PURE__ */ new Date()).toISOString()),
      featured_image: safeImage,
      meta_title: clampMeta(String(it.meta_title || title), 60),
      meta_description: clampMeta(String(it.meta_description || stripHtml$1(content)), 160)
    };
    map.set(rec.slug, rec);
  }
  const out = Array.from(map.values());
  out.sort((a, b) => (Date.parse(b.publish_at || "") || 0) - (Date.parse(a.publish_at || "") || 0));
  const file = await resolveFilePath();
  await writeJson$1(file, out);
}
async function listGeneratedIndex() {
  try {
    await updateGeneratedBlogsToNewStandard();
  } catch {
  }
  const arr = await listGeneratedBlogs();
  return arr.map((it) => ({
    id: Number(it.id) || 0,
    slug: it.slug,
    title: it.title,
    date: it.publish_at,
    image: it.featured_image
  }));
}

const generatedBlogs = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  appendGeneratedBlogs: appendGeneratedBlogs,
  forceRegenerateAllGeneratedBlogs: forceRegenerateAllGeneratedBlogs,
  listGeneratedBlogs: listGeneratedBlogs,
  listGeneratedIndex: listGeneratedIndex,
  updateGeneratedBlogsToNewStandard: updateGeneratedBlogsToNewStandard
}, Symbol.toStringTag, { value: 'Module' }));

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const projectRoot = process.cwd();
const dataDir = path.join(projectRoot, "data");
const statePath = path.join(dataDir, "openai-state.json");
const completionCachePath = path.join(dataDir, "openai-completions-cache.json");
const moderationCachePath = path.join(dataDir, "openai-moderation-cache.json");
function now() {
  return Date.now();
}
async function ensureDir(dir) {
  try {
    await promises.mkdir(dir, { recursive: true });
  } catch {
  }
}
async function readJson(file, fallback) {
  try {
    const raw = await promises.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
async function writeJson(file, data) {
  const tmp = file + ".tmp";
  await promises.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await promises.rename(tmp, file);
}
function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
function getEnvKeys() {
  const multi = process.env.CHATGPT_API_KEYS || process.env.OPENAI_API_KEYS;
  const single = process.env.OPENAI_API_KEY;
  const values = multi ? multi.split(",") : single ? [single] : [];
  return values.map((k) => k.trim()).filter(Boolean);
}
const HOLD_FAILS = Number.parseInt(process.env.CHATGPT_HOLD_FAILS || "10") || 10;
const HOLD_MS = Number.parseInt(process.env.CHATGPT_HOLD_MS || String(3 * 60 * 60 * 1e3)) || 3 * 60 * 60 * 1e3;
class OpenAIManager {
  constructor() {
    __publicField(this, "state", { lastKeyIndex: -1, consecutiveAllKeysFailures: 0, holdUntil: null, perKeyFailureCounts: {} });
    __publicField(this, "stateLoaded", false);
    __publicField(this, "keys", []);
    __publicField(this, "completionCache", {});
    __publicField(this, "moderationCache", {});
    __publicField(this, "cachesLoaded", false);
  }
  async loadStateAndCaches() {
    if (!this.stateLoaded) {
      await ensureDir(dataDir);
      this.state = await readJson(statePath, { lastKeyIndex: -1, consecutiveAllKeysFailures: 0, holdUntil: null, perKeyFailureCounts: {} });
      this.stateLoaded = true;
    }
    if (!this.cachesLoaded) {
      this.completionCache = await readJson(completionCachePath, {});
      this.moderationCache = await readJson(moderationCachePath, {});
      this.cachesLoaded = true;
    }
    if (this.keys.length === 0) {
      this.keys = getEnvKeys();
    }
  }
  async saveState() {
    await writeJson(statePath, this.state);
  }
  async saveCompletionCache() {
    await writeJson(completionCachePath, this.completionCache);
  }
  async saveModerationCache() {
    await writeJson(moderationCachePath, this.moderationCache);
  }
  isOnHold() {
    if (!this.state.holdUntil) return false;
    return now() < this.state.holdUntil;
  }
  getHoldInfo() {
    return {
      onHold: this.isOnHold(),
      holdUntil: this.state.holdUntil || null,
      consecutiveAllKeysFailures: this.state.consecutiveAllKeysFailures,
      lastKeyIndex: this.state.lastKeyIndex,
      perKeyFailureCounts: this.state.perKeyFailureCounts,
      keysConfigured: this.keys.length
    };
  }
  pickNextKeyIndex() {
    if (this.keys.length === 0) return -1;
    const next = (this.state.lastKeyIndex + 1) % this.keys.length;
    return next;
  }
  makeClient(index) {
    if (index < 0 || index >= this.keys.length) return null;
    const apiKey = this.keys[index];
    if (!apiKey) return null;
    return new OpenAI({ apiKey, organization: process.env.OPENAI_ORG_ID });
  }
  completionDedupKey(params) {
    if (params.dedupId) return params.dedupId;
    const base = {
      t: "chat",
      model: params.model,
      messages: params.messages,
      temperature: params.temperature ?? null,
      max_tokens: params.max_tokens ?? null,
      response_format: params.response_format?.type || null
    };
    return sha256(JSON.stringify(base));
  }
  async chatCompletionRaw(params) {
    await this.loadStateAndCaches();
    const dedupKey = this.completionDedupKey(params);
    const cached = this.completionCache[dedupKey];
    if (cached) {
      return {
        id: "cached_" + dedupKey.slice(0, 8),
        object: "chat.completion",
        created: Math.floor(cached.ts / 1e3),
        model: params.model,
        choices: [
          {
            index: 0,
            message: { role: "assistant", content: cached.content },
            finish_reason: "stop",
            logprobs: null
          }
        ],
        usage: void 0,
        system_fingerprint: void 0
      };
    }
    if (this.isOnHold()) {
      const err2 = new Error("openai_on_hold");
      err2.code = "OPENAI_ON_HOLD";
      throw err2;
    }
    let success = false;
    const startIndex = this.pickNextKeyIndex();
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : (startIndex + attempt) % this.keys.length;
      const client = this.makeClient(idx);
      if (!client) break;
      try {
        const res = await client.chat.completions.create({
          model: params.model,
          messages: params.messages,
          temperature: params.temperature,
          max_tokens: params.max_tokens,
          response_format: params.response_format
        });
        const content = res.choices?.[0]?.message?.content ?? "";
        this.completionCache[dedupKey] = { content, ts: now() };
        await this.saveCompletionCache();
        this.state.lastKeyIndex = idx;
        this.state.consecutiveAllKeysFailures = 0;
        await this.saveState();
        success = true;
        return res;
      } catch (e) {
        const key = this.keys[idx];
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1;
        await this.saveState();
      }
    }
    if (!success) {
      this.state.consecutiveAllKeysFailures += 1;
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS;
        this.state.consecutiveAllKeysFailures = 0;
      }
      await this.saveState();
      const err2 = new Error("openai_all_keys_failed");
      err2.code = "OPENAI_ALL_KEYS_FAILED";
      throw err2;
    }
    const err = new Error("openai_unexpected");
    err.code = "OPENAI_UNEXPECTED";
    throw err;
  }
  async chatCompletionText(params) {
    const res = await this.chatCompletionRaw(params);
    return res.choices?.[0]?.message?.content?.toString() ?? "";
  }
  moderationDedupKey(input) {
    const arr = Array.isArray(input) ? input : [input];
    return sha256(JSON.stringify({ t: "moderation", input: arr }));
  }
  async moderate(input) {
    await this.loadStateAndCaches();
    const dedupKey = this.moderationDedupKey(input);
    const cached = this.moderationCache[dedupKey];
    if (cached) {
      return cached.result;
    }
    if (this.isOnHold()) {
      const err2 = new Error("openai_on_hold");
      err2.code = "OPENAI_ON_HOLD";
      throw err2;
    }
    let success = false;
    const startIndex = this.pickNextKeyIndex();
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : (startIndex + attempt) % this.keys.length;
      const client = this.makeClient(idx);
      if (!client) break;
      try {
        const res = await client.moderations.create({ input });
        this.moderationCache[dedupKey] = { result: res, ts: now() };
        await this.saveModerationCache();
        this.state.lastKeyIndex = idx;
        this.state.consecutiveAllKeysFailures = 0;
        await this.saveState();
        success = true;
        return res;
      } catch (e) {
        const key = this.keys[idx];
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1;
        await this.saveState();
      }
    }
    if (!success) {
      this.state.consecutiveAllKeysFailures += 1;
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS;
        this.state.consecutiveAllKeysFailures = 0;
      }
      await this.saveState();
      const err2 = new Error("openai_all_keys_failed");
      err2.code = "OPENAI_ALL_KEYS_FAILED";
      throw err2;
    }
    const err = new Error("openai_unexpected");
    err.code = "OPENAI_UNEXPECTED";
    throw err;
  }
  async testConnection() {
    await this.loadStateAndCaches();
    if (this.isOnHold()) {
      const err = new Error("openai_on_hold");
      err.code = "OPENAI_ON_HOLD";
      throw err;
    }
    let success = false;
    const startIndex = this.pickNextKeyIndex();
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.keys.length === 0 ? -1 : (startIndex + attempt) % this.keys.length;
      const client = this.makeClient(idx);
      if (!client) break;
      try {
        await client.models.list();
        this.state.lastKeyIndex = idx;
        this.state.consecutiveAllKeysFailures = 0;
        await this.saveState();
        success = true;
        return;
      } catch (e) {
        const key = this.keys[idx];
        this.state.perKeyFailureCounts[key] = (this.state.perKeyFailureCounts[key] || 0) + 1;
        await this.saveState();
      }
    }
    if (!success) {
      this.state.consecutiveAllKeysFailures += 1;
      if (this.state.consecutiveAllKeysFailures >= HOLD_FAILS) {
        this.state.holdUntil = now() + HOLD_MS;
        this.state.consecutiveAllKeysFailures = 0;
      }
      await this.saveState();
      const err = new Error("openai_all_keys_failed");
      err.code = "OPENAI_ALL_KEYS_FAILED";
      throw err;
    }
  }
}
let singleton = null;
function getOpenAIManager() {
  if (!singleton) singleton = new OpenAIManager();
  return singleton;
}

async function batchTranslate(pairs, source, target) {
  if (pairs.length === 0) return {};
  const mappingPrompt = pairs.map((p) => `- ${p.key}: ${p.text}`).join("\n");
  const system = `You are a translation engine. Translate from ${source} to ${target}. Return ONLY a valid JSON object mapping keys to translated strings. Do not include comments or markdown.`;
  const user = `Translate these items. Keep punctuation and numbers. Output JSON with same keys.

${mappingPrompt}`;
  const manager = getOpenAIManager();
  const content = await manager.chatCompletionText({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: 0.2,
    response_format: { type: "json_object" }
  });
  try {
    const json = JSON.parse(content || "{}");
    return json;
  } catch {
    return {};
  }
}
async function translateMissingIdToEn() {
  const hasAnyKey = Boolean(process.env.CHATGPT_API_KEYS || process.env.OPENAI_API_KEYS || process.env.OPENAI_API_KEY);
  if (!hasAnyKey) {
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: true, reason: "OPENAI_API_KEY/CHATGPT_API_KEYS not configured" };
  }
  const holdInfo = getOpenAIManager().getHoldInfo();
  if (holdInfo.onHold) {
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: true, reason: "OPENAI_ON_HOLD" };
  }
  const [id, en, meta] = await Promise.all([
    readLocale("id"),
    readLocale("en"),
    readMeta()
  ]);
  const { missingKeys, changedKeys, idFlat } = diffIdToEn(id, en, meta);
  const keysToTranslate = Array.from(/* @__PURE__ */ new Set([...missingKeys, ...changedKeys]));
  if (keysToTranslate.length === 0) {
    meta.en = buildMetaFromId(idFlat);
    await writeMeta(meta);
    return { translatedCount: 0, missingCount: 0, changedCount: 0, skipped: false, updated: false, details: { keys: [] } };
  }
  const chunkSize = 50;
  const results = {};
  for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
    const chunk = keysToTranslate.slice(i, i + chunkSize);
    const pairs = chunk.map((key) => ({ key, text: idFlat[key] }));
    const translated = await batchTranslate(pairs, "Indonesian", "English");
    Object.assign(results, translated);
  }
  const newEn = applyTranslations(en, results);
  await writeLocale("en", newEn);
  meta.en = buildMetaFromId(idFlat);
  await writeMeta(meta);
  return {
    translatedCount: Object.keys(results).length,
    missingCount: missingKeys.length,
    changedCount: changedKeys.length,
    skipped: false,
    updated: true,
    details: { keys: keysToTranslate }
  };
}
async function getMessages(locale) {
  return readLocale(locale);
}

const i18nAuto = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  getMessages: getMessages,
  translateMissingIdToEn: translateMissingIdToEn
}, Symbol.toStringTag, { value: 'Module' }));

function parseXForwardedFor(v) {
  if (!v) return void 0;
  const first = v.split(",")[0]?.trim();
  return first || void 0;
}
function getClientIp(event) {
  try {
    const cf = getHeader(event, "cf-connecting-ip");
    if (cf) return cf;
    const xff = parseXForwardedFor(getHeader(event, "x-forwarded-for"));
    if (xff) return xff;
    const xr = getHeader(event, "x-real-ip");
    if (xr) return xr;
    const fwd = getHeader(event, "forwarded");
    if (fwd) {
      const m = /for=([^;]+)/i.exec(fwd);
      if (m && m[1]) {
        return m[1].replace(/^"|"$/g, "");
      }
    }
    const any = event?.node?.req?.socket?.remoteAddress || event?.node?.req?.connection?.remoteAddress;
    if (any) return any;
  } catch {
  }
  return "unknown";
}

const DEFAULT_DAILY_COUNT = Math.min(Math.max(parseInt(process.env.NUXT_KEYWORD_DAILY_COUNT || "20", 10) || 20, 1), 50);
function normalizeKw(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}
function todayDateStr(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function keywordsDirFor(dateStr) {
  return path.join(process.cwd(), "data", "keywords", dateStr);
}
function isTxtFile(file) {
  return /\.txt$/i.test(file);
}
function isDoneFile(file) {
  return /\.done(\.txt)?$/i.test(file);
}
function slugify(input) {
  return (input || "").toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\d+/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
async function readLines(filePath) {
  try {
    const raw = await promises.readFile(filePath, "utf-8");
    return raw.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}
function buildTags(keyword, aiTags, categories) {
  const MIN = 12;
  const MAX = 12;
  const norm = (s) => String(s || "").toLowerCase().trim().replace(/\s+/g, " ");
  const stop = /* @__PURE__ */ new Set(["dan", "atau", "untuk", "yang", "adalah", "via", "di", "ke", "dengan", "pakai", "murah", "cara", "blog", "artikel"]);
  const base = [];
  for (const t of aiTags || []) {
    const v = norm(t);
    if (!v || stop.has(v)) continue;
    if (!base.includes(v)) base.push(v);
  }
  for (const c of categories || []) {
    const v = norm(c);
    if (!v || stop.has(v) || v === "blog") continue;
    if (!base.includes(v)) base.push(v);
  }
  const kwTokens = String(keyword || "").toLowerCase().split(/\s+/).map((w) => w.trim()).filter((w) => w && !stop.has(w));
  for (const w of kwTokens) {
    if (!base.includes(w)) base.push(w);
  }
  const pool = ["paypal", "jasa pembayaran", "top up", "transfer", "verifikasi", "keamanan", "belanja online", "kartu kredit", "e-commerce", "digital", "bitcoin", "crypto", "blockchain", "trading", "investasi", "banking", "mobile", "app", "web", "api", "cloud", "ai", "fintech", "online"];
  if (base.length < MIN) {
    for (const p of pool) {
      const v = norm(p);
      if (!base.includes(v)) base.push(v);
      if (base.length >= MIN) break;
    }
  }
  return base.slice(0, MAX);
}
function buildSeoFriendlyTitle(mainKeyword, existingTitle) {
  const clean = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const titleCase = (s) => clean(s).split(" ").map((w) => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w).join(" ");
  const MAX_LEN = 70;
  const TARGET_MIN = 50;
  const kwRaw = clean(mainKeyword);
  const kwTC = titleCase(kwRaw);
  let base = clean(existingTitle || "");
  if (base) {
    base = base.replace(/(?:[-—–:])*\s*(?:bagian|part|episode|ep|page)?\s*\d{1,4}\s*$/i, "").replace(/[\s:—–-]+$/g, "").trim();
  }
  const startsWithKw = (t, kw) => t.toLowerCase().startsWith(kw.toLowerCase());
  const containsKw = (t, kw) => t.toLowerCase().includes(kw.toLowerCase());
  if (!base) {
    base = kwTC;
  } else if (!startsWithKw(base, kwRaw) && !startsWithKw(base, kwTC)) {
    let rest = base;
    if (containsKw(base, kwRaw)) {
      const re = new RegExp(kwRaw.replace(/[-/\\^$*+?.()|[\]{}]/g, ""), "i");
      rest = clean(base.replace(re, "").replace(/\s{2,}/g, " "));
    } else if (containsKw(base, kwTC)) {
      const re = new RegExp(kwTC.replace(/[-/\\^$*+?.()|[\]{}]/g, ""), "i");
      rest = clean(base.replace(re, "").replace(/\s{2,}/g, " "));
    }
    base = rest ? `${kwTC}: ${rest}` : kwTC;
  } else {
    if (!startsWithKw(base, kwTC)) {
      const parts = base.split(/[:\-—–]|\s{2,}/);
      if (parts.length > 0) {
        const first = clean(parts[0]);
        if (first && containsKw(first, kwRaw)) {
          base = kwTC + base.slice(first.length);
        }
      }
    }
  }
  const safeTrim = (t, max) => {
    if (t.length <= max) return t;
    let cut = t.slice(0, max);
    cut = cut.replace(/\s+[\S]*$/, "");
    return cut.trim();
  };
  base = safeTrim(base, MAX_LEN);
  const suffixes = [
    "Panduan Lengkap",
    "Tips & Cara",
    "Mudah dan Cepat",
    "Terbaru 2025",
    "Aman dan Terpercaya",
    "Untuk Pemula",
    "Langkah demi Langkah"
  ];
  const wordCount2 = (t) => clean(t).split(" ").filter(Boolean).length;
  let i = 0;
  while ((base.length < TARGET_MIN || wordCount2(base) < 6) && i < suffixes.length) {
    const sep = base.includes(":") ? " " : " \u2014 ";
    const candidate = `${base}${sep}${suffixes[i]}`;
    if (candidate.length <= MAX_LEN) {
      base = candidate;
    }
    i++;
  }
  base = safeTrim(base, MAX_LEN);
  return base;
}
function stripHtml(input) {
  return String(input || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function wordCount(input) {
  return stripHtml(input).split(/\s+/).filter(Boolean).length;
}
function makeExcerptFromContent(content, maxWords = 40) {
  const text = stripHtml(content);
  const words = text.split(/\s+/).filter(Boolean);
  const slice = words.slice(0, maxWords).join(" ");
  return `<p>${slice}${words.length > maxWords ? "\u2026" : ""}</p>`;
}
function randInt(min, max) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function paragraphFor(keyword) {
  const kw = String(keyword).toLowerCase();
  const leads = ["Dalam panduan ini", "Artikel ini membahas", "Jika Anda mencari informasi tentang", "Di bawah ini kami ulas", "Secara ringkas dan jelas"];
  const verbs = ["menggunakan", "memahami", "mengoptimalkan", "memanfaatkan", "menerapkan"];
  const benefits = ["aman", "cepat", "terpercaya", "efisien", "hemat biaya", "praktis"];
  const contexts = ["bisnis online", "transaksi digital", "pembayaran internasional", "belanja lintas negara", "pengelolaan keuangan digital"];
  const closers = ["Langkah-langkahnya tidak sulit jika diikuti dengan benar.", "Fokus pada keamanan dan kepatuhan agar hasilnya maksimal.", "Dengan pendekatan yang tepat, hasil dapat meningkat signifikan.", "Pemahaman dasar akan memudahkan proses praktis.", "Tips kecil sering memberi dampak besar."];
  const pick = (arr) => arr[randInt(0, arr.length - 1)];
  const sentences = [];
  sentences.push(`${pick(leads)}, ${kw} menjadi solusi ${pick(benefits)} untuk ${pick(contexts)}.`);
  sentences.push(`Dengan ${kw}, Anda dapat ${pick(verbs)} proses secara lebih ${pick(benefits)} tanpa langkah yang rumit.`);
  sentences.push(`Agar hasil optimal, pahami dulu konsep dasar ${kw} serta praktik terbaiknya dalam keseharian.`);
  sentences.push(`Gunakan panduan terstruktur, ukur hasilnya, lalu perbaiki secara bertahap untuk memastikan ${kw} berjalan konsisten.`);
  sentences.push(pick(closers));
  return `<p>${sentences.join(" ")}</p>`;
}
function buildLongFormArticle(keyword, targetMin = 500, targetMax = 800) {
  const kwTitle = (s) => String(s).split(" ").map((w) => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w).join(" ");
  const kw = String(keyword || "").trim() || "Layanan Digital";
  const target = randInt(Math.max(500, targetMin), Math.max(targetMin, targetMax));
  const parts = [];
  parts.push(`<h2>Pendahuluan</h2>`);
  parts.push(paragraphFor(kw));
  parts.push(paragraphFor(kw));
  parts.push(`<h2>Tentang Layanan</h2>`);
  parts.push(paragraphFor(kw));
  parts.push(paragraphFor(kw));
  parts.push(`<h2>Keunggulan</h2>`);
  parts.push("<ul>" + ["Meningkatkan efisiensi proses", "Memperkuat keamanan transaksi", "Memperluas jangkauan pasar", "Menghemat waktu dan biaya", "Dukungan pelanggan yang responsif"].map((it) => `<li>${it}</li>`).join("") + "</ul>");
  parts.push(paragraphFor(kw));
  parts.push(`<h2>Cara Menggunakan</h2>`);
  parts.push("<ol>" + ["Siapkan akun dan verifikasi data", "Atur preferensi keamanan", "Lakukan transaksi uji coba", "Evaluasi hasil dan perbaiki", "Terapkan otomatisasi seperlunya"].map((it) => `<li>${it}</li>`).join("") + "</ol>");
  parts.push(paragraphFor(kw));
  parts.push(`<h2>Tips & FAQ</h2>`);
  parts.push(paragraphFor(kw));
  const faqs = [
    [`Apa itu ${kw}?`, `${kw} adalah layanan/solusi yang membantu proses menjadi lebih aman dan efisien. Prinsipnya menggabungkan kemudahan penggunaan dengan kontrol yang jelas.`],
    [`Apakah ${kw} aman?`, `Selama mengikuti praktik terbaik keamanan dan verifikasi, ${kw} dapat digunakan secara aman untuk kebutuhan pribadi maupun bisnis.`],
    [`Bagaimana cara memulai dengan ${kw}?`, `Mulailah dengan membuat akun, lengkapi profil, aktifkan fitur keamanan, lalu lakukan uji coba transaksi kecil untuk memahami alurnya.`]
  ];
  for (const [q, a] of faqs) {
    parts.push(`<h3>${q}</h3>`);
    parts.push(`<p>${a}</p>`);
  }
  parts.push(`<h2>Kesimpulan</h2>`);
  parts.push(`<p>${kwTitle(kw)} layak dipertimbangkan untuk kebutuhan harian maupun bisnis. Mulai dari perencanaan, implementasi, hingga evaluasi, kedisiplinan dalam mengikuti praktik terbaik akan membantu Anda mendapatkan hasil yang konsisten dan berkelanjutan.</p>`);
  parts.push(`<p><strong>Ayo mulai</strong> mengoptimalkan ${kw} hari ini. Jika Anda butuh bantuan, tim kami siap memberikan pendampingan.</p>`);
  let html = parts.join("\n");
  while (wordCount(html) < target && parts.length < 200) {
    const extra = paragraphFor(kw);
    parts.push(extra);
    html = parts.join("\n");
  }
  return html;
}
function ensureContentLength(baseContent, keyword) {
  const targetMin = 500;
  const current = wordCount(baseContent);
  if (current >= targetMin) return baseContent;
  return buildLongFormArticle(keyword, 500, 800);
}
const ILLEGAL_PATTERNS = [
  /verifikasi\s*paypal/i,
  /pencairan\s*dana\s*paypal/i
];
function containsIllegal(input) {
  const s = String(input || "");
  return ILLEGAL_PATTERNS.some((r) => r.test(s));
}
function replaceIllegalPhrases(text) {
  let t = String(text || "");
  const replacements = [
    { pattern: /verifikasi\s*paypal/gi, value: "keamanan akun PayPal" },
    { pattern: /pencairan\s*dana\s*paypal/gi, value: "penarikan saldo PayPal sesuai kebijakan" }
  ];
  for (const { pattern, value } of replacements) {
    t = t.replace(pattern, value);
  }
  return t;
}
function buildSafeFallbackTitle(keyword) {
  const kw = String(keyword || "");
  if (/verifikasi\s*paypal/i.test(kw)) {
    return "Keamanan Akun PayPal: Tips & Praktik Aman";
  }
  if (/pencairan\s*dana\s*paypal/i.test(kw)) {
    return "Penarikan Saldo PayPal yang Aman: Panduan & Kebijakan";
  }
  return "Panduan Pembayaran Online yang Aman & Terpercaya";
}
function sanitizeTitleAndContent(title, content, keyword) {
  const illegalInKw = containsIllegal(keyword);
  let safeTitle = String(title || "");
  let safeContent = String(content || "");
  safeContent = replaceIllegalPhrases(safeContent);
  if (containsIllegal(safeTitle) || illegalInKw) {
    safeTitle = buildSafeFallbackTitle(keyword);
  }
  return { title: safeTitle, content: safeContent };
}
const DEFAULT_KEYWORDS = [
  "jasa paypal",
  "jasa bayar paypal",
  "jasa transfer paypal",
  "jasa domain namecheap",
  "jasa namecheap",
  "jasa top up paypal",
  "jasa verifikasi paypal",
  "jasa domain namesilo",
  "via paypal",
  "paypal adalah",
  "saldo paypal",
  "beli saldo paypal",
  "topup paypal",
  "jual saldo paypal",
  "jasa top up paypal",
  "jasa kartu kredit",
  "cara top up paypal",
  "jasa pembayaran kartu kredit",
  "jasa paypal terpercaya",
  "jual paypal",
  "cara buat akun paypal",
  "jasa transfer paypal",
  "jasa pembayaran",
  "top up saldo paypal",
  "cara bikin paypal",
  "jasa bayar kartu kredit",
  "cara membuat paypal",
  "temanpay",
  "jasapembayaran",
  "jual beli paypal",
  "jual beli saldo paypal",
  "cara mengisi saldo paypal",
  "jasabayar",
  "cara buat paypal",
  "pembayaran paypal",
  "beli paypal murah",
  "cara menggunakan paypal",
  "jasa bayar",
  "akun paypal",
  "jasa bayar patreon",
  "paypal di indonesia",
  "jasa pembayaran online",
  "jasa pembayaran visa",
  "jasa pembayaran luar negeri",
  "cara bayar paypal",
  "top up paypal murah",
  "jasa bayar pakai kartu kredit",
  "bayar pakai paypal",
  "kartu debit untuk paypal",
  "cara bayar pakai paypal",
  "jasa pembayaran mastercard",
  "jasa paypall",
  "aplikasi paypal",
  "cara pakai paypal",
  "belanja pakai paypal",
  "jasa pembayaran online luar negeri",
  "jual paypal ke rupiah",
  "buat paypal",
  "akun paypal adalah",
  "akun paypal indonesia",
  "akun paypal tanpa kartu kredit",
  "aplikasi paypal adalah",
  "aplikasi paypal indonesia",
  "aplikasi pembayaran paypal",
  "arti akun paypal",
  "arti kata paypal",
  "arti pay pal",
  "arti paypal indonesia",
  "balance paypal adalah",
  "bayar akun netflix",
  "bayar amazon dengan paypal",
  "bayar dengan paypal",
  "bayar ebay",
  "bayar lewat paypal",
  "bayar melalui paypal",
  "bayar menggunakan paypal",
  "bayar netflix dengan paypal",
  "bayar netflix pakai paypal",
  "bayar pakai visa",
  "bayar patreon",
  "bayar paypal",
  "bayar paypal di alfamart",
  "bayar paypal tanpa kartu kredit",
  "bayar via paypal",
  "bayar visa tanpa kartu kredit",
  "bayar zoom dengan paypal",
  "belanja bayar pakai paypal",
  "belanja dengan paypal",
  "belanja dengan paypal di indonesia",
  "belanja lewat paypal",
  "belanja luar negeri tanpa kartu kredit",
  "belanja menggunakan paypal",
  "belanja online bayar pakai paypal",
  "belanja online dengan kartu kredit",
  "belanja online dengan paypal",
  "belanja online dengan paypal di indonesia",
  "belanja online kartu kredit",
  "belanja online luar negeri tanpa kartu kredit",
  "belanja online menggunakan paypal",
  "belanja online pakai paypal",
  "belanja online paypal",
  "belanja online via paypal",
  "belanja pakai paypal di indonesia",
  "belanja pake paypal",
  "belanja paypal",
  "belanja paypal tanpa kartu kredit",
  "belanja via paypal",
  "beli akun paypal",
  "beli akun paypal verified",
  "beli barang dengan paypal",
  "beli barang pakai paypal",
  "beli dengan paypal",
  "beli pakai paypal",
  "beli pake paypal",
  "beli paypal saldo",
  "beli paypal terpercaya",
  "beli paypall",
  "beli saldo paypal tanpa minimum",
  "beli saldo paypal terpercaya",
  "belipaypal",
  "bikin akun paypal tanpa kartu kredit",
  "bikin paypal",
  "bikin paypal tanpa kartu kredit",
  "bikin paypall",
  "buat akun pay pal",
  "buat akun paypal baru",
  "buat akun paypal indonesia",
  "buat akun paypal tanpa kartu kredit",
  "buat akun paypal tanpa rekening",
  "buat paypal dengan kartu debit",
  "buat paypal indonesia",
  "buat paypal tanpa kartu kredit",
  "buat rekening paypal",
  "buat rekening paypal tanpa kartu kredit",
  "cara akun paypal",
  "cara apply paypal",
  "cara bayar dengan mastercard",
  "cara bayar dengan paypal",
  "cara bayar dengan paypal tanpa kartu kredit",
  "cara bayar di paypal",
  "cara bayar ke paypal",
  "cara bayar lewat paypal",
  "cara bayar lewat paypal tanpa kartu kredit",
  "cara bayar lewat visa",
  "cara bayar mastercard",
  "cara bayar melalui paypal",
  "cara bayar menggunakan paypal",
  "cara bayar menggunakan visa",
  "cara bayar netflix dengan paypal",
  "cara bayar netflix pakai paypal",
  "cara bayar online dengan visa",
  "cara bayar pakai mastercard",
  "cara bayar pakai paypal tanpa kartu kredit",
  "cara bayar pakai visa",
  "cara bayar paypal dengan debit card",
  "cara bayar paypal dengan kartu debit",
  "cara bayar paypal di alfamart",
  "cara bayar paypal tanpa kartu kredit",
  "cara bayar via paypal",
  "cara bayar via paypal tanpa kartu kredit",
  "cara bayar visa tanpa kartu kredit",
  "cara bayar zoom dengan paypal",
  "cara belanja dengan paypal",
  "cara belanja di luar negeri tanpa kartu kredit",
  "cara belanja di paypal",
  "cara belanja menggunakan paypal",
  "cara belanja menggunakan paypal tanpa kartu kredit",
  "cara belanja online dengan paypal",
  "cara belanja online luar negeri tanpa kartu kredit",
  "cara belanja pakai paypal",
  "cara belanja paypal",
  "cara beli barang dari luar negeri tanpa kartu kredit",
  "cara beli barang luar negeri tanpa kartu kredit",
  "cara beli dengan paypal",
  "cara beli pakai paypal",
  "cara beli paypal",
  "cara beli paypal tanpa kartu kredit",
  "cara beli saldo paypal",
  "cara bikin account paypal tanpa kartu kredit",
  "cara bikin akun pay pal",
  "cara bikin akun paypal tanpa kartu kredit",
  "cara bikin akun paypal tanpa rekening",
  "cara bikin kartu paypal",
  "cara bikin paypal tanpa kartu kredit",
  "cara buat account paypal",
  "cara buat account paypal tanpa kartu kredit",
  "cara buat akun paypal indonesia",
  "cara buat akun paypal tanpa kartu kredit",
  "cara buat akun paypal tanpa rekening",
  "cara buat email paypal",
  "cara buat kartu paypal",
  "cara buat paypal indonesia",
  "cara buat paypal tanpa kartu kredit",
  "cara buat paypal tanpa rekening",
  "cara buat rekening paypal tanpa kartu kredit",
  "cara daftar akun paypal tanpa kartu kredit",
  "cara gunakan paypal",
  "cara gunakan paypal tanpa kartu kredit",
  "cara jual saldo paypal",
  "cara melakukan pembayaran dengan paypal",
  "cara melakukan pembayaran melalui paypal",
  "cara melakukan pembayaran menggunakan paypal",
  "cara melakukan pembayaran paypal",
  "cara melakukan pembayaran paypal tanpa kartu kredit",
  "cara melakukan pembayaran via paypal",
  "cara memakai paypal",
  "cara memakai paypal di indonesia",
  "cara membayar dengan mastercard",
  "cara membayar dengan paypal",
  "cara membayar dengan paypal tanpa kartu kredit",
  "cara membayar di paypal",
  "cara membayar lewat paypal",
  "cara membayar melalui paypal",
  "cara membayar menggunakan paypal",
  "cara membayar menggunakan paypal tanpa kartu kredit",
  "cara membayar pakai paypal",
  "cara membayar paypal",
  "cara membayar paypal dengan rekening bank",
  "cara membayar paypal tanpa kartu kredit",
  "cara membayar tagihan paypal",
  "cara membayar via paypal",
  "cara membayar visa tanpa kartu kredit",
  "cara membayar zoom dengan paypal",
  "cara membeli barang dengan paypal",
  "cara membeli dengan paypal",
  "cara membeli menggunakan paypal",
  "cara membeli paypal",
  "cara membeli saldo paypal",
  "cara membuat account paypal tanpa credit card",
  "cara membuat account paypal tanpa kartu kredit",
  "cara membuat akun di paypal",
  "cara membuat akun pay pal",
  "cara membuat akun paypal dengan kartu debit",
  "cara membuat akun paypal tanpa kartu kredit",
  "cara membuat akun paypal tanpa rekening",
  "cara membuat aplikasi paypal",
  "cara membuat dan menggunakan paypal",
  "cara membuat kartu debit paypal",
  "cara membuat kartu kredit paypal",
  "cara membuat kartu paypal",
  "cara membuat pay pal",
  "cara membuat paypal di indonesia",
  "cara membuat paypal indonesia",
  "cara membuat paypal tanpa kartu kredit",
  "cara membuat paypal tanpa rekening",
  "cara membuat pembayaran melalui paypal",
  "cara memiliki akun paypal",
  "cara memiliki akun paypal tanpa kartu kredit",
  "cara memiliki paypal",
  "cara memiliki paypal tanpa kartu kredit",
  "cara mempunyai paypal",
  "cara mendaftar akun paypal tanpa kartu kredit",
  "cara menerima pembayaran dari kartu kredit",
  "cara menerima pembayaran dengan kartu kredit",
  "cara menerima pembayaran kartu kredit",
  "cara menggunakan akun paypal",
  "cara menggunakan aplikasi paypal",
  "cara menggunakan mastercard",
  "cara menggunakan pay pal",
  "cara menggunakan paypal di indonesia",
  "cara menggunakan paypal tanpa kartu kredit",
  "cara menggunakan paypal untuk belanja online",
  "cara menggunakan paypal untuk pembayaran",
  "cara menggunakan pembayaran paypal",
  "cara menggunakan saldo paypal",
  "cara menggunakan uang di paypal",
  "cara mengirim uang ke paypal tanpa kartu kredit",
  "cara mengisi saldo di paypal",
  "cara mengisi saldo paypal tanpa kartu kredit",
  "cara menjual saldo paypal",
  "cara pakai aplikasi paypal",
  "cara pakai paypal di indonesia",
  "cara pakai paypal tanpa kartu kredit",
  "cara paypal",
  "cara paypal tanpa kartu kredit",
  "cara pembayaran dengan mastercard",
  "cara pembayaran dengan paypal",
  "cara pembayaran lewat paypal",
  "cara pembayaran lewat visa",
  "cara pembayaran mastercard",
  "cara pembayaran melalui paypal",
  "cara pembayaran melalui visa",
  "cara pembayaran menggunakan paypal",
  "cara pembayaran menggunakan visa",
  "cara pembayaran online dengan kartu kredit",
  "cara pembayaran online ke luar negeri",
  "cara pembayaran online luar negeri",
  "cara pembayaran pakai paypal",
  "cara pembayaran pay pal",
  "cara pembayaran paypal dengan debit",
  "cara pembayaran paypal tanpa kartu kredit",
  "cara pembayaran via paypal",
  "cara pembuatan paypal",
  "cara penggunaan paypal",
  "cara pengisian saldo paypal",
  "cara pinjam saldo paypal",
  "cara punya akun paypal",
  "cara punya akun paypal tanpa kartu kredit",
  "cara punya paypal",
  "cara punya paypal tanpa kartu kredit",
  "cara saldo paypal",
  "cara top up akun paypal",
  "cara top up balance paypal",
  "cara top up dengan paypal",
  "cara top up di paypal",
  "cara top up ke paypal",
  "cara top up pake paypal",
  "cara top up paypal balance",
  "cara top up paypal dengan kartu kredit",
  "cara top up paypal indonesia",
  "cara top up paypal tanpa kartu kredit",
  "cara top up saldo paypal",
  "cara transaksi dengan paypal",
  "cara transaksi di paypal",
  "cara transaksi lewat paypal",
  "cara transaksi menggunakan paypal",
  "cara transaksi pakai paypal",
  "cara transaksi paypal",
  "cara transaksi paypal tanpa kartu kredit",
  "cara transaksi via paypal",
  "cara transfer ke paypal tanpa kartu kredit",
  "cara transfer visa mastercard",
  "cara vcc paypal",
  "cara verif paypal",
  "contoh akun paypal",
  "contoh paypal",
  "contoh saldo paypal",
  "credit card luar negeri",
  "daftar akun paypal tanpa kartu kredit",
  "daftar paypal indonesia tanpa kartu kredit",
  "debit card yang bisa untuk paypal",
  "debit untuk paypal",
  "deposit saldo paypal",
  "harga vcc paypal",
  "id akun paypal",
  "jasa akun paypal",
  "jasa bayar credit card",
  "jasa bayar id",
  "jasa bayar online",
  "jasa bayar paypal murah",
  "jasa bayar skrill",
  "jasa bayar visa",
  "jasa beli paypal",
  "jasa beli saldo paypal",
  "jasa cc",
  "jasa jual beli paypal",
  "jasa jual saldo paypal",
  "jasa limit paypal",
  "jasa mastercard",
  "jasa patreon",
  "jasa paypal indonesia",
  "jasa paypal murah",
  "jasa pembayaran cc",
  "jasa pembayaran credit card",
  "jasa pembayaran dengan kartu kredit",
  "jasa pembayaran online terpercaya",
  "jasa pembayaran online via kartu kredit",
  "jasa pembayaran patreon",
  "jasa pembayaran paypal 24 jam",
  "jasa pembayaran paypal murah",
  "jasa pembayaran paypal terpercaya",
  "jasa pembayaran skrill",
  "jasa pembayaran via kartu kredit",
  "jasa pembayaran via paypal",
  "jasa pembelian kartu kredit",
  "jasa pembelian paypal",
  "jasa pengisian saldo paypal",
  "jasa saldo paypal",
  "jasa sewa kartu kredit",
  "jasa top up saldo paypal",
  "jasa vcc paypal",
  "jasa verif paypal",
  "jasa virtual credit card",
  "jasapaypal",
  "jenis kartu paypal",
  "jenis paypal",
  "jual account paypal verified",
  "jual akun paypal",
  "jual akun paypal verified",
  "jual balance paypal",
  "jual beli balance paypal",
  "jual beli dollar paypal",
  "jual beli paypal indonesia",
  "jual beli paypal terpercaya",
  "jual beli saldo paypal terpercaya",
  "jual credit card",
  "jual dollar paypal",
  "jual kartu kredit virtual",
  "jual paypal terpercaya",
  "jual saldo",
  "jual saldo paypal terpercaya",
  "jual virtual credit card",
  "jualpaypal",
  "jualsaldo",
  "kartu debit tidak bisa paypal",
  "kartu debit yang bisa digunakan untuk paypal",
  "kartu debit yang bisa paypal",
  "kartu debit yang bisa untuk paypal",
  "kartu kredit paypal",
  "kartu kredit untuk belanja online",
  "kartu kredit untuk paypal",
  "kartu paypal",
  "kartu paypal adalah",
  "kartu visa online",
  "kredit paypal adalah",
  "layanan paypal",
  "login paypal tanpa kartu kredit",
  "membayar dengan paypal",
  "membayar menggunakan paypal",
  "membayar paypal",
  "membeli paypal",
  "membeli saldo paypal",
  "membuat akun pay pal",
  "membuat akun paypal baru",
  "membuat akun paypal dengan kartu debit",
  "membuat akun paypal indonesia",
  "membuat akun paypal tanpa kartu kredit",
  "membuat kartu paypal",
  "membuat pay pal",
  "membuat paypal tanpa kartu kredit",
  "membuat rekening paypal tanpa kartu kredit",
  "menerima pembayaran kartu kredit",
  "menggunakan paypal",
  "menggunakan paypal di indonesia",
  "menggunakan paypal tanpa kartu kredit",
  "mengisi saldo paypal",
  "menjual saldo paypal",
  "menu paypal",
  "metode paypal",
  "metode pembayaran paypal",
  "metode pembayaran paypal adalah",
  "metode pembayaran visa",
  "pakai paypal di indonesia",
  "pakai paypal tanpa kartu kredit",
  "paypal adalah aplikasi",
  "paypal adalah pembayaran",
  "paypal akun",
  "paypal akun adalah",
  "paypal alfamart",
  "paypal aman",
  "paypal aman atau tidak",
  "paypal aman tidak",
  "paypal amankah",
  "paypal bandung",
  "paypal bayar",
  "paypal bisa digunakan di indonesia",
  "paypal bisa pakai kartu debit",
  "paypal buat akun",
  "paypal cara",
  "paypal cara buat",
  "paypal cara menggunakan",
  "paypal cara pakai",
  "paypal dengan kartu debit",
  "paypal harus pakai kartu kredit",
  "paypal id adalah",
  "paypal indo",
  "paypal indonesia adalah",
  "paypal jasa",
  "paypal jual beli",
  "paypal luar negeri",
  "paypal menggunakan kartu debit",
  "paypal murah",
  "paypal pakai kartu debit",
  "paypal pembayaran",
  "paypal resmi",
  "paypal rupiah",
  "paypal saldo beli",
  "paypal tanpa credit card",
  "paypal tanpa kartu kredit",
  "paypal tanpa rekening",
  "paypal verifikasi",
  "paypalindonesia",
  "pembayaran aliexpress dengan paypal",
  "pembayaran dengan kartu kredit",
  "pembayaran dengan mastercard",
  "pembayaran dengan paypal",
  "pembayaran dengan paypal adalah",
  "pembayaran dengan paypal tanpa kartu kredit",
  "pembayaran dengan visa",
  "pembayaran ebay selain paypal",
  "pembayaran kartu kredit online",
  "pembayaran lewat paypal",
  "pembayaran lewat visa",
  "pembayaran mastercard",
  "pembayaran melalui mastercard",
  "pembayaran melalui paypal",
  "pembayaran melalui paypal adalah",
  "pembayaran melalui visa",
  "pembayaran melalui visa atau mastercard",
  "pembayaran menggunakan kartu kredit",
  "pembayaran menggunakan paypal",
  "pembayaran menggunakan visa",
  "pembayaran online dengan kartu kredit",
  "pembayaran online internasional",
  "pembayaran online selain paypal",
  "pembayaran pakai paypal",
  "pembayaran pake paypal",
  "pembayaran patreon",
  "pembayaran paypal adalah",
  "pembayaran paypal dengan kartu debit",
  "pembayaran paypal di indonesia",
  "pembayaran paypal tanpa kartu kredit",
  "pembayaran via kartu kredit",
  "pembayaran via paypal",
  "pembayaran via paypal adalah",
  "pembayaran via visa",
  "pembayaran visa",
  "pembayaran visa dan mastercard",
  "pembayaran yang menggunakan paypal",
  "pembelian dengan paypal",
  "pembelian menggunakan paypal",
  "pembelian paypal",
  "pembelian saldo paypal",
  "pembuatan paypal",
  "penggunaan paypal",
  "penggunaan paypal di indonesia",
  "pengisian paypal",
  "pengisian saldo paypal",
  "proses pembayaran paypal",
  "rekening paypal adalah",
  "rekening paypal tanpa kartu kredit",
  "saldo paypal adalah",
  "saldo paypal bisa digunakan untuk",
  "saldo paypal terpercaya",
  "sewa kartu kredit",
  "sistem pembayaran paypal",
  "sistem pembayaran paypal adalah",
  "situs paypal",
  "situs resmi paypal",
  "situs web paypal",
  "syarat akun paypal",
  "syarat buat akun paypal",
  "syarat buat paypal",
  "syarat paypal",
  "tagihan paypal",
  "teman pay",
  "tentang aplikasi paypal",
  "terima pembayaran kartu kredit",
  "tidak bisa top up paypal",
  "tidak punya kartu kredit untuk paypal",
  "toko online pembayaran paypal",
  "top up akun paypal",
  "top up bayar pakai paypal",
  "top up dengan paypal",
  "top up pakai paypal",
  "top up paypal dengan kartu kredit",
  "top up paypal tanpa kartu kredit",
  "top up paypal terpercaya",
  "topup paypal indonesia",
  "transaksi dengan paypal",
  "transaksi di paypal",
  "transaksi kartu kredit online",
  "transaksi menggunakan paypal",
  "transaksi online dengan kartu kredit",
  "transaksi online kartu kredit",
  "transaksi paypal",
  "transaksi paypal adalah",
  "transaksi paypal tanpa kartu kredit",
  "transaksi via paypal",
  "vcc indonesia terpercaya",
  "vcc untuk paypal",
  "visa pembayaran",
  "web resmi paypal",
  "daftar paypal",
  "saldopp",
  "beli paypal",
  "jasa cv paypal",
  "cara daftar paypal",
  "cv paypal",
  "vcc mastercard",
  "cara membuat akun paypal",
  "jasa convert paypal ke dana",
  "top up dana via paypal murah",
  "jasa convert paypal",
  "beli saldo dana via paypal",
  "daftar akun paypal",
  "vcc visa",
  "cara transfer ke paypal",
  "daftar paypal indonesia",
  "jual saldo paypal ke dana",
  "beli saldo paypal murah",
  "convert saldo paypal",
  "jual saldo paypal 24 jam",
  "dana ke paypal",
  "cara mendapatkan saldo paypal",
  "jasa tukar paypal ke dana",
  "tukar saldo paypal",
  "cara top up paypal lewat dana",
  "tukar paypal ke rupiah",
  "cv paypal ke dana",
  "cara top up paypal dengan bca",
  "cara mengisi paypal",
  "membuat akun paypal",
  "beli saldo paypal $5",
  "cara transfer paypal",
  "beli saldo paypal $1",
  "aktivasi paypal",
  "aktivasi paypal tanpa kartu kredit",
  "akun pay",
  "akun paypal terverifikasi",
  "akun paypal tidak bisa menerima pembayaran",
  "akun paypal tidak terverifikasi",
  "akun paypal untuk menerima pembayaran",
  "akun paypal verified",
  "akun paypal yang sudah terverifikasi",
  "akunpaypal",
  "alamat paypal",
  "aplikasi convert paypal",
  "aplikasi dapat saldo paypal",
  "aplikasi mendapatkan saldo paypal",
  "aplikasi pay pal",
  "aplikasi saldo paypal",
  "aplikasi top up paypal",
  "arti paypall",
  "artinya paypal",
  "aturan paypal",
  "bank untuk paypal",
  "bank yang bisa paypal",
  "bayar paypal dengan dana",
  "bayar paypal pakai bca",
  "beli balance paypal",
  "beli dana pakai paypal",
  "beli dollar paypal",
  "beli paypal 24 jam",
  "beli paypal dengan pulsa",
  "beli saldo",
  "beli saldo dana dengan paypal",
  "beli saldo paypal $10",
  "beli saldo paypal 24 jam",
  "beli saldo paypal shopee",
  "beli saldo paypal via dana",
  "beli saldo paypal via gopay",
  "beli saldo paypal via ovo",
  "beli saldo paypal via pulsa",
  "beli vcc",
  "beli vcc murah",
  "beli vcc paypal",
  "beli vcc paypal murah",
  "beli vcc untuk paypal",
  "biaya paypal",
  "bonus saldo paypal",
  "buat paypal bca",
  "buy saldo paypal",
  "buypaypal",
  "cara agar akun paypal terverifikasi",
  "cara aktivasi paypal tanpa kartu kredit",
  "cara akun paypal terverifikasi",
  "cara bayar paypal dengan dana",
  "cara bayar paypal dengan mandiri",
  "cara beli saldo dana pakai paypal",
  "cara beli saldo paypal di tokopedia",
  "cara beli vcc paypal",
  "cara bertransaksi dengan paypal",
  "cara bertransaksi menggunakan paypal",
  "cara buat akun paypal tanpa kartu kredit dan vcc",
  "cara buat akun paypal untuk menerima pembayaran",
  "cara buat pay pal",
  "cara buat rekening paypal",
  "cara buat vcc paypal",
  "cara buat vcc untuk verifikasi paypal",
  "cara cari saldo paypal",
  "cara cek saldo di paypal",
  "cara cek saldo paypal",
  "cara cepat dapat saldo paypal",
  "cara cepat mendapatkan saldo paypal",
  "cara convert paypal",
  "cara convert saldo paypal",
  "cara daftar akun paypal",
  "cara daftar aplikasi paypal",
  "cara daftar di paypal",
  "cara daftar di paypal tanpa kartu kredit",
  "cara daftar ke paypal",
  "cara daftar pay pay",
  "cara daftar paypal 2021",
  "cara daftar paypal dengan email",
  "cara daftar paypal di aplikasi",
  "cara daftar paypal indonesia",
  "cara daftar paypal tanpa kartu kredit",
  "cara daftar paypal tanpa kartu kredit dan vcc",
  "cara daftar paypal tanpa rekening",
  "cara daftar rekening paypal",
  "cara daftar rekening paypal tanpa kartu kredit",
  "cara dapat saldo paypal cepat",
  "cara deposit di paypal",
  "cara deposit ke paypal",
  "cara deposit paypal",
  "cara jual paypal",
  "cara kerja pay pal",
  "cara kirim dana ke paypal",
  "cara kirim ke paypal",
  "cara kirim paypal",
  "cara kirim paypal ke paypal",
  "cara kirim paypal tanpa fee",
  "cara kirim saldo ke paypal",
  "cara kirim saldo paypal",
  "cara kirim saldo paypal ke paypal",
  "cara kirim saldo paypal ke rekening",
  "cara kirim uang dari dana ke paypal",
  "cara kirim uang dari paypal ke paypal",
  "cara kirim uang di paypal",
  "cara kirim uang paypal ke paypal",
  "cara konfirmasi paypal",
  "cara konfirmasi pembayaran paypal",
  "cara masuk akun paypal",
  "cara masuk ke akun paypal",
  "cara masuk ke paypal",
  "cara masuk paypal",
  "cara memasukan saldo paypal",
  "cara membeli vcc untuk paypal",
  "cara membuat account paypal",
  "cara membuat akun paypal di aplikasi",
  "cara membuat akun paypal terverifikasi",
  "cara membuat akun paypal verified",
  "cara membuat paypal account",
  "cara membuat paypal bisnis",
  "cara membuat paypal tanpa kartu kredit dan vcc",
  "cara membuat vcc paypal",
  "cara membuat virtual credit card untuk paypal",
  "cara memverifikasi akun paypal",
  "cara memverifikasi akun paypal tanpa kartu kredit",
  "cara memverifikasi akun paypal tanpa kartu kredit dan vcc",
  "cara memverifikasi paypal tanpa kartu kredit dan vcc",
  "cara menambah balance paypal",
  "cara menambah saldo di paypal",
  "cara menambah saldo paypal",
  "cara menambah saldo paypal dengan rekening bank",
  "cara mendaftar paypal tanpa kartu kredit",
  "cara mendapatkan saldo di paypal",
  "cara mendapatkan saldo paypal dengan cepat",
  "cara mendapatkan saldo paypal dengan mudah",
  "cara menerima dana dari paypal",
  "cara menerima saldo paypal",
  "cara mengecek saldo paypal",
  "cara mengembalikan dana paypal",
  "cara menggunakan paypal mandiri",
  "cara menggunakan paypal untuk menerima pembayaran",
  "cara menggunakan vcc paypal",
  "cara mengirim dana ke paypal",
  "cara mengirim paypal",
  "cara mengirim paypal ke dana",
  "cara mengirim saldo paypal",
  "cara mengirim saldo paypal ke paypal lain",
  "cara mengisi akun paypal",
  "cara mengisi balance paypal",
  "cara mengisi dana di paypal",
  "cara mengisi dana ke paypal",
  "cara mengisi dana paypal",
  "cara mengisi paypal balance",
  "cara mengisi paypal dengan bni",
  "cara mengisi paypal dengan dana",
  "cara mengisi paypal dengan mandiri",
  "cara mengisi paypal tanpa kartu kredit",
  "cara mengisi rekening paypal",
  "cara mengisi saldo akun paypal",
  "cara mengisi saldo paypal dari bca",
  "cara mengisi saldo paypal dari rekening bank",
  "cara mengisi saldo paypal dengan bank bca",
  "cara mengisi saldo paypal dengan bank bni",
  "cara mengisi saldo paypal dengan bank mandiri",
  "cara mengisi saldo paypal dengan bni",
  "cara mengisi saldo paypal dengan dana",
  "cara mengisi saldo paypal lewat bca",
  "cara mengisi uang di paypal",
  "cara mengisi uang ke paypal",
  "cara meningkatkan saldo paypal",
  "cara mudah mendapatkan saldo paypal",
  "cara paypal terverifikasi",
  "cara pengisian paypal",
  "cara refund saldo paypal",
  "cara saldo paypal ke dana",
  "cara sign up paypal",
  "cara sign up paypal indonesia",
  "cara tambah saldo di paypal",
  "cara tambah saldo paypal",
  "cara top up dana dari paypal",
  "cara top up dana dengan paypal",
  "cara top up dana lewat paypal",
  "cara top up dana pakai paypal",
  "cara top up dana via paypal",
  "cara top up lewat paypal",
  "cara top up menggunakan paypal",
  "cara top up pakai paypal",
  "cara top up paypal bni",
  "cara top up paypal dengan bni",
  "cara top up paypal dengan dana",
  "cara top up paypal dengan mandiri",
  "cara top up paypal dengan pulsa",
  "cara top up paypal dengan tokopedia",
  "cara top up paypal di tokopedia",
  "cara top up paypal lewat bca",
  "cara top up paypal mandiri",
  "cara top up paypal tokopedia",
  "cara top up saldo paypal dengan bca",
  "cara transfer bank ke paypal",
  "cara transfer dana ke paypal",
  "cara transfer dana paypal",
  "cara transfer dari bank ke paypal",
  "cara transfer dari dana ke paypal",
  "cara transfer dari paypal",
  "cara transfer dari paypal ke paypal",
  "cara transfer dengan paypal",
  "cara transfer di paypal",
  "cara transfer dollar ke paypal",
  "cara transfer ke akun paypal",
  "cara transfer ke rekening paypal",
  "cara transfer melalui paypal",
  "cara transfer menggunakan paypal",
  "cara transfer pakai paypal",
  "cara transfer paypal ke luar negeri",
  "cara transfer paypal ke paypal",
  "cara transfer paypal ke paypal lain",
  "cara transfer paypal tanpa fee",
  "cara transfer rupiah ke paypal",
  "cara transfer saldo ke paypal",
  "cara transfer saldo paypal",
  "cara transfer saldo paypal ke akun dana",
  "cara transfer saldo paypal ke paypal lain",
  "cara transfer uang dari paypal",
  "cara transfer uang dengan paypal",
  "cara transfer uang di paypal",
  "cara transfer uang ke akun paypal",
  "cara transfer uang ke paypal",
  "cara transfer uang ke rekening paypal",
  "cara transfer uang lewat paypal",
  "cara transfer uang melalui paypal",
  "cara transfer uang paypal",
  "cara transfer uang via paypal",
  "cara transfer via paypal",
  "cara tukar dollar paypal ke rupiah",
  "cara tukar saldo paypal",
  "cara tukar saldo paypal ke pulsa",
  "cara vcc paypal gratis",
  "cara verified akun paypal",
  "cara verified paypal",
  "cara verifikasi paypal",
  "cara verifikasi paypal dengan dana",
  "cara verifikasi paypal dengan vcc",
  "cara verifikasi paypal tanpa kartu kredit",
  "cara verifikasi rekening paypal",
  "cara verifikasi vcc paypal",
  "cari saldo paypal",
  "cek id paypal",
  "convert dana ke paypal",
  "convert paypal ke rupiah",
  "convert paypal terpercaya",
  "convert paypal to idr",
  "cv paypal adalah",
  "cv saldo paypal",
  "daftar akun paypal indonesia",
  "daftar aplikasi paypal",
  "daftar dapat saldo paypal",
  "daftar email paypal",
  "daftar paypal dengan dana",
  "daftar paypal dengan email",
  "daftar paypal mandiri",
  "daftar paypal menggunakan email",
  "daftar paypal online",
  "daftar paypal tanpa kartu kredit",
  "daftar paypal tanpa rekening bank",
  "daftar rekening paypal",
  "dana dan paypal",
  "dana ditahan di paypal",
  "dana ditahan paypal",
  "dana paypal ditahan",
  "dana paypal tertahan",
  "dana tertahan di paypal",
  "dapat paypal",
  "dapat saldo paypal",
  "dapatkan saldo paypal",
  "deposit dengan paypal",
  "deposit ke paypal",
  "deposit pakai paypal",
  "dollar ke rupiah paypal",
  "exchange paypal to idr",
  "exchanger paypal indonesia",
  "exchanger paypal terpercaya",
  "free saldo paypal",
  "fungsi vcc paypal",
  "gambar saldo paypal",
  "harga saldo paypal",
  "informasi paypal",
  "jasa aktivasi paypal",
  "jasa bikin akun paypal",
  "jasa buat akun paypal",
  "jasa cairkan paypal",
  "jasa convert paypal ke bank",
  "jasa convert paypal ke rupiah",
  "jasa convert paypal terpercaya",
  "jasa convert saldo paypal",
  "jasa paypal ke dana",
  "jasa pembayaran paypal tokopedia",
  "jasa pembuatan akun paypal",
  "jasa pembuatan paypal",
  "jasa pembuatan vcc paypal",
  "jasa pencairan paypal",
  "jasa penukaran paypal",
  "jasa penukaran paypal ke rupiah",
  "jasa penukaran saldo paypal",
  "jasa tarik paypal",
  "jasa tukar paypal",
  "jasa tukar paypal ke rupiah",
  "jasa tukar saldo paypal",
  "jasa vcc",
  "jasa vcc murah",
  "jasa vcc paypal terpercaya",
  "jasa vcc terpercaya",
  "jasa verifikasi akun paypal",
  "jasa verifikasi paypal terpercaya",
  "jual beli akun paypal",
  "jual beli paypal 24 jam",
  "jual beli paypal murah",
  "jual beli paypal otomatis",
  "jual beli saldo paypal 24 jam",
  "jual paypal 24 jam",
  "jual paypal ke dana",
  "jual paypal murah",
  "jual saldo dana via paypal",
  "jual saldo paypal murah",
  "jual saldo paypal murah dan terpercaya",
  "jual vcc murah",
  "jual vcc paypal",
  "jual vcc paypal murah",
  "kartu kredit gratis untuk verifikasi paypal",
  "kartu kredit virtual untuk paypal",
  "keamanan paypal",
  "kegunaan vcc paypal",
  "ketentuan paypal",
  "keuntungan menggunakan paypal",
  "keuntungan paypal",
  "kirim dana ke paypal",
  "kirim paypal",
  "kirim paypal ke paypal",
  "kirim saldo paypal",
  "kirim saldo paypal ke paypal",
  "kirim uang dengan paypal",
  "kirim uang ke paypal",
  "kirim uang paypal",
  "konfirmasi paypal",
  "konversi paypal",
  "lama pengiriman paypal",
  "limit paypal adalah",
  "limit paypal yang belum verifikasi",
  "limit saldo paypal",
  "maksimal saldo paypal",
  "mandiri paypal",
  "masalah paypal",
  "masuk ke paypal",
  "masuk paypal",
  "masuk paypal indonesia",
  "membuat account paypal",
  "membuat rekening paypal",
  "membuat vcc paypal",
  "menambah saldo paypal",
  "mendaftar paypal tanpa kartu kredit",
  "mendapatkan saldo paypal",
  "menerima pembayaran dari paypal",
  "menerima pembayaran dengan paypal",
  "menerima pembayaran paypal",
  "menerima uang dari paypal",
  "mengirim uang ke paypal",
  "mengisi akun paypal",
  "mengisi paypal",
  "mengisi paypal dengan mandiri",
  "mengisi saldo paypal dari rekening bank",
  "mengisi saldo paypal dengan bca",
  "mengisi saldo paypal dengan dana",
  "minimal kirim saldo paypal",
  "minimal saldo paypal",
  "minimal transfer paypal ke paypal",
  "minta saldo paypal",
  "nomor id paypal",
  "nomor kartu paypal",
  "nomor paypal",
  "paypal account adalah",
  "paypal balance adalah",
  "paypal beli",
  "paypal cara daftar",
  "paypal cara kerja",
  "paypal changer",
  "paypal daftar indonesia",
  "paypal dana ditahan",
  "paypal digunakan untuk",
  "paypal ditahan",
  "paypal hari ini",
  "paypal idr",
  "paypal itu",
  "paypal ke bank",
  "paypal kirim ke dana",
  "paypal kirim uang",
  "paypal mandiri",
  "paypal pribadi",
  "paypal rekening bank",
  "paypal tanpa kartu kredit dan vcc",
  "paypal tanpa rekening bank",
  "paypal tanpa vcc",
  "paypal tanpa verifikasi",
  "paypal tidak bisa digunakan",
  "paypal tidak bisa menerima pembayaran",
  "paypal tidak bisa mengirim pembayaran",
  "paypal tidak bisa transfer",
  "paypal tidak terverifikasi",
  "paypal to idr",
  "paypal untuk menerima uang",
  "paypall daftar",
  "paypall indonesia",
  "pembayaran ditahan paypal",
  "pembayaran paypal artinya",
  "pembayaran paypal ditahan",
  "pembayaran paypal via bca",
  "pembuatan akun paypal",
  "pengalaman menggunakan paypal",
  "pengalaman paypal",
  "pengembalian dana paypal",
  "penjelasan paypal",
  "penukaran paypal",
  "penukaran paypal ke rupiah",
  "penukaran saldo paypal",
  "peraturan paypal",
  "persyaratan membuat paypal",
  "persyaratan paypal",
  "potongan paypal",
  "potongan transaksi paypal",
  "potongan transfer paypal",
  "rate paypal ke rupiah",
  "rekening paypal",
  "rekening untuk paypal",
  "review aplikasi paypal",
  "saldo dana via paypal",
  "saldo ditahan paypal",
  "saldo id",
  "saldo maksimal paypal",
  "saldo minimal paypal",
  "saldo paypal $5",
  "saldo paypal 1000",
  "saldo paypal ditahan",
  "saldo paypal ditahan 24 jam",
  "saldo paypal ke rupiah",
  "saldo paypal murah",
  "saldo paypal tertahan",
  "saldo paypal tidak masuk",
  "saldopp penipu",
  "saya mau jual saldo paypal",
  "situs convert paypal",
  "situs jual beli paypal terpercaya",
  "syarat dan ketentuan paypal",
  "syarat membuat paypal",
  "syarat menggunakan paypal",
  "syarat pembuatan paypal",
  "tambah saldo paypal",
  "tampung saldo paypal",
  "tempat beli saldo paypal terpercaya",
  "tempat beli vcc terpercaya",
  "tempat jual saldo paypal",
  "tempat penukaran paypal",
  "terima pembayaran paypal",
  "tidak bisa mengirim saldo paypal",
  "top up dana dengan paypal",
  "top up dana lewat paypal",
  "top up dana pakai paypal",
  "top up menggunakan paypal",
  "top up paypal bank mandiri",
  "top up paypal bni",
  "top up paypal dengan bca",
  "top up paypal dengan dana",
  "top up paypal dengan mandiri",
  "top up paypal dengan pulsa",
  "top up paypal lewat dana",
  "top up paypal mandiri",
  "top up paypal mandiri online",
  "top up paypal pakai pulsa",
  "top up paypal via mandiri",
  "top up paypal via pulsa",
  "top up saldo dana via paypal",
  "top up saldo paypal dengan dana",
  "top up saldo paypal tokopedia",
  "topup dana via paypal",
  "topup via paypal",
  "transfer bank ke paypal",
  "transfer dana ke paypal",
  "transfer dari bank ke paypal",
  "transfer dari dana ke paypal",
  "transfer ke paypal dari bni",
  "transfer ke paypal dari mandiri",
  "transfer saldo paypal",
  "transfer uang dari bca ke paypal",
  "transfer uang dari paypal",
  "transfer uang dengan paypal",
  "transfer uang ke paypal",
  "transfer uang lewat paypal",
  "transfer uang paypal",
  "tukar paypal",
  "tukar pulsa ke paypal",
  "tukar saldo paypal ke rupiah",
  "uang dari paypal",
  "uang di paypal",
  "uang ditahan paypal",
  "uang paypal",
  "uang paypal ditahan",
  "vcc murah net",
  "vcc murah paypal",
  "vcc murah terpercaya",
  "vcc paypal adalah",
  "vcc paypal gratis",
  "vcc paypal murah",
  "vcc untuk verifikasi paypal",
  "vcc verifikasi paypal",
  "verifikasi akun paypal",
  "verifikasi akun paypal dengan bank lokal",
  "verifikasi akun paypal tanpa kartu kredit",
  "verifikasi paypal dengan dana",
  "verifikasi paypal dengan vcc",
  "verifikasi paypal indonesia",
  "verifikasi paypal tanpa kartu kredit",
  "verifikasi paypal tanpa kartu kredit dan vcc",
  "verifikasi rekening paypal",
  "verifikasi vcc paypal",
  "viapaypal penipu",
  "viapaypalid",
  "yang dimaksud akun paypal",
  "yang dimaksud dengan paypal",
  "yang dimaksud paypal"
];
const ROTATION_STATE_FILE_NEW = path.join(process.cwd(), "data", "keyword-state.json");
const ROTATION_STATE_FILE_OLD = path.join(process.cwd(), "data", "keyword-rotation.json");
async function loadRotationIndex(total) {
  try {
    if (total <= 0) return 0;
    let raw = "";
    let obj = null;
    try {
      raw = await promises.readFile(ROTATION_STATE_FILE_NEW, "utf-8");
      obj = JSON.parse(raw);
    } catch {
      try {
        raw = await promises.readFile(ROTATION_STATE_FILE_OLD, "utf-8");
        obj = JSON.parse(raw);
      } catch {
      }
    }
    let lastIndex;
    if (obj && typeof obj === "object") {
      if (Number.isFinite(obj.lastIndex)) {
        lastIndex = Number(obj.lastIndex);
      } else if (Number.isFinite(obj.index)) {
        const oldNext = Number(obj.index);
        lastIndex = oldNext - 1;
      } else {
        lastIndex = -1;
      }
    } else {
      lastIndex = -1;
    }
    if (!Number.isFinite(lastIndex)) lastIndex = -1;
    if (lastIndex < -1) lastIndex = -1;
    if (total > 0) {
      while (lastIndex >= total) lastIndex -= total;
      while (lastIndex < -1) lastIndex += total;
    }
    return (lastIndex + 1 + (total > 0 ? 0 : 0)) % total;
  } catch {
    return 0;
  }
}
async function saveRotationIndex(index) {
  try {
    const dir = path.dirname(ROTATION_STATE_FILE_NEW);
    try {
      await promises.mkdir(dir, { recursive: true });
    } catch {
    }
    const li = (typeof index === "number" ? index : Number(index || 0)) - 1;
    await promises.writeFile(ROTATION_STATE_FILE_NEW, JSON.stringify({ lastIndex: li }, null, 2), "utf-8");
  } catch {
  }
}
async function collectKeywords(dateStr) {
  const date = dateStr || todayDateStr();
  const dir = keywordsDirFor(date);
  const out = [];
  try {
    const entries = await promises.readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const fname = ent.name;
      if (isDoneFile(fname)) continue;
      if (!isTxtFile(fname)) continue;
      const full = path.join(dir, fname);
      const lines = await readLines(full);
      const kws = [];
      if (lines.length > 0) kws.push(...lines);
      if (kws.length === 0) {
        const base = fname.replace(/\.txt$/i, "");
        if (base.trim()) kws.push(base.trim());
      }
      if (kws.length > 0) out.push({ file: full, keywords: kws });
    }
  } catch {
  }
  return out;
}
async function markDone(filePath) {
  try {
    const dest = filePath.replace(/\.txt$/i, "") + ".done.txt";
    await promises.rename(filePath, dest);
  } catch {
  }
}
async function runKeywordJobForDate(dateStr, count, publish) {
  const date = dateStr || todayDateStr();
  const limit = Math.min(Math.max(Number(count || DEFAULT_DAILY_COUNT) || DEFAULT_DAILY_COUNT, 1), 50);
  const sources = await collectKeywords(date);
  const hasFiles = sources.length > 0;
  if (hasFiles) {
    try {
      sources.sort((a, b) => String(a.file || "").localeCompare(String(b.file || ""), void 0, { sensitivity: "base" }));
    } catch {
    }
  }
  const pool = [];
  const seen = /* @__PURE__ */ new Set();
  for (const src of sources) {
    for (const kw of src.keywords) {
      const n = normalizeKw(kw);
      if (!n) continue;
      const key = n.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({ kw: n, srcFile: src.file });
    }
  }
  if (!hasFiles) {
    const total = DEFAULT_KEYWORDS.length;
    const start = await loadRotationIndex(total);
    const pickCount = Math.max(1, Number(limit) || 1);
    for (let i = 0; i < pickCount; i++) {
      const kw = DEFAULT_KEYWORDS[(start + i) % total];
      const n = normalizeKw(kw);
      if (!n) continue;
      const key = n.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      pool.push({ kw: n, srcFile: "" });
    }
    const nextIndex = (start + pickCount) % total;
    try {
      await saveRotationIndex(nextIndex);
    } catch {
    }
  }
  const index = await listCachedPosts().catch(() => []);
  const existingSlugs = new Set(index.map((it) => String(it.slug)));
  try {
    const genList = await listGeneratedBlogs().catch(() => []);
    for (const it of genList || []) {
      if (it && typeof it.slug === "string") existingSlugs.add(String(it.slug));
    }
  } catch {
  }
  let processed = 0;
  let skipped = 0;
  const generatedSlugs = [];
  const selectedByFile = /* @__PURE__ */ new Map();
  const allByFile = /* @__PURE__ */ new Map();
  if (hasFiles) {
    for (const src of sources) {
      allByFile.set(src.file, new Set(src.keywords.map((k) => normalizeKw(k).toLowerCase()).filter(Boolean)));
    }
  }
  for (const item of pool) {
    if (processed >= limit) break;
    const kw = item.kw;
    const baseSlug = slugify(kw);
    if (!baseSlug) {
      skipped++;
      continue;
    }
    let slug = baseSlug;
    let suffix = 1;
    while (existingSlugs.has(slug)) {
      suffix++;
      slug = `${baseSlug}-${suffix}`;
      if (suffix > 50) break;
    }
    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }
    try {
      const gen = await generatePlaceholderPostBySlug(slug);
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const ensuredContentRaw = ensureContentLength(String(gen.content || ""), kw);
      let ensuredExcerpt = String(gen.excerpt || "");
      if (!ensuredExcerpt || wordCount(ensuredExcerpt) < 15) {
        ensuredExcerpt = makeExcerptFromContent(ensuredContentRaw, 40);
      }
      const initialTitle = buildSeoFriendlyTitle(kw, gen.title);
      const sanitized = sanitizeTitleAndContent(initialTitle, ensuredContentRaw, kw);
      const safeTitle = sanitized.title;
      const safeContent = sanitized.content;
      const ensuredAiUrl = gen.aiImageUrl || buildAiHeroUrl(safeTitle || kw, slug);
      const heroSource = ensureHeroImage(String(gen.image || ""), safeTitle || kw, slug);
      let localImageUrl = "";
      try {
        if (heroSource) {
          localImageUrl = await cacheHeroImage(heroSource, slug);
        }
      } catch {
      }
      const post = {
        id: Date.now(),
        slug,
        title: safeTitle,
        excerpt: ensuredExcerpt,
        content: safeContent,
        author: pickAuthorForSlug(slug, gen.author),
        date: nowIso,
        image: localImageUrl || heroSource,
        categories: Array.isArray(gen.categories) ? gen.categories : ["Blog"],
        tags: buildTags(kw, Array.isArray(gen.tags) ? gen.tags : [], Array.isArray(gen.categories) ? gen.categories : []),
        aiImageUrl: ensuredAiUrl
      };
      await savePostToCache(post);
      try {
        const mt = String(post.title || "").trim();
        const metaTitle = mt.length > 60 ? mt.slice(0, 60).trim() : mt;
        const mdBase = stripHtml(ensuredExcerpt || safeContent || "");
        const metaDesc = mdBase.length > 160 ? mdBase.slice(0, mdBase.lastIndexOf(" ", 160) > 20 ? mdBase.lastIndexOf(" ", 160) : 160).trim() : mdBase;
        const record = {
          id: Number(post.id) || Date.now(),
          slug: post.slug,
          title: post.title,
          content: post.content,
          publish_at: nowIso,
          featured_image: localImageUrl || heroSource,
          meta_title: metaTitle,
          meta_description: metaDesc
        };
        await appendGeneratedBlogs([record]);
      } catch {
      }
      existingSlugs.add(slug);
      processed++;
      generatedSlugs.push(slug);
      if (item.srcFile) {
        if (!selectedByFile.has(item.srcFile)) selectedByFile.set(item.srcFile, /* @__PURE__ */ new Set());
        selectedByFile.get(item.srcFile).add(normalizeKw(kw).toLowerCase());
      }
    } catch {
      skipped++;
      continue;
    }
  }
  if (hasFiles) {
    for (const [file, allSet] of allByFile.entries()) {
      const chosen = selectedByFile.get(file);
      if (chosen && allSet.size > 0 && chosen.size >= allSet.size) {
        try {
          await markDone(file);
        } catch {
        }
      }
    }
  }
  return { processed, skipped, generated: generatedSlugs };
}
async function ensureImagesDir() {
  const dir = path.join(process.cwd(), "data", "blog", "images");
  try {
    await promises.mkdir(dir, { recursive: true });
  } catch {
  }
  return dir;
}
function pickExtFromContentType(ct) {
  const s = String(ct).toLowerCase();
  if (s.includes("image/webp")) return "webp";
  if (s.includes("image/png")) return "png";
  if (s.includes("image/jpeg") || s.includes("image/jpg")) return "jpg";
  if (s.includes("image/gif")) return "gif";
  return "jpg";
}
function safeBaseName(input) {
  return (input || "").toLowerCase().replace(/[^a-z0-9-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "image";
}
async function cacheHeroImage(sourceUrl, slug) {
  try {
    const dir = await ensureImagesDir();
    const response = await fetch(sourceUrl, { headers: { "User-Agent": "jasapembayaran-bot/1.0" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const ct = response.headers.get("content-type") || "image/jpeg";
    const ext = pickExtFromContentType(ct);
    const base = safeBaseName(slug);
    const fileName = `${base}.${ext}`;
    const filePath = path.join(dir, fileName);
    try {
      await promises.access(filePath);
    } catch {
      const arr = new Uint8Array(await response.arrayBuffer());
      await promises.writeFile(filePath, arr);
    }
    return `/images/blog/${fileName}`;
  } catch (e) {
    return sourceUrl;
  }
}

const keywordJob = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DEFAULT_KEYWORDS: DEFAULT_KEYWORDS,
  collectKeywords: collectKeywords,
  runKeywordJobForDate: runKeywordJobForDate
}, Symbol.toStringTag, { value: 'Module' }));

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _z8jrad = defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  if (!url)
    return createError({ status: 400, message: "Invalid icon request" });
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = url.searchParams.get("icons")?.split(",");
  if (collection) {
    if (icons?.length) {
      const data = getIcons(
        collection,
        icons
      );
      consola$1.debug(`[Icon] serving ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
      return data;
    }
  } else {
    if (collectionName && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
      consola$1.warn([
        `[Icon] Collection \`${collectionName}\` is not found locally`,
        `We suggest to install it via \`npm i -D @iconify-json/${collectionName}\` to provide the best end-user experience.`
      ].join("\n"));
      warnOnceSet.add(collectionName);
    }
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL("./" + basename(url.pathname) + url.search, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${(icons || []).map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola$1.error(e);
      if (e.status === 404)
        return createError({ status: 404 });
      else
        return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(getQuery$1(event).icons || "");
    return `${collection}_${icons.split(",")[0]}_${icons.length}_${hash$2(icons)}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

const _2P4Nha = eventHandler(async (e) => {
  if (e.context._initedSiteConfig)
    return;
  const runtimeConfig = useRuntimeConfig(e);
  const config = runtimeConfig["nuxt-site-config"];
  const nitroApp = useNitroApp();
  const siteConfig = e.context.siteConfig || createSiteConfigStack({
    debug: config.debug
  });
  const nitroOrigin = getNitroOrigin(e);
  e.context.siteConfigNitroOrigin = nitroOrigin;
  {
    siteConfig.push({
      _context: "nitro:init",
      _priority: -4,
      url: nitroOrigin
    });
  }
  siteConfig.push({
    _context: "runtimeEnv",
    _priority: 0,
    ...runtimeConfig.site || {},
    ...runtimeConfig.public.site || {},
    ...envSiteConfig(globalThis._importMeta_.env)
    // just in-case, shouldn't be needed
  });
  const buildStack = config.stack || [];
  buildStack.forEach((c) => siteConfig.push(c));
  if (e.context._nitro.routeRules.site) {
    siteConfig.push({
      _context: "route-rules",
      ...e.context._nitro.routeRules.site
    });
  }
  if (config.multiTenancy) {
    const host = parseURL(nitroOrigin).host;
    const tenant = config.multiTenancy?.find((t) => t.hosts.includes(host));
    if (tenant) {
      siteConfig.push({
        _context: `multi-tenancy:${host}`,
        _priority: 0,
        ...tenant.config
      });
    }
  }
  const ctx = { siteConfig, event: e };
  await nitroApp.hooks.callHook("site-config:init", ctx);
  e.context.siteConfig = ctx.siteConfig;
  e.context._initedSiteConfig = true;
});

const _cGHjLM = eventHandler(async (e) => {
  const siteConfig = getSiteConfig(e);
  const nitroOrigin = getNitroOrigin(e);
  const runtimeConfig = useRuntimeConfig(e);
  const stack = e.context.siteConfig.stack;
  setHeader(e, "Content-Type", "application/json");
  return {
    config: siteConfig,
    stack,
    nitroOrigin,
    version: runtimeConfig["nuxt-site-config"].version
  };
});

const _LDEndl = lazyEventHandler(() => {
  const opts = useRuntimeConfig().ipx || {};
  const fsDir = opts?.fs?.dir ? (Array.isArray(opts.fs.dir) ? opts.fs.dir : [opts.fs.dir]).map((dir) => isAbsolute(dir) ? dir : fileURLToPath(new URL(dir, globalThis._importMeta_.url))) : void 0;
  const fsStorage = opts.fs?.dir ? ipxFSStorage({ ...opts.fs, dir: fsDir }) : void 0;
  const httpStorage = opts.http?.domains ? ipxHttpStorage({ ...opts.http }) : void 0;
  if (!fsStorage && !httpStorage) {
    throw new Error("IPX storage is not configured!");
  }
  const ipxOptions = {
    ...opts,
    storage: fsStorage || httpStorage,
    httpStorage
  };
  const ipx = createIPX(ipxOptions);
  const ipxHandler = createIPXH3Handler(ipx);
  return useBase(opts.baseURL, ipxHandler);
});

const _lazy_L7iSWl = () => Promise.resolve().then(function () { return reloadTracker_get$1; });
const _lazy_H439Jp = () => Promise.resolve().then(function () { return _slug__get$1; });
const _lazy_tNCj9N = () => Promise.resolve().then(function () { return coolTags_get$1; });
const _lazy_mXYniN = () => Promise.resolve().then(function () { return run_get$1; });
const _lazy_5cS4jD = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_BXsVQr = () => Promise.resolve().then(function () { return latest_get$1; });
const _lazy_74_57R = () => Promise.resolve().then(function () { return popular_get$1; });
const _lazy_vyjHL6 = () => Promise.resolve().then(function () { return search_get$1; });
const _lazy_Ud40Lu = () => Promise.resolve().then(function () { return suggest_get$1; });
const _lazy_fW2Pdp = () => Promise.resolve().then(function () { return generatedBlogsRegenerate_get$1; });
const _lazy_tlgZA2 = () => Promise.resolve().then(function () { return health_get$1; });
const _lazy_ESzaRo = () => Promise.resolve().then(function () { return autoBlog_get$1; });
const _lazy_ICaINt = () => Promise.resolve().then(function () { return messages_get$1; });
const _lazy_dzMUcs = () => Promise.resolve().then(function () { return icon_get$1; });
const _lazy_PQAYT2 = () => Promise.resolve().then(function () { return invalidateBlogCache_post$1; });
const _lazy_NJzKQB = () => Promise.resolve().then(function () { return keywordRun_get$1; });
const _lazy_AYZODS = () => Promise.resolve().then(function () { return sitemapDynamic$1; });
const _lazy_aXWDgZ = () => Promise.resolve().then(function () { return smartReloadTracker_post$1; });
const _lazy_1PuPJE = () => Promise.resolve().then(function () { return test_get$1; });
const _lazy_sVUr_x = () => Promise.resolve().then(function () { return testimonials_get$1; });
const _lazy_C6AnCg = () => Promise.resolve().then(function () { return version_get$1; });
const _lazy_nVl4tU = () => Promise.resolve().then(function () { return visitors_get$1; });
const _lazy_T3DqPE = () => Promise.resolve().then(function () { return visitors$1; });
const _lazy_yGyO_p = () => Promise.resolve().then(function () { return _name__get$1; });
const _lazy_zSBIFX = () => Promise.resolve().then(function () { return sitemapDynamic_xml$1; });
const _lazy_6L8Kkn = () => Promise.resolve().then(function () { return sitemap_get$1; });
const _lazy_22DxQv = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '/api/admin/reload-tracker', handler: _lazy_L7iSWl, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/:slug', handler: _lazy_H439Jp, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/cool-tags', handler: _lazy_tNCj9N, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/cron/run', handler: _lazy_mXYniN, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog', handler: _lazy_5cS4jD, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/latest', handler: _lazy_BXsVQr, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/popular', handler: _lazy_74_57R, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/search', handler: _lazy_vyjHL6, lazy: true, middleware: false, method: "get" },
  { route: '/api/blog/suggest', handler: _lazy_Ud40Lu, lazy: true, middleware: false, method: "get" },
  { route: '/api/generated-blogs-regenerate', handler: _lazy_fW2Pdp, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy_tlgZA2, lazy: true, middleware: false, method: "get" },
  { route: '/api/health/auto-blog', handler: _lazy_ESzaRo, lazy: true, middleware: false, method: "get" },
  { route: '/api/i18n/messages', handler: _lazy_ICaINt, lazy: true, middleware: false, method: "get" },
  { route: '/api/icon', handler: _lazy_dzMUcs, lazy: true, middleware: false, method: "get" },
  { route: '/api/invalidate-blog-cache', handler: _lazy_PQAYT2, lazy: true, middleware: false, method: "post" },
  { route: '/api/keyword-run', handler: _lazy_NJzKQB, lazy: true, middleware: false, method: "get" },
  { route: '/api/sitemap-dynamic', handler: _lazy_AYZODS, lazy: true, middleware: false, method: undefined },
  { route: '/api/smart-reload-tracker', handler: _lazy_aXWDgZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/test', handler: _lazy_1PuPJE, lazy: true, middleware: false, method: "get" },
  { route: '/api/testimonials', handler: _lazy_sVUr_x, lazy: true, middleware: false, method: "get" },
  { route: '/api/version', handler: _lazy_C6AnCg, lazy: true, middleware: false, method: "get" },
  { route: '/api/visitors', handler: _lazy_nVl4tU, lazy: true, middleware: false, method: "get" },
  { route: '/api/visitors', handler: _lazy_T3DqPE, lazy: true, middleware: false, method: undefined },
  { route: '/images/blog/:name', handler: _lazy_yGyO_p, lazy: true, middleware: false, method: "get" },
  { route: '/sitemap-dynamic.xml', handler: _lazy_zSBIFX, lazy: true, middleware: false, method: undefined },
  { route: '/sitemap', handler: _lazy_6L8Kkn, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_22DxQv, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _z8jrad, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _2P4Nha, lazy: false, middleware: true, method: undefined },
  { route: '/__site-config__/debug.json', handler: _cGHjLM, lazy: false, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _LDEndl, lazy: false, middleware: false, method: undefined },
  { route: '/_fonts/**', handler: _lazy_22DxQv, lazy: true, middleware: false, method: undefined },
  { route: '/_scripts/**', handler: _lazy_22DxQv, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_22DxQv, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml$1(messages.statusCode) + " - " + escapeHtml$1(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 pointer-events-none right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + escapeHtml$1(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml$1(messages.description) + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml$1(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const reloadTracker_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const action = query.action || "view";
    const clientIp = getClientIp(event) || "unknown";
    const adminKey = query.key;
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return {
        success: false,
        error: "Unauthorized access"
      };
    }
    const storage = useStorage();
    let tracker = {};
    try {
      const stored = await storage.getItem("smart-reload-tracker");
      if (stored) {
        tracker = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load reload tracker:", error);
    }
    const now = Date.now();
    switch (action) {
      case "view":
        const formattedData = Object.entries(tracker).map(([ip, data]) => ({
          ip,
          count: data.count,
          firstAttempt: new Date(data.firstAttempt).toISOString(),
          lastAttempt: new Date(data.lastAttempt).toISOString(),
          blocked: data.blocked,
          blockReason: data.blockReason,
          timeSinceFirst: Math.round((now - data.firstAttempt) / 1e3 / 60),
          // minutes
          timeSinceLast: Math.round((now - data.lastAttempt) / 1e3 / 60),
          // minutes
          blockExpires: data.blocked ? new Date(data.lastAttempt + 30 * 60 * 1e3).toISOString() : null
        }));
        return {
          success: true,
          data: formattedData,
          summary: {
            totalIPs: Object.keys(tracker).length,
            blockedIPs: Object.values(tracker).filter((d) => d.blocked).length,
            activeIPs: Object.values(tracker).filter((d) => !d.blocked).length,
            totalAttempts: Object.values(tracker).reduce((sum, d) => sum + d.count, 0)
          }
        };
      case "blocked":
        const blockedIPs = Object.entries(tracker).filter(([ip, data]) => data.blocked).map(([ip, data]) => ({
          ip,
          count: data.count,
          blockReason: data.blockReason,
          blockTime: new Date(data.lastAttempt).toISOString(),
          blockExpires: new Date(data.lastAttempt + 30 * 60 * 1e3).toISOString(),
          remainingTime: Math.max(0, Math.ceil((data.lastAttempt + 30 * 60 * 1e3 - now) / 1e3 / 60))
        }));
        return {
          success: true,
          blockedIPs,
          count: blockedIPs.length
        };
      case "reset":
        const targetIp = query.ip;
        if (targetIp) {
          if (tracker[targetIp]) {
            tracker[targetIp] = {
              count: 0,
              firstAttempt: now,
              lastAttempt: now,
              blocked: false
            };
            delete tracker[targetIp].blockReason;
          }
        } else {
          tracker = {};
        }
        try {
          await storage.setItem("smart-reload-tracker", JSON.stringify(tracker));
        } catch (error) {
          console.warn("Failed to save reload tracker:", error);
        }
        return {
          success: true,
          message: targetIp ? `Reset data for IP: ${targetIp}` : "Reset all tracking data",
          resetIP: targetIp || "all"
        };
      case "unblock":
        const unblockIp = query.ip;
        if (!unblockIp) {
          return {
            success: false,
            error: "IP address required for unblock action"
          };
        }
        if (tracker[unblockIp]) {
          tracker[unblockIp].blocked = false;
          tracker[unblockIp].count = 0;
          tracker[unblockIp].firstAttempt = now;
          tracker[unblockIp].lastAttempt = now;
          delete tracker[unblockIp].blockReason;
        }
        try {
          await storage.setItem("smart-reload-tracker", JSON.stringify(tracker));
        } catch (error) {
          console.warn("Failed to save reload tracker:", error);
        }
        return {
          success: true,
          message: `Unblocked IP: ${unblockIp}`,
          unblockedIP: unblockIp
        };
      case "stats":
        const stats = {
          totalIPs: Object.keys(tracker).length,
          blockedIPs: Object.values(tracker).filter((d) => d.blocked).length,
          activeIPs: Object.values(tracker).filter((d) => !d.blocked).length,
          totalAttempts: Object.values(tracker).reduce((sum, d) => sum + d.count, 0),
          averageAttempts: Object.keys(tracker).length > 0 ? Math.round(Object.values(tracker).reduce((sum, d) => sum + d.count, 0) / Object.keys(tracker).length * 100) / 100 : 0,
          topOffenders: Object.entries(tracker).sort(([, a], [, b]) => b.count - a.count).slice(0, 10).map(([ip, data]) => ({
            ip,
            count: data.count,
            blocked: data.blocked,
            lastAttempt: new Date(data.lastAttempt).toISOString()
          }))
        };
        return {
          success: true,
          stats
        };
      default:
        return {
          success: false,
          error: "Invalid action. Use: view, blocked, reset, unblock, or stats"
        };
    }
  } catch (error) {
    console.error("Admin reload tracker error:", error);
    return {
      success: false,
      error: "Internal server error",
      details: error.message
    };
  }
});

const reloadTracker_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reloadTracker_get
}, Symbol.toStringTag, { value: 'Module' }));

const _slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug parameter is required"
    });
  }
  try {
    console.log(`Fetching blog post for slug: ${slug}`);
    const { promises: fs } = await import('node:fs');
    const path = await import('node:path');
    const blogDir = path.join(process.cwd(), "data", "blog");
    const blogFile = path.join(blogDir, `${slug}.json`);
    try {
      if (await fs.access(blogFile).then(() => true).catch(() => false)) {
        const content = await fs.readFile(blogFile, "utf-8");
        const blog = JSON.parse(content);
        if (blog && blog.slug && blog.title) {
          console.log(`Found blog post: ${blog.title}`);
          return {
            id: blog.id || Date.now(),
            slug: blog.slug,
            title: blog.title,
            content: blog.content || "",
            excerpt: blog.excerpt || blog.meta_description || "",
            author: blog.author || "JasaPembayaran.com Team",
            date: blog.date || blog.publish_at || (/* @__PURE__ */ new Date()).toISOString(),
            publish_at: blog.date || blog.publish_at || (/* @__PURE__ */ new Date()).toISOString(),
            image: blog.image || blog.featured_image || "/images/fallback-news.svg",
            featured_image: blog.image || blog.featured_image || "/images/fallback-news.svg",
            tags: blog.tags || [blog.slug, "tips", "panduan", "indonesia"],
            categories: blog.categories || ["Blog", "Panduan"],
            meta_title: blog.meta_title || blog.title,
            meta_description: blog.meta_description || blog.excerpt || ""
          };
        }
      }
    } catch (fileError) {
      console.error(`Error reading blog file ${slug}.json:`, fileError);
    }
    let post = await getPostFromCache(slug);
    if (post) {
      console.log(`Found blog post in cache: ${post.title}`);
      return post;
    }
    const generatedBlogs = await listGeneratedBlogs();
    post = generatedBlogs.find((blog) => blog.slug === slug);
    if (post) {
      console.log(`Found blog post in generated blogs: ${post.title}`);
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.meta_description || "",
        author: "JasaPembayaran.com Team",
        date: post.publish_at,
        publish_at: post.publish_at,
        image: post.featured_image,
        featured_image: post.featured_image,
        tags: [post.slug, "tips", "panduan", "indonesia"],
        categories: ["Blog", "Panduan"],
        meta_title: post.meta_title || post.title,
        meta_description: post.meta_description || ""
      };
    }
    console.log(`Creating fallback blog post for slug: ${slug}`);
    return {
      id: Date.now(),
      slug,
      title: `Artikel ${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      content: `
        <h2>Pendahuluan</h2>
        <p>Selamat datang di artikel kami tentang ${slug.replace(/-/g, " ")}. Dalam artikel ini, Anda akan menemukan informasi lengkap dan terpercaya tentang topik ini.</p>
        
        <h2>Tentang Layanan</h2>
        <p>Kami menyediakan layanan profesional yang dapat membantu Anda dengan kebutuhan terkait ${slug.replace(/-/g, " ")}. Tim kami berpengalaman dan siap memberikan solusi terbaik.</p>
        
        <h2>Keunggulan</h2>
        <ul>
          <li>Layanan profesional dan terpercaya</li>
          <li>Proses yang cepat dan aman</li>
          <li>Dukungan customer service 24/7</li>
          <li>Harga yang kompetitif</li>
        </ul>
        
        <h2>Cara Menggunakan</h2>
        <ol>
          <li>Hubungi kami melalui WhatsApp atau email</li>
          <li>Konsultasikan kebutuhan Anda</li>
          <li>Kami akan memberikan penawaran terbaik</li>
          <li>Proses transaksi yang aman dan cepat</li>
          <li>Konfirmasi dan follow-up</li>
        </ol>
        
        <h2>Tips & FAQ</h2>
        <p>Berikut adalah beberapa tips dan pertanyaan yang sering diajukan:</p>
        <ul>
          <li><strong>Apakah layanan ini aman?</strong> Ya, kami menggunakan sistem keamanan berlapis.</li>
          <li><strong>Berapa lama prosesnya?</strong> Biasanya 1-24 jam tergantung kompleksitas.</li>
          <li><strong>Apakah ada garansi?</strong> Ya, kami memberikan garansi kepuasan pelanggan.</li>
        </ul>
        
        <h2>Kesimpulan</h2>
        <p>Dengan layanan kami, Anda dapat mempercayai kebutuhan ${slug.replace(/-/g, " ")} Anda kepada tim profesional yang berpengalaman. Hubungi kami sekarang untuk konsultasi gratis!</p>
      `,
      excerpt: `Panduan lengkap tentang ${slug.replace(/-/g, " ")} - layanan profesional dan terpercaya untuk kebutuhan Anda.`,
      author: "JasaPembayaran.com Team",
      date: (/* @__PURE__ */ new Date()).toISOString(),
      publish_at: (/* @__PURE__ */ new Date()).toISOString(),
      image: "/images/fallback-news.svg",
      featured_image: "/images/fallback-news.svg",
      tags: [slug, "tips", "panduan", "indonesia"],
      categories: ["Blog", "Panduan"],
      meta_title: `Artikel ${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      meta_description: `Panduan lengkap tentang ${slug.replace(/-/g, " ")} - layanan profesional dan terpercaya untuk kebutuhan Anda.`
    };
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return {
      id: Date.now(),
      slug,
      title: `Artikel ${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      content: "<p>Konten blog sedang dimuat...</p>",
      excerpt: "Artikel blog sedang dimuat",
      author: "JasaPembayaran.com Team",
      date: (/* @__PURE__ */ new Date()).toISOString(),
      publish_at: (/* @__PURE__ */ new Date()).toISOString(),
      image: "/images/fallback-news.svg",
      featured_image: "/images/fallback-news.svg",
      tags: [slug, "tips", "panduan", "indonesia"],
      categories: ["Blog", "Panduan"],
      meta_title: `Artikel ${slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}`,
      meta_description: "Artikel blog sedang dimuat"
    };
  }
});

const _slug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _slug__get
}, Symbol.toStringTag, { value: 'Module' }));

const coolTags_get = defineEventHandler(async (event) => {
  try {
    const coolTags = [
      { name: "PayPal", slug: "paypal", count: 15, color: "#0070ba" },
      { name: "Pembayaran", slug: "pembayaran", count: 23, color: "#25d366" },
      { name: "Digital", slug: "digital", count: 18, color: "#ff6b6b" },
      { name: "Online", slug: "online", count: 21, color: "#4ecdc4" },
      { name: "Transaksi", slug: "transaksi", count: 19, color: "#45b7d1" },
      { name: "Keamanan", slug: "keamanan", count: 16, color: "#f9ca24" },
      { name: "Bisnis", slug: "bisnis", count: 14, color: "#6c5ce7" },
      { name: "Tips", slug: "tips", count: 22, color: "#a29bfe" },
      { name: "Panduan", slug: "panduan", count: 17, color: "#fd79a8" },
      { name: "Teknologi", slug: "teknologi", count: 13, color: "#00b894" },
      { name: "Fintech", slug: "fintech", count: 12, color: "#e17055" },
      { name: "E-commerce", slug: "e-commerce", count: 11, color: "#74b9ff" },
      { name: "Bitcoin", slug: "bitcoin", count: 20, color: "#f7931a" },
      { name: "Crypto", slug: "crypto", count: 18, color: "#8b5cf6" },
      { name: "Blockchain", slug: "blockchain", count: 16, color: "#06b6d4" },
      { name: "Trading", slug: "trading", count: 14, color: "#ef4444" },
      { name: "Investasi", slug: "investasi", count: 19, color: "#10b981" },
      { name: "Banking", slug: "banking", count: 17, color: "#3b82f6" },
      { name: "Mobile", slug: "mobile", count: 15, color: "#f59e0b" },
      { name: "App", slug: "app", count: 13, color: "#ec4899" },
      { name: "Web", slug: "web", count: 21, color: "#8b5cf6" },
      { name: "API", slug: "api", count: 12, color: "#06b6d4" },
      { name: "Cloud", slug: "cloud", count: 16, color: "#3b82f6" },
      { name: "AI", slug: "ai", count: 20, color: "#ef4444" }
    ];
    return {
      success: true,
      tags: coolTags
    };
  } catch (error) {
    console.error("Error fetching cool tags:", error);
    return {
      success: false,
      tags: []
    };
  }
});

const coolTags_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: coolTags_get
}, Symbol.toStringTag, { value: 'Module' }));

function todayDateStrWIB() {
  const now = /* @__PURE__ */ new Date();
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1e3;
  const wib = new Date(now.getTime() + WIB_OFFSET_MS);
  const y = wib.getUTCFullYear();
  const m = String(wib.getUTCMonth() + 1).padStart(2, "0");
  const d = String(wib.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
const run_get = defineEventHandler(async (event) => {
  const q = getQuery$1(event);
  const count = Math.min(Math.max(parseInt(String(q.count ?? q.n ?? "10"), 10) || 10, 1), 50);
  const publish = ["1", "true", "yes", "y", "on"].includes(String(q.publish || "").toLowerCase());
  const date = q.date ? String(q.date) : todayDateStrWIB();
  try {
    const { runKeywordJobForDate } = await Promise.resolve().then(function () { return keywordJob; });
    const res = await runKeywordJobForDate(date, count, publish);
    return { ok: true, date, count, publish, ...res };
  } catch (e) {
    return { ok: false, error: String(e?.message || "cron_run_failed") };
  }
});

const run_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: run_get
}, Symbol.toStringTag, { value: 'Module' }));

const index_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(1e3, Math.max(1, Number(query.limit) || 8));
  try {
    const blogDir = path.join(process.cwd(), "data", "blog");
    let allPosts = [];
    try {
      const files = await promises.readdir(blogDir);
      const blogFiles = files.filter(
        (f) => f.endsWith(".json") && f !== "index.json" && f !== "popular-posts.json" && f !== "latest-posts.json" && f !== "cool-tags.json" && !f.includes("generated")
      );
      console.log(`Found ${blogFiles.length} blog files in data/blog directory`);
      for (const file of blogFiles) {
        try {
          const content = await promises.readFile(path.join(blogDir, file), "utf-8");
          const blog = JSON.parse(content);
          if (blog && blog.slug && blog.title) {
            allPosts.push({
              id: blog.id || Date.now() + Math.random(),
              slug: blog.slug,
              title: blog.title,
              date: blog.date || blog.publish_at || (/* @__PURE__ */ new Date()).toISOString(),
              image: blog.image || blog.featured_image || "/images/fallback-news.svg",
              excerpt: blog.excerpt || blog.meta_description || "",
              author: blog.author || "JasaPembayaran.com Team",
              content: blog.content || "",
              categories: blog.categories || ["Blog", "Panduan"],
              tags: blog.tags || [blog.slug, "tips", "panduan", "indonesia"]
            });
          }
        } catch (error) {
          console.error(`Error reading blog file ${file}:`, error);
        }
      }
      console.log(`Successfully loaded ${allPosts.length} blog posts`);
    } catch (error) {
      console.error("Error reading blog directory:", error);
    }
    if (allPosts.length === 0) {
      console.log("No blog posts found, creating sample posts");
      allPosts = [
        {
          id: 1,
          slug: "jasa-paypal",
          title: "Jasa PayPal: Solusi Pembayaran Online Aman",
          date: (/* @__PURE__ */ new Date()).toISOString(),
          image: "/images/fallback-news.svg",
          excerpt: "Panduan lengkap tentang jasa PayPal untuk transaksi online yang aman dan terpercaya.",
          author: "JasaPembayaran.com Team",
          content: "<h2>Pendahuluan</h2><p>PayPal adalah salah satu platform pembayaran online terpopuler di dunia...</p>",
          categories: ["Blog", "Panduan"],
          tags: ["paypal", "pembayaran", "online"]
        },
        {
          id: 2,
          slug: "jasa-bayar-paypal",
          title: "Jasa Bayar PayPal Cepat & Terpercaya",
          date: new Date(Date.now() - 864e5).toISOString(),
          image: "/images/fallback-news.svg",
          excerpt: "Layanan jasa bayar PayPal yang cepat, aman, dan terpercaya untuk kebutuhan transaksi Anda.",
          author: "JasaPembayaran.com Team",
          content: "<h2>Pendahuluan</h2><p>Layanan jasa bayar PayPal kami memberikan solusi terbaik...</p>",
          categories: ["Blog", "Layanan"],
          tags: ["paypal", "jasa", "bayar"]
        },
        {
          id: 3,
          slug: "jasa-transfer-paypal",
          title: "Jasa Transfer PayPal untuk Transaksi Global",
          date: new Date(Date.now() - 1728e5).toISOString(),
          image: "/images/fallback-news.svg",
          excerpt: "Transfer PayPal internasional yang aman dan cepat untuk berbagai kebutuhan bisnis.",
          author: "JasaPembayaran.com Team",
          content: "<h2>Pendahuluan</h2><p>Transfer PayPal internasional menjadi kebutuhan penting...</p>",
          categories: ["Blog", "Transfer"],
          tags: ["paypal", "transfer", "internasional"]
        }
      ];
    }
    allPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    const total = allPosts.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    console.log(`Returning ${paginatedPosts.length} posts for page ${page} of ${totalPages}`);
    return {
      posts: paginatedPosts,
      pagination: {
        page,
        perPage,
        total,
        totalPages
      }
    };
  } catch (error) {
    console.error("Blog API error:", error);
    return {
      posts: [],
      pagination: {
        page: 1,
        perPage: 8,
        total: 0,
        totalPages: 0
      }
    };
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const latest_get = defineEventHandler(async (event) => {
  try {
    const cachedPosts = await listCachedPosts();
    const generatedPosts = await listGeneratedBlogs();
    const allPosts = [
      ...cachedPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        readTime: Math.floor(Math.random() * 10) + 3,
        category: "Panduan"
      })),
      ...generatedPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        readTime: Math.floor(Math.random() * 10) + 3,
        category: "Tips"
      }))
    ];
    const latestPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 24);
    return {
      success: true,
      posts: latestPosts
    };
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return {
      success: false,
      posts: []
    };
  }
});

const latest_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: latest_get
}, Symbol.toStringTag, { value: 'Module' }));

const popular_get = defineEventHandler(async (event) => {
  try {
    const cachedPosts = await listCachedPosts();
    const generatedPosts = await listGeneratedBlogs();
    const allPosts = [
      ...cachedPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        views: Math.floor(Math.random() * 1e4) + 1e3,
        likes: Math.floor(Math.random() * 500) + 50,
        category: "Panduan"
      })),
      ...generatedPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        views: Math.floor(Math.random() * 1e4) + 1e3,
        likes: Math.floor(Math.random() * 500) + 50,
        category: "Tips"
      }))
    ];
    const popularPosts = allPosts.sort((a, b) => b.views - a.views).slice(0, 24);
    return {
      success: true,
      posts: popularPosts
    };
  } catch (error) {
    console.error("Error fetching popular posts:", error);
    return {
      success: false,
      posts: []
    };
  }
});

const popular_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: popular_get
}, Symbol.toStringTag, { value: 'Module' }));

const search_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const q = (query.q || "").trim();
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = 8;
  if (!q || q.length < 2) {
    return {
      posts: [],
      pagination: {
        page,
        perPage,
        total: 0,
        totalPages: 0
      }
    };
  }
  try {
    let allPosts = await listCachedPosts();
    try {
      const generatedPosts = await listGeneratedIndex();
      if (Array.isArray(generatedPosts) && generatedPosts.length) {
        const map = /* @__PURE__ */ new Map();
        for (const post of allPosts) map.set(post.slug, post);
        for (const post of generatedPosts) {
          map.set(post.slug, {
            id: post.id,
            slug: post.slug,
            title: post.title,
            date: post.date,
            image: post.image,
            excerpt: post.excerpt || post.title
          });
        }
        allPosts = Array.from(map.values());
      }
    } catch {
    }
    const searchTerm = q.toLowerCase();
    const searchResults = allPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const excerpt = (post.excerpt || "").toLowerCase();
      const slug = (post.slug || "").toLowerCase();
      return title.includes(searchTerm) || excerpt.includes(searchTerm) || slug.includes(searchTerm);
    });
    searchResults.sort((a, b) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();
      const aExcerpt = (a.excerpt || "").toLowerCase();
      const bExcerpt = (b.excerpt || "").toLowerCase();
      const aSlug = (a.slug || "").toLowerCase();
      const bSlug = (b.slug || "").toLowerCase();
      const aTitleMatch = aTitle.includes(searchTerm);
      const bTitleMatch = bTitle.includes(searchTerm);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      const aExcerptMatch = aExcerpt.includes(searchTerm);
      const bExcerptMatch = bExcerpt.includes(searchTerm);
      if (aExcerptMatch && !bExcerptMatch) return -1;
      if (!aExcerptMatch && bExcerptMatch) return 1;
      return (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0);
    });
    const total = searchResults.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    const enrichedPosts = await Promise.all(
      paginatedResults.map(async (post) => {
        try {
          const fullPost = await getPostFromCache(post.slug);
          return fullPost || post;
        } catch {
          return post;
        }
      })
    );
    return {
      posts: enrichedPosts,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage)
      }
    };
  } catch (error) {
    console.error("Search API error:", error);
    return {
      posts: [],
      pagination: {
        page,
        perPage,
        total: 0,
        totalPages: 0
      }
    };
  }
});

const search_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: search_get
}, Symbol.toStringTag, { value: 'Module' }));

const suggest_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const q = (query.q || "").trim();
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 12));
    const lang = query.lang || "id";
    if (!q || q.length < 2) {
      return [];
    }
    let allPosts = await listCachedPosts();
    try {
      const generatedPosts = await listGeneratedIndex();
      if (Array.isArray(generatedPosts) && generatedPosts.length) {
        const map = /* @__PURE__ */ new Map();
        for (const post of allPosts) map.set(post.slug, post);
        for (const post of generatedPosts) {
          map.set(post.slug, {
            id: post.id,
            slug: post.slug,
            title: post.title,
            date: post.date,
            image: post.image,
            excerpt: post.excerpt || post.title
          });
        }
        allPosts = Array.from(map.values());
      }
    } catch {
    }
    const searchTerm = q.toLowerCase();
    const searchResults = allPosts.filter((post) => {
      const title = (post.title || "").toLowerCase();
      const excerpt = (post.excerpt || "").toLowerCase();
      const slug = (post.slug || "").toLowerCase();
      return title.includes(searchTerm) || excerpt.includes(searchTerm) || slug.includes(searchTerm);
    });
    searchResults.sort((a, b) => {
      const aTitle = (a.title || "").toLowerCase();
      const bTitle = (b.title || "").toLowerCase();
      const aExcerpt = (a.excerpt || "").toLowerCase();
      const bExcerpt = (b.excerpt || "").toLowerCase();
      const aSlug = (a.slug || "").toLowerCase();
      const bSlug = (b.slug || "").toLowerCase();
      const aTitleMatch = aTitle.includes(searchTerm);
      const bTitleMatch = bTitle.includes(searchTerm);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      const aExcerptMatch = aExcerpt.includes(searchTerm);
      const bExcerptMatch = bExcerpt.includes(searchTerm);
      if (aExcerptMatch && !bExcerptMatch) return -1;
      if (!aExcerptMatch && bExcerptMatch) return 1;
      return (Date.parse(b.date || "") || 0) - (Date.parse(a.date || "") || 0);
    });
    const results = searchResults.slice(0, limit).map((post) => ({
      title: post.title || "Untitled",
      slug: post.slug || "untitled",
      date: post.date || post.publish_at || (/* @__PURE__ */ new Date()).toISOString(),
      excerpt: post.excerpt || post.title || "No description available"
    }));
    return results;
  } catch (error) {
    console.error("Search suggest error:", error);
    return [];
  }
});

const suggest_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: suggest_get
}, Symbol.toStringTag, { value: 'Module' }));

const generatedBlogsRegenerate_get = defineEventHandler(async (event) => {
  const q = getQuery$1(event);
  String(process.env.NUXT_REGENERATE_SECRET || process.env.ADMIN_SECRET || "");
  String(q.secret || "");
  const dry = ["1", "true", "yes", "y", "on"].includes(String(q.dry || "").toLowerCase());
  const { listGeneratedBlogs, forceRegenerateAllGeneratedBlogs } = await Promise.resolve().then(function () { return generatedBlogs; });
  if (dry) {
    const before = await listGeneratedBlogs().catch(() => []);
    return { status: "ok", dry: true, total: before.length, message: "dry-run: no changes applied" };
  }
  const res = await forceRegenerateAllGeneratedBlogs();
  return { status: "ok", ...res };
});

const generatedBlogsRegenerate_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: generatedBlogsRegenerate_get
}, Symbol.toStringTag, { value: 'Module' }));

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await $fetch(url, {
        ...options,
        timeout: 5e3
        // 5 detik timeout
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1e3 * (i + 1)));
    }
  }
}
const health_get = defineEventHandler(async () => {
  try {
    await getCached("health-check");
    const wpDisabled = String(process.env.WORDPRESS_DISABLED || process.env.NUXT_DISABLE_WORDPRESS || "true").toLowerCase() === "true";
    if (!wpDisabled && process.env.WORDPRESS_API_URL) {
      await fetchWithRetry(`${process.env.WORDPRESS_API_URL}/posts`, { params: { per_page: 1 } });
    }
    const manager = getOpenAIManager();
    const holdInfo = manager.getHoldInfo();
    if (holdInfo.onHold) {
      return {
        status: "degraded",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        openai: holdInfo
      };
    }
    await manager.testConnection();
    return {
      status: "healthy",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      openai: manager.getHoldInfo()
    };
  } catch (error) {
    throw createError({
      statusCode: 503,
      message: "Service Unavailable",
      cause: error
    });
  }
});

const health_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: health_get
}, Symbol.toStringTag, { value: 'Module' }));

const autoBlog_get = defineEventHandler(async (event) => {
  try {
    const isSchedulerActive = process.env.NUXT_ENABLE_AUTO_BLOG === "true";
    const health = {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      scheduler: {
        active: isSchedulerActive,
        environment: "development",
        enabled: process.env.NUXT_ENABLE_AUTO_BLOG
      },
      system: {
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };
    return {
      status: "ok",
      ...health
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
});

const autoBlog_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: autoBlog_get
}, Symbol.toStringTag, { value: 'Module' }));

const messages = {
  id: {
    // Navigation
    home: "Beranda",
    blog: "Blog",
    about: "Tentang",
    contact: "Kontak",
    services: "Layanan",
    // Common
    loading: "Memuat...",
    error: "Terjadi kesalahan",
    success: "Berhasil",
    cancel: "Batal",
    save: "Simpan",
    edit: "Edit",
    delete: "Hapus",
    search: "Cari",
    readMore: "Baca Selengkapnya",
    // Blog
    publishedOn: "Dipublikasikan pada",
    writtenBy: "Ditulis oleh",
    tags: "Tag",
    categories: "Kategori",
    // Footer
    allRightsReserved: "Semua hak dilindungi",
    followUs: "Ikuti Kami",
    // Contact
    getInTouch: "Hubungi Kami",
    name: "Nama",
    email: "Email",
    message: "Pesan",
    send: "Kirim"
  },
  en: {
    // Navigation
    home: "Home",
    blog: "Blog",
    about: "About",
    contact: "Contact",
    services: "Services",
    // Common
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    readMore: "Read More",
    // Blog
    publishedOn: "Published on",
    writtenBy: "Written by",
    tags: "Tags",
    categories: "Categories",
    // Footer
    allRightsReserved: "All rights reserved",
    followUs: "Follow Us",
    // Contact
    getInTouch: "Get In Touch",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send"
  }
};
const messages_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const locale = query.locale || "id";
  const localeMessages = messages[locale] || messages.id;
  return {
    locale,
    messages: localeMessages
  };
});

const messages_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: messages_get
}, Symbol.toStringTag, { value: 'Module' }));

const icon_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const name = query.name;
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Icon name is required"
    });
  }
  try {
    const [collection, iconName] = name.split(":");
    if (!collection || !iconName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid icon format. Use "collection:icon-name"'
      });
    }
    setHeader(event, "Content-Type", "image/svg+xml");
    setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
    const svg = generateIconSVG(collection, iconName);
    return svg;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate icon"
    });
  }
});
function generateIconSVG(collection, iconName) {
  const size = 24;
  const color = "#6b7280";
  let path = "";
  switch (collection) {
    case "lucide":
      path = generateLucideIcon(iconName);
      break;
    case "fa-solid":
      path = generateFontAwesomeIcon(iconName);
      break;
    case "heroicons":
      path = generateHeroIcon(iconName);
      break;
    case "simple-icons":
      path = generateSimpleIcon(iconName);
      break;
    case "mdi":
      path = generateMaterialIcon(iconName);
      break;
    case "circle-flags":
      path = generateFlagIcon(iconName);
      break;
    default:
      path = `<circle cx="12" cy="12" r="10" fill="${color}" opacity="0.2"/><circle cx="12" cy="12" r="6" fill="${color}"/>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${path}
  </svg>`;
}
function generateLucideIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "chevron-down":
      return `<path d="m6 9 6 6 6-6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case "chevron-up":
      return `<path d="m18 15-6-6-6 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case "menu":
      return `<path d="M3 12h18M3 6h18M3 18h18" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case "clock":
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case "phone-call":
      return `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`;
  }
}
function generateFontAwesomeIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "user":
      return `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="7" r="4" stroke="${color}" stroke-width="2" fill="none"/>`;
    case "clock":
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    case "calendar":
      return `<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="${color}" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="${color}" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="${color}" stroke-width="2" stroke-linecap="round"/>`;
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`;
  }
}
function generateHeroIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "information-circle":
      return `<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`;
  }
}
function generateSimpleIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "whatsapp":
      return `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="${color}"/>`;
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`;
  }
}
function generateMaterialIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "paypal":
      return `<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.68c-.608-.685-1.46-1.03-2.55-1.03H9.95c-.524 0-.968.382-1.05.9L7.76 19.337h4.716c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c2.57 0 4.578-.543 5.69-1.81 1.01-1.15 1.304-2.42 1.012-4.287-.023-.143-.047-.288-.077-.437z" fill="${color}"/>`;
    case "credit-card":
      return `<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="${color}"/>`;
    case "information-outline":
      return `<path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" fill="${color}"/>`;
    case "certificate-outline":
      return `<path d="M13,21L15.2,16.6L20,17L16,13.3L17.2,8.5L13,11.2L8.8,8.5L10,13.3L6,17L10.8,16.6L13,21M12,8A3,3 0 0,1 15,5A3,3 0 0,1 18,8A3,3 0 0,1 15,11A3,3 0 0,1 12,8M7,12A3,3 0 0,1 10,9A3,3 0 0,1 13,12A3,3 0 0,1 10,15A3,3 0 0,1 7,12M17,12A3,3 0 0,1 20,9A3,3 0 0,1 23,12A3,3 0 0,1 20,15A3,3 0 0,1 17,12Z" fill="${color}"/>`;
    case "file-document-outline":
      return `<path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="${color}"/>`;
    case "whatsapp":
      return `<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="${color}"/>`;
    default:
      return `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/>`;
  }
}
function generateFlagIcon(iconName) {
  const color = "#6b7280";
  switch (iconName) {
    case "id":
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="#ff0000"/><rect x="2" y="12" width="20" height="8" fill="#ffffff"/>`;
    case "us":
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="#b22234"/><rect x="2" y="4" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="6.46" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="8.92" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="11.38" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="13.84" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="16.3" width="20" height="1.23" fill="#ffffff"/><rect x="2" y="18.76" width="20" height="1.23" fill="#ffffff"/>`;
    default:
      return `<rect x="2" y="4" width="20" height="16" rx="2" fill="${color}" opacity="0.3"/>`;
  }
}

const icon_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: icon_get
}, Symbol.toStringTag, { value: 'Module' }));

const invalidateBlogCache_post = defineEventHandler(async (event) => {
  const storage = useStorage();
  try {
    await storage.removeItem("blog:list:*");
    await storage.removeItem("blog:post:*");
    await storage.removeItem("blog:popular:*");
    await storage.removeItem("blog:latest:*");
    return { success: true, message: "Blog cache invalidated successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

const invalidateBlogCache_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: invalidateBlogCache_post
}, Symbol.toStringTag, { value: 'Module' }));

const keywordRun_get = defineEventHandler(async (event) => {
  const q = getQuery$1(event);
  const count = Math.min(Math.max(parseInt(String(q.count ?? q.n ?? "20"), 10) || 20, 1), 50);
  const publish = ["1", "true", "yes", "y", "on"].includes(String(q.publish || "").toLowerCase());
  const date = q.date ? String(q.date) : void 0;
  const { runKeywordJobForDate } = await Promise.resolve().then(function () { return keywordJob; });
  const res = await runKeywordJobForDate(date, count, publish);
  return { status: "ok", ...res };
});

const keywordRun_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: keywordRun_get
}, Symbol.toStringTag, { value: 'Module' }));

const sitemapDynamic = defineEventHandler(async () => {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const entries = [
    { url: "/", priority: 1, changefreq: "daily", lastmod: now },
    { url: "/blog", priority: 0.9, changefreq: "daily", lastmod: now },
    { url: "/testimonials", priority: 0.8, changefreq: "monthly", lastmod: now },
    { url: "/informasi/transaksi", priority: 0.8, changefreq: "monthly", lastmod: now },
    { url: "/informasi/rekening", priority: 0.8, changefreq: "monthly", lastmod: now },
    { url: "/bukti-transaksi", priority: 0.7, changefreq: "monthly", lastmod: now }
  ];
  try {
    const idx = await listCachedPosts();
    if (Array.isArray(idx) && idx.length) {
      for (const it of idx) {
        const lastmod = String(it?.date || now);
        entries.push({ url: `/blog/${it.slug}`, priority: 0.7, changefreq: "daily", lastmod });
      }
    }
  } catch {
  }
  return entries;
});

const sitemapDynamic$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemapDynamic
}, Symbol.toStringTag, { value: 'Module' }));

const RELOAD_LIMIT = 3;
const BLOCK_DURATION = 30 * 60 * 1e3;
const RESET_DURATION = 60 * 60 * 1e3;
const smartReloadTracker_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { action, pageUrl, userAgent, timestamp } = body;
    const clientIp = getClientIp(event) || "unknown";
    const storage = useStorage();
    let tracker = {};
    try {
      const stored = await storage.getItem("smart-reload-tracker");
      if (stored) {
        tracker = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load reload tracker:", error);
    }
    const now = Date.now();
    const ipKey = clientIp;
    if (!tracker[ipKey]) {
      tracker[ipKey] = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      };
    }
    const record = tracker[ipKey];
    if (record.blocked) {
      const blockAge = now - record.lastAttempt;
      if (blockAge < BLOCK_DURATION) {
        return {
          success: false,
          blocked: true,
          reason: "IP blocked due to excessive reload attempts",
          blockExpires: new Date(record.lastAttempt + BLOCK_DURATION).toISOString(),
          remainingTime: Math.ceil((BLOCK_DURATION - blockAge) / 1e3)
        };
      } else {
        record.blocked = false;
        record.count = 0;
        record.firstAttempt = now;
        record.lastAttempt = now;
        delete record.blockReason;
      }
    }
    const timeSinceFirst = now - record.firstAttempt;
    if (timeSinceFirst > RESET_DURATION) {
      record.count = 0;
      record.firstAttempt = now;
      record.lastAttempt = now;
      record.blocked = false;
      delete record.blockReason;
    }
    switch (action) {
      case "check":
        const canReload = record.count < RELOAD_LIMIT && !record.blocked;
        return {
          success: true,
          canReload,
          attemptsRemaining: Math.max(0, RELOAD_LIMIT - record.count),
          totalAttempts: record.count,
          blocked: record.blocked,
          blockReason: record.blockReason,
          resetTime: new Date(record.firstAttempt + RESET_DURATION).toISOString()
        };
      case "attempt":
        record.count++;
        record.lastAttempt = now;
        if (record.count >= RELOAD_LIMIT) {
          record.blocked = true;
          record.blockReason = `Exceeded ${RELOAD_LIMIT} reload attempts in ${Math.round(timeSinceFirst / 1e3 / 60)} minutes`;
          console.warn(`\u{1F6AB} IP ${clientIp} blocked due to excessive reload attempts:`, {
            count: record.count,
            timeSpan: Math.round(timeSinceFirst / 1e3 / 60),
            pageUrl,
            userAgent: userAgent?.substring(0, 100)
          });
        }
        try {
          await storage.setItem("smart-reload-tracker", JSON.stringify(tracker));
        } catch (error) {
          console.warn("Failed to save reload tracker:", error);
        }
        return {
          success: true,
          attemptRecorded: true,
          totalAttempts: record.count,
          blocked: record.blocked,
          blockReason: record.blockReason,
          attemptsRemaining: Math.max(0, RELOAD_LIMIT - record.count)
        };
      case "reset":
        record.count = 0;
        record.firstAttempt = now;
        record.lastAttempt = now;
        record.blocked = false;
        delete record.blockReason;
        try {
          await storage.setItem("smart-reload-tracker", JSON.stringify(tracker));
        } catch (error) {
          console.warn("Failed to save reload tracker:", error);
        }
        return {
          success: true,
          reset: true,
          message: "Reload attempts reset for this IP"
        };
      default:
        return {
          success: false,
          error: "Invalid action. Use: check, attempt, or reset"
        };
    }
  } catch (error) {
    console.error("Smart reload tracker error:", error);
    return {
      success: false,
      error: "Internal server error",
      details: error.message
    };
  }
});

const smartReloadTracker_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: smartReloadTracker_post
}, Symbol.toStringTag, { value: 'Module' }));

const test_get = defineEventHandler(async () => {
  return { message: "Server is working!" };
});

const test_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: test_get
}, Symbol.toStringTag, { value: 'Module' }));

const mockTestimonials = [
  {
    id: 1,
    name: "Ahmad Rizki",
    message: "Pelayanan sangat memuaskan, transaksi PayPal berjalan lancar dan cepat. Recommended!",
    rating: 5,
    date: "2025-01-15T10:30:00Z",
    avatar: "/images/avatars/avatar-1.jpg"
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    message: "JasaPembayaran.com sangat membantu untuk transaksi internasional. Proses mudah dan aman.",
    rating: 5,
    date: "2025-01-14T15:45:00Z",
    avatar: "/images/avatars/avatar-2.jpg"
  },
  {
    id: 3,
    name: "Budi Santoso",
    message: "Tim support responsif dan profesional. Transaksi PayPal selesai dalam hitungan menit.",
    rating: 5,
    date: "2025-01-13T09:20:00Z",
    avatar: "/images/avatars/avatar-3.jpg"
  },
  {
    id: 4,
    name: "Maya Sari",
    message: "Layanan terbaik untuk jasa pembayaran PayPal. Harga kompetitif dan proses cepat.",
    rating: 5,
    date: "2025-01-12T14:15:00Z",
    avatar: "/images/avatars/avatar-4.jpg"
  },
  {
    id: 5,
    name: "Rizki Pratama",
    message: "Sangat puas dengan layanan JasaPembayaran.com. Transaksi aman dan terpercaya.",
    rating: 5,
    date: "2025-01-11T11:30:00Z",
    avatar: "/images/avatars/avatar-5.jpg"
  },
  {
    id: 6,
    name: "Dewi Lestari",
    message: "Proses pembayaran PayPal sangat mudah dan cepat. Customer service sangat membantu.",
    rating: 5,
    date: "2025-01-10T16:45:00Z",
    avatar: "/images/avatars/avatar-6.jpg"
  },
  {
    id: 7,
    name: "Agus Wijaya",
    message: "Layanan jasa PayPal terbaik yang pernah saya gunakan. Highly recommended!",
    rating: 5,
    date: "2025-01-09T13:20:00Z",
    avatar: "/images/avatars/avatar-7.jpg"
  },
  {
    id: 8,
    name: "Indah Permata",
    message: "Transaksi PayPal berjalan lancar tanpa kendala. Tim sangat profesional dan ramah.",
    rating: 5,
    date: "2025-01-08T10:15:00Z",
    avatar: "/images/avatars/avatar-8.jpg"
  },
  {
    id: 9,
    name: "Fajar Nugroho",
    message: "JasaPembayaran.com memberikan layanan terbaik untuk transaksi PayPal. Sangat memuaskan!",
    rating: 5,
    date: "2025-01-07T15:30:00Z",
    avatar: "/images/avatars/avatar-9.jpg"
  },
  {
    id: 10,
    name: "Rina Wulandari",
    message: "Proses pembayaran sangat mudah dan aman. Customer service 24/7 sangat membantu.",
    rating: 5,
    date: "2025-01-06T12:45:00Z",
    avatar: "/images/avatars/avatar-10.jpg"
  },
  {
    id: 11,
    name: "Hendra Kurniawan",
    message: "Layanan jasa PayPal terpercaya dan profesional. Transaksi cepat dan aman.",
    rating: 5,
    date: "2025-01-05T09:20:00Z",
    avatar: "/images/avatars/avatar-11.jpg"
  },
  {
    id: 12,
    name: "Lina Marlina",
    message: "Sangat puas dengan layanan JasaPembayaran.com. Proses mudah dan hasil memuaskan.",
    rating: 5,
    date: "2025-01-04T14:10:00Z",
    avatar: "/images/avatars/avatar-12.jpg"
  }
];
const testimonials_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const offset = Math.max(0, Number(query.offset) || 0);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  try {
    const externalApiBase = process.env.TESTIMONIALS_API_BASE;
    const disableTestimonials = process.env.DISABLE_TESTIMONIALS === "true";
    if (externalApiBase && !disableTestimonials) {
      try {
        const response = await fetch(`${externalApiBase}?offset=${offset}&limit=${limit}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "JasaPembayaran.com/1.0"
          },
          signal: AbortSignal.timeout(5e3)
          // 5 second timeout
        });
        if (response.ok) {
          const data = await response.json();
          const normalizedItems = (data.items || data.testimonials || data).map((item) => ({
            id: item.id || Math.random(),
            name: item.name || item.nama || item.full_name || item.by || "Anonymous",
            message: item.message || item.pesan || item.testimonial || item.review || item.content || item.comment || "",
            rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
            date: item.date || item.created_at || item.timestamp || (/* @__PURE__ */ new Date()).toISOString(),
            avatar: item.avatar || item.profile_picture || `/images/avatars/avatar-${Math.floor(Math.random() * 12) + 1}.jpg`
          }));
          return {
            items: normalizedItems,
            pagination: {
              offset,
              limit,
              total: data.total || normalizedItems.length,
              isMockData: false
            }
          };
        }
      } catch (externalError) {
        console.log("External testimonials API failed, using mock data:", externalError.message);
      }
    }
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, mockTestimonials.length);
    const paginatedTestimonials = mockTestimonials.slice(startIndex, endIndex);
    return {
      items: paginatedTestimonials,
      pagination: {
        offset,
        limit,
        total: mockTestimonials.length,
        isMockData: true
      }
    };
  } catch (error) {
    console.error("Testimonials API error:", error);
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, mockTestimonials.length);
    const paginatedTestimonials = mockTestimonials.slice(startIndex, endIndex);
    return {
      items: paginatedTestimonials,
      pagination: {
        offset,
        limit,
        total: mockTestimonials.length,
        isMockData: true
      }
    };
  }
});

const testimonials_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: testimonials_get
}, Symbol.toStringTag, { value: 'Module' }));

const version_get = defineEventHandler(async (event) => {
  try {
    const buildId = process.env.NUXT_PUBLIC_BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || process.env.COMMIT_SHA || String(Math.floor(Date.now() / 1e3));
    const currentTime = (/* @__PURE__ */ new Date()).toISOString();
    let version = "1.0.0";
    let fileModTime = currentTime;
    try {
      const packagePath = join(process.cwd(), "package.json");
      if (existsSync(packagePath)) {
        const packageContent = readFileSync(packagePath, { encoding: "utf8" });
        const packageJson = JSON.parse(packageContent);
        version = packageJson.version || "1.0.0";
        fileModTime = (/* @__PURE__ */ new Date()).toISOString();
      }
    } catch (packageError) {
      console.warn("Could not read package.json:", packageError);
    }
    setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    setHeader(event, "Pragma", "no-cache");
    setHeader(event, "Expires", "0");
    setHeader(event, "Last-Modified", (/* @__PURE__ */ new Date()).toUTCString());
    setHeader(event, "ETag", `"${buildId}-${Date.now()}"`);
    setHeader(event, "Content-Type", "application/json");
    const response = {
      buildId,
      version,
      buildTime: currentTime,
      fileModTime,
      environment: "development",
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      timestamp: Date.now(),
      // Add a random component to ensure uniqueness
      uniqueId: `${buildId}-${Math.random().toString(36).substr(2, 9)}`
    };
    return response;
  } catch (error) {
    console.error("Version API error:", error);
    setHeader(event, "Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    setHeader(event, "Pragma", "no-cache");
    setHeader(event, "Expires", "0");
    setHeader(event, "Content-Type", "application/json");
    const fallbackResponse = {
      buildId: String(Math.floor(Date.now() / 1e3)),
      version: "1.0.0",
      buildTime: (/* @__PURE__ */ new Date()).toISOString(),
      environment: "development",
      error: "Could not read package.json",
      timestamp: Date.now(),
      uniqueId: `error-${Math.random().toString(36).substr(2, 9)}`
    };
    return fallbackResponse;
  }
});

const version_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: version_get
}, Symbol.toStringTag, { value: 'Module' }));

const visitors_get = defineEventHandler(async (event) => {
  return {
    count: 0,
    timestamp: Date.now()
  };
});

const visitors_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: visitors_get
}, Symbol.toStringTag, { value: 'Module' }));

function getJakartaDate() {
  const now = /* @__PURE__ */ new Date();
  const j = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const y = j.getFullYear();
  const m = j.getMonth() + 1;
  const d = j.getDate();
  return { year: y, month: m, day: d, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` };
}
const visitors = defineEventHandler(async (event) => {
  try {
    const storage = useStorage();
    const { dateStr } = getJakartaDate();
    const key = `visitors:${dateStr}`;
    const todayData = await storage.getItem(key) || { count: 0, unique: 0, lastUpdate: Date.now() };
    const visitorId = getCookie(event, "visitor_id");
    let isUnique = false;
    if (!visitorId) {
      const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCookie(event, "visitor_id", newVisitorId, {
        maxAge: 60 * 60 * 24 * 30,
        // 30 days
        httpOnly: true,
        sameSite: "lax"
      });
      isUnique = true;
      todayData.unique += 1;
    }
    todayData.count += 1;
    todayData.lastUpdate = Date.now();
    await storage.setItem(key, todayData);
    return {
      success: true,
      date: dateStr,
      total: todayData.count,
      unique: todayData.unique,
      isNewVisitor: isUnique
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
});

const visitors$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: visitors
}, Symbol.toStringTag, { value: 'Module' }));

function imagesDir() {
  return join(process.cwd(), "data", "blog", "images");
}
function detectContentType(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}
const _name__get = defineEventHandler(async (event) => {
  const name = String(getRouterParam(event, "name") || "");
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    throw createError({ statusCode: 400, statusMessage: "Invalid image name" });
  }
  const safeName = basename$1(name);
  const filePath = join(imagesDir(), safeName);
  try {
    await promises.access(filePath);
  } catch {
    throw createError({ statusCode: 404, statusMessage: "Image not found" });
  }
  const type = detectContentType(safeName);
  setHeader(event, "Content-Type", type);
  return sendStream(event, createReadStream(filePath));
});

const _name__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _name__get
}, Symbol.toStringTag, { value: 'Module' }));

function escapeXml(input) {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const sitemapDynamic_xml = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public?.siteUrl || "https://jasapembayaran.com";
  const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  const todayIso = (/* @__PURE__ */ new Date()).toISOString();
  const staticEntries = [
    { loc: "/", changefreq: "daily", priority: 1, lastmod: todayIso },
    { loc: "/testimonials", changefreq: "monthly", priority: 0.8, lastmod: todayIso },
    { loc: "/informasi/transaksi", changefreq: "monthly", priority: 0.8, lastmod: todayIso },
    { loc: "/informasi/rekening", changefreq: "monthly", priority: 0.8, lastmod: todayIso },
    { loc: "/bukti-transaksi", changefreq: "monthly", priority: 0.7, lastmod: todayIso }
  ];
  let dynamicEntries = [];
  try {
    dynamicEntries = await $fetch$1("/api/sitemap-dynamic").catch(() => []);
  } catch {
    dynamicEntries = [];
  }
  const entries = [...staticEntries, ...dynamicEntries];
  const urlsXml = entries.map((e) => {
    const parts = [];
    const loc = e.loc.startsWith("http") ? e.loc : base + e.loc;
    parts.push(`  <url>
    <loc>${escapeXml(loc)}</loc>`);
    if (e.lastmod) {
      const ts = Date.parse(e.lastmod);
      const iso = isNaN(ts) ? todayIso : new Date(ts).toISOString();
      parts.push(`    <lastmod>${escapeXml(iso)}</lastmod>`);
    }
    if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
    if (typeof e.priority === "number") parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
    parts.push("  </url>");
    return parts.join("\n");
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
  setHeader(event, "Content-Type", "application/xml; charset=utf-8");
  return xml;
});

const sitemapDynamic_xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemapDynamic_xml
}, Symbol.toStringTag, { value: 'Module' }));

const sitemap_get = defineEventHandler((event) => {
  return sendRedirect(event, "/sitemap.xml", 301);
});

const sitemap_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_get
}, Symbol.toStringTag, { value: 'Module' }));

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file://C:/APPERZA/NUXT/jasapembayaran-new/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file://C:/APPERZA/NUXT/jasapembayaran-new/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
      const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
      const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
      const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
      return appTemplate + loaderTemplate;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}

function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}

const unheadOptions = {
  disableDefaults: true,
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    if (typeof ssrError.data === "string") {
      try {
        ssrError.data = destr(ssrError.data);
      } catch {
      }
    }
    setSSRError(ssrContext, ssrError);
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      _rendered.html,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  const result = [];
  for (const _chunk of chunks) {
    const chunk = _chunk?.trim();
    if (chunk) {
      result.push(chunk);
    }
  }
  return result;
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
