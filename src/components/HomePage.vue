<template>
  <div>
    <header>
      <h1>FromU2Me</h1>

      <nav class="nav-container">
        <ul class="nav-center">
          <li><router-link to="/home">Início</router-link></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>

        <div class="nav-right">
          <button
            v-if="user && (user.role === 'admin' || user.role === 'empregado')"
            @click="goTo('/registroEquipamento')"
          >
            Gerir Equipamentos
          </button>

          <button
            v-if="user && (user.role === 'admin' || user.role === 'empregado')"
            @click="goTo('/addToCatalog')"
          >
            Adicionar ao Catálogo
          </button>

          <button
            v-if="user"
            @click="goTo('/infoUtilizador')"
          >
            {{ user.nome }}
          </button>

          <button
            v-if="user && user.role === 'admin'"
            @click="goTo('/criarLoja')"
          >
            Criar Loja
          </button>

          

              <button
            v-if="user && (user.role === 'admin' || user.role === 'empregado' || user.role === 'organizador' )"
            @click="goTo('/gestao-projetos')"
          >
            Gerir Projetos
          </button>

           <button
            v-if="user && user.role === 'admin'"
            @click="goTo('/historicoTransaccoesGeral')"
          >
            Hístórico de transações
          </button>

          <button
            v-if="user && (user.role === 'admin' || user.role === 'empregado')"
            @click="goTo('/changerole')"
          >
            Alterar Role
          </button>


         <button
        v-if="user"
        @click="goTo('/vender')"
        aria-label="Vender equipamento"
      >
        Vender equipamento
      </button>


          <button
            v-if="user && (user.role === 'admin' || user.role === 'empregado')"
            @click="goTo('/avaliarEquipamento')"
          >
            Avaliar Equipamento Avariado
          </button>
        </div>

        <!-- Botão Logout -->
        <button v-if="user" @click="logout">
          Logout
        </button>
      </nav>

      <button @click="finalizarCompra()" id="carrinhoBtn">
        🛒 Carrinho ({{ carrinhoCount }})
      </button>
    </header>

    <section class="banner">
      <h2>Os melhores equipamentos eletrônicos para você!</h2>
      <p>Confira nossas ofertas e garanta já o seu.</p>
    </section>

    <section>
      <form @submit.prevent="filtrarEquipamentos">
        <input
          type="text"
          v-model="filtro.nome"
          placeholder="Pesquisar por nome"
        />


        <select v-model="filtro.marca">
          <option value="">Todas as marcas</option>
          <option v-for="m in marcasUnicas" :key="m" :value="m">{{ m }}</option>
        </select>

        <select v-model="filtro.modelo">
          <option value="">Todos os modelos</option>
          <option v-for="mod in modelosUnicos" :key="mod" :value="mod">{{ mod }}</option>
        </select>

        <button type="submit">Filtrar</button>
      </form>

      <div v-if="resultados.length">
        <div v-for="equipamento in resultados" :key="equipamento._id">
          <strong>{{ equipamento.nome }}</strong> - {{ equipamento.marca }} - {{ equipamento.modelo }} - €{{ equipamento.preco }}
        </div>
      </div>
      <p v-else>Nenhum equipamento encontrado.</p>
      
    
    </section>

  <section id="produtos" class="produtos" v-if="!carregando">
  <div
    class="produto"
    v-for="equipamento in equipamentosDisponiveis"
    :key="equipamento._id"
    @click="goTo(`/produto/${equipamento._id}`)"
    style="cursor: pointer;"
  >
        <img
          :src="equipamento.imagem ? equipamento.imagem : '/images/default.jpg'"
          alt="Imagem do equipamento"
        />
        <h3>{{ equipamento.nome }}</h3>
        <p>{{ equipamento.modelo }} - {{ equipamento.marca }}</p>

        <p v-if="getQuantidade(equipamento._id) > 0">
          Já no carrinho: {{ getQuantidade(equipamento._id) }}x
        </p>
        <span>Euros {{Number(equipamento.preco || 0).toLocaleString('pt-PT', {minimumFractionDigits: 2})}}</span>

        
        <button
            v-if="user"
            class="favoritar-btn"
            :class="{ favorito: favoritosMap[equipamento._id] }"
            @click.stop.prevent="alternarFavorito(equipamento._id)"
          >
           {{ favoritosMap[equipamento._id] ? '★ Remover Favorito' : '☆ Favoritar' }}
          </button>
        </div>
      </section>


    


    <section id="contato" class="contato">
      <h2>Entre em contato</h2>
      <p>Email: contato@fromu2me.com</p>
      <p>Telefone: (11) 99999-9999</p>
    </section>

    <footer>
      <p>&copy; 2025 Loja Tech - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useCarrinhoStore } from '@/stores/carrinho';

// Para enviar cookies de sessão em todas as requisições
axios.defaults.withCredentials = true;


const carrinhoStore = useCarrinhoStore();
const carrinho = computed(() => carrinhoStore.equipamentos);
const carrinhoCount = computed(() =>
  carrinho.value.reduce((total, item) => total + (item.quantidade || 1), 0)
);

const router = useRouter();
const equipamentos = ref([]);
const user = ref(null);
const favoritos = ref([]);
const favoritosCarregados = ref(false);
const favoritosMap = ref({});
const carregando = ref(true);


const equipamentosDisponiveis = computed(() =>
  (resultados.value.length ? resultados.value : equipamentos.value).filter(
    e => e.disponivel !== false && e.quantidade !== 0
  )
);


const filtro = ref({
  nome: '',
  marca: '',
  modelo: ''
});

const resultados = ref([]);
const marcasUnicas = computed(() => {
  const marcas = equipamentos.value.map(e => e.marca);
  return [...new Set(marcas)].filter(Boolean);
});

const modelosUnicos = computed(() => {
  const modelos = equipamentos.value.map(e => e.modelo);
  return [...new Set(modelos)].filter(Boolean);
});

function logout() {
  // Chama API de logout para destruir sessão no backend, caso exista.
  axios.post('/logout', {}, { withCredentials: true })
    .then(() => {
      user.value = null;
      router.push('/login');
    })
    .catch(() => {
      // Mesmo em erro, remove usuário local e redireciona
      user.value = null;
      router.push('/login');
    });
}

// Função para carregar todos os favoritos do usuário ao montar o componente
async function carregarFavoritos() {
  try {
    const res = await axios.get('/favoritos', {
      withCredentials: true
    });
   console.log(res.data);
    favoritosMap.value = {};
res.data.forEach(e => {
  favoritosMap.value[e._id] = true;
});

    favoritos.value = res.data.map(e => String(e._id));
     console.log(favoritos);

  } catch (err) {
    console.error('Erro ao carregar favoritos:', err);
  } finally {
    favoritosCarregados.value = true;
  }
}

async function alternarFavorito(idEquipamento) {
  const favoritoAtual = favoritosMap.value[idEquipamento];

  try {
    if (favoritoAtual) {
      await axios.post(
        `/remover-favorito/${idEquipamento}`,
        {},
        { withCredentials: true }
      );
      favoritosMap.value[idEquipamento] = false;
    } else {
      await axios.post(
        `/favoritar/${idEquipamento}`,
        {},
        { withCredentials: true }
      );
      favoritosMap.value[idEquipamento] = true;
    }
  } catch (err) {
    console.error('Erro ao alternar favorito:', err);
    alert('Erro ao atualizar favorito');
  }
}

async function verificarFavorito(idEquipamento) {
  try {
    const res = await axios.get(`/favorito/${idEquipamento}`, {
      withCredentials: true
    });
    favoritosMap.value[idEquipamento] = res.data.favorito;
  } catch (err) {
    console.error(`Erro ao verificar favorito para o equipamento ${idEquipamento}:`, err);
  }
}

function getQuantidade(id) {
  const item = carrinho.value.find(p => p._id === id);
  return item ? item.quantidade : 0;
}

function finalizarCompra() {
  router.push('/comprar');
}

function goTo(path) {
  router.push(path);
}

async function filtrarEquipamentos() {
  try {
    const paramsObj = {};
    Object.entries(filtro.value).forEach(([key, val]) => {
      if (val) paramsObj[key] = val;
    });

    const res = await axios.get('/equipamentos/search', {
      params: paramsObj
    });

    resultados.value = res.data;

    // Atualizar favoritos para os resultados filtrados
    if (user.value) {
      for (const equipamento of resultados.value) {
        await verificarFavorito(equipamento._id);
      }
    }
  } catch (error) {
    console.error('Erro ao filtrar equipamentos:', error);
  }
}

onMounted(async () => {
  try {
    const resSessao = await axios.get('/session', { withCredentials: true });
    console.log('Sessão ativa?', resSessao.data.authenticated);

    // Pega equipamentos
    const res = await axios.get('/equipamentos');
    equipamentos.value = res.data;

    // Busca usuário
    const resUser = await axios.get('/perfil', {
      withCredentials: true
    });
    user.value = resUser.data;

    // Carrega favoritos depois de termos os equipamentos
    if (user.value) {
      await carregarFavoritos();
    }

  } catch (err) {
    console.error('Erro ao buscar dados iniciais:', err);
  } finally {
    carregando.value = false;
  }
});

</script>

<style scoped>

.favoritar-btn.favorito {
  color: gold;
  font-weight: bold;
}

.favoritar-btn {
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 1.2em;
  transition: color 0.3s ease;
}

.favoritar-btn.favorito {
  color: red; /* Coração vermelho quando favoritado */
  font-weight: bold;
}

/* Header */
header {
  background: #0d6efd;
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 10px 10px;
  margin-bottom: 30px;
}

h1 {
  margin: 10;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

/* Botão "Criar Conta" fora da barra central */
.top-create-btn {
  position: absolute;
  top: auto;
  right: 20px;
  background-color: white;
  color: #0d6efd;
  border: 2px solid white;
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  width: auto !important;
}


.top-create-btn:hover {
  background-color: #0d6efd;
  color: white;
  border-color: #ffffff;
}


/* Barra central de navegação */
nav.nav-container {
  max-width: max-content;
  margin: 0 auto 40px auto;
  background: #0d6efd;
  border: 2px solid white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  box-sizing: border-box;
}

ul.nav-center {
  list-style: none;
  display: flex;
  gap: auto;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  justify-content: center;
}

ul.nav-center li a {
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

ul.nav-center li a:hover {
  background-color: #084298;
  cursor: pointer;
}


 #carrinhoBtn, #checkoutBtn {
  padding: 10px 20px;
  background-color: #198754;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}

#carrinhoBtn:hover, #checkoutBtn:hover {
  background-color: #157347;
}

  header {
    background: #0d6efd;
    color: #fff;
    padding: 20px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }


.nav-right {
  margin-left: auto;
}

.nav-right button {
  background-color: white;
  color: #0d6efd;
  border: 3px solid #0d6efd;
  padding: 12px 25px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-right button:hover {
  background-color: #0d6efd;
  color: white;
  border-color: white;
}
/* Banner */
.banner {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(to right, #0d6efd, #6610f2);
  color: #fff;
}

/* Botão de registo extra no banner */
.botao-registar {
  margin-top: 20px;
}

.botao-registar button {
  background-color: white;
  color: #0d6efd;
  border: 3px solid white;
  padding: 12px 25px;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.botao-registar button:hover {
  background-color: #0d6efd;
  color: white;
  border-color: white;
}

/* Produtos */
.produtos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.produto {
  background: #fff;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.produto img {
  max-width: 100%;
  border-radius: 5px;
}

/* Contato */
.contato {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
}

/* Footer */
footer {
  background: #0d6efd;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  margin-top: 40px;
  border-radius: 10px 10px 0 0;
}

/* Responsividade */
@media (max-width: 600px) {
  nav.nav-container {
    flex-direction: column;
    gap: 10px;
  }

  ul.nav-center {
    justify-content: center;
  }

  .nav-right {
    margin-left: 0;
  }

  .nav-right button {
    width: 100%;
  }
}
</style>
