'use strict';

const fileUpload = require('express-fileupload');
const path = require('path');
const uuid = require('node-uuid');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5M

module.exports = [
    {
        path: '/cover/upload',
        preproc: fileUpload({
            limits: { fileSize: MAX_FILE_SIZE },
            abortOnLimit: true,
        }),
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

                const newName = uuid.v4() + '.' + coverFile.split('.').pop();
                const newPath = 'img/cover/' + newName; // this path for front-end to display
                file.mv(path.resolve('webapp/app/', newPath), function (err) {
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