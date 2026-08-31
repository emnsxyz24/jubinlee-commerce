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
              <Users class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee Customer Directory</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Customer Directory
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Buyer profile directory, registered member vs guest checkout accounts, and order history.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Customers</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">{{ customers.length }} Contacts</span>
            </div>
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Registered Members</span>
              <span class="font-bold text-lg text-[#1D4ED8] tabular-nums">{{ registeredCount }} Members</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 border border-[#E4D8CC]"
      >
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[260px] relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search customer name, phone number, or email..."
              @input="debounceSearch"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
            />
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading customer directory...</div>
        </div>

        <div v-else-if="!customers.length" class="p-16 text-center text-[#7D766E] text-xs">
          <UserX class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No customer records found</div>
          <p class="text-xs text-[#9E978F] mt-1">Customer profiles are automatically registered when orders are placed via WhatsApp checkout.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Customer</th>
                <th class="py-4 px-6">WhatsApp Number</th>
                <th class="py-4 px-6">Registered Email</th>
                <th class="py-4 px-6">Account Type</th>
                <th class="py-4 px-6">Total Orders</th>
                <th class="py-4 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="c in customers" :key="c.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                      {{ c.name?.charAt(0)?.toUpperCase() || 'P' }}
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ c.name }}</div>
                      <div class="text-[10px] text-[#9E978F] font-mono">ID: {{ c.id?.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6">
                  <a
                    v-if="c.phone"
                    :href="`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`"
                    target="_blank"
                    class="inline-flex items-center gap-1.5 font-mono font-semibold text-xs text-[#128C7E] hover:underline"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    <span>{{ c.phone }}</span>
                  </a>
                  <span v-else class="text-[#9E978F]">-</span>
                </td>

                <td class="py-4 px-6 text-[#7D766E]">
                  {{ c.email || 'Not specified' }}
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[c.isGuest ? 'bg-[#FAF6F1] text-[#7D766E]' : 'bg-[#E8F1FD] text-[#1D4ED8] font-bold']" 
                    class="px-3 py-1 rounded-full text-[10px]"
                  >
                    {{ c.isGuest ? 'Guest Checkout' : 'Member Account' }}
                  </span>
                </td>

                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#FAF6F1] text-[#1A170F] text-[11px] font-bold tabular-nums">
                    {{ c._count?.orders || 0 }} orders
                  </span>
                </td>

                <td class="py-4 px-6 text-[#7D766E] text-[11px]">
                  {{ formatDate(c.createdAt) }}
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
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';
import { API_BASE_URL } from '../config';
import { Users, Search, Loader2, UserX, MessageSquare } from 'lucide-vue-next';

const authStore = useAuthStore();
const customers = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');
let searchTimer: any = null;

const registeredCount = computed(() => {
  return customers.value.filter(c => !c.isGuest).length;
});

const fetchCustomers = async (search = '') => {
  try {
    loading.value = true;
    const url = new URL(`${API_BASE_URL}/admin/customers`);
    if (search) url.searchParams.append('search', search);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    customers.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    customers.value = [];
  } finally {
    loading.value = false;
  }
};

const debounceSearch = () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    fetchCustomers(searchQuery.value);
  }, 400);
};

const formatDate = (val: any) => {
  if (!val) return '-';
  try {
    const d = new Date(val);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '-';
  }
};

onMounted(() => {
  fetchCustomers();
});
</script>
