import mongoose from "mongoose";

const messageSchema=new mongoose.Schema(
    {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    // ── E2E Encryption fields ─────────────────────────────────────
    // When a message is encrypted, ciphertext+iv are stored instead of plain text.
    // The server never decrypts these — only the intended recipient can.
    ciphertext: {
      type: String, // Base64 AES-GCM encrypted message
    },
    iv: {
      type: String, // Base64 12-byte random IV — NOT secret, required for decryption
    },
    isEncrypted: {
      type: Boolean,
      default: false, // true when ciphertext+iv are present
    },
    // ─────────────────────────────────────────────────────────────
    image: {
      type: String,
    },
    file: {
      type: String,
    },
    fileType: {
      type: String,
    },
    },
    {timestamps :true}
);

const Message =mongoose.model("Message",messageSchema);

export default Message;