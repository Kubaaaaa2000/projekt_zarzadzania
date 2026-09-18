<!-- <template>
  <div>
    <UPageHero
      title="Nuxt Starter Template"
      description="A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours."
      :links="[{
        label: 'Get started',
        to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
        target: '_blank',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'Use this template',
        to: 'https://github.com/nuxt-ui-templates/starter',
        target: '_blank',
        icon: 'i-simple-icons-github',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    />

    <UPageSection
      id="features"
      title="Everything you need to build modern Nuxt apps"
      description="Start with a solid foundation. This template includes all the essentials for building production-ready applications with Nuxt UI's powerful component system."
      :features="[{
        icon: 'i-lucide-rocket',
        title: 'Production-ready from day one',
        description: 'Pre-configured with TypeScript, ESLint, Tailwind CSS, and all the best practices. Focus on building features, not setting up tooling.'
      }, {
        icon: 'i-lucide-palette',
        title: 'Beautiful by default',
        description: 'Leveraging Nuxt UI\'s design system with automatic dark mode, consistent spacing, and polished components that look great out of the box.'
      }, {
        icon: 'i-lucide-zap',
        title: 'Lightning fast',
        description: 'Optimized for performance with SSR/SSG support, automatic code splitting, and edge-ready deployment. Your users will love the speed.'
      }, {
        icon: 'i-lucide-blocks',
        title: '100+ components included',
        description: 'Access Nuxt UI\'s comprehensive component library. From forms to navigation, everything is accessible, responsive, and customizable.'
      }, {
        icon: 'i-lucide-code-2',
        title: 'Developer experience first',
        description: 'Auto-imports, hot module replacement, and TypeScript support. Write less boilerplate and ship more features.'
      }, {
        icon: 'i-lucide-shield-check',
        title: 'Built for scale',
        description: 'Enterprise-ready architecture with proper error handling, SEO optimization, and security best practices built-in.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to build your next Nuxt app?"
        description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
        variant="subtle"
        :links="[{
          label: 'Start building',
          to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
          target: '_blank',
          trailingIcon: 'i-lucide-arrow-right',
          color: 'neutral'
        }, {
          label: 'View on GitHub',
          to: 'https://github.com/nuxt-ui-templates/starter',
          target: '_blank',
          icon: 'i-simple-icons-github',
          color: 'neutral',
          variant: 'outline'
        }]"
      />
    </UPageSection>
  </div>
</template> -->


<script setup lang="ts">
  import type { NavigationMenuItem, SidebarProps,FormSubmitEvent, AuthFormField } from '@nuxt/ui'
  //import * as z from 'zod'


  // Ignore the props for the example
  // defineProps<Pick<SidebarProps, 'mode'>>()

  const open = ref(true)

  const items: NavigationMenuItem[] = [{
    label: 'Home',
    icon: 'i-lucide-house',
    active: true
  }, {
    label: 'Inbox',
    icon: 'i-lucide-inbox',
    badge: '4'
  }, {
    label: 'Contacts',
    icon: 'i-lucide-users'
  }]
  const colorMode = useColorMode()

  function toggleColor() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }



  

const toast = useToast()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'mail',
  label: 'E-mail',
  placeholder: 'Enter your E-mail',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}, {
  name: 'remember',
  label: 'Remember me',
  type: 'checkbox'
}]

</script>

<template>
  <UApp>
    <UHeader  title="Witamy na E-Wyścia" class=" bg-blue-400 dark:bg-blue-900" >
      <template #left>
          <!-- <img src="LOGO_SZKOŁY.png" alt="logo"> -->
          <!-- <img src="" class=" h-min w-min " alt="logo"> -->
      </template>
      <template #right>
        <UButton 
          :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'" 
          color="neutral" 
          variant="ghost" 
          @click="toggleColor"
        />
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </template>
    </UHeader>

    <UMain class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
       
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
  <NuxtLink to="/klasy">uzytkownicy</NuxtLink>
      <NuxtLayout>
        
      </NuxtLayout>
      <USidebar v-model:open="open" :mode="mode" title="Navigation">
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </USidebar>

       

    </UMain>


    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          Copyright © {{ new Date().getFullYear() }}
        </p>
      </template>
    </UFooter>
  </UApp>
  
</template>