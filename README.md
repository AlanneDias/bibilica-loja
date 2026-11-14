# Bibilica Boutique Infantil — loja virtual

Catálogo online da Bibilica. A cliente escolhe as peças, monta o carrinho e envia o pedido pronto pelo WhatsApp. O pagamento e o frete dos Correios são combinados na conversa.

Site no ar: https://bibilica.netlify.app

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `index.html` | A loja inteira: visual, peças, carrinho e mensagem do WhatsApp |
| `assets/` | Fotos das peças, logo, laço e ilustrações |
| `estoque-bibilica.xlsx` | Modelo da planilha de estoque (a versão em uso está no Google Planilhas) |

## Como mudar as coisas mais comuns

Tudo fica no bloco **CONFIGURAÇÃO DA LOJA**, dentro do `<script>` no fim do `index.html`.

- **Número do WhatsApp:** `const WHATSAPP = "5583988325972";`
- **Desconto no Pix/espécie:** `const DESCONTO_PIX = 0.05;`
- **Parcelas no cartão:** `const PARCELAS = 3;`
- **Taxa do moto táxi (Campina Grande):** `const TAXA_MOTO = 10.00;`

### Adicionar uma peça
1. Coloque a foto em `assets/` (formato vertical 4:5, de preferência com 1000 px de largura).
2. Na lista `PECAS`, copie um bloco e troque os dados:
   ```js
   {
     id: "BIB-031",
     nome: "Vestido Exemplo",
     descricao: "Texto curto sobre a peça.",
     preco: 199.90,
     tamanhos: ["1", "2", "3"],
     foto: "assets/vestido-exemplo.jpg",
     fotosExtras: ["assets/vestido-exemplo-2.jpg"]   // opcional
   }
   ```
3. Inclua uma linha por tamanho na planilha de estoque.

## Estoque

O site lê a aba **Estoque** da planilha do Google a cada visita (`PLANILHA_CSV`).

- Coluna **Quantidade** = quantas peças existem daquele tamanho.
- **0** = o tamanho aparece riscado. Todos os tamanhos em 0 = a peça sai do site.
- Célula vazia = conta como 1 peça.
- A planilha precisa estar compartilhada como **"Qualquer pessoa com o link" · Leitor**.
- Se a planilha não carregar, o site usa a lista `ESTOQUE` do código.

Para conferir se a planilha está sendo lida, abra o site com `#estoque` no fim do endereço: aparece uma faixa verde (lida) ou vermelha (erro).

## Publicação

O site é publicado no Netlify. Com o repositório ligado ao Netlify, cada alteração enviada para a branch `main` entra no ar sozinha.

---
Feito por Designer Alanne Dias · [@alannedias.designer](https://www.instagram.com/alannedias.designer/)
