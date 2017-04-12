/**
 * Created by kira on 3/18/17.
 */
'use strict';

var Paging = {
    calculatePageCount: function (totalItemCount, pageSize) {
        if (totalItemCount < 1) return -1;
        if (pageSize < 1) return -1;

        var totalPageCount = (totalItemCount + pageSize - 1) / pageSize;
        return totalPageCount;
    }
};

module.exports = Paging;