
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import eventHub from "@/utils/EeventHub";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import * as THREE from 'three'
import gsap from 'gsap'
import CameraModule from "../camera";
export default class City{
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    dracoLoader.setDecoderConfig({ type: "js" }); //使用兼容性强的draco_decoder.js解码器
    dracoLoader.preload();
    this.loader.setDRACOLoader(dracoLoader)
    this.loader.load("./model/city4.glb", (gltf) => {

      scene.add(gltf.scene);
      this.gltf=gltf
      console.log(gltf)
      gltf.scene.traverse((child)=>{

        if(child.name==='热气球'){
          this.clip=gltf.animations[0]
          this.mixer=new THREE.AnimationMixer(child)       
          this.action=this.mixer.clipAction(this.clip)
          this.action.play()
        }
        if(child.name==='汽车园区轨迹'){
          console.log(child)
          const line=child
          line.visible=false
          //根据点创建曲线
          const points=[]
          for(let i=line.geometry.attributes.position.count;i>=0;i--){
            points.push(
              new THREE.Vector3(
                line.geometry.attributes.position.getX(i),
                line.geometry.attributes.position.getY(i),
                line.geometry.attributes.position.getZ(i)

                )
            )
          }

          this.curve=new THREE.CatmullRomCurve3(points)
          this.curveProgress=0
          this.carAnimation()
        }
        if(child.name==='redcar'){
        
          this.redcar=child
     
        
        }
      })
      gltf.cameras.forEach((camera)=>{
        //必须去掉
        // scene.add(camera)
        CameraModule.add(camera.name,camera)
      })
    

      // 场景子元素遍历
      
    })

    eventHub.on('actionClick',(i)=>{
      console.log(i)
      this.action.reset()
      this.clip=this.gltf.animations[i]
      this.action=this.mixer.clipAction(this.clip)
      this.action.play()
    })
  }
  update(time){
    if(this.mixer){
      this.mixer.update(time)
    }
  }
  carAnimation(){
    gsap.to(this,{
      curveProgress:0.999,
      duration:10,
      repeat:-1,
      onUpdate:()=>{
        this.point=this.curve.getPoint(this.curveProgress)
        this.redcar.position.set(this.point.x,this.point.y,this.point.z)
        if(this.curveProgress+0.001<1){
          const point=this.curve.getPoint(this.curveProgress+0.001)
          this.redcar.lookAt(point)
          

         
        }
      }

    })
  }

}