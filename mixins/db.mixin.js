"use strict";

const fs = require("fs");
const DbService = require("moleculer-db");

module.exports = function (collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema = {
		mixins: [DbService],

		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			},
		},

		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {any} json
			 * @param {Context} ctx
			 */
			async entityChanged(type, json, ctx) {
				ctx.broadcast(cacheCleanEventName);
			},
		},
	};

	if (process.env.SQLITE) {
		// Mongo adapter
		const SqlAdapter = require("moleculer-db-adapter-sequelize");

		schema.adapter = new SqlAdapter({
			storage: "data/dacruz.db",
			dialect: "sqlite",
		});
		schema.collection = collection;
	} else {
		this.broker.error("Sem banco!");
		// NeDB file DB adapter
	}

	return schema;
};
