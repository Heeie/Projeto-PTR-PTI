<template>

  <!-- Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem">
      {{ mensagem }}
    </div>

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

    <section>
      <div id="login">
        <form @submit.prevent="submitForm">
          <div class="imgcontainer">
            <img src="/Images/smile.jpg" alt="Avatar" class="avatar" />
            <h1>Registar Equipamento</h1>
          </div>

          <div class="container">
            <!-- Nome -->
            <label for="nome">Nome</label>
            <input
              type="text"
              placeholder="Nome do equipamento"
              name="nome"
              v-model="form.nome"
              required
            />

            <label for="estado">Estado</label>
            <select required v-model="form.estado">
              <option disabled value="">Selecionar estado</option>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
              <option value="avariado">Avariado</option>
            </select>


            <!-- Marca -->
            <label for="marca">Marca</label>
            <select required id="marca" name="marca" v-model="form.marca">
              <option disabled value="">Selecione uma marca</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Nokia">Nokia</option>
              <option value="Outra">Outra</option>
            </select>

            <!-- Modelo -->
            <label for="modelo"><b>Modelo</b></label>
            <input
              type="text"
              placeholder="Introduza um modelo"
              name="modelo"
              v-model="form.modelo"
              required
            />


            <!-- Adiciona depois do campo catálogo_id -->
            <label for="imagem"><b>Imagem</b></label>
            <input
              type="file"
              name="imagem"
              accept="image/*"
              @change="handleFileUpload"
            />


            <!-- Preço -->
            <label for="preco"><b>Preço</b></label>
            <input
              type="number"
              placeholder="Introduza um preço"
              name="preco"
              v-model="form.preco"
              required
            />

            <!-- Loja ID -->
            <!-- Loja -->
            <label for="loja_id"><b>Loja</b></label>
            <select v-model="form.loja_id" required>
              <option disabled value="">Selecione uma loja</option>
              <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
                {{ loja.nome }}
              </option>
            </select>



            <!-- Catálogo ID -->
            <label for="catalogo_id"><b>ID do Catálogo</b></label>
            <input
              type="text"
              placeholder="ID do catálogo de equipamentos"
              name="catalogo_id"
              v-model="form.catalogo_id"
              required
            />


           <!-- Categoria -->
          <label for="categoria_id"><b>Categoria</b></label>
          <select v-model="form.categoria_id" required>
            <option disabled value="">Selecione uma categoria</option>
            <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
              {{ cat.nome }}
            </option>
          </select>

          <!-- Tipo -->
          <label for="tipo_id"><b>Tipo</b></label>
          <select v-model="form.tipo_id" required>
            <option disabled value="">Selecione um tipo</option>
            <option v-for="tipo in tipos" :key="tipo._id" :value="tipo._id">
              {{ tipo.nome }}
            </option>
          </select>



            <button type="submit">Registrar Equipamento</button>
          </div>
        </form>


        <!-- Editar Equipamento -->
        <div class="container">
          <h2>Modificar Equipamento</h2>

          <label for="nome_pesquisa_editar">Nome do Equipamento</label>
          <input
            type="text"
            placeholder="Nome do equipamento"
            v-model="nomePesquisaEditar"
          />
          <button @click="buscarParaEditar()">Pesquisar</button>

          <div v-if="formEditar._id">
            <!-- Os mesmos campos do formulário de registro -->
            <label>Nome</label>
            <input type="text" v-model="formEditar.nome" required />

            <label>Modelo</label>
            <input type="text" v-model="formEditar.modelo" required />

            <label>Estado</label>
            <select v-model="formEditar.estado" required>
              <option disabled value="">Selecionar estado</option>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
              <option value="avariado">Avariado</option>
            </select>

            <label>Preço</label>
            <input type="number" v-model="formEditar.preco" required />

            <label>Categoria</label>
            <select v-model="formEditar.categoria_id" required>
              <option disabled value="">Selecionar categoria</option>
              <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
                {{ cat.nome }}
              </option>
            </select>

            <label>Tipo</label>
            <select v-model="formEditar.tipo_id" required>
              <option disabled value="">Selecionar tipo</option>
              <option v-for="tipo in tipos" :key="tipo._id" :value="tipo._id">
                {{ tipo.nome }}
              </option>
            </select>

            <label>Loja</label>
            <select v-model="formEditar.loja_id" required>
              <option disabled value="">Selecionar loja</option>
              <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
                {{ loja.nome }}
              </option>
            </select>

            <button @click="editarEquipamento()">Salvar Alterações</button>
          </div>
        </div>


        <!-- Apagar Equipamento -->
        <div class="container">
          <h2>Apagar Equipamento</h2>

          <label for="nome_pesquisa_apagar">Nome do Equipamento</label>
          <input
            type="text"
            placeholder="Nome do equipamento"
            v-model="nomePesquisaApagar"
          />
          <button @click="buscarParaApagar()">Pesquisar</button>

          <div v-if="equipamentoParaApagar">
            <p><strong>Modelo:</strong> {{ equipamentoParaApagar.modelo }}</p>
            <p><strong>Preço:</strong> {{ equipamentoParaApagar.preco }}€</p>
            <p><strong>Estado:</strong> {{ equipamentoParaApagar.estado }}</p>
            <button @click="apagarEquipamento()">Confirmar Apagar</button>
          </div>
        </div>


        
    </div>

    </section>

    <footer>
      <p>&copy; 2025 Loja Tech - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'CriarEquipamento',
  data() {
    return {
      form: {
        nome: '',
        marca: '',
        modelo: '',
        estado: '',
        preco: '',
        loja_id: '',
        catalogo_id: '',
        categoria_id: '',
        tipo_id: ''
      },
      imagem: null,
      categorias: [], // novas listas
      tipos: [],
      lojas: [],  // 👈 novo array
      
      nomePesquisaApagar: '',
      equipamentoParaApagar: null,

      nomePesquisaEditar: '',
      formEditar: {
        _id: '',
        nome: '',
        modelo: '',
        estado: '',
        preco: '',
        categoria_id: '',
        tipo_id: '',
        loja_id: ''
      },
       mensagem: '', // variável para mensagem de alerta


    };
  },
  methods: {

     mostrarMensagem(msg) {
      this.mensagem = msg;
      setTimeout(() => {
        this.mensagem = '';
      }, 5000);
    },
    handleFileUpload(event) {
      this.imagem = event.target.files[0];
    },

    async submitForm() {
  try {
    const formData = new FormData();
    Object.keys(this.form).forEach(key => {
      formData.append(key, this.form[key]);
    });
    if (this.imagem) {
      formData.append('imagem', this.imagem);
    }

    const response = await fetch('http://localhost:3000/api/equipamentos', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      // Tenta ler a mensagem de erro da resposta JSON
      const errorData = await response.json();
      if (response.status === 409) {
         this.mostrarMensagem(errorData.message || 'Equipamento já existe.');
      } else {
         this.mostrarMensagem(errorData.message || 'Erro ao registrar equipamento');
      }
      return; // Sai da função para não continuar
    }

    const data = await response.json();
    console.log('Equipamento registrado:', data);
    this.mostrarMensagem('Equipamento registrado com sucesso!');

    // Opcional: resetar o formulário
    this.form = {
      nome: '',
      marca: '',
      modelo: '',
      estado: '',
      preco: '',
      loja_id: '',
      catalogo_id: '',
      categoria_id: '',
      tipo_id: ''
    };
    this.imagem = null;

  } catch (error) {
    console.error('Erro:', error);
    this.mostrarMensagem('Erro ao registrar equipamento: ' + error.message);
  }
}
,

    async carregarCategoriasETipos() {
      try {
        const [catRes, tipoRes, lojaRes] = await Promise.all([
          fetch('http://localhost:3000/api/categorias'),
          fetch('http://localhost:3000/api/tipos'),
          fetch('http://localhost:3000/api/lojas') // 👈 nova rota
        ]);

        this.categorias = await catRes.json();
        this.tipos = await tipoRes.json();
        this.lojas = await lojaRes.json(); // 👈 nova lista
      } catch (err) {
        console.error('Erro ao carregar categorias, tipos ou lojas:', err);
      }
    },

  async buscarParaApagar() {
      try {
        const res = await fetch(`http://localhost:3000/api/equipamentos?nome=${this.nomePesquisaApagar}`);
        const data = await res.json();
        this.equipamentoParaApagar = data[0] || null;

        if (!this.equipamentoParaApagar) {
           this.mostrarMensagem('Equipamento não encontrado.');
        }
      } catch (err) {
        console.error(err);
         this.mostrarMensagem('Erro ao buscar equipamento.');
      }
    },

    async apagarEquipamento() {
      try {
        if (!this.equipamentoParaApagar || !this.equipamentoParaApagar._id) {
           this.mostrarMensagem('ID do equipamento inválido.');
          return;
        }

        const url = `http://localhost:3000/api/equipamentos/${this.equipamentoParaApagar._id}`;
        console.log('Apagando via URL:', url);

        const res = await fetch(url, { method: 'DELETE' });

        if (!res.ok) {
          const text = await res.text();
          console.error('Resposta não-OK:', text);
           this.mostrarMensagem('Erro ao apagar: ' + text);
          return;
        }

        alert('Equipamento apagado com sucesso!');
        this.nomePesquisaApagar = '';
        this.equipamentoParaApagar = null;

      } catch (err) {
        console.error('Erro ao apagar:', err);
         this.mostrarMensagem('Erro ao apagar equipamento: ' + err.message);
      }
    },

    async buscarParaEditar() {
      try {
        const res = await fetch(`http://localhost:3000/api/equipamentos?nome=${this.nomePesquisaEditar}`);
        const data = await res.json();

        if (!data.length) {
           this.mostrarMensagem('Equipamento não encontrado.');
          return;
        }

        this.formEditar = { ...data[0] };
      } catch (err) {
        console.error(err);
         this.mostrarMensagem('Erro ao buscar equipamento.');
      }
    },

    async editarEquipamento() {
      try {
        const res = await fetch(`http://localhost:3000/api/equipamentos/${this.formEditar._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formEditar)
        });

        if (!res.ok) {
          const error = await res.json();
          this.mostrarMensagem(error.message || 'Erro ao editar');
          return;
        }

        this.mostrarMensagem('Equipamento editado com sucesso!');
        this.nomePesquisaEditar = '';
        this.formEditar = {
          _id: '',
          nome: '',
          modelo: '',
          estado: '',
          preco: '',
          categoria_id: '',
          tipo_id: '',
          loja_id: ''
        };
      } catch (err) {
        console.error(err);
         this.mostrarMensagem('Erro ao editar equipamento: ' + err.message);
      }
    },

 

 
} ,
 created() {
    this.carregarCategoriasETipos();
  }
};


</script>


  
<style scoped>

  /* Estilo para a mensagem de alerta */
.mensagem {
  position: fixed;
  background-color: #0d6efd;
  color: white;
  padding: 12px 20px;
  margin: 15px auto;
  max-width: 400px;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border-color: black;
  
}

  header {
    background: #0d6efd;
    color: #fff;
    padding: 20px;
    text-align: center;
  }
  
  .imgcontainer {
    text-align: center;
    margin: 20px;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    max-width: 400px;
    margin: auto;
  }
  
  button {
    background: #0d6efd;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }
  
  button:hover {
    background: #084298;
  }
  body {
    font-family: 'Poppins', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #333;
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
nav ul li {
    display: inline;
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


footer {
    background: #0d6efd;
    color: #fff;
    text-align: center;
    padding: 20px;
    margin-top: 40px;
    font-size: 14px;
}

form {
    border: 3px solid #f1f1f1;
  }
  
  /* Full-width inputs */
  input[type=text], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  /* Set a style for all buttons */
  button {
    background-color: #04AA6D;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    cursor: pointer;
    width: 100%;
  }
  
  /* Add a hover effect for buttons */
  button:hover {
    opacity: 0.8;
  }
  
  /* Extra style for the cancel button (red) */
  .cancelbtn {
    width: auto;
    padding: 10px 18px;
    background-color: #f44336;
  }
  
  /* Center the avatar image inside this container */
  .imgcontainer {
    text-align: center;
    margin: 24px 0 12px 0;
  }
  
  /* Avatar image */
  img.avatar {
    width: 40%;
    border-radius: 50%;
  }
  
  /* Add padding to containers */
  .container {
    padding: 16px;
  }
  
  /* The "Forgot password" text */
  span.psw {
    float: right;
    padding-top: 16px;
  }
  
  /* Change styles for span and cancel button on extra small screens */
  @media screen and (max-width: 300px) {
    span.psw {
      display: block;
      float: none;
    }
    .cancelbtn {
      width: 100%;
    }
  }
  </style>
  