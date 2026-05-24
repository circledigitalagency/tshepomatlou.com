import { json } from "@remix-run/node";
import { sendEmail } from "~/utils/email.server";

export async function action({ request }: { request: Request }) {
	const body = await request.json();

	console.log("body: ", body);

	if (body.type === "payment.succeeded") {
		const { email, amount, reference } = body.payload;

		if (email) {
			await sendEmail({
				to: email,
				subject: "Your Payment Confirmation",
				html: `
			  <!DOCTYPE html>
			  <html>
				<body
				  style="
					margin: 0;
					padding: 40px 20px;
					background: #FAF6F1;
					font-family: 'DM Sans', Arial, sans-serif;
					color: #1A1814;
				  "
				>
				  <table
					width="100%"
					cellpadding="0"
					cellspacing="0"
					style="
					  max-width: 620px;
					  margin: 0 auto;
					  background: #FEFCFA;
					  border: 1px solid #EDE3D6;
					"
				  >
					<tr>
					  <td style="padding: 48px;">
						<p
						  style="
							margin: 0 0 12px;
							font-size: 11px;
							letter-spacing: 2px;
							text-transform: uppercase;
							color: #6B7C5A;
						  "
						>
						  Tshepo Matlou
						</p>
		  
						<h1
						  style="
							margin: 0 0 32px;
							font-family: Georgia, serif;
							font-size: 42px;
							line-height: 1.1;
							font-weight: 400;
							color: #3D3328;
						  "
						>
						  Payment
						  <br />
						  Confirmation
						</h1>
		  
						<p
						  style="
							margin: 0 0 24px;
							font-size: 16px;
							line-height: 1.9;
							color: #3D3328;
						  "
						>
						  Thank you for your purchase. Your payment has been received successfully.
						</p>
		  
						<table
						  width="100%"
						  cellpadding="0"
						  cellspacing="0"
						  style="
							border-top: 1px solid #EDE3D6;
							border-bottom: 1px solid #EDE3D6;
							padding: 28px 0;
						  "
						>
						  <tr>
							<td style="padding-bottom: 20px;">
							  <p
								style="
								  margin: 0 0 6px;
								  font-size: 11px;
								  letter-spacing: 2px;
								  text-transform: uppercase;
								  color: #8C9BA8;
								"
							  >
								Amount Paid
							  </p>
		  
							  <p
								style="
								  margin: 0;
								  font-size: 18px;
								  color: #1A1814;
								"
							  >
								R${(amount / 100).toFixed(2)}
							  </p>
							</td>
						  </tr>
		  
						  <tr>
							<td>
							  <p
								style="
								  margin: 0 0 6px;
								  font-size: 11px;
								  letter-spacing: 2px;
								  text-transform: uppercase;
								  color: #8C9BA8;
								"
							  >
								Reference
							  </p>
		  
							  <p
								style="
								  margin: 0;
								  font-size: 18px;
								  color: #1A1814;
								"
							  >
								${reference}
							  </p>
							</td>
						  </tr>
						</table>
		  
						<p
						  style="
							margin: 32px 0 0;
							font-size: 15px;
							line-height: 1.9;
							color: #3D3328;
						  "
						>
						  Thank you for supporting Tshepo Matlou.
						</p>
					  </td>
					</tr>
				  </table>
				</body>
			  </html>
			  `,
			});
		}

		await sendEmail({
			to: "me@tshepomatlou.com",
			subject: "📘 Book Purchase Notification",
			html: `
			<!DOCTYPE html>
			<html>
			  <body
				style="
				  margin: 0;
				  padding: 40px 20px;
				  background: #FAF6F1;
				  font-family: 'DM Sans', Arial, sans-serif;
				  color: #1A1814;
				"
			  >
				<table
				  width="100%"
				  cellpadding="0"
				  cellspacing="0"
				  style="
					max-width: 620px;
					margin: 0 auto;
					background: #FEFCFA;
					border: 1px solid #EDE3D6;
				  "
				>
				  <tr>
					<td style="padding: 48px;">
					  <p
						style="
						  margin: 0 0 12px;
						  font-size: 11px;
						  letter-spacing: 2px;
						  text-transform: uppercase;
						  color: #6B7C5A;
						"
					  >
						Tshepo Matlou
					  </p>
		  
					  <h1
						style="
						  margin: 0 0 32px;
						  font-family: Georgia, serif;
						  font-size: 42px;
						  line-height: 1.1;
						  font-weight: 400;
						  color: #3D3328;
						"
					  >
						New Book
						<br />
						Purchase
					  </h1>
		  
					  <table
						width="100%"
						cellpadding="0"
						cellspacing="0"
						style="
						  border-top: 1px solid #EDE3D6;
						  border-bottom: 1px solid #EDE3D6;
						  padding: 28px 0;
						"
					  >
						<tr>
						  <td style="padding-bottom: 20px;">
							<p
							  style="
								margin: 0 0 6px;
								font-size: 11px;
								letter-spacing: 2px;
								text-transform: uppercase;
								color: #8C9BA8;
							  "
							>
							  Customer Email
							</p>
		  
							<p
							  style="
								margin: 0;
								font-size: 18px;
								color: #1A1814;
							  "
							>
							  ${email || "N/A"}
							</p>
						  </td>
						</tr>
		  
						<tr>
						  <td style="padding-bottom: 20px;">
							<p
							  style="
								margin: 0 0 6px;
								font-size: 11px;
								letter-spacing: 2px;
								text-transform: uppercase;
								color: #8C9BA8;
							  "
							>
							  Amount
							</p>
		  
							<p
							  style="
								margin: 0;
								font-size: 18px;
								color: #1A1814;
							  "
							>
							  R${(amount / 100).toFixed(2)}
							</p>
						  </td>
						</tr>
		  
						<tr>
						  <td>
							<p
							  style="
								margin: 0 0 6px;
								font-size: 11px;
								letter-spacing: 2px;
								text-transform: uppercase;
								color: #8C9BA8;
							  "
							>
							  Reference
							</p>
		  
							<p
							  style="
								margin: 0;
								font-size: 18px;
								color: #1A1814;
							  "
							>
							  ${reference}
							</p>
						  </td>
						</tr>
					  </table>
		  
					  <p
						style="
						  margin: 32px 0 0;
						  font-size: 15px;
						  line-height: 1.9;
						  color: #3D3328;
						"
					  >
						Follow up with the customer to deliver the book.
					  </p>
					</td>
				  </tr>
				</table>
			  </body>
			</html>
			`,
		});
	}

	return json({ status: "received" });
}
