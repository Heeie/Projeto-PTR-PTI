/* eslint-disable no-undef */
<template>
  <div>
<<<<<<< Updated upstream
      <header>
  <h1 @click="$router.push('/login')" style="cursor:pointer;">FromU2Me</h1>

=======
  <header>
>>>>>>> Stashed changes
  <!-- Botão fora do retângulo -->
  <button class="top-create-btn" @click="$router.push('/login')">
    Login
  </button>
<<<<<<< Updated upstream
  </header>
=======

</header>
>>>>>>> Stashed changes

    <section>
      <div id="login">
        <form @submit.prevent="submitForm">
          <div class="imgcontainer">
            <img src="/Images/smile.jpg" alt="Avatar" class="avatar" />
            <h1>Criar Conta</h1>
          </div>

          <div class="container">

            <!-- Mensagens de sucesso e erro -->
            <div v-if="successMessage" class="success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

            <label for="nome"><b>Nome</b></label>
            <input
              type="text"
              placeholder="Enter your name"
              name="nome"
              v-model="form.nome"
              required
            />

            <label for="senha"><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter password"
              name="senha"
              v-model="form.senha"
              required
            />
            <span v-if="errors.senha" class="error">{{ errors.senha }}</span>


            <label for="email"><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              v-model="form.email"
            />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>

            <label for="telefone"><b>Telefone</b></label>
            <input
              type="text"
              placeholder="Introduza um número de Telefone"
              name="telefone"
              v-model="form.telefone"
              maxlength="9"
              @input="limitarNumeros('telefone')"
            />
            <span v-if="errors.telefone" class="error">{{ errors.telefone }}</span>

            <label for="nif"><b>NIF</b></label>
            <input
              type="text"
              placeholder="Introduza um NIF"
              name="nif"
              v-model="form.nif"
              maxlength="9"
              @input="limitarNumeros('nif')"
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
            <span v-if="errors.morada" class="error">{{ errors.morada }}</span>

              
            <div id="map" style="height: 400px;" v-if="form.morada && mapUrl && googleMapsLoaded">
            <iframe
              :src="mapUrl"
              width="100%"
              height="300"
              style="border:0; border-radius: 10px; margin-top: 10px;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <p style="margin-top: 8px;">
              <a :href="mapLinkUrl" target="_blank" rel="noopener noreferrer">Ver no Google Maps</a>
            </p>
            <p>URL do iframe: {{ mapUrl }}</p>
            <p>URL do link: {{ mapLinkUrl }}</p>
          </div>

           


            <label for="dataNascimento"><b>Data de Nascimento</b></label>
            <input
              type="date"
              name="dataNascimento"
              v-model="form.dataNascimento"
              required
            />
            <span v-if="errors.dataNascimento" class="error">{{ errors.dataNascimento }}</span>


            <label for="genero">Gênero</label>
            <select id="genero" name="genero" v-model="form.genero">
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>

            <button type="submit">Criar Conta</button>
          </div>

          <div class="container" style="background-color:#ffffff">
            
            
            
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
/* global google */

export default {
  name: "CriarConta",
  data() {
    return {
      form: {
        nome: "",
        senha: "",
        email: "",
        telefone: "",
        nif: "",
        nic: "",
        morada: "",
        genero: "Masculino",
        dataNascimento: "",
      },
      errors: {},
      successMessage: "",
      errorMessage: "",
      mapUrl: "",
      mapLinkUrl: "",

      map: null,
    marker: null,
    geocoder: null,
        googleMapsLoaded: false,

    };
  },
  mounted() {
  // Carrega o script do Google Maps
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD1ExzCG0BiDRv3fQEu4XimkLHERysDxL8&libraries=places';
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous"; // Adicionado
  script.onload = () => {
    this.googleMapsLoaded = true;
    this.tryInitMap();
  };

    document.head.appendChild(script);
  },
    methods: {

      tryInitMap() {
        this.$nextTick(() => {
          const mapDiv = document.getElementById("map");
          if (this.googleMapsLoaded && mapDiv && !this.map) {
            this.initMap();
          }
        });
      },



    initMap() {
  this.geocoder = new google.maps.Geocoder();

  this.map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.736946, lng: -9.142685 }, // Centro em Lisboa
    zoom: 8,
  });

  this.marker = new google.maps.Marker({
    map: this.map,
    draggable: false,
  });

  this.map.addListener("click", (e) => {
    const latLng = e.latLng;

    this.marker.setPosition(latLng);
    this.map.panTo(latLng);

    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        this.form.morada = results[0].formatted_address;
      } else {
        console.error("Geocoder falhou: " + status);
      }
    });
  });
},


    limitarNumeros(field) {
      this.form[field] = this.form[field].replace(/\D/g, "").slice(0, 9);
    },

    validateForm() {
      this.errors = {};

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.form.nome || this.form.nome.trim().length === 0) {
        this.errors.nome = "Nome é obrigatório.";
      }

      if (!this.form.senha || this.form.senha.length < 6) {
        this.errors.senha = "A senha deve ter no mínimo 6 caracteres.";
      }

      if (!this.form.email || !emailRegex.test(this.form.email)) {
        this.errors.email = "Email inválido. Ex: nome@dominio.com";
      }

      if (!this.form.telefone || !/^\d{9}$/.test(this.form.telefone)) {
        this.errors.telefone = "Telefone deve conter exatamente 9 dígitos.";
      }

      if (!this.form.nif || !/^\d{9}$/.test(this.form.nif)) {
        this.errors.nif = "NIF deve conter exatamente 9 dígitos.";
      }

      if (!this.form.nic || isNaN(this.form.nic)) {
        this.errors.nic = "NIC é obrigatório e deve ser numérico.";
      }

      if (!this.form.morada || this.form.morada.trim().length === 0) {
        this.errors.morada = "Morada não pode estar vazia.";
      }

      if (!this.form.dataNascimento) {
        this.errors.dataNascimento = "Data de nascimento é obrigatória.";
      } else {
        const hoje = new Date();
        const nascimento = new Date(this.form.dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
          idade--;
        }

        if (idade < 16) {
          this.errors.dataNascimento = "O utilizador deve ter pelo menos 16 anos.";
        }
      }

      return Object.keys(this.errors).length === 0;
    },

    async submitForm() {

     

      if (!this.validateForm()) {
        return;
      }

      this.successMessage = "";
      this.errorMessage = "";

      try {
        const response = await fetch("/api/criar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.form),
        });

        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Resposta inválida do servidor");
        }

        if (!response.ok) {
          throw new Error(data.error || "Erro ao registrar utilizador");
        }


        console.log("Utilizador salvo no MongoDB:", data);
        this.successMessage = "Utilizador registrado com sucesso!";
        this.resetForm();

        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);

      } catch (error) {
        console.error("Erro:", error);
        this.errorMessage = "Erro ao registrar Utilizador: " + error.message;
      }
    },

    cancelForm() {
      this.$router.push("/");
    },

    resetForm() {
      this.form = {
        nome: "",
        senha: "",
        email: "",
        telefone: "",
        nif: "",
        nic: "",
        morada: "",
        genero: "Masculino",
      };
      this.errors = {};
    },
  },
  watch: {
  'form.morada'(novaMorada) {
    if (!novaMorada || novaMorada.trim().length === 0) {
      this.mapUrl = "";
      this.mapLinkUrl = "";
      return;
    }

    const encodedAddress = encodeURIComponent(novaMorada + ", Portugal");
    this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD1ExzCG0BiDRv3fQEu4XimkLHERysDxL8&q=${encodedAddress}`;
    this.mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    this.$nextTick(() => {
      this.tryInitMap();

      if (this.geocoder && this.map) {
        this.geocoder.geocode({ address: novaMorada }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            this.map.setCenter(location);
            this.marker.setPosition(location);
          }
        });
      }
    });
  }
}




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
}





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

/* restante CSS existente */

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

.cancelbtn {
  width: auto;
  padding: 10px 18px;
  background-color: #f44336;
}

.imgcontainer img.avatar {
  width: 40%;
  border-radius: 50%;
}

form {
  border: 3px solid #f1f1f1;
}

input[type="text"],
input[type="password"],
input[type="email"],
input[type="number"],
select {
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

.success {
  color: green;
  font-weight: bold;
  margin-bottom: 10px;
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