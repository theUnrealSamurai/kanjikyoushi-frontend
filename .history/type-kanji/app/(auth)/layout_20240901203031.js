import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen">
      
      {children}
    </div>
  );
}
