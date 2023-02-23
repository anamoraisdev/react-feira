import Carrinho from "pages/Carrinho"
import Feira from "pages/Feira"
import React from "react"
import { BrowserRouter, Switch, Route  } from "react-router-dom"
import Login from './pages/Login'
import { UsuarioProvider } from "common/context/usuario"
import { CarrinhoProvider } from "common/context/carrinho"
import { PagamentoProvider } from "common/context/pagamento"

const Routes = () => {
    return(
        <BrowserRouter>
            <Switch>
                <UsuarioProvider>
                    <Route exact path="/">
                            <Login/>
                    </Route>
                    <PagamentoProvider>
                        <CarrinhoProvider>
                            <Route path="/feira">
                                <Feira/>    
                            </Route>
                            <Route path="/carrinho">
                                <Carrinho/>
                            </Route>
                        </CarrinhoProvider>
                    </PagamentoProvider>
                </UsuarioProvider>
            </Switch>
        </BrowserRouter>
    )
}
export default Routes;