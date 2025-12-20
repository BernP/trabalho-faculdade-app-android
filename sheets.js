import { StyleSheet, Platform } from 'react-native';

export const Cores = {
  light: {
    background: '#F2F6FF', // Um azul muito pálido, mais moderno que cinza
    card: '#FFFFFF',
    text: '#1A1A1A',
    subtext: '#8E8E93',
    primary: '#6C63FF', // Roxo mais vibrante
    accent: '#00D2D3', // Ciano vibrante
    danger: '#FF6B6B',
    border: '#E5E5EA',
    inputBg: '#F2F2F7'
  },
  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subtext: '#A1A1AA',
    primary: '#8B85FF',
    accent: '#00D2D3',
    danger: '#FF6B6B',
    border: '#2C2C2E',
    inputBg: '#2C2C2E'
  }
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header Moderno
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 15,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '800', // Extra bold
    marginBottom: 5 
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500'
  },

  // Barra de Busca e Filtro
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15
  },
  searchBar: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25, // Totalmente arredondado
    borderWidth: 0, // Sem borda feia
  },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3
  },

  // Cartões Premium
  card: {
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 16,
    borderWidth: 0,
    // Sombras suaves (iOS/Android)
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', flex: 1 },
  cardDesc: { fontSize: 14, lineHeight: 20 },
  cardDate: { fontSize: 12, fontWeight: '600', marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Botão Flutuante (FAB)
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8
  },

  // Modais e Inputs
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' // Modal vem de baixo
  },
  modalContent: {
    width: '100%', padding: 25, 
    borderTopLeftRadius: 25, borderTopRightRadius: 25, 
    paddingBottom: 40
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  input: {
    width: '100%', borderWidth: 1, borderRadius: 12, padding: 15, 
    fontSize: 16, marginBottom: 15
  },
  
  modalButtons: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 10, gap: 15 },
  btnCancel: { flex:1, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent:'center', borderWidth: 1, borderColor: 'transparent' },
  btnConfirm: { flex:1, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent:'center', elevation: 2 },

  // Configurações
  settingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 20, paddingHorizontal: 20, borderBottomWidth: 1
  },
  settingText: { fontSize: 17, fontWeight: '500' },
  buttonOutline: {
    padding: 16, borderRadius: 12, borderWidth: 1.5, alignItems: 'center'
  },

  // Filtros (Chips)
  filterOption: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 0.5
  }
});