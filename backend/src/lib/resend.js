import { Resend } from "resend";
// import 'dotenv/config';

import dotenv from 'dotenv';
dotenv.config();

export const resendClient=new Resend(process.env.RESEND_API_KEY);
