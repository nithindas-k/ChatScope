import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { Navbar } from "./components/layout/Navbar";
import { AnimatePresence } from "framer-motion";


const UploadPage = React.lazy(() => import("./pages/UploadPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ActivityPage = React.lazy(() => import("./pages/ActivityPage"));
const WordsPage = React.lazy(() => import("./pages/WordsPage"));
const InsightsPage = React.lazy(() => import("./pages/InsightsPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const PrivacyPage = React.lazy(() => import("./pages/PrivacyPage"));



const Loader = () => (
  <div className="flex flex-1 items-center justify-center min-h-[40vh]">
    <div className="w-8 h-8 rounded-full border-2 border-[#00a884] border-t-transparent animate-spin" />
  </div>
);

/* Inner pages get padded container; upload fills full area */
const Padded = ({ children }: { children: React.ReactNode }) => (
  <div className="content-container">{children}</div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar onOpenMobileMenu={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-background">
            <Suspense fallback={<Loader />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<UploadPage />} />
                  <Route
                    path="/dashboard"
                    element={

                      <Padded><DashboardPage /></Padded>

                    }
                  />
                  <Route
                    path="/activity"
                    element={

                      <Padded><ActivityPage /></Padded>

                    }
                  />
                  <Route
                    path="/words"
                    element={

                      <Padded><WordsPage /></Padded>

                    }
                  />
                  <Route
                    path="/insights"
                    element={

                      <Padded><InsightsPage /></Padded>

                    }
                  />
                  <Route path="/terms" element={<Padded><TermsPage /></Padded>} />
                  <Route path="/privacy" element={<Padded><PrivacyPage /></Padded>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
