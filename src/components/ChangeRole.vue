<template>
  <div class="gestao-utilizadores">
    <div class="voltar-container">
      <button class="voltar-btn" @click="router.push('/home')">⬅ Voltar à Página Principal</button>
    </div>

    <header>
      <h1>Gestão de Utilizadores</h1>
    </header>

    <div class="tabela-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>NIF</th>
            <th>NIC</th>
            <th>Morada</th>
            <th>Género</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in utilizadores" :key="u._id">
            <!-- Mostrar inputs ou texto conforme o estado 'editando' -->
            <td v-if="!u.editando">{{ u.nome }}</td>
            <td v-else><input v-model="u.editandoDados.nome" /></td>

            <td v-if="!u.editando">{{ u.email }}</td>
            <td v-else><input v-model="u.editandoDados.email" /></td>

            <td v-if="!u.editando">{{ u.telefone || '-' }}</td>
            <td v-else><input v-model="u.editandoDados.telefone" /></td>

            <td v-if="!u.editando">{{ u.nif }}</td>
            <td v-else><input v-model="u.editandoDados.nif" /></td>

            <td v-if="!u.editando">{{ u.nic }}</td>
            <td v-else><input v-model="u.editandoDados.nic" /></td>

            <td v-if="!u.editando">{{ u.morada }}</td>
            <td v-else><input v-model="u.editandoDados.morada" /></td>

            <td v-if="!u.editando">{{ u.genero }}</td>
            <td v-else>
              <select v-model="u.editandoDados.genero">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </td>

            <td v-if="!u.editando">{{ u.role }}</td>
            <td v-else>
              <select v-model="u.editandoDados.role">
                <option value="cliente">cliente</option>
                <option value="doador">doador</option>
                <option v-if="user.role === 'admin'" value="empregado">empregado</option>
                <option v-if="user.role === 'admin'" value="admin">admin</option>
                <option v-if="user.role === 'admin'" value="organizador">organizador</option>
              </select>
            </td>

            <td>
              <!-- Botões de editar/salvar/cancelar e apagar -->
              <button
                v-if="!u.editando && !(user.role === 'empregado' && (u.role === 'admin' || u.role === 'organizador'))"
                @click="começarEdicao(u)"
              >
                ✏️ Editar
              </button>

              <button v-else @click="salvarEdicao(u)">💾 Salvar</button>
              <button v-if="u.editando" @click="cancelarEdicao(u)">❌ Cancelar</button>

              <button
                v-if="!(user.role === 'empregado' && (u.role === 'admin' || u.role === 'organizador'))"
                @click="apagarUtilizador(u._id)"
              >
                🗑 Apagar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="mensagem" class="mensagem">{{ mensagem }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const utilizadores = ref([]);
const mensagem = ref('');
const token = localStorage.getItem('token');
const user = ref(null);

// Buscar dados ao montar componente
onMounted(async () => {
  try {
    const perfil = await axios.get('http://localhost:3000/api/perfil', {
      headers: { Authorization: `Bearer ${token}` }
    });
    user.value = perfil.data;

    const res = await axios.get('http://localhost:3000/api/utilizadores');
    // Adiciona propriedades para controle da edição
    utilizadores.value = res.data.map(u => ({
      ...u,
      editando: false,
      editandoDados: { ...u }
    }));
  } catch (err) {
    console.error('Erro:', err);
  }
});

function começarEdicao(u) {
  u.editando = true;
  u.editandoDados = { ...u }; // clone para editar sem alterar original até salvar
  mensagem.value = '';
}

function cancelarEdicao(u) {
  u.editando = false;
  u.editandoDados = { ...u };
  mensagem.value = '';
}

async function salvarEdicao(u) {
  try {
    // Bloqueio para empregado não editar admin/organizador
    if (
      user.value.role === 'empregado' &&
      (u.editandoDados.role === 'admin' || u.editandoDados.role === 'organizador')
    ) {
      mensagem.value = 'Não tem permissão para editar administradores ou organizadores.';
      return;
    }

    if (!u.editandoDados.nome || !u.editandoDados.email) {
      mensagem.value = 'Nome e Email são obrigatórios.';
      return;
    }

    const res = await axios.put(`http://localhost:3000/api/utilizadores/${u._id}`, u.editandoDados);
    Object.assign(u, res.data);
    u.editando = false;
    mensagem.value = 'Utilizador atualizado com sucesso.';
  } catch (err) {
    mensagem.value = 'Erro ao atualizar utilizador.';
    console.error(err);
  }
}

async function apagarUtilizador(id) {
  if (!confirm('Tem certeza que quer apagar este utilizador?')) return;
  try {
    // Verificar se o usuário que vamos apagar é admin/organizador e o user atual é empregado
    const userParaApagar = utilizadores.value.find(u => u._id === id);
    if (
      user.value.role === 'empregado' &&
      (userParaApagar.role === 'admin' || userParaApagar.role === 'organizador')
    ) {
      mensagem.value = 'Não tem permissão para apagar administradores ou organizadores.';
      return;
    }

    await axios.delete(`http://localhost:3000/api/utilizadores/${id}`);
    utilizadores.value = utilizadores.value.filter(u => u._id !== id);
    mensagem.value = 'Utilizador apagado com sucesso.';
  } catch (err) {
    mensagem.value = 'Erro ao apagar utilizador.';
  }
}
</script>

<style scoped>
.tabela-container table {
  width: 100%;
  border-collapse: collapse;
}
.tabela-container th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
.mensagem {
  margin-top: 10px;
  color: green;
}
.voltar-btn {
  margin-bottom: 15px;
  cursor: pointer;
}

.voltar-container {
  margin: 20px 0;
  text-align: left;
}

.voltar-btn {
  padding: 10px 20px;
  background-color: lightblue;
  color: black;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.voltar-btn:hover {
  background-color: #0d6efd;
  color: white;
}

.gestao-utilizadores {
  padding: 40px;
  max-width: 1000px;
  margin: auto;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

header {
  background-color: #0d6efd;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 10px 10px 0 0;
}

.tabela-container {
  margin-top: 20px;
  background: white;
  border-radius: 10px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #0d6efd;
  color: white;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 6px 10px;
  background-color: crimson;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background-color: darkred;
}

.mensagem {
  margin-top: 20px;
  padding: 10px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 5px;
}
</style>
