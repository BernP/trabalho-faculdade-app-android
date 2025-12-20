import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialTasks, initialNotes } from './model';
import { Cores } from './sheets';
import { Alert } from 'react-native';

const AppContext = createContext();

export function useController() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // --- ESTADOS GERAIS ---
  const [isDark, setIsDark] = useState(false);
  const [pin, setPin] = useState(null); 
  const theme = isDark ? Cores.dark : Cores.light;
  const toggleTheme = () => setIsDark(!isDark);

  // --- DADOS BRUTOS ---
  const [tasks, setTasks] = useState(initialTasks);
  const [notes, setNotes] = useState(initialNotes);

  // --- ESTADOS DE BUSCA E FILTRO ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'az'

  // --- FUNÇÃO DE PROCESSAMENTO (BUSCA + ORDENAÇÃO) ---
  const processData = (dataList) => {
    // 1. Filtro por texto (Busca)
    let result = dataList.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 2. Ordenação
    result.sort((a, b) => {
      if (sortBy === 'newest') return Number(b.id) - Number(a.id); // ID é timestamp
      if (sortBy === 'oldest') return Number(a.id) - Number(b.id);
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  };

  // Listas processadas para a View usar
  const filteredTasks = processData(tasks);
  const filteredNotes = processData(notes);

  // --- CRUD TAREFAS ---
  const addTask = (title, desc, date, alarm) => {
    if (!title.trim()) { Alert.alert("Erro", "Título obrigatório!"); return; }
    const newTask = { id: Date.now().toString(), title, desc, date, alarm };
    setTasks([newTask, ...tasks]);
  };

  const editTask = (id, newTitle, newDesc, newDate) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title: newTitle, desc: newDesc, date: newDate } : t));
  };

  // --- CRUD NOTAS ---
  const addNote = (title, desc, isLocked) => {
    if (!title.trim()) { Alert.alert("Erro", "Título obrigatório!"); return; }
    const newNote = { id: Date.now().toString(), title, desc, locked: isLocked };
    setNotes([newNote, ...notes]);
  };

  const editNote = (id, newTitle, newDesc, isLocked) => {
    setNotes(notes.map(n => n.id === id ? { ...n, title: newTitle, desc: newDesc, locked: isLocked } : n));
  };

  // --- SEGURANÇA ---
  const registerPin = (newPin) => setPin(newPin);
  const verifyPin = (inputPin, onSuccess) => {
    if (!pin) { Alert.alert("Erro", "Nenhuma senha configurada ainda!"); return false; }
    if (inputPin === pin) { onSuccess(); return true; } 
    else { Alert.alert("Erro", "PIN Incorreto"); return false; }
  };
  const changePin = (oldPin, newPin) => {
    if (oldPin === pin) { setPin(newPin); return true; }
    return false;
  };

  // --- GERAL ---
  const deleteItem = (id, type) => {
    Alert.alert("Excluir", "Tem certeza?", [
      { text: "Cancelar" },
      { 
        text: "Apagar", style: 'destructive',
        onPress: () => {
          if (type === 'task') setTasks(tasks.filter(t => t.id !== id));
          if (type === 'note') setNotes(notes.filter(n => n.id !== id));
        }
      }
    ]);
  };

  const clearAllData = () => {
    Alert.alert("Confirmação", "Apagar TUDO?", [
        { text: "Cancelar" },
        { text: "Sim", onPress: () => { setTasks([]); setNotes([]); setPin(null); } }
    ]);
  };

  const value = {
    theme, isDark, toggleTheme,
    filteredTasks, addTask, editTask, // Exportando lista filtrada
    filteredNotes, addNote, editNote, // Exportando lista filtrada
    pin, registerPin, verifyPin, changePin,
    deleteItem, clearAllData,
    searchQuery, setSearchQuery, // Controle da busca
    sortBy, setSortBy // Controle da ordenação
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}