# Guia Completo: Como Publicar o SCARD PLAY na Loja Oficial da Samsung (Samsung Apps TV)

Este documento explica todo o processo para publicar seu aplicativo na loja oficial das Smart TVs Samsung (Tizen OS), para que qualquer usuário possa pesquisar na TV e instalar em 1 clique.

---

## 1. Informações Básicas
* **Plataforma:** Samsung Smart TV (Tizen OS 3.0+)
* **Formato do Arquivo Aceito:** `.wgt` (Tizen Web Application Widget)
* **Custo da Conta de Desenvolvedor:** **GRATUITO** (a Samsung não cobra anuidade nem taxa de inscrição)
* **Portal Oficial:** [https://seller.samsungapps.com/tv](https://seller.samsungapps.com/tv)

---

## 2. Regra Crucial da Samsung para Aplicativos IPTV
Para que a Samsung **aprove** seu aplicativo na loja:
- **O aplicativo deve ser submetido como um Media Player neutro:**
  - O app **não pode** vir com lista de canais, filmes ou séries pré-carregados dentro do código.
  - A descrição na loja deve ser: *"Player de mídia e IPTV para reprodução de listas M3U e contas pessoais fornecidas pelo usuário."*
  - Exatamente como fazem os aplicativos aprovados na loja da Samsung: **IBO Player**, **SS IPTV**, **Smart IPTV**, **Bay TV**, **Bob Player**.

---

## 3. Passo a Passo para Publicação

### Passo 1: Criar Conta no Samsung Seller Office
1. Acesse o portal oficial da Samsung:
   👉 **https://seller.samsungapps.com/tv**
2. Clique em **Sign In / Sign Up** com sua conta Samsung (pode ser a mesma conta da sua TV ou uma nova).
3. Complete o cadastro de desenvolvedor (como Pessoa Física / Individual ou Empresa / Corporate).
4. A ativação da conta é gratuita e imediata.

### Passo 2: Preparar o Projeto Web
O SCARD PLAY foi construído com tecnologias web (React, HTML5, HLS/MPEG-TS), que é exatamente a tecnologia padrão do Tizen Web App.
1. No projeto, execute:
   ```bash
   npm run build
   ```
2. A pasta `dist` gerada contém todos os arquivos do app.
3. Copie o arquivo `config.xml` (criado na pasta `/samsung-tizen-store/config.xml`) para dentro da pasta com os arquivos do app.

### Passo 3: Baixar o Tizen Studio e Gerar o Pacote .wgt
1. Baixe o **Tizen Studio with TV Extension** no site oficial:
   👉 **https://developer.samsung.com/smarttv/develop/tools/tizen-studio/download.html**
2. No Tizen Studio:
   - Abra o **Certificate Manager** e crie um **Samsung Certificate** (gera o certificado oficial gratuito assinado pela Samsung).
   - Crie um novo projeto do tipo **Tizen Web Application (TV)**.
   - Cole os arquivos do build (`dist/`) e o `config.xml`.
   - Clique com o botão direito no projeto > **Build Signed Package**.
   - O Tizen Studio vai gerar o arquivo: **`SCARD_PLAY.wgt`**.

### Passo 4: Submeter na Loja da Samsung
1. No portal **Samsung Apps TV Seller Office** (https://seller.samsungapps.com/tv):
2. Clique em **"1. Create Application"**.
3. Preencha as informações:
   * **Application Title:** SCARD PLAY IPTV PLAYER
   * **Category:** Video / Entertainment
   * **Service Country:** Brasil (ou Todos os países)
   * **Language:** Português (Brasil)
   * **Description:** Player moderno para reprodução de conteúdos e listas IPTV pessoais com suporte a controle remoto de Smart TV.
4. Faça o upload das imagens:
   * **App Icon:** 512x512 px (PNG)
   * **Screenshots da TV:** 1920x1080 px (PNG ou JPG) mostrando as telas do app (tela inicial, canais, player).
5. Faça o upload do arquivo **`SCARD_PLAY.wgt`**.
6. Preencha os dados de teste (usuário e senha de teste para os analistas da Samsung poderem testar na Coreia/EUA).
7. Clique em **Submit**.

---

## 4. Quanto tempo demora a aprovação?
* A Samsung leva em média de **5 a 10 dias úteis** para analisar o aplicativo em Smart TVs reais.
* Eles testam:
  - Se responde corretamente ao controle remoto (Setas, Enter, Voltar).
  - Se não trava ao abrir e fechar.
  - Se o layout se adapta à tela 16:9.
* Assim que aprovado pelo time de QA da Samsung, o status muda para **"Published"**.
* A partir desse momento, qualquer pessoa com TV Samsung no Brasil pode abrir a loja da TV, digitar **SCARD PLAY** e instalar!
