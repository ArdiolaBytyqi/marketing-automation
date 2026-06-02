<template>
  <AppLayout title="Analytics" subtitle="Track your campaign performance">
    <!-- Overview Cards -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.bg }">{{ stat.icon }}</div>
        <div class="stat-info">
          <p class="stat-label">{{ stat.label }}</p>
          <p class="stat-val">{{ stat.value }}</p>
          <p class="stat-sub" :style="{ color: stat.color }">{{ stat.sub }}</p>
        </div>
      </div>
    </div>

    <!-- Campaign Stats -->
    <div class="card">
      <div class="card-header">
        <h3>Campaign Statistics</h3>
        <select v-model="selectedCampaign" @change="fetchCampaignStats" class="filter-select">
          <option value="">Select Campaign</option>
          <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.title }}</option>
        </select>
      </div>

      <div v-if="!selectedCampaign" class="empty-state">
        <span class="empty-icon">📈</span>
        <p>Select a campaign to view detailed statistics</p>
      </div>

      <div v-else-if="campaignStats" class="campaign-stats">
        <div class="cs-header">
          <div>
            <h4>{{ campaignStats.campaign?.title }}</h4>
            <span class="badge" :class="campaignStats.campaign?.status">{{ campaignStats.campaign?.status }}</span>
          </div>
          <div class="conversion-rate">
            <span class="cr-label">Conversion Rate</span>
            <span class="cr-val">{{ campaignStats.conversionRate }}</span>
          </div>
        </div>

        <div class="cs-grid">
          <div class="cs-card" v-for="cs in campaignStatsCards" :key="cs.label">
            <p class="cs-label">{{ cs.label }}</p>
            <p class="cs-val" :style="{ color: cs.color }">{{ cs.value }}</p>
            <div class="cs-bar-wrap">
              <div class="cs-bar" :style="{ width: cs.pct, background: cs.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppLayout from "../components/AppLayout.vue";
import api from "../api/index";

const overview = ref({});
const campaigns = ref([]);
const selectedCampaign = ref("");
const campaignStats = ref(null);

const stats = computed(() => [
  { label: "Total Campaigns", value: overview.value.campaigns?.total || 0, icon: "📢", bg: "rgba(37,99,235,0.1)", sub: `${overview.value.campaigns?.active || 0} active`, color: "#2563eb" },
  { label: "Total Leads", value: overview.value.leads?.total || 0, icon: "👥", bg: "rgba(16,185,129,0.1)", sub: `${overview.value.leads?.converted || 0} converted`, color: "#10b981" },
  { label: "Emails Sent", value: overview.value.emails?.sent || 0, icon: "📧", bg: "rgba(124,58,237,0.1)", sub: `${overview.value.emails?.total || 0} total`, color: "#7c3aed" },
]);

const campaignStatsCards = computed(() => {
  if (!campaignStats.value) return [];
  const l = campaignStats.value.leads || {};
  const e = campaignStats.value.emails || {};
  const total = l.total || 1;
  const etotal = e.total || 1;
  return [
    { label: "Total Leads", value: l.total || 0, color: "#2563eb", pct: "100%" },
    { label: "New Leads", value: l.new || 0, color: "#f59e0b", pct: `${Math.round(((l.new||0)/total)*100)}%` },
    { label: "Converted", value: l.converted || 0, color: "#10b981", pct: `${Math.round(((l.converted||0)/total)*100)}%` },
    { label: "Lost", value: l.lost || 0, color: "#ef4444", pct: `${Math.round(((l.lost||0)/total)*100)}%` },
    { label: "Emails Sent", value: e.sent || 0, color: "#7c3aed", pct: `${Math.round(((e.sent||0)/etotal)*100)}%` },
    { label: "Emails Failed", value: e.failed || 0, color: "#f43f5e", pct: `${Math.round(((e.failed||0)/etotal)*100)}%` },
  ];
});

const fetchCampaignStats = async () => {
  if (!selectedCampaign.value) return;
  try {
    const res = await api.get(`/analytics/campaigns/${selectedCampaign.value}`);
    campaignStats.value = res.data.data;
  } catch (err) { console.error(err); }
};

onMounted(async () => {
  try {
    const [ovRes, campRes] = await Promise.all([
      api.get("/analytics/overview"),
      api.get("/campaigns"),
    ]);
    overview.value = ovRes.data.data;
    campaigns.value = campRes.data.data;
  } catch (err) { console.error(err); }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 24px; }
.stat-card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 16px; transition: all 0.2s; }
.stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.06); transform: translateY(-2px); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; font-size: 22px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-label { font-size: 13px; color: #94a3b8; margin-bottom: 4px; }
.stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #0f172a; }
.stat-sub { font-size: 12px; margin-top: 4px; font-weight: 500; }

.card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.card-header h3 { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #0f172a; }
.filter-select { padding: 10px 16px; border-radius: 10px; border: 2px solid #e2e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; background: #fff; color: #374151; }
.filter-select:focus { border-color: #2563eb; }

.empty-state { text-align: center; padding: 60px 0; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.empty-state p { color: #94a3b8; font-size: 15px; }

.cs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 12px; }
.cs-header h4 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
.badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.badge.active { background: rgba(16,185,129,0.1); color: #10b981; }
.badge.draft { background: rgba(245,158,11,0.1); color: #f59e0b; }
.badge.paused { background: rgba(239,68,68,0.1); color: #ef4444; }
.badge.completed { background: rgba(100,116,139,0.1); color: #64748b; }
.conversion-rate { text-align: right; }
.cr-label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
.cr-val { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: #2563eb; }

.cs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.cs-card { background: #f8faff; border-radius: 12px; padding: 20px; }
.cs-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.cs-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
.cs-bar-wrap { height: 4px; background: #e2e8f0; border-radius: 100px; overflow: hidden; }
.cs-bar { height: 100%; border-radius: 100px; transition: width 0.5s ease; }
</style>