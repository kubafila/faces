// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/editor.js":[function(require,module,exports) {
window.addEventListener('load', function () {
  console.clear(); // CONSTANS

  var RED = 'rgb(156, 52, 32)';
  var ORANGE = ' rgb(239,127,26)';
  var BLUE = 'rgb(10, 71, 102)';
  var WHITE = 'rgb(255,255,255)'; //HTML ELEMENTS

  var canvasEl = document.querySelector('#container');
  var colorButtons = document.querySelectorAll('.toolbar__color');
  var actionButtons = document.querySelectorAll('.toolbar__button');
  var audio = document.querySelector('audio');
  var svgElements = document.querySelectorAll(".twarz");
  var positionInfo = canvasEl.getBoundingClientRect();
  var height = positionInfo.height;
  var width = positionInfo.width;
  var faceParts = [];
  var currentNode = null;

  var handleColorButton = function handleColorButton(_ref) {
    var color = _ref.target.dataset.color;

    switch (color) {
      case 'red':
        changeBackgroundColor(RED);
        changeTranformerBorderColor(WHITE);
        changeTextColor(WHITE);
        break;

      case 'orange':
        changeBackgroundColor(ORANGE);
        changeTranformerBorderColor(BLUE);
        changeTextColor(WHITE);
        break;

      case 'blue':
        changeBackgroundColor(BLUE);
        changeTranformerBorderColor(WHITE);
        changeTextColor(WHITE);
        break;

      case 'white':
        changeBackgroundColor(WHITE);
        changeTranformerBorderColor(BLUE);
        changeTextColor(BLUE);
        break;
    }
  };

  var handleActionButton = function handleActionButton(_ref2) {
    var button = _ref2.target.dataset.action;

    switch (button) {
      case 'eraser':
        if (currentNode) {
          transformer.detach();
          currentNode.remove();
          layer.draw();
        }

        break;

      case 'trash':
        stage.clear();
        transformer.detach();
        layer.removeChildren();
        changeBackgroundColor(WHITE);
        changeTranformerBorderColor(BLUE);
        changeTextColor(BLUE);
        setup();
        break;

      case 'download':
        transformer.detach();
        layer.draw();
        alert("Aby zapisa\u0107 \uD83D\uDCE5\n        1) kliknij prawym przyciskiem myszy na obrazie\n        2) wybierz opcj\u0119 \"zapisz jako\".");
        break;
    }
  };

  var changeBackgroundColor = function changeBackgroundColor(color) {
    rect.fill(color);
    layer.draw();
  };

  var changeTranformerBorderColor = function changeTranformerBorderColor(color) {
    transformer.borderStroke(color);
    layer.draw();
  };

  var changeTextColor = function changeTextColor(color) {
    text.fill(color);
    layer.draw();
  };

  var getImageByID = function getImageByID(_ref3) {
    var id = _ref3.id;
    return document.querySelector("img.preload#".concat(id));
  };

  var makeFaceNode = function makeFaceNode(element) {
    var faceElement = new Konva.Image({
      x: Math.random() * stage.width() / 3,
      y: Math.random() * stage.height() / 3,
      image: element,
      draggable: true,
      zIndex: 1
    });

    var selected = function selected(node) {
      transformer.nodes([node]);
      node.zIndex(20);
      transformer.zIndex(20);
      text.zIndex(20);
      currentNode = node;
    };

    faceElement.on('mousedown', function () {
      selected(faceElement);
    });
    faceElement.on('touchstart', function () {
      selected(faceElement);
    });
    return faceElement;
  };

  var setup = function setup() {
    layer.add(rect);
    layer.add(transformer);
    layer.add(text);
  };

  var stage = new Konva.Stage({
    container: 'container',
    // -10px for the border
    width: width - 10,
    height: height - 10
  });
  var layer = new Konva.Layer();
  var rect = new Konva.Rect({
    x: 0,
    y: 0,
    width: stage.width(),
    height: stage.height(),
    fill: WHITE
  });
  var transformer = new Konva.Transformer({
    keepRatio: true,
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    padding: 2,
    borderDash: [5, 10]
  });
  var text = new Konva.Text({
    x: 10,
    y: 10,
    fontFamily: 'Calibri',
    fontSize: 24,
    text: '',
    fill: 'black'
  });

  var init = function init() {
    colorButtons.forEach(function (btn) {
      btn.addEventListener('click', handleColorButton);
    });
    actionButtons.forEach(function (btn) {
      btn.addEventListener('click', handleActionButton);
    });
    svgElements.forEach(function (el) {
      var contnetFaceParts = el.querySelectorAll(".face-part");
      contnetFaceParts.forEach(function (part) {
        return faceParts.push(part);
      });
    });
    faceParts.forEach(function (part) {
      part.addEventListener('click', function () {
        var img = getImageByID(part);
        var node = makeFaceNode(img);
        layer.add(node);
        layer.draw();
        audio.play();
      });
    });
    stage.add(layer);
    setup();
    layer.draw();
  };

  init();
});
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61785" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/editor.js"], null)
//# sourceMappingURL=editor.37179466.js.map