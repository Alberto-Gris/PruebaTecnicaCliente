import { useState,useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { show_alert } from "./funtions";

export function App() {

    const url = 'http://3.141.51.166';

    const [idGlobal,setIdGlobal] = useState('');

    const [data,setData] = useState([]);
    const [contacts, setContacts] = useState([]);

    const [title,setTitle] = useState('');
    const [operation,setOperation] = useState(1);

    //Datos de un nuevo usuario
    const [id,setId] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    //Datos de un nuevo Contacto
    const [idC,setIdC] = useState('');
    const [nameC,setNameC] = useState('');
    const [lastName,setLastName] = useState('');
    const [emailC,setEmailC] = useState('');
    const [phoneNumber,setPhoneNumber] = useState('');

    useEffect(()=>{
        getData();
    },[]);

    const getData = async () => {
        const respuesta = await axios.get(url+"/usuarios/mostrarContactos");
        setData(respuesta.data);
        //console.log(respuesta.data);
    };

    const getDataNueva = async (userId) => {
        const respuesta = await axios.get(url+"/usuarios/mostrarContactos");
        //setData(respuesta.data);
        //console.log(data);
        const user = respuesta.data.find(user => user._id === userId);
        console.log(user.contacts);
        setContacts(user.contacts);
    };

    const muestra = (userId) => {
        setIdGlobal(userId);
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

    const openModalContact = (op,idC,name,lastName,email,phoneNumber) => {
        setNameC('');
        setLastName('');
        setEmailC('');
        setPhoneNumber('');
        //setIdC('');
        setOperation(op);
        if (op === 1) {
            setTitle('Nuevo Contacto');
            setId(idC);
        }else if (op === 2) {
            setTitle('Editar Contacto');
            setNameC(name);
            setLastName(lastName)
            setEmailC(email);
            setPhoneNumber(phoneNumber);
            //setIdC(id);
        }
    };

    const validarC = () => {
        var parametros;
        var metodo;
        if (nameC.trim() !== '') {
            if (lastName.trim() !== '') {
                if (emailC.trim() !== '') {
                    if (phoneNumber.trim() !== '') {
                        if (operation === 1) {
                            parametros= {name:nameC.trim(),lastName:lastName.trim(), email:emailC.trim(), phoneNumber:phoneNumber.trim(),id_Usuario:id.trim()};
                            metodo = 'POST';
                        }else{
                            parametros= {name:nameC.trim(),lastName:lastName.trim(), email:emailC.trim(), phoneNumber:phoneNumber.trim(),id_Usuario:idC.trim()};
                            metodo = 'PUT';
                        }
                        enviarSolicitudContacto(metodo,parametros);
                    }
                }
            }
        }
        //console.log("No trunca");
    }

    const enviarSolicitudContacto = async (metodo,parametros) => {
        if (operation === 1) {
            await axios({method:metodo,url:url + '/contactos/nuevoContacto',data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrarContacto').click();
                
            }).catch(function(error){
                console.log(error);
            });
            //console.log(parametros);
            getDataNueva(id);
            getData();
            show_alert('Contacto creado!','success');
        }else{
            /*await axios({method:metodo,url:url+'/usuarios/actualizar/'+id,data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrar').click();
            }).catch(function(error){
                console.log(error);
            });*/
            console.log(parametros);
            show_alert('Contacto actualizado','success');
        }
        //muestra(id);
    }

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
            await axios({method:metodo,url:url + '/usuarios/nuevoUsuario',data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrar').click();
            }).catch(function(error){
                console.log(error);
            });
            show_alert('Usuario creado!','success');
        }else{
            await axios({method:metodo,url:url + '/usuarios/actualizar/'+id,data:parametros}).then(function(respuesta){
                //console.log(respuesta);
                document.getElementById('btnCerrar').click();
            }).catch(function(error){
                console.log(error);
            });
            show_alert('Usuario actualizado','success');
        }
        getData();
    }

    const enviarEliminacion = async (metodo,idL) => {
        await axios({method:metodo,url:url + '/usuarios/eliminar/'+idL,data:{}}).then(function(respuesta){
            //console.log(respuesta);
            //document.getElementById('btnCerrar').click();
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
                //console.log("Eliminado,",idL);
                const user = data.find(user => user._id === idL);
                //console.log(user.contacts);
                if (user.contacts.length === 0) {
                    enviarEliminacion('DELETE',idL);
                    show_alert('El usuario fue eliminado','success');
                }else{
                    show_alert('El usuario TIENE contactos','warning');
                }
            }else{
                //Alerta
                show_alert('El usuario NO fue eliminado','info');
            }
        })
    }

    const eliminarContacto = (idC) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'Seguro de eliminar al Contacto?',
            icon:'question',text:'Eliminacion permanente',
            showCancelButton:true,confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result)=>{
            if (result.isConfirmed) {
                enviarEliminacionContacto('DELETE',idC);
                show_alert('El contacto fue eliminado','success');
            }else{
                //Alerta
                show_alert('El contacto NO fue eliminado','info');
            }
        })
    }

    const enviarEliminacionContacto = async (metodo,idC) => {
        await axios({method:metodo,url:url + '/contactos/eliminar/'+idC,data:{}}).then(function(respuesta){
            //console.log(respuesta);
            //document.getElementById('btnCerrar').click();
        }).catch(function(error){
            console.log(error);
        });
        getDataNueva(idGlobal);
        getData();
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
                    {data.length > 0 ? (
                    <ul className="list-group" id="list-tab" role="tablist">
                        {data?.map((user)=>(
                        <li className="list-group-item list-group-item-action " onClick={() => muestra(user._id)} data-bs-toggle="list" role="button" key={user.id}>{user.name} 
                        <button 
                        className="btn btn-success btn-sm float-end offset-1" data-bs-toggle="modal" data-bs-target="#modalNuevoContacto"
                        onClick={() => openModalContact(1,user._id)}
                        >Nuevo Contacto <i className="bi bi-person-add"></i>
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
                    ) : (
                        <p>Ingrese un nuevo usuario</p>
                    )}
                </div>
                <div className="col-8">
                    <div className="tab-content" id="nav-tabContent">
                        <div>
                        <h1>Lista de Contactos</h1>
                            {contacts.length > 0 ? (
                                <table className="table">
                                <thead>
                                    <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts?.map(contact => (
                                    <tr key={contact._id}>
                                        <td>{contact.name}</td>
                                        <td>{contact.lastName}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.phoneNumber}</td>
                                        <td className="d-flex justify-content-center align-items-center">
                                        <button 
                                        className="btn btn-sm float-end btn-danger"
                                        onClick={() => eliminarContacto(contact._id)}>
                                        Eliminar <i className="bi bi-trash3"></i>
                                        </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            ) : (
                                <p>Seleccione un usuario o usuario sin contactos</p>
                            )}
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

            <div className="modal fade" id="modalNuevoContacto" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                    </div>
                    <div className="modal-body">
                        <input type="hidden" id="nombre"></input>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Name" value={nameC}
                            onChange={(e)=>setNameC(e.target.value)}></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Last Name" value={lastName}
                            onChange={(e)=>setLastName(e.target.value)}></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Email" value={emailC}
                            onChange={(e)=>setEmailC(e.target.value)}></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                            <input type="text" id="nombre" className="form-control" placeholder="Phone Number" value={phoneNumber}
                            onChange={(e)=>setPhoneNumber(e.target.value)}></input>
                        </div>
                    </div>
                        <div className="modal-footer">
                            <button type="button" id="btnCerrarContacto" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" onClick={() => validarC()} className="btn btn-primary">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}