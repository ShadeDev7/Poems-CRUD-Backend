const mongoose = require("mongoose");

const poemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model("Poem", poemSchema);
