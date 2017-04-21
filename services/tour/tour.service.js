/**
 * Created by kira on 4/10/17.
 */

const db = require('../../helpers/db');
const co = require('Co');

var TourService = {

    selectHotTrip: function (pageSize) {
        return co(function *() {
            let hotTours = yield db.get().collection('tour').aggregate({$lookup: {
                from: "tour-detail",
                localField: "id",
                foreignField: "tour_id",
                as: "tour_details"
            }
            }).sort({bookNum: -1}).limit(pageSize);

            return Promise.resolve(hotTours);
        })
    }
};

module.exports = TourService;