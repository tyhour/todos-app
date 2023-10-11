/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sequelize"],
  },
  serverRuntimeConfig: {
    // Custom server settings
    cors: {
      // Define CORS options here
      origin:
        "https://stackblitzstarterskvefgd-ygqz--3000--7a1fe16d.local-corp.webcontainer.io", // Replace with the origin you want to allow
      methods: "GET,POST,PUT,DELETE",
      credentials: true, // You may need this if your requests include credentials (e.g., cookies)
    },
  },
};

module.exports = nextConfig;
