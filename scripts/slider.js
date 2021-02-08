const arrow_left = document.querySelector('.slider__arrow-left')
const arrow_right = document.querySelector('.slider__arrow-right')


const slider_faces = document.querySelectorAll('.twarz')


const middleFaceIndex = Math.floor(slider_faces.length / 2);

let currentFaceIndex = 0;

slider_faces[currentFaceIndex].classList = ' twarz twarz--active'



const moveRight = () => {
  slider_faces[currentFaceIndex].classList = 'twarz twarz--right'

  currentFaceIndex--;
  if(currentFaceIndex < 0){
    currentFaceIndex = 0
    
  }

  slider_faces[currentFaceIndex].classList = 'twarz twarz--active'
}


const moveLeft = () => {
  
slider_faces[currentFaceIndex].classList = 'twarz twarz--left'

  currentFaceIndex++;
  if(currentFaceIndex >= slider_faces.length){
    currentFaceIndex = slider_faces.length -1
  }


  slider_faces[currentFaceIndex].classList = 'twarz twarz--active'

}



arrow_left.addEventListener('click', moveLeft)
arrow_right.addEventListener('click', moveRight)