window.addEventListener('load', () => {
  console.clear();


  // CONSTANS
  const RED = 'rgb(156, 52, 32)'
  const ORANGE = ' rgb(239,127,26)'
  const BLUE = 'rgb(10, 71, 102)'
  const WHITE = 'rgb(255,255,255)'

  //HTML ELEMENTS
  const canvasEl = document.querySelector('#container');
  const colorButtons = document.querySelectorAll('.toolbar__color');
  const actionButtons = document.querySelectorAll('.toolbar__button')
  const audio = document.querySelector('audio');
  const svgElements = document.querySelectorAll(".twarz");


  const positionInfo = canvasEl.getBoundingClientRect();
  const height = positionInfo.height;
  const width = positionInfo.width;


  const faceParts = []
  let currentNode = null;



  const handleColorButton = ({
    target: {
      dataset: {
        color
      }
    }
  }) => {
    switch (color) {
      case 'red':
        changeBackgroundColor(RED);
        changeTranformerBorderColor(WHITE);
        changeTextColor(WHITE)
        break;
      case 'orange':
        changeBackgroundColor(ORANGE);
        changeTranformerBorderColor(BLUE)
        changeTextColor(WHITE)
        break;
      case 'blue':
        changeBackgroundColor(BLUE);
        changeTranformerBorderColor(WHITE)
        changeTextColor(WHITE)

        break;
      case 'white':
        changeBackgroundColor(WHITE);
        changeTranformerBorderColor(BLUE);
        changeTextColor(BLUE)

        break;
    }
  }

  const handleActionButton = ({
    target: {
      dataset: {
        action: button
      }
    }
  }) => {

    switch (button) {
      case 'eraser':
        if (currentNode) {
          transformer.detach();
          currentNode.remove();
          layer.draw();
        }
        break;

      case 'trash':
        stage.clear()
        transformer.detach();
        layer.removeChildren()
        changeBackgroundColor(WHITE);
        changeTranformerBorderColor(BLUE);
        changeTextColor(BLUE)
        setup();
        break;

      case 'download':
        transformer.detach();
        layer.draw();
        alert(`Aby zapisać 📥
        1) kliknij prawym przyciskiem myszy na obrazie
        2) wybierz opcję "zapisz jako".`)
        break;

    }
  }

  const changeBackgroundColor = (color) => {
    rect.fill(color);
    layer.draw();
  }

  const changeTranformerBorderColor = (color) => {
    transformer.borderStroke(color);
    layer.draw();
  }

  const changeTextColor = (color) => {
    text.fill(color);
    layer.draw();
  }

  const getImageByID = ({
    id
  }) => {
    return document.querySelector(`img.preload#${id}`)
  }


  const makeFaceNode = element => {


    const faceElement = new Konva.Image({
      x: Math.random() * stage.width() / 3,
      y: Math.random() * stage.height() / 3,
      image: element,
      draggable: true,
      zIndex: 1
    });




    const selected = (node) => {
      transformer.nodes([node])
      node.zIndex(20)
      transformer.zIndex(20)
      text.zIndex(20)
      currentNode = node;
    }



    faceElement.on('mousedown', () => {
      selected(faceElement)
    })
    faceElement.on('touchstart', () => {
      selected(faceElement)
    })


    return faceElement

  }

  const setup = () => {
    layer.add(rect)
    layer.add(transformer)
    layer.add(text);
  }




  const stage = new Konva.Stage({
    container: 'container',
    // -10px for the border
    width: width - 10,
    height: height - 10
  });


  let layer = new Konva.Layer();


  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: WHITE
  })

  const transformer = new Konva.Transformer({
    keepRatio: true,
    enabledAnchors: [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right'
    ],
    padding: 2,
    borderDash: [5, 10]
  })

  const text = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black'
  });

  const init = () => {

    colorButtons.forEach(btn => {
      btn.addEventListener('click', handleColorButton)
    });

    actionButtons.forEach(btn => {
      btn.addEventListener('click', handleActionButton)
    })

    svgElements.forEach(el => {
      const contnetFaceParts = el.querySelectorAll(".face-part");
      contnetFaceParts.forEach(part => faceParts.push(part))
    })


    faceParts.forEach(part => {
      part.addEventListener('click', () => {
        const img = getImageByID(part);
        const node = makeFaceNode(img);
        layer.add(node);
        layer.draw();
        audio.play();
      })
    })

    stage.add(layer);
    setup();

    layer.draw()

  }
  init();
});