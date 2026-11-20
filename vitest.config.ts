import { defineConfig } from "vitest/config"

/**
 * Конфигурация тестов -- в КОРНЕ, и это починка, а не перестановка.
 *
 * Лежала она в test/vitest.config.ts и не загружалась никогда: `npm test`
 * запускает `vitest run` из корня, корневого конфига не было, и vitest брал
 * vite.config.ts, где секции `test` нет вовсе. То есть `environment: "jsdom"`
 * и весь тот файл были мёртвой настройкой: тесты шли в окружении `node`, а
 * jsdom стоял в devDependencies и не использовался.
 *
 * Заодно подключается test/setup.ts -- он тоже был мёртвым, потому что
 * setupFiles не объявлялся ни в одном конфиге.
 */
export default defineConfig({
  test: {
    // jsdom нужен по-настоящему: хуки теперь рендерятся (test/hooks.test.ts),
    // а renderHook без DOM не работает.
    environment: "jsdom",
    include: ["test/**/*.test.*"],
    setupFiles: ["test/setup.ts"],
  },
})
