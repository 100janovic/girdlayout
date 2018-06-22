/*
 * simple lightweight grid layout
 * Djordje Stojanovic, Heavyform Creative Agency
 * djordje100janovic@gmail.com
 *
 * free for use and modification
 * v0.1
 */

(function(window) {

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    var GridLayout = function(el, options) {
        this.el = document.getElementById(el);
        if (!this.el) {
            throw new Error('Please provide valid id of the container element.');
        }
        this.options = extend({}, this.options);
        extend(this.options, options);
        // set some variables
        this.wrapperwidth = null;
        this.elms = null;
        this.elmsNum = null;
        this.wrapperParent = null;
        this.wrapperparentwidth = null;
        this.animprepeared = false;
        this.elwidthparam = null;
        this.resizeTimer = null;
        this.col_total = 0;
        this.heightArray = [];
        this.init();
    };

    GridLayout.prototype.options = {
        gridtype: 'horizontal',
        selector: '.promo',
        animate: false,
        speed: 500,
        easing: 'linear',
        colwidth: 400,
        resizedelay: 250,
        centerwrapper: true,
        fullwidthwrapper: false,
        debuglog: false,
        debugelems: false
    };

    GridLayout.prototype.init = function() {


        this.elms = this.el.querySelectorAll(this.options.selector);
        this.elmsNum = this.elms.length;

        this.wrapperParent = this.el.parentNode || document.body;

        if (this.options.debuglog) console.log('Number of elements: ' + this.elmsNum);

        if (this.options.centerwrapper) {
            this.el.style.position = 'relative';
            this.el.style.display = 'block';
            this.el.style.marginLeft = 'auto';
            this.el.style.marginRight = 'auto';
            this.el.style.cssFloat = 'none';
            this.el.style.clear = 'both';
        }
        if (this.options.fullwidthwrapper) {
            document.body.style.margin = '0px';
            document.body.style.padding = '0px';
            document.body.style.overflowY = "hidden";
            this.el.style.width = '100%';
            this.el.style.border = 'none';
            this.el.style.overflowY = "hidden";
            this.options.centerwrapper = true;
            this.setRelativeFloat();
        } else {
            this.initEvents();
            this.rendergrid();
        }

        if (this.options.debugelems) this.markElements();

    };

    GridLayout.prototype.getArrayMax = function(array) {
        return Math.max.apply(Math, array);
    };

    GridLayout.prototype.markElements = function() {
        for (var i = 0; i < this.elms.length; i += 1) {
            var debugtitle = document.createElement('h1');
            debugtitle.innerHTML = i;
            this.elms[i].appendChild(debugtitle);
        }
    };

    GridLayout.prototype.initEvents = function() {
        var that = this;
        if (window.addEventListener) {
            window.addEventListener('resize', function(event) {
                doresize();
            });
        } else if (window.attachEvent) {
            window.attachEvent('onresize', function(event) {
                doresize();
            });
        }

        function doresize() {
            clearTimeout(that.resizeTimer);
            that.resizeTimer = setTimeout(function() {
                that.rendergrid();
            }, that.options.resizedelay);
        }
    };

    GridLayout.prototype.setWrapperHeight = function(height) {
        this.el.style.height = height + 'px';
    };

    GridLayout.prototype.rendergrid = function() {
        var that = this;


        that.wrapperparentwidth = that.wrapperParent.offsetWidth;
        if (that.options.colwidth === 'css') {
            that.options.colwidth = that.elms[0].offsetWidth;
        }
        if (that.wrapperparentwidth > that.options.colwidth) {
            if (that.options.fullwidthwrapper) {
                that.wrapperwidth = that.options.colwidth * that.wrapperparentwidth / that.options.colwidth;
            } else {
                that.wrapperparentwidth = document.body.offsetWidth;
                that.wrapperwidth = that.options.colwidth * Math.floor(that.wrapperparentwidth / that.options.colwidth);
                that.col_total = Math.floor(that.wrapperparentwidth / that.options.colwidth);
            }

        } else {
            that.wrapperwidth = that.options.colwidth;
        }
        // set element new width
        this.el.style.width = that.wrapperwidth + 'px';




        // init variables
        var prevtop = null,
            prevleft = null,
            prevWidth = null,
            prevHeight = null,
            newleft = null,
            newtop = null,
            wrapperHeight = null;


        if (that.options.gridtype === 'horizontal') {

            if (this.options.debuglog && console.time) console.time('Render time');

            for (var i = 0; i < this.elms.length; i += 1) {

                this.elms[i].style.position = 'absolute';
                curentWidth = Math.floor(this.elms[i].offsetWidth);
                curentHeight = Math.floor(this.elms[i].offsetHeight);

                if (i === 0) {
                    prevtop = 0;
                    prevleft = 0;
                    prevWidth = 0;
                    prevHeight = 0;
                } else {
                    prevtop = Math.floor(parseInt(this.elms[i - 1].style.top));
                    prevleft = Math.floor(parseInt(this.elms[i - 1].style.left));
                    prevWidth = Math.floor(this.elms[i - 1].offsetWidth);
                    prevHeight = Math.floor(this.elms[i - 1].offsetHeight);
                }

                if (prevleft + prevWidth + curentWidth <= this.wrapperwidth) {
                    newleft = Math.floor(prevleft + prevWidth);
                    newtop = Math.floor(prevtop);
                } else {
                    if (that.options.fullwidthwrapper && prevleft + prevWidth + curentWidth <= this.wrapperwidth + 50) {
                        newleft = Math.floor(prevleft + prevWidth);
                        newtop = Math.floor(prevtop);
                    } else {
                        newleft = 0;
                        newtop = prevtop + prevHeight;
                    }
                }

                this.elms[i].style.left = newleft + 'px';
                this.elms[i].style.top = newtop + 'px';

                if (this.options.debugelems) console.log('element: ' + i + ' prevleft: ' + prevleft + ' prevtop: ' + prevtop + ' prevWidth: ' + prevWidth + ' prevHeight: ' + prevHeight + ' curentWidth: ' + curentWidth + ' newleft: ' + newleft + ' newtop: ' + newtop);
            }

            var lastelement = this.elms[this.elms.length - 1];
            that.wrapperHeight = parseInt(lastelement.style.top) + lastelement.offsetHeight;
            that.setWrapperHeight(that.wrapperHeight);

            if (!this.animprepeared && this.options.animate) {
                that.setAnimationSettings();
            }

            if (this.options.debuglog && console.time) console.timeEnd('Render time');

        } else {
            // vertical type

            if (this.options.debuglog && console.time) console.time('Render time');

            for (var i = 0; i < this.elms.length; i += 1) {

                this.elms[i].style.position = 'absolute';
                curentWidth = Math.floor(this.elms[i].offsetWidth);
                curentHeight = Math.floor(this.elms[i].offsetHeight);

                newleft = 0;
                newtop = 0;

                // top row
                if (i < that.col_total) {
                    newtop = 0;
                    if (i === 0) {
                        newleft = 0;
                    } else {
                        prevWidth = Math.floor(this.elms[i - 1].offsetWidth);
                        prevleft = Math.floor(parseInt(this.elms[i - 1].style.left));
                        newleft = Math.floor(prevleft + prevWidth);
                    }
                } else {
                    prevtop = this.elms[i - that.col_total].style.top;
                    prevleft = this.elms[i - that.col_total].style.left;

                    // left column
                    if (prevleft === 0) {
                        newleft = 0;
                        prevHeight = that.elms[i - that.col_total].offsetHeight;
                        newtop = prevtop + prevHeight;
                    }
                    // everything else
                    else {
                        newleft = this.elms[i - that.col_total].offsetLeft;
                        newtop = this.elms[i - that.col_total].offsetTop + this.elms[i - that.col_total].offsetHeight;
                    }

                }

                this.heightArray.push(newtop + curentHeight);

                this.elms[i].style.left = newleft + 'px';
                this.elms[i].style.top = newtop + 'px';
            }

            that.wrapperHeight = that.getArrayMax(that.heightArray);
            that.setWrapperHeight(that.wrapperHeight);

            if (!this.animprepeared && this.options.animate) {
                that.setAnimationSettings();
            }

            if (this.options.debuglog && console.time) console.timeEnd('Render time');
        }
    };

    GridLayout.prototype.setRelativeFloat = function() {
        for (var i = 0; i < this.elms.length; i += 1) {
            this.elms[i].style.position = 'relative';
            this.elms[i].style.display = 'block';
            this.elms[i].style.cssFloat = 'left';
        }
    };

    GridLayout.prototype.setAnimationSettings = function() {
        var that = this;
        this.animprepeared = true;
        setTimeout(function() {
            if (that.options.debuglog && console.time) console.time('Finish setting');
            for (var i = 0; i < that.elmsNum; i += 1) {
                that.elms[i].style.WebkitTransition = 'all ' + that.options.speed + 'ms ' + that.options.easing;
                that.elms[i].style.MsTransition = 'all ' + that.options.speed + 'ms ' + that.options.easing;
                that.elms[i].style.OTransition = 'all ' + that.options.speed + 'ms ' + that.options.easing;
                that.elms[i].style.transition = 'all ' + that.options.speed + 'ms ' + that.options.easing;
            }
            if (that.options.debuglog && console.time) console.timeEnd('Finish setting');
        }, 300);
    };
    window.GridLayout = GridLayout;
})(window);
