const { Service } = require('feathers-sequelize');

const SRID = 4326;

exports.Spots = class Spots extends Service {
    async create(data) {
        data.area = setSRID(data.area, SRID);
        return super.create(data);
    }
    async patch(id, data) {
        console.log(data);
        if(data.area)
            data.area = setSRID(data.area, SRID);
        return super.patch(id, data);
    }
};

function setSRID(geometry, srid) {
    return {
        ...geometry,
        crs: {
            type: 'name',
            properties: { name: `EPSG:${srid}` },
        },
    };
}