export function createWelcomeEmailTemplate(name, clientURL) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Messenger</title>
</head>

<body style="
  font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
  line-height:1.6;
  color:#111;
  max-width:600px;
  margin:0 auto;
  padding:20px;
  background-color:#f4f4f4;
">

  <!-- Header -->
  <div style="
    background:#000000;
    padding:32px;
    text-align:center;
    border-radius:12px 12px 0 0;
  ">
    <img
      src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg"
      alt="Messenger Logo"
      style="
        width:78px;
        height:78px;
        margin-bottom:18px;
        border-radius:50%;
        background:#ffffff;
        padding:10px;
      "
    >
    <h1 style="
      color:#ffffff;
      margin:0;
      font-size:28px;
      font-weight:500;
    ">
      Welcome to Ripple
    </h1>
  </div>

  <!-- Body -->
  <div style="
    background-color:#ffffff;
    padding:36px;
    border-radius:0 0 12px 12px;
    box-shadow:0 6px 20px rgba(0,0,0,0.06);
  ">

    <p style="font-size:18px; color:#000000;">
      <strong>Hello ${name},</strong>
    </p>

    <p>
      We’re excited to have you on Messenger — a clean, fast, and secure way to stay connected with the people who matter.
    </p>

    <!-- Info box -->
    <div style="
      background-color:#fafafa;
      padding:24px;
      border-radius:10px;
      margin:26px 0;
      border-left:4px solid #000000;
    ">
      <p style="font-size:16px; margin:0 0 14px 0;">
        <strong>Get started in minutes:</strong>
      </p>
      <ul style="padding-left:20px; margin:0;">
        <li style="margin-bottom:10px;">Set up your profile</li>
        <li style="margin-bottom:10px;">Add your contacts</li>
        <li style="margin-bottom:10px;">Start a conversation</li>
        <li>Share messages and media effortlessly</li>
      </ul>
    </div>

    <!-- CTA -->
    <div style="text-align:center; margin:34px 0;">
      <a
        href="${clientURL}"
        style="
          background:#000000;
          color:#ffffff;
          text-decoration:none;
          padding:13px 34px;
          border-radius:50px;
          font-weight:500;
          display:inline-block;
        "
      >
        Open Ripple
      </a>
    </div>

    <p>If you need help or have any questions, our team is always ready to assist.</p>
    <p style="margin-top:22px;">
      Best regards,<br>
      <strong>Ripple_ Team</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="
    text-align:center;
    padding:20px;
    color:#777;
    font-size:12px;
  ">
    <p>© 2025 Messenger. All rights reserved.</p>
    <p>
      <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Privacy</a>
      <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Terms</a>
      <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Contact</a>
    </p>
  </div>

</body>
</html>
`;
}
