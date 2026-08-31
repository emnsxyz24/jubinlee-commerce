<template>
  <div class="min-h-screen bg-[#F4ECE5] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
    
    <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#1A170F]/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#EBE3DA] blur-3xl pointer-events-none" />

    <div
      class="rounded-[32px] bg-[#FFFDFB] m3-hero-shadow p-8 sm:p-10 max-w-md w-full relative z-10 space-y-6 border border-[#E4D8CC]"
    >
      <div class="text-center space-y-2">
        <img
          src="https://res.cloudinary.com/nfofcl3h/image/upload/v1787751718/dark-logo.svg"
          alt="Jubi &amp; Lee Logo"
          class="w-16 h-16 object-contain mx-auto mb-2"
        />
        <div>
          <div class="inline-block px-3 py-1 rounded-full bg-[#E04F26]/10 text-[#E04F26] text-[10px] font-bold tracking-widest uppercase mb-1">
            Administration Studio
          </div>
          <h1 class="text-3xl font-extrabold text-[#1A170F] tracking-tight">
            JUBI &amp; LEE
          </h1>
          <p class="text-xs text-[#7D766E] mt-1">
            Sign in to manage catalog, inventory, and WhatsApp orders.
          </p>
        </div>
      </div>

      <div v-if="error" class="p-3.5 rounded-2xl bg-[#FDE8E8] text-[#9B1C1C] text-xs font-bold flex items-center gap-2 shadow-2xs">
        <AlertCircle class="w-4 h-4 shrink-0 text-[#9B1C1C]" />
        <span>{{ error }}</span>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">
            Email Address *
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
              <Mail class="w-4 h-4" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="admin@fashionstore.com"
              required
              class="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26] focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] font-bold text-[#4A433C] uppercase tracking-wider mb-2.5">
            Password *
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D766E]">
              <Lock class="w-4 h-4" />
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FAF6F1] border border-[#E4D8CC] text-sm text-[#1A170F] placeholder:text-[#7D766E]/60 focus:outline-none focus:ring-2 focus:ring-[#E04F26] focus:border-transparent transition"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7D766E] hover:text-[#1A170F] cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" class="w-4 h-4" />
              <Eye v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 px-4 rounded-2xl bg-[#E04F26] hover:bg-[#C8431E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span>Sign in to Dashboard</span>
          </button>
        </div>
      </form>

      <div class="pt-4 border-t border-[#F4ECE5] text-center text-xs text-[#7D766E]">
        <span class="text-[11px]">Default Demo Account:</span><br>
        <code class="bg-[#FAF6F1] text-[#1A170F] px-3 py-1 rounded-xl font-mono text-[11px] mt-1.5 inline-block font-semibold">
          admin@fashionstore.com / AdminPass123!
        </code>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('admin@fashionstore.com');
const password = ref('AdminPass123!');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.login(email.value, password.value);
    router.push('/');
  } catch (err: any) {
    error.value = err?.message || 'Invalid credentials or login failed';
  } finally {
    loading.value = false;
  }
};
</script>
