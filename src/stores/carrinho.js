import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCarrinhoStore = defineStore('carrinho', () => {
  const equipamentos = ref([]);

  function adicionarAoCarrinho(equipamento) {
    equipamentos.value.push(equipamento);
  }

  function contar() {
    return equipamentos.value.length;
  }

  function limparCarrinho() {
    equipamentos.value = [];
    localStorage.removeItem('carrinho');
  }

 function removerEquipamento(index) {
  this.equipamentos.splice(index, 1);
}


  return {
    equipamentos,
    adicionarAoCarrinho,
    contar,
    limparCarrinho,
    removerEquipamento
  };
});
