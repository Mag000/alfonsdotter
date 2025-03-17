import { Spinner } from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResponsivePage from "./components/ResponsivePage";
import { IPage } from "./model/IPage";
import { pageService } from "./services/pageService";

export default function App() {
  const [pages, setPages] = useState<IPage[]>([]);

  useEffect(() => {
    pageService.getPages().then((p) => {
      setPages(p);
    });
  }, []);

  return pages.length > 0 ? (
    <BrowserRouter>
      <Routes>
        {pages.map((p) => (
          <Route
            key={p.navTitle}
            path={`${p.navTitle}`}
            element={<ResponsivePage {...p} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  ) : (
    <Spinner />
  );
}
