if (process.env.Node_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb://rishav:rishav21@ds115553.mlab.com:15553/video-idea-prod"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/videojoy" };
}
