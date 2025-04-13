<template>
  <div>
    <header>
      <h1>FromU2Me</h1>
      <nav>
        <ul>
          <li><router-link to="/">Início</router-link></li>
          <li><a href="#produtos">Produtos</a></li>
          <li><a href="#contato">Contato</a></li>
          <button type="button" id="regisbtn" @click="goToRegistro">Registar equipamento</button>
        </ul>
      </nav>
    </header>

    <section class="banner">
      <h2>Os melhores equipamentos eletrônicos para você!</h2>
      <p>Confira nossas ofertas e garanta já o seu.</p>
    </section>

    <section id="produtos" class="produtos">
      <div class="produto">
        <img src="@/assets/orn.png" alt="Laptop">
        <h3>Laptop Gamer</h3>
        <p>Alta performance para jogos e trabalho.</p>
        <span>R$ 5.999,00</span>
      </div>
      <div class="produto">
        <img src="@/assets/orn.png" alt="Smartphone">
        <h3>Smartphone 5G</h3>
        <p>Velocidade e tecnologia de ponta.</p>
        <span>R$ 3.499,00</span>
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

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRegistro() {
  router.push('/registroEquipamento');
}
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
