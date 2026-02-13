export default [
  {
    path: "/composer",
    name: "Composer",
    meta: {
      requiresAuth: true,
      rootPage: "posts",
      title: "1Kole - Compor",
    },
    component: () => import("./views/Composer.vue"),
  }
];
