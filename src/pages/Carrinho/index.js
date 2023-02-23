import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useCarrinhoContext } from 'common/context/carrinho';
import { usePagamentoContext } from 'common/context/pagamento';
import Produto from 'components/Produto';
import { useContext, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Voltar, TotalContainer, PagamentoContainer} from './styles';
import {UsuarioContext} from 'common/context/usuario';

const Carrinho = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {saldo = 0} = useContext(UsuarioContext);
  const {carrinho, totalCarrinho, efetuarCompra} = useCarrinhoContext();
  const history = useHistory();
  const {formaPagamento, mudarFormaPagamento, tiposPagamento} = usePagamentoContext();
  const totalRestante = useMemo(() => saldo - totalCarrinho, [saldo, totalCarrinho]);
  return (
    <Container>
      <Voltar onClick={() => history.goBack()}/>
      <h2>
        Carrinho
      </h2>
      {carrinho.map((produto) => (
        <Produto
         {...produto}
         key={produto.id}
        />
      ))}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select 
          value={formaPagamento?.id}
          onChange={(event) => mudarFormaPagamento(event.target.value)}
        >
          {tiposPagamento.map((pagamento) => (
            <MenuItem value={pagamento.id} key={pagamento.id}>
              {pagamento.nome}
            </MenuItem>
          ))}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
          <div>
            <h2>Total no Carrinho: </h2>
            <span>R$ {totalCarrinho.toFixed(2)}</span>
          </div>
          <div>
            <h2> Saldo Atual: </h2>
            <span> R$  {totalRestante.toFixed(2)}</span>
          </div>
          <div>
            <h2> Saldo Total: </h2>
            <span> R$ {Number(saldo).toFixed(2)}</span>
          </div>
        </TotalContainer>
      <Button
        onClick={() => {
          efetuarCompra()
          setOpenSnackbar(true);
        }}
        color="primary"
        variant="contained"
        disabled={totalRestante < 0 || totalCarrinho === 0}
      >
         Comprar
       </Button>
        <Snackbar
          anchorOrigin={
            { 
              vertical: 'top',
              horizontal: 'right'
            }
          }
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
        >
           <MuiAlert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
          >
            Compra feita com sucesso!
          </MuiAlert>
        </Snackbar>
    </Container>
  )
}

export default Carrinho;