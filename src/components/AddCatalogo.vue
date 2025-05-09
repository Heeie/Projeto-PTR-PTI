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
        <div>
          <h2>Adicionar Categoria</h2>
          <form @submit.prevent="adicionarCategoria">
            <input type="text" v-model="novaCategoria.nome" placeholder="Nome da categoria" required />
            <textarea v-model="novaCategoria.descricao" placeholder="Descrição da categoria"></textarea>
            <button id="regisbtn" type="submit">Adicionar</button>
          </form>
        </div>
  
        <div style="margin-top: 30px;">
          <h2>Adicionar Tipo</h2>
          <form @submit.prevent="adicionarTipo">
            <input type="text" v-model="novoTipo.nome" placeholder="Nome do tipo" required />
            <textarea v-model="novoTipo.descricao" placeholder="Descrição do tipo"></textarea>
            <button id="regisbtn" type="submit">Adicionar</button>
          </form>
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
  export default {
    name: 'HomePage',
    data() {
      return {
        novaCategoria: {
          nome: '',
          descricao: ''
        },
        novoTipo: {
          nome: '',
          descricao: ''
        }
      };
    },
    methods: {
      adicionarCategoria() {
        fetch('http://localhost:3000/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.novaCategoria)
        })
          .then(res => res.json())
          .then(data => {
            console.log('Categoria adicionada:', data);
            this.novaCategoria = { nome: '', descricao: '' };
          })
          .catch(err => alert('Erro ao adicionar categoria: ' + err.message));
      },
  
      adicionarTipo() {
        fetch('http://localhost:3000/api/tipos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.novoTipo)
        })
          .then(res => res.json())
          .then(data => {
            console.log('Tipo adicionado:', data);
            this.novoTipo = { nome: '', descricao: '' };
          })
          .catch(err => alert('Erro ao adicionar tipo: ' + err.message));
      }
    }
  };
  </script>
  
  

<style scoped>
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
</style>
