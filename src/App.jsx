import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/HookLogin";
import Routes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;