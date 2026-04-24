import { Spinner } from "@fluentui/react-components";
import { useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import HousecatPage from "./components/HousecatPage";
import TinyMCE from "./components/TinyMCE";
import PagesEditor from "./components/admin/PagesEditor";
import { CartProvider } from "./context/CartContext";
import { IPage } from "./model/IPage";
import { pageService } from "./services/pageService";

function ApiTestPage() {
  const [result, setResult] = useState<string>("calling /api/test…");
  useEffect(() => {
    fetch("/api/test")
      .then((r) => r.json())
      .then((d) => setResult(JSON.stringify(d)))
      .catch((e) => setResult("error: " + e));
  }, []);
  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h2>/api/test response:</h2>
      <pre>{result}</pre>
    </div>
  );
}

export default function App() {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    pageService.getPages().then((p) => {
      setPages(p);
    });
  }, []);

  const hasAnyShop = useMemo(
    () => pages.some((p) => (p.contentSection?.shopItems?.length ?? 0) > 0),
    [pages],
  );

  const router = useMemo(() => {
    if (pages.length === 0) return null;

    const routes: RouteObject[] = [
      ...pages.map((p) => ({
        path: p.navSection?.navTitle ?? "/",
        element: <HousecatPage {...p} showCart={hasAnyShop} />,
      })),
      { path: "/admin", element: <PagesEditor /> },
      { path: "/tinymce", element: <TinyMCE /> },
      { path: "/apitest", element: <ApiTestPage /> },
    ];

    return createBrowserRouter(routes, {
      basename: import.meta.env.BASE_URL.replace(/\/$/, ""),
    });
  }, [pages]);

  return (
    <CartProvider>
      {router ? <RouterProvider router={router} /> : <Spinner />}
    </CartProvider>
  );
}
