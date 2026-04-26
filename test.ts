const name = "A".repeat(300);
const body = {
  name: name,
  email: "test300@example.com",
  password: "password123"
};

fetch("http://localhost:3001/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(body)
})
.then(res => res.json().then(data => ({ status: res.status, data })))
.then(console.log)
.catch(console.error);
