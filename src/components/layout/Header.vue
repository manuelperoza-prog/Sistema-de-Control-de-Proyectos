<script setup>

    defineProps({
        title: {
            type: String,
            required: true
        }
    });

</script>

<template>
    <div class="header">
        <h1 class="title">{{ title }}</h1>
        <img class="logo" src="/public/favicon.png" alt="Logo">
    </div>
</template>

<style scoped>

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5vh;
        background-color: var(--c-bg-header);
        border-bottom: 1px solid var(--c-bg-card);
    }

    .title {
        color: var(--c-text-main);
        font-family: var(--t-title-font);
    }

    .logo {
        height: 50px;
    }

</style>    