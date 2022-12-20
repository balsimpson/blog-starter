import type { IncomingMessage, ServerResponse } from "http";
// import { useBody } from 'h3'

// export default (req, res) => {
//     res.statusCode(200)
//     res.end('Legacy handler')
//   }
import { Configuration, OpenAIApi } from "openai"

export default defineEventHandler( async (event) => {
    const config = useRuntimeConfig()
    const configuration = new Configuration({
        apiKey: config.OPENAI_KEY,
      });
    const openai = new OpenAIApi(configuration);
    // console.log(event)
    const query = getQuery(event)
    const body = await readBody(event)

    let mode = query["hub.mode"];
    let token = query["hub.verify_token"];
    let challenge = query["hub.challenge"];

    let generatedImg = "";
    
    // console.log('body', JSON.stringify(body.entry[0].changes[0], null, 2));
    // console.log(query, mode, token, challenge);
    // console.log(query);

    if (mode && token) {
        return challenge;
    } else {
        try {
            const ACCESS_TOKEN = config.WHATSAPP_ACCESS_TOKEN;
            // console.log(ACCESS_TOKEN);
            let phone_number_id =
            body.entry[0].changes[0].value.metadata.phone_number_id || "";
            let from = ""
            let msg_body = "";

            if (body.entry[0].changes[0].value && body.entry[0].changes[0].value.messages[0]) {
                    from = body.entry[0].changes[0].value.messages[0].from || ""; // extract the phone number from the webhook payload
            }

            msg_body = body.entry[0].changes[0].value.messages[0].text.body || "";

        if (from && msg_body) {

            // get image from dall-e
            // const response = await openai.createImage({
            //     prompt: msg_body,
            //     n: 1,
            //     size: "256x256",
            //   });

            // get reply from GPT-3
            const prediction = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: msg_body,
                max_tokens: 7,
                temperature: 0.3,
            });

            console.log(prediction)

            // generatedImg = response.data.data[0].url;

            // await sendMessage(prediction, from, ACCESS_TOKEN, phone_number_id)

            return {
                statusCode: 200
            }
        } else {

            return {
                statusCode: 200
            }
        }} catch (error) {
            console.log(error);
            return {
                statusCode: 200
          }
        }

        // if (status !== "sent" || status !== "delivered" || status !== "read") {
        // }

    }
    // return { challenge, status: 200 };
})

const sendMessage = async (msg, from, token, id) => {
    let url = `https://graph.facebook.com/v15.0/${id}/messages`;
    let res = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `application/json`
        },
        body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            // type: "image",
            text: {
                body: JSON.stringify(msg)
            },
            // "image": {
            //     "link": generatedImg,
            //   }
        }),
        credentials: "include"
    })
}

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

