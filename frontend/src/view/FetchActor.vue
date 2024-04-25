<template>
    <div class="container">
        <div class="actor-section">
            <h1 v-for="item in getData" :key="item.actorId">
                {{ item.actorName }} (ID: {{ item.actorId }})
            </h1>
        </div>

        <div class="actor-section">
            <h1>Post actor</h1>
            <p v-if="errors.postError" class="error-message">
                {{ errors.postError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <div class="input-section">
                <input
                    type="text"
                    v-model="postInput"
                    placeholder="Enter actor name"
                    class="input-field small-input"
                />
                <button @click="postSubmit" class="submit-button">
                    Submit
                </button>
            </div>
        </div>

        <div class="actor-section">
            <h1>Delete actor</h1>
            <p v-if="errors.deleteError" class="error-message">
                {{ errors.deleteError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <div class="input-section">
                <select v-model="deleteSelected" class="select-field">
                    <option
                        v-for="item in getData"
                        :key="item.actorId"
                        :value="item.actorId"
                    >
                        {{ item.actorName }} (ID: {{ item.actorId }})
                    </option>
                </select>
                <button @click="deleteSubmit" class="submit-button">
                    Delete
                </button>
            </div>
        </div>

        <div class="actor-section">
            <h1>Put actor</h1>
            <p v-if="errors.putError" class="error-message">
                {{ errors.putError }}
            </p>
            <p v-if="response.success" class="success-message">
                {{ response.message }}
            </p>
            <div class="input-section">
                <select v-model="putSelected" class="select-field">
                    <option
                        v-for="item in getData"
                        :key="item.actorId"
                        :value="item.actorId"
                    >
                        {{ item.actorName }} (ID: {{ item.actorId }})
                    </option>
                </select>
                <input
                    type="text"
                    v-model="putNewEntry"
                    placeholder="Enter new actor name"
                    class="input-field small-input"
                />
                <button @click="putSubmit" class="submit-button">Update</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { fetchData, postData, putData, deleteData } from '../services/crud.js';

export default {
    name: 'Fetchactor',
    setup() {
        const url = 'http://localhost:3000/api/actors/';
        const id = ref(null);

        const postInput = ref('');
        const putSelected = ref(null);
        const getData = ref(null);
        const errors = ref({
            postError: '',
            getError: '',
            putError: '',
            deleteError: '',
        });
        const response = ref({
            success: null,
            message: '',
        });
        const putNewEntry = ref('');
        const deleteSelected = ref(null);

        const fetchDataAsync = async () => {
            getData.value = await fetchData(url);
        };

        onMounted(fetchDataAsync);

        const postSubmit = async () => {
            if (postInput.value.trim() === '') {
                errors.value.postError = 'Please enter a name';
                console.log(errors.value.postError);
                return errors.value.postError;
            }
            const dataPost = await postData(url, {
                actorName: postInput.value,
            });
            if (dataPost.success) {
                postInput.value = '';
                response.value = {
                    success: dataPost.success,
                    message: dataPost.message,
                };
                errors.value.postError = '';
                fetchDataAsync();
                console.log('dataPost', dataPost);
                return dataPost;
            } else {
                response.value = {
                    success: dataPost.success,
                    message: dataPost.message,
                };
                errors.value.postError = '';
                return dataPost;
            }
        };

        const putSubmit = async () => {
            if (putNewEntry.value.trim() === '' || putSelected.value === null) {
                errors.value.putError = 'Please select a name';
                console.log(errors.value.putError);
                return errors.value.putError;
            }
            id.value = putSelected.value;
            putNewEntry.value = putNewEntry.value;
            console.log(putSelected.value);
            const dataPut = await putData(url, {
                id: id.value,
                actorName: putNewEntry.value,
            });
            if (dataPut.success) {
                putNewEntry.value = '';
                response.value = {
                    success: dataPut.success,
                    message: `Suceess: ${dataPut.message}, name: ${dataPut.name}`,
                };
                errors.value.putError = '';
                fetchDataAsync();
                console.log('dataPut', dataPut);
                return dataPut;
            } else {
                response.value = {
                    success: dataPut.success,
                    message: `Error: ${dataPut.message}`,
                };
                errors.value.putError = '';
                console.log(dataPut);
                return dataPut;
            }
        };

        const deleteSubmit = async () => {
            id.value = deleteSelected.value;
            const removed = getData.value.find(
                (item) => item.actorId === id.value
            ).actorName;
            if (id.value === null) {
                errors.value.deleteError = 'Please select a name';
                console.log(errors.value.deleteError);
                return errors.value.deleteError;
            }
            const dataDelete = await deleteData(url, { id: id.value });
            if (dataDelete.success) {
                console.log(removed);
                response.value = {
                    success: dataDelete.success,
                    message: `${dataDelete.message}! actor ${removed} is removed!`,
                };
                errors.value.deleteError = '';
                fetchDataAsync();
                console.log('dataDelete', dataDelete);
                return dataDelete;
            } else {
                response.value = {
                    success: dataDelete.success,
                    message: dataDelete.message,
                };
                errors.value.deleteError = '';
                console.log(dataDelete);
                return dataDelete;
            }
        };

        // const dataDelete = deleteData(url, { id: id });
        // console.log(dataDelete);

        return {
            // Your component's data, methods, and computed properties go here
            getData,
            postInput,
            errors,
            response,
            putSelected,
            putNewEntry,
            deleteSelected,
            postSubmit,
            putSubmit,
            deleteSubmit,
        };
    },
};
</script>

<style scoped>
.container {
    background-color: black;
    background-image: radial-gradient(rgba(0, 150, 0, 0.75), black 120%);
    height: 100vh;
    margin: 0;
    overflow: hidden;
    padding: 2rem;
    color: white;
    font: 1.3rem Inconsolata, monospace;
    text-shadow: 0 0 5px #c8c8c8;
    position: relative;
}

.actor-section {
    padding: 10px;
}

.actor-section h1 {
    font-size: 16px;
}

.input-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
}

.input-field,
.select-field {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #fff;
    background-color: #000;
    color: #fff;
    width: 50%;
    font-family: Inconsolata, monospace; /* Tillämpa samma font som på resten av komponenten */
}

.small-input {
    width: 50%;
}

.input-field::placeholder,
.select-field option {
    color: #888;
}

.submit-button {
    padding: 5px 10px;
    border: 1px solid #fff;
    background-color: #888;
    color: #000;
    cursor: pointer;
}

.error-message {
    color: #ff6347;
}

.success-message {
    color: #32cd32;
}

.container::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.15),
        rgba(255, 255, 255, 0.15) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
}
</style>
