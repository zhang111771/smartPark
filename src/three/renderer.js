import * as THREE from 'three'
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    //闪烁处理depthbuffer
    logarithmicDepthBuffer:true,
physicallyCorrectLight:true
})
 renderer.setSize(window.innerWidth,window.innerHeight)
 renderer.shadowMap.enabled=true
 renderer.toneMapping=THREE.ACESFilmicToneMapping
 renderer.toneMappingExposure=0.7
 export default renderer