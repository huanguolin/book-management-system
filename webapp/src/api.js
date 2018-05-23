import ajax from 'axios';

export default {
    async getBooks (query) {
        const PAGE = 1;
        const PAGE_SIZE = 10;        
        const params = {
            page: query && query.page || PAGE, 
            page_size: query && query.pageSize || PAGE_SIZE,
        };
        const res = await ajax.get('/api/books', { params });
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
}