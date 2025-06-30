<template>
  <div class="vender-container">
    <h2>Vender Equipamento à Loja</h2>
    <form @submit.prevent="submeterEquipamento" enctype="multipart/form-data">

         <h2>Nome do Equipamento</h2>
      <input v-model="form.nome" type="text" placeholder="Nome do Equipamento" required />

       <h2>Marca</h2>
      <input v-model="form.marca" type="text" placeholder="Marca" required />

      <h2>Modelo</h2>
      <input v-model="form.modelo" type="text" placeholder="Modelo" required />
      <select v-model="form.estado" required>
        <option disabled value="">Estado Físico</option>
        <option value="novo">Novo</option>
        <option value="usado">Usado</option>
        <option value="avariado">Avariado</option>
      </select>

      <h2>Preço Proposto (€)</h2> 
      <input v-model.number="form.preco" type="number" placeholder="Preço Proposto (€)" required min="0" step="0.01" />

      <h2>Imagem do Equipamento</h2> 
      <input type="file" @change="handleFile" accept="image/*" />
      
      <button type="submit">Submeter Equipamento</button>
    </form>

    <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VenderEquipamento',
  data() {
    return {
      form: {
        nome: '',
        marca: '',
        modelo: '',
        estado: '',
        preco: '',
      },
      imagem: null,
      mensagem: ''
    };
  },
  methods: {
    handleFile(e) {
      this.imagem = e.target.files[0];
    },
    async submeterEquipamento() {
      try {
        const formData = new FormData();
        Object.keys(this.form).forEach(chave => {
          formData.append(chave, this.form[chave]);
        });

        if (this.imagem) {
          formData.append('imagem', this.imagem);
        }

        await axios.post('http://localhost:3000/api/equipamentos/vender', formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        this.mensagem = '✅ Equipamento enviado para análise com sucesso!';
        this.form = { nome: '', marca: '', modelo: '', estado: '', preco: '' };
        this.imagem = null;
      } catch (error) {
        console.error(error);
        this.mensagem = '❌ Erro ao submeter o equipamento.';
      }
    }
  }
};
</script>

<style scoped>
.vender-container {
  max-width: 500px;
  margin: 40px auto;
  background: #f0f0f0;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.vender-container h2 {
  text-align: center;
  margin-bottom: 20px;
}

form input, form select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  background-color: #04AA6D;
  color: white;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #038f5e;
}

.mensagem {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
}
</style>
