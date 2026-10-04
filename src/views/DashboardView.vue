<script setup>
import Sidebar from '../components/layout/Sidebar.vue';
import Header from '../components/layout/Header.vue';

const status = ['active', 'btn', 'btn', 'btn', 'btn'];

</script>

<template>
    <div class="dashboard">
        <Sidebar :status="status" />
        <div class="content">
            <Header title="Visión General del Proyecto" />
            <router-view />
        </div>

    </div>
</template>

<style scoped>

    .dashboard {
        display: flex;
        flex-direction: row;
        height: 100vh;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

</style>