let scene, camera, renderer;
let player;
let obstacles = [];
let score = 0;
let gameSpeed = 0.2;
let isJumping = false;
let velocityY = 0;
const gravity = -0.015;
const jumpPower = 0.45;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x87CEEB, 10, 100);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x87CEEB);
  document.body.appendChild(renderer.domElement);

  // Пол
  const groundGeo = new THREE.PlaneGeometry(100, 1000);
  const groundMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  scene.add(ground);

  // Игрок (кубик)
  const playerGeo = new THREE.BoxGeometry(1, 1, 1);
  const playerMat = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(-4, 0.5, 0);
  scene.add(player);

  // Свет
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  // Управление
  window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && !isJumping) {
      velocityY = jumpPower;
      isJumping = true;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function createObstacle() {
  const height = Math.random() * 2 + 1;
  const geo = new THREE.BoxGeometry(1, height, 1);
  const mat = new THREE.MeshPhongMaterial({ color: 0xff3366 });
  const obs = new THREE.Mesh(geo, mat);
  
  obs.position.set(15, height/2 - 0.5, 0);
  scene.add(obs);
  obstacles.push(obs);
}

function animate() {
  requestAnimationFrame(animate);

  // Движение игрока
  player.position.x += 0.05; // автобег
  camera.position.x = player.position.x + 8;

  // Гравитация
  if (isJumping) {
    velocityY += gravity;
    player.position.y += velocityY;
    
    if (player.position.y <= 0.5) {
      player.position.y = 0.5;
      isJumping = false;
      velocityY = 0;
    }
  }

  // Движение препятствий
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.position.x -= gameSpeed;

    // Коллизия
    if (
      Math.abs(obs.position.x - player.position.x) < 1 &&
      Math.abs(obs.position.y - player.position.y) < 1
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    // Удаление за экраном
    if (obs.position.x < player.position.x - 15) {
      scene.remove(obs);
      obstacles.splice(i, 1);
      score += 10;
      document.getElementById('score').textContent = score;
    }
  }

  // Спавн препятствий
  if (Math.random() < 0.02) createObstacle();

  renderer.render(scene, camera);
}
