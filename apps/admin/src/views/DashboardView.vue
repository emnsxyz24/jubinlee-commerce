<template>
  <AdminLayout>
    <div class="space-y-6">

      <div
        class="rounded-[28px] bg-[#EBE3DA] m3-hero-shadow relative overflow-hidden p-6 sm:p-8 border border-[#E4D8CC]"
      >
        <div class="absolute -right-6 -top-8 hero-blob-1 pointer-events-none" />
        <div class="absolute right-32 -bottom-10 hero-blob-2 pointer-events-none" />
        <div class="absolute right-12 top-6 hero-cloud-shape pointer-events-none opacity-60" />

        <div class="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A170F]/10 text-[#1A170F] text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>JUBI &amp; LEE ADMINISTRATION STUDIO</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Welcome back, Store Admin
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] max-w-xl">
              Start your day with clean catalog operations. • August 1, 2026 - August 31, 2026
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <router-link
              to="/products"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E04F26] hover:bg-[#C8431E] text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <Plus class="w-4 h-4" />
              <span>Add Product</span>
            </router-link>
            <router-link
              to="/orders"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/60 hover:bg-white/90 text-[#1A170F] text-xs font-bold border border-[#E4D8CC] transition cursor-pointer"
            >
              <MessageSquare class="w-4 h-4 text-[#128C7E]" />
              <span>View Orders</span>
            </router-link>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 border border-[#E4D8CC]"
        >
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-2xl bg-[#E8F8F0] text-[#128C7E] flex items-center justify-center shadow-2xs">
              <Banknote class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-bold text-[#128C7E] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full">
              +18.4%
            </span>
          </div>

          <div class="mt-4">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Total Revenue</span>
            <div class="text-xl sm:text-2xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
              Rp{{ formatPrice(stats.revenue) }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#F4ECE5] flex items-center justify-between text-xs">
            <span class="text-[#9E978F] text-[11px]">From confirmed orders</span>
            <svg class="w-12 h-4 text-[#128C7E]" viewBox="0 0 48 16" fill="none">
              <path d="M1 14C8 10 14 13 22 7C30 1 38 10 47 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 border border-[#E4D8CC]"
        >
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-2xl bg-[#E8F8F0] text-[#128C7E] flex items-center justify-center shadow-2xs">
              <MessageSquare class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-bold text-[#128C7E] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full">
              Live Pipeline
            </span>
          </div>

          <div class="mt-4">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">WhatsApp Orders</span>
            <div class="text-xl sm:text-2xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
              {{ stats.ordersCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#F4ECE5] flex items-center justify-between text-xs">
            <span class="text-[#9E978F] text-[11px]">Handoff via wa.me link</span>
            <div class="flex items-end gap-0.5 h-4">
              <span class="mini-bar h-2" />
              <span class="mini-bar h-3.5" />
              <span class="mini-bar h-1.5" />
              <span class="mini-bar h-4" />
              <span class="mini-bar h-2.5" />
            </div>
          </div>
        </div>

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 border border-[#E4D8CC]"
        >
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-2xl bg-[#FEF3E2] text-[#B45309] flex items-center justify-center shadow-2xs">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-bold text-[#B45309] bg-[#FEF3E2] px-2.5 py-0.5 rounded-full">
              Alerts
            </span>
          </div>

          <div class="mt-4">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Low Stock Alerts</span>
            <div class="text-xl sm:text-2xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
              {{ stats.lowStockCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#F4ECE5] flex items-center justify-between text-xs">
            <span class="text-[#9E978F] text-[11px]">Variants below threshold</span>
            <router-link to="/inventory" class="font-bold text-xs text-[#1A170F] hover:underline">
              Restock
            </router-link>
          </div>
        </div>

        <div
          class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 sm:p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 border border-[#E4D8CC]"
        >
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-2xl bg-[#ECE7E1] text-[#4A433C] flex items-center justify-center shadow-2xs">
              <Shirt class="w-5 h-5" />
            </div>
            <span class="text-[10px] font-bold text-[#4A433C] bg-[#ECE7E1] px-2.5 py-0.5 rounded-full">
              Active
            </span>
          </div>

          <div class="mt-4">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Active Products</span>
            <div class="text-xl sm:text-2xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
              {{ stats.productsCount }}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-[#F4ECE5] flex items-center justify-between text-xs">
            <span class="text-[#9E978F] text-[11px]">Items live in storefront</span>
            <router-link to="/products" class="font-bold text-xs text-[#1A170F] hover:underline">
              Manage
            </router-link>
          </div>
        </div>

      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">

        <div
          class="lg:col-span-8 rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-6 sm:p-8 space-y-5 border border-[#E4D8CC]"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">Sales Analytics</span>
              <h2 class="text-lg sm:text-xl font-bold text-[#1A170F]">Sales & Orders Trend</h2>
            </div>

            <div class="inline-flex p-1 bg-[#FAF6F1] rounded-full border border-[#E4D8CC]">
              <button
                type="button"
                :class="timeframe === '7d' ? 'bg-[#1A170F] text-[#F4ECE5] shadow-xs' : 'text-[#7D766E] hover:text-[#1A170F]'"
                class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer"
                @click="timeframe = '7d'"
              >
                7 Days
              </button>
              <button
                type="button"
                :class="timeframe === '30d' ? 'bg-[#1A170F] text-[#F4ECE5] shadow-xs' : 'text-[#7D766E] hover:text-[#1A170F]'"
                class="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer"
                @click="timeframe = '30d'"
              >
                30 Days
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Estimated Revenue</span>
              <div class="text-lg sm:text-xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
                Rp{{ formatPrice(totalChartRevenue) }}
              </div>
            </div>

            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Average Order Value</span>
              <div class="text-lg sm:text-xl font-extrabold text-[#1A170F] mt-0.5 tabular-nums">
                Rp{{ formatPrice(avgOrderValue) }}
              </div>
            </div>

            <div class="col-span-2 sm:col-span-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#7D766E]">Order Volume</span>
              <div class="text-lg sm:text-xl font-extrabold text-[#128C7E] mt-0.5 tabular-nums">
                {{ totalChartOrders }} Orders
              </div>
            </div>
          </div>

          <div class="w-full pt-2">
            <AreaChart
              :data="chartDataFormatted"
              :height="260"
              :categories="chartCategories"
              :x-formatter="formatXAxis"
              :y-formatter="formatYAxis"
              x-label="Day"
              y-label="Revenue"
            />
          </div>
        </div>

        <div
          class="lg:col-span-4 rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-6 sm:p-8 flex flex-col justify-between space-y-5 border border-[#E4D8CC]"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">Composition</span>
                <h3 class="text-lg font-bold text-[#1A170F]">Fashion Categories</h3>
              </div>
              <PieChart class="w-5 h-5 text-[#7D766E]" />
            </div>

            <div class="py-2 flex justify-center">
              <DonutChart
                :data="donutData"
                :labels="donutLabels"
                :radius="80"
                :height="170"
                :hide-legend="true"
              />
            </div>
          </div>

          <div class="space-y-2 pt-3 border-t border-[#F4ECE5]">
            <div
              v-for="item in donutLabels"
              :key="item.name"
              class="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-[#FAF6F1]"
            >
              <div class="flex items-center gap-2 min-w-0 pr-2">
                <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: item.color }" />
                <span class="text-[#4A433C] truncate font-medium">{{ item.name }}</span>
              </div>
              <span class="font-bold text-[#1A170F] shrink-0 font-mono text-[11px]">
                {{ getDonutPercentage(item.name) }}%
              </span>
            </div>
          </div>
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
  ShieldCheck,
  Plus,
  MessageSquare,
  Banknote,
  AlertTriangle,
  Shirt,
  PieChart,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const timeframe = ref('30d');

const stats = ref({
  revenue: 0,
  productsCount: 0,
  ordersCount: 0,
  lowStockCount: 0,
});

const rawChartData = computed(() => {
  if (timeframe.value === '7d') {
    return [
      { label: 'Mon', revenue: 450000, orders: 1 },
      { label: 'Tue', revenue: 780000, orders: 2 },
      { label: 'Wed', revenue: 320000, orders: 1 },
      { label: 'Thu', revenue: 1100000, orders: 3 },
      { label: 'Fri', revenue: 1450000, orders: 4 },
      { label: 'Sat', revenue: 2100000, orders: 5 },
      { label: 'Sun', revenue: 1850000, orders: 4 },
    ];
  }
  return [
    { label: 'Aug 1', revenue: 350000, orders: 1 },
    { label: 'Aug 5', revenue: 890000, orders: 2 },
    { label: 'Aug 10', revenue: 640000, orders: 1 },
    { label: 'Aug 15', revenue: 1750000, orders: 4 },
    { label: 'Aug 20', revenue: 1420000, orders: 3 },
    { label: 'Aug 25', revenue: 2600000, orders: 6 },
    { label: 'Aug 30', revenue: 2450000, orders: 5 },
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

const donutData = ref([40, 30, 20, 10]);
const donutLabels = ref([
  { name: 'Outerwear & Tops', color: '#1A170F' },
  { name: 'Trousers & Pants', color: '#4A443C' },
  { name: 'Dresses & Skirts', color: '#7D766E' },
  { name: 'Accessories', color: '#CEC5BB' },
]);

const getDonutPercentage = (name: string) => {
  const idx = donutLabels.value.findIndex(l => l.name === name);
  if (idx < 0) return 0;
  const total = donutData.value.reduce((a, b) => a + b, 0);
  return total > 0 ? Math.round((donutData.value[idx] / total) * 100) : 0;
};

const totalChartRevenue = computed(() => rawChartData.value.reduce((acc, curr) => acc + curr.revenue, 0));
const totalChartOrders = computed(() => rawChartData.value.reduce((acc, curr) => acc + curr.orders, 0));
const avgOrderValue = computed(() => (totalChartOrders.value > 0 ? Math.round(totalChartRevenue.value / totalChartOrders.value) : 0));

const fetchDashboardStats = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` };
  try {
    const [pRes, oRes, invRes] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/products`, { headers }).catch(() => null),
      fetch(`${API_BASE_URL}/admin/orders`, { headers }).catch(() => null),
      fetch(`${API_BASE_URL}/admin/inventory?lowStock=true`, { headers }).catch(() => null),
    ]);

    const p = pRes && pRes.ok ? await pRes.json() : null;
    const o = oRes && oRes.ok ? await oRes.json() : null;
    const inv = invRes && invRes.ok ? await invRes.json() : null;

    const ordersList = o?.items || [];
    const revenueSum = ordersList.reduce((sum: number, ord: any) => sum + Number(ord.total || 0), 0);

    stats.value = {
      revenue: revenueSum,
      productsCount: p?.meta?.total ?? p?.items?.length ?? 0,
      ordersCount: o?.meta?.total ?? ordersList.length ?? 0,
      lowStockCount: Array.isArray(inv) ? inv.length : 0,
    };
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchDashboardStats);

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
</script>
