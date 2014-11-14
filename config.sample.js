module.exports = {
    // namespace: use to separate different context executions
    namespace: "EDIT",
    twitter: {
        // add API keys here, see apps.twitter.com
        api_keys: {
            consumer_key: "EDIT",
            consumer_secret: "EDIT",
            access_token: "EDIT",
            access_token_secret: "EDIT"
        },
        // jukebox: the user that will accept music requests
        jukebox: "EDIT",
        // admins: allowed users to send DM commands to control player
        admins: ["EDIT"],
        // captureStrategy: only streaming supported, will support rest in the future
        capture_strategy: "streaming"
    },
    security: {
        token_verification_enabled: true
    }
}

