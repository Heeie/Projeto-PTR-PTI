<template>
  <div class="detalhes">
    <header>
      <h1>Alterar Roles</h1>
      <button @click="voltar">← Voltar</button>
    </header>

    <section>
      <input
        v-model="nomeBusca"
        type="text"
        placeholder="Nome do utilizador"
      />
      <button @click="buscarUtilizador">Buscar</button>
    </section>

    <div v-if="utilizador" class="info-utilizador">
      <h2>{{ utilizador.nome }}</h2>
      <p>Email: {{ utilizador.email }}</p>
      <p>Role atual: <strong>{{ utilizador.role }}</strong></p>

      <label for="novaRole">Nova Role:</label>
      <select id="novaRole" v-model="novaRole">
        <option value="cliente">cliente</option>
        <option value="admin">admin</option>
        <option value="empregado">empregado</option>
      </select>

      <button @click="alterarRole">Alterar Role</button>
    </div>

    <div v-if="mensagem" class="mensagem">{{ mensagem }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const nomeBusca = ref('');
const utilizador = ref(null);
const novaRole = ref('');
const mensagem = ref('');

function voltar() {
  router.back();
}

async function buscarUtilizador() {
  try {
    const res = await axios.get(`http://localhost:3000/api/utilizadores/nome/${nomeBusca.value}`);
    utilizador.value = res.data;
    novaRole.value = res.data.role;
    mensagem.value = '';
  } catch (err) {
    utilizador.value = null;
    mensagem.value = 'Utilizador não encontrado.';
  }
}

async function alterarRole() {
  if (!utilizador.value || !novaRole.value) return;

  try {
    const res = await axios.put(`http://localhost:3000/api/utilizadores/${utilizador.value._id}`, {
      role: novaRole.value,
    });

    utilizador.value = res.data;
    mensagem.value = 'Role atualizada com sucesso!';
  } catch (err) {
    console.error(err);
    mensagem.value = 'Erro ao atualizar role.';
  }
}
</script>

<style scoped>
.detalhes {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

input,
select {
  padding: 10px;
  margin: 10px 0;
  width: 100%;
}

button {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #084298;
}

.info-utilizador {
  margin-top: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.mensagem {
  margin-top: 20px;
  font-weight: bold;
  color: green;
}
</style>
