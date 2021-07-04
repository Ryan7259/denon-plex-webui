const eventTypes = {
    nowPlayingProgress: 'event/player_now_playing_progress', //"message": "pid=player_id&cur_pos=position_ms&duration=duration_ms"
    nowPlayingChanged: 'event/player_now_playing_changed',
    queueChanged: 'event/player_queue_changed',
    playbackError:'event/player_playback_error',
    playerStateChanged: 'event/player_state_changed',
    shuffleModeChanged: 'event/shuffle_mode_changed',
    repeatModeChanged: 'event/repeat_mode_changed',
    volumeChanged: 'event/player_volume_changed',
    sourcesChanged: 'event/sources_changed'
}

export default eventTypes