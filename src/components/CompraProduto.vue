<template>
  <div>
    <header>
      <h1>Finalizar Compra</h1>
      <button class="top-create-btn" @click="$router.push('/home')">
        Voltar ao Home
      </button>
    </header>

    <section class="compra">
      <h2>Itens no Carrinho</h2>
      <div v-if="carrinho.length > 0">
        <ul>
          <li v-for="(item, index) in carrinho" :key="index">
            <span @click="irParaDetalhes(item._id)" style="cursor: pointer; color: #0d6efd; font-weight: bold;">
              {{ item.nome }}
            </span>
            – € {{ Number(item.preco).toFixed(2) }}
            <button @click="removerItem(index)" style="margin-left: 10px; background-color: #dc3545;">
              Remover
            </button>
          </li>
        </ul>

        <p><strong>Total:</strong> € {{ total.toFixed(2) }}</p>

        <form @submit.prevent="finalizarCompra">
          <label for="mbway">Número de Telemóvel (MBWay):</label>
          <input
            type="tel"
            id="mbway"
            v-model="telefone"
            placeholder="912345678"
            required
            pattern="[9][1236][0-9]{7}"
          />

          <button type="submit">Pagar com MBWay</button>
        </form>

        <div v-if="mensagem" class="mensagem">{{ mensagem }}</div>

      </div>
      <div v-else>
        <p>O carrinho está vazio.</p>
        <div class="mensagem">{{ mensagem }}</div>
      </div>
    </section>

    <footer>
      <p>&copy; 2025 Loja Tech - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCarrinhoStore } from '@/stores/carrinho';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';



// Store e router
const carrinhoStore = useCarrinhoStore();
const router = useRouter();

const telefone = ref(''); // número de telemóvel que vai preencher o input

// Referências reativas
const numeroMBWay = ref('');
const mensagem = ref('');

// Computed: lista e total
const carrinho = computed(() => carrinhoStore.equipamentos);
const total = computed(() =>
  carrinho.value.reduce((soma, item) => soma + Number(item.preco), 0)
);

function removerItem(index) {
  carrinhoStore.removerEquipamento(index)
}

function irParaDetalhes(id) {
  router.push(`/produto/${id}`)
}

async function finalizarCompra() {
  if (!telefone.value.match(/^9[1236][0-9]{7}$/)) {
    mensagem.value = 'Número MBWay inválido.';
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulação: substitui por ID real
    const lojaId = '6650dd0f26e3b38b9260b9f7';

<<<<<<< Updated upstream
    const response = await fetch('/api/transacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // ou como guardaste o token
      },
      body: JSON.stringify({
        loja_id: lojaId,
        equipamentos: carrinho.value.map(item => item._id),
        total: total.value
      })
    });
=======
    const response = await fetch('http://localhost:3000/api/transacoes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // necessário para sessões/
        body: JSON.stringify({
          loja_id: lojaId,
          equipamentos: carrinho.value.map(item => item._id),
          total: total.value,
          canal: 'online',
          vendedor_id: null
        })
      });


>>>>>>> Stashed changes

    if (!response.ok) throw new Error('Erro ao criar transação');

    const result = await response.json();

    mensagem.value = `Pagamento MBWay para ${numeroMBWay.value} concluído com sucesso! Transação ID: ${result.transacao._id}`;
    carrinhoStore.limparCarrinho();

    setTimeout(() => {
      router.push('/home');
    }, 7000);

  } catch (error) {
    mensagem.value = 'Erro ao processar pagamento. Tente novamente.';
    console.error(error);
  }
}

async function carregarPerfil() {
  try {
    const res = await fetch('http://localhost:3000/api/utilizadores/perfil', {
        credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Não foi possível carregar perfil');

    const dados = await res.json();
    console.log('Perfil carregado:', dados); //

    telefone.value = dados.telefone || '';
    console.log('telefone:', telefone.value); //
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
  }
}

onMounted(() => {
  carregarPerfil();
});
</script>

<style scoped>

button {
  transition: all 0.2s ease-in-out;
}

li button:hover {
  background-color: #bb2d3b;
}

.homebar{
  color: black;
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
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 0;
}

nav ul li a {
  color: #975d5d;
  text-decoration: none;
  font-weight: bold;
}

.compra {
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f4f6ff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.compra h2 {
  text-align: center;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button {
  background-color: #198754;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #146c43;
}

.mensagem {
  margin-top: 15px;
  font-weight: bold;
  color: green;
  text-align: center;
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