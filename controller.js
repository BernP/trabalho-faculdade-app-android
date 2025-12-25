import React, { createContext, useState, useContext, useEffect } from 'react';
import { initialTasks, initialNotes } from './model';
import { Cores } from './sheets';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export function useController() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // --- ESTADOS GERAIS ---
  const [isDark, setIsDark] = useState(false);
  const [pin, setPin] = useState(null); 
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const theme = isDark ? Cores.dark : Cores.light;
  const toggleTheme = () => setIsDark(!isDark);

  // --- CARREGAR (LOAD) ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@tasks');
        const savedNotes = await AsyncStorage.getItem('@notes');
        const savedPin = await AsyncStorage.getItem('@pin');
        const savedTheme = await AsyncStorage.getItem('@theme');

        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        if (savedPin) setPin(savedPin);
        if (savedTheme) setIsDark(JSON.parse(savedTheme));
      } catch (e) {
        console.error("Erro ao carregar", e);
      }
    };
    loadData();
  }, []);

  // --- SALVAR (AUTO-SAVE) ---
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
        await AsyncStorage.setItem('@notes', JSON.stringify(notes));
        await AsyncStorage.setItem('@theme', JSON.stringify(isDark));
        if (pin) await AsyncStorage.setItem('@pin', pin);
        else await AsyncStorage.removeItem('@pin');
      } catch (e) {
        console.error("Erro ao salvar", e);
      }
    };
    saveData();
  }, [tasks, notes, pin, isDark]);

  // --- PROCESSAMENTO (BUSCA + ORDENAÇÃO) ---
  const processData = (dataList) => {
    // 1. Filtro
    let result = dataList.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // 2. Ordenação
    result.sort((a, b) => {

      if (sortBy === 'date') {
        if (!a.date) return 1; 
        if (!b.date) return -1;

        const [d1, m1, y1] = a.date.split('/');
        const [d2, m2, y2] = b.date.split('/');
        const dateA = new Date(y1, m1 - 1, d1).getTime();
        const dateB = new Date(y2, m2 - 1, d2).getTime();
        
        return dateA - dateB; // Menor (mais antiga/próxima) primeiro
      }

      if (sortBy === 'newest') return Number(b.id) - Number(a.id);
      if (sortBy === 'oldest') return Number(a.id) - Number(b.id);
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  };

  const filteredTasks = processData(tasks);
  const filteredNotes = processData(notes);

  // --- CRUD ---
  const addTask = (title, desc, date, alarm) => {
    if (!title.trim()) { Alert.alert("Erro", "Título obrigatório!"); return; }
    const newTask = { id: Date.now().toString(), title, desc, date, alarm };
    setTasks(prev => [newTask, ...prev]);
  };

  const editTask = (id, newTitle, newDesc, newDate) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle, desc: newDesc, date: newDate } : t));
  };

  const addNote = (title, desc, isLocked) => {
    if (!title.trim()) { Alert.alert("Erro", "Título obrigatório!"); return; }
    const newNote = { id: Date.now().toString(), title, desc, locked: isLocked };
    setNotes(prev => [newNote, ...prev]);
  };

  const editNote = (id, newTitle, newDesc, isLocked) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title: newTitle, desc: newDesc, locked: isLocked } : n));
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
          if (type === 'task') setTasks(prev => prev.filter(t => t.id !== id));
          if (type === 'note') setNotes(prev => prev.filter(n => n.id !== id));
        }
      }
    ]);
  };

  const clearAllData = () => {
    Alert.alert("ATENÇÃO", "Isso apagará tudo permanentemente. Continuar?", [
        { text: "Cancelar" },
        { 
          text: "Sim, Apagar Tudo", style: 'destructive',
          onPress: async () => { 
            setTasks([]); setNotes([]); setPin(null); setIsDark(false);
            await AsyncStorage.clear();
          } 
        }
    ]);
  };

  const value = {
    theme, isDark, toggleTheme,
    filteredTasks, addTask, editTask,
    filteredNotes, addNote, editNote,
    pin, registerPin, verifyPin, changePin,
    deleteItem, clearAllData,
    searchQuery, setSearchQuery,
    sortBy, setSortBy
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}