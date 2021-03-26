const video = document.getElementById('video');

/*Verificar si estan bien las direcciones, generalmente aqui hay un problema*/

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/reconocimiento/models/'),
	faceapi.nets.faceLandmark68Net.loadFromUri('/reconocimiento/models/'),
	faceapi.nets.faceRecognitionNet.loadFromUri('/reconocimiento/models/'),
	faceapi.nets.faceExpressionNet.loadFromUri('/reconocimiento/models/')
]).then(startVideo)

function startVideo(){
	navigator.getUserMedia(
		{ video: {} },
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}

video.addEventListener('play', () => {
	const canvas = faceapi.createCanvasFromMedia(video)
	document.body.append(canvas)
	const displaySize = { width: video.width, height: video.height }
	faceapi.matchDimensions(canvas, displaySize)
	setInterval(async () => {
	  const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
	  const resizedDetections = faceapi.resizeResults(detections, displaySize)
	  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
	  faceapi.draw.drawDetections(canvas, resizedDetections)
	  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
	  faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
	}, 100)
})