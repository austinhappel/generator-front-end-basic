(function (global) {
    'use strict';

    function Cat() {}

    Cat.prototype.meow = function () {
        return 'meow';
    };

    Cat.prototype.numLegs = 4;

    Cat.prototype.hairLength = 'short';

    function MainCoon() {
        this.hairLength = 'long';
        this.meow = function () {
            return 'MEW';
        };
    }

    MainCoon.prototype = _.extend(Cat.prototype, {
        constructor: Cat
    });

    global.CATS = {
        cat: new Cat(),
        mainCoon: new MainCoon()
    };

}(this));
