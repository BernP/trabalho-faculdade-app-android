// Estrutura de uma Tarefa
export const TaskModel = {
  create: (id, title, desc, date, alarm) => ({ id, title, desc, date, alarm }),
};

// Dados Iniciais
export const initialTasks = [];

// Dados Iniciais de Notas
export const initialNotes = [];