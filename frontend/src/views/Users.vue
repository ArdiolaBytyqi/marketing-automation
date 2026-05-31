<template>
  <AppLayout title="Users" subtitle="Manage your team members and roles">
    <div class="toolbar">
      <input v-model="search" placeholder="Search users..." class="search-input" />
      <select v-model="filterRole" class="filter-select">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="marketer">Marketer</option>
        <option value="client">Client</option>
      </select>
    </div>

    <div class="card">
      <div v-if="loading" class="loading">Loading...</div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filtered" :key="user.id">
            <td>
              <div class="user-cell">
                <div class="avatar">{{ user.name?.slice(0,1).toUpperCase() }}</div>
                <span class="font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :class="user.role">{{ user.role }}</span></td>
            <td>
              <span class="badge" :class="user.isActive ? 'active' : 'inactive'">
                {{ user.isActive ? "Active" : "Inactive" }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button @click="openModal(user)" class="btn-edit">Edit</button>
                <button @click="deleteUser(user.id)" class="btn-delete">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="empty">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Edit User</h3>
          <button @click="showModal = false" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" placeholder="Full name" />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="email@example.com" />
          </div>
          <div class="field">
            <label>Role</label>
            <select v-model="form.role">
              <option value="admin">Admin</option>
              <option value="marketer">Marketer</option>
              <option value="client">Client</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showModal = false" class="btn-ghost">Cancel</button>
          <button @click="saveUser" class="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AppLayout from "../components/AppLayout.vue";
import api from "../api/index";

const users = ref([]);
const loading = ref(true);
const showModal = ref(false);
const editingId = ref(null);
const search = ref("");
const filterRole = ref("");

const form = ref({ name: "", email: "", role: "client" });

const filtered = computed(() =>
  users.value.filter(u =>
    (u.name?.toLowerCase().includes(search.value.toLowerCase()) ||
     u.email?.toLowerCase().includes(search.value.toLowerCase())) &&
    (filterRole.value === "" || u.role === filterRole.value)
  )
);

const fetchUsers = async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data.data;
  } catch (err) { console.error(err); }
  finally { loading.value = false; }
};

const openModal = (user) => {
  editingId.value = user.id;
  form.value = { name: user.name, email: user.email, role: user.role };
  showModal.value = true;
};

const saveUser = async () => {
  try {
    await api.put(`/users/${editingId.value}`, form.value);
    showModal.value = false;
    await fetchUsers();
  } catch (err) { console.error(err); }
};

const deleteUser = async (id) => {
  if (!confirm("Are you sure?")) return;
  try { await api.delete(`/users/${id}`); await fetchUsers(); }
  catch (err) { console.error(err); }
};

onMounted(fetchUsers);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

.toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 12px 16px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; background: #fff; }
.search-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
.filter-select { padding: 12px 16px; border-radius: 12px; border: 2px solid #e2e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s; background: #fff; color: #374151; }
.filter-select:focus { border-color: #2563eb; }

.card { background: #fff; border-radius: 16px; padding: 24px; border: 1px solid #f1f5f9; }
.loading { color: #94a3b8; font-size: 14px; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th { text-align: left; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.table td { padding: 14px 0; border-bottom: 1px solid #f8faff; color: #374151; }
.table tr:last-child td { border-bottom: none; }
.empty { text-align: center; color: #94a3b8; padding: 32px 0; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.font-medium { font-weight: 600; color: #0f172a; }

.badge { padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.badge.admin { background: rgba(239,68,68,0.1); color: #ef4444; }
.badge.marketer { background: rgba(37,99,235,0.1); color: #2563eb; }
.badge.client { background: rgba(100,116,139,0.1); color: #64748b; }
.badge.active { background: rgba(16,185,129,0.1); color: #10b981; }
.badge.inactive { background: rgba(239,68,68,0.1); color: #ef4444; }

.actions { display: flex; gap: 8px; }
.btn-edit { padding: 6px 12px; border-radius: 8px; border: none; background: rgba(37,99,235,0.08); color: #2563eb; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-edit:hover { background: rgba(37,99,235,0.16); }
.btn-delete { padding: 6px 12px; border-radius: 8px; border: none; background: rgba(239,68,68,0.08); color: #ef4444; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-delete:hover { background: rgba(239,68,68,0.16); }

.btn-primary { padding: 12px 20px; border-radius: 12px; border: none; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-ghost { padding: 12px 20px; border-radius: 12px; border: 2px solid #e2e8f0; background: #fff; color: #64748b; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { border-color: #2563eb; color: #2563eb; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 440px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 24px 28px; border-bottom: 1px solid #f1f5f9; }
.modal-header h3 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; }
.modal-close { background: none; border: none; font-size: 18px; color: #94a3b8; cursor: pointer; }
.modal-close:hover { color: #0f172a; }
.modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
.modal-footer { padding: 20px 28px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; justify-content: flex-end; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 600; color: #374151; }
.field input, .field select { padding: 12px 14px; border-radius: 10px; border: 2px solid #e2e8f0; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #0f172a; outline: none; transition: all 0.2s; background: #fff; }
.field input:focus, .field select:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
</style>