import { Expo, ExpoPushMessage } from 'expo-server-sdk';

class PushNotificationService {
    private readonly expo: Expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  
    private buildMessages(pushTokens: string[]) {
        let messages: ExpoPushMessage[] = [];

        for(let pushToken of pushTokens) {
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                continue;
              }
              messages.push({
                to: pushToken,
                sound: 'default',
                title: 'הקפצה',
                body: 'הקפצה!',
                data: { withSome: 'data' },
              })
        }

        return messages;
    }

    async sendPushNotifications(pushTokens: string[]) {
        const messages = this.buildMessages(pushTokens);
        const chunks = this.expo.chunkPushNotifications(messages);
        let tickets = [];
        for (let chunk of chunks) {
            try {
              let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
              tickets.push(...ticketChunk);
            } catch (error) {
              console.error(error);
            }
        }
        let response = "";

        for (const ticket of tickets) {
            if (ticket.status === "error") {
                if (ticket.details && ticket.details.error === "DeviceNotRegistered") {
                    response = "DeviceNotRegistered";
                }
            }
    
            if (ticket.status === "ok") {
                response = ticket.id;
            }
        }

        return response;
    }
}

const pushNotificationService = new PushNotificationService();
export default pushNotificationService;