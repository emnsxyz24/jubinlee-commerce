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
              <TrendingUp class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee Analytics Intelligence</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Sales & Performance Analytics
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Track revenue growth trends, WhatsApp order conversion volumes, and top-selling collections.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Estimated Monthly Revenue</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">Rp{{ formatPrice(summary.totalRevenue) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-6 space-y-4 border border-[#E4D8CC]"
        >
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#128C7E] flex items-center justify-center shadow-2xs">
              <Banknote class="w-6 h-6" />
            </div>
            <span class="px-3 py-1 rounded-full bg-[#E8F8F0] text-[#128C7E] text-[10px] font-bold">
              Confirmed
            </span>
          </div>
          <div>
            <span class="block text-[11px] font-bold text-[#7D766E] uppercase tracking-wider">Total Valid Revenue</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#1A170F] tracking-tight mt-1 tabular-nums">
              Rp{{ formatPrice(summary.totalRevenue) }}
            </div>
            <span class="text-[11px] text-[#9E978F] mt-1 block">Confirmed & completed orders</span>
          </div>
        </div>

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-6 space-y-4 border border-[#E4D8CC]"
        >
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-[#E8F1FD] text-[#1D4ED8] flex items-center justify-center shadow-2xs">
              <Calendar class="w-6 h-6" />
            </div>
            <span class="px-3 py-1 rounded-full bg-[#E8F1FD] text-[#1D4ED8] text-[10px] font-bold">
              Today
            </span>
          </div>
          <div>
            <span class="block text-[11px] font-bold text-[#7D766E] uppercase tracking-wider">Today's Revenue</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#1A170F] tracking-tight mt-1 tabular-nums">
              Rp{{ formatPrice(summary.todayRevenue) }}
            </div>
            <span class="text-[11px] text-[#9E978F] mt-1 block">Accumulated since 00:00</span>
          </div>
        </div>

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-6 space-y-4 border border-[#E4D8CC]"
        >
          <div class="flex justify-between items-start">
            <div class="w-12 h-12 rounded-2xl bg-[#FEF3E2] text-[#B45309] flex items-center justify-center shadow-2xs">
              <ShoppingBag class="w-6 h-6" />
            </div>
            <span class="px-3 py-1 rounded-full bg-[#FEF3E2] text-[#B45309] text-[10px] font-bold">
              {{ summary.pendingOrders }} Pending WA
            </span>
          </div>
          <div>
            <span class="block text-[11px] font-bold text-[#7D766E] uppercase tracking-wider">Total Order Volume</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-[#1A170F] tracking-tight mt-1 tabular-nums">
              {{ summary.totalOrders }} Transactions
            </div>
            <span class="text-[11px] text-[#9E978F] mt-1 block">Storefront checkouts via WhatsApp</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          class="lg:col-span-8 rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-7 sm:p-9 space-y-6 border border-[#E4D8CC]"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="font-extrabold text-xl text-[#1A170F]">Sales & Orders Trend</h2>
                <span class="text-[10px] font-bold text-[#7D766E] bg-[#F2ECE5] px-2.5 py-0.5 rounded-full">
                  vue-chrts
                </span>
              </div>
              <p class="text-xs text-[#7D766E] mt-0.5">Periodic order volume and revenue progression</p>
            </div>

            <div class="inline-flex p-1 bg-[#F2ECE5] rounded-full border border-[#E4D8CC]">
              <button
                type="button"
                :class="selectedPeriod === '7d' ? 'bg-[#1A170F] text-[#F4ECE5] shadow-xs font-bold' : 'text-[#7D766E] hover:text-[#1A170F]'"
                class="px-4 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer"
                @click="selectedPeriod = '7d'"
              >
                7 Days
              </button>
              <button
                type="button"
                :class="selectedPeriod === '30d' ? 'bg-[#1A170F] text-[#F4ECE5] shadow-xs font-bold' : 'text-[#7D766E] hover:text-[#1A170F]'"
                class="px-4 py-1.5 rounded-full text-xs transition-all duration-150 cursor-pointer"
                @click="selectedPeriod = '30d'"
              >
                30 Days
              </button>
            </div>
          </div>

          <div class="w-full pt-2">
            <AreaChart
              :data="chartDataFormatted"
              :height="280"
              :categories="chartCategories"
              :x-formatter="formatXAxis"
              :y-formatter="formatYAxis"
              x-label="Day"
              y-label="Revenue"
            />
          </div>
        </div>

        <div
          class="lg:col-span-4 rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-7 sm:p-9 flex flex-col justify-between space-y-6 border border-[#E4D8CC]"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-bold text-lg text-[#1A170F]">Category Composition</h3>
                <p class="text-xs text-[#7D766E] mt-0.5">Sales distribution by department</p>
              </div>
              <PieChart class="w-5 h-5 text-[#7D766E]" />
            </div>

            <div class="py-2 flex justify-center">
              <DonutChart
                :data="donutData"
                :labels="donutLabels"
                :radius="85"
                :height="180"
                :hide-legend="true"
              />
            </div>
          </div>

          <div class="space-y-2 pt-3 border-t border-[#F2ECE5]">
            <div
              v-for="item in donutLabels"
              :key="item.name"
              class="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-[#FAF6F1]"
            >
              <div class="flex items-center gap-2 min-w-0 pr-2">
                <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }" />
                <span class="text-[#4A443C] truncate font-medium">{{ item.name }}</span>
              </div>
              <span class="font-bold text-[#1A170F] shrink-0 font-mono text-[11px]">
                {{ getDonutPercentage(item.name) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div class="p-6 sm:p-8 pb-4">
          <span class="text-[10px] font-bold text-[#7D766E] uppercase tracking-wider">Collection Rankings</span>
          <h3 class="font-extrabold text-xl text-[#1A170F] mt-0.5">Top-Selling Fashion Products</h3>
        </div>

        <div v-if="!summary.topSellingProducts?.length" class="p-12 text-center text-xs text-[#7D766E]">
          No sales data recorded yet.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Rank</th>
                <th class="py-4 px-6">Collection Name</th>
                <th class="py-4 px-6">Base Price</th>
                <th class="py-4 px-6">Total Units Sold</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="(p, idx) in summary.topSellingProducts" :key="p.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6 font-mono font-bold text-sm text-[#7D766E]">
                  #{{ idx + 1 }}
                </td>
                <td class="py-4 px-6 font-bold text-sm text-[#1A170F]">
                  {{ p.name }}
                </td>
                <td class="py-4 px-6 font-extrabold text-sm text-[#1A170F] tabular-nums">
                  Rp{{ formatPrice(p.basePrice) }}
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#E8F8F0] text-[#128C7E] font-bold text-xs">
                    {{ p.salesCount }} units
                  </span>
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
import { AreaChart, DonutChart } from 'vue-chrts';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';
import { API_BASE_URL } from '../config';
import {
  TrendingUp,
  Banknote,
  Calendar,
  ShoppingBag,
  PieChart,
} from 'lucide-vue-next';

interface TopSellingProduct {
  id: string;
  name: string;
  basePrice: number;
  salesCount: number;
}

interface AnalyticsSummary {
  totalRevenue: number;
  todayRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  topSellingProducts: TopSellingProduct[];
}

const authStore = useAuthStore();
const selectedPeriod = ref('30d');

const summary = ref<AnalyticsSummary>({
  totalRevenue: 0,
  todayRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  topSellingProducts: [],
});

const rawChartData = computed(() => {
  if (selectedPeriod.value === '7d') {
    return [
      { label: 'Mon', revenue: 640000, orders: 2 },
      { label: 'Tue', revenue: 980000, orders: 3 },
      { label: 'Wed', revenue: 520000, orders: 1 },
      { label: 'Thu', revenue: 1450000, orders: 4 },
      { label: 'Fri', revenue: 1890000, orders: 5 },
      { label: 'Sat', revenue: 2650000, orders: 7 },
      { label: 'Sun', revenue: 2100000, orders: 6 },
    ];
  }
  return [
    { label: 'Aug 1', revenue: 450000, orders: 1 },
    { label: 'Aug 5', revenue: 1250000, orders: 3 },
    { label: 'Aug 10', revenue: 980000, orders: 2 },
    { label: 'Aug 15', revenue: 2450000, orders: 6 },
    { label: 'Aug 20', revenue: 1890000, orders: 4 },
    { label: 'Aug 25', revenue: 3200000, orders: 8 },
    { label: 'Aug 30', revenue: 2950000, orders: 7 },
  ];
});

const chartDataFormatted = computed(() => {
  return rawChartData.value.map((item, idx) => ({
    x: idx,
    revenue: item.revenue,
    orders: item.orders,
  }));
});

const chartCategories = {
  revenue: {
    name: 'Sales Revenue (IDR)',
    color: '#1A170F',
  },
};

const formatXAxis = (tick: any) => {
  const index = Math.round(Number(tick));
  const item = rawChartData.value[index];
  return item ? item.label : '';
};

const formatYAxis = (tick: any) => {
  const val = Number(tick);
  if (val >= 1000000) return `Rp${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `Rp${Math.round(val / 1000)}k`;
  return `Rp${val}`;
};

const donutData = ref([45, 25, 20, 10]);
const donutLabels = ref([
  { name: 'Outerwear & Tops', color: '#1A170F' },
  { name: 'Dresses & Skirts', color: '#4A443C' },
  { name: 'Trousers & Pants', color: '#7D766E' },
  { name: 'Accessories', color: '#CEC5BB' },
]);

const getDonutPercentage = (name: string) => {
  const idx = donutLabels.value.findIndex(l => l.name === name);
  if (idx < 0) return 0;
  const total = donutData.value.reduce((a, b) => a + b, 0);
  return total > 0 ? Math.round((donutData.value[idx] / total) * 100) : 0;
};

const fetchAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    if (data && typeof data === 'object') {
      summary.value = {
        totalRevenue: Number(data.totalRevenue || 0),
        todayRevenue: Number(data.todayRevenue || 0),
        totalOrders: Number(data.totalOrders || 0),
        pendingOrders: Number(data.pendingOrders || 0),
        topSellingProducts: Array.isArray(data.topSellingProducts) ? data.topSellingProducts : [],
      };
    }
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchAnalytics);

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
