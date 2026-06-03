<template>
  <AppLayout title="Emails" subtitle="Send emails and manage templates">
    <!-- Tabs -->
    <div class="tabs">
      <button :class="['tab', activeTab === 'send' ? 'active' : '']" @click="activeTab = 'send'">Send Email</button>
      <button :class="['tab', activeTab === 'templates' ? 'active' : '']" @click="activeTab = 'templates'">Templates</button>
      <button :class="['tab', activeTab === 'logs' ? 'active' : '']" @click="activeTab = 'logs'">Logs</button>
    </div>

    <!-- SEND EMAIL -->
    <div v-if="activeTab === 'send'" class="card">
      <h3 class="section-title">Send Email to Lead</h3>
      <div v-if="sendSuccess" class="alert-success">✓ {{ sendSuccess }}</div>
      <div v-if="sendError" class="alert-error">✗ {{ sendError }}</div>
      <div class="field">
        <label>Lead</label>
        <select v-model="sendForm.leadId">
          <option value="">Select a lead...</option>
          <option v-for="lead in leads" :key="lead.id" :value="lead.id">
            {{ lead.name }} — {{ lead.email }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Template</label>
        <select v-model="sendForm.templateId">
          <option value="">Select a template...</option>
          <option v-for="t in templates" :key="t._id" :value="t._id">
            {{ t.name }} — {{ t.subject }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Campaign ID (optional)</label>
        <select v-model="sendForm.campaignId">
          <option value="">Select a campaign...</option>
          <option v-for="c in campaigns" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
      </div>
      <button @click="sendEmail" class="btn-primary" :disabled="sending">
        {{ sending ? "Sending..." : "Send Email" }}
      </button>
    </div>

    <!-- TEMPLATES -->
    <div v-if="activeTab === 'templates'">
      <div class="card" style="margin-bottom: 20px">
        <h3 class="section-title">Create Template</h3>
        <div class="field">
          <label>Name</label>
          <input v-model="templateForm.name" placeholder="e.g. Welcome Email" />
        </div>
        <div class="field">
          <label>Subject</label>
          <input v-model="templateForm.subject" placeholder="Email subject..." />
        </div>
        <div class="field">
          <label>Body (use {{name}} for lead name)</label>
          <textarea v-model="templateForm.body" rows="5" placeholder="Hello {{name}}, ..." />
        </div>
        <button @click="createTemplate" class="btn-primary">Create Template</button>
      </div>

      <div class="card">
        <h3 class="section-title">Active Templates</h3>
        <div v-if="templates.length === 0" class="empty">No templates yet.</div>
        <div v-for="t in templates" :key="t._id" class="template-item">
          <div class="template-name">{{ t.name }}</div>
          <div class="template-subject">{{ t.subject }}</div>
        </div>
      </div>
    </div>

    <!-- LOGS -->
    <div v-if="activeTab === 'logs'" class="card">
      <h3 class="section-title">Email Logs</h3>
      <div class="toolbar">
        <select v-model="logFilter" class="filter-select">
          <option value="">All Campaigns</option>
          <option v-for="c in campaigns" :key="c.id" :value="c.id">{{ c.title }}</option>
        </select>
        <button @click="fetchLogs" class="btn-ghost">Filter</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Lead ID</th>
            <th>Campaign</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Sent At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ log.leadId }}</td>
            <td>{{ log.campaignId }}</td>
            <td>{{ log.subject }}</td>
            <td><span class="badge" :class="log.status">{{ log.status }}</span></td>
            <td>{{ log.sentAt ? new Date(log.sentAt).toLocaleString() : "—" }}</td>
          </tr>
          <tr v-if="logs.length === 0">
            <td colspan="5" class="empty">No logs found.</td>
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

const activeTab = ref("send");
const leads = ref([]);
const templates = ref([]);
const campaigns = ref([]);
const logs = ref([]);
const sending = ref(false);
const sendSuccess = ref("");
const sendError = ref("");
const logFilter = ref("");

const sendForm = ref({ leadId: "", templateId: "", campaignId: "" });
const templateForm = ref({ name: "", subject: "", body: "" });

const fetchAll = async () => {
  try {
    const [leadsRes, templatesRes, campaignsRes] = await Promise.all([
      api.get("/leads"),
      api.get("/emails/templates"),
      api.get("/campaigns"),
    ]);
    leads.value = leadsRes.data.data;
    templates.value = templatesRes.data.data;
    campaigns.value = campaignsRes.data.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchLogs = async () => {
  try {
    const params = logFilter.value ? { campaignId: logFilter.value } : {};
    const res = await api.get("/emails/logs", { params });
    logs.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
};

const sendEmail = async () => {
  if (!sendForm.value.leadId || !sendForm.value.templateId) {
    sendError.value = "Please select a lead and template.";
    return;
  }
  sending.value = true;
  sendSuccess.value = "";
  sendError.value = "";
  try {
    await api.post("/emails/send", sendForm.value);
    sendSuccess.value = "Email queued successfully!";
    sendForm.value = { leadId: "", templateId: "", campaignId: "" };
  } catch (err) {
    sendError.value = err.response?.data?.message || "Failed to send email.";
  } finally {
    sending.value = false;
  }
};

const createTemplate = async () => {
  try {
    await api.post("/emails/templates", templateForm.value);
    templateForm.value = { name: "", subject: "", body: "" };
    await fetchAll();
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await fetchAll();
  await fetchLogs();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap");

.tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.tab { padding: 10px 20px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; }
.tab.active { background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; border-color: transparent; }
.card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; margin-bottom: 20px; display: flex; flex-direction: column; gap: 16px; }
.section-title { font-family: "Syne", sans-serif; font-size: 16px; font-weight: 800; color: #0f172a; margin: 0; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; color: #374151; }
.field input, .field select, .field textarea { padding: 12px 14px; border-radius: 10px; border: 2px solid #e2e8f0; font-size: 14px; font-family: "DM Sans", sans-serif; color: #0f172a; outline: none; transition: all 0.2s; background: #fff; }
.field input:focus, .field select:focus, .field textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
.btn-primary { padding: 12px 20px; border-radius: 12px; border: none; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; align-self: flex-start; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-ghost { padding: 10px 16px; border-radius: 10px; border: 2px solid #e2e8f0; background: #fff; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; }
.alert-success { padding: 12px 16px; border-radius: 10px; background: rgba(16,185,129,0.1); color: #10b981; font-weight: 600; font-size: 14px; }
.alert-error { padding: 12px 16px; border-radius: 10px; background: rgba(239,68,68,0.1); color: #ef4444; font-weight: 600; font-size: 14px; }
.template-item { padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
.template-item:last-child { border-bottom: none; }
.template-name { font-weight: 600; color: #0f172a; font-size: 14px; }
.template-subject { color: #64748b; font-size: 13px; margin-top: 2px; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
.filter-select { padding: 10px 14px; border-radius: 10px; border: 2px solid #e2e8f0; font-size: 14px; background: #fff; color: #374151; outline: none; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.table td { padding: 14px 0; border-bottom: 1px solid #f8faff; color: #374151; }
.empty { text-align: center; color: #94a3b8; padding: 32px 0; }
.badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.badge.sent { background: rgba(16,185,129,0.1); color: #10b981; }
.badge.failed { background: rgba(239,68,68,0.1); color: #ef4444; }
.badge.pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
</style>