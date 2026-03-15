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

export default function App() {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    pageService.getPages().then((p) => {
      setPages(p);
    });
  }, []);

  const router = useMemo(() => {
    if (pages.length === 0) return null;

    const routes: RouteObject[] = [
      ...pages.map((p) => ({
        path: p.navTitle,
        element: <HousecatPage {...p} />,
      })),
      { path: "/admin", element: <PagesEditor /> },
      { path: "/tinymce", element: <TinyMCE /> },
    ];

    return createBrowserRouter(routes);
  }, [pages]);

  return (
    <CartProvider>
      {router ? <RouterProvider router={router} /> : <Spinner />}
    </CartProvider>
  );
}
