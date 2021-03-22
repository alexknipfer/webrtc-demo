export const createVideoElement = ({ id, className, srcObject, muted }) => {
  const el = document.createElement("video");

  if (id) {
    el.id = id;
  }

  if (className) {
    el.className = Array.isArray(className) ? className.join(" ") : className;
  }

  if (srcObject) {
    el.srcObject = srcObject;
  }

  if (muted) {
    el.muted = muted;
  }

  el.autoplay = true;
  el.playsInline = true;

  return el;
};

export const createDivEl = ({ id, className, content, background }) => {
  const el = document.createElement("div");

  if (id) {
    el.id = id;
  }

  if (className) {
    el.className = Array.isArray(className) ? className.join(" ") : className;
  }

  if (content) {
    el.innerHTML = content;
  }

  if (background) {
    el.style.backgroundImage = `url(${background})`;
  }

  return el;
};
