import React, { useState } from 'react'
import axios from "axios";

export const hookAxios = () => {

  //!AXIOS URL PETICION GET
  const peticionGet = (baseURL, params = null) => {
    return new Promise((resolve, reject) => {
      axios.get(baseURL, params)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  //!AXIOS URL PETICION POST
  /* const peticionPost =(baseURL, params)=>{
    console.log(baseURL, params)
    return new Promise((resolve,reject)=>{
      axios.post(baseURL, params)
      .then(response=>{
        resolve(response.data);
      }).catch(error=>{
        console.error(error)
        reject(error)
      })
    })
  } */
  const peticionPost = (baseURL, body) => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(body),
      timeout: 5000 
    };
    return new Promise((resolve, reject) => {
      axios.request(config)
        .then(response => {
          resolve(response.data);
        }).catch(error => {
          console.log("error")
          reject(error)
        })
    })
  }

  //!PETICION DELETE
  const peticionDelete = (baseURL, body) => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(body)
    };
    return new Promise((resolve,reject) => {
      axios.request(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error)
          console.log("error", error);
        });
    })
  }

  //!PETICION 
  const peticionPut = (baseURL, body) => {
    let config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: baseURL,
      headers: { 
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(body)
    };
    return new Promise((resolve,reject) => {
      axios.request(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error)
          console.log("error", error);
        });
    })
  }

  return (
    {
      peticionGet,
      peticionPost,
      peticionDelete,
      peticionPut
    }
  )
}



/* const client = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com" 
  });

  const verificarUsuario=async()=>{
    const response =await client.get("/post/1")
        .then((response)=>{
            validandoUsuario(response.data);
        })
        .catch((error)=>{
            setError(error); 
        })    
} */
