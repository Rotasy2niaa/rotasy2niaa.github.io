import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Works from "./pages/Works";
import WorkDetail from "./pages/WorkDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <main className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:slug" element={<WorkDetail />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
