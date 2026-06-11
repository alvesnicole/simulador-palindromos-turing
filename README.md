# Simulador de Máquina de Turing de Duas Fitas

Este projeto consiste em um simulador interativo baseado na Web para uma Máquina de Turing (MT) com duas fitas, projetado especificamente para demonstrar o reconhecimento da linguagem de palíndromos binários em tempo linear. A aplicação combina um motor de execução formal com um painel de visualização em tempo real e análise empírica de complexidade assintótica.

## Objetivos do Projeto

* Demonstração Prática: Visualizar o comportamento dos cabeçotes de leitura e escrita e as mudanças de estados passo a passo.
* Validação Teórica: Comprovar empiricamente como a introdução de uma fita de memória auxiliar reduz o limite superior assintótico de tempo de O(n²) (em modelo de fita única) para O(n).
* Interface de Alta Fidelidade: Fornecer um ambiente de controle desacoplado, minimalista e focado no fluxo lógico do autômato.

---

## Arquitetura do Sistema

O software foi desenvolvido seguindo o princípio de separação de responsabilidades, dividido em três componentes principais na pasta src/:

* TuringMachineLogic.js: Motor matemático que processa as funções de transição da Máquina de Turing, valida as cadeias binárias e exporta o histórico completo de estados e posições de cabeçote.
* App.js: Componente estrutural em React que gerencia os estados da interface, controla os intervalos de animação (Play/Pause/Reset) e renderiza as tabelas de dados dinâmicos.
* App.css: Camada de apresentação minimalista, configurada com paleta de cores sóbria (estilo Shadcn UI) e estados visuais focados em usabilidade técnica.



## Estrutura da Matriz de Transição

O autômato foi modelado como uma função de transição total para o alfabeto de fita $\Sigma = \{0, 1, \_\}$, operando através dos seguintes estados principais:

| Estado Inicial | Leitura (Fita 1, Fita 2) | Próximo Estado | Escrita (Fita 1, Fita 2) | Movimento (Fita 1, Fita 2) | Função do Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **q_copia** | (0, \_) ou (1, \_) | q_copia | (0, 0) ou (1, 1) | (Direita, Direita) | Duplica a cadeia de entrada na fita auxiliar. |
| **q_volta** | (0, \_) ou (1, \_) | q_volta | (0, \_) ou (1, \_) | (Esquerda, Sem Movimento) | Reposiciona o cabeçote 1 no início da palavra. |
| **q_checa** | (0, 0) ou (1, 1) | q_checa | (0, 0) ou (1, 1) | (Direita, Esquerda) | Compara as fitas em direções opostas. |
| **q_checa** | Diferentes | q_rejeita | - | (Sem Movimento, Sem Movimento) | Interrompe a execução e aponta erro de assimetria. |

---

## Funcionalidades Implementadas

* Restrição de Entrada: O campo de captura realiza o tratamento de strings em tempo real via Expressões Regulares, permitindo apenas caracteres pertencentes ao alfabeto binário.
* Controle de Fluxo Fino: Botões de execução automática por amostragem periódica (300ms) ou execução discreta passo a passo para auditoria manual.
* Feedback Visual de Estados: Painel dinâmico que altera sua tonalidade de acordo com o encerramento do processamento (`q_aceita` em verde sutil; `q_rejeita` em vermelho sutil).
* Geração de Gráfico Empírico: Acoplamento da biblioteca Recharts para testar o comportamento do modelo com palíndromos crescentes ($10 \le n \le 150$), plotando a progressão estritamente linear da máquina.

---

## Instalação e Execução

### Pré-requisitos
Antes de iniciar, certifique-se de ter o Node.js e o gerenciador de pacotes npm instalados em sua máquina.

### Passos para Configuração

1. Clone o repositório para o seu ambiente de desenvolvimento local:
```bash
git clone [https://github.com/](https://github.com/)[Seu Usuário]/[Nome do Repositório].git
