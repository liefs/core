import {isDefined, asString, asNumber, isIn} from '@liefs/lib/lib';

export interface Item {
    label: string;
    start: Stumbler,
    size: Position,
    is_a_container?: Container,
    el?:Element
}
export function isItem(it:any):boolean{return isDefined(it) && isIn(it,'label') && isIn(it,'start') && isIn(it,'size');}

export interface ItemObject {
    [index: string]: Item
}

export interface Position {
    label?: string,
    x: number,
    y: number,
    width: number,
    height: number,
}
export function isPosition(it:any){return isIn(it,'x') && isIn(it,'y') && isIn(it,'width') && isIn(it,'height');}

export interface CoordObject {
    [index: string]: Position
}

export interface Container {
    label: string,
    direction: boolean, // 0 is horizontal, 1 is vertical
    items: Item[],
    margin: number,
    size?: Position,
    el?:Element,
}
export function isContainer(it:any){return isIn(it,'label') && isIn(it,'direction') && isIn(it,'items') && isIn(it,'margin');}

export interface ContainerObject {
    [index: string]: Container
}

export type Stumbler = string | number;

export function checkItem(item:Item){}
export function checkContainer(container:Container) {}
export function addTo100(check_if_is_100:number, container: Container) {}

export function newItem(label: string, start: Stumbler, is_a_container: Container = null): Item {
    let new_item:Item = {label: label, start: start, size: _newCoordinates()};
    if (eh) checkItem(new_item);
    items[label] = new_item;
    if (is_a_container) items[label]['is_a_container'] = is_a_container;
    if (eh) checkItem(items[label]);
    return items[label];
}
export function newContainer(label: string, true_is_hor: boolean, items: Item[], margin: number = 4): Container {
    let new_container = {
        label: label,
        direction: true_is_hor, // true is horizontal, false is vertical
        items: items,
        margin: margin
    };
    if (eh) checkContainer(new_container);
    containers[label] = new_container;
    return containers[label];
}
export function update(width: number, height: number, container: Container,
                       x_offset: number = 0, y_offset: number = 0, include_parents: boolean = false):CoordObject {
    return _Private._updateRecursive(width, height, container, x_offset, y_offset, include_parents);
}
export let containers: ContainerObject = {};
export let items: ItemObject = {};
export let eh:boolean = false; // errorHandling
export let marginDefault:number = 0;
export let magrinLast:number = 0;

export function HC(id:string, margin:number = marginDefault, arrayOfItems: Array<Item>):Container{
    return newContainer("_"+id, true, arrayOfItems ,margin);
}
export function VC(id:string, margin:number = marginDefault, arrayOfItems: Array<Item>):Container{
    return newContainer("_"+id, false, arrayOfItems, margin);
}

export function I(id:string,start:string, container:Container = undefined):Item {
    return newItem(id,start,container)
}
export function HI(id:string, start:string, margin:number, arrayOfItems:Array<Item>):Item {
    return I(id, start, newContainer("_"+id, true, arrayOfItems));
}
export function VI(id:string, start:string, margin:number, arrayOfItems:Array<Item>):Item {
    return I(id, start, newContainer("_"+id, false, arrayOfItems));
}
export function V(id:string,
           field2:number|string|Item,
           field3:number|Item = undefined,
           ...arrayOfItems: Array<Item>):Container {
    return <Container>HVC(id, field2, field3, arrayOfItems,VC, VI );
}
export function H(id:string,
           field2:number|string|Item,
           field3:number|Item = undefined,
           ...arrayOfItems: Array<Item>):Container {
    return <Container>HVC(id, field2, field3, arrayOfItems,HC, HI );
}

export function v(id:string,
           field2:number|string|Item,
           field3:number|Item = undefined,
           ...arrayOfItems: Array<Item>):Item {
    return <Item>HVC(id, field2, field3, arrayOfItems,VC, VI );
}

export function h(id:string,
           field2:number|string|Item,
           field3:number|Item = undefined,
           ...arrayOfItems: Array<Item>):Item {
    return <Item>HVC(id, field2, field3, arrayOfItems,HC, HI );
}
export function HVC(id:string,
             field2:number|string|Item,
             field3:number|Item = undefined,
             arrayOfItems: Array<Item>,
             Droot2:Function,
             D2:Function):Container|Item {
    let margin: number;
    let start: string;
    let newarrayOfItems:Array<Item>;

    if (asNumber(field2)) {                         // Hroot with margins only case possible
        margin = asNumber(field2);

        if (isDefined(field3) && isItem(field3)) {
            arrayOfItems.unshift(field3 as Item);
            return <Container>Droot2(id, margin, arrayOfItems);
        }
        else
            throw "error";
    }
    else if(asString(field2))                       // Must be H - then options...
    {
        start =(field2 as string);
        if(asNumber(field3)) {                      // H - c/w Margins
            margin = asNumber(field3);
            return <Item>D2(id,start,margin,arrayOfItems);
        }
        else if (isItem(field3)) {                  // H - no Margins
            return <Item>D2(id, start, undefined, [(field3 as Item)].concat(arrayOfItems));
        } else throw "error";
    }
    else if (isItem(field2)) {                      // Hroot with no Margins
        newarrayOfItems = [(field2 as Item)];
        if (isItem(field3))
            newarrayOfItems.push(field3 as Item);
        else if (isDefined(field3)) throw "Unexpected";
        return <Container>Droot2(id, undefined, newarrayOfItems.concat(arrayOfItems));
    }
}

export function _newCoordinates(width: number = 0, height: number = 0, x: number = 0, y: number = 0, label: string = null): Position {
    let return_object = {x: x, y: y, width: width, height: height};
    if (label) return_object['label'] = label;
    return return_object;
}
export class _Private {
    public static _updateRecursive(width: number, height: number, container: Container,
                                   x_offset: number = 0, y_offset: number = 0, include_parents: boolean = false): CoordObject {
        let fixed: number = _Private._fixed(container, width, height);
        let ReturnObject: CoordObject = {};
        _Private._percent(container, width, height, fixed);
        _Private._fill(container, x_offset, y_offset);
        for (let this_item of container.items) {
            let width = this_item.size.width + container.margin * 2;
            let height = this_item.size.height + container.margin * 2;
            let x = this_item.size.x - container.margin;
            let y = this_item.size.y - container.margin;
            if ('is_a_container' in this_item) {
                if (include_parents)
                    ReturnObject[this_item.label] = this_item.size;
//          ReturnObject = Object.assign(ReturnObject, this._updateRecursive(width, height, this_item.is_a_container, x, y));
                let temp = _Private._updateRecursive(width, height, this_item.is_a_container, x, y);
                for (let attrname in temp)
                    ReturnObject[attrname] = temp[attrname];
            }
            ReturnObject[this_item.label] = this_item.size;
        }
        return ReturnObject;
    }
    private static _fixed(container: Container, width: number, height: number): number {
        let NOT_DEFINED: number = -999;
        let fixed: number = 0;
        let new_size: number = NOT_DEFINED;
        for (let each_item of container.items) {
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
                    each_item.size.height = height - container.margin * 2
                }
                new_size = NOT_DEFINED;
            }
        }
        return fixed;
    }
    private static _percent(container: Container, width: number, height: number, fixed: number): void {
        let pixels_left_for_percent: number;
        let max = (container.direction) ? width : height;
        let new_percent_total: number;
        pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
        for (let each_item of container.items)
            if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
                let new_percent = parseInt(each_item.start.slice(0, -1));
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
    private static _fill(container: Container, x_offset: number = 0, y_offset: number = 0): void {
        let margin = container.margin;
        let sum: number = margin;
        for (let each_item of container.items) {
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
    }
}
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