'use strict';

const path = require('path');
const uuid = require('node-uuid');

module.exports = [
    {
        path: '/cover/upload',
        methods: {
            async post(req, res) {
                if (!req.files) {
                    res.status(400).json({ message: 'no files were uploaded.' });
                    return;
                }

                // The name of the input field ("coverFile") is used to retrieve the uploaded file
                const file = req.files.coverFile;
                if (file.truncated) {
                    res.json({ message: 'file size over limited.' });
                    return;
                }

                const newName = uuid.v4() + '.' + file.name.split('.').pop();
                const newPath = 'cover/' + newName; // this path for front-end to display
                file.mv(path.resolve('upload', newPath), function (err) {
                    if (err) {
                        res.status(500).json({ message: err });
                        return;
                    }
                    res.json({ coverPath: newPath });
                });
            }
        }
    }
];