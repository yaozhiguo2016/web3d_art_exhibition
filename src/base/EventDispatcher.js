/**
 * Created by Stanley on 2016/6/5.
 */

var APP = APP || {};

APP.EventDispatcher = function () {

};

APP.EventDispatcher.prototype = {

    constructor: APP.EventDispatcher,

    apply: function ( object ) {

        object.addEventListener = APP.EventDispatcher.prototype.addEventListener;
        object.hasEventListener = APP.EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = APP.EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = APP.EventDispatcher.prototype.dispatchEvent;

    },

    addEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) this._listeners = {};

        var listeners = this._listeners;

        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].push( listener );

        }

    },

    hasEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return false;

        var listeners = this._listeners;

        if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

            return true;

        }

        return false;

    },

    removeEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ type ];

        if ( listenerArray !== undefined ) {

            var index = listenerArray.indexOf( listener );

            if ( index !== - 1 ) {

                listenerArray.splice( index, 1 );

            }

        }

    },

    dispatchEvent: function ( event ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            var array = [];
            var length = listenerArray.length;

            for ( var i = 0; i < length; i ++ ) {

                array[ i ] = listenerArray[ i ];

            }

            for ( var i = 0; i < length; i ++ ) {

                array[ i ].call( this, event );

            }

        }

    }

};
