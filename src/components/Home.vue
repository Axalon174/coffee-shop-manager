<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '../stores/menu'

const router = useRouter()
const menu = useMenuStore()

// Estado para la sección activa
const activeSection = ref('hero')
const selectedCategory = ref(null)

// Cargar menú al iniciar
onMounted(() => {
  menu.fetchMenu()
})

const featuredItems = computed(() => {
  if (selectedCategory.value) {
    return itemsByCategory.value[selectedCategory.value] || []
  }
  return menu.items.slice(0, 6)
})

const itemsByCategory = computed(() => {
  const grouped = {}
  const list = menu.items || [] 
  
  list.forEach(item => {
    const cat = item.category || 'Otros'
    
    if (!grouped[cat]) {
      grouped[cat] = []
    }
    grouped[cat].push(item)
  })
  
  return grouped
})

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="home-page">
    <!-- Header -->
    <header class="header sticky-top">
      <div class="container">
        <a href="#hero" class="logo" @click.prevent="scrollToSection('hero')">
          <h1 class="sitename">Café Charly</h1>
        </a>

        <nav class="navmenu">
          <ul>
            <li><a href="#hero" @click.prevent="scrollToSection('hero')" :class="{ active: activeSection === 'hero' }">Inicio</a></li>
            <li><a href="#about" @click.prevent="scrollToSection('about')" :class="{ active: activeSection === 'about' }">Sobre Nosotros</a></li>
            <li><a href="#menu" @click.prevent="scrollToSection('menu')" :class="{ active: activeSection === 'menu' }">Menú</a></li>
            <li><a href="#contact" @click.prevent="scrollToSection('contact')" :class="{ active: activeSection === 'contact' }">Contacto</a></li>
            <li><router-link to="/orders">Gestionar Comandas</router-link></li>
          </ul>
        </nav>

        <a class="btn-getstarted" href="#menu" @click.prevent="scrollToSection('menu')">Ver el menú</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Disfruta de una<br>Exquisita taza de café</h1>
            <p class="hero-subtitle">Más que charlas digitales, ¡Aquí encontrarás mucho de qué conversar!</p>
            <div class="hero-buttons">
              <a href="#menu" @click.prevent="scrollToSection('menu')" class="btn-primary">Ver el menú</a>
              <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" class="btn-video" target="_blank">
                <span class="play-icon">▶</span>
                <span>Vídeo promocional</span>
              </a>
            </div>
          </div>
          <div class="hero-image">
            <div class="coffee-cup-illustration"><img src="/src/assets/images/hero-img-icon.png" alt="☕"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="container">
        <div class="section-title">
          <h2>Acerca de nosotros</h2>
          <p><span>Aprende más</span> <span class="highlight">Sobre nosotros</span></p>
        </div>

        <div class="about-content">
          <div class="about-image-side">
            <div class="about-image-placeholder">
              <span class="image-icon">🏪</span>
            </div>
            <div class="book-table">
              <h3>Reserva una mesa</h3>
              <p class="phone-number">📞 +52 352 116 6570</p>
            </div>
          </div>

          <div class="about-text-side">
            <p class="intro-text">
              Esta es una pequeña descripción de nuestro concepto, queremos que se sientan lo más cómodos posibles para charlar.
            </p>
            <p>
              Aquí, en Café Charly, creemos en el poder de las conversaciones reales y las relaciones humanas. Y es eso lo que nos lleva a construir un ambiente íntimo donde nuestros clientes se sienten libres de escapar de la realidad y disfrutar de un buen café mientras saborean momentos cálidos, sonrisas y conversaciones inolvidables.
            </p>
            <div class="about-image-small">
              <div class="small-image-placeholder">
                <span class="image-icon">☕</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Menu Section -->
    <section id="menu" class="menu-section">
      <div class="container">
        <div class="section-title">
          <h2>Nuestro Menú</h2>
          <p><span>Revisa nuestro</span> <span class="highlight">Delicioso Menú</span></p>
        </div>

        <div v-if="menu.loading" class="loading-state">
          Cargando deliciosos productos...
        </div>

        <div v-else class="menu-content">
          <!-- Tabs de categorías -->
          <div class="menu-tabs" v-if="Object.keys(itemsByCategory).length > 0">
            <button 
                class="tab-button" 
                :class="{ active: selectedCategory === null }"
                @click="selectedCategory = null"
            >
                Destacados
            </button>
            <button 
              v-for="(items, category) in itemsByCategory" 
              :key="category"
              class="tab-button"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>
          <!-- Grid de productos destacados -->
          <div v-if="featuredItems.length > 0" class="menu-grid">
            <div 
              v-for="item in featuredItems" 
              :key="item.id"
              class="menu-item"
            >
                <div class="menu-item-image">
                <span v-if="!item.img_url" class="item-emoji">
                  {{ item.category === 'Bebidas' ? '☕' : 
                   item.category === 'Postres' ? '🧁' : '🍪' }}
                </span>
                <img 
                  v-else 
                  :src="item.img_url" 
                  :alt="item.name" 
                  style="max-width: 80px; max-height: 80px; border-radius: 8px;"
                >
              </div>
              <h4>{{ item.name }}</h4>
              <p class="item-description">{{ item.description }}</p>
              <p class="item-price">${{ item.price }}</p>
            </div>
          </div>

          <div class="menu-footer">
            <router-link to="/orders" class="btn-primary">Hacer un pedido</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-title">
          <h2>Contacto</h2>
          <p><span>¿Necesitas ayuda?</span> <span class="highlight">Contáctanos</span></p>
        </div>

        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.01272019195!2d-102.02428372498814!3d20.341093181141684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842c1f34213cc2f9%3A0x12ac46f584a2358b!2sCaf%C3%A9%20Charly!5e0!3m2!1sen!2smx!4v1749125823232!5m2!1sen!2smx" 
            width="100%" 
            height="450" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>

        <div class="contact-info-grid">
          <div class="contact-info-item">
            <i class="icon">📍</i>
            <div>
              <h3>Dirección</h3>
              <p class="footer-text">Portal Morelos #32, La Piedad Michoacán CP: 59300</p>
            </div>
          </div>

          <div class="contact-info-item">
            <i class="icon">📞</i>
            <div>
              <h3>Llámanos</h3>
              <p class="phone-number">+52 352 116 6570</p>
            </div>
          </div>

          <div class="contact-info-item">
            <i class="icon">✉️</i>
            <div>
              <h3>Escríbenos</h3>
              <p>cafe.charly@gmail.com</p>
            </div>
          </div>

          <div class="contact-info-item">
            <i class="icon">🕒</i>
            <div>
              <h3>Horario</h3>
              <p><strong>Lunes a Viernes:</strong> 11AM - 9PM</p>
              <p><strong>Sábado a Domingo:</strong> 10AM - 10PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-col">
            <i class="footer-icon">📍</i>
            <div class="footer-text">
              <h4>Dirección</h4>
              <p>Portal Morelos #32</p>
              <p>La Piedad Michoacán</p>
            </div>
          </div>

          <div class="footer-col">
            <i class="footer-icon">📞</i>
            <div class="footer-text">
              <h4>Contacto</h4>
              <p><strong>Teléfono:</strong> +52 352 116 6570</p>
              <p><strong>Email:</strong> cafe.charly@gmail.com</p>
            </div>
          </div>

          <div class="footer-col">
            <i class="footer-icon">🕒</i>
            <div    class="footer-text">
              <h4>Horario</h4>
              <p><strong>Lunes a Viernes:</strong> 11AM - 9PM</p>
              <p><strong>Sábado a Domingo:</strong> 10AM - 10PM</p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 Café Charly. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Scroll Top Button -->
    <a href="#" @click.prevent="scrollToSection('hero')" class="scroll-top">
      <span>↑</span>
    </a>
  </div>
</template>

<style scoped>
/* Variables */
:root {
  --crema-fondo: #D4D5B9;
  --marron-cafe: #8E5A30;
  --negro-carbonizado: #1A1817;
  --hueso-claro: #E9E9E0;
  --primary-color: #8E5A30;
  --primary-dark: #58371cff;
  --coffee-light: #D4D5B9;
  --text-dark: #1A1817;
  --text-light: #5a5a52;
}

/* Reset & Base */
.home-page {
  width: 100%;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Header */
.header {
  background: linear-gradient(135deg, #8E5A30 0%, #6d4524 100%);
  padding: 1rem 0;
  position: fixed;
  min-width:100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}


.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: white;
  transition: opacity 0.3s;
}

.logo:hover {
  opacity: 0.9;
}

.sitename {
  font-family: 'Amatic SC', cursive;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.navmenu ul {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  align-items: center;
}

.navmenu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.navmenu a:hover,
.navmenu a.active {
  border-bottom-color: #342551ff;
  border-bottom-style: solid;
  border-bottom-width: 3px;
}

.btn-getstarted {
  background: #E9E9E0;
  color: #8E5A30;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-getstarted:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #E9E9E0 0%, #D4D5B9 100%);
  padding: 5rem 0;
  min-height: 300px;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-title {
  font-family: 'Amatic SC', cursive;
  font-size: 3.5rem;
  color: var(--text-dark);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}
h3{
  color: #fff;}
.hero-buttons {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.btn-primary {
  background: #8E5A30;
  color: #E9E9E0;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary:hover {
  background: #6d4524;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(142, 90, 48, 0.3);
}

.btn-video {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dark);
  text-decoration: none;
  transition: color 0.3s;
}

.btn-video:hover {
  color: var(--primary-color);
}

.play-icon {
  background: #8E5A30;
  color: #E9E9E0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.hero-image {
  display: flex;
  padding-top: 10dvh;
  justify-content: center;
  align-items: center;
}

.coffee-cup-illustration {
  font-size: 15rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Section Title */
.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  font-family: 'Amatic SC', cursive;
  font-size: 3rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.section-title p {
  font-size: 1.2rem;
  color: var(--text-light);
}

.section-title .highlight {
  color: #8E5A30;
  font-weight: 600;
}

/* About Section */
.about-section {
  padding: 5rem 0;
  background: #E9E9E0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-image-placeholder,
.small-image-placeholder {
  background: linear-gradient(135deg, #D4D5B9 0%, #c4c5a9 100%);
  border-radius: 12px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.small-image-placeholder {
  height: 250px;
  margin-top: 2rem;
}

.image-icon {
  font-size: 5rem;
}

.book-table {
  background: #8E5A30;
  color: #E9E9E0;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.book-table h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.book-table p {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.intro-text {
  font-style: italic;
  color: var(--text-light);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.about-text-side p {
  line-height: 1.8;
  color: var(--text-dark);
  margin-bottom: 1rem;
}

/* Menu Section */
.menu-section {
  padding: 5rem 0;
  background: #D4D5B9;
}

.loading-state {
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-light);
  padding: 3rem;
}

.menu-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab-button {
  background: #E9E9E0;
  border: 2px solid #8E5A30;
  color: #8E5A30;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-button:hover,
.tab-button.active {
  background: #8E5A30;
  color: #E9E9E0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.menu-item {
  background: #E9E9E0;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #b8b9a0;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.menu-item-image {
  margin-bottom: 1rem;
}

.item-emoji {
  font-size: 4rem;
}

.menu-item h4 {
  color: var(--text-dark);
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.item-description {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.item-price {
  color: #8E5A30;
  font-size: 1.5rem;
  font-weight: bold;
}

.menu-footer {
  text-align: center;
}

/* Contact Section */
.contact-section {
  padding: 5rem 0;
  background: #E9E9E0;
}

.map-container {
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.contact-info-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.5rem;
  background: #D4D5B9;
  border-radius: 12px;
  transition: transform 0.3s;
}

.contact-info-item:hover {
  transform: translateY(-3px);
}

.contact-info-item .icon {
  font-size: 2rem;
}

.contact-info-item h3 {
  color: var(--text-dark);
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.contact-info-item p {
  color: var(--text-light);
  margin: 0.25rem 0;
}

/* Footer */
.footer {
  background: linear-gradient(135deg, #1A1817 0%, #0d0c0c 100%);
  color: #E9E9E0;
  padding: 3rem 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-col {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.footer-icon {
  font-size: 2rem;
}

.footer-col h4 {
  margin: 0 0 0.5rem 0;
  color: #8E5A30;
}

.footer-col p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* Scroll Top Button */
.scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #8E5A30;
  color: #E9E9E0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  transition: all 0.3s;
  z-index: 999;
}

.scroll-top:hover {
  background: #6d4524;
  transform: translateY(-3px);
}

/* Responsive */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 1rem;
  }

  .navmenu ul {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  p.phone-number {
    color: #fff;
  }
  /* Altura dinámica para celulares */
  .hero-section {
    min-height: 85dvh;
    padding: 5dvh 0;
    text-align: center;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 3dvh;
  }

  .hero-buttons {
    justify-content: center;
  }

  .hero-image {
    padding-top: 0;
  }

  .about-section, 
  .menu-section, 
  .contact-section {
    padding: 5dvh 0;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 3dvh;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .coffee-cup-illustration {
    font-size: 8rem;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    gap: 2dvh;
  }

  .contact-info-grid {
    grid-template-columns: 1fr;
    gap: 2dvh;
  }
}
</style>
