<template>
  <div>
    <header>
      <h1>FromU2Me</h1> 
      <nav>
        <ul>
          <li><router-link to="/home">Início</router-link></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </nav>
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
          Vender Equipamento
        </button>
      </div>
          
    </header>

    <section class="banner">
      <p>Informações do Utilizador</p>
    </section>

    <section class="perfil">
      <h2>Perfil do Utilizador</h2>

      <div v-if="!editando">
        <p><strong>Nome:</strong> {{ user.nome }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Telefone:</strong> {{ user.telefone }}</p>
        <p><strong>NIF:</strong> {{ user.nif }}</p>
        <p><strong>NIC:</strong> {{ user.nic }}</p>
        <p><strong>Morada:</strong> {{ user.morada }}</p>
        <p><strong>Gênero:</strong> {{ user.genero }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>

        <button id="regisbtn" @click="editando = true">Editar</button>
      </div>

      <div v-else>
        <label>Nome: <input v-model="user.nome" /></label><br>
        <label>Email: <input v-model="user.email" /></label><br>
        <label>Telefone: <input v-model="user.telefone" /></label><br>
        <label>NIF: <input v-model="user.nif" /></label><br>
        <label>NIC: <input v-model="user.nic" /></label><br>
        <label>Morada: <input v-model="user.morada" /></label><br>
        <label>Gênero: 
          <select v-model="user.genero">
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Outro</option>
          </select>
        </label><br>

        <button id="regisbtn" @click="salvarAlteracoes">Guardar</button>
        <button id="regisbtn" @click="editando = false">Cancelar</button>
        <button id="regisbtn" @click="mostrarConfirmacao = true" style="background-color: crimson; color: white;">
          Apagar Conta
        </button>
      </div>

      <div v-if="mostrarConfirmacao" class="confirm-box">
        <h3>⚠️ Confirmar Exclusão da Conta</h3>
        <p>Digite sua palavra-passe para confirmar:</p>
        <input type="password" v-model="senhaConfirmacao" placeholder="Palavra-passe" />
        <br />
        <button @click="apagarConta" style="background-color: crimson; color: white;">Confirmar Apagar</button>
        <button @click="mostrarConfirmacao = false">Cancelar</button>
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
.confirm-box {
  background-color: #fff0f0;
  border: 1px solid red;
  padding: 16px;
  margin-top: 16px;
  border-radius: 8px;
}

header {
  background: #0d6efd;
  color: #fff;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#regisbtn {
  padding: 10px 20px;
  background-color: lightblue;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

#regisbtn:hover {
  background-color: #0d6efd;
  color: white;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}

.banner {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(to right, #0d6efd, #6610f2);
  color: #fff;
}

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

.contato {
  text-align: center;
  padding: 40px 20px;
  background-color: #f8f9fa;
}

footer {
  background: #0d6efd;
  color: #fff;
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  font-size: 14px;
}

.perfil {
  padding: 40px;
  text-align: center;
  background-color: #f0f2f5;
  margin: 20px auto;
  max-width: 600px;
  border-radius: 10px;
}

.perfil input,
.perfil select {
  padding: 8px;
  margin: 5px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

</style>
