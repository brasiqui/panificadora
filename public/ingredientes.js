async function criarIngrediente() {
	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}

	const nome = document.getElementById("ingrediente-nome").value;
	const quantidade = parseFloat(
		document.getElementById("ingrediente-quantidade").value
	);
	const unidade = document.getElementById("ingrediente-unidade").value;

	let _data = {
		nome,
		quantidade,
		unidade,
	};

	try {
		let response = await fetch("http://localhost:3000/api/ingredientes", {
			method: "POST",
			body: JSON.stringify(_data),
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonIngredientes = await response.json();
		location.reload();
	} catch (error) {
		console.log(error);
	}
}

async function alterarIngrediente(id) {
	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}

	const nome = document.getElementById("ingrediente-nome").value;
	const quantidade = parseFloat(
		document.getElementById("ingrediente-quantidade").value
	);
	const unidade = document.getElementById("ingrediente-unidade").value;

	let _data = {
		nome,
		quantidade,
		unidade,
	};

	try {
		let response = await fetch(
			`http://localhost:3000/api/ingredientes/${id}`,
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
	try {
		let response = await fetch("http://localhost:3000/api/ingredientes", {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonIngredientes = await response.json();
		let trHTML = "";
		if (!jsonIngredientes.rows.length) {
			trHTML += "<tr>";
			trHTML += `<td colspan="4">Lista vazia</td>`;
			trHTML += "</tr>";
		}

		for (let ingrediente of jsonIngredientes.rows) {
			trHTML += "<tr>";
			trHTML += `<td class="z-ingrediente__nome">${ingrediente.nome}</td>`;
			trHTML += `<td class="z-ingrediente__quantidade">${ingrediente.quantidade}</td>`;
			trHTML += `<td class="z-ingrediente__unidade">${ingrediente.unidade}</td>`;
			trHTML += "<td>";
			trHTML += `<div class=" row z-ingrediente__actions">
      <i class="fa fa-edit z-modal__edit col" data-bs-toggle="modal" data-bs-target="#add" 
      onclick="editarIngrediente(${ingrediente.id})"></i>`;
			trHTML += `<i class="fa fa-trash-o z-modal__edit col" onclick="deletarIngrediente(${ingrediente.id})"></i></div>`;
			trHTML += "</td></tr>";
		}
		document.querySelector(".z-principal__tabela__linhas").innerHTML =
			trHTML;
	} catch (error) {
		console.log(error);
	}
}

async function deletarIngrediente(id) {
	try {
		let response = await fetch(
			`http://localhost:3000/api/ingredientes/${id}`,
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
			`http://localhost:3000/api/ingredientes/${id}`,
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
	document.querySelector("#ingrediente-nome").value = jsonIngrediente.nome;
	document.querySelector("#ingrediente-quantidade").value =
		jsonIngrediente.quantidade;
	document.querySelector("#ingrediente-unidade").value =
		jsonIngrediente.unidade;
	document.querySelector(
		".modal-footer"
	).innerHTML = `<button type="button" class="btn btn-secondary"
  data-bs-dismiss="modal">Cancelar</button>
  <button onclick="alterarIngrediente(${id})" type="submit"
  class="btn btn-primary">Alterar</button>`;
}
