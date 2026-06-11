// TuringMachineLogic.js

export const regrasPalindromo = {
  // [estado, sym1, sym2]: [proximo_estado, escreve1, escreve2, mov1, mov2]
  "q_copia,0,_": ["q_copia", "0", "0", "R", "R"],
  "q_copia,1,_": ["q_copia", "1", "1", "R", "R"],
  "q_copia,_,_": ["q_volta", "_", "_", "L", "S"],

  "q_volta,0,_": ["q_volta", "0", "_", "L", "S"],
  "q_volta,1,_": ["q_volta", "1", "_", "L", "S"],
  "q_volta,_,_": ["q_checa", "_", "_", "R", "L"],

  "q_checa,0,0": ["q_checa", "0", "0", "R", "L"],
  "q_checa,1,1": ["q_checa", "1", "1", "R", "L"],
  "q_checa,_,_": ["q_aceita", "_", "_", "S", "S"],
};

export class TuringMachineTwoTapes {
  constructor(transitions, blank = "_") {
    this.transitions = transitions;
    this.blank = blank;
  }

  // Executa a máquina e retorna o histórico de cada passo para a animação
  runSimulation(inputString) {
    let fita1 = inputString ? inputString.split("") : [this.blank];
    let fita2 = Array(fita1.length).fill(this.blank);

    let head1 = 0;
    let head2 = 0;
    let state = "q_copia";
    let steps = 0;

    const history = [];

    // Guarda o estado inicial
    history.push({
      step: steps,
      state: state,
      fita1: [...fita1],
      fita2: [...fita2],
      head1: head1,
      head2: head2,
    });

    const maxSteps = 2000; // Trava de segurança contra loops infinitos

    while (!["q_aceita", "q_rejeita"].includes(state) && steps < maxSteps) {
      // Garantir expansão da fita à direita se necessário
      if (head1 >= fita1.length) fita1.push(this.blank);
      if (head2 >= fita2.length) fita2.push(this.blank);

      // Garantir expansão da fita à esquerda se necessário
      if (head1 < 0) {
        fita1.unshift(this.blank);
        head1 = 0;
      }
      if (head2 < 0) {
        fita2.unshift(this.blank);
        head2 = 0;
      }

      let sym1 = fita1[head1];
      let sym2 = fita2[head2];

      let key = `${state},${sym1},${sym2}`;

      if (!(key in this.transitions)) {
        state = "q_rejeita";
        break;
      }

      let [nextState, w1, w2, m1, m2] = this.transitions[key];

      fita1[head1] = w1;
      fita2[head2] = w2;

      head1 += m1 === "R" ? 1 : m1 === "L" ? -1 : 0;
      head2 += m2 === "R" ? 1 : m2 === "L" ? -1 : 0;
      state = nextState;
      steps += 1;

      history.push({
        step: steps,
        state: state,
        fita1: [...fita1],
        fita2: [...fita2],
        head1: head1,
        head2: head2,
      });
    }

    return {
      aceito: state === "q_aceita",
      totalPassos: steps,
      history: history,
    };
  }
}
