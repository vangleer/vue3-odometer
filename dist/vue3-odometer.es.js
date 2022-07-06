import { defineComponent, ref, watch, onMounted, onUnmounted, openBlock, createElementBlock } from "vue";
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
const funcTags = ["[object AsyncFunction]", "[object Function]", "[object GeneratorFunction]", "[object Proxy]"];
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  var tag = Object.prototype.toString.call(value);
  return funcTags.includes(tag);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var odometer = { exports: {} };
(function(module, exports) {
  (function() {
    var COUNT_FRAMERATE, COUNT_MS_PER_FRAME, DIGIT_FORMAT, DIGIT_HTML, DIGIT_SPEEDBOOST, DURATION, FORMAT_MARK_HTML, FORMAT_PARSER, FRAMERATE, FRAMES_PER_VALUE, MS_PER_FRAME, MutationObserver, Odometer2, RIBBON_HTML, TRANSITION_END_EVENTS, TRANSITION_SUPPORT, VALUE_HTML, addClass, createFromHTML, fractionalPart, now, removeClass, requestAnimationFrame, round, transitionCheckStyles, trigger, truncate, wrapJQuery, _jQueryWrapped, _old, _ref, _ref1, __slice = [].slice;
    VALUE_HTML = '<span class="odometer-value"></span>';
    RIBBON_HTML = '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' + VALUE_HTML + "</span></span>";
    DIGIT_HTML = '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' + RIBBON_HTML + "</span></span>";
    FORMAT_MARK_HTML = '<span class="odometer-formatting-mark"></span>';
    DIGIT_FORMAT = "(,ddd).dd";
    FORMAT_PARSER = /^\(?([^)]*)\)?(?:(.)(d+))?$/;
    FRAMERATE = 30;
    DURATION = 2e3;
    COUNT_FRAMERATE = 20;
    FRAMES_PER_VALUE = 2;
    DIGIT_SPEEDBOOST = 0.5;
    MS_PER_FRAME = 1e3 / FRAMERATE;
    COUNT_MS_PER_FRAME = 1e3 / COUNT_FRAMERATE;
    TRANSITION_END_EVENTS = "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd";
    transitionCheckStyles = document.createElement("div").style;
    TRANSITION_SUPPORT = transitionCheckStyles.transition != null || transitionCheckStyles.webkitTransition != null || transitionCheckStyles.mozTransition != null || transitionCheckStyles.oTransition != null;
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    createFromHTML = function(html) {
      var el;
      el = document.createElement("div");
      el.innerHTML = html;
      return el.children[0];
    };
    removeClass = function(el, name) {
      return el.className = el.className.replace(new RegExp("(^| )" + name.split(" ").join("|") + "( |$)", "gi"), " ");
    };
    addClass = function(el, name) {
      removeClass(el, name);
      return el.className += " " + name;
    };
    trigger = function(el, name) {
      var evt;
      if (document.createEvent != null) {
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(name, true, true);
        return el.dispatchEvent(evt);
      }
    };
    now = function() {
      var _ref2, _ref12;
      return (_ref2 = (_ref12 = window.performance) != null ? typeof _ref12.now === "function" ? _ref12.now() : void 0 : void 0) != null ? _ref2 : +new Date();
    };
    round = function(val, precision) {
      if (precision == null) {
        precision = 0;
      }
      if (!precision) {
        return Math.round(val);
      }
      val *= Math.pow(10, precision);
      val += 0.5;
      val = Math.floor(val);
      return val /= Math.pow(10, precision);
    };
    truncate = function(val) {
      if (val < 0) {
        return Math.ceil(val);
      } else {
        return Math.floor(val);
      }
    };
    fractionalPart = function(val) {
      return val - round(val);
    };
    _jQueryWrapped = false;
    (wrapJQuery = function() {
      var property, _i, _len, _ref2, _results;
      if (_jQueryWrapped) {
        return;
      }
      if (window.jQuery != null) {
        _jQueryWrapped = true;
        _ref2 = ["html", "text"];
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          property = _ref2[_i];
          _results.push(function(property2) {
            var old;
            old = window.jQuery.fn[property2];
            return window.jQuery.fn[property2] = function(val) {
              var _ref12;
              if (val == null || ((_ref12 = this[0]) != null ? _ref12.odometer : void 0) == null) {
                return old.apply(this, arguments);
              }
              return this[0].odometer.update(val);
            };
          }(property));
        }
        return _results;
      }
    })();
    setTimeout(wrapJQuery, 0);
    Odometer2 = function() {
      function Odometer3(options) {
        var k, property, v, _base, _i, _len, _ref2, _ref12, _ref22, _this = this;
        this.options = options;
        this.el = this.options.el;
        if (this.el.odometer != null) {
          return this.el.odometer;
        }
        this.el.odometer = this;
        _ref2 = Odometer3.options;
        for (k in _ref2) {
          v = _ref2[k];
          if (this.options[k] == null) {
            this.options[k] = v;
          }
        }
        if ((_base = this.options).duration == null) {
          _base.duration = DURATION;
        }
        this.MAX_VALUES = this.options.duration / MS_PER_FRAME / FRAMES_PER_VALUE | 0;
        this.resetFormat();
        this.value = this.cleanValue((_ref12 = this.options.value) != null ? _ref12 : "");
        this.renderInside();
        this.render();
        try {
          _ref22 = ["innerHTML", "innerText", "textContent"];
          for (_i = 0, _len = _ref22.length; _i < _len; _i++) {
            property = _ref22[_i];
            if (this.el[property] != null) {
              (function(property2) {
                return Object.defineProperty(_this.el, property2, {
                  get: function() {
                    var _ref3;
                    if (property2 === "innerHTML") {
                      return _this.inside.outerHTML;
                    } else {
                      return (_ref3 = _this.inside.innerText) != null ? _ref3 : _this.inside.textContent;
                    }
                  },
                  set: function(val) {
                    return _this.update(val);
                  }
                });
              })(property);
            }
          }
        } catch (_error) {
          this.watchForMutations();
        }
      }
      Odometer3.prototype.renderInside = function() {
        this.inside = document.createElement("div");
        this.inside.className = "odometer-inside";
        this.el.innerHTML = "";
        return this.el.appendChild(this.inside);
      };
      Odometer3.prototype.watchForMutations = function() {
        var _this = this;
        if (MutationObserver == null) {
          return;
        }
        try {
          if (this.observer == null) {
            this.observer = new MutationObserver(function(mutations) {
              var newVal;
              newVal = _this.el.innerText;
              _this.renderInside();
              _this.render(_this.value);
              return _this.update(newVal);
            });
          }
          this.watchMutations = true;
          return this.startWatchingMutations();
        } catch (_error) {
        }
      };
      Odometer3.prototype.startWatchingMutations = function() {
        if (this.watchMutations) {
          return this.observer.observe(this.el, {
            childList: true
          });
        }
      };
      Odometer3.prototype.stopWatchingMutations = function() {
        var _ref2;
        return (_ref2 = this.observer) != null ? _ref2.disconnect() : void 0;
      };
      Odometer3.prototype.cleanValue = function(val) {
        var _ref2;
        if (typeof val === "string") {
          val = val.replace((_ref2 = this.format.radix) != null ? _ref2 : ".", "<radix>");
          val = val.replace(/[.,]/g, "");
          val = val.replace("<radix>", ".");
          val = parseFloat(val, 10) || 0;
        }
        return round(val, this.format.precision);
      };
      Odometer3.prototype.bindTransitionEnd = function() {
        var event, renderEnqueued, _i, _len, _ref2, _results, _this = this;
        if (this.transitionEndBound) {
          return;
        }
        this.transitionEndBound = true;
        renderEnqueued = false;
        _ref2 = TRANSITION_END_EVENTS.split(" ");
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          event = _ref2[_i];
          _results.push(this.el.addEventListener(event, function() {
            if (renderEnqueued) {
              return true;
            }
            renderEnqueued = true;
            setTimeout(function() {
              _this.render();
              renderEnqueued = false;
              return trigger(_this.el, "odometerdone");
            }, 0);
            return true;
          }, false));
        }
        return _results;
      };
      Odometer3.prototype.resetFormat = function() {
        var format, fractional, parsed, precision, radix, repeating, _ref2, _ref12;
        format = (_ref2 = this.options.format) != null ? _ref2 : DIGIT_FORMAT;
        format || (format = "d");
        parsed = FORMAT_PARSER.exec(format);
        if (!parsed) {
          throw new Error("Odometer: Unparsable digit format");
        }
        _ref12 = parsed.slice(1, 4), repeating = _ref12[0], radix = _ref12[1], fractional = _ref12[2];
        precision = (fractional != null ? fractional.length : void 0) || 0;
        return this.format = {
          repeating,
          radix,
          precision
        };
      };
      Odometer3.prototype.render = function(value) {
        var classes, cls, match, newClasses, theme, _i, _len;
        if (value == null) {
          value = this.value;
        }
        this.stopWatchingMutations();
        this.resetFormat();
        this.inside.innerHTML = "";
        theme = this.options.theme;
        classes = this.el.className.split(" ");
        newClasses = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          cls = classes[_i];
          if (!cls.length) {
            continue;
          }
          if (match = /^odometer-theme-(.+)$/.exec(cls)) {
            theme = match[1];
            continue;
          }
          if (/^odometer(-|$)/.test(cls)) {
            continue;
          }
          newClasses.push(cls);
        }
        newClasses.push("odometer");
        if (!TRANSITION_SUPPORT) {
          newClasses.push("odometer-no-transitions");
        }
        if (theme) {
          newClasses.push("odometer-theme-" + theme);
        } else {
          newClasses.push("odometer-auto-theme");
        }
        this.el.className = newClasses.join(" ");
        this.ribbons = {};
        this.formatDigits(value);
        return this.startWatchingMutations();
      };
      Odometer3.prototype.formatDigits = function(value) {
        var digit, valueDigit, valueString, wholePart, _i, _j, _len, _len1, _ref2, _ref12;
        this.digits = [];
        if (this.options.formatFunction) {
          valueString = this.options.formatFunction(value);
          _ref2 = valueString.split("").reverse();
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            valueDigit = _ref2[_i];
            if (valueDigit.match(/0-9/)) {
              digit = this.renderDigit();
              digit.querySelector(".odometer-value").innerHTML = valueDigit;
              this.digits.push(digit);
              this.insertDigit(digit);
            } else {
              this.addSpacer(valueDigit);
            }
          }
        } else {
          wholePart = !this.format.precision || !fractionalPart(value) || false;
          _ref12 = value.toString().split("").reverse();
          for (_j = 0, _len1 = _ref12.length; _j < _len1; _j++) {
            digit = _ref12[_j];
            if (digit === ".") {
              wholePart = true;
            }
            this.addDigit(digit, wholePart);
          }
        }
      };
      Odometer3.prototype.update = function(newValue) {
        var diff, _this = this;
        newValue = this.cleanValue(newValue);
        if (!(diff = newValue - this.value)) {
          return;
        }
        removeClass(this.el, "odometer-animating-up odometer-animating-down odometer-animating");
        if (diff > 0) {
          addClass(this.el, "odometer-animating-up");
        } else {
          addClass(this.el, "odometer-animating-down");
        }
        this.stopWatchingMutations();
        this.animate(newValue);
        this.startWatchingMutations();
        setTimeout(function() {
          _this.el.offsetHeight;
          return addClass(_this.el, "odometer-animating");
        }, 0);
        return this.value = newValue;
      };
      Odometer3.prototype.renderDigit = function() {
        return createFromHTML(DIGIT_HTML);
      };
      Odometer3.prototype.insertDigit = function(digit, before) {
        if (before != null) {
          return this.inside.insertBefore(digit, before);
        } else if (!this.inside.children.length) {
          return this.inside.appendChild(digit);
        } else {
          return this.inside.insertBefore(digit, this.inside.children[0]);
        }
      };
      Odometer3.prototype.addSpacer = function(chr, before, extraClasses) {
        var spacer;
        spacer = createFromHTML(FORMAT_MARK_HTML);
        spacer.innerHTML = chr;
        if (extraClasses) {
          addClass(spacer, extraClasses);
        }
        return this.insertDigit(spacer, before);
      };
      Odometer3.prototype.addDigit = function(value, repeating) {
        var chr, digit, resetted, _ref2;
        if (repeating == null) {
          repeating = true;
        }
        if (value === "-") {
          return this.addSpacer(value, null, "odometer-negation-mark");
        }
        if (value === ".") {
          return this.addSpacer((_ref2 = this.format.radix) != null ? _ref2 : ".", null, "odometer-radix-mark");
        }
        if (repeating) {
          resetted = false;
          while (true) {
            if (!this.format.repeating.length) {
              if (resetted) {
                throw new Error("Bad odometer format without digits");
              }
              this.resetFormat();
              resetted = true;
            }
            chr = this.format.repeating[this.format.repeating.length - 1];
            this.format.repeating = this.format.repeating.substring(0, this.format.repeating.length - 1);
            if (chr === "d") {
              break;
            }
            this.addSpacer(chr);
          }
        }
        digit = this.renderDigit();
        digit.querySelector(".odometer-value").innerHTML = value;
        this.digits.push(digit);
        return this.insertDigit(digit);
      };
      Odometer3.prototype.animate = function(newValue) {
        if (!TRANSITION_SUPPORT || this.options.animation === "count") {
          return this.animateCount(newValue);
        } else {
          return this.animateSlide(newValue);
        }
      };
      Odometer3.prototype.animateCount = function(newValue) {
        var cur, diff, last, start, tick, _this = this;
        if (!(diff = +newValue - this.value)) {
          return;
        }
        start = last = now();
        cur = this.value;
        return (tick = function() {
          var delta, dist, fraction;
          if (now() - start > _this.options.duration) {
            _this.value = newValue;
            _this.render();
            trigger(_this.el, "odometerdone");
            return;
          }
          delta = now() - last;
          if (delta > COUNT_MS_PER_FRAME) {
            last = now();
            fraction = delta / _this.options.duration;
            dist = diff * fraction;
            cur += dist;
            _this.render(Math.round(cur));
          }
          if (requestAnimationFrame != null) {
            return requestAnimationFrame(tick);
          } else {
            return setTimeout(tick, COUNT_MS_PER_FRAME);
          }
        })();
      };
      Odometer3.prototype.getDigitCount = function() {
        var i, max, value, values, _i, _len;
        values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
          value = values[i];
          values[i] = Math.abs(value);
        }
        max = Math.max.apply(Math, values);
        return Math.ceil(Math.log(max + 1) / Math.log(10));
      };
      Odometer3.prototype.getFractionalDigitCount = function() {
        var i, parser, parts, value, values, _i, _len;
        values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        parser = /^\-?\d*\.(\d*?)0*$/;
        for (i = _i = 0, _len = values.length; _i < _len; i = ++_i) {
          value = values[i];
          values[i] = value.toString();
          parts = parser.exec(values[i]);
          if (parts == null) {
            values[i] = 0;
          } else {
            values[i] = parts[1].length;
          }
        }
        return Math.max.apply(Math, values);
      };
      Odometer3.prototype.resetDigits = function() {
        this.digits = [];
        this.ribbons = [];
        this.inside.innerHTML = "";
        return this.resetFormat();
      };
      Odometer3.prototype.animateSlide = function(newValue) {
        var boosted, cur, diff, digitCount, digits, dist, end, fractionalCount, frame, frames, i, incr, j, mark, numEl, oldValue, start, _base, _i, _k, _l, _len, _len1, _len2, _m, _ref2, _results;
        oldValue = this.value;
        fractionalCount = this.getFractionalDigitCount(oldValue, newValue);
        if (fractionalCount) {
          newValue = newValue * Math.pow(10, fractionalCount);
          oldValue = oldValue * Math.pow(10, fractionalCount);
        }
        if (!(diff = newValue - oldValue)) {
          return;
        }
        this.bindTransitionEnd();
        digitCount = this.getDigitCount(oldValue, newValue);
        digits = [];
        boosted = 0;
        for (i = _i = 0; 0 <= digitCount ? _i < digitCount : _i > digitCount; i = 0 <= digitCount ? ++_i : --_i) {
          start = truncate(oldValue / Math.pow(10, digitCount - i - 1));
          end = truncate(newValue / Math.pow(10, digitCount - i - 1));
          dist = end - start;
          if (Math.abs(dist) > this.MAX_VALUES) {
            frames = [];
            incr = dist / (this.MAX_VALUES + this.MAX_VALUES * boosted * DIGIT_SPEEDBOOST);
            cur = start;
            while (dist > 0 && cur < end || dist < 0 && cur > end) {
              frames.push(Math.round(cur));
              cur += incr;
            }
            if (frames[frames.length - 1] !== end) {
              frames.push(end);
            }
            boosted++;
          } else {
            frames = function() {
              _results = [];
              for (var _j = start; start <= end ? _j <= end : _j >= end; start <= end ? _j++ : _j--) {
                _results.push(_j);
              }
              return _results;
            }.apply(this);
          }
          for (i = _k = 0, _len = frames.length; _k < _len; i = ++_k) {
            frame = frames[i];
            frames[i] = Math.abs(frame % 10);
          }
          digits.push(frames);
        }
        this.resetDigits();
        _ref2 = digits.reverse();
        for (i = _l = 0, _len1 = _ref2.length; _l < _len1; i = ++_l) {
          frames = _ref2[i];
          if (!this.digits[i]) {
            this.addDigit(" ", i >= fractionalCount);
          }
          if ((_base = this.ribbons)[i] == null) {
            _base[i] = this.digits[i].querySelector(".odometer-ribbon-inner");
          }
          this.ribbons[i].innerHTML = "";
          if (diff < 0) {
            frames = frames.reverse();
          }
          for (j = _m = 0, _len2 = frames.length; _m < _len2; j = ++_m) {
            frame = frames[j];
            numEl = document.createElement("div");
            numEl.className = "odometer-value";
            numEl.innerHTML = frame;
            this.ribbons[i].appendChild(numEl);
            if (j === frames.length - 1) {
              addClass(numEl, "odometer-last-value");
            }
            if (j === 0) {
              addClass(numEl, "odometer-first-value");
            }
          }
        }
        if (start < 0) {
          this.addDigit("-");
        }
        mark = this.inside.querySelector(".odometer-radix-mark");
        if (mark != null) {
          mark.parent.removeChild(mark);
        }
        if (fractionalCount) {
          return this.addSpacer(this.format.radix, this.digits[fractionalCount - 1], "odometer-radix-mark");
        }
      };
      return Odometer3;
    }();
    Odometer2.options = (_ref = window.odometerOptions) != null ? _ref : {};
    setTimeout(function() {
      var k, v, _base, _ref12, _results;
      if (window.odometerOptions) {
        _ref12 = window.odometerOptions;
        _results = [];
        for (k in _ref12) {
          v = _ref12[k];
          _results.push((_base = Odometer2.options)[k] != null ? (_base = Odometer2.options)[k] : _base[k] = v);
        }
        return _results;
      }
    }, 0);
    Odometer2.init = function() {
      var el, elements, _i, _len, _ref12, _results;
      if (document.querySelectorAll == null) {
        return;
      }
      elements = document.querySelectorAll(Odometer2.options.selector || ".odometer");
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        _results.push(el.odometer = new Odometer2({
          el,
          value: (_ref12 = el.innerText) != null ? _ref12 : el.textContent
        }));
      }
      return _results;
    };
    if (((_ref1 = document.documentElement) != null ? _ref1.doScroll : void 0) != null && document.createEventObject != null) {
      _old = document.onreadystatechange;
      document.onreadystatechange = function() {
        if (document.readyState === "complete" && Odometer2.options.auto !== false) {
          Odometer2.init();
        }
        return _old != null ? _old.apply(this, arguments) : void 0;
      };
    } else {
      document.addEventListener("DOMContentLoaded", function() {
        if (Odometer2.options.auto !== false) {
          return Odometer2.init();
        }
      }, false);
    }
    if (exports !== null) {
      module.exports = Odometer2;
    } else {
      window.Odometer = Odometer2;
    }
  }).call(commonjsGlobal);
})(odometer, odometer.exports);
var Odometer = odometer.exports;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Odometer",
  props: {
    value: {
      type: Number,
      required: false,
      default: 0
    },
    format: {
      type: String,
      required: false
    },
    theme: {
      type: String,
      required: false,
      default: "default"
    },
    duration: {
      type: Number,
      required: false
    },
    animation: {
      type: String,
      required: false
    },
    formatFunction: {
      type: Function,
      required: false
    }
  },
  emits: ["ready"],
  setup(__props, { expose, emit }) {
    const props = __props;
    const instance = ref(null);
    const numRef = ref(null);
    watch(() => props.value, (value) => {
      if (instance.value && isFunction(instance.value.update)) {
        instance.value.update(value);
      }
    }, {
      deep: false
    });
    function auto() {
      if (typeof window === "undefined") {
        return;
      }
      if (window.odometerOptions) {
        window.odometerOptions["auto"] = false;
      } else {
        window.odometerOptions = {
          auto: false
        };
      }
    }
    function init() {
      if (instance.value) {
        return;
      }
      auto();
      const current = new Odometer({
        el: numRef.value,
        value: props.value,
        format: props.format,
        theme: props.theme,
        duration: props.duration,
        animation: props.animation,
        formatFunction: props.formatFunction
      });
      current.render();
      emit("ready", current, Odometer);
      instance.value = current;
    }
    function uninit() {
      instance.value = null;
    }
    function renderInside() {
      if (instance.value && isFunction(instance.value.renderInside)) {
        instance.value.renderInside();
      }
    }
    function watchForMutations() {
      if (instance.value && isFunction(instance.value.watchForMutations)) {
        instance.value.watchForMutations();
      }
    }
    function startWatchingMutations() {
      if (instance.value && isFunction(instance.value.startWatchingMutations)) {
        instance.value.startWatchingMutations();
      }
    }
    function stopWatchingMutations() {
      if (instance.value && isFunction(instance.value.stopWatchingMutations)) {
        instance.value.stopWatchingMutations();
      }
    }
    function cleanValue(val) {
      if (instance.value && isFunction(instance.value.cleanValue)) {
        instance.value.cleanValue(val);
      }
    }
    function bindTransitionEnd() {
      if (instance.value && isFunction(instance.value.bindTransitionEnd)) {
        instance.value.bindTransitionEnd();
      }
    }
    function resetFormat() {
      if (instance.value && isFunction(instance.value.resetFormat)) {
        instance.value.resetFormat();
      }
    }
    function renderDigit() {
      if (instance.value && isFunction(instance.value.renderDigit)) {
        instance.value.renderDigit();
      }
    }
    function formatDigits(value) {
      if (instance.value && isFunction(instance.value.formatDigits)) {
        instance.value.formatDigits(value);
      }
    }
    function insertDigit(digit, before) {
      if (instance.value && isFunction(instance.value.insertDigit)) {
        instance.value.insertDigit(digit, before);
      }
    }
    function addDigit(value, repeating) {
      if (instance.value && isFunction(instance.value.addDigit)) {
        instance.value.addDigit(value, repeating);
      }
    }
    function addSpacer(chr, before, extraClasses) {
      if (instance.value && isFunction(instance.value.addSpacer)) {
        instance.value.addSpacer(chr, before, extraClasses);
      }
    }
    function animate(newValue) {
      if (instance.value && isFunction(instance.value.animate)) {
        instance.value.animate(newValue);
      }
    }
    function animateCount(newValue) {
      if (instance.value && isFunction(instance.value.animateCount)) {
        instance.value.animateCount(newValue);
      }
    }
    function getDigitCount() {
      if (instance.value && isFunction(instance.value.getDigitCount)) {
        instance.value.getDigitCount();
      }
    }
    function getFractionalDigitCount() {
      if (instance.value && isFunction(instance.value.getFractionalDigitCount)) {
        instance.value.getFractionalDigitCount();
      }
    }
    function resetDigits() {
      if (instance.value && isFunction(instance.value.resetDigits)) {
        instance.value.resetDigits();
      }
    }
    function animateSlide(value) {
      if (instance.value && isFunction(instance.value.animateSlide)) {
        instance.value.animateSlide(value);
      }
    }
    function render(value) {
      if (instance.value && isFunction(instance.value.render)) {
        instance.value.render(value);
      }
    }
    function update(newVal) {
      if (instance.value && isFunction(instance.value.update)) {
        instance.value.update(newVal);
      }
    }
    onMounted(() => {
      init();
    });
    onUnmounted(() => {
      uninit();
    });
    expose({
      instance,
      init,
      uninit,
      renderInside,
      watchForMutations,
      startWatchingMutations,
      stopWatchingMutations,
      cleanValue,
      bindTransitionEnd,
      resetFormat,
      renderDigit,
      formatDigits,
      insertDigit,
      addDigit,
      addSpacer,
      animate,
      animateCount,
      getDigitCount,
      getFractionalDigitCount,
      resetDigits,
      animateSlide,
      render,
      update
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        ref_key: "numRef",
        ref: numRef
      }, null, 512);
    };
  }
});
export { _sfc_main as Odometer, _sfc_main as default };
