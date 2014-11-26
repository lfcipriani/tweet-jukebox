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
        // for development purposes, avoid rate limiting
        deactivate_all_statuses_updates: false
    },
    music: {
        now_playing_tweets_enabled: true
    },
    commands: [
        { name: "search", enabled: true, post_reply_on_success: true, post_reply_on_error: false },
        { name: "link", enabled: true, post_reply_on_success: true, post_reply_on_error: false },
        { name: "play", enabled: true, post_reply_on_success: false, post_reply_on_error: false },
        { name: "pause", enabled: true, post_reply_on_success: false, post_reply_on_error: false },
        { name: "next", enabled: true, post_reply_on_success: false, post_reply_on_error: false },
        { name: "clear", enabled: true, post_reply_on_success: false, post_reply_on_error: false }
    ]
}

