"use strict";

const botaoMenu = document.querySelector(".menu-botao");
const menu = document.querySelector("#menu");
const dialogo = document.querySelector("#solicitacao");
const formulario = document.querySelector("#formulario");
const mensagemPronta = document.querySelector("#mensagem-pronta");
const statusCopia = document.querySelector("#status-copia");
const botaoCopiar = document.querySelector("#copiar");
const linkWhatsApp = document.querySelector("#enviar-whatsapp");
const telefoneValtek = String(window.CONFIG_SITE?.whatsapp ?? "").replace(/\D/g, "");
const contatoValido = /^[1-9]\d{9,14}$/.test(telefoneValtek);

function linkDaValtek(mensagem) {
  return `https://wa.me/${telefoneValtek}?text=${encodeURIComponent(mensagem)}`;
}

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.hidden = !contatoValido;
  if (contatoValido) link.href = linkDaValtek(link.dataset.whatsapp);
  else link.removeAttribute("href");
});

function fecharMenu(devolverFoco = false) {
  menu.classList.remove("aberto");
  botaoMenu.setAttribute("aria-expanded", "false");
  botaoMenu.setAttribute("aria-label", "Abrir menu");
  if (devolverFoco) botaoMenu.focus();
}

botaoMenu.addEventListener("click", () => {
  const aberto = botaoMenu.getAttribute("aria-expanded") !== "true";
  botaoMenu.setAttribute("aria-expanded", String(aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("aberto", aberto);
});

menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => fecharMenu()));
document.addEventListener("keydown", evento => {
  if (evento.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") fecharMenu(true);
});
document.addEventListener("click", evento => {
  if (!evento.target.closest(".navegacao")) fecharMenu();
});
window.matchMedia("(min-width: 901px)").addEventListener("change", evento => {
  if (evento.matches) fecharMenu();
});

document.querySelectorAll("[data-servico]").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelector("#servico").value = link.dataset.servico;
  });
});

formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  for (const campo of formulario.querySelectorAll("input[required]")) {
    campo.value = campo.value.trim();
  }
  if (!formulario.reportValidity()) return;

  const dados = new FormData(formulario);
  const nome = String(dados.get("nome")).trim();
  const local = String(dados.get("local")).trim();
  const servico = String(dados.get("servico"));
  const descricao = String(dados.get("descricao")).trim();
  const mensagem = [
    `Olá, Valtek! Meu nome é ${nome} e gostaria de solicitar um orçamento.`,
    `Serviço: ${servico}`,
    `Local: ${local}`,
    descricao ? `Detalhes: ${descricao}` : "",
    "Podemos conversar sobre a disponibilidade e os próximos passos?"
  ].filter(Boolean).join("\n\n");

  mensagemPronta.value = mensagem;
  statusCopia.textContent = "";
  linkWhatsApp.hidden = !contatoValido;
  if (contatoValido) {
    linkWhatsApp.href = linkDaValtek(mensagem);
    document.querySelector("#explicacao-mensagem").textContent = "Confira a mensagem e abra o WhatsApp para falar com a Valtek. O envio só acontece quando você confirmar no aplicativo.";
  } else {
    linkWhatsApp.removeAttribute("href");
    document.querySelector("#explicacao-mensagem").textContent = "O contato está indisponível. Você pode copiar a mensagem abaixo; nenhum pedido foi enviado.";
  }
  dialogo.showModal();
  document.body.classList.add("modal-aberto");
  botaoCopiar.focus();
});

document.querySelector("#fechar-dialogo").addEventListener("click", () => dialogo.close());
dialogo.addEventListener("close", () => document.body.classList.remove("modal-aberto"));
dialogo.addEventListener("click", evento => {
  const retangulo = dialogo.getBoundingClientRect();
  const fora = evento.clientX < retangulo.left || evento.clientX > retangulo.right || evento.clientY < retangulo.top || evento.clientY > retangulo.bottom;
  if (evento.target === dialogo && fora) dialogo.close();
});

botaoCopiar.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Cópia automática indisponível");
    await navigator.clipboard.writeText(mensagemPronta.value);
    statusCopia.textContent = "Mensagem copiada. Você pode colar onde preferir.";
  } catch {
    mensagemPronta.focus();
    mensagemPronta.select();
    statusCopia.textContent = "A cópia automática não está disponível. O texto está selecionado: use Copiar no seu dispositivo.";
  }
});

document.querySelector("#ano").textContent = String(new Date().getFullYear());
formulario.querySelector('button[type="submit"]').disabled = false;


// Apresentação e animações inspiradas no site original.
const cabecalho = document.querySelector(".cabecalho");
function atualizarCabecalho() {
  cabecalho.classList.toggle("rolado", window.scrollY > 40);
}
window.addEventListener("scroll", atualizarCabecalho, { passive: true });
atualizarCabecalho();

const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
const faixa = document.querySelector(".faixa-marcas");
const controleFaixa = document.createElement("button");
controleFaixa.type = "button";
controleFaixa.className = "faixa-controle";
controleFaixa.setAttribute("aria-label", "Pausar animação da faixa");
controleFaixa.setAttribute("aria-pressed", "false");
controleFaixa.textContent = "Ⅱ";
faixa.append(controleFaixa);
controleFaixa.addEventListener("click", () => {
  const pausada = faixa.classList.toggle("pausada");
  controleFaixa.setAttribute("aria-pressed", String(pausada));
  controleFaixa.setAttribute("aria-label", pausada ? "Retomar animação da faixa" : "Pausar animação da faixa");
  controleFaixa.textContent = pausada ? "▶" : "Ⅱ";
});

const entradas = [...document.querySelectorAll(".entrada")];
const contagens = [...document.querySelectorAll("[data-contagem]")];
const quadrosContagem = new Map();
let observadorEntradas;
let observadorContagem;

function mostrarConteudo() {
  observadorEntradas?.disconnect();
  observadorContagem?.disconnect();
  entradas.forEach(elemento => elemento.classList.remove("aguardando"));
  quadrosContagem.forEach(quadro => cancelAnimationFrame(quadro));
  quadrosContagem.clear();
  contagens.forEach(elemento => { elemento.textContent = elemento.dataset.contagem; });
}

function animarContagem(elemento) {
  const fim = Number(elemento.dataset.contagem);
  if (!Number.isFinite(fim) || movimentoReduzido.matches) return;
  const inicio = performance.now();
  function quadro(agora) {
    const progresso = Math.min(1, (agora - inicio) / 1100);
    const suavizado = 1 - Math.pow(1 - progresso, 3);
    elemento.textContent = String(Math.round(fim * suavizado));
    if (progresso < 1) quadrosContagem.set(elemento, requestAnimationFrame(quadro));
    else quadrosContagem.delete(elemento);
  }
  quadrosContagem.set(elemento, requestAnimationFrame(quadro));
}

if (!movimentoReduzido.matches && "IntersectionObserver" in window) {
  try {
    observadorEntradas = new IntersectionObserver(registros => {
      registros.forEach(registro => {
        if (registro.isIntersecting) {
          registro.target.classList.remove("aguardando");
          observadorEntradas.unobserve(registro.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
    entradas.forEach(elemento => {
      elemento.classList.add("aguardando");
      observadorEntradas.observe(elemento);
    });
    observadorContagem = new IntersectionObserver(registros => {
      registros.forEach(registro => {
        if (registro.isIntersecting) {
          animarContagem(registro.target);
          observadorContagem.unobserve(registro.target);
        }
      });
    }, { threshold: .5 });
    contagens.forEach(elemento => observadorContagem.observe(elemento));
  } catch {
    mostrarConteudo();
  }
}
movimentoReduzido.addEventListener("change", evento => {
  if (evento.matches) mostrarConteudo();
});
document.addEventListener("focusin", evento => {
  evento.target.closest(".entrada")?.classList.remove("aguardando");
});

// Links de imagem funcionam normalmente quando o diálogo não está disponível.
const galeria = document.querySelector("#galeria-dialogo");
const imagemGaleria = document.querySelector("#galeria-imagem");
const tituloGaleria = document.querySelector("#galeria-titulo");
const fecharGaleria = document.querySelector("#fechar-galeria");
let origemGaleria = null;

document.querySelectorAll("[data-galeria]").forEach(link => {
  link.addEventListener("click", evento => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey ||
        evento.button > 0 || typeof galeria.showModal !== "function") return;
    evento.preventDefault();
    const imagem = link.querySelector("img");
    imagemGaleria.src = imagem.getAttribute("src");
    imagemGaleria.alt = imagem.alt;
    tituloGaleria.textContent = link.closest("figure").querySelector("h3").textContent;
    origemGaleria = link;
    galeria.showModal();
    document.body.classList.add("modal-aberto");
    fecharGaleria.focus();
  });
});
fecharGaleria.addEventListener("click", () => galeria.close());
galeria.addEventListener("click", evento => {
  if (evento.target !== galeria) return;
  const area = galeria.getBoundingClientRect();
  if (evento.clientX < area.left || evento.clientX > area.right ||
      evento.clientY < area.top || evento.clientY > area.bottom) galeria.close();
});
galeria.addEventListener("close", () => {
  document.body.classList.remove("modal-aberto");
  origemGaleria?.focus({ preventScroll: true });
});
