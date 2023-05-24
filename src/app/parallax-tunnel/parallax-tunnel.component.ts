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
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
  tunnel: Object3D;
  tunnel2: Object3D;

  mouseX = 0;
  mouseY = 0;

  textures: Texture[] = [];

  constructor() {
    this.textures = [
      new TextureLoader().load('./../../assets/1.jpg'),
      new TextureLoader().load('./../../assets/2.jpg'),
      new TextureLoader().load('./../../assets/3.jpg'),
      new TextureLoader().load('./../../assets/4.jpg'),
      new TextureLoader().load('./../../assets/5.jpg'),
      new TextureLoader().load('./../../assets/6.jpg'),
      new TextureLoader().load('./../../assets/7.jpg'),
      new TextureLoader().load('./../../assets/8.jpg'),
      new TextureLoader().load('./../../assets/9.jpg'),
      new TextureLoader().load('./../../assets/10.jpg'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
      // new TextureLoader().load('../../assets/download.png'),
    ];
  }

  get canvas() {
    return this.canvasElement?.nativeElement;
  }

  ngAfterViewInit(): void {
    this.scene = new Scene();
    // this.tunnel = new Object3D();

    // const ambl = new AmbientLight(0xfff);
    // this.scene.add(ambl);

    this.camera = this.buildDefaultCamera(this.container);
    this.renderer = this.buildRenderer(this.container, this.canvas);

    const geometries = this.textures.map(_ => new PlaneGeometry(10, 10));

    this.planes = geometries.map((geometry, i) => {
      const material = new MeshBasicMaterial({ map: this.textures[i] });
      const plane = new Mesh(geometry, material);

      if (i % 2 === 0) {


        // plane.rotation.x = i * 1;

        if (i > 2) {
          plane.position.y = i  + this.randomBetween(-10, -5) * 0.1;
          plane.position.x = i * -2 - this.randomBetween(-10, 5);
        } else {
          plane.position.y = i * 1;
          plane.position.x = i * -2 - 10;
        }

        this.scene.add(plane);
      } else {

        if (i > 2) {
          plane.position.y = i - this.randomBetween(5, 10) * 0.1;
          plane.position.x = i * 2 + this.randomBetween(-10, 5);
        } else {
          plane.position.y = i * -1;
          plane.position.x = i * 2 + 10;
        }

        // plane.rotation.x = i * -1;

        this.scene.add(plane);
      }

      plane.position.z = -i * 10;

      // plane.position.z = -i * 2;

      // plane.position.x = i * 1;
      // plane.position.y = i * 1;

      // plane.position.z = i * 0.1;

      // this.tunnel.add(plane);

      // this.scene.add(plane);
      return plane;
    });

    // this.tunnel2 = this.tunnel.clone();
    // this.tunnel2.position.x = this.tunnel.position.x + this.container.getBoundingClientRect().x;

    // this.scene.add(this.tunnel);
    // this.scene.add(this.tunnel2);

    // ! old

    // const planeGeometry = new PlaneGeometry(100, 100);
    // const planeMaterial = new MeshBasicMaterial({ map: mapTextures[0], color: 0x000 });
    // const plane = new Mesh(planeGeometry, planeMaterial);
    // this.scene.add(plane);

    // let zoomSpeed = 0.1;
    // document.addEventListener('wheel', event => {
    //   const direction = event.deltaY > 0 ? 1 : -1;
    //   const zoomAmount = this.camera.fov + (direction * zoomSpeed);

    //   this.planes.forEach((plane, i) => {
    //     this.camera.fov = MathUtils.clamp(zoomAmount, 10, 75);
    //     this.camera.updateProjectionMatrix();
    //     // const textureIndex = Math.floor(Math.random() * textures.length);
    //     plane.material.map = textures[i];
    //   })
    // });


    // const parallaxAmount = 0.1;
    // const parallaxOffset = new Vector2(0, 0);

    // document.addEventListener('mousemove', event => {
    //   const x = (event.clientX / this.container.clientWidth) * 2 - 1;
    //   const y = -(event.clientY / this.container.clientHeight) * 2 + 1;
    //   parallaxOffset.x = (x - 0.5) * parallaxAmount;
    //   parallaxOffset.y = (y - 0.5) * parallaxAmount;

    //   this.planes.forEach(plane => {
    //     if (plane?.material?.map) {
    //       plane.material.map.offset = parallaxOffset;
    //     }
    //   });
    // });

    // !

    let scroll = 0;
    this.container.addEventListener('wheel', event => {
      // Adjust the z-coordinate of the 3D card images

      this.planes.forEach((plane: Mesh, i) => {
        plane.position.z += event.deltaY * 0.01;



        // plane.position.z += -event.deltaY * 0.001;

        // console.log(plane.position.z, 'plane.position.z');

        // ! if (plane.position.z > 1 || plane.position.z < -1) {
        // !  plane.position.z -= this.planes[this.planes.length - 1].position.z;
        // ! }

        // const planeScale = 1 / (1 + plane.position.z);
        // plane.scale.set(planeScale, planeScale, planeScale);

        // ? plane.position.z = scroll + plane.position.x * 0.1;


        // plane.position.z = scroll + 0.1;
        // plane.position.x = scroll + plane.position.z * 0.1 * i;
      })


    });


     this.container.addEventListener('mousemove', event => {
        this.mouseX = (event.clientX / this.container.clientWidth) * 2 - 1;
        this.mouseY = -(event.clientY / this.container.clientHeight) * 2 + 1;
        this.planes.forEach((plane: Mesh, i) => {
          // plane.rotation.x = plane.rotation.x = event.movementX;
          const interval = setInterval(() => {
            plane.position.x -= this.mouseX * 0.005;
            plane.position.y -= this.mouseY * 0.005;
          }, 50);

          setTimeout(() => {
            clearInterval(interval);
          }, 1000)


          plane.rotation.x = this.mouseY * 0.05;
          plane.rotation.y = this.mouseX * 0.05;
        });
     });


    //  document.addEventListener('mousemove', event => {
    //   const x = (event.clientX / this.container.clientWidth) * 2 - 1;
    //   const y = -(event.clientY / this.container.clientHeight) * 2 + 1;

    //   this.planes.forEach(plane => {
    //     plane.position.z += event.deltaY * 0.001;
    //     // Scale the 3D card images based on their z-coordinate
    //     const planeScale = 1 / (1 + plane.position.z);
    //     plane.scale.set(planeScale, planeScale, planeScale);
    //   });
    // });



    // this.createControls();

    this.animate();
    this.onResize();
  }

  private animate() {
    // this.tunnel.position.x -= 0.1;
    // this.tunnel2.position.x -= 0.1;

    // Check if the first container object has moved out of view

    this.planes.forEach((plane, i) => {
      console.log(this.planes[0].position.z, 'first')
      console.log(this.planes[this.planes.length -1].position.z, 'last')

      console.log((this.textures.length * 10), 'plane.position.z < -(this.textures.length * 10)');
      
      // forward infinite loop
      if (plane.position.z > 10) {
        // plane.position.z += -10;
        plane.position.z = this.planes[this.planes.length - 1].position.z - 10 * i;
      } 

      // backwards infinite loop
      // else if (plane.position.z < -(this.textures.length * 10)) {
      //   plane.position.z = this.planes[0].position.z + 10 * i;
      // }
    })


    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    // camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
    // camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.05;
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.zoom = 1;

    this.camera.updateProjectionMatrix();

    if (this.renderer) {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    // this.controls.handleResize();
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

  private createControls() {
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 10.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 10.8;
    this.controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ];
  }

  private randomBetween(min: number, max: number): number {
    const res = Math.floor(Math.random() * (max - min + 1) + min);
    return res;
  }
}
