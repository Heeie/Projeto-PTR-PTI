<template>

  <!-- Mensagem de alerta -->
    <div v-if="mensagem" class="mensagem">
      {{ mensagem }}
    </div>

  <div>
    <header>
      <h1 @click="$router.push('/home')" style="cursor:pointer;">FromU2Me</h1>

      <button class="top-create-btn" @click="loginOrRegister">
        Login / Criar Conta
      </button>

      <nav class="nav-container">
        <ul class="nav-center">
          <li><a href="/home">Início</a></li>
          <li><a href="/home#produtos">Produtos</a></li>
          <li><a href="/home#contato">Contato</a></li>
          <li><a href="/addToCatalog">Adicionar Catálogo</a></li>
          <li><a href="/registroEquipamento" style="cursor:pointer;">Registar Equipamento</a></li>
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
            <!-- Mensagens -->
            <div v-if="successMessage" class="success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

            <!-- Nome -->
            <label for="nome">Nome</label>
            <input type="text" placeholder="Nome do equipamento" v-model="form.nome" required />

            <!-- Estado -->
            <label for="estado">Estado</label>
            <select required v-model="form.estado">
              <option disabled value="">Selecionar estado</option>
              <option value="novo">Novo</option>
              <option value="usado">Usado</option>
              <option value="avariado">Avariado</option>
            </select>

            <!-- Marca -->
            <label for="marca">Marca</label>
            <select required v-model="form.marca">
              <option disabled value="">Selecione uma marca</option>
              <option value="Xiaomi">Xiaomi</option>
              <option value="Nokia">Nokia</option>
              <option value="Outra">Outra</option>
            </select>

            <!-- Modelo -->
            <label for="modelo">Modelo</label>
            <input type="text" placeholder="Introduza um modelo" v-model="form.modelo" required />

                        <!-- Categoria -->
            <label for="categoria_id">Categoria</label>
            <select v-model="form.categoria_id" required>
              <option disabled value="">Selecionar categoria</option>
              <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
                {{ cat.nome }}
              </option>
            </select>

            <!-- Tipo -->
            <label for="tipo_id">Tipo</label>
            <select v-model="form.tipo_id" required>
              <option disabled value="">Selecionar tipo</option>
              <option v-for="tipo in tipos" :key="tipo._id" :value="tipo._id">
                {{ tipo.nome }}
              </option>
            </select>

            
            <label for="imagem">Imagem:</label>
      <input type="file" name="imagem" id="imagem" accept="image/png, image/jpeg, image/jpg" @change="handleFileUpload">


            <!-- Preço -->
            <label for="preco">Preço</label>
            <input type="number" placeholder="Introduza um preço" v-model="form.preco" required />

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
            <label for="catalogo_id">Catálogo</label>
            <select v-model="form.catalogo_id" required>
              <option disabled value="">Selecione um catálogo</option>
                      <option v-for="catalogo in catalogos" :key="catalogo._id" :value="catalogo._id">
          {{ catalogo.marca }} - {{ catalogo.modelo }}
        </option>

            </select>

            <!-- Botões -->
            <button type="submit">Registrar Equipamento</button>
            <button type="button" class="cancelbtn" @click="voltar">Voltar</button>
          </div>
        </form>



      <!-- Gerir Equipamentos -->
       <div class="container">
  <h2>Gerir Equipamentos</h2>

  <div v-if="equipamentos.length === 0">Nenhum equipamento encontrado.</div>

  <div class="equipamento-lista">
    <div v-for="equip in equipamentos" :key="equip._id" class="equipamento-card">
      <label>Nome:</label>
      <input type="text" v-model="equip.nome" />

      <label>Modelo:</label>
      <input type="text" v-model="equip.modelo" />

      <label>Estado:</label>
      <select v-model="equip.estado">
        <option value="novo">Novo</option>
        <option value="usado">Usado</option>
        <option value="avariado">Avariado</option>
      </select>

      <label>Preço:</label>
      <input type="number" v-model="equip.preco" />

      <label>Categoria:</label>
      <select v-model="equip.categoria_id">
        <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
          {{ cat.nome }}
        </option>
      </select>

      <label>Tipo:</label>
      <select v-model="equip.tipo_id">
        <option v-for="tipo in tipos" :key="tipo._id" :value="tipo._id">
          {{ tipo.nome }}
        </option>
      </select>

      <label>Disponibilidade:</label>
<select v-model="equip.estadoDisponibilidade">
  <option value="disponivel">Disponível</option>
  <option value="indisponivel">Indisponível</option>
  <option value="para_analise">Para Análise</option>
</select>


      <label>Loja:</label>
      <select v-model="equip.loja_id">
        <option v-for="loja in lojas" :key="loja._id" :value="loja._id">
          {{ loja.nome }}
        </option>
      </select>

      <div class="btns">
        <button @click="salvarAlteracoes(equip)">Salvar</button>
        <button @click="apagarEquipamentoDireto(equip._id)">Apagar</button>
      </div>
    </div>
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
  name: "CriarEquipamento",
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
          tipo_id: '',
        
         
      },
      equipamentos: [],
      imagem: null,
      categorias: [], // novas listas
      tipos: [],
      lojas: [],  // 👈 novo array
      catalogos: [],
      
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
  async mounted() {
  try {
    const [lojasRes, catalogosRes] = await Promise.all([
      fetch("http://localhost:3000/api/lojas/lojas"),
      fetch("http://localhost:3000/api/catalogos"),
    ]);

    this.lojas = await lojasRes.json();
    this.catalogos = await catalogosRes.json();

    //this.carregarCategoriasETipos(); // 👈 adicionar esta linha

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Erro ao carregar lojas/catalogos:", err);
    this.errorMessage = "Erro ao carregar dados.";
  }
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
    loginOrRegister() {
      // Redireciona para a página de login ou criação de conta
      this.$router.push("/login");

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
}, 
 
async carregarCatalogos() {
      try {
        const res = await fetch('http://localhost:3000/api/catalogos');
        this.catalogos = await res.json();
      } catch (err) {
        console.error('Erro ao carregar catálogos:', err);
      }
    },

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
    }, async buscarParaApagar() {
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

        this.mostrarMensagem('Equipamento apagado com sucesso!');

        this.nomePesquisaApagar = '';
        this.equipamentoParaApagar = null;

      } catch (err) {
        console.error('Erro ao apagar:', err);
         this.mostrarMensagem('Erro ao apagar equipamento: ' + err.message);
      }
    },



    async carregarEquipamentos() {
  try {
    const res = await fetch('http://localhost:3000/api/equipamentos/todos');
    const data = await res.json();
    this.equipamentos = data;
  } catch (err) {
    console.error('Erro ao carregar equipamentos:', err);
    this.mostrarMensagem('Erro ao carregar equipamentos');
  }
},

async salvarAlteracoes(equip) {
  try {
    const res = await fetch(`http://localhost:3000/api/equipamentos/${equip._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(equip)
    });

    if (!res.ok) {
      const error = await res.json();
      this.mostrarMensagem(error.message || 'Erro ao salvar');
      return;
    }

    this.mostrarMensagem('Equipamento atualizado com sucesso!');
  } catch (err) {
    console.error(err);
    this.mostrarMensagem('Erro ao salvar alterações: ' + err.message);
  }
},

async apagarEquipamentoDireto(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/equipamentos/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errorText = await res.text();
      this.mostrarMensagem('Erro ao apagar equipamento: ' + errorText);
      return;
    }

    this.mostrarMensagem('Equipamento apagado com sucesso!');
    this.equipamentos = this.equipamentos.filter(e => e._id !== id);
  } catch (err) {
    console.error(err);
    this.mostrarMensagem('Erro ao apagar: ' + err.message);
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
     this.carregarEquipamentos(); 
  }
};
</script>

<style scoped>
.equipamento-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.equipamento-card {
  background-color: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
  width: 300px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.equipamento-card label {
  margin-top: 10px;
  font-weight: 600;
  color: #444;
}

.equipamento-card input,
.equipamento-card select {
  margin-top: 5px;
}

.equipamento-card .btns {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

.equipamento-card button {
  flex: 1;
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
}s

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

/* Form container - deixa a caixa do formulário igual à dos outros */
#login form {
  background-color: white;
  max-width: 450px;
  margin: 0 auto 40px auto;
  padding: 30px 35px;
  border: 3px solid #f1f1f1;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 0.1);
  box-sizing: border-box;
}

/* Título e imagem do avatar */
.imgcontainer {
  text-align: center;
  margin-bottom: 30px;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
  margin-bottom: 15px;
}

h1 {
  margin: 10;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

/* Inputs e selects estilo uniforme */
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  border-color: #0d6efd;
  outline: none;
}

/* Labels */
label {
  font-weight: 600;
  color: #555;
}

/* Botões */
button[type="submit"],
button.cancelbtn {
  width: 100%;
  padding: 14px 20px;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  margin-top: 10px;
}

button[type="submit"] {
  background-color: #0d6efd;
  color: white;
}

button[type="submit"]:hover {
  background-color: #084298;
}

button.cancelbtn {
  background-color: #f44336;
  color: white;
  border: none;
}

button.cancelbtn:hover {
  opacity: 0.85;
}

/* Mensagens */
.success {
  color: green;
  font-weight: 700;
  margin-bottom: 15px;
  text-align: center;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 15px;
  text-align: center;
}

/* Footer */
footer {
  background: #0d6efd;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  margin-top: 50px;
  border-radius: 10px 10px 0 0;
}

/* Responsividade */
@media (max-width: 480px) {
  nav.nav-container {
    flex-direction: column;
    gap: 10px;
  }

  ul.nav-center {
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-right button {
    width: 100%;
  }

  #login form {
    padding: 20px;
    margin: 20px 10px 40px 10px;
  }
}

</style>
