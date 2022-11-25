let { Expo } = require("expo-server-sdk");
let db = require("../db");
let expo = new Expo();
async function getPushTokens() {
    let { rows } = await db.query('select * from push_tokens');
    let push_tokens = rows.map((row) => {
        return row.token;
    })
    return push_tokens;
}
async function storePushToken(token) {
    await db.query('insert into push_tokens (token) values ($1)', [token]);
}
function createMessages(body, data, pushTokens) {
    // Create the messages that you want to send to clents
    let messages = [];
    for (let pushToken of pushTokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
        // Check that all your push tokens appear to be valid Expo push tokens
        if (pushToken && pushToken != null) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
            }
            // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
            messages.push({
                to: pushToken,
                sound: 'default',
                body,
                data,
            })
        }
    }
    return messages;
}
async function sendMessages(messages) {
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }
    return tickets;
}
function getReceiptIds(tickets) {
    let receiptIds = [];
    for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
    }
    return receiptIds;
}
async function obtainReceipts(receiptIds) {
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

            // receipts may only be one object
            if (!Array.isArray(receipts)) {
                let receipt = receipts;
                if (receipt.status === 'ok') {
                    continue;
                } else if (receipt.status === 'error') {
                    console.error(`There was an error sending a notification: ${receipt.message}`);
                    if (receipt.details && receipt.details.error) {
                        // The error codes are listed in the Expo documentation:
                        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                        // You must handle the errors appropriately.
                        console.error(`The error code is ${receipt.details.error}`);
                    }
                }
                return;
            }
            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receipt of receipts) {
                if (receipt.status === 'ok') {
                    continue;
                } else if (receipt.status === 'error') {
                    console.error(`There was an error sending a notification: ${receipt.message}`);
                    if (receipt.details && receipt.details.error) {
                        // The error codes are listed in the Expo documentation:
                        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
                        // You must handle the errors appropriately.
                        console.error(`The error code is ${receipt.details.error}`);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
async function send(text, data, tokens) {
    let name = data.name ?? 'Settings';
    let params = data.params ?? { data: { id: 3 } };
    let messages = createMessages(text, { name, params }, tokens);
    let tickets = await sendMessages(messages);
    let receiptIds = getReceiptIds(tickets);
    return await obtainReceipts(receiptIds);
}
module.exports = { send }