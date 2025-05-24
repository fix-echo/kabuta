"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";
import Image from "next/image";
import "./index.css";

const conversations = [
  { id: 1, title: "Create Html Game Environment..." },
  { id: 2, title: "Apply To Leave For Emergency" },
  { id: 3, title: "What Is UI UX Design?" },
  { id: 4, title: "Create POS System" },
  { id: 5, title: "What Is UX Audit?" },
  { id: 6, title: "Create Chatbot GPT..." },
  { id: 7, title: "How Chat GPT Work?" },
];

const lastSevenDays = [
  { id: 8, title: "Crypto Lending App Name" },
  { id: 9, title: "Operator Grammar Types" },
  { id: 10, title: "Min States For Binary DFA" },
];
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-screen h-screen bg-white overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-[300px] bg-white flex flex-col border-r border-gray-100">
        <div className="p-5">
          <h1 className="text-xl font-bold mb-5">CHAT A.I+</h1>
          <div className="flex gap-2 mb-5">
            <button className="bg-blue-600 text-white border-none rounded-full py-2 px-5 text-sm cursor-pointer flex items-center flex-grow justify-center">
              <span className="mr-1">+</span> New chat
            </button>
            <button className="bg-gray-100 border-none rounded-full w-10 h-10 flex items-center justify-center cursor-pointer">
              <span className="text-lg">⚲</span>
            </button>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
            <span>Your conversations</span>
            <button className="bg-transparent border-none text-blue-600 cursor-pointer text-xs">
              Clear All
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-5">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center py-2 cursor-pointer rounded-lg hover:bg-gray-50 mb-1"
            >
              <span className="mr-2 text-base">💬</span>
              <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {conv.title}
              </span>
            </div>
          ))}

          <div className="text-xs text-gray-400 my-4">
            <span>Last 7 Days</span>
          </div>

          {lastSevenDays.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center py-2 cursor-pointer rounded-lg hover:bg-gray-50 mb-1"
            >
              <span className="mr-2 text-base">💬</span>
              <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                {conv.title}
              </span>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="flex items-center mb-4 cursor-pointer">
            <span className="mr-2">⚙️</span>
            <span>Settings</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img
                src="/placeholder.svg?height=30&width=30"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm">Andrew Nelson</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col relative">
        <div className="flex-grow overflow-y-auto p-8 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              } mb-6 w-full`}
            >
              <div
                className={`flex-grow max-w-[calc(100%-100px)] ${
                  message.role === "user" ? "flex flex-col items-end" : ""
                }`}
              >
                <div
                  className={`mb-2 ${
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }`}
                >
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      message.role === "user"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {message.role === "user" ? "YOU" : "CHAT A.I+"}
                  </span>
                </div>
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-blue-600 text-white py-3 px-4 rounded-[18px] rounded-br-none max-w-[80%] self-end"
                      : "bg-gray-100 py-3 px-4 rounded-[18px] rounded-bl-none max-w-[80%]"
                  }`}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      case "tool-invocation":
                        return (
                          <pre key={`${message.id}-${i}`}>
                            {JSON.stringify(part.toolInvocation, null, 2)}
                          </pre>
                        );
                    }
                  })}
                  {message?.experimental_attachments
                    ?.filter(
                      (attachment) =>
                        attachment?.contentType?.startsWith("image/") ||
                        attachment?.contentType?.startsWith("application/pdf")
                    )
                    .map((attachment, index) =>
                      attachment.contentType?.startsWith("image/") ? (
                        <Image
                          key={`${message.id}-${index}`}
                          src={attachment.url}
                          width={500}
                          height={500}
                          alt={attachment.name ?? `attachment-${index}`}
                        />
                      ) : attachment.contentType?.startsWith(
                          "application/pdf"
                        ) ? (
                        <iframe
                          key={`${message.id}-${index}`}
                          src={attachment.url}
                          width={500}
                          height={600}
                          title={attachment.name ?? `attachment-${index}`}
                        />
                      ) : null
                    )}
                  {/* {message.content} */}
                </div>
                {message.role === "assistant" && (
                  <div className="flex gap-2 mt-2">
                    <button className="bg-transparent border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                      👍
                    </button>
                    <button className="bg-transparent border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                      👎
                    </button>
                    <button className="bg-transparent border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                      💬
                    </button>
                    <button className="bg-transparent border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                      ⋮
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-gray-100">
          <div className="w-full">
            {files && files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.from(files).map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 max-w-xs"
                  >
                    <span className="truncate max-w-[120px]">
                      {file.name.length > 24
                        ? file.name.slice(0, 12) + "..." + file.name.slice(-8)
                        : file.name}
                    </span>
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                      onClick={() => {
                        if (!files) return;
                        // DataTransfer hack to remove a file from FileList
                        const dt = new DataTransfer();
                        Array.from(files).forEach((f, i) => {
                          if (i !== index) dt.items.add(f);
                        });
                        setFiles(dt.files.length ? dt.files : undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.files = dt.files;
                        }
                      }}
                      aria-label="删除文件"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <form
              onSubmit={(event) => {
                handleSubmit(event, {
                  experimental_attachments: files,
                });

                setFiles(undefined);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="flex items-center bg-gray-100 rounded-full py-1 px-4"
            >
              <button
                type="button"
                className="bg-transparent border-none text-xl cursor-pointer mr-2"
                onClick={() => fileInputRef.current.click()}
              >
                📎
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(event) => {
                  if (event.target.files) {
                    setFiles(event.target.files);
                  }
                }}
                className="hidden"
                multiple
              />
              <input
                type="text"
                className="flex-grow border-none bg-transparent py-2 outline-none text-sm"
                placeholder="What's in your mind?..."
                value={input}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-blue-600 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-white ml-2"
              >
                <span className="text-xs">➤</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
