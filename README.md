# playcanvasScripts

Useful scripts for playcanvas

# description
* `look-camera.js`: Camera entity에서 사용. 360 이미지를 마우스나 터치로 볼 수 있다. https://developer.playcanvas.com/en/tutorials/360-lookaround-camera/
* `fly-camera.js`: Camera entity에서 사용. WASD(혹은 상하좌우화살표)키로 움직이고 마우스 이동으로 시점 전환하는 카메라
* `billboard.js`: 빈 Entity(Model Entity등을 가지고 있는)에서 사용. Camera라는 이름의 Entity를 찾아서 rotation을 동기화하여 시점과 상관없이 앞을 바라보게 한다.
* `camera-path.js`: Camera entity에서 사용. 카메라가 지나갈 위치를 찍어놓은 Entity들의 상위 Entity인 Camera Path Entity를 만들어 지정하여 사용한다. https://developer.playcanvas.com/en/tutorials/camera-following-a-path/
* `screenshot.js`: Model entity에서 사용. ui:takeScreenshot 이벤트로 trigger. canvas.toDATAURL()을 사용.
* `orbit-camera/`: Camera entity에서 사용. 터치나 마우스를 사용하여 특정 물체를 관찰하는데 사용. 확대/축소/회전 지원.
* `changing-scenes.js`: Camera entity에서 사용. 1초마다 지정한 Scene으로 변경한다.
* `switching-textures.js`: Model entity에서 사용. 1초간격으로 지정한 Textures property를 순환하며 변경한다.
* `animation-blending.js`: Model entity에서 사용. animation간 부드러운 연결을 구현한 예. https://developer.playcanvas.com/en/tutorials/animation-blending/
* `picker_framebuffer.js`: Camera entity에서 사용. framebuffer를 사용한 entity 선택 감지. pc.Picker 사용. 물리 라이브러리가 필요없지만 모바일 등에서 성능 문제가 있음.
* `picker_raycast.js`: Camera entity에서 사용. raycast를 사용한 entity 선택 감지. raycast을 from, to(camera의 nearClip~farClip) 사이를 선으로 연결(this.app.systems.rigidbody.raycastFirst)하여 처음 걸려드는 entity를 선택.
* `shape-picker.js`: Root entity에서 사용. 물리엔진 없이 intersectsRay를 사용하여 선택 감지. https://developer.playcanvas.com/en/tutorials/entity-picking-without-physics/
* `disable-contextmenu.js`: contextmenu(오른쪽 클릭)을 막는 script.