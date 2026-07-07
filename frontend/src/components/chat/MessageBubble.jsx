import { useState, useEffect } from "react";
import { withTransform } from "../../lib/imagekit";
import { MessageVideo } from "./MessageVideo";
import { useChatStore } from "../../store/useChatStore";
// Compress + size images for the bubble (q-auto works for images; f-auto picks WebP/AVIF).
const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";


export function MessageBubble({ message }) {
  const deleteMessage = useChatStore((state) => state.deleteMessage);
   
  const isOwnMessage = message.role === "me";
  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);


  const [contextMenu, setContextMenu] = useState({
  visible: false,
  x: 0,
  y: 0,
});

useEffect(() => {
  function handleClick() {
    setContextMenu((prev) => ({
      ...prev,
      visible: false,
    }));
  }

  if (contextMenu.visible) {
    window.addEventListener("click", handleClick);
  }

  return () => {
    window.removeEventListener("click", handleClick);
  };
}, [contextMenu.visible]);

  return (
    <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>

      <div
      onContextMenu={(e) => {
      e.preventDefault();

  // menu shows only in my own message
  if (!isOwnMessage) return;

  setContextMenu({
    visible: true,
    x: e.clientX,
    y: e.clientY,
  });
}}
        className={`max-w-[min(90%,28rem)] rounded-2xl px-3 py-2 text-[15px] leading-snug sm:max-w-[min(75%,28rem)] sm:px-3.5 ${
          isOwnMessage
            ? "rounded-br-md bg-accent text-accent-foreground"
            : "rounded-bl-md bg-surface"
        }`}
      >
        {hasImage ? (
          <img
            src={withTransform(message.imageUrl, IMAGE_TRANSFORM)}
            alt=""
            className="mb-1.5 max-h-40 max-w-full rounded-lg object-cover sm:max-h-52 sm:rounded-xl"
          />
        ) : null}
        {hasVideo ? <MessageVideo src={message.videoUrl} /> : null}
        {message.text ? (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        ) : null}
        <p
          className={`mt-1 text-[11px] tabular-nums ${
            isOwnMessage ? "text-accent-foreground/75" : "text-muted"
          }`}
        >
          {message.time}
        </p>
      </div>
      {contextMenu.visible && (
  <div
    className="fixed z-50 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl"
    style={{
      top: contextMenu.y,
      left: contextMenu.x,
    }}
  >
    {/* <button
      className="w-full px-4 py-2 text-left hover:bg-gray-100"
      onClick={() => {
        navigator.clipboard.writeText(message.text || "");
        setContextMenu({ ...contextMenu, visible: false });
      }}
    >
      📋Copy
    </button> */}

    <button
      className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50"
      onClick={() => {
        deleteMessage(message.id);
        setContextMenu({ ...contextMenu, visible: false });
      }}
    >
      🗑 Delete Message
    </button>
  </div>
)}
    </div>
  );
}