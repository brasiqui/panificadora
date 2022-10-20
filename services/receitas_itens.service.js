"use strict";

const DbMixin = require("../mixins/db.mixin");
const Sequelize = require("sequelize");

module.exports = {
	name: "receitas_itens",

	/**
	 * Mixins
	 */
	mixins: [DbMixin("receitas_itens")],

	model: {
		name: "receitas_itens",
		define: {
			receita_id: Sequelize.INTEGER,
			ingrediente_id: Sequelize.INTEGER,
			quantidade: Sequelize.REAL,
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
		fields: ["id", "receita_id", "ingrediente_id", "quantidade"],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			receita_id: { type: "number", empty: false },
			ingrediente_id: { type: "number", empty: false },
			quantidade: { type: "number", positive: true },
		},

		populates: {
			receita_id: "receitas.get",
			ingrediente: {
				field: "ingrediente_id",
				action: "ingredientes.get",
				params: {
					fields: "nome",
				},
			},
		},
		pageSize: 10000,
	},

	hooks: {
		after: {
			list: [
				async function (ctx, res) {
					for (let ingrediente of res.rows) {
						ingrediente.ingrediente = await ctx.call(
							"ingredientes.get",
							{
								id: ingrediente.ingrediente_id,
								fields: ["nome", "quantidade", "unidade"],
							}
						);

						ingrediente.receita = await ctx.call("receitas.get", {
							id: ingrediente.receita_id,
							fields: ["nome"],
						});
					}

					return res;
				},
			],
		},
	},
};
