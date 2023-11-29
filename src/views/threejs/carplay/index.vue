<template>
  <div ref="canvas" class="wrap">
    <a-spin size="large" />
    <div ref="container" class="container">
      <div ref="per" class="per"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref, onMounted } from 'vue';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  // 引入gltf模型加载库GLTFLoader.js
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  // import gui from './gui';

  const progress = ref(0);
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  const canvas = ref() as Ref;
  const per = ref() as Ref;
  const container = ref() as Ref;
  let width = 400;
  let height = 400;
  let camera: THREE.PerspectiveCamera;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let controls;
  function init() {
    width = canvas.value.clientWidth;
    height = canvas.value.clientHeight;
  }
  const initScene = () => {
    // const axesHelper = new THREE.AxesHelper(200);
    // scene.add(axesHelper);
    initCar();
    // 加载环境贴图
    const textureCube = new THREE.CubeTextureLoader()
      .setPath('src/assets/images/texture/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    textureCube.encoding = THREE.sRGBEncoding; //和renderer.outputEncoding一致
    // 环境贴图纹理对象textureCube作为.environment属性值,影响所有模型
    scene.environment = textureCube;
    // 背景贴图
    scene.background = textureCube;
  };
  const initCar = () => {
    const loader = new GLTFLoader(); // 创建一个GLTF加载器
    const model = new THREE.Group(); // 声明一个组对象，用来添加加载成功的三维场景
    loader.load(
      'src/assets/glb/car.glb',
      (gltf: any) => {
        container.value.style.display = 'none';
        // 查看threejs解析的PBR材质
        gltf.scene.traverse(function (obj) {
          if (obj.isMesh) {
            console.log('obj.material', obj.material);
          }
        });
        model.add(gltf.scene);
      },
      function (xhr) {
        progress.value = (xhr.loaded / xhr.total) * 100;
        per.value.style.width = progress.value * 400 + 'px'; //进度条元素长度
        per.value.style.textIndent = progress.value * 400 + 5 + 'px'; //缩进元素中的首行文本
        // Math.floor:小数加载进度取整
        per.value.innerHTML = Math.floor(progress.value * 100) + '%'; //进度百分比
      },
    );
    model.position.set(0, -50, 0);
    scene.add(model);
  };
  const initLight = () => {
    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.position.set(400, 200, 300);
    scene.add(directionalLight);
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
  };

  const initCamera = () => {
    camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
    camera.position.set(-694, 201, -436);
    camera.lookAt(0, 100, 0);
  };
  const initRenderer = () => {
    renderer.setSize(width, height);
    canvas.value.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // 设置相机控件轨道控制器OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
  };
  const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };
  onMounted(() => {
    init();
    initScene(); // 初始化场景
    initLight(); // 初始化光源
    initCamera(); // 初始化相机
    initRenderer(); // 初始化渲染器
    render();
  });
</script>
<style lang="less" scoped>
  .wrap {
    position: relative;
    width: 100%;
    height: 800px;

    .container {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 400px;
      height: 16px;
      margin-top: -8px;
      margin-left: -200px;
      overflow: hidden;
      border: 1px solid #099;
      border-radius: 8px;

      .per {
        width: 0;
        height: 100%;
        background: #0ff;
        color: #0ff;
        line-height: 15px;
      }
    }
  }
</style>
