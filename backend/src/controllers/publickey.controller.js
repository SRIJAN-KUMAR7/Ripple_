import User from "../models/User.js";

/**
 * POST /api/keys/upload
 * Store the authenticated user's ECDH public key.
 * Called once on login from the browser.
 */
export const uploadPublicKey = async (req, res) => {
  try {
    const { publicKey } = req.body;

    if (!publicKey || typeof publicKey !== "string") {
      return res.status(400).json({ message: "Valid publicKey string is required" });
    }

    // Sanity-check: base64 SPKI public keys are ~124 bytes → ~165 base64 chars
    if (publicKey.length < 100 || publicKey.length > 500) {
      return res.status(400).json({ message: "Invalid publicKey format" });
    }

    await User.findByIdAndUpdate(req.user._id, { publicKey });

    return res.status(200).json({ message: "Public key stored successfully" });
  } catch (error) {
    console.error("Error in uploadPublicKey:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/keys/:userId
 * Fetch another user's ECDH public key so the caller can derive
 * the shared secret before sending an encrypted message.
 * Only the public key is exposed — never any sensitive user data.
 */
export const getPublicKey = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent fetching your own key via this endpoint (use localStorage instead)
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot fetch your own public key via this endpoint" });
    }

    const user = await User.findById(userId).select("publicKey fullName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.publicKey) {
      return res.status(404).json({
        message: "Public key not found — this user has not set up E2E encryption yet. Ask them to log in again.",
      });
    }

    return res.status(200).json({ publicKey: user.publicKey });
  } catch (error) {
    console.error("Error in getPublicKey:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
