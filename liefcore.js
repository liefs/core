"use strict";
var lib_1 = require("@liefs/lib/lib");
function isItem(it) { return lib_1.isDefined(it) && lib_1.isIn(it, 'label') && lib_1.isIn(it, 'start') && lib_1.isIn(it, 'size'); }
exports.isItem = isItem;
function isPosition(it) { return lib_1.isIn(it, 'x') && lib_1.isIn(it, 'y') && lib_1.isIn(it, 'width') && lib_1.isIn(it, 'height'); }
exports.isPosition = isPosition;
function isContainer(it) { return lib_1.isIn(it, 'label') && lib_1.isIn(it, 'direction') && lib_1.isIn(it, 'items') && lib_1.isIn(it, 'margin'); }
exports.isContainer = isContainer;
function checkItem(item) { }
exports.checkItem = checkItem;
function checkContainer(container) { }
exports.checkContainer = checkContainer;
function addTo100(check_if_is_100, container) { }
exports.addTo100 = addTo100;
function newItem(label, start, is_a_container) {
    if (is_a_container === void 0) { is_a_container = null; }
    var new_item = { label: label, start: start, size: _newCoordinates() };
    if (exports.eh)
        checkItem(new_item);
    exports.items[label] = new_item;
    if (is_a_container)
        exports.items[label]['is_a_container'] = is_a_container;
    if (exports.eh)
        checkItem(exports.items[label]);
    return exports.items[label];
}
exports.newItem = newItem;
function newContainer(label, true_is_hor, items, margin) {
    if (margin === void 0) { margin = 4; }
    var new_container = {
        label: label,
        direction: true_is_hor,
        items: items,
        margin: margin
    };
    if (exports.eh)
        checkContainer(new_container);
    exports.containers[label] = new_container;
    return exports.containers[label];
}
exports.newContainer = newContainer;
function update(width, height, container, x_offset, y_offset, include_parents) {
    if (x_offset === void 0) { x_offset = 0; }
    if (y_offset === void 0) { y_offset = 0; }
    if (include_parents === void 0) { include_parents = false; }
    return _Private._updateRecursive(width, height, container, x_offset, y_offset, include_parents);
}
exports.update = update;
exports.containers = {};
exports.items = {};
exports.eh = false; // errorHandling
exports.marginDefault = 0;
exports.magrinLast = 0;
function HC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = exports.marginDefault; }
    return newContainer("_" + id, true, arrayOfItems, margin);
}
exports.HC = HC;
function VC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = exports.marginDefault; }
    return newContainer("_" + id, false, arrayOfItems, margin);
}
exports.VC = VC;
function I(id, start, container) {
    if (container === void 0) { container = undefined; }
    return newItem(id, start, container);
}
exports.I = I;
function HI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, true, arrayOfItems));
}
exports.HI = HI;
function VI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, false, arrayOfItems));
}
exports.VI = VI;
function V(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
exports.V = V;
function H(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
exports.H = H;
function v(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
exports.v = v;
function h(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
exports.h = h;
function HVC(id, field2, field3, arrayOfItems, Droot2, D2) {
    if (field3 === void 0) { field3 = undefined; }
    var margin;
    var start;
    var newarrayOfItems;
    if (lib_1.asNumber(field2)) {
        margin = lib_1.asNumber(field2);
        if (lib_1.isDefined(field3) && isItem(field3)) {
            arrayOfItems.unshift(field3);
            return Droot2(id, margin, arrayOfItems);
        }
        else
            throw "error";
    }
    else if (lib_1.asString(field2)) {
        start = field2;
        if (lib_1.asNumber(field3)) {
            margin = lib_1.asNumber(field3);
            return D2(id, start, margin, arrayOfItems);
        }
        else if (isItem(field3)) {
            return D2(id, start, undefined, [field3].concat(arrayOfItems));
        }
        else
            throw "error";
    }
    else if (isItem(field2)) {
        newarrayOfItems = [field2];
        if (isItem(field3))
            newarrayOfItems.push(field3);
        else if (lib_1.isDefined(field3))
            throw "Unexpected";
        return Droot2(id, undefined, newarrayOfItems.concat(arrayOfItems));
    }
}
exports.HVC = HVC;
function _newCoordinates(width, height, x, y, label) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = 0; }
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (label === void 0) { label = null; }
    var return_object = { x: x, y: y, width: width, height: height };
    if (label)
        return_object['label'] = label;
    return return_object;
}
exports._newCoordinates = _newCoordinates;
var _Private = (function () {
    function _Private() {
    }
    _Private._updateRecursive = function (width, height, container, x_offset, y_offset, include_parents) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        if (include_parents === void 0) { include_parents = false; }
        var fixed = _Private._fixed(container, width, height);
        var ReturnObject = {};
        _Private._percent(container, width, height, fixed);
        _Private._fill(container, x_offset, y_offset);
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var this_item = _a[_i];
            var width_1 = this_item.size.width + container.margin * 2;
            var height_1 = this_item.size.height + container.margin * 2;
            var x = this_item.size.x - container.margin;
            var y = this_item.size.y - container.margin;
            if ('is_a_container' in this_item) {
                if (include_parents)
                    ReturnObject[this_item.label] = this_item.size;
                //          ReturnObject = Object.assign(ReturnObject, this._updateRecursive(width, height, this_item.is_a_container, x, y));
                var temp = _Private._updateRecursive(width_1, height_1, this_item.is_a_container, x, y);
                for (var attrname in temp)
                    ReturnObject[attrname] = temp[attrname];
            }
            ReturnObject[this_item.label] = this_item.size;
        }
        return ReturnObject;
    };
    _Private._fixed = function (container, width, height) {
        var NOT_DEFINED = -999;
        var fixed = 0;
        var new_size = NOT_DEFINED;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (typeof each_item.start === "number")
                new_size = each_item.start;
            else if (typeof each_item.start === "string")
                if (each_item.start.slice(-2) === "px")
                    new_size = parseInt(each_item.start.slice(0, -2));
                else
                    throw "width Parameter must be number or string (with post-fix)";
            if (new_size !== NOT_DEFINED) {
                fixed = fixed + new_size;
                if (!container.direction) {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = new_size;
                }
                else {
                    each_item.size.width = new_size;
                    each_item.size.height = height - container.margin * 2;
                }
                new_size = NOT_DEFINED;
            }
        }
        return fixed;
    };
    _Private._percent = function (container, width, height, fixed) {
        var pixels_left_for_percent;
        var max = (container.direction) ? width : height;
        var new_percent_total;
        pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
                var new_percent = parseInt(each_item.start.slice(0, -1));
                if (container.direction) {
                    each_item.size.width = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                    each_item.size.height = height - container.margin * 2;
                }
                else {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                }
            }
        }
    };
    _Private._fill = function (container, x_offset, y_offset) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        var margin = container.margin;
        var sum = margin;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (container.direction) {
                each_item.size.x = x_offset + sum;
                sum = sum + each_item.size.width + margin;
                each_item.size.y = y_offset + margin;
            }
            else {
                each_item.size.x = x_offset + margin;
                each_item.size.y = y_offset + sum;
                sum = sum + each_item.size.height + margin;
            }
        }
    };
    return _Private;
}());
exports._Private = _Private;
/*
reverse, only make instance of _Private in here.
World gets static



 function () {
//  everything in here is hidden
 }
//////////////////////////////////////
 function () {
 var name,
 secretSkills = {
 pizza: function () { return new Pizza() },
 sushi: function () { return new Sushi() }
 }

 function Restaurant(_name) {
 name = _name
 }
 Restaurant.prototype.getFood = function (name) {
 return name in secretSkills ? secretSkills[name]() : null
 }
 }
///////////////////////////////////
 var Restaurant = (function () {
 var name,
 secretSkills = {
 pizza: function () { return new Pizza() },
 sushi: function () { return new Sushi() }
 }

 function Restaurant(_name) {
 name = _name
 }
 Restaurant.prototype.getFood = function (name) {
 return name in secretSkills ? secretSkills[name]() : null
 }
 return Restaurant
 })()

///////////////////////////////////////////////////////////////

let MyObject = (function () {

    // Constructor
    function MyObject (foo) {
        this._foo = foo;
    }

    function privateFun (prefix) {
        return prefix + this._foo;
    }

    MyObject.prototype.publicFun = function () {
        return privateFun.call(this, '>>');
    };

    return MyObject;
})();


let myObject = new MyObject('bar');
myObject.publicFun();      // Returns '>>bar'
myObject.privateFun('>>'); // ReferenceError: private is not defined
*/ 
