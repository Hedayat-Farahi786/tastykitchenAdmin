import { useRoutes } from "react-router-dom";
import ThemeRoutes from "./routes/Router";
import { AuthProvider } from "./AuthContext";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import notificationSound from "./assets/notification.mp3";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 5,
  timeout: 20000,
  withCredentials: true,
});

const App = () => {
  const [playNotification, setPlayNotification] = useState(false);

  useEffect(() => {
    socket.on("new_order", (message) => {
      console.log("New order received:", message);
      setPlayNotification(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (playNotification) {
      const audio = new Audio(notificationSound);
      audio
        .play()
        .then(() => {
          console.log("Audio played successfully");
          setPlayNotification(false);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setPlayNotification(false);
        });
    }
  }, [playNotification]);

  const routing = useRoutes(ThemeRoutes);

  return <AuthProvider>{routing}</AuthProvider>;
};

export default App;
