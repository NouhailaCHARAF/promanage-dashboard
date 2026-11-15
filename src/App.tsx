import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./page/Dashboard";
import Projects from "./page/Projects";
import Tasks from "./page/Tasks";
import Team from "./page/Team";
import Settings from "./page/Settings";
import Login from "./page/Login";

export interface UserProfile {
  fullName: string;
  email: string;
  role: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isLoggedIn") === "true",
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    fullName: "Nouhaila Charaf",
    email: "nouhaila@promanage.com",
    role: "Admin",
  });

  function handleLogin() {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden relative">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
            <Route
              path="/settings"
              element={<Settings user={user} onUpdateUser={setUser} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
