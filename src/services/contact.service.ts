export const contactSellerService = async ({
  clientEmail,
  sellerEmail,
  message,
}: {
  clientEmail: string;
  sellerEmail: string;
  message: string;
}) => {
  const text = `
📩 New message

Client: ${clientEmail}
Seller: ${sellerEmail}

Message:
${message}
`.trim();

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.ok) {
    throw new Error(data.description || "Telegram error");
  }

  return data;
};
