const token = "019dc8bf-36f0-7000-8888-483417b68351";

fetch("http://localhost:3001/api/users/logout", {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => res.json().then(data => ({ status: res.status, data })))
.then(console.log)
.catch(console.error);
