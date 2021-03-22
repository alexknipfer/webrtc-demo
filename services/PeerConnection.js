let instance = null;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

class PeerConnection {
  constructor() {
    if (instance) {
      return instance;
    }

    this.peerConnection = new RTCPeerConnection(servers);
    this.onIceCandidate = null;
    this.onTrack = null;

    instance = this;
  }

  async createOffer() {
    const offerDescription = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offerDescription);

    return offerDescription;
  }

  async createAnswer() {
    const answerDescription = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answerDescription);

    return answerDescription;
  }

  addICECandidate(iceCandidate) {
    return this.peerConnection.addIceCandidate(iceCandidate);
  }

  setRemoteDescription(rtcSessionDescription) {
    return this.peerConnection.setRemoteDescription(rtcSessionDescription);
  }

  addTracks(track, stream) {
    this.peerConnection.addTrack(track, stream);
  }

  get currentRemoteDescription() {
    return this.peerConnection.currentRemoteDescription;
  }

  registerHandlers() {
    this.peerConnection.onicecandidate = (event) => {
      if (this.onIceCandidate) {
        this.onIceCandidate(event);
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (this.onTrack) {
        event.streams[0].getTracks().forEach((track) => {
          this.onTrack(track);
        });
      }
    };
  }

  static getInstance() {
    return new PeerConnection();
  }
}

export { PeerConnection };
