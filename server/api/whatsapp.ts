import type { IncomingMessage, ServerResponse } from "http";
import { useBody } from 'h3'

// export default (req, res) => {
//     res.statusCode(200)
//     res.end('Legacy handler')
//   }

export default defineEventHandler( async (event) => {
    // console.log(event)
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const body = await readBody(event)

    let mode = query["hub.mode"];
    let token = query["hub.verify_token"];
    let challenge = query["hub.challenge"];
    
    console.log('body', JSON.stringify(body, null, 2));
    // console.log(query, mode, token, challenge);
    console.log(query);

    if (mode && token) {
        return challenge;
    } else {
        const ACCESS_TOKEN = config.WHATSAPP_ACCESS_TOKEN;
        // console.log(ACCESS_TOKEN);
        let phone_number_id =
        body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        let msg_body = body.entry[0].changes[0].value.messages[0].text.body || "";

        if (msg_body) {
            let status = body.entry[0].changes[0].value?.statuses[0]?.status || "";
            let url = `https://graph.facebook.com/v15.0/${phone_number_id}/messages`;
            let res = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': `application/json`
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        // @ts-ignore
                        body: "Ack: " + msg_body + " - " + status
                    },
                }),
                credentials: "include"
            })
    
            console.log(res)
            return res;
        }


        // if (status !== "sent" || status !== "delivered" || status !== "read") {
        // }

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

