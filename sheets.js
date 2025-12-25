import { StyleSheet, Platform } from 'react-native';

// --- DEFINIÇÃO DAS NOVAS PALETAS DE CORES ---
export const Cores = {
  // Paleta CLARA (Baseada nos Amarelos/Laranjas)
  light: {
    background: '#FFF9E6', // Um creme bem claro para o fundo
    card: '#FFFFFF',       // Cartões brancos para destaque
    text: '#333333',       // Texto cinza escuro para contraste
    subtext: '#888888',    // Texto secundário mais suave
    primary: '#FFC72C',    // Amarelo principal da paleta
    accent: '#FF8B2B',     // Laranja de destaque
    danger: '#FF6B6B',     // Vermelho para perigo
    border: '#E0E0E0',     // Bordas cinza claro
    inputBg: '#F5F5F5'     // Fundo de inputs
  },
  // Paleta ESCURA (Baseada nos Azuis/Roxos)
  dark: {
    background: '#0F172A', // Um azul marinho muito escuro para o fundo
    card: '#1E293B',       // Um tom de azul um pouco mais claro para os cartões
    text: '#F8FAFC',       // Texto quase branco
    subtext: '#94A3B8',    // Texto secundário azul-acinzentado
    primary: '#2B44FF',    // Azul vibrante principal da paleta
    accent: '#9C2BFF',     // Roxo de destaque
    danger: '#FF6B6B',     // Vermelho para perigo
    border: '#334155',     // Bordas em azul-acinzentado escuro
    inputBg: '#1E293B'     // Fundo de inputs (igual ao cartão)
  }
};

export const styles = StyleSheet.create({
  container: { flex: 1 },
  
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 15,
  },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '800',
    marginBottom: 5 
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
    borderRadius: 25,
    borderWidth: 0, 
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


  card: {
    borderRadius: 16, 
    padding: 18, 
    marginBottom: 16,
    borderWidth: 0,

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


  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 60, height: 60,
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },

  // Modais e Inputs
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end'
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
  btnCancel: { flex:1, padding: 15, borderRadius: 12, alignItems: 'center', justifyContent:'center', borderWidth: 1 },
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