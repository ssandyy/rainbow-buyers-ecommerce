import nodemailer from "nodemailer";

type Props = {
    subject: string;
    receiver: string;
    body: string;
};

export const sendMail = async ({ subject, receiver, body }: Props) => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT ? Number(process.env.NODEMAILER_PORT) : 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    const option = {
        from: `"Rainbow Buyers" <${process.env.NODEMAILER_EMAIL}>`,
        to: receiver,
        subject: subject,
        html: body,
    };

    try {
        await transporter.sendMail(option);
        return {
            success: true,
            message: "Email sent successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: ` Email not sent, ${error}`,
        };
    }
}



