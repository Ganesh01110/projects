import { ToastContainer } from "react-toastify";

function ToastNotification() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      bodyClassName="bodyToast"
    />
  );
}

export default ToastNotification;  // Default export
