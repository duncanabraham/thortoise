document.addEventListener('DOMContentLoaded', function () {
  // Get the canvas element
  const canvas = document.getElementById('renderCanvas')

  // Load the 3D engine
  const engine = new BABYLON.Engine(canvas, true)

  // Create a basic scene
  const createScene = function () {
    const scene = new BABYLON.Scene(engine)

    // Create a FreeCamera
    // const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 8, -20), scene)
    const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 4, Math.PI / 4, 20, new BABYLON.Vector3(0, 0, 0), scene)

    // Target the camera towards scene origin
    camera.setTarget(BABYLON.Vector3.Zero())

    // Attach the camera to the canvas
    camera.attachControl(canvas, false)

    // Create a light
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)

    // Create blue material
    const blueMat = new BABYLON.StandardMaterial('blueMat', scene)
    blueMat.diffuseColor = new BABYLON.Color3(0, 0, 1)

    // Create cubes
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        for (let z = 0; z < 10; z++) {
          const box = BABYLON.Mesh.CreateBox(`box${x}${y}${z}`, 1.0, scene)
          box.position = new BABYLON.Vector3(x * 2, y * 2, z * 2)
          box.material = blueMat
        }
      }
    }

    return scene
  }

  // Create the scene
  const scene = createScene()

  // Run the render loop
  engine.runRenderLoop(function () {
    scene.render()
  })

  // Run the render loop
  engine.runRenderLoop(function () {
    scene.render()
  })

  // The canvas/window resize event handler
  window.addEventListener('resize', function () {
    engine.resize()
  })

  // The canvas/window resize event handler
  window.addEventListener('resize', function () {
    engine.resize()
  })
})
