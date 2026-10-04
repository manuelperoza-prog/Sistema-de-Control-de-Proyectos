<script setup>

    defineProps({
        label: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'btn'
        }
    });

</script>

<template>

        <button v-bind:class="status">{{ label }}</button>

</template>

<style scoped>
.btn, .active {
    width: 100%;
    padding: 18px 20px; 
    color: var(--c-text-main);
    border: none;
    border-bottom: 1px solid var(--c-bg-card);
    cursor: pointer;
    text-align: center;
    font-size: 1rem;
    box-sizing: border-box;
    display: block;
    margin: 0;
    font-family: var(--t-subtitle-font);
    
    transition: 
        background-color 0.4s ease, 
        padding-left 0.4s ease,
        border-left 0.3s ease;
        
    border-left: 0px solid transparent;
}

.btn {
    background-color: transparent;
}

.btn:hover:not(.active) {
    background-color: var(--c-bg-card);
    padding-left: 30px; 
}

.active {
    background-color: var(--c-secondary);
    border-left: 5px solid var(--c-primary);
    padding-left: 25px; 
}

.active:hover {
    padding-left: 30px; 
}

.btn:active, .active:active {
    transform: scale(0.98);
}
</style>