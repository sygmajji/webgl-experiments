var camera, scene, renderer;
var cube, plane;
var myCanvas = document.getElementById('cube_canvas');
var width = 400;
var height = 300;

var manual = false; // Manual mode or automatic rotation
var cubeRotation = 0; // Store target current rotation
var cubeRotationOnMouseDown = 0; // Store rotation on mouse down event

var mouseX = 0; // Store mouse X position
var mouseXOnMouseDown = 0; // Store mouse X position on mouse down event

init();
renderLoop();

function init() {

	// Camera
    camera = new THREE.PerspectiveCamera( 70, width/height, 1, 1000 );
    camera.position.y = 150;
    camera.position.z = 500;
	
	// Scene
    scene = new THREE.Scene();

    // Cube
    var geometry = new THREE.BoxGeometry( 200, 200, 200 );
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );
    }
    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.y = 150;
    scene.add( cube );

    // Plane
    var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );

	// Renderer
    renderer = new THREE.WebGLRenderer( { canvas : myCanvas, antialias : true});
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( width, height );

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
}

function onDocumentMouseDown( event ) {
	
	var rect = myCanvas.getBoundingClientRect();
	
	if ( event.clientX > rect.left &&
         event.clientX < rect.right && 
	     event.clientY > rect.top &&
		 event.clientY < rect.bottom ){
		
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mouseout', onDocumentMouseOut, false );

		mouseXOnMouseDown = event.clientX ;
		cubeRotationOnMouseDown = cubeRotation;
		manual = true;
	}
}

function onDocumentMouseMove( event ) {
    mouseX = event.clientX ;
    cubeRotation = cubeRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function onDocumentMouseUp( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    manual = false;
}

function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    manual = false;
}

function renderLoop() {
	requestAnimationFrame(renderLoop);
    if (!manual) {
      cubeRotation += 0.025;
    }
    cube.rotation.y = cubeRotation;
    plane.rotation.y = cube.rotation.y;
    renderer.render( scene, camera );
}
