import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: "mail.tshepomatlou.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendEmail({
	to,
	subject,
	html,
}: {
	to: string;
	subject: string;
	html: string;
}) {
	try {
		await transporter.verify();
		console.log("SMTP connection verified");

		const info = await transporter.sendMail({
			from: `"Tshepo Matlou" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			html,
		});

		console.log("Email sent successfully:", info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("Email sending failed:", error);
	}
}
