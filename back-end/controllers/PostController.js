import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags =
            posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить теги',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось получить статьи',
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await PostModel.findOneAndUpdate(
            {_id: postId},
            {$inc: {viewsCount: 1}},
            {new: true}
        );

        if (!post) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost =
            await PostModel.findOneAndDelete({_id: postId});

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }
        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
                _id: postId,
            }, {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
        );
        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error updating post',
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post)
    } catch (err) {
        res.status(500).json({
            message: 'Error creating post',
        })
    }
}
