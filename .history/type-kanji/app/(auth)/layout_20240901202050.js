import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthLayout({ children }) {
  return <div className="min-h-screen"><ToastContainer />{children}</div>;
}
