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
              <MessageSquare class="w-3.5 h-3.5 text-[#128C7E]" />
              <span>Jubi &amp; Lee Fulfillment Studio</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Incoming Orders Pipeline
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Monitor WhatsApp checkout orders, verification stages, and customer receipts.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Order Value</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">Rp{{ formatPrice(totalRevenue) }}</span>
            </div>
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Pending WhatsApp</span>
              <span class="font-bold text-lg text-[#B45309] tabular-nums">{{ pendingCount }} Orders</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 space-y-4 border border-[#E4D8CC]"
      >
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex-1 min-w-[260px] relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
              <Search class="w-4 h-4" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search order number (AUR-...), customer name, or phone..."
              @input="debounceSearch"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
            />
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-[#FAF6F1] hover:bg-[#F4ECE5] text-[#1A170F] border border-[#E4D8CC] transition cursor-pointer"
            @click="exportOrdersCSV"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div class="flex flex-wrap gap-2 pt-1 overflow-x-auto">
          <button 
            v-for="tab in pipelineTabs" 
            :key="tab.value"
            @click="selectTab(tab.value)"
            :class="[
              activeTab === tab.value 
                ? 'bg-[#1A170F] text-[#F4ECE5] font-bold shadow-xs' 
                : 'bg-[#FAF6F1] text-[#7D766E] font-semibold hover:text-[#1A170F] hover:bg-[#F2ECE5]'
            ]"
            class="px-4 py-2 rounded-xl text-xs transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <span>{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
              {{ tab.count }}
            </span>
          </button>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading orders pipeline...</div>
        </div>

        <div v-else-if="!orders.length" class="p-16 text-center text-[#7D766E] text-xs">
          <ClipboardList class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No orders found in this stage</div>
          <p class="text-xs text-[#9E978F] mt-1">No orders match the selected pipeline filter or search criteria.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Order No.</th>
                <th class="py-4 px-6">Customer</th>
                <th class="py-4 px-6">Total Amount</th>
                <th class="py-4 px-6">Pipeline Status</th>
                <th class="py-4 px-6">Date Received</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="o in orders" :key="o.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-mono font-bold text-xs shadow-2xs shrink-0">
                      <MessageSquare v-if="o.status === 'pending_whatsapp'" class="w-4 h-4 text-[#128C7E]" />
                      <ShoppingBag v-else class="w-4 h-4 text-[#1A170F]" />
                    </div>
                    <div>
                      <div class="font-mono font-extrabold text-sm text-[#1A170F]">{{ o.orderNumber }}</div>
                      <div class="text-[10px] text-[#9E978F] font-medium">{{ o.orderItems?.length || 0 }} items</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6">
                  <div class="font-bold text-sm text-[#1A170F]">{{ o.customerName }}</div>
                  <div class="flex items-center gap-1.5 text-[11px] text-[#7D766E] font-mono mt-0.5">
                    <MessageSquare class="w-3 h-3 text-[#128C7E]" />
                    <span>{{ o.customerPhone }}</span>
                  </div>
                </td>

                <td class="py-4 px-6 font-extrabold text-sm text-[#1A170F] tabular-nums">
                  Rp{{ formatPrice(o.total) }}
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="statusBadgeClass(o.status)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold capitalize"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
                    {{ formatStatusLabel(o.status) }}
                  </span>
                </td>

                <td class="py-4 px-6 text-[#7D766E] text-[11px]">
                  {{ formatDate(o.createdAt) }}
                </td>

                <td class="py-4 px-6 text-right whitespace-nowrap">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F1] hover:bg-[#1A170F] hover:text-[#FAF6F1] text-[#1A170F] font-bold text-xs border border-[#E4D8CC] transition cursor-pointer"
                    @click="openOrderModal(o.id)"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>Inspect Order</span>
                  </button>
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
        <div v-if="selectedOrder" class="relative w-full max-w-[760px] max-h-[90vh] cursor-default" @click.stop>
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-3 border-b border-[#F4ECE5]">
              <div>
                <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold text-[#7D766E] uppercase tracking-wider">Order Snapshot Inspection</span>
                <span :class="statusBadgeClass(selectedOrder.status)" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                  {{ formatStatusLabel(selectedOrder.status) }}
                </span>
              </div>
              <h2 class="text-2xl font-extrabold text-[#1A170F] mt-1">{{ selectedOrder.orderNumber }}</h2>
            </div>
            <button
              type="button"
              class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
              @click="showModal = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="authStore.hasPermission('orders.write')" class="p-5 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Update Pipeline Stage</span>
              <span class="text-[10px] text-[#7D766E]">Click stage button to advance order</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="st in ['contacted', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']"
                :key="st"
                type="button"
                :disabled="selectedOrder.status === st"
                :class="[
                  selectedOrder.status === st
                    ? 'bg-[#E04F26] text-white shadow-xs'
                    : 'bg-[#FFFDFB] text-[#1A170F] border border-[#E4D8CC] hover:bg-[#F2ECE5]'
                ]"
                class="px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer disabled:opacity-60"
                @click="updateStatus(st)"
              >
                Set {{ formatStatusLabel(st) }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 space-y-2">
              <span class="block text-[11px] font-bold text-[#7D766E] uppercase tracking-wider">Customer Snapshot</span>
              <div class="font-bold text-sm text-[#1A170F]">{{ selectedOrder.customerName }}</div>
              <div class="text-xs text-[#4A433C] font-mono">{{ selectedOrder.customerPhone }}</div>
              <div v-if="selectedOrder.customerEmail" class="text-xs text-[#7D766E]">{{ selectedOrder.customerEmail }}</div>
            </div>

            <div class="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 space-y-2">
              <span class="block text-[11px] font-bold text-[#7D766E] uppercase tracking-wider">Shipping Address (Snapshot)</span>
              <div class="text-xs text-[#1A170F] leading-relaxed">
                <p>{{ selectedOrder.shippingAddressSnapshot?.line1 || 'No address specified' }}</p>
                <p v-if="selectedOrder.shippingAddressSnapshot?.city">
                  {{ selectedOrder.shippingAddressSnapshot?.city }}, {{ selectedOrder.shippingAddressSnapshot?.province }} {{ selectedOrder.shippingAddressSnapshot?.postalCode }}
                </p>
              </div>
              <p v-if="selectedOrder.notes" class="text-[11px] text-[#7D766E] italic mt-1 bg-white/60 p-2 rounded-lg">
                Notes: "{{ selectedOrder.notes }}"
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Ordered Products & Pricing Snapshot</span>
              <span class="font-extrabold text-sm text-[#1A170F] tabular-nums">Total: Rp{{ formatPrice(selectedOrder.total) }}</span>
            </div>
            <div class="divide-y divide-[#F4ECE5] rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 overflow-hidden">
              <div v-for="item in selectedOrder.orderItems" :key="item.id" class="p-3.5 flex justify-between items-center text-xs">
                <div>
                  <div class="font-bold text-sm text-[#1A170F]">{{ item.productNameSnapshot }}</div>
                  <div class="text-[11px] text-[#7D766E] font-mono mt-0.5">
                    {{ item.variantSnapshot }} • SKU: {{ item.skuSnapshot }}
                  </div>
                </div>
                <div class="text-right font-extrabold text-[#1A170F] tabular-nums">
                  <div>Rp{{ formatPrice(item.lineTotal) }}</div>
                  <div class="text-[10px] text-[#7D766E] font-normal">({{ item.quantity }}x @Rp{{ formatPrice(item.unitPrice) }})</div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-[#1A170F]">Formatted WhatsApp Message (wa.me)</span>
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-xs text-[#128C7E] hover:underline cursor-pointer"
                @click="copyWhatsAppMessage"
              >
                <Copy class="w-3.5 h-3.5" />
                <span>Copy WA Text</span>
              </button>
            </div>
            <pre class="bg-[#1A170F] text-[#E8F8F0] p-4 rounded-2xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-48">{{ selectedOrder.whatsappMessage || 'WhatsApp message not yet generated' }}</pre>
          </div>

          <div class="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-[#F4ECE5]">
            <a
              v-if="selectedOrder.customerPhone"
              :href="getWhatsAppLink(selectedOrder)"
              target="_blank"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs hover:bg-[#20bd5a] transition-colors"
            >
              <MessageSquare class="w-4 h-4" />
              <span>Open Customer WhatsApp Chat</span>
            </a>
            <button
              type="button"
              class="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#7D766E] hover:bg-[#FAF6F1] transition cursor-pointer ml-auto"
              @click="showModal = false"
            >
              Close Inspection
            </button>
            </div>
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
import ModalScrollbar from '../components/ModalScrollbar.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import {
  MessageSquare,
  Search,
  FileSpreadsheet,
  Loader2,
  ClipboardList,
  ShoppingBag,
  Eye,
  X,
  Copy,
} from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);

const authStore = useAuthStore();
const toastStore = useToastStore();
const orders = ref<any[]>([]);
const loading = ref(true);
const activeTab = ref('');
const showModal = ref(false);
const selectedOrder = ref<any>(null);
const searchQuery = ref('');

interface PipelineTab {
  label: string;
  value: string;
  count: number;
}

const pipelineTabs = computed<PipelineTab[]>(() => [
  { label: 'All Orders', value: '', count: orders.value.length },
  { label: 'Pending WA', value: 'pending_whatsapp', count: orders.value.filter(o => o.status === 'pending_whatsapp').length },
  { label: 'Contacted', value: 'contacted', count: orders.value.filter(o => o.status === 'contacted').length },
  { label: 'Confirmed', value: 'confirmed', count: orders.value.filter(o => o.status === 'confirmed').length },
  { label: 'Processing', value: 'processing', count: orders.value.filter(o => o.status === 'processing').length },
  { label: 'Shipped', value: 'shipped', count: orders.value.filter(o => o.status === 'shipped').length },
  { label: 'Delivered', value: 'delivered', count: orders.value.filter(o => o.status === 'delivered').length },
  { label: 'Cancelled', value: 'cancelled', count: orders.value.filter(o => o.status === 'cancelled').length },
]);

const totalRevenue = computed(() => {
  return orders.value
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
});

const pendingCount = computed(() => {
  return orders.value.filter(o => o.status === 'pending_whatsapp').length;
});

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchOrders();
  }, 350);
};

const fetchOrders = async () => {
  try {
    loading.value = true;
    let url = `${API_BASE_URL}/admin/orders?status=${activeTab.value}`;
    if (searchQuery.value) {
      url += `&search=${encodeURIComponent(searchQuery.value)}`;
    }
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    orders.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const selectTab = (val: string) => {
  activeTab.value = val;
  fetchOrders();
};

const openOrderModal = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    selectedOrder.value = await res.json();
    showModal.value = true;
  } catch (e) {
    toastStore.error('Failed to load order details');
  }
};

const updateStatus = async (status: string) => {
  if (!selectedOrder.value) return;
  const note = prompt(`Optional note for transitioning to "${status}":`) || `Status updated to ${status} by admin`;
  try {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${selectedOrder.value.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ status, note }),
    });

    if (!res.ok) throw new Error('Failed to update pipeline status');

    toastStore.success(`Order status successfully updated to ${formatStatusLabel(status)}`);
    await openOrderModal(selectedOrder.value.id);
    await fetchOrders();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to update status');
  }
};

const exportOrdersCSV = () => {
  if (!orders.value.length) {
    toastStore.warning('No order data to export');
    return;
  }

  const headers = ['Order Number', 'Customer Name', 'WhatsApp', 'Status', 'Total (IDR)', 'Created At'];
  const rows = orders.value.map(o => [
    `"${o.orderNumber || ''}"`,
    `"${o.customerName || ''}"`,
    `"${o.customerPhone || ''}"`,
    `"${o.status || ''}"`,
    o.total || 0,
    `"${o.createdAt || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `orders_export_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toastStore.success('Order data successfully exported as CSV');
};

const getWhatsAppLink = (order: any) => {
  if (!order || !order.customerPhone) return '#';
  let phone = String(order.customerPhone).replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  const text = encodeURIComponent(order.whatsappMessage || `Hello ${order.customerName}, this is Jubi & Lee Studio regarding your order #${order.orderNumber}.`);
  return `https://wa.me/${phone}?text=${text}`;
};

const copyWhatsAppMessage = async () => {
  if (!selectedOrder.value?.whatsappMessage) return;
  try {
    await navigator.clipboard.writeText(selectedOrder.value.whatsappMessage);
    toastStore.success('WhatsApp text copied to clipboard');
  } catch {
    toastStore.error('Failed to copy text');
  }
};

const formatStatusLabel = (st: string) => {
  switch (st) {
    case 'pending_whatsapp': return 'Pending WA';
    case 'contacted': return 'Contacted';
    case 'confirmed': return 'Confirmed';
    case 'processing': return 'Processing';
    case 'shipped': return 'Shipped';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return st;
  }
};

const statusBadgeClass = (st: string) => {
  switch (st) {
    case 'pending_whatsapp': return 'bg-[#FEF3E2] text-[#B45309]';
    case 'contacted': return 'bg-[#E8F1FD] text-[#1D4ED8]';
    case 'confirmed': return 'bg-[#E8F8F0] text-[#128C7E]';
    case 'processing': return 'bg-[#F3E8FF] text-[#7E22CE]';
    case 'shipped': return 'bg-[#E6FFFA] text-[#0D9488]';
    case 'delivered': return 'bg-[#DEF7EC] text-[#03543F] font-extrabold';
    case 'cancelled': return 'bg-[#FDE8E8] text-[#9B1C1C]';
    default: return 'bg-[#F2ECE5] text-[#7D766E]';
  }
};

onMounted(fetchOrders);

const formatPrice = (val: any) => Number(val || 0).toLocaleString('id-ID');
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
