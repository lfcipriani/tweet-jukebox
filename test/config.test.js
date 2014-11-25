module.exports = {
    // namespace: use to separate different context executions
    namespace: "twoffice",
    twitter: {
        // add API keys here, see apps.twitter.com
        api_keys: {
            consumer_key: "SKIP",
            consumer_secret: "SKIP",
            access_token: "SKIP",
            access_token_secret: "SKIP"
        },
        // jukebox: the user that will accept music requests
        jukebox: "testando_123",
        // admins: allowed users to send DM commands to control player
        admins: ["lfcipriani"],
        // captureStrategy: only streaming supported, will support rest in the future
        capture_strategy: "streaming",
        // for development purposes, avoid rate limiting
        deactivate_all_statuses_updates: false
    },
    security: {
        token_verification_enabled: true
    },
    commands: [
        { name: "search", enabled: true, post_reply_on_success: true, post_reply_on_error: false },
        { name: "link", enabled: false, post_reply_on_success: true, post_reply_on_error: false }
    ]
}

