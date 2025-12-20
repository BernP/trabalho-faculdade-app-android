import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Switch, Modal, StatusBar, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './sheets';
import { AppProvider, useController } from './controller';

// --- COMPONENTES AUXILIARES ---

// 1. Estado Vazio (Bonito)
const EmptyState = ({ message, onAdd, theme, isSearching }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 80, padding: 30, opacity: 0.7 }}>
    <Ionicons name={isSearching ? "search" : "sparkles"} size={50} color={theme.subtext} style={{marginBottom:15}} />
    <Text style={{ color: theme.text, textAlign: 'center', fontSize: 18, fontWeight:'bold', marginBottom: 5 }}>
      {isSearching ? "Nada encontrado" : "Tudo limpo por aqui"}
    </Text>
    <Text style={{ color: theme.subtext, textAlign: 'center', fontSize: 14, marginBottom: 25 }}>
      {message}
    </Text>
    {!isSearching && (
      <TouchableOpacity onPress={onAdd} style={{ paddingVertical: 12, paddingHorizontal: 25, backgroundColor: theme.primary, borderRadius: 20 }}>
        <Text style={{ color: '#FFF', fontWeight:'bold' }}>Adicionar Novo</Text>
      </TouchableOpacity>
    )}
  </View>
);

// 2. Barra de Busca e Filtro
const SearchHeader = ({ title, theme, searchQuery, setSearchQuery, onFilterPress }) => (
  <View style={styles.header}>
    <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: theme.inputBg }]}>
        <Ionicons name="search" size={20} color={theme.subtext} />
        <TextInput 
          placeholder="Pesquisar..." 
          placeholderTextColor={theme.subtext}
          style={{ flex: 1, marginLeft: 10, color: theme.text, fontSize: 16 }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={theme.subtext} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={[styles.filterBtn, { backgroundColor: theme.card }]} onPress={onFilterPress}>
        <Ionicons name="filter" size={22} color={theme.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

// --- TELA HOME (AFAZERES) ---
function HomeScreen() {
  const { theme, isDark, filteredTasks, addTask, editTask, deleteItem, searchQuery, setSearchQuery, sortBy, setSortBy } = useController(); 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false); 
  const [currentItemId, setCurrentItemId] = useState(null);

  // Campos
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  const openCreate = () => {
    setCurrentItemId(null); setTitle(''); setDesc(''); setDate('');
    setIsEditingMode(true); setModalVisible(true);
  };

  const openView = (item) => {
    setCurrentItemId(item.id); setTitle(item.title); setDesc(item.desc); setDate(item.date);
    setIsEditingMode(false); setModalVisible(true);
  };

  const handleSave = () => {
    if (currentItemId) editTask(currentItemId, title, desc, date);
    else addTask(title, desc, date, false);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: 40 }]}>
      <SearchHeader 
        title="Meus Afazeres" 
        theme={theme} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <FlatList 
        data={filteredTasks} 
        keyExtractor={item => item.id} 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={<EmptyState message={searchQuery ? "Tente outro termo." : "Adicione tarefas para organizar seu dia."} onAdd={openCreate} theme={theme} isSearching={!!searchQuery} />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => openView(item)}
            onLongPress={() => deleteItem(item.id, 'task')}
            style={[styles.card, { backgroundColor: theme.card }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
              {item.alarm && <Ionicons name="notifications" size={18} color={theme.accent} />}
            </View>
            <Text style={[styles.cardDate, { color: theme.primary }]}>{item.date}</Text>
          </TouchableOpacity>
        )} 
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]} onPress={openCreate}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* MODAL VIEW/EDIT */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
              <Text style={[styles.modalTitle, { color: theme.text, marginBottom:0, textAlign:'left' }]}>
                {isEditingMode ? (currentItemId ? "Editar" : "Nova Tarefa") : "Detalhes"}
              </Text>
              {!isEditingMode && (
                <TouchableOpacity onPress={() => setIsEditingMode(true)} style={{padding:5}}>
                   <Ionicons name="create-outline" size={24} color={theme.accent} />
                </TouchableOpacity>
              )}
            </View>
            
            {isEditingMode ? (
              <>
                <TextInput placeholder="Título" placeholderTextColor={theme.subtext} style={[styles.input, { color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg }]} value={title} onChangeText={setTitle} />
                <TextInput placeholder="Descrição..." multiline placeholderTextColor={theme.subtext} style={[styles.input, { color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg, height: 100, textAlignVertical:'top'}]} value={desc} onChangeText={setDesc} />
                <TextInput placeholder="Data" placeholderTextColor={theme.subtext} style={[styles.input, { color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg }]} value={date} onChangeText={setDate} />
              </>
            ) : (
              <View style={{marginBottom:20}}>
                <Text style={{color:theme.subtext, fontSize:12, fontWeight:'bold'}}>TAREFA</Text>
                <Text style={{color:theme.text, fontSize:22, fontWeight:'bold', marginBottom:15}}>{title}</Text>
                
                <Text style={{color:theme.subtext, fontSize:12, fontWeight:'bold'}}>DESCRIÇÃO</Text>
                <Text style={{color:theme.text, fontSize:16, marginBottom:15, lineHeight:24}}>{desc || "Sem descrição"}</Text>
                
                <View style={{backgroundColor: theme.background, padding:10, borderRadius:8, alignSelf:'flex-start'}}>
                    <Text style={{color:theme.primary, fontWeight:'bold'}}>{date}</Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btnCancel, {borderColor: theme.border}]}>
                <Text style={{color:theme.subtext}}>Fechar</Text>
              </TouchableOpacity>
              {isEditingMode && (
                <TouchableOpacity onPress={handleSave} style={[styles.btnConfirm, {backgroundColor: theme.primary}]}>
                  <Text style={{color:'#FFF', fontWeight:'bold'}}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE FILTRO */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, {color: theme.text}]}>Ordenar Por</Text>
                
                <TouchableOpacity onPress={() => { setSortBy('newest'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Ionicons name="time" size={24} color={sortBy === 'newest' ? theme.primary : theme.subtext} />
                    <Text style={{marginLeft:15, fontSize:16, color: sortBy === 'newest' ? theme.primary : theme.text, fontWeight: sortBy === 'newest' ? 'bold' : 'normal'}}>Mais Recentes (Padrão)</Text>
                    {sortBy === 'newest' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft:'auto'}} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setSortBy('oldest'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Ionicons name="hourglass-outline" size={24} color={sortBy === 'oldest' ? theme.primary : theme.subtext} />
                    <Text style={{marginLeft:15, fontSize:16, color: sortBy === 'oldest' ? theme.primary : theme.text, fontWeight: sortBy === 'oldest' ? 'bold' : 'normal'}}>Mais Antigos</Text>
                    {sortBy === 'oldest' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft:'auto'}} />}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setSortBy('az'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Ionicons name="text" size={24} color={sortBy === 'az' ? theme.primary : theme.subtext} />
                    <Text style={{marginLeft:15, fontSize:16, color: sortBy === 'az' ? theme.primary : theme.text, fontWeight: sortBy === 'az' ? 'bold' : 'normal'}}>Alfabética (A-Z)</Text>
                    {sortBy === 'az' && <Ionicons name="checkmark" size={20} color={theme.primary} style={{marginLeft:'auto'}} />}
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// --- TELA COFRE ---
function SecureScreen() {
  const { theme, filteredNotes, pin, verifyPin, registerPin, addNote, editNote, deleteItem, searchQuery, setSearchQuery, setSortBy } = useController();
  
  const [authVisible, setAuthVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [createPinVisible, setCreatePinVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [tempNote, setTempNote] = useState(null);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  
  const [pinInput, setPinInput] = useState('');
  const [newPinCode, setNewPinCode] = useState('');

  const handleItemPress = (note) => {
    if (note.locked) {
      if (!pin) { Alert.alert("Aviso", "Esta nota é segura mas você ainda não definiu uma senha."); return; }
      setTempNote(note); setPinInput(''); setAuthVisible(true);
    } else {
      openDetails(note);
    }
  };

  const onAuthSuccess = () => {
    setAuthVisible(false);
    openDetails(tempNote);
  };

  const openDetails = (note) => {
    setCurrentItemId(note.id); setTitle(note.title); setDesc(note.desc); setIsLocked(note.locked);
    setIsEditingMode(false); setDetailsVisible(true);
  };

  const openCreate = () => {
    setCurrentItemId(null); setTitle(''); setDesc(''); setIsLocked(false);
    setIsEditingMode(true); setDetailsVisible(true);
  };

  const handleSave = () => {
    if (title.trim() === "") { Alert.alert("Erro", "Título necessário"); return; }
    if (!currentItemId && isLocked && !pin) {
      setDetailsVisible(false); setCreatePinVisible(true); return;
    }
    if (currentItemId) editNote(currentItemId, title, desc, isLocked);
    else addNote(title, desc, isLocked);
    setDetailsVisible(false);
  };

  const handleCreatePin = () => {
    if (newPinCode.length < 4) return;
    registerPin(newPinCode); setCreatePinVisible(false);
    addNote(title, desc, true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: 40 }]}>
      <SearchHeader 
        title="Cofre Digital" 
        theme={theme} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onFilterPress={() => setFilterModalVisible(true)}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={<EmptyState message={searchQuery ? "Nenhuma nota encontrada." : "Guarde suas senhas e segredos aqui."} onAdd={openCreate} theme={theme} isSearching={!!searchQuery} />}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleItemPress(item)}
            onLongPress={() => deleteItem(item.id, 'note')}
            style={[styles.card, { backgroundColor: theme.card }]}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
              {item.locked ? 
                <Ionicons name="lock-closed" size={18} color={theme.danger} /> : 
                <Ionicons name="lock-open-outline" size={18} color={theme.accent} />
              }
            </View>
            <View style={{flexDirection:'row', alignItems:'center', marginTop:5}}>
                <View style={{backgroundColor: item.locked ? theme.danger + '20' : theme.accent + '20', paddingHorizontal:8, paddingVertical:4, borderRadius:6}}>
                    <Text style={{color: item.locked ? theme.danger : theme.accent, fontSize:10, fontWeight:'bold'}}>
                        {item.locked ? "PROTEGIDO" : "PÚBLICO"}
                    </Text>
                </View>
                <Text style={{ color: theme.subtext, fontSize:12, marginLeft:10 }}>Toque para ler</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.accent }]} onPress={openCreate}>
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>

      {/* MODAL AUTH */}
      <Modal visible={authVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Senha Necessária</Text>
            <TextInput style={[styles.input, {color:theme.text, borderColor:theme.border, textAlign:'center', fontSize:24, letterSpacing:5}]} keyboardType="numeric" maxLength={4} secureTextEntry value={pinInput} onChangeText={setPinInput} autoFocus />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setAuthVisible(false)} style={[styles.btnCancel, {borderColor:theme.border}]}><Text style={{color:theme.subtext}}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => verifyPin(pinInput, onAuthSuccess)} style={[styles.btnConfirm, {backgroundColor: theme.primary}]}><Text style={{color:'#FFF'}}>Entrar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DETALHES */}
      <Modal visible={detailsVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
             <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
              <Text style={[styles.modalTitle, { color: theme.text, marginBottom:0 }]}>
                {isEditingMode ? (currentItemId ? "Editar" : "Nova Informação") : "Segredo"}
              </Text>
              {!isEditingMode && (
                <TouchableOpacity onPress={() => setIsEditingMode(true)} style={{padding:5}}>
                   <Ionicons name="create-outline" size={24} color={theme.accent} />
                </TouchableOpacity>
              )}
            </View>

            {isEditingMode ? (
              <>
                <TextInput placeholder="Título" placeholderTextColor={theme.subtext} style={[styles.input, {color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg}]} value={title} onChangeText={setTitle} />
                <TextInput placeholder="Conteúdo..." multiline placeholderTextColor={theme.subtext} style={[styles.input, {color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg, height: 150, textAlignVertical:'top'}]} value={desc} onChangeText={setDesc} />
                <View style={[styles.settingItem, {borderBottomWidth:0, padding:0, marginBottom:20}]}>
                  <Text style={{color: theme.text, fontWeight:'bold'}}>Bloquear com Senha?</Text>
                  <Switch value={isLocked} onValueChange={setIsLocked} />
                </View>
              </>
            ) : (
               <View style={{marginBottom:20}}>
                <Text style={{color:theme.subtext, fontSize:12, fontWeight:'bold'}}>TÍTULO</Text>
                <Text style={{color:theme.text, fontSize:22, fontWeight:'bold', marginBottom:15}}>{title}</Text>
                <Text style={{color:theme.subtext, fontSize:12, fontWeight:'bold'}}>CONTEÚDO</Text>
                <View style={{backgroundColor: theme.inputBg, padding:15, borderRadius:12}}>
                    <Text style={{color:theme.text, fontSize:16, lineHeight:24}}>{desc || "Vazio"}</Text>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDetailsVisible(false)} style={[styles.btnCancel, {borderColor:theme.border}]}><Text style={{color:theme.subtext}}>Fechar</Text></TouchableOpacity>
              {isEditingMode && (
                <TouchableOpacity onPress={handleSave} style={[styles.btnConfirm, {backgroundColor: theme.accent}]}><Text style={{color:'#000', fontWeight:'bold'}}>Salvar</Text></TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CRIAR PIN */}
      <Modal visible={createPinVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Definir Senha</Text>
            <TextInput style={[styles.input, {color:theme.text, borderColor:theme.border}]} keyboardType="numeric" maxLength={4} secureTextEntry value={newPinCode} onChangeText={setNewPinCode} />
            <TouchableOpacity onPress={handleCreatePin} style={[styles.btnConfirm, {backgroundColor: theme.primary, width:'100%', marginTop:10}]}><Text style={{color:'#FFF', fontWeight:'bold'}}>Salvar Senha</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* REUTILIZANDO O MODAL DE FILTRO (Lógica igual ao HomeScreen) */}
      <Modal visible={filterModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFilterModalVisible(false)}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                <Text style={[styles.modalTitle, {color: theme.text}]}>Ordenar Por</Text>
                <TouchableOpacity onPress={() => { setSortBy('newest'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Text style={{marginLeft:15, fontSize:16, color: theme.text}}>Mais Recentes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSortBy('oldest'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Text style={{marginLeft:15, fontSize:16, color: theme.text}}>Mais Antigos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSortBy('az'); setFilterModalVisible(false); }} style={[styles.filterOption, {borderColor: theme.border}]}>
                    <Text style={{marginLeft:15, fontSize:16, color: theme.text}}>Alfabética (A-Z)</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// --- TELA CONFIGURAÇÕES (Mantida a mesma lógica, só visual atualizado) ---
function SettingsScreen() {
  const { theme, isDark, toggleTheme, clearAllData, pin, changePin } = useController();
  const [modalVisible, setModalVisible] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleChange = () => {
    if (changePin(oldPin, newPin)) {
      Alert.alert("Sucesso", "Senha alterada!");
      setModalVisible(false); setOldPin(''); setNewPin('');
    } else {
      Alert.alert("Erro", "Senha antiga incorreta.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: 40 }]}>
      <Text style={[styles.headerTitle, { paddingHorizontal: 20, color: theme.text }]}>Configurações</Text>
      
      <View style={{marginTop: 20}}>
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.settingText, { color: theme.text }]}>Modo Escuro</Text>
            <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: "#E9E9EA", true: theme.primary }} thumbColor={"#FFF"} />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.settingText, { color: theme.text }]}>Senha do Cofre</Text>
              <Text style={{ color: theme.subtext, fontSize: 13, marginTop:5 }}>
                {pin ? "● ● ● ●" : "Não configurada"}
              </Text>
            </View>
            {pin && (
              <TouchableOpacity onPress={() => setModalVisible(true)} style={{backgroundColor: theme.inputBg, paddingVertical:8, paddingHorizontal:15, borderRadius:8}}>
                <Text style={{ color: theme.primary, fontWeight:'bold', fontSize:14 }}>ALTERAR</Text>
              </TouchableOpacity>
            )}
          </View>
      </View>

      <TouchableOpacity onPress={clearAllData} style={[styles.buttonOutline, { borderColor: theme.danger, marginTop: 40, marginHorizontal: 20 }]}>
        <Text style={{ color: theme.danger, fontWeight: 'bold' }}>LIMPAR DADOS</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
         <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Trocar Senha</Text>
            <TextInput placeholder="Senha Antiga" placeholderTextColor={theme.subtext} style={[styles.input, {color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg}]} keyboardType="numeric" maxLength={4} secureTextEntry value={oldPin} onChangeText={setOldPin} />
            <TextInput placeholder="Nova Senha" placeholderTextColor={theme.subtext} style={[styles.input, {color:theme.text, borderColor:theme.border, backgroundColor: theme.inputBg}]} keyboardType="numeric" maxLength={4} secureTextEntry value={newPin} onChangeText={setNewPin} />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.btnCancel, {borderColor:theme.border}]}><Text style={{color:theme.subtext}}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleChange} style={[styles.btnConfirm, {backgroundColor: theme.primary}]}><Text style={{color:'#FFF', fontWeight:'bold'}}>Confirmar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- NAVEGAÇÃO ---
const Tab = createBottomTabNavigator();

function MainNavigation() {
  const { theme, isDark } = useController();
  const insets = useSafeAreaInsets();
  
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: theme.card, 
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000', shadowOffset: {width:0, height:-2}, shadowOpacity:0.05,
            height: 60 + insets.bottom, 
            paddingBottom: insets.bottom, 
            paddingTop: 5
          },
          tabBarLabelStyle: { fontSize: 12, marginBottom: 5, fontWeight:'600' },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.subtext,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Afazeres') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Cofre') iconName = focused ? 'lock-closed' : 'lock-closed-outline';
            else if (route.name === 'Config') iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Afazeres" component={HomeScreen} />
        <Tab.Screen name="Cofre" component={SecureScreen} />
        <Tab.Screen name="Config" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="default" />
        <MainNavigation />
      </SafeAreaProvider>
    </AppProvider>
  );
}