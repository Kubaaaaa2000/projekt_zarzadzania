<script setup>
    const user = useSupabaseUser();
    console.log(user)
</script>
<template>

     <div class="flex flex-col items-center justify-center gap-4 p-4 h-full">
        <UPageCard class="w-full max-w-md text-center">
          <h1>{{user.email}}</h1>
          <UButton
            color ="success"
          >
          
          </UButton>
        </UPageCard>
    </div>
   
</template>