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
              <History class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee System Audit Trail</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              System Activity Logs
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Immutable audit trail of catalog modifications, inventory adjustments, order updates, and staff actions.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Audit Entries</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">{{ logs.length }} Events</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading activity audit logs...</div>
        </div>

        <div v-else-if="!logs.length" class="p-16 text-center text-[#7D766E] text-xs">
          <History class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No activity recorded yet</div>
          <p class="text-xs text-[#9E978F] mt-1">Stock mutations, catalog modifications, and order transitions will appear here.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Actor / User</th>
                <th class="py-4 px-6">Action Performed</th>
                <th class="py-4 px-6">Target Entity</th>
                <th class="py-4 px-6">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="l in logs" :key="l.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {{ l.adminUser?.name?.charAt(0)?.toUpperCase() || 'S' }}
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ l.adminUser?.name || 'System / Automated' }}</div>
                      <div class="text-[10px] text-[#9E978F] font-mono">{{ l.adminUser?.email || 'system-event' }}</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF6F1] text-[#1A170F] font-mono font-bold text-xs shadow-2xs border border-[#E4D8CC]/50">
                    <Code2 class="w-3.5 h-3.5 text-[#7D766E]" />
                    <span>{{ l.action }}</span>
                  </span>
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F1FD] text-[#1D4ED8] text-[10px] font-bold uppercase tracking-wider">
                    {{ l.entityType }}
                  </span>
                </td>

                <td class="py-4 px-6 text-[#7D766E] text-[11px] font-medium">
                  {{ formatDate(l.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';
import { API_BASE_URL } from '../config';
import { History, Loader2, Code2 } from 'lucide-vue-next';

const authStore = useAuthStore();
const logs = ref<any[]>([]);
const loading = ref(true);

const fetchLogs = async () => {
  try {
    loading.value = true;
    const res = await fetch(`${API_BASE_URL}/admin/activity-logs`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    logs.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    logs.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLogs);

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
