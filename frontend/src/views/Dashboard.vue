<template>
  <AppLayout title="Dashboard" subtitle="Welcome back, here's what's happening">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">
          {{ stat.icon }}
        </div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-val">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Recent Campaigns -->
    <div class="card">
      <div class="card-header">
        <h3>Recent Campaigns</h3>
        <router-link to="/campaigns" class="view-all">View All →</router-link>
      </div>
      <div v-if="loading" class="loading">Loading...</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in campaigns" :key="c.id">
            <td class="font-medium">{{ c.title }}</td>
            <td>
              <span class="badge" :class="c.status">{{ c.status }}</span>
            </td>
            <td>${{ c.budget }}</td>
            <td>
              {{
                c.startDate ? new Date(c.startDate).toLocaleDateString() : "-"
              }}
            </td>
          </tr>
          <tr v-if="campaigns.length === 0">
            <td colspan="4" class="empty">No campaigns yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AppLayout from "../components/AppLayout.vue";
import api from "../api/index";

const campaigns = ref([]);
const loading = ref(true);
const stats = ref([
  { label: "Total Campaigns", value: 0, icon: "📢", bg: "rgba(37,99,235,0.1)" },
  { label: "Total Leads", value: 0, icon: "👥", bg: "rgba(16,185,129,0.1)" },
  { label: "Emails Sent", value: 0, icon: "📧", bg: "rgba(124,58,237,0.1)" },
]);

onMounted(async () => {
  try {
    const [campaignsRes, overviewRes] = await Promise.all([
      api.get("/campaigns"),
      api.get("/analytics/overview"),
    ]);
    campaigns.value = campaignsRes.data.data.slice(0, 5);
    const ov = overviewRes.data.data;
    stats.value[0].value = ov.campaigns?.total || 0;
    stats.value[1].value = ov.leads?.total || 0;
    stats.value[2].value = ov.emails?.sent || 0;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap");

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}
.stat-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-label {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 4px;
}
.stat-val {
  font-family: "Syne", sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.card-header h3 {
  font-family: "Syne", sans-serif;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
}
.view-all {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
.view-all:hover {
  text-decoration: underline;
}

.loading {
  color: #94a3b8;
  font-size: 14px;
}
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.table th {
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}
.table td {
  padding: 14px 0;
  border-bottom: 1px solid #f8faff;
  color: #374151;
}
.table tr:last-child td {
  border-bottom: none;
}
.font-medium {
  font-weight: 600;
  color: #0f172a;
}
.empty {
  text-align: center;
  color: #94a3b8;
  padding: 32px 0;
}

.badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.badge.draft {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
.badge.paused {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}
.badge.completed {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}
</style>
