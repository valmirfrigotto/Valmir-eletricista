# Versões da página Valtek

## Versão anterior preservada apenas como código

| Item | Referência |
| --- | --- |
| Consulta do código | [Abrir arquivos no GitHub](https://github.com/valmirfrigotto/Valmir-eletricista/tree/site-anterior-2026-10-23) |
| Página antiga | Retirada do GitHub Pages em 24/10/2026 |
| Commit original | `0f0b3aed0ee4e2ee97e9b9e172c31620f3708b37` |
| Marcador no Git | `site-anterior-2026-10-23` |

O marcador guarda os 24 arquivos do commit original sem alterações, incluindo HTML, estilos, scripts, imagens e arquivos auxiliares. É possível consultar cada arquivo ou baixar essa revisão pelo GitHub. O GitHub Pages publica somente a raiz da branch `main`; esse marcador não publica uma página separada.

A antiga pasta `versoes/anterior-2026-10-23/` foi retirada de `main`. Seu endereço público deixa de servir a versão antiga. O código continua integralmente preservado no marcador e no histórico Git. A versão atual está na raiz do projeto.

## Como voltar à versão anterior

Você pode pedir: **“Restaure a versão anterior do site, salva em 23/10/2026.”** A restauração deve manter as duas versões no histórico do projeto e publicar a escolhida no endereço principal pelo GitHub Pages.

Para fazer pelo Git, comece com o checkout sem alterações pendentes. Confira `git status --short`; se houver alterações, preserve-as antes de continuar.

```powershell
git switch main
git pull --ff-only origin main
git fetch origin tag site-anterior-2026-10-23
git restore --source=site-anterior-2026-10-23 -- index.html style.css script.js manifest.json robots.txt sitemap.xml img
git add -- index.html style.css script.js manifest.json robots.txt sitemap.xml img
git commit -m "Restaura a versão anterior da página Valtek"
git push origin main
```

Esses comandos recolocam os arquivos originais na raiz sem apagar os novos arquivos `assets/`, `estilo.css`, `site.js` e `config.js`. A versão com tema grafite também permanece no histórico do Git. Depois do push, confirme o build do GitHub Pages e abra o endereço principal para verificar qual versão foi publicada.

Os links e as instruções são para consulta. Nenhuma restauração é executada automaticamente.
