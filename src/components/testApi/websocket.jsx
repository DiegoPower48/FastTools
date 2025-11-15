import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import io from "socket.io-client";
import styles from "../enlaces.module.css";

export default function Websocket({
  theme = "#ffffff",
  textTheme = "#000000",
}) {
  const [url, setUrl] = useState("http://localhost:3000");
  const [message, setMessage] = useState("");
  const [event, setEvent] = useState("");
  const [logs, setLogs] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const logsRef = useRef(null);

  const addLog = (text) => {
    setLogs((prev) => [...prev, text]);
    setTimeout(() => {
      if (logsRef.current) {
        logsRef.current.scrollTop = logsRef.current.scrollHeight;
      }
    }, 50);
  };

  const connect = () => {
    try {
      setIsConnecting(true);
      const s = io(url, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      s.on("connect", () => {
        setIsConnected(true);
        setIsConnecting(false);
        addLog(`🟢 Connected to ${url} (ID: ${s.id})`);
      });

      s.on("connect_error", (err) => {
        console.log("Connection error:", err);
        addLog(`❌ Connection error: ${err.message}`);
        addLog(`💡 Verifica que el servidor esté corriendo en ${url}`);
        if (!s.active) {
          setIsConnecting(false);
        }
      });

      s.on("disconnect", (reason) => {
        setIsConnected(false);
        setIsConnecting(false);
        addLog(`🔴 Disconnected: ${reason}`);
      });

      s.onAny((event, ...args) => {
        if (!s.connected) return;

        if (event !== "connect" && event !== "disconnect") {
          const formatted =
            typeof args[0] === "string"
              ? args[0]
              : JSON.stringify(args[0], null, 2);

          addLog(`📥 Event "${event}": ${formatted}`);
        }
      });

      setSocket(s);
      addLog(`⏳ Connecting to ${url}...`);
    } catch (e) {
      addLog(`❌ Failed to connect: ${e.message}`);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (!socket) return;
    addLog("🔌 Disconnecting...");
    setIsConnecting(false);
    setIsConnected(false);
    socket.removeAllListeners();
    socket.disconnect();
    setSocket(null);
    addLog("🔴 Disconnected manually");
  };

  const sendMessage = () => {
    if (!socket || !isConnected) {
      addLog("⚠️ Socket.IO is not connected");
      return;
    }

    try {
      let payload = message;
      try {
        payload = JSON.parse(message);
        addLog(`📤 Sent to "${event}" (JSON): ${JSON.stringify(payload)}`);
      } catch {
        addLog(`📤 Sent to "${event}" (text): ${message}`);
      }

      socket.emit(event, payload);
      setMessage("");
    } catch (e) {
      addLog(`❌ Error sending: ${e.message}`);
    }
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
      }
    };
  }, [socket]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  return (
    <div
      style={{ color: textTheme }}
      className="w-full h-screen flex flex-col gap-4 p-4"
    >
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="http://localhost:3010"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isConnected}
            className="flex-1"
          />

          {isConnected || isConnecting ? (
            <Button
              className={`font-bold ${isConnecting ? "opacity-50" : ""}`}
              variant="destructive"
              onClick={disconnect}
            >
              {isConnecting ? "Stop" : "Disconnect"}
            </Button>
          ) : (
            <Button
              className="font-bold"
              style={{ backgroundColor: theme, color: textTheme }}
              onClick={connect}
            >
              Connect
            </Button>
          )}
        </div>

        {/* Message Sender */}
        <div className="flex gap-2">
          <Input
            placeholder="Event name"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            disabled={!isConnected}
            className="w-48"
          />
          <Input
            placeholder="Message (text or JSON)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            className="flex-1"
          />
          <Button
            className="font-bold"
            style={{ backgroundColor: theme, color: textTheme }}
            onClick={sendMessage}
            disabled={!isConnected || !message.trim()}
          >
            Send
          </Button>
        </div>

        {/* Status indicator */}

        {/* Logs */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={` ${
                  isConnected ? "text-green-500" : "text-red-500"
                }`}
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <Button
              className="font-bold"
              variant="outline"
              onClick={() => setLogs([])}
              disabled={logs.length === 0}
            >
              Clear
            </Button>
          </div>
          <div
            ref={logsRef}
            style={{
              "--theme": theme,
            }}
            className={`h-64 overflow-y-auto p-3 border bg-black text-green-400 rounded text-sm font-mono ${styles.scrollContainer}`}
          >
            {logs.length === 0 ? (
              <p className="text-neutral-500">No logs yet…</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1 whitespace-pre-wrap break-words">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
