# twitch-chat-collector (AKA StreamPanel)
An express app that handles downloading interactions (chat and subscriptions) on a channel's chat feed and saving them in MongoDB

### Getting Started

Run `npm install` and `npm start` to start the express server

### Controllers
- **Chanel Controller**: Hanldes creation of `channels`. Once saved to the DB, a channel will be connected to daily to collect all the chat interactions and stats.
- **Interaction controller**: An interaction is basically a message in the Twitch Chat
- **User Contoller**: Used to create users. User's are tracked so a chanel can see how long a specific viewer watches their channel, and how much they interact with it.
