// Generated by CoffeeScript 1.6.2
(function() {
  var Puzzle, Square, arraySwap, countInversions, getHeight, getLeft, getPosX, getPosY, getTop, getWidth, int, runOnceAt, slowlyMove, swap;

  countInversions = function(array) {
    var n;

    if (array.length <= 1) {
      return 0;
    }
    return countInversions(array.slice(1)) + ((function() {
      var _i, _len, _results;

      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        n = array[_i];
        if (array[0] > n) {
          _results.push(n);
        }
      }
      return _results;
    })()).length;
  };

  runOnceAt = function(at, callback) {
    var n, once;

    n = 0;
    once = function() {
      n += 1;
      if (n === at) {
        return callback.apply(this, arguments);
      }
    };
    return once;
  };

  arraySwap = function(array, x, y) {
    var c;

    c = array[x];
    array[x] = array[y];
    return array[y] = c;
  };

  int = function(obj) {
    if (toString.call(obj) === '[object String]') {
      return parseInt(obj, 10);
    }
    return obj;
  };

  getWidth = function(col) {
    if (col <= this.colResidual) {
      return this.sqWidth + 1;
    } else {
      return this.sqWidth;
    }
  };

  getHeight = function(row) {
    if (row <= this.rowResidual) {
      return this.sqHeight + 1;
    } else {
      return this.sqHeight;
    }
  };

  getLeft = function(col) {
    return (col - 1) * (this.sqWidth + this.spacing) + (col <= this.colResidual ? col - 1 : this.colResidual);
  };

  getTop = function(row) {
    return (row - 1) * (this.sqHeight + this.spacing) + (row <= this.rowResidual ? row - 1 : this.rowResidual);
  };

  getPosX = function(origCol, col) {
    var posX;

    posX = -1 * getLeft.call(this, origCol);
    if ((col != null) && origCol === this.cols && col <= this.colResidual) {
      posX += 1;
    }
    return posX;
  };

  getPosY = function(origRow, row) {
    var posY;

    posY = -1 * getTop.call(this, origRow);
    if ((row != null) && origRow === this.rows && row <= this.rowResidual) {
      posY += 1;
    }
    return posY;
  };

  slowlyMove = function(row, col, callback) {
    var css, moveCallback,
      _this = this;

    css = {
      left: getLeft.call(this.puzzle, col),
      top: getTop.call(this.puzzle, row),
      height: getHeight.call(this.puzzle, row),
      width: getWidth.call(this.puzzle, col)
    };
    moveCallback = function() {
      var posX, posY;

      _this.puzzle.status.moving -= 1;
      if (_this.origCol === _this.puzzle.cols || _this.origRow === _this.puzzle.rows) {
        posX = getPosX.call(_this.puzzle, _this.origCol, col);
        posY = getPosY.call(_this.puzzle, _this.origRow, row);
        css = {};
        css['background-position'] = "" + (posX.toString()) + "px " + (posY.toString()) + "px";
        if (_this.origCol === _this.puzzle.cols) {
          css['background-position-x'] = posX;
        }
        if (_this.origRow === _this.puzzle.rows) {
          css['background-position-y'] = posY;
        }
        _this.div.css(css);
      }
      return callback != null ? callback.apply(_this) : void 0;
    };
    this.puzzle.status.moving += 1;
    return this.div.animate(css, moveCallback);
  };

  swap = function(row, col) {
    var square;

    if (this.row === row && this.col === col) {
      return this;
    }
    square = this.puzzle.squareMatrix[row][col];
    if (row === this.origRow && col === this.origCol) {
      this.puzzle.incompletions -= 1;
    } else if (this.row === this.origRow && this.col === this.origCol) {
      this.puzzle.incompletions += 1;
    }
    if (square) {
      if (this.row === square.origRow && this.col === square.origCol) {
        this.puzzle.incompletions -= 1;
      } else if (square.row === square.origRow && square.col === square.origCol) {
        this.puzzle.incompletions += 1;
      }
    }
    this.puzzle.squareMatrix[row][col] = this;
    this.puzzle.squareMatrix[this.row][this.col] = square;
    if (square) {
      square.row = this.row;
      square.col = this.col;
    } else {
      this.puzzle.emptyRow = this.row;
      this.puzzle.emptyCol = this.col;
    }
    this.row = row;
    this.col = col;
    return this;
  };

  Square = (function() {
    var stepCallback;

    function Square(id, puzzle, row, col) {
      this.id = id;
      this.origRow = this.row = row;
      this.origCol = this.col = col;
      this.puzzle = puzzle;
      this.bindings = {
        one: {},
        always: {},
        proxy: {}
      };
      this.div = $('<div></div>');
      this.puzzle.board.append(this.div);
      this.redraw();
      this.div.data('id', id);
      return this;
    }

    Square.prototype.redraw = function() {
      var css, posX, posY;

      posX = getPosX.call(this.puzzle, this.origCol, this.col);
      posY = getPosY.call(this.puzzle, this.origRow, this.row);
      css = {
        position: 'absolute',
        left: getLeft.call(this.puzzle, this.col),
        top: getTop.call(this.puzzle, this.row),
        width: getWidth.call(this.puzzle, this.col),
        height: getHeight.call(this.puzzle, this.row),
        'background-image': this.puzzle.image,
        'background-position-x': posX,
        'background-position-y': posY,
        'background-position': "" + (posX.toString()) + "px " + (posY.toString()) + "px"
      };
      this.div.css(css);
      return this;
    };

    Square.prototype.isMovable = function() {
      var movable;

      if (this.puzzle.emptyCol === this.col) {
        movable = this.puzzle.emptyRow === this.row - 1 || this.puzzle.emptyRow - 1 === this.row;
      } else if (this.puzzle.emptyRow === this.row) {
        movable = this.puzzle.emptyCol === this.col - 1 || this.puzzle.emptyCol - 1 === this.col;
      } else {
        movable = false;
      }
      return movable;
    };

    Square.prototype.swap = function(row, col, callback) {
      var dest;

      dest = this.puzzle.squareMatrix[row][col];
      swap.call(this, row, col);
      if (dest) {
        callback = callback && runOnceAt(2, callback);
        slowlyMove.call(dest, dest.row, dest.col, callback);
      }
      slowlyMove.call(this, this.row, this.col, callback);
      return this;
    };

    stepCallback = function(callback) {
      var _this = this;

      return function() {
        if (callback != null) {
          callback.apply(_this);
        }
        _this.trigger('step');
        if (_this.puzzle.isComplete() && _this.puzzle.status.moving === 0) {
          return _this.puzzle.trigger('done');
        }
      };
    };

    Square.prototype.step = function(callback) {
      if (this.isMovable()) {
        callback = stepCallback.call(this, callback);
        this.swap(this.puzzle.emptyRow, this.puzzle.emptyCol, callback);
      }
      return this;
    };

    Square.prototype.steps = function(callback) {
      var col, once, row, _i, _j, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;

      callback = stepCallback.call(this, callback);
      if (this.puzzle.emptyCol === this.col) {
        once = runOnceAt(Math.abs(this.puzzle.emptyRow - this.row), callback);
        for (row = _i = _ref = this.puzzle.emptyRow, _ref1 = this.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
          if ((_ref2 = this.puzzle.squareMatrix[row][this.col]) != null) {
            _ref2.swap(this.puzzle.emptyRow, this.puzzle.emptyCol, once);
          }
        }
      } else if (this.puzzle.emptyRow === this.row) {
        once = runOnceAt(Math.abs(this.puzzle.emptyCol - this.col), callback);
        for (col = _j = _ref3 = this.puzzle.emptyCol, _ref4 = this.col; _ref3 <= _ref4 ? _j <= _ref4 : _j >= _ref4; col = _ref3 <= _ref4 ? ++_j : --_j) {
          if ((_ref5 = this.puzzle.squareMatrix[this.row][col]) != null) {
            _ref5.swap(this.puzzle.emptyRow, this.puzzle.emptyCol, once);
          }
        }
      }
      return this;
    };

    Square.prototype.bind = function(event, handler, one) {
      var bindings,
        _this = this;

      if (one == null) {
        one = false;
      }
      bindings = one ? this.bindings.one : this.bindings.always;
      if (!(event in bindings)) {
        bindings[event] = [];
      }
      bindings[event].push(handler);
      if (event !== 'step') {
        this.bindings.proxy[handler] = function() {
          return handler.apply(_this);
        };
        if (one) {
          this.div.one(event, this.bindings.proxy[handler]);
        } else {
          this.div.bind(event, this.bindings.proxy[handler]);
        }
      }
      return this;
    };

    Square.prototype.trigger = function(event) {
      var handler, handlers, _i, _j, _len, _len1, _ref;

      if (event in this.bindings.always) {
        _ref = this.bindings.always[event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          if (handler != null) {
            handler.call(this);
          }
        }
      }
      if (event in this.bindings.one) {
        handlers = this.bindings.one[event];
        this.bindings.one[event] = [];
        for (_j = 0, _len1 = handlers.length; _j < _len1; _j++) {
          handler = handlers[_j];
          if (handler != null) {
            handler.call(this);
          }
        }
      }
      return this;
    };

    Square.prototype.unbind = function(event, handler) {
      var bindings, cc, type, _i, _len, _ref;

      _ref = ['one', 'always'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        bindings = this.bindings[type];
        if (event in bindings) {
          bindings[event] = handler != null ? (function() {
            var _j, _len1, _ref1, _results;

            _ref1 = bindings[event];
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              cc = _ref1[_j];
              if (cc !== handler) {
                _results.push(cc);
              }
            }
            return _results;
          })() : [];
        }
      }
      if (event !== 'step') {
        if (handler in this.bindings.proxy) {
          this.div.off(event, this.bindings.proxy[handler]);
          delete this.bindings.proxy[handler];
        } else {
          this.div.off(event, handler);
        }
      }
      return this;
    };

    Square.prototype.one = function(event, handler) {
      this.bind(event, handler, true);
      return this;
    };

    Square.prototype.reset = function(callback) {
      this.swap(this.origRow, this.origCol, callback);
      return this;
    };

    return Square;

  })();

  Puzzle = (function() {
    var isSolvable, recalc, redraw;

    recalc = function() {
      this.board.width(this.div.width()).height(this.div.height());
      this.sqHeight = Math.floor((this.board.height() - (this.rows - 1) * this.spacing) / this.rows);
      this.sqWidth = Math.floor((this.board.width() - (this.cols - 1) * this.spacing) / this.cols);
      this.rowResidual = (this.board.height() - (this.rows - 1) * this.spacing) % this.rows;
      return this.colResidual = (this.board.width() - (this.cols - 1) * this.spacing) % this.cols;
    };

    Puzzle.prototype.rebuild = function() {
      var bindings, col, event, handler, handlers, id, row, square, _i, _j, _k, _l, _len, _len1, _ref, _ref1;

      this.div.empty();
      this.board = $('<div style="position:relative; margin:0"></div>');
      this.div.append(this.board);
      this.incompletions = 0;
      this.squareList = [];
      this.squareMatrix = [];
      this.emptyRow = this.rows;
      this.emptyCol = this.cols;
      recalc.apply(this);
      id = 0;
      for (row = _i = 1, _ref = this.rows; 1 <= _ref ? _i <= _ref : _i >= _ref; row = 1 <= _ref ? ++_i : --_i) {
        this.squareMatrix[row] = [];
        for (col = _j = 1, _ref1 = this.cols; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 1 <= _ref1 ? ++_j : --_j) {
          if (row === this.emptyRow && col === this.emptyCol) {
            square = null;
          } else {
            square = new Square(id, this, row, col);
            this.squareList[id] = square;
            id += 1;
          }
          this.squareMatrix[row][col] = square;
        }
      }
      this.$squares = this.board.children();
      bindings = this.bindings.one;
      this.bindings.one = {};
      for (event in bindings) {
        handlers = bindings[event];
        for (_k = 0, _len = handlers.length; _k < _len; _k++) {
          handler = handlers[_k];
          this.bind(event, handler, true);
        }
      }
      bindings = this.bindings.always;
      this.bindings.always = {};
      for (event in bindings) {
        handlers = bindings[event];
        for (_l = 0, _len1 = handlers.length; _l < _len1; _l++) {
          handler = handlers[_l];
          this.bind(event, handler);
        }
      }
      return this;
    };

    redraw = function() {
      var square, _i, _len, _ref,
        _this = this;

      if (this.status.shuffling > 0) {
        this.one('shuffle', redraw);
      } else if (this.status.resetting > 0) {
        this.one('reset', redraw);
      } else if (this.status.moving > 0) {
        this.one('step', function() {
          return redraw.apply(_this);
        });
      }
      recalc.apply(this);
      _ref = this.squareList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        square = _ref[_i];
        square.redraw();
      }
      return this;
    };

    function Puzzle(div, options) {
      var defaults, key, value;

      if (options == null) {
        options = {};
      }
      defaults = {
        div: div,
        rows: 4,
        cols: 4,
        spacing: 0
      };
      for (key in defaults) {
        value = defaults[key];
        if (!(key in options)) {
          options[key] = value;
        }
      }
      this.bindings = {
        one: {},
        always: {}
      };
      this.status = {
        moving: 0,
        shuffling: 0,
        resetting: 0
      };
      this.render(options);
    }

    Puzzle.prototype.render = function(options) {
      var doRebuild, doRedraw;

      if (options == null) {
        options = {};
      }
      doRebuild = false;
      doRedraw = false;
      if ('div' in options) {
        this.div = options.div;
        doRebuild = true;
      }
      if ('rows' in options) {
        this.rows = options.rows;
        doRebuild = true;
      }
      this.rows = int(this.rows);
      if (this.rows < 2) {
        throw {
          msg: 'at least 2 rows required.'
        };
      }
      if ('cols' in options) {
        this.cols = options.cols;
        doRebuild = true;
      }
      this.cols = int(this.cols);
      if (this.cols < 2) {
        throw {
          msg: 'at least 2 cols required.'
        };
      }
      if ('spacing' in options) {
        this.spacing = options.spacing;
        doRedraw = true;
      }
      this.spacing = int(this.spacing);
      if (this.spacing < 0) {
        throw {
          msg: 'spacing must be non-negative.'
        };
      }
      if ('image' in options) {
        this.image = options.image;
        doRedraw = true;
      }
      if (doRebuild) {
        this.rebuild();
      }
      if (doRedraw) {
        redraw.apply(this);
      }
      return this;
    };

    isSolvable = function(array, rows, cols, emptyRow) {
      var inversions;

      inversions = countInversions(array);
      return ((cols % 2 !== 0) && (inversions % 2 === 0)) || ((cols % 2 === 0) && ((rows - emptyRow + 1) % 2 !== inversions % 2));
    };

    Puzzle.prototype.isSolvable = function() {
      return isSolvable(this.mapSquare(function() {
        return this.id;
      }), this.rows, this.cols, this.emptyRow);
    };

    Puzzle.prototype.shuffle = function(callback) {
      var col, id, last, once, rand, row, squares, swapMap, _i, _ref, _ref1,
        _this = this;

      if (this.status.shuffling > 0) {
        return this.one('shuffle', Puzzle.prototype.shuffle);
      }
      if (this.squareMatrix[this.rows][this.cols]) {
        this.squareMatrix[this.rows][this.cols].swap(this.emptyRow, this.emptyCol);
      }
      swapMap = {};
      squares = [];
      this.eachSquare(function() {
        squares.push(this);
        return swapMap[this.id] = [this.row, this.col];
      });
      for (last = _i = _ref = squares.length - 1; _ref <= 1 ? _i <= 1 : _i >= 1; last = _ref <= 1 ? ++_i : --_i) {
        rand = Math.floor(Math.random() * (last + 1));
        arraySwap(swapMap, squares[rand].id, squares[last].id);
        arraySwap(squares, last, rand);
      }
      for (id in swapMap) {
        _ref1 = swapMap[id], row = _ref1[0], col = _ref1[1];
        swap.call(this.squareList[id], row, col);
      }
      if (!isSolvable(this.mapSquare(function() {
        return this.id;
      }), this.rows, this.cols, this.emptyRow)) {
        swap.call(this.squareList[0], this.squareList[1].row, this.squareList[1].col);
      }
      once = runOnceAt(this.squareList.length, function() {
        _this.status.shuffling -= 1;
        if (callback != null) {
          callback.apply(_this);
        }
        return _this.trigger('shuffle');
      });
      this.status.shuffling += 1;
      this.eachSquare(function() {
        return slowlyMove.call(this, this.row, this.col, once);
      });
      return this;
    };

    Puzzle.prototype.eachSquare = function(callback) {
      var col, row, _i, _j, _ref, _ref1;

      for (row = _i = 1, _ref = this.rows; 1 <= _ref ? _i <= _ref : _i >= _ref; row = 1 <= _ref ? ++_i : --_i) {
        for (col = _j = 1, _ref1 = this.cols; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; col = 1 <= _ref1 ? ++_j : --_j) {
          if (!this.isEmpty(row, col)) {
            callback.call(this.squareMatrix[row][col], row, col);
          }
        }
      }
      return this;
    };

    Puzzle.prototype.mapSquare = function(callback) {
      var results;

      results = [];
      this.eachSquare(function(row, col) {
        return results.push(callback.call(this, row, col));
      });
      return results;
    };

    Puzzle.prototype.isComplete = function() {
      return this.incompletions === 0;
    };

    Puzzle.prototype.isEmpty = function(row, col) {
      return this.squareMatrix[row][col] == null;
    };

    Puzzle.prototype.bind = function(event, handler, one) {
      var bindings;

      if (one == null) {
        one = false;
      }
      bindings = one ? this.bindings.one : this.bindings.always;
      if (!(event in bindings)) {
        bindings[event] = [];
      }
      bindings[event].push(handler);
      if (event !== 'shuffle' && event !== 'reset' && event !== 'done') {
        this.eachSquare(function() {
          return this.bind(event, handler, one);
        });
      }
      return this;
    };

    Puzzle.prototype.unbind = function(event, handler) {
      var bindings, cc, type, _i, _len, _ref;

      _ref = ['one', 'always'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        bindings = this.bindings[type];
        if (event in bindings) {
          bindings[event] = typeof handlers !== "undefined" && handlers !== null ? (function() {
            var _j, _len1, _ref1, _results;

            _ref1 = bindings[event];
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              cc = _ref1[_j];
              if (cc !== handler) {
                _results.push(cc);
              }
            }
            return _results;
          })() : [];
        }
      }
      if (event !== 'shuffle' && event !== 'reset' && event !== 'done') {
        this.eachSquare(function() {
          return this.unbind(event, handler);
        });
      }
      return this;
    };

    Puzzle.prototype.one = function(event, handler) {
      this.bind(event, handler, true);
      return this;
    };

    Puzzle.prototype.trigger = function(event) {
      var handler, handlers, _i, _j, _len, _len1, _ref;

      if (event in this.bindings.always) {
        _ref = this.bindings.always[event];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          if (handler != null) {
            handler.call(this);
          }
        }
      }
      if (event in this.bindings.one) {
        handlers = this.bindings.one[event];
        this.bindings.one[event] = [];
        for (_j = 0, _len1 = handlers.length; _j < _len1; _j++) {
          handler = handlers[_j];
          if (handler != null) {
            handler.call(this);
          }
        }
      }
      return this;
    };

    Puzzle.prototype.reset = function(callback) {
      var once, sq, _i, _len, _ref,
        _this = this;

      once = runOnceAt(this.squareList.length, function() {
        _this.status.resetting -= 1;
        if (callback != null) {
          callback.apply(_this);
        }
        return _this.trigger('reset');
      });
      _ref = this.squareList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        sq = _ref[_i];
        swap.call(sq, sq.origRow, sq.origCol);
      }
      this.status.resetting += 1;
      this.eachSquare(function() {
        return slowlyMove.call(this, this.row, this.col, once);
      });
      return this;
    };

    return Puzzle;

  })();

  (function($) {
    return $.fn.puzzle = function(options) {
      var puzzle;

      return puzzle = new Puzzle(this, options);
    };
  })(jQuery);

}).call(this);
