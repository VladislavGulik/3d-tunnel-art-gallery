import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import {
  Scene,
  Color,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  SRGBColorSpace,
  Vector3,
  Camera,
  Light,
  HemisphereLight,
  MeshStandardMaterial,
  DoubleSide,
  GridHelper,
  TextureLoader,
  MeshBasicMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-vault-canvas',
  templateUrl: './vault-canvas.component.html',
  styleUrls: ['./vault-canvas.component.scss']
})
export class VaultCanvasComponent implements AfterViewInit {
  @ViewChild('canvasWrapper', { static: true })
  set canvasContainer(value: ElementRef<HTMLDivElement>) {
      this.container = value?.nativeElement;
  }

  @ViewChild('canvas', { static: true })
  private canvasElement: ElementRef<HTMLCanvasElement>;

  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  container: HTMLElement;
  initialCameraPosition: Vector3;
  distanceCameraToTarget: number;
  orbitControls: OrbitControls;

  startX: number;
  startCameraX: number;

  planes: Mesh<any>[];

  oldX = 0;
  oldY = 0;

  constructor() {}

  get canvas() {
    return this.canvasElement?.nativeElement;
  }

  ngAfterViewInit(): void {
    this.renderer = this.buildRenderer(this.container, this.canvas);
    this.scene = this.buildScene();
    this.camera = this.buildDefaultCamera(this.container);
    this.initialCameraPosition = new Vector3().copy(this.camera.position);
    this.distanceCameraToTarget = this.calculateDistanceCameraToTarget(
        this.initialCameraPosition,
        new Vector3(0, 0, 0)
    );

    // add camera to the scene
    this.scene.add(this.camera);

    // Initialize lights.
    const lights = this.buildLights(this.camera);
    this.scene.add(lights[0]);

    // We want the directional light to move with the camera.
    this.camera.add(lights[1]);

    // this.targetPosition = context.productMetaData.visualisationSettings.camera.target;
    // // Depends on camera and OrbitControls: Script is loaded when twikbot is loaded.
    // this.orbitControls = ProductCanvasComponent.buildOrbitControls(
    //     this.camera,
    //     this.canvas,
    //     this.targetPosition
    // );

    this.render();
    this.onResize(); // updates the canvas dimensions after twikbot is loaded

    this.animate();
  }

  // TODO
  // ! SET UP GRID
  // ! SET UP CONTROLS ON MOUSE MOVE
  // !! SET UP INFINITE SCROLL

  private buildRenderer(container: HTMLElement, canvas: any) {
    const renderer = new WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setClearColor(0xffffff, 1);
    renderer.autoClear = true;
    renderer.outputColorSpace = SRGBColorSpace;
    return renderer;
  }

  private buildScene(): Scene {
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // const grid = new GridHelper(1000, 30);
    // scene.add(grid);
    // !
    // const planeGeometry = new PlaneGeometry(300, 300, 1000);
  //   const material = new MeshStandardMaterial({
  //     color: 0x707070,
  //     side: DoubleSide,
  //     metalness: 0.1,
  //     roughness: 0.8,
  //     emissive: 0x000000,
  //     map: null,
  //     bumpScale: 1,
  //     normalMap: null,
  //     bumpMap: null,
  //     emissiveMap: null,
  //     roughnessMap: null,
  //     opacity: 1,
  // });

    // const textures = [
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    //   new TextureLoader().load('../../assets/download.png'),
    // ];

    // const geometries = textures.map(texture => new PlaneGeometry(200, 200));

    // this.planes = geometries.map((geometry, i) => {
    //   const material = new MeshBasicMaterial({ map: textures[i] });
    //   const plane = new Mesh(geometry, material);

    //   if (i % 2 === 0) {
    //     plane.position.y = i * -100;
    //     plane.position.x = i * 20;
    //     scene.add(plane);
    //   } else {
    //     plane.position.y = i * +100;
    //     plane.position.x = i * 20;
    //     scene.add(plane);
    //   }

    //   return plane;
    // });

    // const material = new MeshLambertMaterial({ color: 0x000 })
    // const mesh = new Mesh(planeGeometry, material);

    // mesh.position.set(-300, 10, 0);
    // scene.add(mesh);

    // document.addEventListener('touchstart', event => {
    //   this.startX = event.touches[0].clientX;
    //   this.startCameraX = camera.position.x;
    // });
    // document.addEventListener('touchmove', event => {
    //   const deltaX = event.touches[0].clientX - this.startX;
    //   this.camera.position.y = this.startCameraX - deltaX / 100;
    // });
    // document.addEventListener('wheel', event => {
    //   this.camera.position.y -= event.deltaY / 10;
    // });
    // !

    const ambl = new AmbientLight(0xfff);
    scene.add(ambl)


    const planeGeometry = new PlaneGeometry(300, 300, 1000);

    const textures = [
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
      new TextureLoader().load('../../assets/download.png'),
    ];

    const geometries = textures.map(texture => new PlaneGeometry(200, 200));

    this.planes = geometries.map((geometry, i) => {
      const material = new MeshBasicMaterial({ map: textures[i] });
      const plane = new Mesh(geometry, material);

      if (i % 2 === 0) {
        plane.position.y = i * -100;
        plane.position.x = i * 20;
        scene.add(plane);
      } else {
        plane.position.y = i * +100;
        plane.position.x = i * 20;
        scene.add(plane);
      }

      return plane;
    });

    const material = new MeshLambertMaterial({ color: 0x000 })
    const mesh = new Mesh(planeGeometry, material);

    mesh.position.set(-300, 10, 0);
    scene.add(mesh);

     // document.addEventListener('touchstart', event => {
    //   this.startX = event.touches[0].clientX;
    //   this.startCameraX = camera.position.x;
    // });
    // document.addEventListener('touchmove', event => {
    //   const deltaX = event.touches[0].clientX - this.startX;
    //   this.camera.position.y = this.startCameraX - deltaX / 100;
    // });
    // document.addEventListener('wheel', event => {
    //   this.camera.position.y -= event.deltaY / 10;
    // });

    // document.addEventListener('h', (event) => {
    //   let changeX = event.x - this.oldX;
    //   let changeY = event.y - this.oldY;
    //   camera.position.x += changeX / 100;
    //   camera.position.y += changeY / 100;

    //   this.oldX = event.x;
    //   this.oldY = event.y;
    // });

    return scene;
  }

  private animate() {
    requestAnimationFrame(() => this.animate);
    this.planes.forEach(plane => {
      plane.rotation.y += 0.01;
      plane.rotation.x += 0.01;
      plane.rotation.z += 0.01;
    });
    this.renderer.render(this.scene, this.camera)
  }

  private buildDefaultCamera(container: HTMLElement) {
    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.x = 77;
    camera.position.y = -123;
    camera.position.z = 565;
    camera.up.set(0, 0, 1);
    return camera;
  }

  private calculateDistanceCameraToTarget(initialCameraDistance: Vector3, target: Vector3) {
    return Math.sqrt(
        Math.pow(initialCameraDistance.x - target.x, 2) +
        Math.pow(initialCameraDistance.y - target.y, 2) +
        Math.pow(initialCameraDistance.z - target.z, 2)
    );
  }

  private buildLights(camera: Camera): Light[] {
    const light1 = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    light1.color.setHSL(0.6, 1, 0.6);
    light1.groundColor.setHSL(0.095, 1, 0.75);
    light1.position.set(0, 500, 0);
    const light2: DirectionalLight = new DirectionalLight(0xffffff, /* intensity */ 1);
    light2.color.setHSL(0.1, 1, 0.95);

    light2.position.set(-1, 1.75, 0.5);
    light2.position.multiplyScalar(50);

    light2.castShadow = true;
    light2.shadow.mapSize.width = 2056;
    light2.shadow.mapSize.height = 2056;
    const shadowCamera = light2.shadow.camera;
    const d = 200;
    shadowCamera.left = -d;
    shadowCamera.right = d;
    shadowCamera.top = d;
    shadowCamera.bottom = -d;
    shadowCamera.near = 1;
    shadowCamera.far = 3500;
    light2.shadow.bias = -0.0001;

    return [light1, light2];
  }

  private render() {
    // this.update(this.planes, this.camera);
    requestAnimationFrame(() => this.render());
    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {

    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.zoom = 1;

    this.camera.updateProjectionMatrix();

    if (this.renderer) {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }

  private static buildOrbitControls(camera: Camera, canvas: any, target: number[]): OrbitControls {
    const orbitControls = new OrbitControls(camera, canvas);
    orbitControls.screenSpacePanning = true;
    orbitControls.target.x = target[0];
    orbitControls.target.y = target[1];
    orbitControls.target.z = target[2];
    orbitControls.update();
    return orbitControls;
  }

  private static buildGrid(size: number, divisions: number, colorCenterLine: Color, colorGrid: Color): GridHelper {
    return new GridHelper(size, divisions, colorCenterLine, colorGrid);
  }

  private update(planes: any[], camera: Camera) {
    const cameraX = camera.position.x;
    planes.forEach((plane, index) => {
      const planeX = plane.position.x;
      const distance = planeX - cameraX;
      if (distance < -2) {
        plane.position.x += planes.length * 2;
      } else if (distance > 2) {
        plane.position.x -= planes.length * 2;
      }
    });
  }

}
