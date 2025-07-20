<template>
  <div>
    <header>
      <h1>FromU2Me</h1>
      <button class="top-create-btn" @click="$router.push('/home')">
        Voltar ao Home
      </button>
    </header>

    <section class="banner">
      <p>Informações do Utilizador</p>
    </section>

    <section class="perfil">
      <h2>Perfil do Utilizador</h2>

      <div v-if="mensagem.texto" :class="['mensagem', mensagem.tipo]">
        {{ mensagem.texto }}
      </div>

      <!-- VISUALIZAÇÃO -->
      <div v-if="!editando">
        <p><strong>Nome:</strong> {{ user.nome }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Telefone:</strong> {{ user.telefone }}</p>
        <p><strong>Data de Nascimento:</strong> {{ formatarData(user.dataNascimento) }}</p>
        <p><strong>NIF:</strong> {{ user.nif }}</p>
        <p><strong>NIC:</strong> {{ user.nic }}</p>
        <p><strong>Morada:</strong> {{ user.morada }}</p>
        <p><strong>Gênero:</strong> {{ user.genero }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>

        <button id="regisbtn" @click="editando = true">Editar</button>
      </div>

      <!-- EDIÇÃO -->
      <div v-else>
        <label>Nome: <input v-model="user.nome" /></label><br>
        <label>Email: <input v-model="user.email" /></label><br>
        <label>Telefone: <input v-model="user.telefone" /></label><br>
        <label>NIF: <input v-model="user.nif" /></label><br>
        <label>NIC: <input v-model="user.nic" /></label><br>
        <label>Data de Nascimento: <input type="date" v-model="user.dataNascimento" /></label><br>

        <h3>Alterar Palavra-passe</h3>
        <label>Palavra-passe atual: <input type="password" v-model="senhaAntiga" /></label><br>
        <label>Nova Palavra-passe: <input type="password" v-model="novaSenha" /></label><br>
        <label>Confirmar Palavra-passe: <input type="password" v-model="confirmarSenha" /></label><br>
        <button @click="alterarSenha">Alterar Palavra-passe</button>

        <label>Morada: <input v-model="user.morada" @blur="atualizarMapa" /></label><br>

        <!-- Google Maps -->
        <div v-if="user.morada && mapUrl">
          <iframe
            :src="mapUrl"
            width="100%"
            height="300"
            style="border:0; border-radius: 10px; margin-top: 10px;"
            allowfullscreen
            loading="lazy"
          ></iframe>
          <p style="margin-top: 8px;">
            <a :href="mapLinkUrl" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a>
          </p>
        </div>
        <p v-if="!mapUrl" style="color: red; font-weight: bold;">
          API Key do Google Maps inválida.
        </p>

        <label>Gênero:
          <select v-model="user.genero">
            <option>Masculino</option>
            <option>Feminino</option>
            <option>Outro</option>
          </select>
        </label><br>

        <button id="regisbtn" @click="salvarAlteracoes">Guardar</button>
        <button id="regisbtn" @click="editando = false">Cancelar</button>
        <button id="regisbtn" @click="mostrarConfirmacao = true" style="background-color: crimson; color: white;">Apagar Conta</button>
      </div>

      <!-- Confirmação Apagar Conta -->
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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        nome: '',
        email: '',
        telefone: '',
        nif: '',
        nic: '',
        morada: '',
        genero: '',
        role: '',
        id: '',
        dataNascimento: ''
      },
      editando: false,
      mostrarConfirmacao: false,
      senhaConfirmacao: '',
      senhaAntiga: '',
      novaSenha: '',
      confirmarSenha: '',
      mensagem: {
        texto: '',
        tipo: ''
      },
      mapUrl: ''
    };
  },

  computed: {
    mapLinkUrl() {
      const morada = encodeURIComponent(this.user.morada || '');
      return `https://www.google.com/maps/search/?api=1&query=${morada}`;
    }
  },

  mounted() {
    this.recuperarInfo();
  },

  methods: {
    atualizarMapa() {
      const key = 'AIzaSyD1ExzCG0BiDRv3fQEu4XimkLHERysDxL8';
      if (!this.user.morada || !key) return this.mapUrl = null;
      const moradaFormatada = encodeURIComponent(this.user.morada);
      this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${moradaFormatada}`;
    },

    mostrarMensagem(texto, tipo = 'sucesso') {
      this.mensagem = { texto, tipo };
      setTimeout(() => { this.mensagem.texto = ''; }, 4000);
    },

    formatarParaInputDate(data) {
      const d = new Date(data);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    },

    formatarData(data) {
      return new Date(data).toLocaleDateString();
    },

    async recuperarInfo() {
      try {
<<<<<<< Updated upstream
        const res = await axios.get('/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

=======
        const res = await axios.get('http://localhost:3000/api/perfil', { withCredentials: true });
>>>>>>> Stashed changes
        this.user = {
          ...res.data,
          id: res.data._id || res.data.id,
          dataNascimento: this.formatarParaInputDate(res.data.dataNascimento)
        };
        this.atualizarMapa();
      } catch {
        this.mostrarMensagem('Erro ao carregar perfil. Faça login novamente.', 'erro');
        this.$router.push('/login');
      }
    },

    async salvarAlteracoes() {
      try {
<<<<<<< Updated upstream
        const res = await axios.put(`/utilizadores/${this.user.id}`, this.user, {
=======
        const dadosAtualizados = {
          ...this.user,
          dataNascimento: new Date(this.user.dataNascimento).toISOString()
        };
        const res = await axios.put(`http://localhost:3000/api/utilizadores/${this.user.id}`, dadosAtualizados, {
>>>>>>> Stashed changes
          withCredentials: true
        });
        this.user = {
          ...res.data,
          id: res.data._id || res.data.id,
          dataNascimento: this.formatarParaInputDate(res.data.dataNascimento)
        };
        this.editando = false;
        this.atualizarMapa();
        this.mostrarMensagem('Informações atualizadas com sucesso!');
      } catch {
        this.mostrarMensagem('Erro ao atualizar informações.', 'erro');
      }
    },

    async alterarSenha() {
      if (!this.senhaAntiga || !this.novaSenha || !this.confirmarSenha)
        return this.mostrarMensagem('Preencha todos os campos.', 'erro');

      if (this.novaSenha !== this.confirmarSenha)
        return this.mostrarMensagem('As palavras-passe não coincidem.', 'erro');

      try {
        await axios.put(`http://localhost:3000/api/utilizadores/alterarSenha`, {
          senhaAntiga: this.senhaAntiga,
          novaSenha: this.novaSenha
        }, { withCredentials: true });

        this.mostrarMensagem('Palavra-passe alterada com sucesso.');
        this.senhaAntiga = this.novaSenha = this.confirmarSenha = '';
      } catch {
        this.mostrarMensagem('Erro ao alterar palavra-passe.', 'erro');
      }
    },

    async apagarConta() {
      if (!this.senhaConfirmacao)
        return this.mostrarMensagem('Por favor, insira sua palavra-passe.', 'erro');

      try {
        const verificar = await axios.post(`/utilizadores/${this.user.id}/verificarSenha`, {
          senha: this.senhaConfirmacao
        }, { withCredentials: true });

        if (!verificar.data.valido)
          return this.mostrarMensagem('Palavra-passe incorreta.', 'erro');

<<<<<<< Updated upstream
        await axios.delete(`/utilizadores/${this.user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
=======
        await axios.delete(`http://localhost:3000/api/utilizadores/${this.user.id}`, {
          withCredentials: true
>>>>>>> Stashed changes
        });

        this.mostrarMensagem('Conta apagada com sucesso.');
        this.$router.push('/inicio');
      } catch {
        this.mostrarMensagem('Erro ao apagar conta.', 'erro');
      }
    }
  }
};
</script>

<style scoped>
.confirm-box {
  background-color: #fff0f0;
  border: 1px solid red;
  padding: 16px;
  margin-top: 16px;
  border-radius: 8px;
}

.mensagem {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  font-weight: bold;
}

.mensagem.sucesso {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensagem.erro {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

header {
  background: #0d6efd;
  color: #fff;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

#regisbtn {
  padding: 10px 20px;
  background-color: lightblue;
  font-weight: bold;
  border: none;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s;
}

#regisbtn:hover {
  background-color: #0d6efd;
  color: white;
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
</style>
