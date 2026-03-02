//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;

//Eventos 
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGastos)
}


//Classes
class Presupuesto{
    constructor (presupuesto ){
        this.presupuesto = Number(presupuesto),
        this.restante = Number(presupuesto),
        this.gastos = []
    }
    //Añade un nuevo gasto 
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto)=> total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        console.log(gastado)
    }
}

class UI{
    inserPresupuesto (cantidad){
        //Extrayendo valores con el destructor
        const {presupuesto, restante} = cantidad;
        //Se muestra en el HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success')
        }


        divMensaje.textContent=mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
    agregarGastoListado(gastos){
        const nuevoGasto = document.createElement('li');
        gastos.forEach(gasto => {

            const {cantidad, nombre, id} = gasto;

            //Crear LI
            
            nuevoGasto.className= 'list-group-item d-flex justify-content-between aling-items-center';

            //Estos dos de abajo son lo mismo, la primer forma es mas vieja
            //nuevoGasto.setAttribute('data-it', id);
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> 
            ${cantidad} </span>`;

            //Boton para borrar el gasto 
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML= 'Borrar &times'
            nuevoGasto.appendChild(btnBorrar);

            //Agregar el html
            gastoListado.appendChild(nuevoGasto)

        });
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
}

//Instaciar UI
const ui = new UI();

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cuál es tú presupuesto?');
    if(presupuestoUsuario==='' || presupuestoUsuario===null || isNaN(presupuestoUsuario) 
            || presupuestoUsuario <= 0){
        window.location.reload();

    }
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.inserPresupuesto(presupuesto);
}

function agregarGastos(e){
    e.preventDefault();
    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);

    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if(isNaN(cantidad) || cantidad<=0){
        ui.imprimirAlerta('Cantidad no Valida', 'error');
        return;
    }


    //Generar un objeto con el gasto 
    //Object literal (al reves que el distructor)
    const gasto = {nombre, cantidad, id: Date.now()};
    //Date now es una forma sencilla de crear un id únici

    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado correctamente', 'correcto');

    const {gastos, restante} = presupuesto;
    //Imprimir los gastos 
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    formulario.reset();
}