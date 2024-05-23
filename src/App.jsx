import { useFetch,usePost } from "./useFetch";

export function App() {

    const {data,loading} = useFetch("http://localhost:3000/usuarios/mostrarContactos");

    return(
        <div className="App">
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-4">
                        <div className="d-grid mx-auto">
                            <button className="btn btn-dark">
                                Hola
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
            <div>
                <ul>
                    {loading && <li>Loading...</li>}
                    {data?.map((user)=>(<li key={user.id}>{user.name}</li>))}
                </ul>
            </div>
        </div>
    );
}