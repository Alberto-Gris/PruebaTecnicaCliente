import { useFetch,usePost } from "./useFetch";
import { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function App() {

    //var {data,loading} = useFetch("http://localhost:3000/usuarios/mostrarContactos");
    const [data,setData] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    //Datos de un nuevo usuario
    const [id,setId] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    useEffect(()=>{
        getData();
    },[]);

    const getData = async () => {
        const respuesta = await axios.get("http://localhost:3000/usuarios/mostrarContactos");
        setData(respuesta.data);
        //console.log(respuesta.data);
    };

    const muestra = (userId) => {
        //console.log(`Usuario con ID: ${userId}`);
        // Buscar el usuario por ID y obtener sus contactos
        const user = data.find(user => user._id === userId);
        //console.log(user.contacts);
        setContacts(user.contacts);
    };

    const openModal = (op,id,name,email,password) => {
        setName('');
        setEmail('');
        setPassword('');
        //setId('');
        setOperation(op);
        if (op === 1) {
            setTitle('Nuevo Usuario');
        }else if (op === 2) {
            setTitle('Editar Usuario');
            setName(name);
            setEmail(email);
            setPassword(password);
            setId(id);
        }
    };

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() !== '') {
            if (email.trim() !== '') {
                if (password.trim() !== '') {
                    if (operation === 1) {
                        parametros= {name:name.trim(), email:email.trim(), password:password.trim()};
                        metodo = 'POST';
                    }else{
                        parametros= {name:name.trim(), email:email.trim(), password:password.trim()};
                        metodo = 'PUT';
                    }
                    enviarSolicitud(metodo,parametros);
                }
            }
        }
        //console.log("No trunca");
    }

    const enviarSolicitud = async (metodo,parametros) => {
        if (operation === 1) {
            await axios({method:metodo,url: 'http://localhost:3000/usuarios/nuevoUsuario',data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrar').click();
            }).catch(function(error){
                console.log(error);
            });
        }else{
            await axios({method:metodo,url:'http://localhost:3000/usuarios/actualizar/'+id,data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrar').click();
            }).catch(function(error){
                console.log(error);
            });
        }
        getData();
        //data,loading = useFetch("http://localhost:3000/usuarios/mostrarContactos");
    }

    const enviarEliminacion = async (metodo,idL) => {
        await axios({method:metodo,url:'http://localhost:3000/usuarios/eliminar/'+idL,data:{}}).then(function(respuesta){
            //console.log(respuesta);
            document.getElementById('btnCerrar').click();
        }).catch(function(error){
            console.log(error);
        });
        getData();
    }

    const eliminarUsuario = (idL) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'Seguro de eliminar al usuario?',
            icon:'question',text:'Eliminacion permanente',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result)=>{
            if (result.isConfirmed) {
                //setId(id);
                console.log("Eliminado,",idL);
                enviarEliminacion('DELETE',idL);
            }else{
                //Alerta
            }
        })
    }

    return(
        
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-4">
                        <div className="d-grid mx-auto">
                            <button className="btn btn-dark" onClick={() => openModal(1)} data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario">
                                Nuevo Usuario <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-4">
                    <h1>Lista de Usuarios</h1>
                    <ul className="list-group" id="list-tab" role="tablist">
                        {data?.map((user)=>(
                        <li className="list-group-item list-group-item-action" onClick={() => muestra(user._id)} data-bs-toggle="list" role="tab" key={user.id}>{user.name} 
                        <button 
                        className="btn btn-success btn-sm float-end offset-1">
                        Nuevo Contacto <i className="bi bi-person-add"></i>
                        </button>
                        <button 
                        className="btn btn-sm float-end btn-danger  offset-1"
                        onClick={() => eliminarUsuario(user._id)}>
                        Eliminar <i className="bi bi-trash3"></i>
                        </button>
                        <button 
                        className="btn btn-sm float-end btn-warning" data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario"
                        onClick={() => openModal(2,user._id,user.name,user.email,user.password)}>
                        Editar <i className="bi bi-pencil-fill"></i>
                        </button>
                        </li>
                        ))}
                    </ul>
                </div>
                <div className="col-8">
                    <div className="tab-content" id="nav-tabContent">
                    <div>
                        <h1>Lista de Contactos</h1>
                        <ul className="list-group">
                            {contacts.length > 0 ? (
                            contacts.map(contact => (
                                <li className="list-group-item" key={contact._id}>
                                {contact.name} {contact.lastName} - {contact.email} - {contact.phoneNumber}
                                </li>
                            ))
                            ) : (
                            <li className="list-group-item">No hay contactos</li>
                            )}
                        </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modalNuevoUsuario" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                    </div>
                    <div className="modal-body">
                        <input type="hidden" id="nombre"></input>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Name" value={name}
                            onChange={(e)=>setName(e.target.value)}></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Email" value={email}
                            onChange={(e)=>setEmail(e.target.value)}></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-key-fill"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Password" value={password}
                            onChange={(e)=>setPassword(e.target.value)}></input>
                        </div>
                    </div>
                        <div className="modal-footer">
                            <button type="button" id="btnCerrar" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" onClick={() => validar()} className="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}