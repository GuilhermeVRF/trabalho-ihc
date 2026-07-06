# Tutorial de execução — ChampManager

Este tutorial explica como executar o ChampManager no Windows e acessá-lo pelo computador ou celular.

## 1. Requisitos

Instale os seguintes programas:

- **Node.js 20 ou superior:** <https://nodejs.org/>
- **Docker Desktop:** <https://www.docker.com/products/docker-desktop/>

Durante a instalação do Docker Desktop, mantenha habilitado o suporte ao WSL 2. Reinicie o computador caso o instalador solicite.

Para verificar o Node.js, abra o PowerShell e execute:

```powershell
node --version
npm --version
```

## 2. Preparar o projeto

1. Extraia o ZIP para uma pasta comum, como a Área de Trabalho.
2. Evite executar o projeto diretamente de dentro do ZIP.
3. Abra a pasta extraída no VS Code.
4. Inicie o Docker Desktop e aguarde até aparecer que o mecanismo está em execução.

## 3. Instalar as dependências

Abra um terminal do VS Code na pasta principal do projeto e execute:

```powershell
npm install
```

Depois instale as dependências do frontend:

```powershell
cd frontend
npm install
cd ..
```

Esses comandos precisam ser executados apenas na primeira utilização ou quando as dependências forem alteradas.

## 4. Preparar o banco de dados

Na pasta principal do projeto, execute:

```powershell
docker compose up -d
npm run prisma:deploy
npm run prisma:seed
```

O seed cria os dados demonstrativos. Ele pode ser executado novamente sem duplicar os dados.

Credenciais de demonstração:

```text
E-mail: admin@champmanager.com
Senha: Champ123!
```

## 5. Executar no computador

Serão necessários dois terminais abertos simultaneamente.

### Terminal 1 — API

Na pasta principal:

```powershell
npm run start:dev
```

### Terminal 2 — interface

Na pasta `frontend`:

```powershell
cd frontend
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

Não feche os terminais enquanto estiver utilizando o sistema.

## 6. Acessar pelo celular

O computador e o celular precisam estar conectados à **mesma rede Wi-Fi**.

### Descobrir o IP do computador

No PowerShell, execute:

```powershell
ipconfig
```

Procure a seção da rede Wi-Fi e localize o **Endereço IPv4**. Exemplo:

```text
192.168.1.50
```

### Configurar a API no frontend

Abra o arquivo `frontend/.env` e troque o endereço pelo IP encontrado:

```env
VITE_API_URL=http://192.168.1.50:3000/api
```

O endereço acima é apenas um exemplo. Use o IP da máquina que está executando o projeto.

Sempre que alterar `frontend/.env`, reinicie o frontend.

### Iniciar os serviços

No primeiro terminal, na pasta principal:

```powershell
docker compose up -d
npm run start:dev
```

No segundo terminal:

```powershell
cd frontend
npm run dev -- --host 0.0.0.0
```

No navegador do celular, acesse substituindo pelo IP do computador:

```text
http://192.168.1.50:5173
```

Se o Windows exibir uma solicitação de acesso ao firewall, escolha **Permitir acesso em redes privadas**.

## 7. Encerrar o sistema

Nos terminais da API e do frontend, pressione `Ctrl + C`.

Para desligar o banco de dados:

```powershell
docker compose down
```

Os dados permanecem armazenados no volume do Docker. Não use `docker compose down -v`, pois a opção `-v` apaga o banco.

## 8. Problemas comuns

### O celular não abre o endereço

- Confirme que computador e celular estão na mesma rede Wi-Fi.
- Não utilize uma rede de convidados.
- Desative temporariamente VPNs.
- Confirme que o frontend foi iniciado com `--host 0.0.0.0`.
- Permita Node.js nas redes privadas do Firewall do Windows.
- Confira se o IP do computador mudou.

### A página abre, mas o login não funciona

- Verifique `frontend/.env`.
- Confirme que a URL usa o IP do computador, não `localhost`.
- Confirme que a API continua executando no primeiro terminal.
- Reinicie o frontend após alterar o arquivo `.env`.

### Erro ao conectar ao banco

- Abra o Docker Desktop.
- Execute `docker compose ps` e confira se `champmanager-postgres` aparece como `healthy`.
- Confirme que a porta `5433` não está sendo usada por outro programa.

### Porta 5173 já está em uso

O Vite pode selecionar outra porta automaticamente, como `5174`. Utilize no navegador o endereço mostrado no terminal.

### Recriar os dados demonstrativos

Na pasta principal:

```powershell
npm run prisma:seed
```

## 9. Endereços úteis

Com o projeto em execução:

```text
Interface: http://localhost:5173
API:       http://localhost:3000/api
Saúde:     http://localhost:3000/api/health
```

Para acesso pelo celular, substitua `localhost` pelo IP do computador.
