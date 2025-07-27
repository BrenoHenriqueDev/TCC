import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/HookLogin";
import Routes from "./routes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./css/App.css"; // Estilos globais

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Header />
          <main className="app-content">
            <Routes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
