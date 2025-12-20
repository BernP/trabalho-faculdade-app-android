// Estrutura de uma Tarefa
export const TaskModel = {
  create: (id, title, desc, date, alarm) => ({ id, title, desc, date, alarm }),
};

// Dados Iniciais (ZERADOS)
export const initialTasks = [];

// Dados Iniciais de Notas (ZERADOS)
export const initialNotes = [];