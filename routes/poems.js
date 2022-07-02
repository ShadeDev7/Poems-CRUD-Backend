const { Router } = require("express");
const { Types } = require("mongoose");

const poemSchema = require("../models/poem");
const { getPagination, trimAll } = require("../utils");

const router = new Router();

router.get("/", (req, res) => {
    const { quantity, page } = getPagination(req.query.quantity, req.query.page);
    const skips = quantity * (page - 1);

    poemSchema
        .find()
        .skip(skips)
        .limit(quantity)
        .then(async data => {
            const records = await poemSchema.countDocuments({}).exec();

            const poems = data.map(({ _id, title, author, content }) => ({
                id: _id,
                title,
                author,
                content,
            }));
            const previousPage = page <= 1 ? null : page - 1;
            const nextPage = quantity + skips < records ? page + 1 : null;

            res.status(200).json({ data: poems, previousPage, nextPage, status: 200 });
        })
        .catch(e => {
            console.error(e);

            res.status(500).json({ error: "There was an Internal Server Error.", status: 500 });
        });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid PoemId.", status: 400 });
    }

    poemSchema
        .findOne({ _id: id })
        .then(data => {
            if (!data) return res.status(404).json({ error: "Poem not found.", status: 404 });

            const poem = {
                id: data._id,
                title: data.title,
                author: data.author,
                content: data.content,
            };

            res.status(200).json({ data: poem, status: 200 });
        })
        .catch(e => {
            console.error(e);

            res.status(500).json({ error: "There was an Internal Server Error.", status: 500 });
        });
});

router.post("/", (req, res) => {
    const title = trimAll(req.body.title);
    const author = trimAll(req.body.author);
    const content = req.body.content;

    if (!title || !author || !content) {
        return res.status(400).json({ error: "Invalid Parameters.", status: 400 });
    }

    poemSchema
        .create({ title, author, content: content.split("\n").map(p => trimAll(p)) })
        .then(() => res.status(201).send())
        .catch(e => {
            console.error(e);

            res.status(500).json({ error: "There was an Internal Server Error.", status: 500 });
        });
});

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const title = trimAll(req.body.title);
    const author = trimAll(req.body.author);
    const content = req.body.content;

    if (!Types.ObjectId.isValid(id) || !title || !author || !content) {
        return res.status(400).json({ error: "Invalid Parameters.", status: 400 });
    }

    poemSchema
        .findOneAndUpdate({ title, author, content: content.split("\n").map(p => trimAll(p)) })
        .then(data => {
            if (!data) return res.status(404).json({ error: "Poem not found.", status: 404 });

            res.status(204).send();
        })
        .catch(e => {
            console.error(e);

            res.status(500).json({ error: "There was an Internal Server Error.", status: 500 });
        });
});

router.delete("/:id", (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid PoemId.", status: 400 });
    }

    poemSchema
        .deleteOne({ _id: id })
        .then(() => res.status(204).send())
        .catch(e => {
            console.error(e);

            res.status(500).json({ error: "There was an Internal Server Error.", status: 500 });
        });
});

module.exports = router;
