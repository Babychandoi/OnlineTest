import './App.css';
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { indexRouter } from './routers/indexRouter';
import { authRouter } from './routers/authRouter';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './components/AuthContext';
function AppRouter() {
  const routes = useRoutes([...authRouter,indexRouter]);
  return routes;
}
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRouter />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      </Router>
    </AuthProvider>
  );
}

export default App;

