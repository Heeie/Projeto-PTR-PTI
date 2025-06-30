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
        id: ''
      },
      editando: false,
      mostrarConfirmacao: false,
      senhaConfirmacao: ''
    };
  },

  async mounted() {
    await this.recuperarInfo();
  },

  methods: {
    async recuperarInfo() {
      const token = localStorage.getItem('token');

      try {
        const res = await axios.get('http://localhost:3000/api/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.user = {
          ...res.data,
          id: res.data._id || res.data.id
        };
      } catch (err) {
        console.error('Erro ao carregar perfil:', err.response?.data || err.message);
      }
    },

    async salvarAlteracoes() {
      if (!this.user.id) {
        alert('ID do utilizador ausente. Tente recarregar a página.');
        return;
      }

      if (!this.user.nome || !this.user.email) {
        alert('Nome e email são obrigatórios.');
        return;
      }

      try {
        const res = await axios.put(`http://localhost:3000/api/utilizadores/${this.user.id}`, this.user, {
          withCredentials: true
        });

        this.user = {
          ...res.data,
          id: res.data._id || res.data.id
        };

        this.editando = false;
        alert('Informações atualizadas com sucesso!');
      } catch (err) {
        console.error('Erro ao atualizar perfil:', err.response?.data || err.message);
        alert('Erro ao atualizar informações.');
      }
    },

    async apagarConta() {
      if (!this.senhaConfirmacao) {
        alert('Por favor, insira sua palavra-passe.');
        return;
      }

      try {
        const verificar = await axios.post(`http://localhost:3000/api/utilizadores/${this.user.id}/verificarSenha`, {
          senha: this.senhaConfirmacao
        });

        if (!verificar.data.valido) {
          alert('Palavra-passe incorreta.');
          return;
        }

        await axios.delete(`http://localhost:3000/api/utilizadores/${this.user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        alert('Conta apagada com sucesso.');
        localStorage.removeItem('token');
        this.$router.push('/inicio'); // ou '/login'

      } catch (err) {
        console.error('Erro ao apagar conta:', err.response?.data || err.message);
        alert('Erro ao apagar conta.');
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
