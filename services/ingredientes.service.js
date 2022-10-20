"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "ingredientes",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("ingredientes")],

	model: {
		name: "ingredientes",
		define: {
			nome: Sequelize.STRING(255),
			quantidade: Sequelize.REAL,
			unidade: Sequelize.STRING(100),
		},
		timestamps: false,
		options: {
			// Options from https://sequelize.org/docs/v6/moved/models-definition/
			timestamps: false,
		},
	},

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: ["id", "nome", "quantidade", "unidade"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			nome: "string|min:3|max:255",
			quantidade: "number|positive",
			unidade: "string|min:2|max:100",
		},

		pageSize: 10000,
	}
};
