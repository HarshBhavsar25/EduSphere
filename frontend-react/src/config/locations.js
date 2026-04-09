/**
 * ⭐ MASTER LOCATION CONFIG — PESMCE Modern College of Engineering, Pune
 *
 * Single source of truth for BOTH:
 *   → 2D Floor Plan (position2D used for absolute-positioned boxes)
 *   → 3D Three.js View (meshName used to find/color meshed)
 *
 * Canvas size per floor: 580px wide × 760px tall
 *   A Wing: x: 0–220  (vertical strip, left side)
 *   B Wing: x: 220–580 (horizontal strip, bottom)
 *
 * Coordinates extracted from real floor plan photos.
 */

// ─── Floor Metadata ─────────────────────────────────────────────────────────
export const FLOORS = [
  { id: 0, name: "Ground Floor", label: "GF" },
  { id: 1, name: "First Floor",  label: "1F" },
  { id: 2, name: "Second Floor", label: "2F" },
  { id: 3, name: "Third Floor",  label: "3F" },
  { id: 4, name: "Fourth Floor", label: "4F" },
];

// ─── Canvas Layout Constants ─────────────────────────────────────────────────
export const CANVAS = { width: 580, height: 760 };

// ─── All Locations ────────────────────────────────────────────────────────────
export const LOCATIONS = [

  // ══════════════════════════════════════════════════════════════════════
  //  GROUND FLOOR — A Wing (vertical, left side)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "workshop",     name: "Workshop",           floor: 0, capacity: 60,
    department: "Mechanical",   type: "Lab",
    meshName: "workshop",
    position2D: { x: 10,  y: 10,  width: 200, height: 65 }
  },
  {
    id: "pegasus",      name: "PEGASUS",            floor: 0, capacity: 40,
    department: "General",      type: "Room",
    meshName: "pegasus",
    position2D: { x: 10,  y: 80,  width: 60,  height: 60 }
  },
  {
    id: "g02",          name: "CAD Lab 1",          floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g02",
    position2D: { x: 75,  y: 150, width: 65,  height: 55 }
  },
  {
    id: "g03",          name: "CAD Lab 2",          floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g03",
    position2D: { x: 75,  y: 210, width: 65,  height: 55 }
  },
  {
    id: "g04",          name: "Meeting Room",       floor: 0, capacity: 20,
    department: "Admin",        type: "Room",
    meshName: "g04",
    position2D: { x: 145, y: 150, width: 65,  height: 55 }
  },
  {
    id: "g05",          name: "CAD Lab 3",          floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g05",
    position2D: { x: 75,  y: 270, width: 65,  height: 55 }
  },
  {
    id: "g06",          name: "CAD Lab 4",          floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g06",
    position2D: { x: 75,  y: 330, width: 65,  height: 55 }
  },
  {
    id: "g07",          name: "Faculty Room",       floor: 0, capacity: 20,
    department: "Mechanical",   type: "Faculty",
    meshName: "g07",
    position2D: { x: 145, y: 210, width: 65,  height: 55 }
  },
  {
    id: "g09",          name: "HOD Cabin (ME)",     floor: 0, capacity: 10,
    department: "Mechanical",   type: "Admin",
    meshName: "g09",
    position2D: { x: 145, y: 270, width: 65,  height: 55 }
  },
  {
    id: "g10",          name: "HVAC Lab",           floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g10",
    position2D: { x: 75,  y: 390, width: 65,  height: 55 }
  },
  {
    id: "g11",          name: "Heat & Mass Lab",    floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g11",
    position2D: { x: 75,  y: 450, width: 65,  height: 55 }
  },
  {
    id: "g12",          name: "Thermodynamics Lab", floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g12",
    position2D: { x: 145, y: 330, width: 65,  height: 115 }
  },
  {
    id: "g13",          name: "Turbo Machinery Lab",floor: 0, capacity: 30,
    department: "Mechanical",   type: "Lab",
    meshName: "g13",
    position2D: { x: 115, y: 510, width: 25,  height: 55 }
  },
  {
    id: "g14",          name: "Boiler Room",        floor: 0, capacity: 20,
    department: "Mechanical",   type: "Lab",
    meshName: "g14",
    position2D: { x: 75,  y: 510, width: 35,  height: 55 }
  },
  {
    id: "g14a",         name: "Energy Engg Lab",    floor: 0, capacity: 30,
    department: "Mechanical",   type: "Lab",
    meshName: "g14a",
    position2D: { x: 145, y: 450, width: 65,  height: 55 }
  },
  {
    id: "g15",          name: "DG Trial Room",      floor: 0, capacity: 20,
    department: "Mechanical",   type: "Lab",
    meshName: "g15",
    position2D: { x: 10,  y: 575, width: 60,  height: 55 }
  },
  {
    id: "g16",          name: "Engg Metallurgy Lab",floor: 0, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "g16",
    position2D: { x: 145, y: 510, width: 65,  height: 55 }
  },
  {
    id: "g18",          name: "Room G18",           floor: 0, capacity: 30,
    department: "General",      type: "Room",
    meshName: "g18",
    position2D: { x: 10,  y: 635, width: 60,  height: 55 }
  },
  {
    id: "activity_ctr", name: "Activity Center",    floor: 0, capacity: 100,
    department: "General",      type: "Hall",
    meshName: "activity_ctr",
    position2D: { x: 75,  y: 595, width: 135, height: 60 }
  },
  {
    id: "canteen",      name: "College Canteen",    floor: 0, capacity: 200,
    department: "General",      type: "Canteen",
    meshName: "canteen",
    position2D: { x: 10,  y: 695, width: 130, height: 55 }
  },

  // ── Ground Floor — B Wing (bottom right) ────────────────────────────────
  {
    id: "g20_23",       name: "Parking (G20–23)",  floor: 0, capacity: 0,
    department: "General",      type: "Parking",
    meshName: "g20_23",
    position2D: { x: 230, y: 590, width: 120, height: 80 }
  },
  {
    id: "g24",          name: "Faculty Room",       floor: 0, capacity: 20,
    department: "General",      type: "Faculty",
    meshName: "g24",
    position2D: { x: 360, y: 590, width: 60,  height: 55 }
  },
  {
    id: "g25",          name: "Classroom G25",      floor: 0, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "g25",
    position2D: { x: 360, y: 650, width: 60,  height: 55 }
  },
  {
    id: "g26",          name: "Classroom G26",      floor: 0, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "g26",
    position2D: { x: 425, y: 650, width: 60,  height: 55 }
  },
  {
    id: "g26a",         name: "Counselling Room",   floor: 0, capacity: 30,
    department: "Admin",        type: "Room",
    meshName: "g26a",
    position2D: { x: 425, y: 590, width: 60,  height: 55 }
  },
  {
    id: "g27",          name: "Classroom G27",      floor: 0, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "g27",
    position2D: { x: 490, y: 650, width: 60,  height: 55 }
  },
  {
    id: "g28",          name: "Classroom G28",      floor: 0, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "g28",
    position2D: { x: 425, y: 710, width: 60,  height: 40 }
  },
  {
    id: "g29",          name: "Classroom G29",      floor: 0, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "g29",
    position2D: { x: 360, y: 710, width: 60,  height: 40 }
  },
  {
    id: "sport_dept",   name: "Dept Sport & PE",   floor: 0, capacity: 40,
    department: "Sports",       type: "Room",
    meshName: "sport_dept",
    position2D: { x: 490, y: 590, width: 80,  height: 115 }
  },

  // ══════════════════════════════════════════════════════════════════════
  //  FIRST FLOOR — A Wing
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "102",          name: "ME Lab",             floor: 1, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "102",
    position2D: { x: 10,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "101",          name: "Seminar Hall",       floor: 1, capacity: 120,
    department: "General",      type: "Seminar",
    meshName: "101",
    position2D: { x: 80,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "105",          name: "Faculty Room",       floor: 1, capacity: 20,
    department: "Mechanical",   type: "Faculty",
    meshName: "105",
    position2D: { x: 150, y: 10,  width: 65,  height: 55 }
  },
  {
    id: "103",          name: "Mechatronics Lab",   floor: 1, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "103",
    position2D: { x: 10,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "104",          name: "Faculty Room",       floor: 1, capacity: 20,
    department: "Mechanical",   type: "Faculty",
    meshName: "104",
    position2D: { x: 80,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "107",          name: "Fluid Mechanics Lab",floor: 1, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "107",
    position2D: { x: 10,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "106",          name: "KOM Lab",            floor: 1, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "106",
    position2D: { x: 80,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "109e",         name: "Power System Lab",   floor: 1, capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "109e",
    position2D: { x: 10,  y: 190, width: 65,  height: 55 }
  },
  {
    id: "108",          name: "Classroom",          floor: 1, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "108",
    position2D: { x: 80,  y: 190, width: 65,  height: 55 }
  },
  {
    id: "109d",         name: "UPS Section",        floor: 1, capacity: 10,
    department: "Electrical",   type: "Room",
    meshName: "109d",
    position2D: { x: 10,  y: 250, width: 65,  height: 35 }
  },
  {
    id: "109c",         name: "Computer Lab 6",     floor: 1, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "109c",
    position2D: { x: 10,  y: 290, width: 65,  height: 55 }
  },
  {
    id: "109b",         name: "Computer Lab 5",     floor: 1, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "109b",
    position2D: { x: 80,  y: 250, width: 65,  height: 55 }
  },
  {
    id: "109a",         name: "Seminar Hall",       floor: 1, capacity: 120,
    department: "General",      type: "Seminar",
    meshName: "109a",
    position2D: { x: 150, y: 190, width: 65,  height: 115 }
  },
  {
    id: "111",          name: "Faculty Room",       floor: 1, capacity: 20,
    department: "Electrical",   type: "Faculty",
    meshName: "111",
    position2D: { x: 10,  y: 350, width: 65,  height: 55 }
  },
  {
    id: "110",          name: "Classroom",          floor: 1, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "110",
    position2D: { x: 80,  y: 310, width: 65,  height: 55 }
  },
  {
    id: "112",          name: "Elec Machines I Lab",floor: 1, capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "112",
    position2D: { x: 80,  y: 370, width: 135, height: 55 }
  },
  {
    id: "114",          name: "Basic EEE Lab",      floor: 1, capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "114",
    position2D: { x: 10,  y: 430, width: 65,  height: 55 }
  },
  {
    id: "115",          name: "Elec Machines II",   floor: 1, capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "115",
    position2D: { x: 80,  y: 430, width: 65,  height: 55 }
  },
  {
    id: "116",          name: "Power Electronics Lab",floor: 1,capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "116",
    position2D: { x: 150, y: 430, width: 65,  height: 55 }
  },
  {
    id: "117b",         name: "HOD Cabin (EE)",     floor: 1, capacity: 10,
    department: "Electrical",   type: "Admin",
    meshName: "117b",
    position2D: { x: 10,  y: 490, width: 65,  height: 55 }
  },
  {
    id: "117a",         name: "Research/Innovation Lab", floor: 1, capacity: 30,
    department: "Electrical",   type: "Lab",
    meshName: "117a",
    position2D: { x: 80,  y: 490, width: 65,  height: 55 }
  },
  {
    id: "116b",         name: "Power Electronics Lab", floor: 1, capacity: 40,
    department: "Electrical",   type: "Lab",
    meshName: "116b",
    position2D: { x: 150, y: 490, width: 65,  height: 55 }
  },
  // LT (Lecture Theatre) — small staircase area
  {
    id: "lt_1",         name: "LT (Stairs)",        floor: 1, capacity: 0,
    department: "General",      type: "Corridor",
    meshName: "lt_1",
    position2D: { x: 10,  y: 555, width: 40,  height: 30 }
  },
  {
    id: "118",          name: "Computer Lab 8",     floor: 1, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "118",
    position2D: { x: 10,  y: 590, width: 65,  height: 55 }
  },
  {
    id: "119",          name: "Microcontroller Lab",floor: 1, capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "119",
    position2D: { x: 80,  y: 590, width: 65,  height: 55 }
  },

  // ── First Floor — B Wing ─────────────────────────────────────────────────
  {
    id: "iqac",         name: "IQAC",               floor: 1, capacity: 20,
    department: "Admin",        type: "Admin",
    meshName: "iqac",
    position2D: { x: 230, y: 570, width: 55,  height: 55 }
  },
  {
    id: "principal",    name: "Principal Cabin",    floor: 1, capacity: 10,
    department: "Admin",        type: "Admin",
    meshName: "principal",
    position2D: { x: 290, y: 570, width: 70,  height: 55 }
  },
  {
    id: "establishment",name: "Establishment Section", floor: 1, capacity: 15,
    department: "Admin",        type: "Admin",
    meshName: "establishment",
    position2D: { x: 365, y: 570, width: 70,  height: 55 }
  },
  {
    id: "accounts",     name: "Account Section",    floor: 1, capacity: 15,
    department: "Admin",        type: "Admin",
    meshName: "accounts",
    position2D: { x: 440, y: 570, width: 70,  height: 55 }
  },
  {
    id: "reception",    name: "Reception",          floor: 1, capacity: 10,
    department: "Admin",        type: "Admin",
    meshName: "reception",
    position2D: { x: 515, y: 570, width: 55,  height: 55 }
  },
  {
    id: "exam_cell",    name: "Examination Cell",   floor: 1, capacity: 20,
    department: "Admin",        type: "Admin",
    meshName: "exam_cell",
    position2D: { x: 230, y: 640, width: 100, height: 55 }
  },
  {
    id: "board_room1",  name: "Board Room",         floor: 1, capacity: 30,
    department: "Admin",        type: "Admin",
    meshName: "board_room1",
    position2D: { x: 365, y: 640, width: 60,  height: 55 }
  },
  {
    id: "board_room2",  name: "Board Room 2",       floor: 1, capacity: 30,
    department: "Admin",        type: "Admin",
    meshName: "board_room2",
    position2D: { x: 430, y: 640, width: 60,  height: 55 }
  },
  {
    id: "data_center",  name: "Data Center",        floor: 1, capacity: 15,
    department: "IT",           type: "Lab",
    meshName: "data_center",
    position2D: { x: 495, y: 640, width: 60,  height: 55 }
  },
  {
    id: "student_sec",  name: "Student Section",    floor: 1, capacity: 20,
    department: "Admin",        type: "Admin",
    meshName: "student_sec",
    position2D: { x: 495, y: 700, width: 60,  height: 50 }
  },

  // ══════════════════════════════════════════════════════════════════════
  //  SECOND FLOOR — A Wing
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "202",          name: "Classroom 202",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "202",
    position2D: { x: 10,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "201",          name: "Faculty Room",       floor: 2, capacity: 20,
    department: "IT",           type: "Faculty",
    meshName: "201",
    position2D: { x: 80,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "201a",         name: "Classroom 201A",     floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "201a",
    position2D: { x: 150, y: 10,  width: 65,  height: 55 }
  },
  {
    id: "203",          name: "Classroom 203",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "203",
    position2D: { x: 10,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "204",          name: "Classroom 204",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "204",
    position2D: { x: 80,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "206",          name: "Classroom 206",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "206",
    position2D: { x: 10,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "205",          name: "Classroom 205",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "205",
    position2D: { x: 80,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "206a",         name: "Sick Room",          floor: 2, capacity: 10,
    department: "General",      type: "Room",
    meshName: "206a",
    position2D: { x: 10,  y: 190, width: 65,  height: 30 }
  },
  {
    id: "208",          name: "Classroom 208",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "208",
    position2D: { x: 80,  y: 190, width: 65,  height: 55 }
  },
  {
    id: "207",          name: "Classroom 207",      floor: 2, capacity: 60,
    department: "IT",           type: "Classroom",
    meshName: "207",
    position2D: { x: 10,  y: 225, width: 65,  height: 55 }
  },
  {
    id: "209b",         name: "e-Yantra Robotics Lab", floor: 2, capacity: 40,
    department: "IT",           type: "Lab",
    meshName: "209b",
    position2D: { x: 10,  y: 285, width: 65,  height: 55 }
  },
  {
    id: "209a",         name: "Design Thinking Lab",floor: 2, capacity: 40,
    department: "IT",           type: "Lab",
    meshName: "209a",
    position2D: { x: 80,  y: 250, width: 65,  height: 55 }
  },
  {
    id: "211",          name: "Computer Lab 9",     floor: 2, capacity: 50,
    department: "IT",           type: "Lab",
    meshName: "211",
    position2D: { x: 10,  y: 345, width: 65,  height: 55 }
  },
  {
    id: "210",          name: "Incubation Cell",    floor: 2, capacity: 30,
    department: "IT",           type: "Lab",
    meshName: "210",
    position2D: { x: 80,  y: 310, width: 65,  height: 55 }
  },
  {
    id: "211a",         name: "IT Infra Cell",      floor: 2, capacity: 15,
    department: "IT",           type: "Room",
    meshName: "211a",
    position2D: { x: 10,  y: 405, width: 65,  height: 30 }
  },
  {
    id: "library",      name: "Library",            floor: 2, capacity: 150,
    department: "General",      type: "Library",
    meshName: "library",
    position2D: { x: 10,  y: 440, width: 200, height: 130 }
  },

  // ── Second Floor — B Wing ────────────────────────────────────────────────
  {
    id: "220",          name: "Computer Lab 11",    floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "220",
    position2D: { x: 230, y: 570, width: 65,  height: 55 }
  },
  {
    id: "221a",         name: "Alumni Cell",        floor: 2, capacity: 20,
    department: "General",      type: "Room",
    meshName: "221a",
    position2D: { x: 300, y: 570, width: 65,  height: 27 }
  },
  {
    id: "221b",         name: "Interview Room",     floor: 2, capacity: 20,
    department: "General",      type: "Room",
    meshName: "221b",
    position2D: { x: 300, y: 600, width: 65,  height: 27 }
  },
  {
    id: "222",          name: "Classroom",          floor: 2, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "222",
    position2D: { x: 230, y: 630, width: 65,  height: 55 }
  },
  {
    id: "223b",         name: "Software Lab II",    floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "223b",
    position2D: { x: 300, y: 630, width: 65,  height: 55 }
  },
  {
    id: "224",          name: "Software Lab III",   floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "224",
    position2D: { x: 365, y: 570, width: 65,  height: 55 }
  },
  {
    id: "223a",         name: "Software Lab I",     floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "223a",
    position2D: { x: 365, y: 630, width: 65,  height: 55 }
  },
  {
    id: "224b",         name: "Hardware Lab",       floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "224b",
    position2D: { x: 435, y: 570, width: 65,  height: 55 }
  },
  {
    id: "225",          name: "Classroom",          floor: 2, capacity: 60,
    department: "General",      type: "Classroom",
    meshName: "225",
    position2D: { x: 435, y: 630, width: 65,  height: 55 }
  },
  {
    id: "226",          name: "Faculty Room",       floor: 2, capacity: 20,
    department: "Computer Science", type: "Faculty",
    meshName: "226",
    position2D: { x: 500, y: 570, width: 65,  height: 55 }
  },
  {
    id: "227a",         name: "Career Counselling", floor: 2, capacity: 30,
    department: "General",      type: "Room",
    meshName: "227a",
    position2D: { x: 500, y: 630, width: 65,  height: 55 }
  },
  {
    id: "228",          name: "Training & Placement",floor:2, capacity: 30,
    department: "General",      type: "Room",
    meshName: "228",
    position2D: { x: 435, y: 690, width: 65,  height: 50 }
  },
  {
    id: "227b",         name: "Industry Lab (Shell)",floor:2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "227b",
    position2D: { x: 500, y: 690, width: 65,  height: 50 }
  },
  {
    id: "229",          name: "Computer Lab 18",    floor: 2, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "229",
    position2D: { x: 365, y: 690, width: 65,  height: 50 }
  },
  {
    id: "230",          name: "Seminar Hall",       floor: 2, capacity: 120,
    department: "General",      type: "Seminar",
    meshName: "230",
    position2D: { x: 300, y: 690, width: 60,  height: 50 }
  },

  // ══════════════════════════════════════════════════════════════════════
  //  THIRD FLOOR — A Wing
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "302",          name: "Engg Chemistry Lab", floor: 3, capacity: 40,
    department: "General",      type: "Lab",
    meshName: "302",
    position2D: { x: 10,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "301",          name: "Engg Chemistry Lab", floor: 3, capacity: 40,
    department: "General",      type: "Lab",
    meshName: "301",
    position2D: { x: 80,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "301a",         name: "Faculty Room",       floor: 3, capacity: 20,
    department: "General",      type: "Faculty",
    meshName: "301a",
    position2D: { x: 150, y: 10,  width: 65,  height: 55 }
  },
  {
    id: "303",          name: "Physics Lab",        floor: 3, capacity: 40,
    department: "General",      type: "Lab",
    meshName: "303",
    position2D: { x: 10,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "304",          name: "Tutorial Room",      floor: 3, capacity: 40,
    department: "General",      type: "Classroom",
    meshName: "304",
    position2D: { x: 80,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "306",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "306",
    position2D: { x: 10,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "305",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "305",
    position2D: { x: 80,  y: 130, width: 65,  height: 55 }
  },
  // LT gap
  {
    id: "307",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "307",
    position2D: { x: 10,  y: 215, width: 65,  height: 55 }
  },
  {
    id: "308",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "308",
    position2D: { x: 80,  y: 215, width: 65,  height: 55 }
  },
  {
    id: "309c",         name: "Computer Lab 19",    floor: 3, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "309c",
    position2D: { x: 10,  y: 275, width: 65,  height: 55 }
  },
  {
    id: "309",          name: "Drawing Hall",       floor: 3, capacity: 80,
    department: "General",      type: "Classroom",
    meshName: "309",
    position2D: { x: 80,  y: 275, width: 135, height: 55 }
  },
  {
    id: "311",          name: "Applied Mechanics Lab", floor: 3, capacity: 40,
    department: "Mechanical",   type: "Lab",
    meshName: "311",
    position2D: { x: 10,  y: 335, width: 65,  height: 55 }
  },
  {
    id: "310",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "310",
    position2D: { x: 80,  y: 335, width: 65,  height: 55 }
  },
  {
    id: "313",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "313",
    position2D: { x: 10,  y: 395, width: 65,  height: 55 }
  },
  {
    id: "312",          name: "Classroom",          floor: 3, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "312",
    position2D: { x: 80,  y: 395, width: 65,  height: 55 }
  },
  // GT gap
  {
    id: "314",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "314",
    position2D: { x: 10,  y: 475, width: 65,  height: 55 }
  },
  {
    id: "315",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "315",
    position2D: { x: 80,  y: 475, width: 65,  height: 55 }
  },
  {
    id: "317",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "317",
    position2D: { x: 10,  y: 535, width: 65,  height: 55 }
  },
  {
    id: "316",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "316",
    position2D: { x: 80,  y: 535, width: 65,  height: 55 }
  },
  // GT gap
  {
    id: "318",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "318",
    position2D: { x: 10,  y: 615, width: 65,  height: 55 }
  },
  {
    id: "319",          name: "Exam Control Room",  floor: 3, capacity: 20,
    department: "Admin",        type: "Admin",
    meshName: "319",
    position2D: { x: 80,  y: 615, width: 65,  height: 55 }
  },

  // ── Third Floor — B Wing ─────────────────────────────────────────────────
  {
    id: "320",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "320",
    position2D: { x: 230, y: 640, width: 70,  height: 55 }
  },
  {
    id: "321a",         name: "HOD Cabin (AIDS)",   floor: 3, capacity: 10,
    department: "AIDS",         type: "Admin",
    meshName: "321a",
    position2D: { x: 300, y: 615, width: 65,  height: 28 }
  },
  {
    id: "321b",         name: "Faculty Room",       floor: 3, capacity: 20,
    department: "AIDS",         type: "Faculty",
    meshName: "321b",
    position2D: { x: 300, y: 648, width: 65,  height: 28 }
  },
  {
    id: "322",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "322",
    position2D: { x: 230, y: 700, width: 70,  height: 50 }
  },
  {
    id: "323",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "323",
    position2D: { x: 365, y: 640, width: 65,  height: 55 }
  },
  {
    id: "324",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "324",
    position2D: { x: 365, y: 700, width: 65,  height: 50 }
  },
  {
    id: "325",          name: "Classroom",          floor: 3, capacity: 60,
    department: "AIDS",         type: "Classroom",
    meshName: "325",
    position2D: { x: 430, y: 640, width: 65,  height: 55 }
  },
  {
    id: "326",          name: "Computer Lab 20",    floor: 3, capacity: 50,
    department: "AIDS",         type: "Lab",
    meshName: "326",
    position2D: { x: 430, y: 580, width: 65,  height: 55 }
  },
  {
    id: "327",          name: "Data Science Lab",   floor: 3, capacity: 50,
    department: "AIDS",         type: "Lab",
    meshName: "327",
    position2D: { x: 430, y: 700, width: 65,  height: 50 }
  },
  {
    id: "328",          name: "Machine Learning Lab",floor: 3, capacity: 50,
    department: "AIDS",         type: "Lab",
    meshName: "328",
    position2D: { x: 495, y: 580, width: 65,  height: 55 }
  },
  {
    id: "329",          name: "PG Lab",             floor: 3, capacity: 40,
    department: "AIDS",         type: "Lab",
    meshName: "329",
    position2D: { x: 495, y: 640, width: 65,  height: 55 }
  },
  {
    id: "330",          name: "Seminar Hall",       floor: 3, capacity: 120,
    department: "General",      type: "Seminar",
    meshName: "330",
    position2D: { x: 495, y: 700, width: 65,  height: 50 }
  },

  // ══════════════════════════════════════════════════════════════════════
  //  FOURTH FLOOR — A Wing
  // ══════════════════════════════════════════════════════════════════════
  {
    id: "402",          name: "Faculty Room",       floor: 4, capacity: 20,
    department: "Computer Science", type: "Faculty",
    meshName: "402",
    position2D: { x: 10,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "403a",         name: "Tech Hub / FG Classroom", floor: 4, capacity: 60,
    department: "Computer Science", type: "Classroom",
    meshName: "403a",
    position2D: { x: 80,  y: 10,  width: 65,  height: 55 }
  },
  {
    id: "401b",         name: "Seminar Hall",       floor: 4, capacity: 120,
    department: "General",      type: "Seminar",
    meshName: "401b",
    position2D: { x: 150, y: 10,  width: 65,  height: 55 }
  },
  {
    id: "401a",         name: "Faculty Room",       floor: 4, capacity: 20,
    department: "Computer Science", type: "Faculty",
    meshName: "401a",
    position2D: { x: 220, y: 10,  width: 65,  height: 55 } // rightmost A-Wing top
  },
  {
    id: "403b",         name: "Electronic Meas. Lab",floor: 4,capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "403b",
    position2D: { x: 10,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "404",          name: "Electronic Meas. Lab 2", floor: 4, capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "404",
    position2D: { x: 80,  y: 70,  width: 65,  height: 55 }
  },
  {
    id: "406",          name: "Elec Circuits Lab",  floor: 4, capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "406",
    position2D: { x: 10,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "405",          name: "Comm Lab",           floor: 4, capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "405",
    position2D: { x: 80,  y: 130, width: 65,  height: 55 }
  },
  {
    id: "409c",         name: "Digital Elec Lab",   floor: 4, capacity: 40,
    department: "E&TC",         type: "Lab",
    meshName: "409c",
    position2D: { x: 10,  y: 190, width: 65,  height: 55 }
  },
  {
    id: "407",          name: "Classroom",          floor: 4, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "407",
    position2D: { x: 10,  y: 250, width: 65,  height: 55 }
  },
  {
    id: "408",          name: "Classroom",          floor: 4, capacity: 60,
    department: "E&TC",         type: "Classroom",
    meshName: "408",
    position2D: { x: 80,  y: 250, width: 65,  height: 55 }
  },
  {
    id: "409d",         name: "Repair/Innovation Lab", floor: 4, capacity: 30,
    department: "E&TC",         type: "Lab",
    meshName: "409d",
    position2D: { x: 10,  y: 310, width: 65,  height: 55 }
  },
  {
    id: "409b",         name: "Computer Lab",       floor: 4, capacity: 50,
    department: "E&TC",         type: "Lab",
    meshName: "409b",
    position2D: { x: 80,  y: 310, width: 65,  height: 55 }
  },
  {
    id: "409a",         name: "HOD Cabin (E&TC)",   floor: 4, capacity: 10,
    department: "E&TC",         type: "Admin",
    meshName: "409a",
    position2D: { x: 150, y: 250, width: 65,  height: 115 }
  },
  {
    id: "409e",         name: "Computer Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "409e",
    position2D: { x: 10,  y: 370, width: 65,  height: 55 }
  },
  {
    id: "410",          name: "Software Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "410",
    position2D: { x: 80,  y: 370, width: 65,  height: 55 }
  },
  {
    id: "411",          name: "Project Innovation Lab", floor: 4, capacity: 40,
    department: "Computer Science", type: "Lab",
    meshName: "411",
    position2D: { x: 10,  y: 430, width: 65,  height: 55 }
  },
  {
    id: "412b",         name: "HOD Cabin (IT)",     floor: 4, capacity: 10,
    department: "IT",           type: "Admin",
    meshName: "412b",
    position2D: { x: 80,  y: 430, width: 65,  height: 55 }
  },
  {
    id: "412a",         name: "Classroom",          floor: 4, capacity: 60,
    department: "Computer Science", type: "Classroom",
    meshName: "412a",
    position2D: { x: 150, y: 370, width: 65,  height: 55 }
  },
  // GT gap
  {
    id: "414a",         name: "Software Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "414a",
    position2D: { x: 10,  y: 510, width: 65,  height: 55 }
  },
  {
    id: "415a",         name: "Hardware Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "415a",
    position2D: { x: 80,  y: 510, width: 65,  height: 55 }
  },
  {
    id: "416b",         name: "Project Lab",        floor: 4, capacity: 40,
    department: "Computer Science", type: "Lab",
    meshName: "416b",
    position2D: { x: 150, y: 510, width: 65,  height: 55 }
  },
  {
    id: "414b",         name: "Software Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "414b",
    position2D: { x: 10,  y: 570, width: 65,  height: 55 }
  },
  {
    id: "415b",         name: "Project Lab",        floor: 4, capacity: 40,
    department: "Computer Science", type: "Lab",
    meshName: "415b",
    position2D: { x: 80,  y: 570, width: 65,  height: 55 }
  },
  {
    id: "416a",         name: "Software Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "416a",
    position2D: { x: 150, y: 570, width: 65,  height: 55 }
  },
  {
    id: "417b",         name: "Software Lab",       floor: 4, capacity: 50,
    department: "IT",           type: "Lab",
    meshName: "417b",
    position2D: { x: 80,  y: 630, width: 65,  height: 55 }
  },
  {
    id: "417a",         name: "Software Lab",       floor: 4, capacity: 50,
    department: "IT",           type: "Lab",
    meshName: "417a",
    position2D: { x: 10,  y: 630, width: 65,  height: 55 }
  },
  // GT gap
  {
    id: "418",          name: "Staff Room",         floor: 4, capacity: 20,
    department: "General",      type: "Faculty",
    meshName: "418",
    position2D: { x: 10,  y: 700, width: 65,  height: 50 }
  },
  {
    id: "419a",         name: "Online Lab I",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "419a",
    position2D: { x: 80,  y: 700, width: 65,  height: 50 }
  },
  {
    id: "419b",         name: "Online Lab II",      floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "419b",
    position2D: { x: 150, y: 700, width: 65,  height: 50 }
  },

  // ── Fourth Floor — B Wing ────────────────────────────────────────────────
  {
    id: "420",          name: "Classroom",          floor: 4, capacity: 60,
    department: "Computer Science", type: "Classroom",
    meshName: "420",
    position2D: { x: 230, y: 610, width: 70,  height: 55 }
  },
  {
    id: "421",          name: "Classroom",          floor: 4, capacity: 60,
    department: "Computer Science", type: "Classroom",
    meshName: "421",
    position2D: { x: 230, y: 670, width: 70,  height: 55 }
  },
  {
    id: "422",          name: "Hardware Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "422",
    position2D: { x: 305, y: 670, width: 65,  height: 55 }
  },
  {
    id: "423",          name: "Classroom",          floor: 4, capacity: 60,
    department: "Computer Science", type: "Classroom",
    meshName: "423",
    position2D: { x: 365, y: 610, width: 65,  height: 115 }
  },
  {
    id: "424",          name: "Dept Library",       floor: 4, capacity: 40,
    department: "Computer Science", type: "Library",
    meshName: "424",
    position2D: { x: 305, y: 570, width: 55,  height: 55 }
  },
  {
    id: "425a",         name: "R&I Lab",            floor: 4, capacity: 40,
    department: "Computer Science", type: "Lab",
    meshName: "425a",
    position2D: { x: 430, y: 575, width: 65,  height: 30 }
  },
  {
    id: "425c",         name: "HOD Cabin (CS)",     floor: 4, capacity: 10,
    department: "Computer Science", type: "Admin",
    meshName: "425c",
    position2D: { x: 430, y: 610, width: 65,  height: 30 }
  },
  {
    id: "425b",         name: "R&I Lab (B)",        floor: 4, capacity: 40,
    department: "Computer Science", type: "Lab",
    meshName: "425b",
    position2D: { x: 430, y: 645, width: 65,  height: 55 }
  },
  {
    id: "426_427",      name: "Software Lab",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "426_427",
    position2D: { x: 495, y: 575, width: 65,  height: 55 }
  },
  {
    id: "427_428",      name: "System Lab",         floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "427_428",
    position2D: { x: 495, y: 635, width: 65,  height: 55 }
  },
  {
    id: "429",          name: "Programming Lab",    floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "429",
    position2D: { x: 430, y: 705, width: 65,  height: 45 }
  },
  {
    id: "430a",         name: "Online Lab I",       floor: 4, capacity: 50,
    department: "Computer Science", type: "Lab",
    meshName: "430a",
    position2D: { x: 495, y: 695, width: 65,  height: 55 }
  },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export const getLocationById      = (id)       => LOCATIONS.find(l => l.id === id);
export const getLocationByMesh    = (meshName) => LOCATIONS.find(l => l.meshName === meshName);
export const getLocationsByFloor  = (floor)    => LOCATIONS.filter(l => l.floor === floor);
export const getLocationsByDept   = (dept)     => LOCATIONS.filter(l => l.department === dept);
export const getLocationsByType   = (type)     => LOCATIONS.filter(l => l.type === type);
