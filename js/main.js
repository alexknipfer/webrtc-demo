// import "./style.css";

// import firebase from "firebase/app";
// import "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDEWtLvr0WFvfPqz_AwWisDigILGyFqChk",
//   authDomain: "web-rtc-call.firebaseapp.com",
//   projectId: "web-rtc-call",
//   storageBucket: "web-rtc-call.appspot.com",
//   messagingSenderId: "506550453502",
//   appId: "1:506550453502:web:1a738886d938451ab111af",
//   measurementId: "G-9Q8ZT5QFZ6",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// const firestore = firebase.firestore();

// const servers = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// let pc = new RTCPeerConnection(servers);
// let localStream = null;
// let remoteStream = null;

// const webcamButton = document.getElementById("webcamButton");
// const webcamVideo = document.getElementById("webcamVideo");
// const callButton = document.getElementById("callButton");
// const callInput = document.getElementById("callInput");
// const answerButton = document.getElementById("answerButton");
// const remoteVideo = document.getElementById("remoteVideo");
// const hangupButton = document.getElementById("hangupButton");

// webcamButton.onclick = async () => {
//   localStream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   remoteStream = new MediaStream();

//   localStream.getTracks().forEach((track) => {
//     pc.addTrack(track, localStream);
//   });

//   pc.ontrack = (event) => {
//     event.streams[0].getTracks().forEach((track) => {
//       remoteStream.addTrack(track);
//     });
//   };

//   webcamVideo.srcObject = localStream;
//   webcamVideo.muted = true;
//   remoteVideo.srcObject = remoteStream;

//   callButton.disabled = false;
//   answerButton.disabled = false;
//   webcamButton.disabled = false;
// };

// callButton.onclick = async () => {
//   const callDocument = firestore.collection("calls").doc();
//   const offerCandidates = callDocument.collection("offerCandidates");
//   const answerCandidates = callDocument.collection("answerCandidates");

//   callInput.value = callDocument.id;

//   pc.onicecandidate = (event) => {
//     event.candidate && offerCandidates.add(event.candidate.toJSON());
//   };

//   const offerDescription = await pc.createOffer();
//   await pc.setLocalDescription(offerDescription);

//   const offer = {
//     sdp: offerDescription.sdp,
//     type: offerDescription.type,
//   };

//   await callDocument.set({ offer });

//   callDocument.onSnapshot((snapshot) => {
//     const data = snapshot.data();
//     if (!pc.currentRemoteDescription && data?.answer) {
//       const answerDescription = new RTCSessionDescription(data.answer);
//       pc.setRemoteDescription(answerDescription);
//     }
//   });

//   answerCandidates.onSnapshot((snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         const candidate = new RTCIceCandidate(change.doc.data());
//         pc.addIceCandidate(candidate);
//       }
//     });
//   });

//   hangupButton.disabled = false;
// };

// answerButton.onclick = async () => {
//   const callId = callInput.value;
//   const callDocument = firestore.collection("calls").doc(callId);
//   const answerCandidates = callDocument.collection("answerCandidates");
//   const offerCandidates = callDocument.collection("offerCandidates");

//   pc.onicecandidate = (event) => {
//     event.candidate && answerCandidates.add(event.candidate.toJSON());
//   };

//   const callData = (await callDocument.get()).data();
//   const offerDescription = callData.offer;
//   await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//   const answerDescription = await pc.createAnswer();
//   await pc.setLocalDescription(answerDescription);

//   const answer = {
//     type: answerDescription.type,
//     sdp: answerDescription.sdp,
//   };

//   await callDocument.update({ answer });

//   offerCandidates.onSnapshot((snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         const data = change.doc.data();
//         pc.addIceCandidate(new RTCIceCandidate(data));
//       }
//     });
//   });
// };
