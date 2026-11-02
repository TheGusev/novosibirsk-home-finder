import { QueryClient } from "@tanstack/react-query";
import { createRouter, parseSearchWith, stringifySearchWith } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Плоские строковые параметры: ?rooms=2&price_to=6000000 — удобно делиться ссылкой.
    parseSearch: parseSearchWith((v) => v),
    stringifySearch: stringifySearchWith((v) => String(v)),
    defaultPreloadStaleTime: 0,
  });

  return router;
};
