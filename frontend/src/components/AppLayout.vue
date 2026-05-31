<template>
  <div class="app-root">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-mark">MA</div>
          <span class="logo-text" v-if="!sidebarCollapsed">MarketingAuto</span>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" active-class="active">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" v-if="!sidebarCollapsed">{{ item.name }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="!sidebarCollapsed">
          <div class="user-avatar">{{ auth.user?.name?.slice(0,1).toUpperCase() }}</div>
          <div class="user-details">
            <strong>{{ auth.user?.name }}</strong>
            <span>{{ auth.user?.role }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" :title="sidebarCollapsed ? 'Logout' : ''">
          <span>🚪</span>
          <span v-if="!sidebarCollapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrap">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">☰</button>
          <div>
            <h1 class="page-title">{{ title }}</h1>
            <p class="page-sub" v-if="subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <div class="topbar-right">
          <div class="topbar-user">
            <div class="user-avatar small">{{ auth.user?.name?.slice(0,1).toUpperCase() }}</div>
            <div class="user-details">
              <strong>{{ auth.user?.name }}</strong>
              <span class="role-badge">{{ auth.user?.role }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Sidebar Overlay -->
      <div class="mobile-overlay" v-if="mobileOpen" @click="mobileOpen = false">
        <aside class="mobile-sidebar" @click.stop>
          <div class="sidebar-header">
            <div class="logo">
              <div class="logo-mark">MA</div>
              <span class="logo-text">MarketingAuto</span>
            </div>
          </div>
          <nav class="sidebar-nav">
            <router-link v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item" active-class="active" @click="mobileOpen = false">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.name }}</span>
            </router-link>
          </nav>
          <div class="sidebar-footer">
            <button class="logout-btn" @click="handleLogout">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>

      <!-- Content -->
      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

defineProps({ title: String, subtitle: String });

const router = useRouter();
const auth = useAuthStore();
const sidebarCollapsed = ref(false);
const mobileOpen = ref(false);

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: "📊" },
  { name: "Campaigns", path: "/campaigns", icon: "📢" },
  { name: "Leads", path: "/leads", icon: "👥" },
  { name: "Analytics", path: "/analytics", icon: "📈" },
  { name: "Users", path: "/users", icon: "⚙️" },
];

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.app-root {
  display: flex; min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  background: #f8faff;
}

/* SIDEBAR */
.sidebar {
  width: 240px; background: #0f172a;
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 50; transition: width 0.3s ease;
}
.sidebar.collapsed { width: 72px; }

.sidebar-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.logo { display: flex; align-items: center; gap: 10px; overflow: hidden; }
.logo-mark {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
  display: flex; align-items: center; justify-content: center;
}
.logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #fff; white-space: nowrap; }
.collapse-btn {
  background: rgba(255,255,255,0.06); border: none; color: #94a3b8;
  width: 28px; height: 28px; border-radius: 8px; cursor: pointer;
  font-size: 14px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.collapse-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

.sidebar-nav {
  flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 4px;
  overflow-y: auto;
}
.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 12px; border-radius: 12px;
  text-decoration: none; color: #64748b;
  font-size: 14px; font-weight: 500;
  transition: all 0.2s; white-space: nowrap; overflow: hidden;
}
.nav-item:hover { background: rgba(255,255,255,0.06); color: #e2e8f0; }
.nav-item.active { background: linear-gradient(135deg, rgba(37,99,235,0.3), rgba(124,58,237,0.3)); color: #fff; }
.nav-icon { font-size: 18px; flex-shrink: 0; }
.nav-label { overflow: hidden; }

.sidebar-footer {
  padding: 16px 10px; border-top: 1px solid rgba(255,255,255,0.06);
  display: flex; flex-direction: column; gap: 10px;
}
.user-info { display: flex; align-items: center; gap: 10px; padding: 8px; }
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff; font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.user-avatar.small { width: 32px; height: 32px; font-size: 12px; }
.user-details { overflow: hidden; }
.user-details strong { display: block; font-size: 13px; color: #e2e8f0; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-details span { font-size: 11px; color: #64748b; text-transform: capitalize; }
.logout-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 12px; border: none;
  background: rgba(239,68,68,0.08); color: #ef4444;
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: all 0.2s; width: 100%;
}
.logout-btn:hover { background: rgba(239,68,68,0.16); }

/* MAIN */
.main-wrap {
  flex: 1; margin-left: 240px; display: flex; flex-direction: column;
  transition: margin-left 0.3s ease; min-height: 100vh;
}
.sidebar.collapsed ~ .main-wrap { margin-left: 72px; }

/* TOPBAR */
.topbar {
  background: #fff; border-bottom: 1px solid #e2e8f0;
  padding: 0 28px; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 40;
}
.topbar-left { display: flex; align-items: center; gap: 16px; }
.mobile-menu-btn { display: none; background: none; border: none; font-size: 20px; cursor: pointer; }
.page-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0f172a; }
.page-sub { font-size: 12px; color: #94a3b8; }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.topbar-user { display: flex; align-items: center; gap: 10px; }
.role-badge {
  display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; padding: 2px 8px; border-radius: 100px;
  background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1));
  color: #2563eb;
}

/* CONTENT */
.content { flex: 1; padding: 28px; }

/* MOBILE */
.mobile-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.5); z-index: 100;
}
.mobile-sidebar {
  width: 240px; background: #0f172a; height: 100%;
  display: flex; flex-direction: column;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
  .main-wrap { margin-left: 0 !important; }
  .mobile-menu-btn { display: block; }
  .mobile-overlay { display: block; }
}
</style>