<script setup>
    defineProps({
        tasks: Array
    })
</script>
 
<template>

    <h1 class="text-center text-2xl  bg-black bg-clip-content">IT-Bangmod Kradan Kanban SSI-3</h1>
<div>
    <table class="border-collapse bg-white border w-full  " >
        <thead>
            <tr class=" text-black bg-gray-400 ">
                <th></th>
                <th>Title</th>
                <th>Assignees</th>
                <th>Status</th>
            </tr>
            <tr v-for="(task,index) in tasks" :key="index">
                <td class="text-black text-center" >{{ task.taskId }}</td>
                <td class="text-blue-400" >{{ task.taskTitle }}</td>
                <td class="text-black">{{ task.assignees }}</td>
                <td class="bg-green-500/60 bg-left bg-clip-content rounded-full size-1  text-black">{{ task.status }}</td>
            </tr>
        </thead>
    </table>
</div>
</template>
 
<style scoped>


td {

    padding: 24px;
  border:3px black solid;

}
 th {
    padding: 12px;
  border:3px black solid;
 }



</style>    