module.exports = function(RED) {
    'use strict';
    const mustache = require('mustache');
    // const PgPool = require('pg').Pool;
    const {Pool} = require('pg');
    let pgPool = null;

    /**
     * Define the postgres db node, and override Pool class
     * @param {Object} n
     * @constructor
     */
    function PostgresDBNode(n) {
        try {
            const node = this;

            // Check and assign PG credentials
            if (node.credentials) {
                const {user, password} = node.credentials;
                if (!user) {
                    node.error(new Error('No PG user provided'), n);
                } else if (user === '') {
                    node.error(new Error('PG user is empty string'), n);
                }

                if (!password) {
                    node.error(new Error('No Pg password provided'), n);
                } else if (password === '') {
                    node.error(new Error('PG password is empty string'), n);
                }

                node.user = user;
                node.password = password;
            }

            // Assign PG properties
            node.ssl = n.ssl;
            node.max = n.max;
            node.min = n.min;
            node.name = n.name;
            node.host = n.host;
            node.port = n.port;
            node.idle = n.idle;
            node.database = n.database;

            // Create the pgPool if none exist
            if (!pgPool) {
                pgPool = new Pool({
                    user: node.user,
                    password: node.password,
                    host: node.host,
                    port: node.port,
                    database: node.database,
                    ssl: node.ssl,
                    max: node.max,
                    min: node.min,
                    idleTimeoutMillis: node.idle
                });
            }
        } catch (error) {
            node.error(error, n);
        }


        // let poolInstance = null;
        // const node = this;

        // RED.nodes.createNode(this, n);

        // node.name = n.name;
        // node.host = n.host;
        // node.port = n.port;
        // node.database = n.database;
        // node.ssl = n.ssl;

        // if (node.credentials) {
        //  node.user = node.credentials.user;
        //  node.password = node.credentials.password;
        // }

        // class Pool extends PgPool {
        //  constructor() {
        //    if (!poolInstance) {
        //      super({
        //        user: node.user,
        //        password: node.password,
        //        host: node.host,
        //        port: node.port,
        //        database: node.database,
        //        ssl: node.ssl,
        //        max: node.max,
        //        min: node.min,
        //        idleTimeoutMillis: node.idle
        //      });
        //      poolInstance = this;
        //    }
        //    return poolInstance;
        //  }
        // }
        // pgPool = new Pool();
    }

    /**
     * Register the postgres DB Node
     */
    RED.nodes.registerType('postgresDB', PostgresDBNode, {
        credentials: {
            user: {type: 'text'},
            password: {type: 'password'}
        }
    });

    /**
     * Define the postgrestor query node
     * @param {Object} config
     * @constructor
     */
    function PostgrestorNode(config) {
        const node = this;

        RED.nodes.createNode(node, config);
        node.topic = config.topic;
        node.config = RED.nodes.getNode(config.postgresDB);

        node.on('input', async function(msg) {
            let client;
            try {
                const template = {
                    msg: msg
                };
                client = await pgPool.connect();
                msg.payload = await client.query(mustache.render(config.query, template));
                node.send(msg);
                client.release();
            } catch (error) {
                node.error(error, msg);
                if (client) client.release();
            }
        });

        node.on('close', function() {
            node.status({});
        });
    }

    /**
     * Register the postgrestor query node
     */
    RED.nodes.registerType('postgrestor', PostgrestorNode);
};
