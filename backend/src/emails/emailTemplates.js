export function createWelcomeEmailTemplate(name, clientURL) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Ripple</title>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#0b0b0b;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color:#111111;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:60px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" style="
          max-width:620px;
          background:#ffffff;
          border-radius:14px;
          border:1px solid #e5e7eb;
        ">

          <!-- Header -->
          <tr>
            <td style="
              padding:48px 40px 32px;
              text-align:center;
              border-bottom:1px solid #e5e7eb;
            ">
              <h1 style="
                margin:0;
                font-size:30px;
                font-weight:600;
                letter-spacing:-0.02em;
                color:#000000;
              ">
                Ripple
              </h1>
              <p style="
                margin-top:12px;
                font-size:14px;
                color:#6b7280;
              ">
                Secure. Private. Effortless messaging.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 20px;">

              <p style="
                font-size:17px;
                font-weight:500;
                margin-bottom:14px;
              ">
                Hello ${name},
              </p>

              <p style="
                font-size:15px;
                line-height:1.8;
                color:#374151;
                margin-bottom:24px;
              ">
                Welcome to <strong>Ripple</strong> — a modern messaging platform designed
                for professionals who value clarity, privacy, and speed.
              </p>

              <p style="
                font-size:15px;
                line-height:1.8;
                color:#374151;
                margin-bottom:30px;
              ">
                With Ripple, you can communicate seamlessly with your network,
                share content securely, and stay connected without distractions.
              </p>

              <!-- CTA -->
              <div style="text-align:center; margin:40px 0;">
                <a href="${clientURL}" style="
                  display:inline-block;
                  padding:14px 40px;
                  font-size:14px;
                  font-weight:600;
                  letter-spacing:0.02em;
                  color:#ffffff;
                  background:#000000;
                  text-decoration:none;
                  border-radius:999px;
                ">
                  Open Ripple
                </a>
              </div>

              <p style="
                font-size:14px;
                color:#4b5563;
                margin-bottom:6px;
              ">
                Need assistance?
              </p>
              <p style="
                font-size:14px;
                color:#4b5563;
                margin-top:0;
              ">
                Our support team is always available to help.
              </p>

              <p style="
                margin-top:32px;
                font-size:14px;
                color:#111827;
              ">
                Regards,<br/>
                <strong>The Ripple Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding:24px 40px;
              border-top:1px solid #e5e7eb;
              font-size:12px;
              color:#6b7280;
              text-align:center;
            ">
              <p style="margin:0 0 10px;">
                © 2025 Ripple. All rights reserved.
              </p>
              <p style="margin:0;">
                <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Privacy</a>
                |
                <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Terms</a>
                |
                <a href="#" style="color:#000000; text-decoration:none; margin:0 10px;">Contact</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}
