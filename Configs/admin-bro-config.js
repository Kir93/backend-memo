const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroSequelize = require('admin-bro-sequelizejs');
const db = require('./models');

const app = express();

const ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

AdminBro.registerAdapter(AdminBroSequelize);
const adminBro = new AdminBro({
    databases: [db],
    branding: {
        companyName: 'People',
    },
});

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      if (ADMIN.password === password && ADMIN.email === email) {
        return ADMIN
      }
      return null
    },
    cookieName: 'adminbro',
    cookiePassword: 'somepassword',
  })

app.use(adminBro.options.rootPath, router);

app.listen(3065, () => {
    console.log('server is running on http://localhost:3065');
});
