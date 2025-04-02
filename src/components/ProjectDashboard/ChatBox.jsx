import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Paper, Typography, Avatar, Tooltip, Checkbox } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useAuth from "hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isCurrentYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else if (isCurrentYear) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }
};

const ChatBox = ({ chats = [], onSendMessage, onMessageComplete }) => {
  const [newMessage, setNewMessage] = useState("");
  const chatsEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage({
        message: newMessage.trim(),
        date: new Date().toISOString(),
        sender: user?.name || "Unknown User",
        completed: false,
        id: uuidv4(),
      });

      setNewMessage("");
    }
  };

  const handleMessageSelect = (chat, ischecked) => {
    chat.completed = ischecked;
    onMessageComplete(chat);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Project Chat{" "}
        {(() => {
          const pendingCount = chats.filter((chat) => !chat.completed).length;
          if (chats.length === 0) return "";
          if (pendingCount === 0) return "(All Complete)";
          return `(${pendingCount} ${pendingCount === 1 ? "Item" : "Items"} Pending)`;
        })()}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "400px",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: "#fff",
          width: "100%",
        }}>
        {/* Chats Container */}
        <Paper
          ref={chatBoxRef}
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "#f8f9fa",
          }}>
          {chats.map((chat, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                position: "relative",
              }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-middle",
                }}>
                <Tooltip title={chat.sender} arrow>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.7rem",
                      bgcolor: chat.sender === user?.name ? "primary.main" : "secondary.main",
                    }}>
                    {getInitials(chat.sender)}
                  </Avatar>
                </Tooltip>
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    backgroundColor: chat.completed ? "#e8f5e9" : chat.sender === user?.name ? "#e3f2fd" : "#fff",
                    borderRadius: 2,
                    wordBreak: "break-word",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    width: "100%",
                    border: "1px solid",
                    borderColor: chat.completed ? "success.light" : chat.sender === user?.name ? "primary.light" : "grey.200",
                    textDecoration: chat.completed ? "line-through" : "none",
                    textDecorationColor: "rgba(0, 0, 0, 0.3)",
                  }}>
                  <Typography variant="body2">{chat.message}</Typography>
                </Paper>
                <Checkbox
                  size="small"
                  checked={chat.completed}
                  onChange={(e) => handleMessageSelect(chat, e.target.checked)}
                  sx={{
                    p: 0,
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  position: "absolute",
                  top: -4,
                  right: 0,
                  fontSize: "0.65rem",
                  backgroundColor: "#f8f9fa",
                  px: 0.5,
                }}>
                {formatDate(chat.date)}
              </Typography>
            </Box>
          ))}
          <div ref={chatsEndRef} />
        </Paper>

        {/* Message Input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 1.5,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            gap: 1,
            backgroundColor: "#fff",
          }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                minHeight: "40px",
                maxHeight: "120px",
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!newMessage.trim()}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default ChatBox;
