'use strict';
const Sequelize = require('sequelize');
const uuid = require('node-uuid');
const config = require('./config');

function generateId() {
    return uuid.v4();
}

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.STRING(64);

function defineModel(name, attributes) {
    const attrs = {
        id: {
            type: ID_TYPE,
            primaryKey: true
        },
        createdAt: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        version: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
    };

    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }

    return sequelize.define(name, attrs, {
        tableName: name + 's',
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.createdAt = now;
                    obj.version = 0;
                } else {
                    console.log('will update entity...');
                    obj.version++;
                }
                obj.updatedAt = now;
            }
        }
    });
}

const exp = {
    defineModel: defineModel,
    sync: async () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ force: true });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    },
    ID: ID_TYPE,
    generateId,
};

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

module.exports = exp;