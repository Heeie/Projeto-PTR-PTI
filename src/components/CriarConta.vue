<template>
  <div>
    <header>
      <h1>FromU2Me</h1>
    </header>

    <section>
      <div id="login">
        <form @submit.prevent="submitForm">
          <div class="imgcontainer">
            <img src="/Images/smile.jpg" alt="Avatar" class="avatar" />
            <h1>Criar Conta</h1>
          </div>

          <div class="container">
            <label for="nome"><b>Nome</b></label>
            <input type="text" placeholder="Enter your name" name="nome" v-model="form.nome" required />


            <label for="senha"><b>Password</b></label>
            <input type="password" placeholder="Enter password" name="senha" v-model="form.senha" required />


            <label for="email"><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              v-model="form.email"
            />

            <label for="telefone"><b>Telefone</b></label>
            <input
              type="number"
              placeholder="Introduza um número de Telefone"
              name="telefone"
              v-model="form.telefone"
            />

            <label for="nif"><b>NIF</b></label>
            <input
              type="number"
              placeholder="Introduza um NIF"
              name="nif"
              v-model="form.nif"
              required
            />

            <label for="nic"><b>NIC</b></label>
            <input
              type="number"
              placeholder="Introduza um NIC"
              name="nic"
              v-model="form.nic"
              required
            />

            <label for="morada"><b>Morada</b></label>
            <input
              type="text"
              placeholder="Introduza uma morada"
              name="morada"
              v-model="form.morada"
              required
            />

            <label for="genero">Gênero</label>
            <select id="genero" name="genero" v-model="form.genero">
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>

            <button type="submit">Criar Conta</button>
            <label>
              <input type="checkbox" checked="checked" name="remember" />
              Remember me
            </label>
          </div>

          <div class="container" style="background-color:#f1f1f1">
            <button type="button" class="cancelbtn" @click="cancelForm">Cancel</button>
            <span class="create"><a href="#">Create a new User</a></span>
            <span class="psw">Forgot <a href="#">password?</a></span>
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
  name: 'CriarConta',
  data() {
    return {
      form: {
      nome: '',
      senha: '',
      email: '',
      telefone: '',
      nif: '',
      nic: '',
      morada: '',
      genero: 'Masculino',
    },
    };
  },
  methods: {
    async submitForm() {
      console.log('Formulário enviado:', this.form);
      try {
        const response = await fetch('http://localhost:3000/api/criar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Caso o utilizador já exista (erro 409), mostrar mensagem clara
          if (response.status === 409) {
            alert(errorData.error || 'Utilizador já existe.');
          } else {
            throw new Error(errorData.error || 'Erro ao registrar utilizador');
          }
          return;
        }

        const data = await response.json();
        console.log('Utilizador salvo no MongoDB:', data);

        alert('Utilizador registrado com sucesso!');

        this.resetForm();
        this.$router.push('/');

      } catch (error) {
        console.error('Erro:', error.message);
        alert('Erro ao registrar Utilizador: ' + error.message);
      }
    },

    cancelForm() {
      // Limpar o formulário ou redirecionar para outra página
      this.$router.push('/'); // Exemplo de redirecionamento, se estiver usando Vue Router
    },

    resetForm() {
      // Reseta os campos do formulário
      this.form = {
        nome: '',
        senha: '',
        email: '',
        telefone: '',
        nif: '',
        nic: '',
        morada: '',
        genero: 'Masculino',
      };
    },
  },
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

.button-container {
  display: flex;
  flex-direction: column; /* Coloca um botão em cima do outro */
  align-items: center;     /* Alinha horizontalmente ao centro */
  justify-content: center;
  margin: 40px 0;
  gap: 10px; /* Espaço entre os botões */
}

.button-container button {
  width: 200px; /* Largura fixa para os botões */
}

</style>