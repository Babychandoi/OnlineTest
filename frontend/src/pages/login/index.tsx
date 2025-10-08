import { Outlet } from "react-router-dom";


const LoginForm: React.FC = () => {
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Outlet />
    </main>
  );
};

export default LoginForm;