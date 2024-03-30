const Endpoints = (instance) => ({
    Login: (data) => instance.post('Login/Logar', data),
    AlterarSenha: (data) => instance.post('Login/AlterarSenha', data),
    RecebeUsuario: (data) => instance.get(`Usuarios/Obter?id=${data}`, data),
    UsuarioCriar: (data) => instance.post('Usuarios/Inserir', data),
    UsuarioEditar: (data) => instance.post('Usuarios/Atualizar', data),
    UsuarioExcluir: (data) => instance.delete(`Usuarios/Excluir/${data}`),
    UsuarioObterTodos: () => instance.get('Usuarios/ObterTodos')
});

export default Endpoints;
