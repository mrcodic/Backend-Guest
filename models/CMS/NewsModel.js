const mongoose = require("mongoose");

const NewsPostSchema = new mongoose.Schema({
      image: String,
      title: String,
      content: String,
      link: String,
});

const NewsSchema = new mongoose.Schema({
      header: {
            image: {
                  type: String,
                  default: null,
            },
            label: {
                  type: String,
                  default: null,
            },
            labelAr: {
                  type: String,
                  default: null,
            },
      },
      news: [{ type: mongoose.Schema.ObjectId, ref: "NewsPost" }],
});

const NewsPost = mongoose.model("NewsPost", NewsPostSchema);
const News = mongoose.model("News", NewsSchema);

module.exports = {
      NewsPost,
      News,
};
