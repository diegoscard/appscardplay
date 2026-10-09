# SCARD PLAY IPTV - Android TV & Google TV Player

Projeto Android TV nativo completo desenvolvido em Kotlin e Jetpack Compose for TV.
Totalmente preparado e otimizado exclusivamente para navegação por controle remoto físico (D-Pad, OK, Voltar, CH+/CH-).

## Plataforma e Tecnologias
- **Plataforma:** Android TV / Google TV / Android TV Boxes
- **Linguagem:** Kotlin 2.0
- **UI:** Jetpack Compose for TV (Material 3 TV)
- **Player de Vídeo:** Android Media3 ExoPlayer (com HLS / m3u8)
- **Arquitetura:** MVVM + Clean Architecture com StateFlow e Coroutines
- **Parser:** M3U Tolerante (#EXTM3U, #EXTINF, tvg-id, tvg-name, tvg-logo, group-title)
- **Armazenamento:** AndroidX DataStore Preferences (sem necessidade de banco pesado)
- **Carregamento de Imagens:** Coil Image Loader com cache em disco e memória

## Identidade Visual
- **Nome:** SCARD PLAY IPTV
- **Subtítulo:** IPTV PLAYER
- **Tema:** Dark Cyber High-Contrast (Fundo Preto profundo `#080C14`, Acentos Neon `#00E5FF` e `#7C4DFF`)
- **Foco:** Borda luminosa e escala suave no item ativo do D-pad.

## Como Gerar o APK de Release (`app-release.apk`)

### Método 1: Linha de Comando (Gradle)
```bash
cd android-project
chmod +x gradlew
./gradlew assembleRelease
```
O arquivo APK gerado estará em:
`app/build/outputs/apk/release/app-release.apk`

### Método 2: Android Studio
1. Abra o Android Studio (Koala / Ladybug / Iguana ou superior com suporte a JDK 17+).
2. Selecione **Open Project** e escolha a pasta `android-project`.
3. Aguarde o Gradle Sync completar.
4. Vá em **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. Transfira o arquivo `app-release.apk` para um pendrive e instale na sua Smart TV Android ou Google TV!

## Testes Unitários
Para rodar os testes unitários do Parser M3U, Categorias, Favoritos e Histórico:
```bash
./gradlew test
```
Testes implementados:
- `M3uParserTest.kt`: Tolerância a atributos ausentes, caracteres acentuados em português, listas vazias, HTTP/HTTPS, fallback de categorias ("OUTROS") e geração de iniciais de logo.
- `CategoryAndFavoritesTest.kt`: Categorias dinâmicas, persistência de favoritos e limitação de histórico.
