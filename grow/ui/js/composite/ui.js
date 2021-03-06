var grow = grow || {};
window.grow = grow;

(function(grow){
  var toolConfig = {};

  grow.ui = grow.ui || {};

  grow.ui.showNotice = function(text) {
    var notice = document.createElement('div');
    notice.classList.add('grow_tool__notice');

    if (text) {
      notice.appendChild(document.createTextNode(text));
    }

    document.body.appendChild(notice);
    return notice;
  };

  grow.ui.toolConfig = function(tool, options) {
    toolConfig[tool] = options;
  };

  grow.ui.tools = grow.ui.tools || [];
  grow.ui.main = function(settings) {
    var el = document.createElement('div');
    var buttonsEl = document.createElement('div');
    buttonsEl.setAttribute('class', 'grow__buttons');

    buttonsEl.appendChild(createButton_('primary', null, null, {
      'click': function() {
        buttonsEl.classList.toggle('grow__expand');
      }
    }));

    buttonsEl.appendChild(createButton_('close', null, null, {
      'click': function() {
        el.parentNode.removeChild(el);
      }
    }));

    if (settings.injectEditUrl) {
      buttonsEl.appendChild(
        createButton_('edit', 'Edit', settings.injectEditUrl));
    }

    if (settings.injectTranslateUrl) {
      buttonsEl.appendChild(createButton_(
        'translate', 'Translate', settings.injectTranslateUrl));
    }

    for(i in grow.ui.tools) {
      tool = grow.ui.tools[i];

      if (tool['init']) {
        tool['init'](toolConfig[tool['kind']] || {});
      }

      if (tool['button']) {
        buttonsEl.appendChild(createButton_(
          tool['kind'], tool['name'], tool['button']['link'] || null,
          tool['button']['events'] || {}));
      }
    }

    // If there is nothing to do, do not show the menu at all.
    if (buttonsEl.children.length <= 2) {
      return;
    }

    el.setAttribute('id', 'grow-utils');
    el.appendChild(buttonsEl);
    document.body.appendChild(el);
  };

  var createButton_ = function(kind, label, url, events) {
    var containerEl = document.createElement('div');
    containerEl.classList.add('grow__button');

    var buttonEl = document.createElement('a');
    buttonEl.classList.add('grow__icon');
    buttonEl.classList.add('grow__icon_' + kind);

    if (url) {
      buttonEl.setAttribute('href', url);
      buttonEl.setAttribute('target', '_blank');
    } else {
      buttonEl.setAttribute('href', 'javascript:void(0)');
    }

    if (events) {
      for (var prop in events) {
        buttonEl.addEventListener(prop, events[prop]);
      }
    }

    containerEl.appendChild(buttonEl);

    if (label) {
      var labelEl = document.createElement('p');
      labelEl.appendChild(document.createTextNode(label));
      labelEl.classList.add('grow__label');
      containerEl.appendChild(labelEl);
    }

    return containerEl;
  };
})(grow);
