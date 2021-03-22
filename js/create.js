import { Firebase } from "./services/Firebase";
import { PeerConnection } from "./services/PeerConnection";
import { Stream } from "./services/Stream";

const callIdElement = document.getElementById("callId");

document.addEventListener("DOMContentLoaded", async () => {
  const peerConnection = PeerConnection.getInstance();
  const firebase = Firebase.getInstance();
  const streams = Stream.getInstance();

  await streams.requestStreams();

  streams.localStream.getTracks().forEach((track) => {
    peerConnection.addTracks(track, streams.localStream);
  });

  peerConnection.onTrack = (track) => {
    streams.remoteStream.addTrack(track);
  };

  peerConnection.onIceCandidate = (event) => {
    event.candidate &&
      firebase.offerCandidatesCollection.add(event.candidate.toJSON());
  };

  peerConnection.registerHandlers();

  webcamVideo.srcObject = streams.localStream;
  webcamVideo.muted = true;
  remoteVideo.srcObject = streams.remoteStream;

  firebase.setCallDocument();

  const createdOffer = await peerConnection.createOffer();

  const offer = {
    sdp: createdOffer.sdp,
    type: createdOffer.type,
  };

  await firebase.callDocument.set({ offer });

  firebase.callDocument.onSnapshot((snapshot) => {
    const data = snapshot.data();
    if (!peerConnection.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      peerConnection.setRemoteDescription(answerDescription);
    }
  });

  firebase.answerCandidatesCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        const candidate = new RTCIceCandidate(data);
        peerConnection.addICECandidate(candidate);
      }
    });
  });

  callIdElement.innerHTML = firebase.callDocument.id;
});
