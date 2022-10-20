async function criarReceita() {
	const nome = document.getElementById("receita-nome").value;

	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}

	let _data = {
		nome,
	};

	try {
		let response = await fetch("http://localhost:3000/api/receitas", {
			method: "POST",
			body: JSON.stringify(_data),
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonReceitas = await response.json();
		location.reload();
	} catch (error) {
		console.log(error);
	}
}

async function alterarReceita(id) {
	const nome = document.getElementById("receita-nome").value;

	const formulario = document.getElementById("form-modal");
	if (formulario.checkValidity() === false) {
		return;
	}

	let _data = {
		nome,
	};

	try {
		let response = await fetch(`http://localhost:3000/api/receitas/${id}`, {
			method: "PUT",
			body: JSON.stringify(_data),
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonReceitas = await response.json();
		location.reload();
	} catch (error) {
		console.log(error);
	}
}

async function listarReceitas() {
	try {
		let response = await fetch("http://localhost:3000/api/receitas", {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonReceitas = await response.json();
		let trHTML = "";
		if (!jsonReceitas.rows.length) {
			trHTML += "<tr>";
			trHTML += `<td colspan="4">Lista vazia</td>`;
			trHTML += "</tr>";
		}

		for (let receita of jsonReceitas.rows) {
			let response = await fetch(
				"http://localhost:3000/api/receitas_itens",
				{
					method: "GET",
					headers: {
						"Content-type": "application/json; charset=UTF-8",
					},
				}
			);

			const jsonIngredientes = await response.json();

			const receitaIngredientes = jsonIngredientes.rows.filter(
				(ingrediente) => {
					return ingrediente.receita_id == receita.id;
				}
			);
			let disponibilidade = '<i class="fa fa-check-circle"></i>';
			for (let ingrediente of receitaIngredientes) {
				if (
					ingrediente.ingrediente.quantidade -
						ingrediente.quantidade <
					0
				) {
					disponibilidade = '<i class="fa fa-times-circle"></i>';
				}
			}

			trHTML += "<tr>";
			trHTML += `<td class="z-receita__nome">${receita.nome}</td>`;
			trHTML += `<td class="z-receita__ingredientes"><a href="receita_ingredientes.html?id=${receita.id}"><i class="fa fa-bars"></i></a></td>`;
			trHTML += `<td class="z-receita__disponibilidade">${
				disponibilidade || 0
			}</td>`;
			trHTML += "<td>";
			trHTML += `<div class=" row z-receita__actions">
      <i class="fa fa-edit z-modal__edit col" data-bs-toggle="modal" data-bs-target="#add" 
      onclick="editarReceita(${receita.id})"></i>`;
			trHTML += `<i class="fa fa-trash-o z-modal__edit col" onclick="deletarReceita(${receita.id})"></i></div>`;
			trHTML += "</td></tr>";
		}
		document.querySelector(".z-principal__tabela__linhas").innerHTML =
			trHTML;
	} catch (error) {
		console.log(error);
	}
}

async function deletarReceita(id) {
	let response;
	try {
		response = await fetch(`http://localhost:3000/api/receitas/${id}`, {
			method: "DELETE",
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		const jsonReceita = await response.json();

		if (response.status == 500) {
			await swal({
				title: "Erro!",
				text: jsonReceita.name,
				icon: "error",
				button: "Ok",
			}).then(() => {
				location.reload();
			});
		} else {
			location.reload();
		}
		
	} catch (error) {
		swal(error.message);
	}
}

async function editarReceita(id) {
	let jsonReceita = {};
	try {
		let response = await fetch(`http://localhost:3000/api/receitas/${id}`, {
			method: "GET",
			headers: { "Content-type": "application/json; charset=UTF-8" },
		});
		jsonReceita = await response.json();
	} catch (error) {
		console.log(error);
	}

	document.querySelector("#modalLabel").innerHTML = "Editar Receita";
	document.querySelector("#receita-nome").value = jsonReceita.nome;
	document.querySelector(
		".modal-footer"
	).innerHTML = `<button type="button" class="btn btn-secondary"
  data-bs-dismiss="modal">Cancelar</button>
  <button onclick="alterarReceita(${id})" type="submit"
  class="btn btn-primary">Alterar</button>`;
}
