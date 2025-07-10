<template>
  <div>
    <header style="position: relative;">
      <h1 @click="$router.push('/login')" style="cursor:pointer;">FromU2Me</h1>
      <router-link to="/criar_conta">
        <button class="top-create-btn">Criar Conta</button>
      </router-link>
    </header>

    <section>
      <div id="login">
        <form @submit.prevent="handleLogin">
          <div class="imgcontainer">
            <img src="/Images/smile.jpg" alt="Avatar" class="avatar" />
            <h1>Login</h1>
          </div>

          <div class="container">
            <span v-if="errorMessage" class="error">{{ errorMessage }}</span>

            <label for="username"><b>Username</b></label>
            <input
              type="text"
              placeholder="Enter Username"
              id="username"
              v-model="username"
              required
            />

            <label for="password"><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              v-model="password"
              required
            />

            <button type="submit">Login</button>

            <label>
              <input type="checkbox" v-model="rememberMe" />
              Remember me
            </label>
          </div>

          <div class="container" style="background-color:#f1f1f1; display: flex; justify-content: space-between; align-items: center;">
            <span class="psw">
              <router-link to="/recuperar_senha">Esqueceste-te da tua palavra-passe?</router-link>
            </span>
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
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      rememberMe: false,
      errorMessage: "",
    };
  },
  mounted() {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";

      try {
        const response = await axios.post(
          "/api/login",
          {
            username: this.username,
            password: this.password,
          },
          {
            withCredentials: true,
          }
        );

        console.log("API Response:", response.data);

        if (this.rememberMe) {
          localStorage.setItem("rememberedUsername", this.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        this.$router.push("/home");

      } catch (error) {
        if (error.response && error.response.data && error.response.data.erro) {
          this.errorMessage = error.response.data.erro;
        } else {
          this.errorMessage = "Erro ao conectar com o servidor.";
        }
        console.error("Login error:", error);
      }
    },
  },
};
</script>

<style scoped>
header {
  background: #0d6efd;
  padding: 20px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border-radius: 0 0 10px 10px;
  margin-bottom: 30px;
  position: relative;
}

h1 {
  margin: 10;
  font-weight: 700;
  font-size: 1.8rem;
  color: #ffffff;
}

/* Botão "Criar Conta" */
.top-create-btn {
  position: absolute;
  top: 20px;
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

.top-create-btn:hover {
  background-color: #0d6efd;
  color: white;
  border-color: #ffffff;
}

/* Login Form */
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
  margin-bottom: 10px;
}

button {
  background-color: #04aa6d;
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

.imgcontainer img.avatar {
  width: 40%;
  border-radius: 50%;
}

form {
  border: 3px solid #f1f1f1;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 0.85rem;
  margin-top: -8px;
  margin-bottom: 10px;
  display: block;
}

footer {
  background: #0d6efd;
  color: #fff;
  text-align: center;
  padding: 20px;
  margin-top: 40px;
  font-size: 14px;
}

.psw {
  font-size: 0.9rem;
  color: #333;
  display: flex;
  align-items: center;
}

.psw router-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  margin-left: 4px;
}

.psw router-link:hover {
  text-decoration: underline;
}

/* Responsivo */
@media (max-width: 600px) {
  .top-create-btn {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  .container {
    padding: 10px;
  }
}
</style>
