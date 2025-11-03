/**
 * Minimal browser-safe `process` polyfill for libraries expecting Node globals.
 *
 * Required by: inversify, reflect-metadata (when used in Cocos Creator's CJS loader)
 *
 * Cocos Creator's module system emulates Node.js but doesn't provide `process` global.
 * Some npm packages check `process.env.NODE_ENV` or use `process.nextTick()` at load time.
 *
 * This polyfill MUST be imported before any code that uses inversify/DI container.
 */
const globalScope = globalThis as unknown as { process?: any };

if (typeof globalScope.process === 'undefined') {
  const processLike = {
    browser: true,
    env: { NODE_ENV: 'production' },
    nextTick(callback: (...args: any[]) => void, ...args: any[]) {
      Promise.resolve()
        .then(() => callback(...args))
        .catch((error) => {
          setTimeout(() => {
            throw error;
          }, 0);
        });
    },
    platform: 'browser',
    title: 'browser',
    version: '0',
    versions: {},
    cwd: () => '',
    chdir: () => {
      throw new Error('process.chdir is not supported in the browser');
    },
  };

  globalScope.process = processLike;
}
