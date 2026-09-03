<template>
  <div class="bg-[#F4ECE5] min-h-screen flex p-3 sm:p-4 pr-6 sm:pr-8 gap-3 sm:gap-4 text-[#1A170F] font-sans antialiased">

    <TooltipProvider :delay-duration="100">
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
          <TooltipRoot :disabled="!rail">
            <TooltipTrigger as-child>
              <button
                type="button"
                class="w-8 h-8 rounded-xl flex items-center justify-center text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] transition cursor-pointer"
                @click="rail = false"
                aria-label="Expand Sidebar"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="right"
                :side-offset="12"
                class="z-50 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#1A170F] text-[#FAF6F1] shadow-xl border border-[#3D352E] select-none animate-in fade-in-0 zoom-in-95 pointer-events-none"
              >
                <span>Expand Sidebar</span>
                <TooltipArrow class="fill-[#1A170F]" />
              </TooltipContent>
            </TooltipPortal>
          </TooltipRoot>
        </div>

        <nav class="space-y-1">
          <template v-for="section in navSections" :key="section.title">
            <div v-if="!rail" class="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#9E978F]">
              {{ section.title }}
            </div>

            <template v-for="item in section.items" :key="item.path">
              <TooltipRoot v-if="!item.permission || authStore.hasPermission(item.permission)" :disabled="!rail">
                <TooltipTrigger as-child>
                  <router-link
                    :to="item.path"
                    class="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-150 relative group"
                    :class="isCurrentRoute(item.path) ? 'bg-[#EBE3DA] text-[#1A170F] font-bold shadow-2xs' : 'text-[#7D766E] hover:text-[#1A170F] hover:bg-[#FAF6F1] font-medium'"
                  >
                    <div class="w-6 h-6 flex items-center justify-center shrink-0">
                      <component :is="item.icon" class="w-5 h-5" />
                    </div>
                    <span v-if="!rail" class="text-xs tracking-tight truncate">{{ item.name }}</span>
                  </router-link>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent
                    side="right"
                    :side-offset="12"
                    class="z-50 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#1A170F] text-[#FAF6F1] shadow-xl border border-[#3D352E] select-none animate-in fade-in-0 zoom-in-95 pointer-events-none"
                  >
                    <span>{{ item.name }}</span>
                    <TooltipArrow class="fill-[#1A170F]" />
                  </TooltipContent>
                </TooltipPortal>
              </TooltipRoot>
            </template>
          </template>
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

        <TooltipRoot :disabled="!rail">
          <TooltipTrigger as-child>
            <button
              type="button"
              class="w-full py-2 px-3 rounded-xl bg-[#FEE2E2]/70 text-[#DC2626] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#FEE2E2] transition cursor-pointer"
              @click="handleLogout"
              aria-label="Sign Out"
            >
              <LogOut class="w-4 h-4" />
              <span v-if="!rail">Sign Out</span>
            </button>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              side="right"
              :side-offset="12"
              class="z-50 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#1A170F] text-[#FAF6F1] shadow-xl border border-[#3D352E] select-none animate-in fade-in-0 zoom-in-95 pointer-events-none"
            >
              <span>Sign Out</span>
              <TooltipArrow class="fill-[#1A170F]" />
            </TooltipContent>
          </TooltipPortal>
        </TooltipRoot>
      </div>
    </aside>
  </TooltipProvider>

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
          <PeriodSelector />

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
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
} from 'reka-ui';
import { useAuthStore } from '../stores/auth';
import PeriodSelector from './PeriodSelector.vue';
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
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const rail = ref(false);

const navSections = computed(() => [
  {
    title: 'Applications',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Products', path: '/products', icon: Shirt, permission: 'products.read' },
      { name: 'Categories', path: '/categories', icon: Layers, permission: 'categories.read' },
      { name: 'Inventory', path: '/inventory', icon: Boxes, permission: 'products.read' },
      { name: 'Orders Pipeline', path: '/orders', icon: ClipboardList, permission: 'orders.read' },
      { name: 'Customers', path: '/customers', icon: Users, permission: 'orders.read' },
    ],
  },
  {
    title: 'Communications',
    items: [
      { name: 'Contact Inbox', path: '/messages', icon: MessageSquare, permission: 'messages.read' },
    ],
  },
  {
    title: 'System & Audit',
    items: [
      { name: 'Sales Analytics', path: '/analytics', icon: TrendingUp, permission: 'analytics.read' },
      { name: 'Store Settings', path: '/settings', icon: Settings, permission: 'settings.read' },
      { name: 'Users & Roles', path: '/users', icon: Shield, permission: 'users.read' },
      { name: 'Activity Logs', path: '/activity-logs', icon: History, permission: 'activity_logs.read' },
    ],
  },
]);

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
