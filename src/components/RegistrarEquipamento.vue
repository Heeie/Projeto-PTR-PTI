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
            <label for="loja_id"><b>ID da Loja</b></label>
            <input
              type="text"
              placeholder="ID da loja"
              name="loja_id"
              v-model="form.loja_id"
              required
            />

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
      tipos: []
    };
  },
  methods: {
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

        if (!response.ok) throw new Error('Erro ao registrar equipamento');

        const data = await response.json();
        console.log('Equipamento registrado:', data);
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao registrar equipamento: ' + error.message);
      }
    },

    async carregarCategoriasETipos() {
      try {
        const [catRes, tipoRes] = await Promise.all([
          fetch('http://localhost:3000/api/categorias'),
          fetch('http://localhost:3000/api/tipos')
        ]);

        this.categorias = await catRes.json();
        this.tipos = await tipoRes.json();
      } catch (err) {
        console.error('Erro ao carregar categorias ou tipos:', err);
      }
    }
  },

  created() {
    this.carregarCategoriasETipos();
  }
};


</script>


  
  <style scoped>
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
  