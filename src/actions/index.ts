import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import {
    QUOTE_EMAIL_RECEIVER,
    QUOTE_EMAIL_SENDER,
    QUOTE_EMAIL_SENDER_HOST,
    QUOTE_EMAIL_SENDER_PASSWORD,
    QUOTE_EMAIL_SENDER_PORT,
} from "astro:env/server";
import nodemailer from "nodemailer";
import { LOCALES } from "@i18n/config";
import { composeQuoteMail, EMAIL_MAX, EMAIL_PATTERN, IDEA_MAX, IDEA_MIN, QUOTE_TYPES, SHORT_MAX } from "@lib/quote";

export const server = {
    // The quote form of the homepage (Launch.astro). The browser checks the
    // same rules first; these are the ones that count.
    sendQuote: defineAction({
        accept: "form",
        input: z.object({
            type: z.array(z.enum(QUOTE_TYPES)).min(1),
            idea: z.string().trim().min(IDEA_MIN).max(IDEA_MAX),
            email: z.string().trim().max(EMAIL_MAX).regex(EMAIL_PATTERN),
            deadline: z.string().trim().max(SHORT_MAX).optional(),
            budget: z.string().trim().max(SHORT_MAX).optional(),
            lang: z.enum(LOCALES),
            // Honeypot: invisible to people, filled in by the bots that fill
            // in every field they find
            website: z.string().optional(),
        }),
        handler: async input => {
            // A bot: it is told the request went through, and nothing is sent
            if (input.website) return { email: input.email };

            if (!QUOTE_EMAIL_SENDER || !QUOTE_EMAIL_SENDER_PASSWORD || !QUOTE_EMAIL_SENDER_HOST || !QUOTE_EMAIL_RECEIVER) {
                console.error("[quote] The QUOTE_EMAIL_* environment variables are not all set: the request cannot be sent.");
                throw new ActionError({ code: "SERVICE_UNAVAILABLE" });
            }

            const port = QUOTE_EMAIL_SENDER_PORT ?? 465;
            const transport = nodemailer.createTransport({
                host: QUOTE_EMAIL_SENDER_HOST,
                port,
                // 465 speaks TLS from the start; the other ports (587)
                // upgrade with STARTTLS, required so nothing travels in clear
                secure: port === 465,
                requireTLS: port !== 465,
                auth: { user: QUOTE_EMAIL_SENDER, pass: QUOTE_EMAIL_SENDER_PASSWORD },
                // A mail server that does not answer must not hold the visitor
                connectionTimeout: 10_000,
                greetingTimeout: 10_000,
                socketTimeout: 20_000,
            });

            const { subject, text } = composeQuoteMail({
                types: input.type,
                idea: input.idea,
                email: input.email,
                deadline: input.deadline,
                budget: input.budget,
                lang: input.lang,
            });

            try {
                await transport.sendMail({
                    from: { name: "thomasgysemans.dev", address: QUOTE_EMAIL_SENDER },
                    to: QUOTE_EMAIL_RECEIVER,
                    // Answering the mail answers the visitor
                    replyTo: input.email,
                    subject,
                    text,
                });
            } catch (error) {
                console.error("[quote] The request could not be sent:", error);
                throw new ActionError({ code: "BAD_GATEWAY" });
            }
            // Echoed back so the confirmation shows where the answer will go
            return { email: input.email };
        },
    }),
};
