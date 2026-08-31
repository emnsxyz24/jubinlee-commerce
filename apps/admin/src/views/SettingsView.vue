<template>
  <AdminLayout>
    <div class="space-y-7 max-w-5xl">

      <div
        class="rounded-[28px] bg-[#EBE3DA] m3-hero-shadow relative overflow-hidden p-7 sm:p-9 border border-[#E4D8CC]"
      >
        <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#1A170F]/5 blur-2xl pointer-events-none" />
        <div class="absolute right-28 -bottom-20 w-64 h-64 rounded-full bg-[#F4ECE5]/80 blur-xl pointer-events-none" />

        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A170F]/10 text-[#1A170F] text-[11px] font-bold tracking-wider uppercase mb-3">
              <Settings class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee Store Configuration</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Store Settings & Integrations
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Configure WhatsApp Checkout Desk, store identity profile, and operational parameters.
            </p>
          </div>

          <button
            v-if="authStore.hasPermission('settings.write')"
            type="button"
            :disabled="saving"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
            @click="saveSettings"
          >
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <Check v-else class="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div v-if="successMsg" class="p-4 rounded-2xl bg-[#E8F8F0] text-[#128C7E] text-xs font-bold flex items-center justify-between shadow-2xs border border-[#128C7E]/20">
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4" />
          <span>{{ successMsg }}</span>
        </div>
        <button type="button" class="p-1 rounded-lg text-[#128C7E] hover:bg-black/5 cursor-pointer" @click="successMsg = ''">
          <X class="w-4 h-4" />
        </button>
      </div>

      <form @submit.prevent="saveSettings" class="space-y-6">

        <div
          class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-6 sm:p-8 space-y-5 border border-[#E4D8CC]"
        >
          <div class="flex items-center gap-3 pb-3 border-b border-[#F4ECE5]">
            <div class="w-10 h-10 rounded-2xl bg-[#E8F8F0] text-[#128C7E] flex items-center justify-center shadow-2xs">
              <MessageSquare class="w-5 h-5" />
            </div>
            <div>
              <h2 class="font-extrabold text-lg text-[#1A170F]">WhatsApp Checkout Desk</h2>
              <p class="text-xs text-[#7D766E]">Official customer support number receiving automated checkout orders (wa.me).</p>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Admin WhatsApp Number (Country Code Without '+') *</label>
            <input
              v-model="settings.whatsappNumber"
              type="text"
              placeholder="6281234567890"
              required
              class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] font-mono focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
            />
            <p class="text-[11px] text-[#9E978F] mt-1.5 pl-1">
              International format without spaces or '+' symbol, e.g. <strong class="text-[#1A170F] font-mono">6281234567890</strong> (Indonesia).
            </p>
          </div>
        </div>

        <div
          class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow p-6 sm:p-8 space-y-6 border border-[#E4D8CC]"
        >
          <div class="flex items-center gap-3 pb-3 border-b border-[#F4ECE5]">
            <div class="w-10 h-10 rounded-2xl bg-[#FAF6F1] text-[#1A170F] flex items-center justify-center shadow-2xs">
              <Store class="w-5 h-5" />
            </div>
            <div>
              <h2 class="font-extrabold text-lg text-[#1A170F]">Brand Identity & Store Profile</h2>
              <p class="text-xs text-[#7D766E]">Profile information displayed in the footer and storefront pages.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Store / Brand Name *</label>
              <input
                v-model="settings.info.name"
                type="text"
                placeholder="Jubi &amp; Lee Studio"
                required
                class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Brand Tagline</label>
              <input
                v-model="settings.info.tagline"
                type="text"
                placeholder="Modern Mobile-First Fashion &amp; Luxury Apparel"
                class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Official Contact Email</label>
              <input
                v-model="settings.info.email"
                type="email"
                placeholder="info@jubilee.id"
                class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Boutique / Showroom Address</label>
              <input
                v-model="settings.info.address"
                type="text"
                placeholder="Jl. Senopati No. 45, Jakarta Selatan"
                class="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] focus:outline-none focus:ring-2 focus:ring-[#E04F26]"
              />
            </div>
          </div>

          <div class="pt-4 border-t border-[#F4ECE5] flex justify-end">
            <button
              v-if="authStore.hasPermission('settings.write')"
              type="submit"
              :disabled="saving"
              class="px-7 py-3 rounded-xl bg-[#E04F26] hover:bg-[#C8431E] font-bold text-xs text-white shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { API_BASE_URL } from '../config';
import { Settings, Loader2, Check, CheckCircle2, X, MessageSquare, Store } from 'lucide-vue-next';

const authStore = useAuthStore();
const toastStore = useToastStore();
const saving = ref(false);
const successMsg = ref('');

const settings = ref({
  whatsappNumber: '6281234567890',
  info: {
    name: 'Jubi & Lee Studio',
    tagline: 'Modern Mobile-First Fashion & Luxury Apparel',
    email: 'info@jubilee.id',
    address: 'Jl. Sudirman No. 45, Jakarta',
  },
});

const fetchSettings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      data.forEach((s: any) => {
        if (s.key === 'store_whatsapp_number') settings.value.whatsappNumber = s.value;
        if (s.key === 'store_info') settings.value.info = s.value;
      });
    }
  } catch {}
};

const saveSettings = async () => {
  try {
    saving.value = true;
    successMsg.value = '';

    await Promise.all([
      fetch(`${API_BASE_URL}/admin/settings/store_whatsapp_number`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify({ value: settings.value.whatsappNumber }),
      }),
      fetch(`${API_BASE_URL}/admin/settings/store_info`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authStore.token}` },
        body: JSON.stringify({ value: settings.value.info }),
      }),
    ]);

    toastStore.success('WhatsApp desk & store profile settings successfully saved!');
  } catch (e: any) {
    toastStore.error('Failed to save settings');
  } finally {
    saving.value = false;
  }
};

onMounted(fetchSettings);
</script>
