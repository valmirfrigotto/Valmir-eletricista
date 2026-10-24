/**
 * VoltPrime - JavaScript
 * Gerencia menu responsivo, scroll animado, modal de galeria e form.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Efeito do Cabeçalho no Scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  // 2. Menu Mobile
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('is-open');
    document.body.classList.toggle('menu-open');
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });

  // 3. Scroll Reveal (Efeito de entrada)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Animação dos Números (Contador Hero)
  const stats = document.querySelectorAll('[data-count]');
  let animated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const suffix = stat.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 50; 
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            clearInterval(timer);
            stat.textContent = target + suffix;
          } else {
            stat.textContent = Math.ceil(current) + suffix;
          }
        }, 30);
      });
      animated = true;
    }
  });

  const statsSection = document.querySelector('.hero__stats');
  if(statsSection) {
    statsObserver.observe(statsSection);
  }

  // 5. Lightbox da Galeria de Projetos
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery__item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h3').textContent;
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = title;
      
      lightbox.showModal();
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.close();
  });

  // Fecha o lightbox clicando fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.close();
    }
  });

  // 6. Validação e Envio Simulado do Formulário
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        const errSpan = document.getElementById(`err-${input.id}`);
        if (!input.value.trim()) {
          isValid = false;
          input.setAttribute('aria-invalid', 'true');
          if(errSpan) errSpan.textContent = 'Campo obrigatório';
        } else {
          input.removeAttribute('aria-invalid');
          if(errSpan) errSpan.textContent = '';
        }
      });

      if (isValid) {
        const btn = form.querySelector('button[type="submit"]');
        btn.classList.add('is-loading');

        const nome = document.getElementById('nome').value;
        const servico = document.getElementById('servico').value;
        const mensagem = document.getElementById('mensagem').value;

        let texto = `Olá! Meu nome é ${nome}. Gostaria de solicitar um orçamento para o serviço de ${servico}.`;
        if (mensagem.trim()) {
          texto += `\n\nDetalhes: ${mensagem}`;
        }

        const waUrl = `https://wa.me/5541988219664?text=${encodeURIComponent(texto)}`;

        setTimeout(() => {
          btn.classList.remove('is-loading');
          window.open(waUrl, '_blank');
          form.reset();
        }, 600);
      }
    });
  }

  // 7. Atualiza o ano no rodapé dinamicamente
  const yearElement = document.getElementById('year');
  if(yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
