export const employees = [
  { id: "EMP001", name: "Alex Johnson",   avatar: "AJ", email: "alex.johnson@sumx.io",   phone: "(415) 202-3344", role: "Frontend Engineer", department: "Engineering", status: "Active",   salary: 95000,  performanceScore: 88, isRemote: true,  joinDate: "2022-03-14" },
  { id: "EMP002", name: "Maria Garcia",   avatar: "MG", email: "maria.garcia@sumx.io",   phone: "(212) 555-7890", role: "Product Manager",   department: "Product",     status: "Active",   salary: 110000, performanceScore: 92, isRemote: false, joinDate: "2021-07-01" },
  { id: "EMP003", name: "David Chen",     avatar: "DC", email: "david.chen@sumx.io",     phone: "(650) 333-1122", role: "Backend Engineer",  department: "Engineering", status: "On Leave", salary: 98000,  performanceScore: 79, isRemote: true,  joinDate: "2023-01-10" },
  { id: "EMP004", name: "Sarah Williams", avatar: "SW", email: "sarah.williams@sumx.io", phone: "(718) 444-6655", role: "UX Designer",       department: "Design",      status: "Active",   salary: 88000,  performanceScore: 95, isRemote: false, joinDate: "2022-09-20" },
  { id: "EMP005", name: "James Miller",   avatar: "JM", email: "james.miller@sumx.io",   phone: "(312) 666-9870", role: "Data Analyst",      department: "Analytics",   status: "Active",   salary: 82000,  performanceScore: 84, isRemote: true,  joinDate: "2023-04-05" },
  { id: "EMP006", name: "Priya Patel",    avatar: "PP", email: "priya.patel@sumx.io",    phone: "(408) 777-2200", role: "DevOps Engineer",   department: "Engineering", status: "Inactive", salary: 105000, performanceScore: 71, isRemote: false, joinDate: "2020-11-18" },
  { id: "EMP007", name: "Carlos Torres",  avatar: "CT", email: "carlos.torres@sumx.io",  phone: "(305) 888-4411", role: "Sales Executive",   department: "Sales",       status: "Active",   salary: 75000,  performanceScore: 90, isRemote: false, joinDate: "2024-01-02" },
  { id: "EMP008", name: "Yuki Tanaka",    avatar: "YT", email: "yuki.tanaka@sumx.io",    phone: "(503) 999-5522", role: "QA Engineer",       department: "Engineering", status: "Active",   salary: 79000,  performanceScore: 82, isRemote: true,  joinDate: "2023-08-15" },
  { id: "EMP009", name: "Nina Rossi",     avatar: "NR", email: "nina.rossi@sumx.io",     phone: "(617) 100-7733", role: "Marketing Lead",    department: "Marketing",   status: "Active",   salary: 91000,  performanceScore: 87, isRemote: false, joinDate: "2021-05-22" },
  { id: "EMP010", name: "Omar Hassan",    avatar: "OH", email: "omar.hassan@sumx.io",    phone: "(202) 200-8844", role: "Security Analyst",  department: "Engineering", status: "On Leave", salary: 102000, performanceScore: 76, isRemote: true,  joinDate: "2022-12-01" },
];

export const statCards = [
  { label: "Total Employees", value: "248",     change: "+12%", trend: "up",   icon: "Users"       },
  { label: "Active Today",    value: "194",     change: "+3%",  trend: "up",   icon: "Activity"    },
  { label: "On Leave",        value: "18",      change: "-5%",  trend: "down", icon: "Calendar"    },
  { label: "Avg. Salary",     value: "$92,400", change: "+8%",  trend: "up",   icon: "DollarSign"  },
];

export const DEPARTMENTS = ["Engineering", "Product", "Design", "Analytics", "Sales", "Marketing"];
export const STATUSES    = ["Active", "Inactive", "On Leave"];
export const ROLES = [
  "Frontend Engineer", "Backend Engineer", "DevOps Engineer", "QA Engineer",
  "Product Manager", "UX Designer", "Data Analyst", "Sales Executive",
  "Marketing Lead", "Security Analyst",
];
