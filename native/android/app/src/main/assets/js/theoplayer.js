function init({player}) {
  if (player) {
    var resolutions = [{name: '720p'}, {name: '480p'}, {name: '360p'}];
    var settingsMenu = player.ui.getChild('ControlBar').getChild('SettingsButton').menu;
    // Create custom quality sub menu
    var qualityMenuItem = settingsMenu.addSubMenuItem({
      index: 0,
    });
    var qualityMenuTitle = document.createElement('span');
    qualityMenuTitle.className = 'theo-settings-control-menu-item-title';
    qualityMenuTitle.innerHTML = 'Quality';
    var qualityMenuValue = document.createElement('span');
    qualityMenuValue.className = 'theo-settings-control-menu-item-value';
    qualityMenuItem.el().appendChild(qualityMenuTitle);
    qualityMenuItem.el().appendChild(qualityMenuValue);
    qualityMenuItem.subMenu.menuHeader.el().innerHTML = 'Quality';
    var qualityItems = resolutions.map(function (resolution) {
      var qualityItem = qualityMenuItem.subMenu.addMenuItem();
      qualityItem.el().innerHTML = resolution.name;
      qualityItem.on('click', function () {
        selectQuality(resolution);
      });
      return qualityItem;
    });

    // Getting the player/UI in the correct state
    function selectQuality(resolution) {
      qualityMenuValue.innerHTML = resolution.name;
      var qualityItem = qualityItems[resolutions.indexOf(resolution.name)];
      qualityItems.forEach(function (item) {
        item.selected(item === qualityItem);
      });
    }
    selectQuality(resolutions[0]);

    // Remove built-in quality sub menu
    settingsMenu.removeMenuItem(settingsMenu.menuItems[0]);
    // setting up the rewind button by setting up a video-js component
    var Button = THEOplayer.videojs.getComponent('Button');
    var RewindButton = THEOplayer.videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments);
        /* initialize your button */
        // this.el() = created DOM-element

        // add tooltip
        var tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'theo-button-tooltip vjs-hidden';
        tooltipSpan.innerText = 'Go back 10 seconds';
        function toggleTooltip() {
          tooltipSpan.classList.toggle('vjs-hidden');
        }
        this.el().addEventListener('mouseover', toggleTooltip);
        this.el().addEventListener('mouseout', toggleTooltip);
        this.el().appendChild(tooltipSpan);
      },
      handleClick: () => {
        player.currentTime -= 10;
      },
      buildCSSClass: function () {
        return 'fa fa-undo vjs-button'; // insert all class names here
      },
    });
    THEOplayer.videojs.registerComponent('RewindButton', RewindButton);
    player.ui.getChild('controlBar').addChild('RewindButton', {});

    // setting up the forward button by setting up a video-js component
    var Button = THEOplayer.videojs.getComponent('Button');
    var ForwardButton = THEOplayer.videojs.extend(Button, {
      constructor: function () {
        Button.apply(this, arguments);
        /* initialize your button */
        // this.el() = created DOM-element

        // add tooltip
        var tooltipSpan = document.createElement('span');
        tooltipSpan.className = 'theo-button-tooltip vjs-hidden';
        tooltipSpan.innerText = 'Go forward 10 seconds';
        function toggleTooltip() {
          tooltipSpan.classList.toggle('vjs-hidden');
        }
        this.el().addEventListener('mouseover', toggleTooltip);
        this.el().addEventListener('mouseout', toggleTooltip);
        this.el().appendChild(tooltipSpan);
      },
      handleClick: () => {
        player.currentTime += 10;
      },
      buildCSSClass: function () {
        return 'fa fa-redo vjs-button'; // insert all class names here
      },
    });
    THEOplayer.videojs.registerComponent('ForwardButton', ForwardButton);
    player.ui.getChild('controlBar').addChild('ForwardButton', {});
  }
}
