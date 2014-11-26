'use strict';

angular.module('angular-side-menu', [
'ngTouch'
])

.factory('asideAPI', function () {

  var animProps,
  animPropsShow,
  animPropsHide,
  attributes,
  duration,
  side,
  shiftX,
  shiftY,
  menuShowed = false;

  var effects = {
    overlay: function (side) {
      var sidebar = getSelectedBlock("#sidebar"),
      swipeArea = getSelectedBlock(".swipe-area");

      if (menuShowed) {
        animProps[side] = getShiftValue(side) * -1;
        TweenLite.to(sidebar, duration, animProps);
        animPropsHide[side] = 0;
        TweenLite.to(swipeArea, duration, animPropsHide);
      } else {
        animProps[side] = 0;
        TweenLite.to(sidebar, duration, animProps);
        animPropsShow[side] = getShiftValue(side);
        TweenLite.to(swipeArea, duration, animPropsShow);
      }
    },
    push: function (side) {
      var contentBlock = getContentDiv(),
      sidebar = getSelectedBlock("#sidebar");

      if (menuShowed) {
        animProps[side] = 0;
        TweenLite.to(contentBlock, duration, animProps);
        animPropsHide[side] = getShiftValue(side) * -1;
        TweenLite.to(sidebar, duration, animPropsHide);
      } else {
        animProps[side] = getShiftValue(side);
        TweenLite.to(contentBlock, duration, animProps);
        animPropsShow[side] = 0;
        TweenLite.to(sidebar, duration, animPropsShow);
      }
    },
    reveal: function (side, scope) {
      var contentBlock = getContentDiv();

      if (menuShowed) {
        animPropsHide[side] = 0;
        TweenLite.to(contentBlock, duration, animPropsHide);
      } else {
        animPropsShow[side] = getShiftValue(side);
        TweenLite.to(contentBlock, duration, animPropsShow);
      }
    },
    bounce: function (side) {
      var t1, t2,
      step1Props,
      step2Props,
      sidebar = getSelectedBlock("#sidebar"),
      swipeArea = getSelectedBlock(".swipe-area");

      if (menuShowed) {
        step1Props = {};
        step2Props = {};

        t1 = new TimelineLite();
        t2 = new TimelineLite();

        step1Props[side] = 0;
        step2Props[side] = getShiftValue(side) * -1;
        t1.to(sidebar, duration, step1Props).to(sidebar, duration, step2Props);

        animProps[side] = getShiftValue(side);
        animPropsHide[side] = 0;
        t2.to(swipeArea, duration, animProps).to(swipeArea, duration, animPropsHide);
      } else {
        step1Props = {};
        step2Props = {};

        t1 = new TimelineLite();
        t2 = new TimelineLite();

        step1Props[side] = 0;
        step2Props[side] = -10;
        t1.to(sidebar, duration, step1Props).to(sidebar, duration, step2Props);

        animProps[side] = getShiftValue(side);
        animPropsShow[side] = getShiftValue(side) - 10;
        t2.to(swipeArea, duration, animProps).to(swipeArea, duration, animPropsShow);
      }
    }
  };

  function getAPI(attrs) {
    var effect = attrs.effectType;
    side = attrs.side;
    effects[effect](side);
  }

  function getContentDiv() {
    var contentSelector = attributes.contentId || "main-content";
    return document.querySelectorAll("#" + contentSelector)[0];
  }

  function getSelectedBlock(selector) {
    return document.querySelectorAll(selector)[0];
  }

  function getShiftValue(side) {
    var values = {left: shiftX, right: shiftX, top: shiftY, bottom: shiftY};
    return values[side];
  }

  function createPropsObject() {
    animProps = {};
    animPropsShow = {"onComplete": showCallback};
    animPropsHide = {"onComplete": hideCallback};
  }

  function hideCallback() {
    menuShowed = false;
  }

  function showCallback() {
    menuShowed = true;
  }

  return {
    initAnimationProps: function (attrs) {
      // set default ease equation for TweenLite
      TweenLite.defaultEase = Sine.easeInOut;
      // set animation properties
      shiftX = attrs.width || 240;
      shiftY = attrs.height || 240;
      duration = attrs.animationTime || 0.3;
    },

    showEffect: function () {
      // each time tap/click is emitting, we create empty animation property's objects
      createPropsObject();
      // depend on given attributes show appropriate effect
      if (attributes.effectType && attributes.side) {
        getAPI(attributes);
      } else if (attributes.side) {
        effects.overlay(attributes.side)
      } else if (attributes.effectType){
        effects[attributes.effectType]("left");
      } else {
        effects.overlay("left"); // default effect from left side
      }
    },

    cacheAttributes: function (attrs) {
      attributes = attrs;
    },

    setStyles: function (cssAttrs) {
      var value, side, sidebar = getSelectedBlock("#sidebar");
      var valueX = cssAttrs.width || undefined;
      var valueY = cssAttrs.height || undefined;

      side = attributes.side || "left";
      if (cssAttrs.width && (side === "left" || side === "right")) {
        value = formatToPx(valueX);
        sidebar.style.width = value;
        setSideShift();
      } else if (cssAttrs.height && (side === "top" || side === "bottom")) {
        value = formatToPx(valueY);
        sidebar.style.height = value;
        setSideShift();
      }

      function formatToPx(value){
        return typeof value === "number" ? value + "px" : value;
      }

      function setSideShift(){
        if (attributes.effectType !== "reveal") {
          sidebar.style[side] = "-" + value;
        }
      }

    }
  }
})

.directive('myAside', ['asideAPI', function (asideAPI) {

  return {
    restrict: 'A',
    templateUrl: './js/directives/templates/angular-menu-template.html',
    replace: true,
    transclude: true,
    scope: {
      menuItems: "=",
      properties: "="
    },
    link: function ($scope, element, attrs) {
      // cache attribute object for future use
      asideAPI.cacheAttributes(attrs);
      // define properties for the animation [sizes, animation time, etc]
      asideAPI.initAnimationProps($scope.properties);

      // add needed classes for css styles
      attrs.side && element.addClass("wrapper-" + attrs.side);
      attrs.effectType && element.addClass(attrs.effectType);

      // apply custom css height/width if properties were passed in html
      $scope.properties && asideAPI.setStyles($scope.properties);

      // click/swipe Handler
      $scope.toggleMenu = function () {
        asideAPI.showEffect();
      };
    }
  };
}])
