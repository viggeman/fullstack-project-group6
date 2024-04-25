<template>
  <div class="container">
    <h1 v-for="items in getData">
      {{ items.writerName }} + ID {{ items.writerId }}
    </h1>
    <div style="border: 1px solid black">
      <h1>Post writer</h1>
      <p v-if="errors.postError" style="color: red">{{ errors.postError }}</p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <input type="text" v-model="postInput" />
      <input type="submit" @click="postSubmit" />
    </div>

    <div style="border: 1px solid black">
      <h1>Delete writer</h1>
      <p v-if="errors.deleteError" style="color: red">
        {{ errors.deleteError }}
      </p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <select v-model="deleteSelected">
        <option
          v-for="items in getData"
          :key="items.writerId"
          :value="items.writerId"
        >
          {{ items.writerName }}
        </option>
      </select>
      <input disabled type="text" v-model="deleteSelected" />
      <input type="submit" @click="deleteSubmit" />
    </div>

    <div style="border: 1px solid black">
      <h1>Put writer</h1>
      <p v-if="errors.putError" style="color: red">{{ errors.putError }}</p>
      <p v-if="response.success" style="color: green">{{ response.message }}</p>
      <select v-model="putSelected">
        <option
          v-for="items in getData"
          :key="items.writerId"
          :value="items.writerId"
        >
          {{ items.writerName }}
        </option>
      </select>
      <input type="text" v-model="putNewEntry" />
      <input type="submit" @click="putSubmit" />
    </div>
  </div>
</template>

<script>
  import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
  import {
    fetchData,
    postData,
    putData,
    deleteData,
  } from '../services/crud.js';

  export default {
    name: 'FetchWriter',
    setup() {
      const url = 'http://localhost:3000/api/writers/';
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
        const dataPost = await postData(url, { writerName: postInput.value });
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
          writerName: putNewEntry.value,
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
          (item) => item.writerId === id.value
        ).writerName;
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
            message: `${dataDelete.message}! Writer ${removed} is removed!`,
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
  /* Your component's CSS styles go here */
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    margin-bottom: 5px;
  }

  input[type='text'],
  select {
    margin-bottom: 10px;
    padding: 5px;
    width: 200px;
  }

  input[type='submit'] {
    padding: 5px 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  input[type='submit']:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
