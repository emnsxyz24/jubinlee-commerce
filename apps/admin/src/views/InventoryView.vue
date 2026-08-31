<template>
  <AdminLayout>
    <div class="space-y-7">

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-0.5">
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1A170F] tracking-tight">Inventory & Stock Management</h1>
            <span class="text-[11px] font-bold text-[#7D766E] bg-[#F2ECE5] px-3 py-1 rounded-full">
              {{ inventory.length }} Variant SKUs
            </span>
          </div>
          <p class="text-xs sm:text-sm text-[#7D766E] mt-1">Audit variant stock quantities and record formal inventory adjustment logs.</p>
        </div>
      </div>

      <div
        class="rounded-[24px] bg-[#FFFDFB] m3-card-shadow p-5 flex flex-wrap items-center gap-4 border border-[#E4D8CC]"
      >
        <div class="flex-1 min-w-[240px] relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
            <Search class="w-4 h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search SKU, product name, color, or size..."
            @input="debounceSearch"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
          />
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :class="lowStockOnly ? 'bg-[#FEF3E2] text-[#B45309] font-bold shadow-xs border-[#FDE047]' : 'bg-[#FAF6F1] text-[#7D766E] font-semibold hover:text-[#1A170F] border-[#E4D8CC]'"
            class="px-4 py-2 rounded-xl text-xs flex items-center gap-2 border transition cursor-pointer"
            @click="toggleLowStock"
          >
            <AlertCircle class="w-4 h-4" />
            <span>Low Stock Only (≤5)</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-[#FAF6F1] hover:bg-[#F4ECE5] text-[#1A170F] border border-[#E4D8CC] transition cursor-pointer"
            @click="exportInventoryCSV"
          >
            <FileSpreadsheet class="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading inventory data...</div>
        </div>

        <div v-else-if="!groupedInventory.length" class="p-16 text-center text-[#7D766E] text-xs">
          <Boxes class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No matching inventory found</div>
          <p class="text-xs text-[#9E978F] mt-1">Try adjusting your search query or low stock filter criteria.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">SKU / Variant</th>
                <th class="py-4 px-6">Parent Product</th>
                <th class="py-4 px-6">Size / Color</th>
                <th class="py-4 px-6">Available Stock</th>
                <th class="py-4 px-6">Stock Status</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <template v-for="group in groupedInventory" :key="group.product?.id || group.product?.name">
                
                <tr class="bg-[#FAF6F1]/70 font-semibold">
                  <td colspan="6" class="py-3.5 px-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <img 
                          :src="group.product?.productImages?.[0]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400'" 
                          :alt="group.product?.name"
                          class="w-8 h-10 object-cover rounded-xl bg-[#F2ECE5] shadow-2xs shrink-0"
                        />
                        <div>
                          <span class="font-bold text-sm text-[#1A170F]">{{ group.product?.name || 'Unassigned Product' }}</span>
                          <span class="text-[10px] text-[#9E978F] font-mono ml-2">/products/{{ group.product?.slug }}</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-bold text-[#7D766E]">Total Stock:</span>
                        <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1A170F] text-[#F4ECE5] tabular-nums shadow-2xs">
                          {{ group.totalStock }} units
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr v-for="v in group.variants" :key="v.id" class="hover:bg-[#FAF6F1]/40 transition-colors">
                  <td class="py-3.5 px-6 pl-10 font-mono font-bold text-xs text-[#1A170F]">
                    <span class="text-[#CEC5BB] mr-1.5 font-sans">└</span>
                    {{ v.sku }}
                  </td>

                  <td class="py-3.5 px-6 text-[#7D766E]">
                    {{ group.product?.name }}
                  </td>

                  <td class="py-3.5 px-6 font-semibold">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF6F1] text-[#1A170F] text-[11px]">
                      {{ v.size || 'Free Size' }} • {{ v.color || 'Standard' }}
                    </span>
                  </td>

                  <td class="py-3.5 px-6 font-extrabold text-sm text-[#1A170F] tabular-nums">
                    {{ v.stockQuantity }} units
                  </td>

                  <td class="py-4 px-6">
                    <span 
                      v-if="v.stockQuantity <= 0" 
                      class="bg-[#FDE8E8] text-[#9B1C1C] px-3 py-1 rounded-full text-[10px] font-bold"
                    >
                      Out of Stock
                    </span>
                    <span 
                      v-else-if="v.stockQuantity <= (v.lowStockThreshold || 5)" 
                      class="bg-[#FEF3E2] text-[#B45309] px-3 py-1 rounded-full text-[10px] font-bold"
                    >
                      Low Stock (≤{{ v.lowStockThreshold || 5 }})
                    </span>
                    <span 
                      v-else 
                      class="bg-[#E8F8F0] text-[#128C7E] px-3 py-1 rounded-full text-[10px] font-bold"
                    >
                      In Stock
                    </span>
                  </td>

                  <td class="py-3.5 px-6 text-right whitespace-nowrap">
                    <button
                      v-if="authStore.hasPermission('products.write')"
                      type="button"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F1] hover:bg-[#1A170F] hover:text-[#FAF6F1] text-[#1A170F] font-bold text-xs border border-[#E4D8CC] transition cursor-pointer"
                      @click="openAdjustModal(v)"
                    >
                      <SlidersHorizontal class="w-3.5 h-3.5" />
                      <span>Adjust Stock</span>
                    </button>
                  </td>
                </tr>

              </template>
            </tbody>
          </table>
        </div>
      </div>

      <div 
        v-if="showAdjustModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-default"
        role="dialog"
        aria-modal="true"
        @click="showAdjustModal = false"
      >
        <div class="relative w-full max-w-[560px] max-h-[90vh] cursor-default" @click.stop>
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-4 border-b border-[#E4D8CC]/70">
              <div>
                <h2 class="text-xl font-extrabold text-[#1A170F]">Inventory Stock Adjustment</h2>
                <p class="text-xs text-[#7D766E] mt-1">Record official audit entry into inventory adjustment history.</p>
              </div>
              <button
                type="button"
                class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
                @click="showAdjustModal = false"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div v-if="selectedVariant" class="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="text-[#7D766E]">Variant SKU:</span>
                <span class="font-mono font-bold text-[#1A170F]">{{ selectedVariant.sku }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-[#7D766E]">Size / Color:</span>
                <span class="font-semibold text-[#1A170F]">{{ selectedVariant.size || '-' }} / {{ selectedVariant.color || '-' }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-[#7D766E]">Current Stock:</span>
                <span class="font-extrabold text-sm text-[#1A170F] tabular-nums">{{ selectedVariant.stockQuantity }} units</span>
              </div>
            </div>

            <form @submit.prevent="submitAdjustment" class="space-y-6">
              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Adjustment Quantity (+ / -) *</label>
                <input
                  v-model.number="adjustForm.delta"
                  type="number"
                  placeholder="+10 or -5"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
                <p class="text-[11px] text-[#7D766E] mt-1.5 pl-1">
                  Estimated new stock: <strong class="text-[#1A170F]">{{ (selectedVariant?.stockQuantity || 0) + Number(adjustForm.delta || 0) }} units</strong>
                </p>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Adjustment Reason (Audit Log) *</label>
                <textarea
                  v-model="adjustForm.reason"
                  placeholder="e.g. Received new shipment, Damaged item, Correction of miscount"
                  rows="3"
                  required
                  class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
                />
              </div>

              <div class="flex justify-end gap-3 pt-4 border-t border-[#E4D8CC]/70">
                <button
                  type="button"
                  class="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#7D766E] hover:bg-[#FAF6F1] transition cursor-pointer"
                  @click="showAdjustModal = false"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-7 py-2.5 rounded-xl font-bold text-xs text-white bg-[#E04F26] hover:bg-[#C8431E] shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
                  <span>Save Adjustment</span>
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
import ModalScrollbar from '../components/ModalScrollbar.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import {
  Search,
  AlertCircle,
  FileSpreadsheet,
  Loader2,
  Boxes,
  SlidersHorizontal,
  X,
} from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);
const authStore = useAuthStore();
const toastStore = useToastStore();
const inventory = ref<any[]>([]);
const loading = ref(true);
const lowStockOnly = ref(false);
const searchQuery = ref('');

const showAdjustModal = ref(false);
const selectedVariant = ref<any>(null);
const submitting = ref(false);

const adjustForm = ref({
  delta: 10,
  reason: '',
});

const groupedInventory = computed(() => {
  const map = new Map<string, { product: any; variants: any[]; totalStock: number }>();

  for (const item of inventory.value) {
    const pId = item.product?.id || item.product?.name || 'unassigned';
    if (!map.has(pId)) {
      map.set(pId, {
        product: item.product || { name: 'Unassigned Product', slug: '#' },
        variants: [],
        totalStock: 0,
      });
    }
    const group = map.get(pId)!;
    group.variants.push(item);
    group.totalStock += Number(item.stockQuantity || 0);
  }

  return Array.from(map.values());
});

const toggleLowStock = () => {
  lowStockOnly.value = !lowStockOnly.value;
  fetchInventory();
};

let debounceTimer: any = null;
const debounceSearch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchInventory();
  }, 350);
};

const fetchInventory = async () => {
  try {
    loading.value = true;
    const url = `${API_BASE_URL}/admin/inventory?lowStock=${lowStockOnly.value}&search=${encodeURIComponent(searchQuery.value)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    inventory.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    inventory.value = [];
  } finally {
    loading.value = false;
  }
};

const exportInventoryCSV = () => {
  if (!inventory.value.length) {
    toastStore.warning('No inventory data to export');
    return;
  }

  const headers = ['Product', 'SKU', 'Size', 'Color', 'Available Stock', 'Status'];
  const rows = inventory.value.map(i => [
    `"${i.product?.name || ''}"`,
    `"${i.sku || ''}"`,
    `"${i.size || ''}"`,
    `"${i.color || ''}"`,
    i.stockQuantity || 0,
    (i.stockQuantity || 0) <= 5 ? '"Low Stock"' : '"In Stock"'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `inventory_export_${new Date().toISOString().substring(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toastStore.success('Inventory data successfully exported to CSV');
};

const openAdjustModal = (variant: any) => {
  selectedVariant.value = variant;
  adjustForm.value = { delta: 10, reason: '' };
  showAdjustModal.value = true;
};

const submitAdjustment = async () => {
  if (!selectedVariant.value) return;
  if (!adjustForm.value.reason || !adjustForm.value.reason.trim()) {
    toastStore.warning('Adjustment reason is required for inventory audit tracking.');
    return;
  }
  try {
    submitting.value = true;
    const res = await fetch(`${API_BASE_URL}/admin/inventory/${selectedVariant.value.id}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(adjustForm.value),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to save inventory adjustment');
    }

    toastStore.success(`Stock for SKU ${selectedVariant.value.sku} successfully adjusted (${adjustForm.value.delta > 0 ? '+' : ''}${adjustForm.value.delta})`);
    showAdjustModal.value = false;
    fetchInventory();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to save adjustment');
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchInventory);
</script>
