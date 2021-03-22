import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEWtLvr0WFvfPqz_AwWisDigILGyFqChk",
  authDomain: "web-rtc-call.firebaseapp.com",
  projectId: "web-rtc-call",
  storageBucket: "web-rtc-call.appspot.com",
  messagingSenderId: "506550453502",
  appId: "1:506550453502:web:1a738886d938451ab111af",
  measurementId: "G-9Q8ZT5QFZ6",
};

let instance = null;

const CALLS_COLLECTION = "calls";
const OFFER_CANDIDATES_COLLECTION = "offerCandidates";
const ANSWER_CANDIDATES_COLLECTION = "answerCandidates";

class Firebase {
  constructor() {
    if (instance) {
      return instance;
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.currentCallDoc = null;
    this.firestore = firebase.firestore();
    this._answerCandidatesCollection = null;
    this._offerCandidatesCollection = null;
    this.onCallDocumentChange = null;
    this.onNewAnswer = null;
    this.onNewOffer = null;

    instance = this;
  }

  setCallDocument(id) {
    if (id) {
      this.currentCallDoc = this.callsCollection.doc(id);
    } else {
      this.currentCallDoc = this.callsCollection.doc();
    }

    this._answerCandidatesCollection = this.currentCallDoc.collection(
      ANSWER_CANDIDATES_COLLECTION
    );
    this._offerCandidatesCollection = this.currentCallDoc.collection(
      OFFER_CANDIDATES_COLLECTION
    );
  }

  get callDocument() {
    return this.currentCallDoc;
  }

  get callsCollection() {
    return this.firestore.collection(CALLS_COLLECTION);
  }

  get offerCandidatesCollection() {
    return this._offerCandidatesCollection;
  }

  get answerCandidatesCollection() {
    return this._answerCandidatesCollection;
  }

  static getInstance() {
    return new Firebase();
  }
}

export { Firebase };
