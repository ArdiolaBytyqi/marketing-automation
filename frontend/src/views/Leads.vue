<template>
  <AppLayout title="Leads" subtitle="Track and manage your potential clients">
    <div class="toolbar">
      <input
        v-model="search"
        placeholder="Search leads..."
        class="search-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="">All Status</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="converted">Converted</option>
        <option value="lost">Lost</option>
      </select>
      <button @click="openModal()" class="btn-primary">+ New Lead</button>
    </div>

    <div class="card">
      <div v-if="loading" class="loading">Loading...</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in filtered" :key="lead.id">
            <td class="font-medium">{{ lead.name }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.phone || "-" }}</td>
            <td>
              <span class="badge" :class="lead.status">{{ lead.status }}</span>
            </td>
            <td class="notes">{{ lead.notes || "-" }}</td>
            <td>
              <div class="actions">
                <button @click="openModal(lead)" class="btn-edit">Edit</button>
                <button @click="deleteLead(lead.id)" class="btn-delete">
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="6" class="empty">No leads found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ editingId ? "Edit Lead" : "New Lead" }}</h3>
          <button @click="showModal = false" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="field-row">
            <div class="field">
              <label>Name</label>
              <input v-model="form.name" placeholder="Full name" />
            </div>
            <div class="field">
              <label>Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Phone</label>
              <input v-model="form.phone" placeholder="+383..." />
            </div>
            <div class="field">
              <label>Status</label>
              <select v-model="form.status">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Campaign</label>
            <select v-model="form.campaignId">
              <option value="">Select a campaign</option>
              <option
                v-for="campaign in campaigns"
                :key="campaign.id"
                :value="campaign.id"
              >
                {{ campaign.title }}
              </option>
            </select>
          </div>
          <div class="field">
            <label>Notes</label>
            <textarea
              v-model="form.notes"
              placeholder="Notes about this lead..."
              rows="3"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showModal = false" class="btn-ghost">Cancel</button>
          <button @click="saveLead" class="btn-primary">Save Lead</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import AppLayout from "../components/AppLayout.vue";
import api from "../api/index";

const leads = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingId = ref(null);
const search = ref("");
const filterStatus = ref("");

const form = ref({
  name: "",
  email: "",
  phone: "",
  campaignId: "",
  status: "new",
  notes: "",
});

const filtered = computed(() =>
  leads.value.filter(
    (l) =>
      (l.name.toLowerCase().includes(search.value.toLowerCase()) ||
        l.email.toLowerCase().includes(search.value.toLowerCase())) &&
      (filterStatus.value === "" || l.status === filterStatus.value)
  )
);

const fetchLeads = async () => {
  try {
    loading.value = true;
    const res = await api.get("/leads");
    leads.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const openModal = (lead = null) => {
  editingId.value = lead?.id || null;
  form.value = lead
    ? {
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        campaignId: lead.campaignId,
        status: lead.status,
        notes: lead.notes || "",
      }
    : {
        name: "",
        email: "",
        phone: "",
        campaignId: "",
        status: "new",
        notes: "",
      };
  showModal.value = true;
};

const saveLead = async () => {
  try {
    if (editingId.value) {
      await api.put(`/leads/${editingId.value}/status`, {
        status: form.value.status,
        notes: form.value.notes,
      });
    } else {
      await api.post("/leads", form.value);
    }
    showModal.value = false;
    await fetchLeads();
  } catch (err) {
    console.error(err);
  }
};

const deleteLead = async (id) => {
  if (!confirm("Are you sure?")) return;
  try {
    await api.delete(`/leads/${id}`);
    await fetchLeads();
  } catch (err) {
    console.error(err);
  }
};

const campaigns = ref([]);

const fetchCampaigns = async () => {
  try {
    const res = await api.get("/campaigns");
    campaigns.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  fetchLeads();
  fetchCampaigns();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap");

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.search-input {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  transition: all 0.2s;
  background: #fff;
}
.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}
.filter-select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  transition: all 0.2s;
  background: #fff;
  color: #374151;
}
.filter-select:focus {
  border-color: #2563eb;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #f1f5f9;
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
.notes {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
  font-size: 13px;
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
}
.badge.new {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}
.badge.contacted {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}
.badge.qualified {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
}
.badge.converted {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.badge.lost {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.actions {
  display: flex;
  gap: 8px;
}
.btn-edit {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-edit:hover {
  background: rgba(37, 99, 235, 0.16);
}
.btn-delete {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete:hover {
  background: rgba(239, 68, 68, 0.16);
}

.btn-primary {
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-ghost {
  padding: 12px 20px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-ghost:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: blur(4px);
}
.modal {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 520px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-header h3 {
  font-family: "Syne", sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}
.modal-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
}
.modal-close:hover {
  color: #0f172a;
}
.modal-body {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-footer {
  padding: 20px 28px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.field label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.field input,
.field textarea,
.field select {
  padding: 12px 14px;
  border-radius: 10px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  background: #fff;
}
.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}
.field-row {
  display: flex;
  gap: 16px;
}
</style>
