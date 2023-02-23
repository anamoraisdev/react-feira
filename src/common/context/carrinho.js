import { useEffect } from "react";
import { useState } from "react";
import { createContext, useContext } from "react";
import { usePagamentoContext } from "./pagamento";
import { UsuarioContext } from "./usuario";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName= "carrinho";

export const CarrinhoProvider = ({children}) => {
    const [carrinho, setCarrinho] = useState([]);
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [totalCarrinho, setTotalCarrinho] = useState(0);
    return(
        <CarrinhoContext.Provider 
          value={{
          carrinho, 
          setCarrinho, 
          quantidadeProdutos, 
          setQuantidadeProdutos, 
          totalCarrinho, 
          setTotalCarrinho}}>

          {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () => {
    const {
      carrinho, 
      setCarrinho, 
      quantidadeProdutos, 
      setQuantidadeProdutos, 
      totalCarrinho, 
      setTotalCarrinho
    } = useContext(CarrinhoContext); 

    const {formaPagamento} = usePagamentoContext();
    const {saldo, setSaldo} = useContext(UsuarioContext)

    const adicionarProduto = (novoProduto) => {
        const temProduto = carrinho.some(itemCarrinho => itemCarrinho.id === novoProduto.id)
        if(!temProduto){
          novoProduto.quantidade = 1; 
          return setCarrinho(carrinhoAnterior => 
            [...carrinhoAnterior, novoProduto]
          )
        }
        setCarrinho(carrinhoAnterior => carrinhoAnterior.map(itemCarrinho => {
          if(itemCarrinho.id === novoProduto.id) itemCarrinho.quantidade += 1;
            return itemCarrinho
        }))
    }
    const removerProduto = (id) => {
      const produto = carrinho.find(itemCarrinho => itemCarrinho.id === id);
      const ultimoProdutoCarrinho = produto.quantidade === 1;
      if(ultimoProdutoCarrinho){
        return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemCarrinho => 
        itemCarrinho.id !== id));
      }
      setCarrinho(carrinhoAnterior => carrinhoAnterior.map(itemCarrinho => {
        if(itemCarrinho.id === id)itemCarrinho.quantidade -= 1;
        return itemCarrinho;
      }))

    }
    useEffect(() => {
      const {novaQuantidade, novoTotal} = carrinho.reduce((contador, produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
      }), {
        novoTotal: 0,
        novaQuantidade: 0
      });
      setQuantidadeProdutos(novaQuantidade)
      setTotalCarrinho(novoTotal * formaPagamento.juros)
    }, [carrinho, setQuantidadeProdutos, formaPagamento])
   
    const efetuarCompra = () => {
      setCarrinho([]);
      setSaldo(saldo - totalCarrinho);
    }
    return{
        carrinho,
        setCarrinho,
        adicionarProduto,
        removerProduto,
        quantidadeProdutos,
        setQuantidadeProdutos,
        totalCarrinho,
        efetuarCompra
    }
    
}

