import { Firebase } from "./services/Firebase";
import { PeerConnection } from "./services/PeerConnection";
import { Stream } from "./services/Stream";
import { createVideoElement } from "./utils";

const videoContainer = document.getElementById("videoContainer");
const answerButton = document.getElementById("answerCall");
const callInput = document.getElementById("callId");

answerButton.onclick = async () => {
  const peerConnection = PeerConnection.getInstance();
  const firebase = Firebase.getInstance();
  const streams = Stream.getInstance();

  const callId = callInput.value;

  await streams.requestStreams();

  const webcamVideoEle = createVideoElement({
    id: "webcamVideo",
    srcObject: streams.localStream,
    muted: true,
  });
  const remoteVideoEle = createVideoElement({
    id: "remoteVideo",
    srcObject: streams.remoteStream,
  });

  videoContainer.appendChild(webcamVideoEle);
  videoContainer.appendChild(remoteVideoEle);

  streams.localStream.getTracks().forEach((track) => {
    peerConnection.addTracks(track, streams.localStream);
  });

  peerConnection.onTrack = (track) => {
    streams.remoteStream.addTrack(track);
  };

  peerConnection.onIceCandidate = (event) => {
    event.candidate &&
      firebase.answerCandidatesCollection.add(event.candidate.toJSON());
  };

  peerConnection.registerHandlers();

  firebase.setCallDocument(callId);
  const callDoc = await firebase.callDocument.get();
  const offerDescription = callDoc.data().offer;
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(offerDescription)
  );
  const answerDescription = await peerConnection.createAnswer();

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await firebase.callDocument.update({ answer });

  firebase.offerCandidatesCollection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const data = change.doc.data();
        peerConnection.addICECandidate(new RTCIceCandidate(data));
      }
    });
  });
};
