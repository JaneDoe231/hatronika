import
  React, {
  createContext,
  useContext,
  useState
} from "react";

import {
  Toast
} from "common/components";

import {
  DataStore
} from "common";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [isNotificationOn, setIsNotificationOn] = useState(
    DataStore.get("NOTIFICATIONOFF") ? false : true
  );

  const [toasts, setToasts] = useState([]);

  const notificationOn = () => {

    DataStore.clear("NOTIFICATIONOFF");
    setIsNotificationOn(true);
  };

  const notificationOff = () => {

    DataStore.set("NOTIFICATIONOFF", true);
    setIsNotificationOn(false);
  };

  const showToast = async (message, type, important = false) => {

    if (isNotificationOn || important) {

      const newToast = { id: Math.random().toString(36).slice(2, 9), show: true, message, type};
      
      setToasts(currentToasts => [newToast, ...currentToasts]);
    }
  };

  const removeToast = (id) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  }

  return (
    <ToastContext.Provider
      value={{ showToast, notificationOn, notificationOff, isNotificationOn }}
    >
      {children}
      { toasts.length > 0 &&

        <div
          style={{
            position: "fixed",
            right: "10px",
            bottom: "20px",
            margin: "auto",
            width: "380px",
            zIndex: "9999"
          }}
        >
          { toasts.map((toast, index) => (
              <Toast
                key={toast.id}
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
                offset={index * 60}
              />
          ))}
        </div>
      }
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
