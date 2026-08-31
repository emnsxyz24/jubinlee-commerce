<template>
  <div class="bg-[#F4ECE5] min-h-screen flex p-3 sm:p-4 pr-6 sm:pr-8 gap-3 sm:gap-4 text-[#1A170F] font-sans antialiased">

    <aside
      class="h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)] sticky top-3 sm:top-4 bg-[#FFFDFB] rounded-[28px] m3-card-shadow flex flex-col justify-between p-3.5 sm:p-4 select-none shrink-0 transition-all duration-300 z-30 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      :class="rail ? 'w-[76px]' : 'w-[252px]'"
    >
      <div class="space-y-4">

        <div class="flex items-center justify-between px-1.5 pt-1 pb-1">
          <div class="flex items-center gap-3 min-w-0" v-if="!rail">
            <img
              src="https://res.cloudinary.com/nfofcl3h/image/upload/v1787751718/dark-logo.svg"
              alt="Jubi &amp; Lee Logo"
              class="w-10 h-10 object-contain shrink-0"
            />
            <div class="flex flex-col min-w-0">
              <span class="font-extrabold text-base tracking-wider text-[#1A170F] leading-tight">JUBI &amp; LEE</span>
              <span class="text-[9px] font-bold uppercase tracking-widest text-[#9E978F]">ADMIN STUDIO</span>
            </div>
          </div>
          <div v-else class="w-10 h-10 flex items-center justify-center mx-auto">
            <img
              src="https://res.cloudinary.com/nfofcl3h/image/upload/v1787751718/dark-logo.svg"
              alt="Jubi &amp; Lee Logo"
              class="w-10 h-10 object-contain"
            />
          </div>

          <button
            v-if="!rail"
            type="button"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
            @click="rail = true"
            title="Collapse Sidebar"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
        </div>

        <div v-if="rail" class="flex justify-center">
          <button
            type="button"
            class="w-8 h-8 rounded-xl flex items-center justify-center text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
            @click="rail = false"
            title="Expand Sidebar"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <nav class="space-y-1">

          <div v-if="!rail" class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">
            Applications
          </div>

          <router-link
            to="/"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Dashboard' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <LayoutDashboard class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Dashboard</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('products.read')"
            to="/products"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/products') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Products' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Shirt class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Products</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('categories.read')"
            to="/categories"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/categories') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Categories' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Layers class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Categories</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('products.read')"
            to="/inventory"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/inventory') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Inventory' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Boxes class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Inventory</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('orders.read')"
            to="/orders"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/orders') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Orders Pipeline' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <ClipboardList class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Orders Pipeline</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('orders.read')"
            to="/customers"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/customers') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Customers' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Users class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Customers</span>
          </router-link>

          <div v-if="!rail" class="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">
            Communications
          </div>

          <router-link
            v-if="authStore.hasPermission('messages.read')"
            to="/messages"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/messages') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Contact Inbox' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <MessageSquare class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Contact Inbox</span>
          </router-link>

          <div v-if="!rail" class="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">
            System & Audit
          </div>

          <router-link
            v-if="authStore.hasPermission('analytics.read')"
            to="/analytics"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/analytics') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Sales Analytics' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <TrendingUp class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Sales Analytics</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('settings.read')"
            to="/settings"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/settings') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Store Settings' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Settings class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Store Settings</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('users.read')"
            to="/users"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/users') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Users & Roles' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <Shield class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Users & Roles</span>
          </router-link>

          <router-link
            v-if="authStore.hasPermission('activity_logs.read')"
            to="/activity-logs"
            class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
            :class="isCurrentRoute('/activity-logs') ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
            :title="rail ? 'Activity Logs' : undefined"
          >
            <div class="w-6 h-6 flex items-center justify-center shrink-0">
              <History class="w-5 h-5" />
            </div>
            <span v-if="!rail" class="text-xs tracking-tight truncate">Activity Logs</span>
          </router-link>

        </nav>
      </div>

      <div class="pt-3 border-t border-[#F4ECE5] space-y-2">
        <div v-if="!rail" class="flex items-center gap-3 p-2.5 bg-[#FAF6F1] rounded-2xl shadow-2xs">
          <div class="w-8 h-8 rounded-full bg-[#1A170F] text-[#F4ECE5] text-xs font-bold flex items-center justify-center shrink-0">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-[#1A170F] truncate">{{ authStore.user?.name }}</span>
            <span class="text-[9px] font-bold uppercase tracking-wider text-[#7D766E]">
              {{ typeof authStore.user?.role === 'object' ? (authStore.user?.role as any)?.name : (authStore.user?.role || 'Staff') }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="w-full py-2 px-3 rounded-xl bg-[#FEE2E2]/70 text-[#DC2626] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FEE2E2] transition cursor-pointer"
          @click="handleLogout"
          :title="rail ? 'Sign Out' : undefined"
        >
          <LogOut class="w-4 h-4" />
          <span v-if="!rail">Sign Out</span>
        </button>
      </div>
    </aside>

    <div class="flex-1 min-w-0 flex flex-col gap-4">

      <header class="w-full bg-[#FFFDFB] rounded-[24px] m3-card-shadow px-5 sm:px-6 py-3.5 flex items-center justify-between select-none shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-8 h-8 rounded-xl hover:bg-[#FAF6F1] text-[#1A170F] flex items-center justify-center transition cursor-pointer"
            @click="rail = !rail"
            title="Toggle Sidebar"
          >
            <ChevronsRight v-if="rail" class="w-5 h-5" />
            <ChevronsLeft v-else class="w-5 h-5" />
          </button>
          <div class="text-base sm:text-lg font-bold text-[#1A170F] tracking-tight">
            {{ pageTitle }}
          </div>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F1] text-[#4A433C] text-xs font-semibold shadow-2xs">
            <Calendar class="w-3.5 h-3.5 text-[#7D766E]" />
            <span>August 2026</span>
          </div>

          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F8F0] text-[#128C7E] text-xs font-bold shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-[#128C7E] animate-pulse" />
            <span>API Online</span>
          </div>

          <div class="w-8 h-8 rounded-full bg-[#1A170F] text-[#F4ECE5] text-xs font-bold flex items-center justify-center shadow-2xs">
            {{ authStore.user?.name?.charAt(0) || 'S' }}
          </div>
        </div>
      </header>

      <main class="w-full flex-1">
        <slot />
      </main>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  LayoutDashboard,
  Shirt,
  Layers,
  Boxes,
  ClipboardList,
  Users,
  MessageSquare,
  TrendingUp,
  Settings,
  Shield,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const rail = ref(false);

const isCurrentRoute = (path: string) => {
  if (path === '/' && route.path === '/') return true;
  if (path !== '/' && route.path.startsWith(path)) return true;
  return false;
};

const pageTitle = computed(() => {
  switch (route.path) {
    case '/': return 'Dashboard Overview';
    case '/products': return 'Products Catalog';
    case '/categories': return 'Categories & Departments';
    case '/inventory': return 'Inventory & Stock Management';
    case '/orders': return 'Incoming Orders Pipeline';
    case '/customers': return 'Customer Directory';
    case '/messages': return 'Contact Inquiries';
    case '/analytics': return 'Sales & Performance Analytics';
    case '/settings': return 'Store & Website Settings';
    case '/users': return 'Users & Roles Management';
    case '/activity-logs': return 'System Activity Logs';
    default: return 'Jubi & Lee Admin Studio';
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>
