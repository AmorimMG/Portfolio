# Sistema de Arquivos do Terminal

Este sistema implementa um sistema de arquivos simulado completo para o terminal do portfólio, oferecendo comandos Unix-like funcionais.

## Arquitetura

### FileSystemService (`/src/services/FileSystemService.js`)
- **Classe Principal**: `FileSystemService` - Gerencia todo o sistema de arquivos
- **Singleton Pattern**: Uma única instância através de `getFileSystem()`
- **Estrutura Reativa**: Usa Vue 3 reactivity para atualizações em tempo real
- **Sistema Hierárquico**: Simula estrutura Unix com `/`, `/home`, `/etc`, etc.

### TerminalCommandsService (`/src/services/TerminalCommandsService.js`)
- **Comandos Unix**: Implementa comandos como `ls`, `cd`, `pwd`, `cat`, `mkdir`, `touch`, `rm`
- **Comandos Avançados**: `find`, `tree`, `file`, `wc`
- **Formatação**: Suporte a cores ANSI e formatação tipo Unix

## Comandos Disponíveis

### Navegação
- `pwd` - Mostra diretório atual
- `cd <path>` - Muda para diretório (suporta . .. e caminhos absolutos/relativos)
- `ls [options] [path]` - Lista arquivos/diretórios
  - `-l` - Formato longo com permissões, dono, tamanho, data
  - `-a` - Inclui arquivos ocultos
  - `-la` - Combina formato longo e arquivos ocultos

### Manipulação de Arquivos
- `cat <file>` - Exibe conteúdo de arquivo(s)
- `touch <file>` - Cria arquivo vazio ou atualiza timestamp
- `mkdir <dir>` - Cria diretório
- `rm [-r] <path>` - Remove arquivo/diretório
  - `-r` - Remove recursivamente (diretórios)

### Informações
- `file <path>` - Mostra tipo de arquivo
- `wc <file>` - Conta linhas, palavras e caracteres
- `tree [path] [-L depth]` - Mostra estrutura em árvore
- `find <pattern> [path]` - Busca arquivos por padrão

### Sistema
- `clear` - Limpa terminal

### Comandos do Portfólio
- `help` - Lista todos os comandos
- `about`, `skills`, `projects`, etc. - Comandos específicos do portfólio
- `pt`, `es`, `en` - Muda idioma

## Estrutura do Sistema de Arquivos

```
/
├── home/
│   └── amorim/
│       ├── Documents/
│       │   ├── resume.md
│       │   ├── skills.txt
│       │   └── projects.json
│       ├── Projects/
│       │   ├── portfolio/
│       │   │   ├── README.md
│       │   │   └── package.json
│       │   └── web-apps/
│       │       ├── todo-app/
│       │       └── chat-app/
│       ├── Pictures/
│       │   ├── profile.jpg
│       │   └── screenshots/
│       └── .bashrc
├── etc/
│   ├── hostname
│   └── passwd
└── var/
    └── log/
```

## Exemplos de Uso

```bash
# Navegar para Documents
cd Documents

# Listar com detalhes
ls -la

# Ler currículo
cat resume.md

# Ver estrutura do projeto
cd ../Projects/portfolio
tree

# Buscar arquivos JSON
find .json

# Criar nova pasta
mkdir test

# Criar arquivo
touch test/hello.txt

# Informações do arquivo
file resume.md
wc resume.md
```

## Funcionalidades Avançadas

### Prompt Dinâmico
O prompt do terminal mostra o diretório atual:
- `/home/amorim` aparece como `~`
- Atualiza automaticamente quando navega

### Suporte a Cores
- Diretórios aparecem em azul
- Formatação ANSI para listagens detalhadas

### Validação de Caminhos
- Suporte completo a caminhos relativos e absolutos
- Validação de existência de arquivos/diretórios
- Mensagens de erro apropriadas

### Persistência
- Estado mantido durante sessão
- Histórico de navegação

## Integração com Vue

O sistema é totalmente integrado com Vue 3:
- **Reatividade**: Mudanças refletem automaticamente na UI
- **Composables**: Pode ser usado em qualquer componente
- **TypeScript Ready**: Preparado para migração para TS

## Extensibilidade

### Adicionar Novos Comandos
```javascript
// Em TerminalCommandsService.js
export const meuComando = (args) => {
    // Lógica do comando
    return 'resultado';
};

// Adicionar ao mapa de comandos
export const commands = {
    // ...comandos existentes
    'meucomando': meuComando
};
```

### Adicionar Arquivos/Diretórios
```javascript
// No FileSystemService.js, método createInitialFileSystem()
'novo-arquivo.txt': {
    type: 'file',
    permissions: '-rw-r--r--',
    owner: 'amorim',
    group: 'amorim',
    size: 100,
    modified: new Date(),
    content: 'Conteúdo do arquivo'
}
```

## Performance

- **Lazy Loading**: Arquivos são carregados sob demanda
- **Caching**: Estrutura em memória para acesso rápido
- **Minimal DOM**: Manipulação DOM otimizada para comandos de listagem

## Compatibilidade

- **Browsers**: Todos os browsers modernos
- **Mobile**: Funciona em dispositivos móveis
- **Screen Readers**: Suporte a acessibilidade

Este sistema oferece uma experiência completa de terminal Unix no navegador, mantendo a funcionalidade do portfólio enquanto adiciona capacidades reais de sistema de arquivos.
