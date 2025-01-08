module.exports = {
  apps: [
    {
      name: "slidev-example",
      script: "pnpm",
      args: "slidev content/slides/example/slides.md --port 3030",
      watch: ["content/slides/example"],
    },
    // Add more presentations here as needed
  ],
};
