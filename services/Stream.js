let instance = null;

class Stream {
  constructor() {
    if (instance) {
      return instance;
    }

    this.localMediaStream = null;
    this.remoteMediaStream = null;

    instance = this;
  }

  async requestStreams() {
    const localMedia = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    this.localStream = localMedia;
    this.remoteStream = new MediaStream();
  }

  set localStream(media) {
    this.localMediaStream = media;
  }

  set remoteStream(media) {
    this.remoteMediaStream = media;
  }

  get remoteStream() {
    return this.remoteMediaStream;
  }

  get localStream() {
    return this.localMediaStream;
  }

  static getInstance() {
    return new Stream();
  }
}

export { Stream };
