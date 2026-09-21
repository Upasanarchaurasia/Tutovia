import React, { useEffect, useRef, useState } from 'react';

export default function YoutubeAudio({ videoId, playing, volume }) {
  const playerRef = useRef(null);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else {
      setApiReady(true);
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    if (!apiReady) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-audio-player', {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: playing ? 1 : 0,
          controls: 0,
          loop: 1,
          playlist: videoId, // Required for loop to work
        },
        events: {
          onReady: (event) => {
            try {
              event.target.setVolume(volume * 100);
              if (playing) {
                event.target.playVideo();
              }
            } catch (e) {}
          }
        }
      });
    } else {
      if (playing) {
        try {
          const currentVideoData = typeof playerRef.current.getVideoData === 'function' ? playerRef.current.getVideoData() : null;
          if (currentVideoData && currentVideoData.video_id !== videoId) {
            if (typeof playerRef.current.loadVideoById === 'function') {
              playerRef.current.loadVideoById({
                videoId: videoId,
                startSeconds: 0
              });
              if (typeof playerRef.current.setLoop === 'function') {
                playerRef.current.setLoop(true);
              }
            }
          } else {
            if (typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          }
        } catch (e) {}
      } else {
        try {
          if (typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        } catch (e) {}
      }
    }
  }, [apiReady, playing, videoId]);

  useEffect(() => {
    if (playerRef.current && playerRef.current.setVolume && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(volume * 100);
      } catch (e) {}
    }
  }, [volume]);

  return <div id="youtube-audio-player" style={{ display: 'none' }}></div>;
}
