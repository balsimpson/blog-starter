import type { IncomingMessage, ServerResponse } from "http";
import { useBody } from 'h3'


export default defineEventHandler((event) => {
    console.log(event)
    return {
        api: 'works'
    }
})

    // Parse params from the webhook verification request
    // let mode = context.params.hub.mode;
    // let token = context.params.hub.verify_token;
    // let challenge = context.params.hub.challenge;

    // console.log(mode, token, challenge);
    // // Check if a token and mode were sent
    // if (mode && token) {
    //     // Check the mode and token sent are correct
    //     if (mode == "subscribe" && token == verify_token) {
    //         // Respond with 200 OK and challenge token from the request
    //         console.log("WEBHOOK_VERIFIED");
    //         // return challenge;
    //         return {
    //             headers: { 'Content-Type': 'application/json' },
    //             statusCode: 200,
    //             body: Buffer.from(challenge)
    //         };
    //     } else {
    //         // Responds with '403 Forbidden' if verify tokens do not match
    //         return {
    //             statusCode: 403
    //         };
    //     }
    // }
