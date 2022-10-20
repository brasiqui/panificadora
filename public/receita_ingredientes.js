let receitaIngredientes = {};
let disponibilidade;
async function criarIngredientes() {
	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}
	const ingrediente = document.getElementById("ingrediente");

	const quantidade = parseFloat(
		document.getElementById("ingrediente-quantidade").value
	);

	let _data = {
		receita_id: parseInt(
			ingrediente.options[ingrediente.selectedIndex].dataset.idreceita
		),
		ingrediente_id: parseInt(
			ingrediente.options[ingrediente.selectedIndex].dataset.id
		),
		quantidade,
	};

	try {
		let response = await fetch("http://localhost:3000/api/receitas_itens", {
			method: "POST",
			body: JSON.stringify(_data),
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonIngredientes = await response.json();
	} catch (error) {
		console.log(error);
	}
	location.reload();
}

async function alterarIngrediente(id) {
	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}

	const ingrediente = document.getElementById("ingrediente");

	const quantidade = parseFloat(
		document.getElementById("ingrediente-quantidade").value
	);

	let _data = {
		receita_id: parseInt(
			ingrediente.options[ingrediente.selectedIndex].dataset.idreceita
		),
		ingrediente_id: parseInt(
			ingrediente.options[ingrediente.selectedIndex].dataset.id
		),
		quantidade,
	};

	try {
		let response = await fetch(
			`http://localhost:3000/api/receitas_itens/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(_data),
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}
		);
		const jsonIngredientes = await response.json();
		location.reload();
	} catch (error) {
		console.log(error);
	}
}

async function listarIngredientes() {
	const url_string = window.location.href;
	const url = new URL(url_string);
	const idReceita = url.searchParams.get("id");

	try {
		let responseIngredientes = await fetch(
			`http://localhost:3000/api/ingredientes`,
			{
				method: "GET",
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}
		);
		const jsonListaIngredientes = await responseIngredientes.json();

		let responseReceita = await fetch(
			`http://localhost:3000/api/receitas/${idReceita}`,
			{
				method: "GET",
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}
		);
		const jsonReceita = await responseReceita.json();

		let response = await fetch("http://localhost:3000/api/receitas_itens", {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonIngredientes = await response.json();

		receitaIngredientes = jsonIngredientes.rows.filter((ingrediente) => {
			return ingrediente.receita_id == idReceita;
		});

		document.querySelector(".z-principal__titulo").textContent =
			jsonReceita.nome;

		document
			.querySelector(".z-principal__elaborar")
			.addEventListener("click", elaborarReceita);

		let trHTML = "";
		if (!receitaIngredientes.length) {
			trHTML += "<tr>";
			trHTML += `<td colspan="5">Lista vazia</td>`;
			trHTML += "</tr>";
		}

		for (let ingrediente of receitaIngredientes) {
			disponibilidade =
				ingrediente.ingrediente.quantidade - ingrediente.quantidade >= 0
					? '<i class="fa fa-check-circle"></i>'
					: '<i class="fa fa-times-circle"></i>';

			trHTML += "<tr>";
			trHTML += `<td class="z-ingrediente__nome">${ingrediente.ingrediente.nome}</td>`;
			trHTML += `<td class="z-ingrediente__quantidade">${ingrediente.quantidade}</td>`;
			trHTML += `<td class="z-ingrediente__unidade">${ingrediente.ingrediente.unidade}</td>`;
			trHTML += `<td class="z-ingrediente__disponibilidade">${disponibilidade}</td>`;
			trHTML += "<td>";
			trHTML += `<div class=" row z-ingrediente__actions">
      <i class="fa fa-edit z-modal__edit col" data-bs-toggle="modal" data-bs-target="#add" 
      onclick="editarIngrediente(${ingrediente.id})"></i>`;
			trHTML += `<i class="fa fa-trash-o z-modal__edit col" onclick="deletarIngrediente(${ingrediente.id})"></i></div>`;
			trHTML += "</td></tr>";
		}
		document.querySelector(".z-principal__tabela__linhas").innerHTML =
			trHTML;

		// Preenchendo opções do Modal para listar os ingredientes
		let optionsIngredientes =
			"<option value=''>Escolha um ingrediente...</option>";
		for (let optIngrediente of jsonListaIngredientes.rows) {
			optionsIngredientes += `<option value="${optIngrediente.id}" 
			data-idreceita="${idReceita}"
			data-id="${optIngrediente.id}" 
			data-nome="${optIngrediente.nome}"
			data-unidade="${optIngrediente.unidade}">${optIngrediente.nome}</option>`;
		}
		document.querySelector("#ingrediente").innerHTML = optionsIngredientes;
	} catch (error) {
		console.log(error);
	}
}

async function deletarIngrediente(id) {
	try {
		let response = await fetch(
			`http://localhost:3000/api/receitas_itens/${id}`,
			{
				method: "DELETE",
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}
		);
		const jsonIngrediente = await response.json();
		location.reload();
	} catch (error) {
		console.log(error);
	}
}

async function editarIngrediente(id) {
	let jsonIngrediente = {};
	try {
		let response = await fetch(
			`http://localhost:3000/api/receitas_itens/${id}`,
			{
				method: "GET",
				headers: { "Content-type": "application/json; charset=UTF-8" },
			}
		);
		jsonIngrediente = await response.json();
	} catch (error) {
		console.log(error);
	}

	document.querySelector("#modalLabel").innerHTML = "Editar Ingrediente";
	const ingrediente = document.querySelector("#ingrediente");
	ingrediente.value = jsonIngrediente.ingrediente_id;
	document.querySelector("#ingrediente-quantidade").value =
		jsonIngrediente.quantidade;
	let unidade = document.getElementById("ingrediente-unidade");
	unidade.value =
		ingrediente.options[ingrediente.selectedIndex].dataset.unidade;

	document.querySelector(
		".modal-footer"
	).innerHTML = `<button type="button" class="btn btn-secondary"
  data-bs-dismiss="modal">Cancelar</button>
  <button onclick="alterarIngrediente(${id})" type="submit"
  class="btn btn-primary">Alterar</button>`;
}

function changeIngredienteoptions(dados) {
	let unidade = document.getElementById("ingrediente-unidade");
	unidade.value = dados.options[dados.selectedIndex].dataset.unidade;
}

function elaborarReceita(e) {
	for (let ingrediente of receitaIngredientes) {
		if (ingrediente.ingrediente.quantidade - ingrediente.quantidade < 0) {
			swal({
				text: "Ingredientes indisponíveis!",
				icon: "warning",
				button: "Ok",
			});
			return;
		}
	}

	swal({
		title: "Atualização de estoque",
		text: "Os ingredientes da receita serão atualizados no estoque!",
		icon: "warning",
		buttons: ["Cancelar", "Confirmar"],
		dangerMode: true,
	}).then((confirmado) => {
		if (confirmado) {
			atualizaIngredientes(receitaIngredientes);
		} else {
			swal("Cancelado!");
		}
	});
}

async function atualizaIngredientes(ingredientes) {
	for (let ingrediente of ingredientes) {
		let _data = {
			id: ingrediente.ingrediente_id,
			quantidade:
				ingrediente.ingrediente.quantidade - ingrediente.quantidade,
		};

		try {
			let response = await fetch(
				`http://localhost:3000/api/ingredientes/${ingrediente.ingrediente_id}`,
				{
					method: "PUT",
					body: JSON.stringify(_data),
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				}
			);
			const jsonIngredientes = await response.json();
			swal({
				text: "Estoque atualizado!",
				icon: "success",
				button: "Ok",
			}).then(()=> {window.location.href = "/receitas.html"})
		} catch (error) {
			console.log(error);
		}
	}
}
