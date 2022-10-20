"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "receitas",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("receitas")],

	model: {
		name: "receitas",
		define: {
			nome: Sequelize.TEXT,
		},

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
		fields: ["id", "nome"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			nome: "string|min:3",
		},
		pageSize: 10000,
	},
};
