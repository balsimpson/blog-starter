import type { IncomingMessage, ServerResponse } from "http";
import { useBody } from 'h3'

// export default (req, res) => {
//     res.statusCode(200)
//     res.end('Legacy handler')
//   }

export default defineEventHandler( async (event) => {
    console.log(event)
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const body = await readBody(event)

    let mode = query["hub.mode"];
    let token = query["hub.verify_token"];
    let challenge = query["hub.challenge"];
    
    console.log('body', body);
    console.log(query, mode, token, challenge);

    if (mode && token) {
        return challenge;
    } else {

    }
    // return { challenge, status: 200 };
})

// export default defineEventHandler((event) => {
//     const query = getQuery(event)
//     console.log(query)
//     // Parse params from the webhook verification request
//     let mode = query["hub.mode"];
//     let token = query["hub.verify_token"];
//     let challenge = query["hub.challenge"];
    
//     console.log(mode, token, challenge);
//     // // Check if a token and mode were sent
//     if (mode && token) {
//         // Check the mode and token sent are correct
//         if (mode == "subscribe" && token == "foxy") {
//             // Respond with 200 OK and challenge token from the request
//             console.log("WEBHOOK_VERIFIED");
//             // return challenge;
//             return {
//                 headers: { 'Content-Type': 'application/json' },
//                 statusCode: 200,
//                 body: query["hub.challenge"]
//             };
//         } else {
//             // Responds with '403 Forbidden' if verify tokens do not match
//             return {
//                 statusCode: 403
//             };
//         }
//     }
//     // return {
//     //     headers: { 'Content-Type': 'application/json' },
//     //     statusCode: 200,
//     //     // body: Buffer.from(challenge)
//     // }
// })

