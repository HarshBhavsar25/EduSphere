import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// --- setup scene with better rendering quality ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1030);
scene.fog = new THREE.FogExp2(0x0a1030, 0.002);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(38, 26, 48);
camera.lookAt(0, 12, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.9;
controls.zoomSpeed = 1.2;
controls.target.set(0, 12, 0);
controls.enableTouchRotate = true;

// --- Enhanced lighting for crisp visuals ---
const ambient = new THREE.AmbientLight(0x88aaff, 0.7);
scene.add(ambient);
const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.6);
mainLight.position.set(25, 35, -15);
mainLight.castShadow = true;
mainLight.receiveShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 80;
mainLight.shadow.camera.left = -30;
mainLight.shadow.camera.right = 30;
mainLight.shadow.camera.top = 30;
mainLight.shadow.camera.bottom = -30;
scene.add(mainLight);

const fillLight = new THREE.PointLight(0xffaa66, 0.7);
fillLight.position.set(10, 8, 15);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xffcc88, 0.6);
rimLight.position.set(-15, 12, -20);
scene.add(rimLight);

const backLight = new THREE.DirectionalLight(0x88aaff, 0.4);
backLight.position.set(-10, 20, 25);
scene.add(backLight);

// --- ground & landscaping ---
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160),
    new THREE.MeshStandardMaterial({ color: 0x2a5a3a, roughness: 0.7, metalness: 0.05 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.3;
ground.receiveShadow = true;
scene.add(ground);

const driveway = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 12),
    new THREE.MeshStandardMaterial({ color: 0x4a4a5a, roughness: 0.3, metalness: 0.1 })
);
driveway.rotation.x = -Math.PI / 2;
driveway.position.set(0, -0.25, 14);
driveway.receiveShadow = true;
scene.add(driveway);

const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, emissive: 0x442200 });
for (let i = -12; i <= 12; i += 2.5) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.7), goldMat);
    stripe.position.set(i, -0.22, 14.5);
    stripe.castShadow = true;
    scene.add(stripe);
}

// college name
const canvasTex = (msg, color, bgColor = '#000000') => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = 'Bold 38px "Segoe UI", "Arial"';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(msg, c.width/2, c.height/2 + 20);
    const texture = new THREE.CanvasTexture(c);
    texture.anisotropy = 16;
    return texture;
};

const titlePlane = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 2.2), new THREE.MeshStandardMaterial({ map: canvasTex("MODERN COLLEGE OF ENGINEERING", "#ffd700"), emissiveIntensity: 0.2, metalness: 0.3 }));
titlePlane.position.set(0, 5.2, -3.15);
scene.add(titlePlane);

const subPlane = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshStandardMaterial({ map: canvasTex("EST. 1999 | PUNE", "#88aaff") }));
subPlane.position.set(0, 4.0, -3.15);
scene.add(subPlane);

// clock tower
const towerBase = new THREE.Mesh(new THREE.BoxGeometry(2.5, 8, 2.5), new THREE.MeshStandardMaterial({ color: 0xf0ece4, roughness: 0.2 }));
towerBase.position.set(12, 4, -18);
towerBase.castShadow = true;
scene.add(towerBase);
const towerTop = new THREE.Mesh(new THREE.BoxGeometry(3, 1.2, 3), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 }));
towerTop.position.set(12, 8.2, -18);
towerTop.castShadow = true;
scene.add(towerTop);

// flagpole
const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 5, 8), new THREE.MeshStandardMaterial({ color: 0xccccaa, metalness: 0.5 }));
pole.position.set(-8, 2.5, 18);
pole.castShadow = true;
scene.add(pole);
const flag = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), new THREE.MeshStandardMaterial({ color: 0xff3333 }));
flag.position.set(-7.2, 4.8, 18);
scene.add(flag);

// gardens & bushes
const grassMat = new THREE.MeshStandardMaterial({ color: 0x5a9e4a, roughness: 0.8 });
[-15, 15].forEach(x => {
    const garden = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), grassMat);
    garden.rotation.x = -Math.PI / 2;
    garden.position.set(x, -0.2, 20);
    garden.receiveShadow = true;
    scene.add(garden);
});

const bushColors = [0xff6b6b, 0xffb347, 0xff69b4, 0xda70d6];
for (let gx = -20; gx <= 20; gx += 4) {
    for (let gz = 16; gz <= 26; gz += 3) {
        if (Math.abs(gx) < 12 && gz > 18) continue;
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), new THREE.MeshStandardMaterial({ color: bushColors[Math.floor(Math.random() * bushColors.length)], roughness: 0.3 }));
        bush.position.set(gx, -0.1, gz);
        bush.castShadow = true;
        scene.add(bush);
    }
}

// benches
const benchMat = new THREE.MeshStandardMaterial({ color: 0xbc9a6c, roughness: 0.5 });
const addBench = (x, z) => {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.1, 0.55), benchMat);
    seat.position.set(x, 0.2, z);
    seat.castShadow = true;
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.08), benchMat);
    back.position.set(x, 0.45, z + 0.3);
    back.castShadow = true;
    scene.add(seat, back);
};
[[-12,18],[-10,18],[12,18],[10,18],[-5,22],[5,22]].forEach(p => addBench(p[0], p[1]));

// fountain
const fountainBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.1, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0xddccaa, metalness: 0.3 }));
fountainBase.position.set(0, -0.1, 26);
fountainBase.castShadow = true;
scene.add(fountainBase);

// --- CANTEEN ---
const canteenBase = new THREE.Mesh(new THREE.BoxGeometry(9, 4.5, 12), new THREE.MeshStandardMaterial({ color: 0xe0c8a0, roughness: 0.4 }));
canteenBase.position.set(-25, 2.25, 15);
canteenBase.castShadow = true;
scene.add(canteenBase);
const canteenRoof = new THREE.Mesh(new THREE.ConeGeometry(6, 1.3, 4), new THREE.MeshStandardMaterial({ color: 0xcc8866, roughness: 0.3 }));
canteenRoof.position.set(-25, 5.15, 15);
canteenRoof.castShadow = true;
scene.add(canteenRoof);

const glassMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, metalness: 0.9, emissiveIntensity: 0.05 });
for (let i = -2; i <= 2; i+=2) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.1), glassMat);
    win.position.set(-25 + i, 3, 21);
    win.castShadow = true;
    scene.add(win);
}

const canteenLabelDiv = document.createElement('div');
canteenLabelDiv.textContent = `🍽️ CANTEEN\nFood Court`;
canteenLabelDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
canteenLabelDiv.style.color = '#ffaa44';
canteenLabelDiv.style.padding = '5px 12px';
canteenLabelDiv.style.borderRadius = '24px';
canteenLabelDiv.style.fontSize = '12px';
canteenLabelDiv.style.fontWeight = 'bold';
canteenLabelDiv.style.border = '1px solid #ffaa44';
const canteenLabel = new CSS2DObject(canteenLabelDiv);
canteenLabel.position.set(-25, 5.8, 21);
scene.add(canteenLabel);

// --- PLAYGROUND ---
const playgroundGround = new THREE.Mesh(new THREE.PlaneGeometry(30, 34), new THREE.MeshStandardMaterial({ color: 0x6aab4a, roughness: 0.85 }));
playgroundGround.rotation.x = -Math.PI / 2;
playgroundGround.position.set(28, -0.25, -28);
playgroundGround.receiveShadow = true;
scene.add(playgroundGround);

const lineMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff });
const addLine = (x, z, w, d) => {
    const line = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d), lineMatWhite);
    line.position.set(x, -0.2, z);
    scene.add(line);
};
addLine(28, -12.5, 30.5, 0.2);
addLine(28, -43.5, 30.5, 0.2);
addLine(14.5, -28, 0.2, 34.5);
addLine(41.5, -28, 0.2, 34.5);

const goalMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3 });
const goalLeft = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 3.2), goalMat);
goalLeft.position.set(15.5, 1.2, -12);
scene.add(goalLeft);
const goalRight = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.8, 3.2), goalMat);
goalRight.position.set(40.5, 1.2, -12);
scene.add(goalRight);

const playgroundLabelDiv = document.createElement('div');
playgroundLabelDiv.textContent = `⚽ PLAYGROUND\nFootball / Cricket`;
playgroundLabelDiv.style.backgroundColor = 'rgba(0,0,0,0.75)';
playgroundLabelDiv.style.color = '#aaffaa';
playgroundLabelDiv.style.padding = '5px 12px';
playgroundLabelDiv.style.borderRadius = '24px';
playgroundLabelDiv.style.fontSize = '11px';
playgroundLabelDiv.style.border = '1px solid #aaffaa';
const playgroundLabel = new CSS2DObject(playgroundLabelDiv);
playgroundLabel.position.set(28, 1.8, -28);
scene.add(playgroundLabel);

// --- GYMNASIUM ---
const gymBase = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 12), new THREE.MeshStandardMaterial({ color: 0xccaa77, metalness: 0.4, roughness: 0.3 }));
gymBase.position.set(-20, 2.5, -30);
gymBase.castShadow = true;
scene.add(gymBase);
const gymRoof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 13), new THREE.MeshStandardMaterial({ color: 0xaa8866, metalness: 0.2 }));
gymRoof.position.set(-20, 5.2, -30);
scene.add(gymRoof);

for (let i = -2; i <= 2; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.9, 0.1), glassMat);
    win.position.set(-20 + i*1.6, 3.2, -24);
    win.castShadow = true;
    scene.add(win);
}

const gymLabelDiv = document.createElement('div');
gymLabelDiv.textContent = `🏋️ GYMNASIUM\nFitness Center`;
gymLabelDiv.style.backgroundColor = 'rgba(0,0,0,0.85)';
gymLabelDiv.style.color = '#ffaa66';
gymLabelDiv.style.padding = '5px 12px';
gymLabelDiv.style.borderRadius = '24px';
gymLabelDiv.style.fontSize = '11px';
gymLabelDiv.style.border = '1px solid #ffaa66';
const gymLabel = new CSS2DObject(gymLabelDiv);
gymLabel.position.set(-20, 6.2, -30);
scene.add(gymLabel);

// palm trees
const createPalm = (x, z) => {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.75, 2.4, 8), new THREE.MeshStandardMaterial({ color: 0x8B5A2B, roughness: 0.7 }));
    trunk.position.set(x, 0, z);
    trunk.castShadow = true;
    const leaves = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.1, 5), new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.4 }));
        const angle = (i / 6) * Math.PI * 2;
        leaf.position.set(Math.cos(angle) * 0.75, 2.0, Math.sin(angle) * 0.75);
        leaf.rotation.z = angle;
        leaf.castShadow = true;
        leaves.add(leaf);
    }
    trunk.add(leaves);
    scene.add(trunk);
};
[[-30,-20],[-28,5],[32,-28],[34,10],[-24,30],[30,32],[-38,18],[42,-12],[-15,-35],[10,-40]].forEach(p => createPalm(p[0], p[1]));

// cars
const createCar = (x, z, color, rot) => {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 4.4), new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 }));
    body.position.y = 0.25;
    group.add(body);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 2.6), new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3 }));
    roof.position.y = 0.7;
    group.add(roof);
    group.position.set(x, -0.12, z);
    group.rotation.y = rot;
    scene.add(group);
};
createCar(-15, 11, 0xff3333, 0.2);
createCar(14, 10.5, 0x1e88e5, 0.5);
createCar(-20, -14, 0xffd700, -0.4);
createCar(28, -16, 0xffffff, 0.6);
createCar(-32, 20, 0x44aa44, 0.7);

// ========== MAIN BUILDING with CRYSTAL CLEAR WINDOWS ==========
const skyBlueMat = new THREE.MeshStandardMaterial({ color: 0x87CEEB, roughness: 0.2, metalness: 0.08 });
const darkSkyBlue = new THREE.MeshStandardMaterial({ color: 0x5F9EA0, roughness: 0.25 });
const goldAccent = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.92, roughness: 0.2 });
const windowGlassCrisp = new THREE.MeshStandardMaterial({ color: 0xc8e8ff, metalness: 0.98, roughness: 0.08, emissiveIntensity: 0.12 });

// A Wing
const aWing = new THREE.Mesh(new THREE.BoxGeometry(14.8, 18.4, 45.5), skyBlueMat);
aWing.position.set(0, 9.2, -20);
aWing.castShadow = true;
aWing.receiveShadow = true;
scene.add(aWing);

// B Wing
const bWing = new THREE.Mesh(new THREE.BoxGeometry(39.5, 18.4, 15), skyBlueMat);
bWing.position.set(21, 9.2, 0);
bWing.castShadow = true;
bWing.receiveShadow = true;
scene.add(bWing);

// Gold horizontal bands
for (let i = 0; i < 5; i++) {
    const yBand = i * 3.65 + 2.8;
    const bandA = new THREE.Mesh(new THREE.BoxGeometry(15.3, 0.14, 45.9), goldAccent);
    bandA.position.set(0, yBand, -20);
    bandA.castShadow = true;
    scene.add(bandA);
    const bandB = new THREE.Mesh(new THREE.BoxGeometry(39.9, 0.14, 15.3), goldAccent);
    bandB.position.set(21, yBand, 0);
    bandB.castShadow = true;
    scene.add(bandB);
}

// CRYSTAL CLEAR WINDOW FUNCTION - each window is a separate group with sharp geometry
function addCrystalWindow(x, y, z, width, height, rotationY = 0) {
    const group = new THREE.Group();
    
    // Outer golden frame (thick and sharp)
    const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.12, height + 0.12, 0.1),
        goldAccent
    );
    outerFrame.castShadow = true;
    group.add(outerFrame);
    
    // Glass panel (crisp, reflective)
    const glass = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.08, height - 0.08, 0.06),
        windowGlassCrisp
    );
    glass.position.z = 0.04;
    glass.castShadow = true;
    group.add(glass);
    
    // Inner frame (thin golden border)
    const innerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.04, height - 0.04, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xffaa33, metalness: 0.85 })
    );
    innerFrame.position.z = 0.02;
    innerFrame.castShadow = true;
    group.add(innerFrame);
    
    // Horizontal mullion (cross bar)
    const mullionH = new THREE.Mesh(
        new THREE.BoxGeometry(width - 0.15, 0.07, 0.09),
        goldAccent
    );
    mullionH.position.z = 0.05;
    group.add(mullionH);
    
    // Vertical mullion
    const mullionV = new THREE.Mesh(
        new THREE.BoxGeometry(0.07, height - 0.15, 0.09),
        goldAccent
    );
    mullionV.position.z = 0.05;
    group.add(mullionV);
    
    // Window sill (bottom decorative)
    const sill = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.18, 0.08, 0.15),
        goldAccent
    );
    sill.position.y = -height/2 - 0.08;
    sill.position.z = 0.02;
    sill.castShadow = true;
    group.add(sill);
    
    group.position.set(x, y, z);
    if (rotationY !== 0) group.rotation.y = rotationY;
    scene.add(group);
}

// Floor Y positions for windows (center of each floor)
const windowFloorsY = [1.5, 5.15, 8.8, 12.45, 16.1];
const winW = 1.6, winH = 1.85;

// ===== A-WING WINDOWS (All 4 sides perfectly placed) =====
// Front face (Z = -42.5)
windowFloorsY.forEach(y => {
    for (let x = -5.8; x <= 5.8; x += 3.9) {
        addCrystalWindow(x, y, -42.48, winW, winH);
    }
});

// Back face (Z = 2.5)
windowFloorsY.forEach(y => {
    for (let x = -5.8; x <= 5.8; x += 3.9) {
        addCrystalWindow(x, y, 2.48, winW, winH);
    }
});

// Left face (X = -7.4)
windowFloorsY.forEach(y => {
    for (let z = -38; z <= -2; z += 4.3) {
        addCrystalWindow(-7.38, y, z, winW, winH, Math.PI / 2);
    }
});

// Right face (X = 7.4)
windowFloorsY.forEach(y => {
    for (let z = -38; z <= -2; z += 4.3) {
        addCrystalWindow(7.38, y, z, winW, winH, -Math.PI / 2);
    }
});

// ===== B-WING WINDOWS (All 4 sides) =====
// Front face (Z = -7.5)
windowFloorsY.forEach(y => {
    for (let x = 4; x <= 38; x += 4.2) {
        addCrystalWindow(x, y, -7.48, winW, winH);
    }
});

// Back face (Z = 7.5)
windowFloorsY.forEach(y => {
    for (let x = 4; x <= 38; x += 4.2) {
        addCrystalWindow(x, y, 7.48, winW, winH);
    }
});

// Left face (X = 1.25)
windowFloorsY.forEach(y => {
    for (let z = -5.5; z <= 5.5; z += 4) {
        addCrystalWindow(1.27, y, z, winW, winH, Math.PI / 2);
    }
});

// Right face (X = 40.75)
windowFloorsY.forEach(y => {
    for (let z = -5.5; z <= 5.5; z += 4) {
        addCrystalWindow(40.73, y, z, winW, winH, -Math.PI / 2);
    }
});

// Corner accent windows for A-Wing
const cornerX = [-6.8, 6.8];
windowFloorsY.forEach(y => {
    cornerX.forEach(x => {
        addCrystalWindow(x, y, -42.48, 1.3, winH);
        addCrystalWindow(x, y, 2.48, 1.3, winH);
    });
});

// Grand Entrance with crystal clear glass
const entranceGlassBig = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.5, 0.18), windowGlassCrisp);
entranceGlassBig.position.set(0, 2.2, -2.78);
entranceGlassBig.castShadow = true;
scene.add(entranceGlassBig);

const entranceFrameBig = new THREE.Mesh(new THREE.BoxGeometry(6.2, 4.8, 0.12), goldAccent);
entranceFrameBig.position.set(0, 2.2, -2.72);
entranceFrameBig.castShadow = true;
scene.add(entranceFrameBig);

const entranceCanopy = new THREE.Mesh(new THREE.BoxGeometry(7, 0.2, 3.5), goldAccent);
entranceCanopy.position.set(0, 4.8, -3.2);
entranceCanopy.castShadow = true;
scene.add(entranceCanopy);

// --- INTERNAL ROOMS (Floors data) ---
const allRooms = [];
const originalYmap = new Map();

function getRoomColor(type) {
    if (type.includes('Computer')) return 0x4a90d9;
    if (type.includes('Classroom')) return 0xe8a838;
    if (type.includes('Lab')) return 0x52b87a;
    if (type.includes('Admin')) return 0xc97dd4;
    return 0xddbb99;
}

function deduceDept(name) {
    const f = name.toLowerCase();
    if (f.includes('mech')) return 'Mechanical';
    if (f.includes('electrical')) return 'Electrical';
    if (f.includes('computer')) return 'Computer Science';
    if (f.includes('it')) return 'IT';
    if (f.includes('e&tc')) return 'E&TC';
    if (f.includes('aids')) return 'AIDS';
    return 'General';
}

function createRoom(x, z, w, d, yBase, h, num, name, dept, type, floorIdx) {
    const color = getRoomColor(type);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.05 }));
    mesh.position.set(x, yBase + h/2, z);
    mesh.castShadow = true;
    mesh.userData = { floorIndex: floorIdx, roomNumber: num, roomName: name, department: dept, type, originalY: yBase + h/2 };
    scene.add(mesh);
    const div = document.createElement('div');
    div.textContent = `${num}\n${name.substring(0, 14)}`;
    div.style.backgroundColor = 'rgba(0,0,0,0.85)';
    div.style.color = '#ffd700';
    div.style.fontSize = 'clamp(8px, 2vw, 10px)';
    div.style.padding = '3px 7px';
    div.style.borderRadius = '12px';
    div.style.borderLeft = `3px solid ${new THREE.Color(color).getStyle()}`;
    div.style.fontWeight = '500';
    const label = new CSS2DObject(div);
    label.position.set(x, yBase + h + 0.15, z);
    scene.add(label);
    allRooms.push({ mesh, metadata: mesh.userData, label });
    originalYmap.set(mesh, mesh.position.y);
    return mesh;
}

const floorsSpec = [
    { yBase: 0.0, a: ["G01:Workshop","G02:CAD Lab","G03:Faculty","G04:Classroom","G05:HVAC Lab","G06:Thermo"], b:["G20:Parking","G21:Faculty","G22:Classroom","G23:Sports"] },
    { yBase: 3.65, a:["101:Seminar Hall","102:ME Lab","103:Mechatronics","104:Faculty","105:Classroom","106:Power System"], b:["IQAC Office","Principal Cabin","Account","Reception","Exam Cell"] },
    { yBase: 7.30, a:["201:Classroom","202:Classroom","203:Classroom","204:Design Thinking","205:Comp Lab","Library"], b:["221:Alumni","222:Software Lab","223:Hardware Lab","224:Faculty","225:TPO"] },
    { yBase: 10.95, a:["301:Chemistry Lab","302:Physics Lab","303:Tutorial","304:Classroom","305:Programming Lab"], b:["320:HOD AIDS","321:Faculty AIDS","322:Data Science","323:ML Lab"] },
    { yBase: 14.60, a:["401:Faculty","402:Seminar","403:Tech Hub","404:Comm Lab","405:Digital Elec","406:Innovation Lab"], b:["420:HOD CS","421:Dept Library","422:Research Lab","423:Software Lab"] }
];

floorsSpec.forEach((floor, idx) => {
    const yBase = floor.yBase;
    let zPos = -5.5;
    let cntA = 0;
    for (let r of floor.a) {
        let [num, name] = r.split(':');
        if (!name) { name = num; num = "R"+cntA; }
        const dept = deduceDept(name);
        let type = name.includes('Lab') ? 'Engineering Lab' : (name.includes('Seminar') ? 'Seminar Hall' : 'Classroom');
        const sideX = (cntA % 2 === 0) ? -5.7 : 5.7;
        createRoom(sideX, zPos, 4.2, 3.8, yBase, 3.2, num, name, dept, type, idx);
        cntA++;
        if (cntA % 4 === 0) zPos -= 4.0;
        if (zPos < -36) break;
    }
    let xPos = 8.5;
    let cntB = 0;
    for (let r of floor.b) {
        let [num, name] = r.split(':');
        if (!name) { name = num; num = "BW"+cntB; }
        const dept = deduceDept(name);
        let type = name.includes('Lab') ? 'Computer Lab' : (name.includes('Office') ? 'Admin' : 'Classroom');
        const sideZ = (cntB % 2 === 0) ? -4.7 : 4.7;
        createRoom(xPos, sideZ, 4.1, 3.9, yBase, 3.2, num, name, dept, type, idx);
        cntB++;
        if (cntB % 4 === 0) xPos += 4.2;
        if (xPos > 34) break;
    }
});

allRooms.forEach(r => { r.mesh.visible = false; r.label.visible = false; });

// --- UI Interactions ---
function setFloorVisibility(floorIdx) {
    allRooms.forEach(room => {
        const visible = (floorIdx === -1 || room.metadata.floorIndex === floorIdx);
        room.mesh.visible = visible;
        room.label.visible = visible;
    });
}
document.getElementById('floorG').onclick = () => setFloorVisibility(0);
document.getElementById('floor1').onclick = () => setFloorVisibility(1);
document.getElementById('floor2').onclick = () => setFloorVisibility(2);
document.getElementById('floor3').onclick = () => setFloorVisibility(3);
document.getElementById('floor4').onclick = () => setFloorVisibility(4);
document.getElementById('resetFloors').onclick = () => setFloorVisibility(-1);

document.getElementById('deptFilter').addEventListener('change', (e) => {
    const dept = e.target.value;
    allRooms.forEach(room => {
        if (room.mesh.visible) {
            const match = (dept === 'all' || room.metadata.department === dept);
            room.mesh.visible = match;
            room.label.visible = match;
        }
    });
});

document.getElementById('roomSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    allRooms.forEach(room => {
        if (room.mesh.visible) {
            const match = room.metadata.roomNumber.toLowerCase().includes(q) || room.metadata.roomName.toLowerCase().includes(q);
            room.mesh.material.emissiveIntensity = (q && match) ? 0.7 : 0;
        }
    });
});

let exploded = false;
document.getElementById('explodedBtn').onclick = () => {
    exploded = !exploded;
    allRooms.forEach(room => {
        const origY = originalYmap.get(room.mesh);
        if (exploded && room.mesh.visible) room.mesh.position.y = origY + (room.metadata.floorIndex + 1) * 2.2;
        else room.mesh.position.y = origY;
    });
};

let clipping = false;
const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
document.getElementById('crossSectionBtn').onclick = () => {
    clipping = !clipping;
    allRooms.forEach(room => { room.mesh.material.clippingPlanes = clipping ? [clipPlane] : null; });
};

let night = false;
document.getElementById('dayNightBtn').onclick = () => {
    night = !night;
    ambient.intensity = night ? 0.2 : 0.7;
    mainLight.intensity = night ? 0.12 : 1.6;
    fillLight.intensity = night ? 0.2 : 0.7;
    scene.background.setHex(night ? 0x050b1a : 0x0a1030);
};

let measuring = false, measurePoints = [], measureLine = null;
document.getElementById('measureBtn').onclick = () => {
    measuring = !measuring;
    measurePoints = [];
    if (measureLine) scene.remove(measureLine);
    document.getElementById('measureStatus').innerText = measuring ? "Tap 2 rooms" : "";
};
const raycaster = new THREE.Raycaster();
window.addEventListener('click', (e) => {
    if (!measuring) return;
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(allRooms.filter(r => r.mesh.visible).map(r => r.mesh));
    if (hits.length) {
        measurePoints.push(hits[0].point);
        if (measurePoints.length === 2) {
            const dist = measurePoints[0].distanceTo(measurePoints[1]).toFixed(2);
            alert(`📏 Distance: ${dist} meters`);
            const geom = new THREE.BufferGeometry().setFromPoints(measurePoints);
            if (measureLine) scene.remove(measureLine);
            measureLine = new THREE.Line(geom, new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2 }));
            scene.add(measureLine);
            measurePoints = [];
            measuring = false;
            document.getElementById('measureStatus').innerText = "";
        }
    }
});

document.getElementById('resetView').onclick = () => {
    camera.position.set(38, 26, 48);
    controls.target.set(0, 12, 0);
    controls.update();
};

let hoveredObj = null;
window.addEventListener('mousemove', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const visibleRooms = allRooms.filter(r => r.mesh.visible).map(r => r.mesh);
    const hits = raycaster.intersectObjects(visibleRooms);
    if (hoveredObj) { hoveredObj.material.emissiveIntensity = 0; hoveredObj = null; document.getElementById('hover-status').innerHTML = "Hover any room"; }
    if (hits.length) {
        hoveredObj = hits[0].object;
        hoveredObj.material.emissiveIntensity = 0.5;
        const meta = hoveredObj.userData;
        document.getElementById('hover-status').innerHTML = `${meta.roomNumber} | ${meta.roomName} | ${meta.department}`;
    }
});

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.02;
    fillLight.intensity = 0.65 + Math.sin(time) * 0.08;
    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("✅ Crystal clear windows installed on all sides! Sharp frames, reflective glass, perfect positioning.");
