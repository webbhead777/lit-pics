module.exports = {
    participants: [
        {
            name: 'Jake',
            number: '+16365417482',
            karma: 0
        },
        {
            name: 'Kristin',
            number: '+16362889661',
            karma: 0
        }
    ],
    port: process.env.PORT || 2287,
    preferences: {
        alertTime: '0 19 * * *',
        timezone: 'America/Chicago'
    },
    twilio: {
        number: '+14159802287',
        accountSid: 'AC16cebe64c9a58aacc51d88da0b269be5',
        authToken: '2b41be35198f334437cb3a5c80bd0b75'
    }
}
