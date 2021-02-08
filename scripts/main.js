
const faces = document.querySelectorAll('.face');
const popup = document.querySelector('.popup');
const popupCloseBtn = document.querySelector('.popup__close');

const main = document.querySelector('.faces')

const nav = document.querySelector('nav');


faces.forEach(face => face.addEventListener('click', ({target}) => {
  const type = getTypeOfFace(target);
  
  popup.classList = "popup";
  popup.classList.add(getPopupClassName(type));
  popup.classList.add('popup--visible');
  main.classList.add('menu--hidden');
  nav.classList.add('nav--hidden');
  
}))

popupCloseBtn.addEventListener('click', ()=>{
  
    main.classList.remove('menu--hidden');
    nav.classList.remove('nav--hidden');
    popup.classList.remove('popup--visible');

    
})

const getTypeOfFace = (face) => {
  return face.dataset.face
}

const getPopupClassName = (type) =>{

  return `popup--${type}`
  
}