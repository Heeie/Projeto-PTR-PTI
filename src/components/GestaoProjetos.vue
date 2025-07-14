<template>
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

  <div class="gestao-projetos">
    <h2>Gestão de Projetos Beneficentes</h2>
    <button class="voltar-btn" @click="voltarParaHome">⬅ Voltar à Página Principal</button>


    <form @submit.prevent="salvarProjeto">
      <input
        type="text"
        placeholder="Nome do projeto"
        v-model="form.nome"
        required
      />
      <textarea
        placeholder="Descrição do projeto"
        v-model="form.descricao"
      ></textarea>

      <!-- Select para escolher organizador -->
      <select v-model="form.organizador_id" required>
        <option value="" disabled>Selecione o organizador</option>
        <option v-for="organizador in organizadores" :key="organizador._id" :value="organizador._id">
          {{ organizador.nome }}
        </option>
      </select>

      <!-- Select para escolher o estado do projeto -->
      <select v-model="form.estado" required>
        <option value="" disabled>Selecione o estado</option>
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluido">Concluído</option>
        <option value="cancelado">Cancelado</option>
      </select>

      <button type="submit">{{ form._id ? 'Atualizar' : 'Criar' }}</button>
      <button v-if="form._id" type="button" @click="cancelarEdicao">Cancelar</button>
    </form>

    <div v-if="projetos.length === 0">
      <p>Nenhum projeto encontrado.</p>
    </div>

    <ul v-else class="lista-projetos">
      <li v-for="projeto in projetos" :key="projeto._id">
        <h3>{{ projeto.nome }}</h3>
        <p>{{ projeto.descricao }}</p>
        <p><strong>Organizador:</strong> {{ getOrganizadorNome(projeto.organizador_id) }}</p>
        <p><strong>Estado:</strong> {{ projeto.estado }}</p>
        <button @click="editarProjeto(projeto)">Editar</button>
        <button @click="removerProjeto(projeto._id)">Apagar</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import axios from "axios";

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Para enviar cookies de sessão em todas as requisições
axios.defaults.withCredentials = true;





const router = useRouter();
const equipamentos = ref([]);
const user = ref(null);
const favoritos = ref([]);
const favoritosCarregados = ref(false);
const favoritosMap = ref({});
const carregando = ref(true);







// Função para carregar todos os favoritos do usuário ao montar o componente
async function carregarFavoritos() {
  try {
    const res = await axios.get('/utilizadores/favoritos', {
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





function goTo(path) {
  router.push(path);
}


onMounted(async () => {
  try {
    const resSessao = await axios.get('/session', { withCredentials: true });
    console.log('Sessão ativa?', resSessao.data.authenticated);

    // Pega equipamentos
    const res = await axios.get('/equipamentos');
    equipamentos.value = res.data;

    // Busca usuário
    const resUser = await axios.get('/utilizadores/perfil', {
      withCredentials: true
    });
    user.value = resUser.data;

    // Carrega favoritos depois de termos os equipamentos a
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
.gestao-projetos {
  max-width: 600px;
  margin: 20px auto;
  font-family: 'Poppins', sans-serif;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

input[type="text"],
textarea,
select {
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: fit-content;
  padding: 8px 16px;
  margin-right: 8px;
  background-color: #0d6efd;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0b5ed7;
}

.lista-projetos {
  list-style: none;
  padding: 0;
}

.lista-projetos li {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  background-color: #fff;
}

.lista-projetos h3 {
  margin: 0 0 5px 0;
}

.lista-projetos button {
  background-color: #dc3545;
  margin-top: 10px;
}

.lista-projetos button:first-of-type {
  background-color: #0d6efd;
  margin-right: 10px;
}
</style>
