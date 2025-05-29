<template>
  <div id="login">
    <form @submit.prevent="goToHome"> <!-- Impede o envio do formulário padrão -->
      <div class="imgcontainer">
        <img src="/Images/smile.jpg" alt="Avatar" class="avatar">
        <h1>Login</h1>
      </div>

      <div class="container">
        <label for="uname"><b>Username</b></label>
        <input type="text" v-model="username" placeholder="Enter Username" name="uname" required />

        <label for="psw"><b>Password</b></label>
        <input type="password" v-model="password" placeholder="Enter Password" name="psw" required />

        <button id="btnLogin" type="submit">Login</button>

        <label>
          <input type="checkbox" checked="checked" name="remember" /> Lembrar-me
        </label>
      </div>

      <div class="container" style="background-color:#f1f1f1">
        <button type="button" class="cancelbtn">Cancelar</button>
        <span class="create"><a href="#">Criar uma nova conta</a></span>
        <span class="psw">Esqueceu a <a href="#">password?</a></span>
      </div>
    </form>

    <!-- Exibição de Carregamento -->
    <div v-if="loading">Carregando...</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      users: [], // Lista de usuários
      loading: true, // Para controlar o estado de carregamento
    };
  },
  async created() {
    try {
      // Realizar a requisição para obter todos os usuários assim que o componente for criado
      const response = await axios.get('http://localhost:3000/api/utilizadores', {
        withCredentials: true
      });

      

      this.users = response.data;  // Salvar os usuários na variável 'users'
      console.log(this.users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      this.loading = false; // Alterar o estado para carregamento concluído
    }
  },
  methods: {
   async goToHome(event) {
  event.preventDefault();
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      username: this.username,
      password: this.password,
    }, {
      withCredentials: true
    });

    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    const perfil = await axios.get('http://localhost:3000/api/perfil', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });

    console.log("Perfil:", perfil.data);
    this.$router.push('/home');

  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message);
    alert("Erro ao fazer login: " + (error.response?.data?.erro || "Erro interno"));
  }
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