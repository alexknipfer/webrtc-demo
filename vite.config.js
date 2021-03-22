const { resolve } = require("path");

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        answer: resolve(__dirname, "answer.html"),
        create: resolve(__dirname, "create.html"),
      },
    },
  },
};
