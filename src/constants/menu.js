const data = [
  {
    id: "dashboard",
    icon: "iconsminds-air-balloon-1",
    label: "menu.dashboard",
    to: "/app/dashboard"
  },
  {
    id: "sites",
    icon: "simple-icon-layers",
    label: "menu.sites",
    to: "/app/sites",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.second",
        to: "/app/sites/second"
      }
    ]
  },
  {
    id: "migrations",
    icon: "iconsminds-arrow-merge",
    label: "menu.migrations",
    to: "/app/migrations"
  },
  {
    id: "dns",
    icon: "iconsminds-laptop-3",
    label: "menu.dns",
    to: "/app/dns"
  },
  {
    id: "analytics",
    icon: "iconsminds-monitor-analytics",
    label: "menu.analytics",
    to: "/app/analytics"
  },
  {
    id: "billings",
    icon: "iconsminds-billing",
    label: "menu.billings",
    to: "/app/billings"
  },
  {
    id: "users",
    icon: "simple-icon-user-follow",
    label: "menu.users",
    to: "/app/users"
  },
  {
    id: "activity_log",
    icon: "simple-icon-eye",
    label: "menu.activity-log",
    to: "/app/activity_log"
  },
  {
    id: "knowledge_base",
    icon: "iconsminds-library",
    label: "menu.knowledge-base",
    to: "https://gogo-react-docs.coloredstrategies.com/",
    newWindow:true
  }
];
export default data;
