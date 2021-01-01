# Strawberry Slack Reaction Counter  🍓

This is a quick Javascript node product that will let you count the number of messages that have a given reaction, broken down by month, and limited to a certain date range. 

I created this bot for Fitness Challenges that are held at [Very](https://www.verypossible.com/), a IoT hardware, software development company. Feel free to fork and adopt it for your own use cases!

## Why Strawberry?

Strawberries are delicious. But 'Slack Reaction Counter' sounded rather boring. So I threw in some extra fruit!

## What does this use?

This usages [@slack/bolt](https://slack.dev/bolt-js/concepts) to get user profile information, to show results by the users full name and the conversation history permission.

## Usage Information

 1. Create a [Slack App](https://api.slack.com/apps?new_app), name it something you can find later and that your workspace admin would approve of.
 2. Create an OAuth Token. Add features and functionality --> Permissions. Apply the following permissions to your token: **channels:history** and **users.profile:read**
 3. Invite your newly created app to the channel you want to monitor.
 4. Copy down your Signing Secret, OAuth Token, Channel ID and the name of the reaction you want to count by into the step below.
 5. Create a .env file in the project and fill out all required environment variables. (See Example Below)

## .env example

    OAUTHTOKEN=oauthtoken
    SIGNINGSECRET=signingsecret
    CHANNELID=A11AA1AAA
    OLDEST_DATE=1609459200
    REACTION=strawberry

Notes:

- CHANNELID was obtained by using the slack web app and getting the channel ID from the URL, I couldn't figure out any other way to do this.
- OLDEST_DATE is an [Epoch timestamp](https://www.epochconverter.com/), slacks documentation neglects to mention what 'slack latest time range' or 'slack oldest time range' means, their documentation just says: "Example: 1234567890.123456"
- These functions are rate limited by slack, so you should ensure you have the proper account type and/or do not over query beyond what your workspace account allows.
