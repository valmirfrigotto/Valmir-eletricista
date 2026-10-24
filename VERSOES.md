# Versões da página Valtek

## Versão anterior preservada

| Item | Referência |
| --- | --- |
| Pasta | `versoes/anterior-2026-10-23/` |
| Visualização | [Abrir versão anterior](https://valmirfrigotto.github.io/Valmir-eletricista/versoes/anterior-2026-10-23/) |
| Commit original | `0f0b3aed0ee4e2ee97e9b9e172c31620f3708b37` |
| Marcador no Git | `site-anterior-2026-10-23` |

A pasta guarda uma cópia integral e sem alterações dos arquivos rastreados no commit original, incluindo HTML, estilos, scripts, imagens e arquivos auxiliares. O marcador aponta para o mesmo commit. A versão atual está na raiz do projeto.

## Como voltar à versão anterior

Você pode pedir: **“Restaure a versão anterior do site, salva em 23/10/2026.”** A restauração deve manter as duas versões no projeto e publicar novamente pelo GitHub Pages.

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
