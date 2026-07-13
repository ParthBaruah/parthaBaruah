interface PayPalTokenResponse {
  access_token: string;
}

export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with PayPal gateway.");
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

export async function verifyPayPalWebhook(req: Request, webhookId: string): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    const headers = req.headers;
    const body = await req.clone().json();

    const verificationPayload = {
      auth_algo: headers.get("PAYPAL-AUTH-ALGO"),
      cert_url: headers.get("PAYPAL-CERT-URL"),
      transmission_id: headers.get("PAYPAL-TRANSMISSION-ID"),
      transmission_sig: headers.get("PAYPAL-TRANSMISSION-SIG"),
      transmission_time: headers.get("PAYPAL-TRANSMISSION-TIME"),
      webhook_id: webhookId,
      webhook_event: body,
    };

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationPayload),
      }
    );

    const data = await response.json();
    return data.verification_status === "SUCCESS";
  } catch (err) {
    console.error("Webhook architectural validation breakdown:", err);
    return false;
  }
}
