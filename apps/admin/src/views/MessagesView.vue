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
              <Mail class="w-3.5 h-3.5" />
              <span>Jubi &amp; Lee Customer Communications</span>
            </div>
            <h1 class="text-2xl sm:text-4xl font-extrabold text-[#1A170F] tracking-tight">
              Contact Inquiries
            </h1>
            <p class="text-xs sm:text-sm text-[#7D766E] mt-1 max-w-xl">
              Review visitor inquiries from the storefront contact form and reply directly via official WhatsApp.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Total Inquiries</span>
              <span class="font-bold text-lg text-[#1A170F] tabular-nums">{{ messages.length }} Messages</span>
            </div>
            <div class="px-5 py-3 rounded-2xl bg-[#FFFDFB]/90 shadow-2xs border border-[#E4D8CC]">
              <span class="block text-[10px] font-bold text-[#7D766E] uppercase">Unreplied</span>
              <span class="font-bold text-lg text-[#B45309] tabular-nums">{{ unreadCount }} Messages</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-[28px] bg-[#FFFDFB] m3-card-shadow overflow-hidden border border-[#E4D8CC]"
      >
        <div v-if="loading" class="p-16 text-center text-xs text-[#9E978F]">
          <Loader2 class="w-8 h-8 animate-spin text-[#E04F26] mb-3 mx-auto" />
          <div>Loading contact inquiries...</div>
        </div>

        <div v-else-if="!messages.length" class="p-16 text-center text-[#7D766E] text-xs">
          <MailOpen class="w-12 h-12 mb-3 text-[#CEC5BB] mx-auto" />
          <div class="font-bold text-sm text-[#1A170F]">No contact inquiries found</div>
          <p class="text-xs text-[#9E978F] mt-1">Inquiries submitted from the storefront contact page will appear here.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs text-[#1A170F]">
            <thead class="bg-[#FAF6F1] text-[#7D766E] uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th class="py-4 px-6">Sender</th>
                <th class="py-4 px-6">Contact Info</th>
                <th class="py-4 px-6">Subject & Message</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Received At</th>
                <th class="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F4ECE5]">
              <tr v-for="m in messages" :key="m.id" class="hover:bg-[#FAF6F1]/50 transition-colors">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-[#F4ECE5] text-[#1A170F] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {{ m.name?.charAt(0)?.toUpperCase() || 'P' }}
                    </div>
                    <div>
                      <div class="font-bold text-sm text-[#1A170F]">{{ m.name }}</div>
                    </div>
                  </div>
                </td>

                <td class="py-4 px-6 space-y-0.5">
                  <div v-if="m.phone">
                    <a
                      :href="`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`"
                      target="_blank"
                      class="inline-flex items-center gap-1 font-mono font-semibold text-xs text-[#128C7E] hover:underline"
                    >
                      <MessageSquare class="w-3 h-3" />
                      <span>{{ m.phone }}</span>
                    </a>
                  </div>
                  <div v-if="m.email" class="text-[#7D766E] text-[11px]">{{ m.email }}</div>
                </td>

                <td class="py-4 px-6 max-w-sm">
                  <div class="font-bold text-sm text-[#1A170F] truncate">{{ m.subject || 'General Inquiry' }}</div>
                  <div class="text-[#7D766E] line-clamp-2 text-[11px] mt-0.5 leading-relaxed">{{ m.message }}</div>
                </td>

                <td class="py-4 px-6">
                  <span 
                    :class="[
                      m.status === 'unread' ? 'bg-[#FEF3E2] text-[#B45309]' :
                      m.status === 'replied' ? 'bg-[#E8F8F0] text-[#128C7E]' : 'bg-[#FAF6F1] text-[#7D766E]'
                    ]"
                    class="px-3 py-1 rounded-full text-[10px] font-bold capitalize"
                  >
                    {{ formatMessageStatus(m.status) }}
                  </span>
                </td>

                <td class="py-4 px-6 text-[#7D766E] text-[11px]">
                  {{ formatDate(m.createdAt) }}
                </td>

                <td class="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                  <a
                    v-if="m.phone"
                    :href="getWhatsAppReplyLink(m)"
                    target="_blank"
                    @click="updateStatus(m.id, 'replied')"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-2xs transition"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    <span>Reply WA</span>
                  </a>
                  <button
                    v-if="m.status === 'unread'"
                    type="button"
                    class="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
                    @click="updateStatus(m.id, 'read')"
                  >
                    Mark Read
                  </button>
                  <button
                    type="button"
                    class="p-2 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
                    @click="openMessageDetail(m)"
                    title="View message details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div 
        v-if="showDetailModal" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs cursor-default"
        role="dialog"
        aria-modal="true"
        @click="showDetailModal = false"
      >
        <div
          v-if="selectedMessage"
          class="relative w-full max-w-[600px] max-h-[90vh] cursor-default"
          @click.stop
        >
          <div
            ref="modalScrollRef"
            class="w-full max-h-[90vh] bg-[#FFFDFB] rounded-[28px] p-6 sm:p-8 m3-card-shadow border border-[#E4D8CC] overflow-y-auto space-y-6"
          >
            <div class="flex justify-between items-start pb-4 border-b border-[#E4D8CC]/70">
              <div>
                <span class="text-[10px] font-bold text-[#7D766E] uppercase tracking-wider">Contact Inquiry Details</span>
                <h2 class="text-xl font-extrabold text-[#1A170F] mt-1">{{ selectedMessage.subject || 'Customer Inquiry' }}</h2>
              </div>
              <button
                type="button"
                class="p-1.5 rounded-xl text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] cursor-pointer"
                @click="showDetailModal = false"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-[#7D766E]">Sender:</span>
                <strong class="text-[#1A170F]">{{ selectedMessage.name }}</strong>
              </div>
              <div v-if="selectedMessage.phone" class="flex justify-between">
                <span class="text-[#7D766E]">WhatsApp:</span>
                <span class="font-mono text-[#128C7E] font-bold">{{ selectedMessage.phone }}</span>
              </div>
              <div v-if="selectedMessage.email" class="flex justify-between">
                <span class="text-[#7D766E]">Email:</span>
                <span class="text-[#1A170F]">{{ selectedMessage.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#7D766E]">Received At:</span>
                <span class="text-[#1A170F]">{{ formatDate(selectedMessage.createdAt) }}</span>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">Message Content</label>
              <div class="p-4 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC]/60 text-xs text-[#1A170F] leading-relaxed whitespace-pre-wrap">
                {{ selectedMessage.message }}
              </div>
            </div>

            <div class="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-[#E4D8CC]/70">
              <a
                v-if="selectedMessage.phone"
                :href="getWhatsAppReplyLink(selectedMessage)"
                target="_blank"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs hover:bg-[#20bd5a] transition-colors"
                @click="updateStatus(selectedMessage.id, 'replied')"
              >
                <MessageSquare class="w-4 h-4" />
                <span>Reply on WhatsApp</span>
              </a>
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl font-semibold text-xs text-[#7D766E] hover:bg-[#FAF6F1] transition cursor-pointer ml-auto"
                @click="showDetailModal = false"
              >
                Close
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
import { Mail, MailOpen, Loader2, MessageSquare, Eye, X } from 'lucide-vue-next';

const modalScrollRef = ref<any>(null);

const authStore = useAuthStore();
const toastStore = useToastStore();
const messages = ref<any[]>([]);
const loading = ref(true);
const showDetailModal = ref(false);
const selectedMessage = ref<any>(null);

const unreadCount = computed(() => {
  return messages.value.filter(m => m.status === 'unread').length;
});

const fetchMessages = async () => {
  try {
    loading.value = true;
    const res = await fetch(`${API_BASE_URL}/admin/messages`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const data = await res.json();
    messages.value = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
  } catch (e) {
    messages.value = [];
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id: string, status: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    toastStore.success(`Message marked as ${status}`);
    await fetchMessages();
  } catch (e: any) {
    toastStore.error(e.message || 'Failed to update message status');
  }
};

const openMessageDetail = (m: any) => {
  selectedMessage.value = m;
  showDetailModal.value = true;
  if (m.status === 'unread') {
    updateStatus(m.id, 'read');
  }
};

const getWhatsAppReplyLink = (m: any) => {
  if (!m?.phone) return '#';
  let phone = String(m.phone).replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  const text = encodeURIComponent(`Hello ${m.name}, thank you for contacting Jubi & Lee Studio regarding your inquiry: "${m.subject || 'Inquiry'}". How can we assist you further?`);
  return `https://wa.me/${phone}?text=${text}`;
};

const formatMessageStatus = (st: string) => {
  switch (st) {
    case 'unread': return 'Unread';
    case 'read': return 'Read';
    case 'replied': return 'Replied';
    default: return st;
  }
};

onMounted(fetchMessages);

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
