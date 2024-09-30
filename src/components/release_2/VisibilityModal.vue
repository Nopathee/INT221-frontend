<template>
    <div class="itbkk-modal-alert" v-if="isOpen">
        <div class="itbkk-message">
            <h2>Board visibility changed!</h2>
            <p>
                In public, any one can view the board, task list and task detail of tasks in the board. Do you want to
                change the visibility to Public?
            </p>
            <div class="button-container">
                <button class="itbkk-button-cancel" @click="onClose">Cancel</button>
                <button class="itbkk-button-confirm" @click="onConfirm">Confirm</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: {
            type: Boolean,
            required: true
        },
        boardId: {  
            type: Number,
            required: true
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
        onConfirm() {
            console.log("Confirm button clicked"); 
            console.log("Board ID:", this.boardId); 
            this.onClose(); 
        }
    }
};
</script>

<style scoped>
.itbkk-modal-alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.itbkk-message {
    background-color: black;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 100%;
    color: white;
}

h2 {
    margin: 0 0 10px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.itbkk-button-cancel,
.itbkk-button-confirm {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.itbkk-button-cancel {
    background-color: #f44336;
    color: white;
}

.itbkk-button-confirm {
    background-color: #4CAF50;
    color: white;
    margin-left: 10px;
}
</style>