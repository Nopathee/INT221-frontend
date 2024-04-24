<script setup>
    defineProps({
        tasks: Array
    })
</script>
 
<template>
<div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Assignees</th>
                <th>Status</th>
            </tr>
            <tr v-for="(task,index) in tasks" :key="index">
                <td>{{ task.taskId }}</td>
                <td>{{ task.taskTitle }}</td>
                <td>{{ task.assignees }}</td>
                <td>{{ task.status }}</td>
            </tr>
        </thead>
    </table>
</div>
</template>
 
<style scoped>

</style>    