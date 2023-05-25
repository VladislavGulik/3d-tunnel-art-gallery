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
  MathUtils,
  Vector2,
  Object3D,
  Texture,
  FogExp2,
  ShaderMaterial,
  SphereGeometry,
  BoxGeometry,
  CubeTexture,
  BackSide,
} from 'three';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { RenderPass } from 'three/examples//';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

@Component({
  selector: 'app-parallax-tunnel',
  templateUrl: './parallax-tunnel.component.html',
  styleUrls: ['./parallax-tunnel.component.scss']
})
export class ParallaxTunnelComponent implements AfterViewInit {
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
  controls: TrackballControls;
  planes: any[] = [];

  mouseX = 0;
  mouseY = 0;

  shaderMaterial: ShaderMaterial;
  tunnel: Mesh;

  tunnelTexture: any;
  textures: Texture[] = [];
  textureUrls: string[] = [];
  texturePromises: any[] = []

  constructor() {
    this.textureUrls = [
     'assets/1.jpg',
     'assets/2.jpg',
     'assets/3.jpg',
     'assets/4.jpg',
     'assets/5.jpg',
     'assets/6.jpg',
     'assets/7.jpg',
     'assets/8.jpg',
     'assets/9.jpg',
     'assets/10.jpg',
     'assets/tunnel.jpg'
    ];

    this.texturePromises = this.textureUrls.map((url) => {
      return new Promise((resolve, reject) => {
        new TextureLoader().load(url, resolve, undefined, reject);
      });
    });
  }

  get canvas() {
    return this.canvasElement?.nativeElement;
  }

  ngAfterViewInit(): void {
    Promise.all(this.texturePromises)
      .then((loadedTextures) => {
        this.textures.push(...loadedTextures);
        this.tunnelTexture = this.textures.pop();
        this.initScene();
      })
  }

  initScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xE1ECEE)

    // const geometry = new BoxGeometry(400, 200, -1000);
    const geometry = new BoxGeometry(400, 200, -200);

    const material = new MeshBasicMaterial({
      map: this.tunnelTexture,
    })
    this.scene.add(new Mesh(geometry, material));

    // const material = new ShaderMaterial({
    //   vertexShader: `
    //     varying vec2 vUv;
    //     void main() {
    //       vUv = uv;
    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //     }
    //   `,
    //   fragmentShader: `
    //     varying vec2 vUv;
    //     void main() {
    //       vec2 distortedUV = vec2(vUv.x, vUv.y * 0.5 + sin(vUv.y * 10.0) * 0.01);
    //       vec3 color = vec3(0,0,0) * distortedUV.x + vec3(1,1,1) * distortedUV.y;
    //       gl_FragColor = vec4(color, 1.0);
    //     }
    //   `,
    // });

    // this.scene.add(new Mesh(geometry, material));

    // this.scene.add(this.tunnel);

    // const ambl = new AmbientLight(0xfff);
    // this.scene.add(ambl);

    this.camera = this.buildDefaultCamera(this.container);
    this.renderer = this.buildRenderer(this.container, this.canvas);
    
    // Create a RenderPass
    // var renderPass = new RenderPass(this.scene, this.camera);

    // Create a DepthOfFieldPass
    // var dofPass = new DepthOfFieldPass(camera, { focusDistance: 5, blurAmount: 0.1 });

    const geometries = this.textures.map(_ => new PlaneGeometry(15, 15));

    this.planes = geometries.map((geometry, i) => {
      const material = new MeshBasicMaterial({ map: this.textures[i] });
      const plane = new Mesh(geometry, material);

      if (i % 2 === 0) {
        if (i > 2) {
          plane.position.y = i + this.randomBetween(-7, -5) * 0.1;
          plane.position.x = i * -2 - this.randomBetween(-10, 5);
          // plane.rotation.y = i + this.randomBetween(-100, 100);
        } else {
          plane.position.y = i * 1;
          plane.position.x = i * -2 - 10;
        }

        this.scene.add(plane);
      } else {

        if (i > 2) {
          plane.position.y = i - this.randomBetween(5, 7) * 0.1;
          plane.position.x = i * 2 + this.randomBetween(-10, 5);
        } else {
          plane.position.y = i * -1;
          plane.position.x = i * 2 + 10;
        }

        this.scene.add(plane);
      }

      plane.position.z = -i * 15;

      return plane;
    });

    this.container.addEventListener('wheel', event => {
      this.planes.forEach((plane: Mesh, i) => {
        plane.position.z += event.deltaY * 0.005;
      })
    });

    this.container.addEventListener('mousemove', event => {
      this.mouseX = (event.clientX / this.container.clientWidth) * 2 - 1;
      this.mouseY = -(event.clientY / this.container.clientHeight) * 2 + 1;
      this.planes.forEach((plane: Mesh, i) => {
        // plane.rotation.x = plane.rotation.x = event.movementX;
        const interval = setInterval(() => {
          plane.position.x -= this.mouseX * 0.001;
          plane.position.y -= this.mouseY * 0.001;
        }, 50);

        setTimeout(() => {
          clearInterval(interval);
        }, 1000)

        plane.rotation.x = this.mouseY * 0.01;
        plane.rotation.y = this.mouseX * 0.01;
      });
    });
    
    // ! FOG TO BLUR
    // this.scene.fog = new FogExp2(0xfab406, 0.001);
    // this.renderer.setClearColor(this.scene.fog.color, 1);
   
    this.animate();
    this.onResize();
  }

  private animate() {
    this.planes.forEach((plane, i) => {
       // forward infinite loop
      if (plane.position.z > 15) {
        plane.position.z = this.planes[this.planes.length - 1].position.z - 15 * i;
      }
      // backwards infinite loop
      else if (plane.position.z < -(this.textures.length * 15)) {
        plane.position.z = this.planes[0].position.z + 15 * (this.planes.length - i);
      }
    });
    requestAnimationFrame(() => this.animate());
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

  private buildDefaultCamera(container: HTMLElement) {
    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;
    camera.up.set(0, 0, 1);
    return camera;
  }

  private randomBetween(min: number, max: number): number {
    const res = Math.floor(Math.random() * (max - min + 1) + min);
    return res;
  }
}
