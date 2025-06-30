<template>
  <div class="recuperar-senha">
    <h2>🔐 Recuperar Senha</h2>
    <form @submit.prevent="recuperarSenha">
      <label>Nome de utilizador:</label>
      <input v-model="username" required />

      <label>Nova senha:</label>
      <input type="password" v-model="novaSenha" required />

      <button type="submit">Atualizar Senha</button>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      novaSenha: '',
      mensagem: ''
    };
  },
  methods: {
    async recuperarSenha() {
      try {
        const response = await axios.post('/recuperar_senha', {
          username: this.username,
          novaSenha: this.novaSenha
        });
        this.mensagem = response.data.mensagem;
      } catch (err) {
        this.mensagem = err.response?.data?.erro || 'Erro ao tentar redefinir senha.';
      }
    }
  }
};
</script>

<style scoped>
.recuperar-senha {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
label {
  display: block;
  margin: 10px 0 5px;
}
input {
  width: 100%;
  padding: 8px;
}
button {
  margin-top: 15px;
}
.mensagem {
  margin-top: 15px;
  color: green;
}
</style>
