<template>
  <div class="root">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-inner">
        <div class="logo">
          <div class="logo-mark">MA</div>
          <span class="logo-text">MarketingAuto</span>
        </div>
        <div class="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="btn-ghost">Sign In</router-link>
          <router-link to="/login" class="btn-primary">Get Started</router-link>
        </div>
        <button class="hamburger" @click="menuOpen = !menuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" :class="{ open: menuOpen }">
        <a href="#features" @click="menuOpen = false">Features</a>
        <a href="#pricing" @click="menuOpen = false">Pricing</a>
        <a href="#about" @click="menuOpen = false">About</a>
        <router-link to="/login" class="btn-primary" style="text-align: center"
          >Get Started</router-link
        >
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb1"></div>
        <div class="orb orb2"></div>
        <div class="orb orb3"></div>
        <div class="grid-overlay"></div>
      </div>
      <div class="hero-inner">
        <div class="badge">🚀 Marketing Automation Platform</div>
        <h1 class="hero-title">
          Automate Your<br />
          <span class="gradient-text">Marketing.</span><br />
          Grow Faster.
        </h1>
        <p class="hero-sub">
          Manage campaigns, track leads, send automated emails<br
            class="hide-mobile"
          />
          and analyze performance — all from one platform.
        </p>
        <div class="hero-btns">
          <router-link to="/login" class="btn-hero-primary"
            >Start Free Today →</router-link
          >
          <a href="#features" class="btn-hero-ghost">See Features</a>
        </div>
        <div class="stats">
          <div class="stat" v-for="s in stats" :key="s.label">
            <span class="stat-val">{{ s.val }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="features">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">Features</span>
          <h2>Everything You Need</h2>
          <p>Powerful tools to automate and scale your marketing operations</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="pricing">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">Pricing</span>
          <h2>Simple, Transparent</h2>
          <p>No hidden fees. Cancel anytime.</p>
        </div>
        <div class="pricing-grid">
          <div
            class="plan-card"
            v-for="plan in plans"
            :key="plan.name"
            :class="{ featured: plan.highlight }"
          >
            <div class="plan-badge" v-if="plan.highlight">Most Popular</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">{{ plan.price }}<span>/mo</span></div>
            <ul class="plan-features">
              <li v-for="f in plan.features" :key="f">
                <span class="check">✓</span> {{ f }}
              </li>
            </ul>
            <router-link
              to="/login"
              class="plan-btn"
              :class="{ 'plan-btn-primary': plan.highlight }"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="about" class="about">
      <div class="section-inner">
        <div class="about-grid">
          <div class="about-text">
            <span class="section-tag">About</span>
            <h2>Built for Modern Marketers</h2>
            <p>
              MarketingAuto is a full-stack platform designed to help marketing
              teams automate repetitive tasks, track leads through every stage
              of the funnel, and make data-driven decisions with powerful
              analytics.
            </p>
            <div class="about-values">
              <div class="value" v-for="v in values" :key="v.title">
                <span class="value-icon">{{ v.icon }}</span>
                <div>
                  <strong>{{ v.title }}</strong>
                  <p>{{ v.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="about-visual">
            <div class="visual-card">
              <div class="visual-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="visual-title">Campaign Overview</span>
              </div>
              <div class="visual-stats">
                <div class="vs" v-for="vs in visualStats" :key="vs.label">
                  <span class="vs-label">{{ vs.label }}</span>
                  <div class="vs-bar-wrap">
                    <div class="vs-bar" :style="{ width: vs.pct }"></div>
                  </div>
                  <span class="vs-val">{{ vs.val }}</span>
                </div>
              </div>
              <div class="visual-bottom">
                <div class="vb-item" v-for="vb in visualBottom" :key="vb.label">
                  <span class="vb-num" :style="{ color: vb.color }">{{
                    vb.num
                  }}</span>
                  <span class="vb-label">{{ vb.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-inner">
        <h2>Ready to Automate?</h2>
        <p>Join hundreds of teams already using MarketingAuto</p>
        <router-link to="/login" class="btn-cta"
          >Get Started Free →</router-link
        >
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="logo">
          <div class="logo-mark">MA</div>
          <span class="logo-text" style="color: #fff">MarketingAuto</span>
        </div>
        <p>© 2026 MarketingAuto. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const menuOpen = ref(false);

const stats = [
  { val: "500+", label: "Campaigns Run" },
  { val: "12k+", label: "Leads Tracked" },
  { val: "98%", label: "Satisfaction" },
];

const features = [
  {
    icon: "📢",
    title: "Campaign Management",
    desc: "Create, manage and track marketing campaigns with real-time status updates and budget control.",
  },
  {
    icon: "👥",
    title: "Lead Tracking",
    desc: "Track leads through every stage of your sales funnel from new contact to converted customer.",
  },
  {
    icon: "📧",
    title: "Email Automation",
    desc: "Send personalized email campaigns automatically using dynamic templates and scheduling.",
  },
  {
    icon: "📈",
    title: "Analytics & Reports",
    desc: "Get detailed insights on campaign performance, conversion rates and email engagement.",
  },
  {
    icon: "🔐",
    title: "Role-Based Access",
    desc: "Control who sees what with Admin, Marketer and Client roles for your entire team.",
  },
  {
    icon: "⚡",
    title: "Fast & Reliable",
    desc: "Built with Redis caching and optimized queries to handle your data at scale.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$0",
    features: ["3 Campaigns", "100 Leads", "500 Emails/mo", "Basic Analytics"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "Unlimited Campaigns",
      "10k Leads",
      "50k Emails/mo",
      "Advanced Analytics",
      "Priority Support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    features: [
      "Everything in Pro",
      "Unlimited Leads",
      "Unlimited Emails",
      "Custom Integrations",
      "Dedicated Support",
    ],
    highlight: false,
  },
];

const values = [
  {
    icon: "🎯",
    title: "Precision",
    desc: "Target the right audience at the right time.",
  },
  {
    icon: "⚙️",
    title: "Automation",
    desc: "Let the platform handle repetitive tasks.",
  },
  {
    icon: "📊",
    title: "Data-Driven",
    desc: "Every decision backed by real analytics.",
  },
];

const visualStats = [
  { label: "Email Open Rate", pct: "72%", val: "72%" },
  { label: "Lead Conversion", pct: "54%", val: "54%" },
  { label: "Campaign ROI", pct: "89%", val: "89%" },
];

const visualBottom = [
  { num: "1,284", label: "Active Leads", color: "#3b82f6" },
  { num: "48", label: "Campaigns", color: "#10b981" },
  { num: "$94k", label: "Revenue", color: "#f59e0b" },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.root {
  font-family: "DM Sans", sans-serif;
  background: #fff;
  color: #0f172a;
  overflow-x: hidden;
}

/* NAVBAR */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #e2e8f0;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-family: "Syne", sans-serif;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-text {
  font-family: "Syne", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: #0f172a;
}
.nav-links {
  display: flex;
  gap: 28px;
  margin-left: auto;
}
.nav-links a {
  text-decoration: none;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #2563eb;
}
.nav-actions {
  display: flex;
  gap: 10px;
  margin-left: 24px;
}
.btn-ghost {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-ghost:hover {
  color: #2563eb;
  background: #eff6ff;
}
.btn-primary {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
}
.hamburger span {
  width: 22px;
  height: 2px;
  background: #0f172a;
  border-radius: 2px;
  transition: 0.3s;
}
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}
.mobile-menu.open {
  display: flex;
}
.mobile-menu a {
  color: #475569;
  text-decoration: none;
  font-size: 15px;
  padding: 8px 0;
}

/* HERO */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 80px;
  position: relative;
  overflow: hidden;
  background: #f8faff;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.orb1 {
  width: 500px;
  height: 500px;
  background: #3b82f6;
  top: -100px;
  right: -100px;
}
.orb2 {
  width: 400px;
  height: 400px;
  background: #8b5cf6;
  bottom: -50px;
  left: -100px;
}
.orb3 {
  width: 300px;
  height: 300px;
  background: #06b6d4;
  top: 50%;
  left: 40%;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(#e2e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.4;
}
.hero-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}
.badge {
  display: inline-block;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 100px;
  margin-bottom: 28px;
}
.hero-title {
  font-family: "Syne", sans-serif;
  font-size: clamp(42px, 8vw, 80px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2px;
  margin-bottom: 24px;
  color: #0f172a;
}
.gradient-text {
  background: linear-gradient(135deg, #2563eb, #7c3aed, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 18px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 40px;
}
.hero-btns {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 64px;
}
.btn-hero-primary {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.35);
  transition: all 0.2s;
}
.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.45);
}
.btn-hero-ghost {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
  background: #fff;
}
.btn-hero-ghost:hover {
  border-color: #2563eb;
  color: #2563eb;
}
.stats {
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-val {
  font-family: "Syne", sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
}
.stat-label {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

/* SECTIONS */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.section-header {
  text-align: center;
  margin-bottom: 56px;
}
.section-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #2563eb;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 16px;
}
.section-header h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: -1px;
}
.section-header p {
  font-size: 17px;
  color: #64748b;
}

/* FEATURES */
.features {
  padding: 100px 0;
  background: #fff;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.feature-card {
  padding: 32px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  background: #fff;
  transition: all 0.3s;
  cursor: default;
}
.feature-card:hover {
  border-color: #bfdbfe;
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.08);
  transform: translateY(-4px);
}
.feature-icon {
  font-size: 32px;
  margin-bottom: 16px;
}
.feature-card h3 {
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}
.feature-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
}

/* PRICING */
.pricing {
  padding: 100px 0;
  background: #f8faff;
}
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.plan-card {
  background: #fff;
  border-radius: 24px;
  padding: 36px;
  border: 2px solid #f1f5f9;
  position: relative;
  transition: all 0.3s;
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15);
}
.plan-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 16px;
  border-radius: 100px;
  white-space: nowrap;
}
.plan-name {
  font-family: "Syne", sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}
.plan-price {
  font-family: "Syne", sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 28px;
}
.plan-price span {
  font-size: 16px;
  font-weight: 400;
  color: #94a3b8;
}
.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}
.plan-features li {
  font-size: 14px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 10px;
}
.check {
  color: #10b981;
  font-weight: 700;
}
.plan-btn {
  display: block;
  text-align: center;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
}
.plan-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}
.plan-btn-primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-color: transparent;
  color: #fff;
}
.plan-btn-primary:hover {
  opacity: 0.9;
  color: #fff;
  border-color: transparent;
}

/* ABOUT */
.about {
  padding: 100px 0;
  background: #fff;
}
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}
.about-text .section-tag {
  display: inline-block;
}
.about-text h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0f172a;
  margin: 16px 0;
  letter-spacing: -1px;
}
.about-text > p {
  font-size: 16px;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 32px;
}
.about-values {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.value {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.value-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.value strong {
  display: block;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.value p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

/* ABOUT VISUAL */
.about-visual {
  display: flex;
  justify-content: center;
}
.visual-card {
  background: #0f172a;
  border-radius: 24px;
  padding: 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.2);
}
.visual-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot.red {
  background: #ef4444;
}
.dot.yellow {
  background: #f59e0b;
}
.dot.green {
  background: #10b981;
}
.visual-title {
  font-size: 13px;
  color: #64748b;
  margin-left: auto;
  font-weight: 500;
}
.visual-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}
.vs {
  display: flex;
  align-items: center;
  gap: 12px;
}
.vs-label {
  font-size: 12px;
  color: #94a3b8;
  width: 130px;
  flex-shrink: 0;
}
.vs-bar-wrap {
  flex: 1;
  height: 6px;
  background: #1e293b;
  border-radius: 100px;
  overflow: hidden;
}
.vs-bar {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  border-radius: 100px;
}
.vs-val {
  font-size: 12px;
  color: #e2e8f0;
  font-weight: 700;
  width: 36px;
  text-align: right;
}
.visual-bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #1e293b;
}
.vb-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.vb-num {
  font-family: "Syne", sans-serif;
  font-size: 20px;
  font-weight: 800;
}
.vb-label {
  font-size: 11px;
  color: #64748b;
}

/* CTA */
.cta {
  padding: 100px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(37, 99, 235, 0.2),
    transparent 70%
  );
}
.cta-inner {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
}
.cta h2 {
  font-family: "Syne", sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
}
.cta p {
  font-size: 18px;
  color: #94a3b8;
  margin-bottom: 40px;
}
.btn-cta {
  display: inline-block;
  padding: 18px 40px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  text-decoration: none;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.4);
  transition: all 0.2s;
}
.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(37, 99, 235, 0.5);
}

/* FOOTER */
.footer {
  background: #0f172a;
  padding: 32px 24px;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.footer p {
  font-size: 13px;
  color: #475569;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .about-visual {
    order: -1;
  }
  .hide-mobile {
    display: none;
  }
  .footer-inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
