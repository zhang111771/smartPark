import * as THREE from 'three'
import ControlsModule from './controls'
import CameraModule from './camera'
import renderer from './renderer'
import scene from './scene'
import { updateMesh } from '../three/createMesh'
const clock=new THREE.Clock()
function animate(t){

  const time=clock.getDelta()
  ControlsModule.controls.update(time)
  updateMesh(time*2)
  renderer.render(scene,CameraModule.activeCamera)
  requestAnimationFrame(animate)
}
export default animate