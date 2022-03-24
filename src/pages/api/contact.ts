import mail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
import { config } from "../../config";

mail.setApiKey(config.sendGridApiKey);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email, message } = req.body;

  const contactEmailText = `
    Name: ${name}\r\n
    Email: ${email}\r\n\r\n
    Message: ${message}
  `;

  const receiptConfirmationText = `
    Hi ${name},\r\n
    \r\n
    Thank you for writing to me.\r\n
    I confirm the receipt of your request and will be in touch with you soon.\r\n
    \r\n
    Adam Hultman
  `;

  // try {
  //   await mail.send({
  //     to: "adam@hultman.tech",
  //     from: "adam@hultman.tech",
  //     subject: "New Contact Request",
  //     text: contactEmailText,
  //     html: contactEmailText.replace(/\r\n/g, "<br>"),
  //   });

  //   await mail.send({
  //     to: email,
  //     from: "adam@hultman.tech",
  //     subject: "Adam Hultman - Contact Request",
  //     text: receiptConfirmationText,
  //     html: receiptConfirmationText.replace(/\r\n/g, "<br>"),
  //   });
  // } catch (e) {
  //   console.error(e);
  //   res.status(500);
  // }

  res.status(200).json({ status: "OK" });
};
