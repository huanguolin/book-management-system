import ajax from 'axios';

export default {
    async getBooks ({pageIndex = 1, pageSize = 5}) {      
        const params = {
            page: pageIndex, 
            page_size: pageSize,
        };
        const res = await ajax.get('/api/books', { params });
        return res.data;
    }, 
    
    async getBook (id) {  
        const res = await ajax.get('/api/book/' + id);
        return res.data;
    },

    async addBook (book) {
        const res = await ajax.post('/api/book', book);
        return res.data;
    },

    async updateBook (book) {
        const res = await ajax.patch('/api/book/' + book.id, book);
        return res.data;
    },

    async removeBook (id) {
        const res = await ajax.delete('/api/book/' + id);
        return res.data;
    },

    async uploadCover (file) {
        const formData = new FormData();
        formData.append('coverFile', file);
        const res = await ajax.post('/api/cover/upload', formData);
        return res.data;
    },
};