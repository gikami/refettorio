class Pagination {
    async get(table, where, page, limit) {
        let count = await table.count({ where })
        let pageCount = Math.ceil(count / limit) > 0 ? Math.ceil(count / limit) : 1
        let prevPage = page - 1
        let nextPage = page + 1
        return {
            prevPage: prevPage > 0 ? prevPage : 0,
            initialPage: page,
            nextPage: nextPage < pageCount ? nextPage : 0,
            pageCount,
            allCount: count,
        }
    }
}
module.exports = new Pagination()
