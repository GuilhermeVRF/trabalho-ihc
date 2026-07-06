# Heurísticas intencionais — ChampManager

Este documento é exclusivamente acadêmico e não é disponibilizado na interface da aplicação.

| # | Problema implementado | Local | Heurística de Nielsen afetada | Solução recomendada |
|---|---|---|---|---|
| 1 | Exclusão executada imediatamente | Campeonatos, times e jogadores | Prevenção de erros | Exibir diálogo com nome do item e exigir confirmação. |
| 2 | Salvamentos sem mensagem de sucesso | Formulários de cadastro e edição | Visibilidade do estado do sistema | Apresentar toast ou aviso persistente confirmando a ação. |
| 3 | Busca pequena e pouco destacada | Listas de campeonatos, times e jogadores | Reconhecimento em vez de memorização | Aumentar o campo, usar rótulo visível e posição consistente. |
| 4 | Bottom Navigation apenas com ícones | Navegação mobile | Correspondência entre sistema e mundo real | Exibir texto abaixo de cada ícone. |
| 5 | Listas em branco durante carregamento | Times, jogadores e jogos | Visibilidade do estado do sistema | Utilizar skeletons ou spinner com mensagem de carregamento. |
| 6 | Mensagem genérica “Ocorreu um erro.” | Formulários e consultas | Ajudar a reconhecer, diagnosticar e recuperar de erros | Informar a causa, o campo afetado e como corrigir. |
| 7 | Salvar e Excluir com mesma aparência e próximos | Edição de campeonato | Prevenção de erros | Separar as ações e aplicar estilo destrutivo ao botão Excluir. |
| 8 | Ausência de breadcrumb | Telas internas e formulários | Reconhecimento em vez de memorização | Exibir hierarquia e página atual acima do conteúdo. |
| 9 | Geração da tabela escondida no menu de três pontos | Lista de campeonatos | Flexibilidade e eficiência de uso | Exibir ação principal no detalhe do campeonato. |
| 10 | Validação somente após envio | Todos os formulários | Prevenção de erros | Validar após interação com cada campo e preservar mensagens contextuais. |
| 11 | Textos secundários em cinza claro | Descrições, metadados e estados vazios | Estética e design minimalista / acessibilidade | Elevar o contraste para atender WCAG AA. |
| 12 | Resultado fecha sem confirmação visual | Modal de resultado do jogo | Visibilidade do estado do sistema | Mostrar confirmação e placar salvo antes ou após fechar. |
| 13 | Verbos inconsistentes: Novo, Adicionar e Criar | Campeonatos, times e jogadores | Consistência e padrões | Adotar um único verbo para inclusão em todo o sistema. |
| 14 | Tabela exige rolagem horizontal no celular | Classificação | Flexibilidade e eficiência de uso | Criar versão compacta ou cartões expansíveis para telas pequenas. |
| 15 | Ordenação sem indicador visual | Cabeçalhos de campeonatos e classificação | Reconhecimento em vez de memorização | Adicionar setas, estado ativo e descrição acessível da ordenação. |

## Observação

As falhas são deliberadamente leves e não impedem a conclusão das tarefas. Elas existem para apoiar avaliação heurística, testes de usabilidade e entrevistas da disciplina de IHC.
