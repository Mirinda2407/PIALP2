document.addEventListener("DOMContentLoaded", function () {
    const formProyecto = document.getElementById("form-proyecto");
    const nombreProyectoInput = document.getElementById("nombreProyecto");
    const listaProyectos = document.getElementById("listaProyectos");

    let proyectos = JSON.parse(localStorage.getItem("proyectos")) || [];
    renderizarProyectos();

    formProyecto.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombreProyecto = nombreProyectoInput.value.trim();
        if (nombreProyecto === "") return;
        const nuevoProyecto = { nombre: nombreProyecto, tareas: [] };
        proyectos.push(nuevoProyecto);
        guardarProyectos();
        renderizarProyectos();
        nombreProyectoInput.value = "";
    });

    function guardarProyectos() {
        localStorage.setItem("proyectos", JSON.stringify(proyectos));
    }

    function renderizarProyectos() {
        listaProyectos.innerHTML = "";
        proyectos.forEach((proyecto, index) => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");

            const container = document.createElement("div");
            container.classList.add("d-flex", "justify-content-between", "align-items-center", "flex-wrap");

            const span = document.createElement("span");
            span.textContent = proyecto.nombre;
            span.classList.add("fw-bold", "me-auto");

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("d-flex", "flex-wrap", "gap-2");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("btn", "btn-warning", "btn-sm");
            btnEditar.addEventListener("click", function () {
                const nuevoNombre = prompt("Editar nombre del proyecto:", proyecto.nombre);
                if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
                    proyecto.nombre = nuevoNombre.trim();
                    guardarProyectos();
                    renderizarProyectos();
                }
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
            btnEliminar.addEventListener("click", function () {
                if (confirm("¿Estás seguro de eliminar este proyecto?")) {
                    proyectos.splice(index, 1);
                    guardarProyectos();
                    renderizarProyectos();
                }
            });

            const btnTareas = document.createElement("button");
            btnTareas.textContent = "Tareas";
            btnTareas.classList.add("btn", "btn-info", "btn-sm");
            btnTareas.addEventListener("click", function () {
                listaTareas.classList.toggle("d-none");
            });

            btnContainer.appendChild(btnTareas);
            btnContainer.appendChild(btnEditar);
            btnContainer.appendChild(btnEliminar);

            container.appendChild(span);
            container.appendChild(btnContainer);

            const listaTareas = document.createElement("ul");
            listaTareas.classList.add("list-group", "mt-2", "d-none");

            const formTarea = document.createElement("form");
            formTarea.classList.add("mt-2");

            const btnMostrarFormulario = document.createElement("button");
            btnMostrarFormulario.textContent = "Agregar Tarea";
            btnMostrarFormulario.type = "button";
            btnMostrarFormulario.classList.add("btn", "btn-outline-success", "btn-sm", "mb-2");

            const formularioDetalle = document.createElement("div");
            formularioDetalle.classList.add("d-none");

            const inputTarea = document.createElement("input");
            inputTarea.type = "text";
            inputTarea.placeholder = "Nueva tarea";
            inputTarea.classList.add("form-control", "mb-2");

            const inputFecha = document.createElement("input");
            inputFecha.type = "date";
            inputFecha.classList.add("form-control", "mb-2");

            const inputComentario = document.createElement("input");
            inputComentario.type = "text";
            inputComentario.placeholder = "Comentario (opcional)";
            inputComentario.classList.add("form-control", "mb-2");

            const selectPrioridad = document.createElement("select");
            ["Baja", "Media", "Alta"].forEach(p => {
                const option = document.createElement("option");
                option.value = p.toLowerCase();
                option.textContent = p;
                selectPrioridad.appendChild(option);
            });
            selectPrioridad.classList.add("form-select", "mb-2");

            const inputResponsable = document.createElement("input");
            inputResponsable.type = "text";
            inputResponsable.placeholder = "Responsable";
            inputResponsable.classList.add("form-control", "mb-2");

            const btnConfirmarTarea = document.createElement("button");
            btnConfirmarTarea.textContent = "Confirmar Tarea";
            btnConfirmarTarea.classList.add("btn", "btn-success", "btn-sm");

            formularioDetalle.appendChild(inputTarea);
            formularioDetalle.appendChild(inputFecha);
            formularioDetalle.appendChild(inputComentario);
            formularioDetalle.appendChild(selectPrioridad);
            formularioDetalle.appendChild(inputResponsable);
            formularioDetalle.appendChild(btnConfirmarTarea);

            btnMostrarFormulario.addEventListener("click", () => {
                formularioDetalle.classList.toggle("d-none");
            });

            btnConfirmarTarea.addEventListener("click", function (event) {
                event.preventDefault();
                const nuevaTarea = {
                    nombre: inputTarea.value.trim(),
                    completada: false,
                    fecha: inputFecha.value,
                    comentario: inputComentario.value.trim(),
                    prioridad: selectPrioridad.value,
                    responsable: inputResponsable.value.trim()
                };
                if (!nuevaTarea.nombre) return;
                proyecto.tareas.push(nuevaTarea);
                guardarProyectos();
                renderizarProyectos();
            });

            formTarea.appendChild(btnMostrarFormulario);
            formTarea.appendChild(formularioDetalle);

            proyecto.tareas.sort((a, b) => {
                const prioridades = { baja: 1, media: 2, alta: 3 };
                return prioridades[b.prioridad] - prioridades[a.prioridad];
            });

            proyecto.tareas.forEach((tarea, tareaIndex) => {
                const tareaItem = document.createElement("li");
                tareaItem.classList.add("list-group-item", "d-flex", "flex-column", "gap-2");

                const fila1 = document.createElement("div");
                fila1.classList.add("d-flex", "justify-content-between", "align-items-center");

                const tareaInfo = document.createElement("div");
                tareaInfo.classList.add("d-flex", "align-items-center", "flex-grow-1", "gap-2");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = tarea.completada;
                checkbox.addEventListener("change", function () {
                    tarea.completada = checkbox.checked;
                    guardarProyectos();
                    renderizarProyectos();
                });

                const tareaTexto = document.createElement("span");
                tareaTexto.textContent = tarea.nombre;
                if (tarea.completada) tareaTexto.classList.add("text-decoration-line-through");

                tareaInfo.appendChild(checkbox);
                tareaInfo.appendChild(tareaTexto);

                const btnEliminarTarea = document.createElement("button");
                btnEliminarTarea.textContent = "Eliminar";
                btnEliminarTarea.classList.add("btn", "btn-danger", "btn-sm");
                btnEliminarTarea.addEventListener("click", function () {
                    proyecto.tareas.splice(tareaIndex, 1);
                    guardarProyectos();
                    renderizarProyectos();
                });

                fila1.appendChild(tareaInfo);
                fila1.appendChild(btnEliminarTarea);

                const detalles = document.createElement("div");
                detalles.classList.add("small");
                detalles.innerHTML = `
                    Prioridad: <strong>${tarea.prioridad}</strong> | 
                    Responsable: <strong>${tarea.responsable}</strong> | 
                    Comentario: <em>${tarea.comentario}</em> | 
                    Vence: <strong>${tarea.fecha || "Sin fecha"}</strong>
                `;

                if (tarea.fecha && new Date(tarea.fecha) < new Date()) {
                    detalles.classList.add("text-danger");
                }

                tareaItem.appendChild(fila1);
                tareaItem.appendChild(detalles);
                listaTareas.appendChild(tareaItem);
            });

            li.appendChild(container);
            li.appendChild(formTarea);
            li.appendChild(listaTareas);
            listaProyectos.appendChild(li);
        });
    }
});
