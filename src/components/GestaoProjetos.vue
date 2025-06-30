<template>
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

<script>
import axios from "axios";

export default {
  name: "GestaoProjetos",

  data() {
    return {
      projetos: [],
      form: {
        _id: null,
        nome: "",
        descricao: "",
        organizador_id: "",
        estado: "",
      },
      organizadores: [],
    };
  },

  created() {
    this.carregarProjetos();
    this.carregarOrganizadores();
  },

  methods: {
    voltarParaHome() {
      this.$router.push('/home');
    },

    async carregarProjetos() {
      try {
        const res = await axios.get("http://localhost:3000/api/projetos/projetos", {
          withCredentials: true,
        });
        this.projetos = res.data;
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        alert("Erro ao carregar projetos.");
      }
    },

    async carregarOrganizadores() {
      try {
        const res = await axios.get("http://localhost:3000/api/utilizadores?role=organizador", {
          withCredentials: true,
        });
        this.organizadores = res.data;
      } catch (error) {
        console.error("Erro ao carregar organizadores:", error);
        alert("Erro ao carregar organizadores.");
      }
    },

    async salvarProjeto() {
      try {
        if (this.form._id) {
          const res = await axios.put(
            `http://localhost:3000/api/projetos/projetos/${this.form._id}`,
            this.form,
            { withCredentials: true }
          );
          alert(res.data.message);
        } else {
          const res = await axios.post(
            "http://localhost:3000/api/projetos/cria-projeto",
            this.form,
            { withCredentials: true }
          );
          alert(res.data.message);
        }
        this.limparFormulario();
        this.carregarProjetos();
      } catch (error) {
        console.error("Erro ao salvar projeto:", error);
        alert("Erro ao salvar projeto.");
      }
    },

    editarProjeto(projeto) {
      this.form = {
        ...projeto,
        organizador_id:
          typeof projeto.organizador_id === "object" && projeto.organizador_id !== null
            ? projeto.organizador_id._id
            : projeto.organizador_id,
      };
    },

    cancelarEdicao() {
      this.limparFormulario();
    },

    limparFormulario() {
      this.form = {
        _id: null,
        nome: "",
        descricao: "",
        organizador_id: "",
        estado: "",
      };
    },

    async removerProjeto(id) {
      if (!confirm("Tem certeza que deseja apagar este projeto?")) return;
      try {
        const res = await axios.delete(
          `http://localhost:3000/api/projetos/projetos/${id}`,
          { withCredentials: true }
        );
        alert(res.data.message);
        this.carregarProjetos();
      } catch (error) {
        console.error("Erro ao apagar projeto:", error);
        alert("Erro ao apagar projeto.");
      }
    },

    getOrganizadorNome(id) {
      const organizadorId = typeof id === "object" && id !== null ? id._id : id;
      const org = this.organizadores.find((o) => String(o._id) === String(organizadorId));
      return org ? org.nome : "Desconhecido";
    },
  },
};
</script>


<style scoped>
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
