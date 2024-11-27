# Project Documentation

## Índice
1. [Introdução](#introdução)
2. [Execução](#execução)
3. [Endpoints](#endpoints)
    - [Token](#token)
        - [Gerar Token](#gerar-token)
    - [Produtos](#produtos)
        - [Criar Produtos](#criar-produtos)
        - [Buscar Produto](#buscar-produto)
        - [Buscar Todos Produtos](#buscar-todos-produto)
        - [Atualizar Produto](#atualizar-produto)
        - [Deletar Produto](#deletar-produto)
    - [Carrinho](#produtos)
        - [Adicionar Produtos Carrinho](#adicionar-produtos-carrinho)
        - [Buscar Produtos Carrinho](#buscar-produtos-carrinho) 
        - [Deletar Produto Carrinho](#deletar-produto-carrinho) 
        - [Deletar Todos Produtos Carrinho](#deletar-todos-produtos-carrinho) 
        - [Checar Compra](#checar-compra)  
4. [Notas Finais](#notas-finais)

---

## Introdução
Este projeto contempla o desenvolvimento de um backend de uma loja online que vende produtos digitais. O sistema permite que um usuário adicione, busque, atualize e remova produtos, além de também poder adicionar os produtos no carrinho de compras. A finalização da compra, faz atualizações atomicas, verificando se há estoque o suficiente do produto e decrementando a quantidade do mesmo.

---

## Execução
Para executar o projeto primeiro é necessário baixar as dependências com o comando `npm install`. O próximo passo é configurar as variáveis de ambiente da seguinte forma:

- Criar um arquivo chamado `.env` e adicionar duas variáveis, `MONGO_URI` referente a URL de acesso ao mongoDB e `JWT_SECRET` referente ao token JWT para acesso aos endpoints, segue um exemplo de preenchimento abaixo:

```js
MONGO_URI = mongodb+srv://user:password@cluster0.1ldfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

JWT_SECRET = eyJSb2xIjoiQWRtaW4iLCJJc3ZXIiOJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzIsImV4cCI6MTMjMDQ5NSwiaWF0IjoxNzMjQwNDk1fQ
```

---

## Endpoints

### Token

#### Gerar Token

- **URL:** `/token/generateToken`
- **Método:** `POST`
- **Descrição:** Cria um Bearer token para autenticar nos demais endpoints

#### Parâmetros da Requisição

Esse endpoint não possui parâmetros, entretanto é necessário adicionar no Authorization o tipo `Basic Auth`, preenchendo o `Username: admin` e `Username: root`

#### Exemplo de Requisição
```http
POST /token/generateToken HTTP/1.1
Host: http://localhost:3000
Authorization: Basic YWRtaW46cm9vdA== // "Username e password codificados"
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluIiwicm9sZSI6InN5c3RlbSIsImlhdCI6MTczMjcxODI5NiwiZXhwIjoxNzMyODA0Njk2fQ.BOGB1wLxviJYlKNTkA_FEfVkVYrHnJ-_pxE0u13lJrw"
}
```
---
### Produtos

#### Criar Produtos

- **URL:** `/products/createProduct`
- **Método:** `POST`
- **Descrição:** Cria um produto no banco de dados

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `name`    | String    | Sim         | Nome do produto.           |
| `price`| Number   | Sim         | Preço do produto.   |
| `stock` | Number  | Sim         | Quantidade do produto.  

#### Exemplo de Requisição
```http
POST /products/createProduct HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json

{
    "name": "Notebook",
    "price": 4000.50,
    "stock": 10
}
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "data": {
        "_id": "674730b6de34b4da7d619dc8",
        "name": "Notebook",
        "price": 4000.5,
        "stock": 10,
        "__v": 0
    }
}
```

#### Buscar Produto

- **URL:** `/products/getProduct`
- **Método:** `GET`
- **Descrição:** Busca um produto por seu respectivo ID

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `productId`    | String    | Sim         | ID do produto.           |

#### Exemplo de Requisição
```http
GET /products/getProduct?productId=674610878903235633cd6f28 HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "product": {
        "_id": "674610878903235633cd6f28",
        "name": "Televisão",
        "price": 1050.99,
        "stock": 10
    }
}
```

#### Buscar Todos Produtos

- **URL:** `/products/getAllProducts`
- **Método:** `GET`
- **Descrição:** Busca todos os produtos do banco de dados

#### Parâmetros da Requisição

Esse endpoint não possui parâmetros, pois sua responsabilidade é trazer todos os produtos

#### Exemplo de Requisição
```http
GET /products/getAllProducts HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "response": {
        "count": 2,
        "products": [
            {
                "_id": "674610878903235633cd6f28",
                "name": "Televisão",
                "price": 1050.99,
                "stock": 10
            },
            {
                "_id": "674730b6de34b4da7d619dc8",
                "name": "Notebook",
                "price": 4000.5,
                "stock": 10
            }
        ]
    }
}
```
#### Atualizar Produto

- **URL:** `/products/updateProduct`
- **Método:** `PATCH`
- **Descrição:** Atualiza um produto por seu respectivo ID

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `productId`    | String    | Sim         | ID do produto.           |

#### Exemplo de Requisição
```http
PATCH /products/updateProduct?productId=674610878903235633cd6f28 HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "message": "Product has been updated 674610878903235633cd6f28"
}
```

#### Deletar Produto

- **URL:** `/products/deleteProduct`
- **Método:** `DELETE`
- **Descrição:** Deleta um produto por seu respectivo ID

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `productId`    | String    | Sim         | ID do produto.           |

#### Exemplo de Requisição
```http
DELETE /products/deleteProduct?productId=674610878903235633cd6f28 HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "message": "Product has been deleted 674610878903235633cd6f28"
}
```
---

### Carrinho

#### Adicionar Produtos Carrinho

- **URL:** `cart/addProductCart`
- **Método:** `POST`
- **Descrição:** Adiciona um produto no carrinho de compras

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `itens`    | Array    | Sim         | Produtos a serem comprados           |

#### Exemplo de Requisição
```http
POST /cart/addProductCart HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json

{
    "itens": [
        {
            "productId": "67460fde8903235633cd6f21",
            "quantity": 1
        }
    ]
}
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "data": {
        "_id": "67474a3dde34b4da7d619dd3",
        "itens": [
            {
                "productId": "67460fde8903235633cd6f21",
                "quantity": 1
            }
        ],
        "createdAt": "2024-11-27T16:35:09.669Z",
        "__v": 0
    }
}
```

#### Buscar Produtos Carrinho

- **URL:** `cart/getProductsCart`
- **Método:** `GET`
- **Descrição:** Busca todos os produtos que estão no carrinho de compras

#### Parâmetros da Requisição

Esse endpoint não possui parâmetros, pois sua responsabilidade é trazer todos os produtos do carrinho de compras

#### Exemplo de Requisição
```http
GET /cart/getProductsCart HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "_id": "67474a3dde34b4da7d619dd3",
    "count": 1,
    "itens": [
        {
            "productId": "67460fde8903235633cd6f21",
            "quantity": 1
        }
    ]
}
```
#### Deletar Produto Carrinho

- **URL:** `cart/deleteProductFromCart`
- **Método:** `DELETE`
- **Descrição:** Deleta um produto do carrinho de compras

#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `productId`    | String    | Sim         | ID do produto.           |

#### Exemplo de Requisição
```http
DELETE /cart/deleteProductFromCart?productId=67460fde8903235633cd6f21 HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "message": "Product removed from cart",
    "data": {
        "_id": "67474a3dde34b4da7d619dd3",
        "itens": [],
        "createdAt": "2024-11-27T16:35:09.669Z",
        "__v": 1
    }
}
```
#### Deletar Todos Produtos Carrinho

- **URL:** `cart/deleteAllProductsCart`
- **Método:** `DELETE`
- **Descrição:** Deleta todos os produto do carrinho de compras

#### Parâmetros da Requisição

Esse endpoint não possui parâmetros, pois sua responsabilidade é deletar todos os produtos do carrinho de compras

#### Exemplo de Requisição
```http
DELETE /cart/deleteAllProductsCart?productId=67460fde8903235633cd6f21 HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "message": "All products have been removed from the cart"
}
```
#### Checar Compra

- **URL:** `cart/purchaseCheck`
- **Método:** `GET`
- **Descrição:** Verifica atomicamente o estoque e atualiza caso as condições do carrinho de compras sejam validadas 
#### Parâmetros da Requisição

| Nome       | Tipo     | Obrigatório | Descrição                           |
|------------|----------|-------------|-------------------------------------|
| `cartId`    | String    | Sim         | ID do carrinho de compras.           |

#### Exemplo de Requisição
```http
GET /cart/purchaseCheck?cartId=67474c46de34b4da7d619ddc HTTP/1.1
Host: http://localhost:3000
Authorization: Bearer <seu-token-aqui>
Content-Type: application/json
```
#### Exemplo de Retornos

```json
{
    "success": true,
    "message": "Purchase completed successfully"
}
```

## Notas Finais

Este projeto foi um desafio técnico para uma entrevista de emprego.
