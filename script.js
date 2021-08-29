import * as THREE from "https://unpkg.com/three@0.120.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js";

$(document).ready(function () {
  setTimeout(() => {
    $(".loader").addClass("hidden");
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 50, 90);
    camera.lookAt(0, 0, 0);
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    const scene = new THREE.Scene();
    let points=[];
    let arr = [
      { x: 10, z: 15 },
      { x: 40, z: -10 },
      { x: -10, z: -20 },
      { x: -30, z: 40 },
      { x: 35, z: 40 },
      { x: -43, z: -5 },
    ];
    let stringModel = [
      "AboutMe.gltf",
      "Gallery.gltf",
      "Resume.gltf",
      "itch.gltf",
      "Linkedin.gltf",
      "github.gltf",
    ];
    for (let i = 0; i < 6; i++) {
      customMesh(arr[i].x, arr[i].z, i);
    }

    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
    const grid = new THREE.GridHelper(100, 100);
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.mouseButtons = {
      RIGHT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      LEFT: null,
    };
    orbit.minPolarAngle = Math.PI * 0.3;
    orbit.maxPolarAngle = Math.PI * 0.45;
    orbit.minAzimuthalAngle = 0;
    orbit.maxAzimuthalAngle = Math.PI * 0.2;
    orbit.maxDistance = 125;
    orbit.minDistance = 40;

    const space = new THREE.TextureLoader().load("bg1.jpg");
    scene.background = space;

    function animate() {
      requestAnimationFrame(animate);
      orbit.update();
      for (let i = 0; i < 6; i++) {
        if (i != j) {
          if (points[i]) {
            points[i].parent.scale.x = 0.75;
            points[i].parent.scale.z = 0.75;
            points[i].parent.scale.y = 0.75;
          }

          scene.remove(stringText[i]);
          stringadd[i] = false;
        } else {
          if (moveObj == true) move(0.4, startVec.x, startVec.z);
        }
      }
      render();
    }

    const photo = new THREE.TextureLoader().load("download1.jpg");
    const boxgeo = new THREE.PlaneGeometry(100, 100);
    const boxmat = new THREE.MeshStandardMaterial({ map: photo });
    const box = new THREE.Mesh(boxgeo, boxmat);
    box.rotation.x = Math.PI * 1.5;
    scene.add(box);

    function customMesh(a, b, i) {
      let loader = new GLTFLoader();

      let root = new THREE.Object3D();

      loader.load(
        stringModel[i],
        function (gltf) {
          root = gltf.scene;
          root.position.x = a;
          root.position.z = b;
          root.scale.x = 0.75;
          root.scale.z = 0.75;
          root.scale.y = 0.75;
          root.traverse(function (child) {
            if (child.isMesh) {
              let m = child;
              m.receiveShadow = true;
              m.castShadow = true;
              m.material.flatShading = true;
              points[i] = m;
            }
          });

          scene.add(root);
        },
        // called while loading is progressing
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        //called when loading has errors
        function (error) {
          console.log(error);
        }
      );
    }

    let changesize = new Array(7).fill(false);
    let j = -1;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {


      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    let strings = [
      "About Me",
      "Gallery",
      "Resume",
      "itch.io",
      "Linkedin",
      "GitHub",
    ];
    let stringadd = [false, false, false, , false, false, false];
    let stringText = [];
    let linkOpen;
    function render() {
      if(points.length>0){
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // calculate objects intersecting the picking ray
      
       const intersects = raycaster.intersectObjects(points);

      if (intersects.length > 0) {
        linkOpen = true;
        for (let i = 0; i < 6; i++) {
          if (intersects[0].object.parent == points[i].parent) {
            j = i;
            intersects[0].object.parent.scale.x = 1;
            intersects[0].object.parent.scale.z = 1;
            intersects[0].object.parent.scale.y = 1;

            break;
          }
        }
      } else {
        linkOpen = false;
      }

      const loader = new THREE.FontLoader();
      if (stringadd[j] != true) {
        loader.load(
          "https://unpkg.com/three@0.120.1/examples/fonts/droid/droid_sans_regular.typeface.json",
          addText
        );
        function addText(font) {
          const geometry1 = new THREE.TextGeometry(strings[j], {
            font: font,
            size: 4,
            height: 1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelOffset: 0.1,
            bevelSegments: 0,
          });
          var textMaterial = new THREE.MeshPhongMaterial({ color: 0xad000e });
          var mesh = new THREE.Mesh(geometry1, textMaterial);
          mesh.position.set(
            arr[j].x - (strings[j].length / 2) * 2,
            2.5,
            arr[j].z + 3.5
          );
          stringText[j] = mesh;
          mesh.lookAt(camera.position);
          scene.add(mesh);
        }
        stringadd[j] = true;
      }

      renderer.render(scene, camera);
    }
  }

    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("click", whattodo);

    let startVec;
    let k;
    function whattodo() {
      //let strings=['About Me','Gallery','Resume','itch','Linkedin','GitHub'];
      if (linkOpen == true) {
        k = j;
        moveObj = true;
        startVec = new THREE.Vector3(arr[j].x, 2.5, arr[j].z);
      }
    }
    let moveObj;
  
    let mesh1;
    carMesh();


    function carMesh() {
      let loader = new GLTFLoader();

      loader.load("Sedan.glb", function (gltf) {
        mesh1 = gltf.scene;
        mesh1.position.x = 0;
        mesh1.position.y = 2.5;
        mesh1.position.z = 0;
        mesh1.scale.x = 10;
        mesh1.scale.y = 10;
        mesh1.scale.z = 10;

        scene.add(mesh1);
      });
    }

    function move(speed, x, z) {
      var d = mesh1.position.x - x;
      var e = mesh1.position.z - z;
      if (e == 0 || d == 0 || d == e) {
        mesh1.lookAt(new THREE.Vector3(x, 2.5, z));
      } else if (
        Math.abs(d) > Math.abs(e) &&
        ((d < 0 && e < 0) || (d > 0 && e > 0))
      ) {
        mesh1.lookAt(
          new THREE.Vector3(mesh1.position.x - e, 2.5, mesh1.position.z - e)
        );
      } else if (
        Math.abs(d) < Math.abs(e) &&
        ((d < 0 && e < 0) || (d > 0 && e > 0))
      ) {
        mesh1.lookAt(
          new THREE.Vector3(mesh1.position.x - d, 2.5, mesh1.position.z - d)
        );
      } else if (d < e) {
        mesh1.lookAt(
          new THREE.Vector3(mesh1.position.x - d, 2.5, mesh1.position.z + d)
        );
      } else {
        mesh1.lookAt(
          new THREE.Vector3(mesh1.position.x + e, 2.5, mesh1.position.z - e)
        );
      }
      if (d > 0) {
        //mesh1.translateX(d);
        mesh1.position.x -= Math.min(speed, d);
      } else if (d < 0) {
        mesh1.position.x += Math.min(speed, Math.abs(d));
      }
      if (e > 0) {
        //mesh1.translateZ(e);
        mesh1.position.z -= Math.min(speed, e);
      } else if (e < 0) {
        mesh1.position.z += Math.min(speed, Math.abs(e));
      }
      if (d == 0 && e == 0) {
        moveObj = false;
        startVec = mesh1.position;
        toDoThings();
      }
    }

    function toDoThings() {
      if (k == 2)
        window.open(
          "https://drive.google.com/file/d/17Ref15kl9HwKTczvDo75kSyZWEwhnFog/view?usp=sharing"
        );
      else if (k == 3) window.open("https://d0ppler.itch.io/");
      else if (k == 4)
        window.open("https://www.linkedin.com/in/tanish-gupta-099ba9194/");
      else if (k == 5) window.open("https://github.com/d0ppler12");
      else if (k == 0) {
        $(".bd-example-modal-lg").modal("toggle");
        $(".modal-title").text("About Me");
        $("#10").removeClass("hidden");
        $("#100").addClass("hidden");
      } else if (k == 1) {
        $(".bd-example-modal-lg").modal("toggle");
        $(".modal-title").text("Gallery");
        $("#100").removeClass("hidden");
        $("#10").addClass("hidden");
      }
    }

    window.addEventListener("touchstart", (event) => {
      mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      linkOpen = true;
      render();
      whattodo();
    });

    window.addEventListener("touchend", function () {
      linkOpen = false;
    });

    window.requestAnimationFrame(animate);
  }, 1000);
});
