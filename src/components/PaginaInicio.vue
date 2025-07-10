<template>
  <div>
    <header>
      <h1 @click="$router.push('/home')" style="cursor:pointer;">FromU2Me</h1>
    </header>

    <div class="button-container">
      <button @click="goToCriarConta()">Criar Conta</button>
      <button @click="goToLogin()">Login</button>
    </div>

    <footer>
      <p>&copy; 2025 Loja Tech - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'InicioComponent',

  mounted() {
    // Verifica sessão no backend via cookie de sessão
    axios.get('/session', { withCredentials: true })
      .then(response => {
        if (response.data.authenticated) {
          console.log('Usuário autenticado');
          // Redireciona para home se estiver autenticado
          this.$router.push('/home');
        } else {
          console.log('Não autenticado');
          // Permanece na página atual
        }
      })
      .catch(error => {
        console.error('Erro ao verificar sessão:', error);
      });
  },

  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToCriarConta() {
      this.$router.push('/criar_conta');
    }
  }
};
</script>


<style scoped>
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

input[type=text],
input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

.imgcontainer {
  text-align: center;
  margin: 24px 0 12px 0;
}

img.avatar {
  width: 40%;
  border-radius: 50%;
}

.container {
  padding: 16px;
}

span.psw {
  float: right;
  padding-top: 16px;
}

@media screen and (max-width: 300px) {
  span.psw {
    display: block;
    float: none;
  }
  .cancelbtn {
    width: 100%;
  }
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  gap: 10px;
}

.button-container button {
  width: 200px;
}
</style>
