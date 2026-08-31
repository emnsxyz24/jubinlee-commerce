<template>
  <AdminLayout>
    <div class="space-y-7">

      <div
        class="rounded-[28px] bg-[#EBE3DA] m3-hero-shadow relative overflow-hidden p-7 sm:p-9 border border-[#E4D8CC]"
      >
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#1A170F]/5 blur-2xl pointer-events-none" />
        <div class="absolute right-28 -bottom-20 w-64 h-64 rounded-full bg-[#F4ECE5]/80 blur-xl pointer-events-none" />

        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A170F]/10 text-[#1A170F] text-[11px] font-bold tracking-wider uppercase mb-3">
              <Shield class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee RBAC Administration</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Users & Roles Management
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Manage internal staff accounts, role-based access control (RBAC), and user access permissions.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Active Staff</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">{{ users.length }} Users</span>
            </div>
            <button
              v-if="authStore.hasPermission('users.write')"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] font-bold text-xs text-white shadow-md transition cursor-pointer"
              @click="openModal()"
            >
              <UserPlus class="w-4 h-4" />
              <span>Invite New Staff</span>
            </button>
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading users & roles data...</div>
        </div>

        <div v-else-if="!users.length" class="p-16 text-center text-[#7D766E] text-xs">
          <Users class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No staff users registered</div>
          <p class="text-xs text-[#9E978F] mt-1">Click "+ Invite New Staff" to add an administrative account.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Staff Member</th>
                <th class="py-4 px-6">Account Email</th>
                <th class="py-4 px-6">RBAC Role</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Last Login</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="u in users" :key="u.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-2xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {{ u.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ u.name }}</div>
                      <div class="text-[10px] text-[#9E978F] font-mono">ID: {{ u.id?.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6 font-mono text-[#4A433C]">
                  {{ u.email }}
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[
                      u.role?.name === 'OWNER' ? 'bg-[#FEF3E2] text-[#B45309]' :
                      u.role?.name === 'STORE_MANAGER' ? 'bg-[#E8F1FD] text-[#1D4ED8]' : 'bg-[#FAF6F1] text-[#4A433C]'
                    ]"
                    class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  >
                    {{ u.role?.name || 'Staff' }}
                  </span>
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[u.isActive ? 'bg-[#E8F8F0] text-[#128C7E]' : 'bg-[#FDE8E8] text-[#9B1C1C]']"
                    class="px-3 py-1 rounded-full text-[10px] font-bold"
                  >
                    {{ u.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="py-4 px-6 text-[#7D766E] text-[11px]">
                  {{ u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never logged in' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div 
        v-if="showModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-default"
        role="dialog"
        aria-modal="true"
        @click="showModal = false"
      >
        <div class="relative w-full max-w-[580px] max-h-[90vh] cursor-default" @click.stop>
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-4 border-b border-[#E4D8CC]/70">
              <div>
                <h2 class="text-xl font-extrabold text-[#1A170F]">Invite New Staff Member</h2>
                <p class="text-xs text-[#7D766E] mt-1">Configure account credentials and assign role-based access permissions.</p>
              </div>
              <button
                type="button"
                class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
                @click="showModal = false"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="saveUser" class="space-y-6">
              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Staff Full Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Staff Email Address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="sarah@jubilee.id"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Initial Password *</label>
                <input
                  v-model="form.password"
                  type="password"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Role / Access Level (RBAC) *</label>
                <AdminSelect
                  v-model="form.roleId"
                  :options="roleOptions"
                  placeholder="Select RBAC Role..."
                  full-width
                />
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-[#E4D8CC]/70">
                <button
                  type="button"
                  class="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#7D766E] hover:bg-[#FAF6F1] transition cursor-pointer"
                  @click="showModal = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-7 py-2.5 rounded-xl font-bold text-xs text-white bg-[#E04F26] hover:bg-[#C8431E] shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
                  <span>Save Staff Member</span>
                </button>
              </div>
            </form>
          </div>
          <ModalScrollbar :target="modalScrollRef" />
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import AdminSelect from '../components/AdminSelect.vue';
import ModalScrollbar from '../components/ModalScrollbar.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import { Shield, UserPlus, Loader2, Users, X } from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);

const authStore = useAuthStore();
const toastStore = useToastStore();
const users = ref<any[]>([]);
const roles = ref<any[]>([]);
const loading = ref(true);
const showModal = ref(false);
const submitting = ref(false);

const roleOptions = computed(() => {
  return roles.value.map(r => ({
    value: r.id,
    label: `${r.name} — ${r.description || ''}`,
  }));
});

const form = ref({ name: '', email: '', password: 'StaffPass123!', roleId: '' });

const fetchUsersAndRoles = async () => {
  try {
    loading.value = true;
    const [uRes, rRes] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${authStore.token}` } }),
      fetch(`${API_BASE_URL}/admin/roles`, { headers: { Authorization: `Bearer ${authStore.token}` } }),
    ]);
    const uData = await uRes.json();
    const rData = await rRes.json();

    users.value = Array.isArray(uData) ? uData : (Array.isArray(uData?.items) ? uData.items : []);
    roles.value = Array.isArray(rData) ? rData : (Array.isArray(rData?.items) ? rData.items : []);
    if (roles.value.length > 0 && !form.value.roleId) {
      form.value.roleId = roles.value[0].id;
    }
  } catch (e) {
    users.value = [];
    roles.value = [];
  } finally {
    loading.value = false;
  }
};

const openModal = () => {
  form.value = {
    name: '',
    email: '',
    password: 'StaffPass123!',
    roleId: roles.value[0]?.id || '',
  };
  showModal.value = true;
};

const saveUser = async () => {
  try {
    submitting.value = true;
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error('Failed to create staff account');

    showModal.value = false;
    toastStore.success(`Staff account "${form.value.name}" successfully created`);
    await fetchUsersAndRoles();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to create staff account');
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchUsersAndRoles);

const formatDate = (val: any) => {
  if (!val) return '-';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '-';
  }
};
</script>
