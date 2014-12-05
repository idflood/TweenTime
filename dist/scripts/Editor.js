(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define(['jquery', 'lodash', 'd3', 'jquery', 'Mustache', 'draggablenumber'], factory);
    } else {
        // Browser globals
        root.Editor = factory(root.$, root._, root.d3, root.jQuery, root.Mustache, root.DraggableNumber);
    }
}(this, function ($, _, d3, jQuery, Mustache, DraggableNumber) {
/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

define('cs',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
/**
 * @license RequireJS text 2.0.12 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',['module'], function (module) {
    

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.12',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});


define('text!templates/timeline.tpl.html',[],function () { return '<div class="timeline">\n  <nav class="timeline__menu">\n    <a href="#" class="menu-item" data-action="export">Export</a>\n    <a href="#" class="menu-item menu-item--toggle" data-action="toggle"><i class="icon-toggle"></i></a>\n  </nav>\n  <div class="timeline__controls controls">\n    <a href="#" class="control control--first icon-first"></a>\n    <a href="#" class="control control--play-pause icon-play"></a>\n    <a href="#" class="control control--last icon-last"></a>\n    <input type="text" class="control control--input control--time" /> <span class="control__time-separator">/</span> <input type="text" class="control control--input control--time-end" />\n  </div>\n  <div class="timeline__header">\n\n  </div>\n  <div class="timeline__main">\n\n  </div>\n</div>\n';});


// Generated by CoffeeScript 1.8.0
(function() {
  define('cs!core/Utils',['require'],function(require) {
    var Utils;
    return Utils = (function() {
      function Utils() {}

      Utils.formatMinutes = function(d) {
        var hours, minutes, output, seconds;
        d = d / 1000;
        hours = Math.floor(d / 3600);
        minutes = Math.floor((d - (hours * 3600)) / 60);
        seconds = d - (minutes * 60);
        output = seconds + "s";
        if (minutes) {
          output = minutes + "m " + output;
        }
        if (hours) {
          output = hours + "h " + output;
        }
        return output;
      };

      Utils.getClosestTime = function(data, time, objectId, property_name, timer, tolerance) {
        var item, key, prop, timer_time, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        if (objectId == null) {
          objectId = false;
        }
        if (property_name == null) {
          property_name = false;
        }
        if (timer == null) {
          timer = false;
        }
        if (tolerance == null) {
          tolerance = 0.1;
        }
        if (timer) {
          timer_time = timer.getCurrentTime() / 1000;
          if (Math.abs(timer_time - time) <= tolerance) {
            return timer_time;
          }
        }
        if (objectId || property_name) {
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            item = data[_i];
            if (item.id !== objectId || property_name) {
              if (Math.abs(item.start - time) <= tolerance) {
                return item.start;
              }
              if (Math.abs(item.end - time) <= tolerance) {
                return item.end;
              }
            }
            _ref = item.properties;
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              prop = _ref[_j];
              if (prop.keys && (item.id !== objectId || prop.name !== property_name)) {
                _ref1 = prop.keys;
                for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                  key = _ref1[_k];
                  if (Math.abs(key.time - time) <= tolerance) {
                    return key.time;
                  }
                }
              }
            }
          }
        }
        return false;
      };

      Utils.getPreviousKey = function(keys, time) {
        var key, prevKey, _i, _len;
        prevKey = false;
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          if (key.time < time) {
            prevKey = key;
          } else {
            return prevKey;
          }
        }
        return prevKey;
      };

      Utils.sortKeys = function(keys) {
        var compare;
        compare = function(a, b) {
          if (a.time < b.time) {
            return -1;
          }
          if (a.time > b.time) {
            return 1;
          }
          return 0;
        };
        return keys.sort(compare);
      };

      Utils.guid = function() {
        var s4;
        s4 = function() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
      };

      return Utils;

    })();
  });

}).call(this);

/*jslint onevar:true, undef:true, newcap:true, regexp:true, bitwise:true, maxerr:50, indent:4, white:false, nomen:false, plusplus:false */
/*global define:false, require:false, exports:false, module:false, signals:false */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

(function(global){

    // SignalBinding -------------------------------------------------
    //================================================================

    /**
     * Object that represents a binding between a Signal and a listener function.
     * <br />- <strong>This is an internal constructor and shouldn't be called by regular users.</strong>
     * <br />- inspired by Joa Ebert AS3 SignalBinding and Robert Penner's Slot classes.
     * @author Miller Medeiros
     * @constructor
     * @internal
     * @name SignalBinding
     * @param {Signal} signal Reference to Signal object that listener is currently bound to.
     * @param {Function} listener Handler function bound to the signal.
     * @param {boolean} isOnce If binding should be executed just once.
     * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
     * @param {Number} [priority] The priority level of the event listener. (default = 0).
     */
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

        /**
         * Handler function bound to the signal.
         * @type Function
         * @private
         */
        this._listener = listener;

        /**
         * If binding should be executed just once.
         * @type boolean
         * @private
         */
        this._isOnce = isOnce;

        /**
         * Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @memberOf SignalBinding.prototype
         * @name context
         * @type Object|undefined|null
         */
        this.context = listenerContext;

        /**
         * Reference to Signal object that listener is currently bound to.
         * @type Signal
         * @private
         */
        this._signal = signal;

        /**
         * Listener priority
         * @type Number
         * @private
         */
        this._priority = priority || 0;
    }

    SignalBinding.prototype = {

        /**
         * If binding is active and should be executed.
         * @type boolean
         */
        active : true,

        /**
         * Default parameters passed to listener during `Signal.dispatch` and `SignalBinding.execute`. (curried parameters)
         * @type Array|null
         */
        params : null,

        /**
         * Call listener passing arbitrary parameters.
         * <p>If binding was added using `Signal.addOnce()` it will be automatically removed from signal dispatch queue, this method is used internally for the signal dispatch.</p>
         * @param {Array} [paramsArr] Array of parameters that should be passed to the listener
         * @return {*} Value returned by the listener.
         */
        execute : function (paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },

        /**
         * Detach binding from signal.
         * - alias to: mySignal.remove(myBinding.getListener());
         * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
         */
        detach : function () {
            return this.isBound()? this._signal.remove(this._listener, this.context) : null;
        },

        /**
         * @return {Boolean} `true` if binding is still bound to the signal and have a listener.
         */
        isBound : function () {
            return (!!this._signal && !!this._listener);
        },

        /**
         * @return {boolean} If SignalBinding will only be executed once.
         */
        isOnce : function () {
            return this._isOnce;
        },

        /**
         * @return {Function} Handler function bound to the signal.
         */
        getListener : function () {
            return this._listener;
        },

        /**
         * @return {Signal} Signal that listener is currently bound to.
         */
        getSignal : function () {
            return this._signal;
        },

        /**
         * Delete instance properties
         * @private
         */
        _destroy : function () {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[SignalBinding isOnce:' + this._isOnce +', isBound:'+ this.isBound() +', active:' + this.active + ']';
        }

    };


/*global SignalBinding:false*/

    // Signal --------------------------------------------------------
    //================================================================

    function validateListener(listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error( 'listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName) );
        }
    }

    /**
     * Custom event broadcaster
     * <br />- inspired by Robert Penner's AS3 Signals.
     * @name Signal
     * @author Miller Medeiros
     * @constructor
     */
    function Signal() {
        /**
         * @type Array.<SignalBinding>
         * @private
         */
        this._bindings = [];
        this._prevParams = null;

        // enforce dispatch to aways work on same context (#47)
        var self = this;
        this.dispatch = function(){
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }

    Signal.prototype = {

        /**
         * Signals Version Number
         * @type String
         * @const
         */
        VERSION : '1.0.0',

        /**
         * If Signal should keep record of previously dispatched parameters and
         * automatically execute listener during `add()`/`addOnce()` if Signal was
         * already dispatched before.
         * @type boolean
         */
        memorize : false,

        /**
         * @type boolean
         * @private
         */
        _shouldPropagate : true,

        /**
         * If Signal is active and should broadcast events.
         * <p><strong>IMPORTANT:</strong> Setting this property during a dispatch will only affect the next dispatch, if you want to stop the propagation of a signal use `halt()` instead.</p>
         * @type boolean
         */
        active : true,

        /**
         * @param {Function} listener
         * @param {boolean} isOnce
         * @param {Object} [listenerContext]
         * @param {Number} [priority]
         * @return {SignalBinding}
         * @private
         */
        _registerListener : function (listener, isOnce, listenerContext, priority) {

            var prevIndex = this._indexOfListener(listener, listenerContext),
                binding;

            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error('You cannot add'+ (isOnce? '' : 'Once') +'() then add'+ (!isOnce? '' : 'Once') +'() the same listener without removing the relationship first.');
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }

            if(this.memorize && this._prevParams){
                binding.execute(this._prevParams);
            }

            return binding;
        },

        /**
         * @param {SignalBinding} binding
         * @private
         */
        _addBinding : function (binding) {
            //simplified insertion sort
            var n = this._bindings.length;
            do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },

        /**
         * @param {Function} listener
         * @return {number}
         * @private
         */
        _indexOfListener : function (listener, context) {
            var n = this._bindings.length,
                cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },

        /**
         * Check if listener was attached to Signal.
         * @param {Function} listener
         * @param {Object} [context]
         * @return {boolean} if Signal has the specified listener.
         */
        has : function (listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },

        /**
         * Add a listener to the signal.
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        add : function (listener, listenerContext, priority) {
            validateListener(listener, 'add');
            return this._registerListener(listener, false, listenerContext, priority);
        },

        /**
         * Add listener to the signal that should be removed after first execution (will be executed only once).
         * @param {Function} listener Signal handler function.
         * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
         * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
         * @return {SignalBinding} An Object representing the binding between the Signal and listener.
         */
        addOnce : function (listener, listenerContext, priority) {
            validateListener(listener, 'addOnce');
            return this._registerListener(listener, true, listenerContext, priority);
        },

        /**
         * Remove a single listener from the dispatch queue.
         * @param {Function} listener Handler function that should be removed.
         * @param {Object} [context] Execution context (since you can add the same handler multiple times if executing in a different context).
         * @return {Function} Listener handler function.
         */
        remove : function (listener, context) {
            validateListener(listener, 'remove');

            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
                this._bindings.splice(i, 1);
            }
            return listener;
        },

        /**
         * Remove all listeners from the Signal.
         */
        removeAll : function () {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },

        /**
         * @return {number} Number of listeners attached to the Signal.
         */
        getNumListeners : function () {
            return this._bindings.length;
        },

        /**
         * Stop propagation of the event, blocking the dispatch to next listeners on the queue.
         * <p><strong>IMPORTANT:</strong> should be called only during signal dispatch, calling it before/after dispatch won't affect signal broadcast.</p>
         * @see Signal.prototype.disable
         */
        halt : function () {
            this._shouldPropagate = false;
        },

        /**
         * Dispatch/Broadcast Signal to all listeners added to the queue.
         * @param {...*} [params] Parameters that should be passed to each handler.
         */
        dispatch : function (params) {
            if (! this.active) {
                return;
            }

            var paramsArr = Array.prototype.slice.call(arguments),
                n = this._bindings.length,
                bindings;

            if (this.memorize) {
                this._prevParams = paramsArr;
            }

            if (! n) {
                //should come after memorize
                return;
            }

            bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
            this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

            //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
            //reverse loop since listeners with higher priority will be added at the end of the list
            do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },

        /**
         * Forget memorized arguments.
         * @see Signal.memorize
         */
        forget : function(){
            this._prevParams = null;
        },

        /**
         * Remove all bindings from signal and destroy any reference to external objects (destroy Signal object).
         * <p><strong>IMPORTANT:</strong> calling any method on the signal instance after calling dispose will throw errors.</p>
         */
        dispose : function () {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },

        /**
         * @return {string} String representation of the object.
         */
        toString : function () {
            return '[Signal active:'+ this.active +' numListeners:'+ this.getNumListeners() +']';
        }

    };


    // Namespace -----------------------------------------------------
    //================================================================

    /**
     * Signals namespace
     * @namespace
     * @name signals
     */
    var signals = Signal;

    /**
     * Custom event broadcaster
     * @see Signal
     */
    // alias for backwards compatibility (see #gh-44)
    signals.Signal = Signal;



    //exports to multiple environments
    if(typeof define === 'function' && define.amd){ //AMD
        define('Signal',[],function () { return signals; });
    } else if (typeof module !== 'undefined' && module.exports){ //node
        module.exports = signals;
    } else { //browser
        //use string because of Google closure compiler ADVANCED_MODE
        /*jslint sub:true */
        global['signals'] = signals;
    }

}(this));


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/Header',['require','jquery','d3','Signal','cs!core/Utils'],function(require) {
    var $, Header, Signals, Utils, d3;
    $ = require('jquery');
    d3 = require('d3');
    Signals = require('Signal');
    Utils = require('cs!core/Utils');
    return Header = (function() {
      function Header(timer, initialDomain, tweenTime, width, margin) {
        this.timer = timer;
        this.initialDomain = initialDomain;
        this.tweenTime = tweenTime;
        this.resize = __bind(this.resize, this);
        this.createTimeHandle = __bind(this.createTimeHandle, this);
        this.render = __bind(this.render, this);
        this.createBrushHandle = __bind(this.createBrushHandle, this);
        this.onDurationChanged = __bind(this.onDurationChanged, this);
        this.setDomain = __bind(this.setDomain, this);
        this.adaptDomainToDuration = __bind(this.adaptDomainToDuration, this);
        this.onBrush = new Signals.Signal();
        this.margin = {
          top: 10,
          right: 20,
          bottom: 0,
          left: margin.left
        };
        this.height = 50 - this.margin.top - this.margin.bottom + 20;
        this.currentTime = this.timer.time;
        this.x = d3.time.scale().range([0, width]);
        this.x.domain([0, this.timer.totalDuration]);
        this.xDisplayed = d3.time.scale().range([0, width]);
        this.xDisplayed.domain(this.initialDomain);
        this.xAxis = d3.svg.axis().scale(this.x).orient("top").tickSize(-5, 0).tickFormat(Utils.formatMinutes);
        this.svg = d3.select('.timeline__header').append("svg").attr("width", width + this.margin.left + this.margin.right).attr("height", 56);
        this.svgContainer = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.createBrushHandle();
        this.createTimeHandle();
        this.timer.durationChanged.add(this.onDurationChanged);
      }

      Header.prototype.adaptDomainToDuration = function(domain, seconds) {
        var ms, new_domain;
        ms = seconds * 1000;
        new_domain = [domain[0], domain[1]];
        new_domain[0] = Math.min(new_domain[0], ms);
        new_domain[1] = Math.min(new_domain[1], ms);
        new_domain[0] = Math.max(new_domain[0], 0);
        return new_domain;
      };

      Header.prototype.setDomain = function(domain) {
        this.brush.x(this.x).extent(this.initialDomain);
        this.svgContainer.select('.brush').call(this.brush);
        this.onBrush.dispatch(this.initialDomain);
        this.render();
        return this.xDisplayed.domain(this.initialDomain);
      };

      Header.prototype.onDurationChanged = function(seconds) {
        this.x.domain([0, this.timer.totalDuration]);
        this.xAxisElement.call(this.xAxis);
        this.initialDomain = this.adaptDomainToDuration(this.initialDomain, seconds);
        return this.setDomain(this.initialDomain);
      };

      Header.prototype.createBrushHandle = function() {
        var onBrush;
        this.xAxisElement = this.svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + (this.margin.top + 7) + ")").call(this.xAxis);
        onBrush = (function(_this) {
          return function() {
            var end, extent0, start;
            extent0 = _this.brush.extent();
            start = extent0[0].getTime();
            end = extent0[1].getTime();
            _this.initialDomain[0] = start;
            _this.initialDomain[1] = end;
            return _this.setDomain(_this.initialDomain);
          };
        })(this);
        this.brush = d3.svg.brush().x(this.x).extent(this.initialDomain).on("brush", onBrush);
        return this.gBrush = this.svgContainer.append("g").attr("class", "brush").call(this.brush).selectAll("rect").attr('height', 20);
      };

      Header.prototype.render = function() {
        var timeSelection;
        timeSelection = this.svgContainer.selectAll('.time-indicator');
        return timeSelection.attr('transform', 'translate(' + (this.xDisplayed(this.currentTime[0])) + ', 25)');
      };

      Header.prototype.createTimeHandle = function() {
        var dragTime, dragTimeMove, self, timeClicker, timeGrp, timeSelection;
        self = this;
        dragTimeMove = function(d) {
          var dx, event, event_x, time, timeMatch, tweenTime;
          event = d3.event.sourceEvent;
          event.stopPropagation();
          tweenTime = self.tweenTime;
          event_x = event.x != null ? event.x : event.clientX;
          dx = self.xDisplayed.invert(event_x - self.margin.left);
          dx = dx.getTime();
          dx = Math.max(0, dx);
          timeMatch = false;
          if (event.shiftKey) {
            time = dx / 1000;
            timeMatch = Utils.getClosestTime(tweenTime.data, time, '---non-existant');
            if (timeMatch !== false) {
              timeMatch = timeMatch * 1000;
            }
          }
          if (timeMatch === false) {
            timeMatch = dx;
          }
          return self.timer.seek([timeMatch]);
        };
        dragTime = d3.behavior.drag().origin(function(d) {
          return d;
        }).on("drag", dragTimeMove);
        timeSelection = this.svgContainer.selectAll('.time-indicator').data(this.currentTime);
        timeClicker = timeSelection.enter().append('rect').attr('x', 0).attr('y', 20).attr('width', self.xDisplayed(self.timer.totalDuration)).attr('height', 50).attr('fill-opacity', 0).on('click', function(d) {
          var dx, mouse;
          mouse = d3.mouse(this);
          dx = self.xDisplayed.invert(mouse[0]);
          dx = dx.getTime();
          dx = Math.max(0, dx);
          return self.timer.seek([dx]);
        });
        timeGrp = timeSelection.enter().append("g").attr('class', "time-indicator").attr("transform", "translate(-0.5," + 30 + ")").call(dragTime);
        timeGrp.append('rect').attr('class', 'time-indicator__line').attr('x', -0.5).attr('y', 0).attr('width', 1).attr('height', 1000);
        timeGrp.append('path').attr('class', 'time-indicator__handle').attr('d', 'M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3');
        return this.svgContainer.append("rect").attr("class", "graph-mask").attr("x", -self.margin.left).attr("y", -self.margin.top).attr("width", self.margin.left - 5).attr("height", self.height);
      };

      Header.prototype.resize = function(width) {
        width = width - this.margin.left - this.margin.right;
        this.svg.attr("width", width + this.margin.left + this.margin.right);
        this.x.range([0, width]);
        this.xDisplayed.range([0, width]);
        return this.xAxisElement.call(this.xAxis);
      };

      return Header;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/TimeIndicator',['require','jquery','d3','Signal'],function(require) {
    var $, Signals, TimeIndicator, d3;
    $ = require('jquery');
    d3 = require('d3');
    Signals = require('Signal');
    return TimeIndicator = (function() {
      function TimeIndicator(timeline, container) {
        var timeGrp;
        this.timeline = timeline;
        this.container = container;
        this.render = __bind(this.render, this);
        this.timeSelection = this.container.selectAll('.time-indicator').data(this.timeline.currentTime);
        timeGrp = this.timeSelection.enter().append("svg").attr('class', "time-indicator timeline__right-mask").attr('width', window.innerWidth - this.timeline.label_position_x).attr('height', 442);
        this.timeSelection = timeGrp.append('rect').attr('class', 'time-indicator__line').attr('x', -1).attr('y', -this.timeline.margin.top - 5).attr('width', 1).attr('height', 1000);
      }

      TimeIndicator.prototype.render = function() {
        this.timeSelection = this.container.selectAll('.time-indicator rect');
        return this.timeSelection.attr('x', this.timeline.x(this.timeline.currentTime[0]) - 0.5);
      };

      return TimeIndicator;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/Items',['require','d3','Signal','lodash','cs!core/Utils'],function(require) {
    var Items, Signals, Utils, d3, _;
    d3 = require('d3');
    Signals = require('Signal');
    _ = require('lodash');
    Utils = require('cs!core/Utils');
    return Items = (function() {
      function Items(timeline, container) {
        this.timeline = timeline;
        this.container = container;
        this.render = __bind(this.render, this);
        this.dy = 10 + this.timeline.margin.top;
        this.onUpdate = new Signals.Signal();
      }

      Items.prototype.render = function() {
        var bar, barContainerRight, barEnter, barWithStartAndEnd, bar_border, drag, dragLeft, dragRight, dragmove, dragmoveLeft, dragmoveRight, selectBar, self, tweenTime;
        self = this;
        tweenTime = self.timeline.tweenTime;
        selectBar = function(d) {
          return self.timeline.selectionManager.select(this);
        };
        dragmove = function(d) {
          var diff, dx, key, prop, _i, _j, _len, _len1, _ref, _ref1;
          dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
          diff = dx - d.start;
          d.start += diff;
          d.end += diff;
          if (d.properties) {
            _ref = d.properties;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              prop = _ref[_i];
              _ref1 = prop.keys;
              for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                key = _ref1[_j];
                key.time += diff;
              }
            }
          }
          d._isDirty = true;
          return self.onUpdate.dispatch();
        };
        dragmoveLeft = function(d) {
          var diff, dx, sourceEvent, timeMatch;
          d3.event.sourceEvent.stopPropagation();
          sourceEvent = d3.event.sourceEvent;
          dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
          timeMatch = false;
          if (sourceEvent.shiftKey) {
            timeMatch = Utils.getClosestTime(tweenTime.data, dx, d.id, false, tweenTime.timer);
          }
          if (!timeMatch) {
            diff = dx - d.start;
            timeMatch = d.start + diff;
          }
          d.start = timeMatch;
          d._isDirty = true;
          return self.onUpdate.dispatch();
        };
        dragmoveRight = function(d) {
          var diff, dx, sourceEvent, timeMatch;
          d3.event.sourceEvent.stopPropagation();
          sourceEvent = d3.event.sourceEvent;
          dx = self.timeline.x.invert(d3.event.x).getTime() / 1000;
          timeMatch = false;
          if (sourceEvent.shiftKey) {
            timeMatch = Utils.getClosestTime(tweenTime.data, dx, false, false, tweenTime.timer);
          }
          if (!timeMatch) {
            diff = dx - d.end;
            timeMatch = d.end + diff;
          }
          d.end = timeMatch;
          d._isDirty = true;
          return self.onUpdate.dispatch();
        };
        dragLeft = d3.behavior.drag().origin(function(d) {
          var t;
          t = d3.select(this);
          return {
            x: t.attr('x'),
            y: t.attr('y')
          };
        }).on("drag", dragmoveLeft);
        dragRight = d3.behavior.drag().origin(function(d) {
          var t;
          t = d3.select(this);
          return {
            x: t.attr('x'),
            y: t.attr('y')
          };
        }).on("drag", dragmoveRight);
        drag = d3.behavior.drag().origin(function(d) {
          var t;
          t = d3.select(this);
          return {
            x: t.attr('x'),
            y: t.attr('y')
          };
        }).on("drag", dragmove);
        bar_border = 1;
        bar = this.container.selectAll(".line-grp").data(this.timeline.tweenTime.data, function(d) {
          return d.id;
        });
        barEnter = bar.enter().append('g').attr('class', 'line-grp');
        barContainerRight = barEnter.append('svg').attr('class', 'timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);
        barContainerRight.append("rect").attr("class", "bar").attr('id', function(d) {
          return Utils.guid();
        }).attr("y", 3).attr("height", 14);
        barContainerRight.append("rect").attr("class", "bar-anchor bar-anchor--left").attr("y", 2).attr("height", 16).attr("width", 6).call(dragLeft);
        barContainerRight.append("rect").attr("class", "bar-anchor bar-anchor--right").attr("y", 2).attr("height", 16).attr("width", 6).call(dragRight);
        self.dy = 10 + this.timeline.margin.top;
        bar.attr("transform", function(d, i) {
          var numProperties, visibleProperties, y;
          y = self.dy;
          self.dy += self.timeline.lineHeight;
          if (!d.collapsed) {
            numProperties = 0;
            if (d.properties) {
              visibleProperties = _.filter(d.properties, function(prop) {
                return prop.keys.length;
              });
              numProperties = visibleProperties.length;
            }
            self.dy += numProperties * self.timeline.lineHeight;
          }
          return "translate(0," + y + ")";
        });
        barWithStartAndEnd = function(d) {
          if ((d.start != null) && (d.end != null)) {
            return true;
          }
          return false;
        };
        bar.selectAll('.bar-anchor--left').filter(barWithStartAndEnd).attr("x", function(d) {
          return self.timeline.x(d.start * 1000) - 1;
        }).on('mousedown', function() {
          return d3.event.stopPropagation();
        });
        bar.selectAll('.bar-anchor--right').filter(barWithStartAndEnd).attr("x", function(d) {
          return self.timeline.x(d.end * 1000) - 1;
        }).on('mousedown', function() {
          return d3.event.stopPropagation();
        });
        bar.selectAll('.bar').filter(barWithStartAndEnd).attr("x", function(d) {
          return self.timeline.x(d.start * 1000) + bar_border;
        }).attr("width", function(d) {
          return Math.max(0, (self.timeline.x(d.end) - self.timeline.x(d.start)) * 1000 - bar_border);
        }).call(drag).on("click", selectBar).on('mousedown', function() {
          return d3.event.stopPropagation();
        });
        barEnter.append("text").attr("class", "line-label").attr("x", self.timeline.label_position_x + 10).attr("y", 16).text(function(d) {
          return d.label;
        }).on('click', selectBar).on('mousedown', function() {
          return d3.event.stopPropagation();
        });
        self = this;
        barEnter.append("text").attr("class", "line__toggle").attr("x", self.timeline.label_position_x - 10).attr("y", 16).on('click', function(d) {
          d.collapsed = !d.collapsed;
          return self.onUpdate.dispatch();
        });
        bar.selectAll(".line__toggle").text(function(d) {
          if (d.collapsed) {
            return "▸";
          } else {
            return "▾";
          }
        });
        barEnter.append("line").attr("class", 'line-separator').attr("x1", -self.timeline.margin.left).attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100)).attr("y1", self.timeline.lineHeight).attr("y2", self.timeline.lineHeight);
        bar.exit().remove();
        return bar;
      };

      return Items;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/KeysPreview',['require','d3'],function(require) {
    var KeysPreview, d3;
    d3 = require('d3');
    return KeysPreview = (function() {
      function KeysPreview(timeline, container) {
        this.timeline = timeline;
        this.container = container;
        this.render = __bind(this.render, this);
      }

      KeysPreview.prototype.render = function(bar) {
        var keyKey, keyValue, key_item, keys, propKey, propVal, properties, self, setItemStyle, subGrp, tweenTime;
        self = this;
        tweenTime = self.timeline.tweenTime;
        propVal = function(d, i) {
          if (d.properties) {
            return d.properties;
          } else {
            return [];
          }
        };
        propKey = function(d) {
          return d.name;
        };
        properties = bar.selectAll('.keys-preview').data(propVal, propKey);
        subGrp = properties.enter().append('svg').attr("class", 'keys-preview timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);
        setItemStyle = function(d) {
          var bar_data, item;
          item = d3.select(this.parentNode.parentNode);
          bar_data = item.datum();
          if (bar_data.collapsed === true) {
            return "";
          }
          return "display: none;";
        };
        properties.selectAll('.key--preview').attr("style", setItemStyle);
        keyValue = function(d, i, j) {
          return d.keys;
        };
        keyKey = function(d, k) {
          return d.time;
        };
        keys = properties.selectAll('.key--preview').data(keyValue, keyKey);
        key_item = keys.enter().append('path').attr('class', 'key--preview').attr("style", setItemStyle).attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0');
        keys.attr('transform', function(d) {
          var dx, dy;
          dx = self.timeline.x(d.time * 1000);
          dx = parseInt(dx, 10);
          dy = 11;
          return "translate(" + dx + "," + dy + ")";
        });
        return keys.exit().remove();
      };

      return KeysPreview;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  define('cs!graph/Properties',['require','d3','Signal','cs!core/Utils'],function(require) {
    var Properties, Signals, Utils, d3;
    d3 = require('d3');
    Signals = require('Signal');
    Utils = require('cs!core/Utils');
    return Properties = (function() {
      function Properties(timeline) {
        this.timeline = timeline;
        this.onKeyAdded = new Signals.Signal();
        this.subGrp = false;
      }

      Properties.prototype.render = function(bar) {
        var dy, propKey, propVal, properties, self, subGrp, visibleProperties;
        self = this;
        propVal = function(d, i) {
          if (d.properties) {
            return d.properties;
          } else {
            return [];
          }
        };
        propKey = function(d) {
          return d.name;
        };
        visibleProperties = function(d) {
          return d.keys.length;
        };
        properties = bar.selectAll('.line-item').data(propVal, propKey);
        dy = 0;
        subGrp = properties.enter().append('g').filter(visibleProperties).attr("class", 'line-item');
        self.subGrp = subGrp;
        properties.filter(visibleProperties).attr("transform", function(d, i) {
          var sub_height;
          sub_height = (i + 1) * self.timeline.lineHeight;
          return "translate(0," + sub_height + ")";
        });
        subGrp.append('rect').attr('class', 'click-handler click-handler--property').attr('x', 0).attr('y', 0).attr('width', self.timeline.x(self.timeline.timer.totalDuration + 100)).attr('height', self.timeline.lineHeight).on('dblclick', function(d) {
          var def, dx, keyContainer, lineObject, lineValue, mouse, newKey, prevKey;
          lineObject = this.parentNode.parentNode;
          lineValue = d3.select(lineObject).datum();
          def = d["default"] ? d["default"] : 0;
          mouse = d3.mouse(this);
          dx = self.timeline.x.invert(mouse[0]);
          dx = dx.getTime() / 1000;
          prevKey = Utils.getPreviousKey(d.keys, dx);
          if (prevKey) {
            def = prevKey.val;
          }
          newKey = {
            time: dx,
            val: def
          };
          d.keys.push(newKey);
          d.keys = Utils.sortKeys(d.keys);
          lineValue._isDirty = true;
          keyContainer = this.parentNode;
          return self.onKeyAdded.dispatch(newKey, keyContainer);
        });
        subGrp.append('svg').attr('class', 'line-item__keys timeline__right-mask').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight).attr('fill', '#f00');
        subGrp.append('text').attr("class", "line-label line-label--small").attr("x", self.timeline.label_position_x + 10).attr("y", 15).text(function(d) {
          return d.name;
        });
        subGrp.append("line").attr("class", 'line-separator--secondary').attr("x1", -self.timeline.margin.left).attr("x2", self.timeline.x(self.timeline.timer.totalDuration + 100)).attr("y1", self.timeline.lineHeight).attr("y2", self.timeline.lineHeight);
        bar.selectAll('.line-item').attr('display', function(d) {
          var lineObject, lineValue;
          lineObject = this.parentNode;
          lineValue = d3.select(lineObject).datum();
          if (!lineValue.collapsed) {
            return "block";
          } else {
            return "none";
          }
        });
        return properties;
      };

      return Properties;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  define('cs!graph/Keys',['require','d3','Signal','cs!core/Utils','lodash'],function(require) {
    var Keys, Signals, Utils, d3, _;
    d3 = require('d3');
    Signals = require('Signal');
    Utils = require('cs!core/Utils');
    _ = require('lodash');
    return Keys = (function() {
      function Keys(timeline) {
        this.timeline = timeline;
        this.onKeyUpdated = new Signals.Signal();
      }

      Keys.prototype.selectNewKey = function(data, container) {
        var key, self;
        self = this;
        key = d3.select(container).selectAll('.key').filter(function(item) {
          return item.time === data.time;
        });
        if (key.length) {
          d3.selectAll('.key--selected').classed('key--selected', false);
          key.classed('key--selected', true);
          key = key[0][0];
          return self.timeline.selectionManager.select(key);
        }
      };

      Keys.prototype.render = function(properties) {
        var drag, dragend, dragmove, grp_in, grp_inout, grp_linear, grp_out, key_grp, keys, propKey, propValue, selectKey, self, tweenTime;
        self = this;
        tweenTime = self.timeline.tweenTime;
        dragmove = function(d) {
          var currentDomainStart, data, dx, is_first, item, key_scale, lineData, lineObject, mouse, old_time, propertyData, propertyObject, selection, selection_first_time, selection_last_time, sourceEvent, timeMatch, time_offset, updateKeyItem, _i, _len;
          sourceEvent = d3.event.sourceEvent;
          propertyObject = this.parentNode;
          lineObject = propertyObject.parentNode.parentNode;
          propertyData = d3.select(propertyObject).datum();
          lineData = d3.select(lineObject).datum();
          currentDomainStart = self.timeline.x.domain()[0];
          mouse = d3.mouse(this);
          old_time = d.time;
          dx = self.timeline.x.invert(mouse[0]);
          dx = dx.getTime();
          dx = dx / 1000 - currentDomainStart / 1000;
          dx = d.time + dx;
          selection = self.timeline.selectionManager.getSelection();
          selection_first_time = false;
          selection_last_time = false;
          if (selection.length) {
            selection_first_time = d3.select(selection[0]).datum().time;
            selection_last_time = d3.select(selection[selection.length - 1]).datum().time;
          }
          selection = _.filter(selection, (function(_this) {
            return function(item) {
              return item.isEqualNode(_this) === false;
            };
          })(this));
          timeMatch = false;
          if (sourceEvent.shiftKey) {
            timeMatch = Utils.getClosestTime(tweenTime.data, dx, lineData.id, propertyData.name, tweenTime.timer);
          }
          if (timeMatch === false) {
            timeMatch = dx;
          }
          d.time = timeMatch;
          propertyData.keys = Utils.sortKeys(propertyData.keys);
          time_offset = d.time - old_time;
          updateKeyItem = function(item) {
            var itemLineData, itemLineObject, itemPropertyData, itemPropertyObject;
            itemPropertyObject = item.parentNode;
            itemPropertyData = d3.select(itemPropertyObject).datum();
            itemLineObject = itemPropertyObject.parentNode.parentNode;
            itemLineData = d3.select(itemLineObject).datum();
            itemLineData._isDirty = true;
            return itemPropertyData.keys = Utils.sortKeys(itemPropertyData.keys);
          };
          key_scale = false;
          is_first = false;
          if (selection.length) {
            if (sourceEvent.altKey && (selection_first_time != null) && (selection_last_time != null)) {
              is_first = selection_first_time === old_time;
              if (is_first) {
                key_scale = (selection_last_time - d.time) / (selection_last_time - old_time);
              } else {
                key_scale = (d.time - selection_first_time) / (old_time - selection_first_time);
              }
            }
            for (_i = 0, _len = selection.length; _i < _len; _i++) {
              item = selection[_i];
              data = d3.select(item).datum();
              if (key_scale === false) {
                data.time += time_offset;
              } else {
                if (is_first) {
                  data.time = selection_last_time - (selection_last_time - data.time) * key_scale;
                } else {
                  data.time = selection_first_time + (data.time - selection_first_time) * key_scale;
                }
              }
              updateKeyItem(item);
            }
          }
          lineData._isDirty = true;
          return self.onKeyUpdated.dispatch();
        };
        propValue = function(d, i, j) {
          return d.keys;
        };
        propKey = function(d, k) {
          if (!d._id) {
            d._id = Utils.guid();
          }
          return d._id;
        };
        keys = properties.select('.line-item__keys').selectAll('.key').data(propValue, propKey);
        selectKey = function(d) {
          var addToSelection, event;
          event = d3.event;
          if (event.sourceEvent) {
            event = event.sourceEvent;
          }
          addToSelection = event.shiftKey;
          if (d3.event.type && d3.event.type === "dragstart") {
            if (d3.select(this).classed('key--selected')) {
              return;
            }
          }
          return self.timeline.selectionManager.select(this, addToSelection);
        };
        dragend = (function(_this) {
          return function(d) {
            return self.timeline.editor.undoManager.addState();
          };
        })(this);
        drag = d3.behavior.drag().origin(function(d) {
          return d;
        }).on("drag", dragmove).on("dragstart", selectKey).on("dragend", dragend);
        key_grp = keys.enter().append('g').attr('class', 'key').attr('id', function(d) {
          return d._id;
        }).on('mousedown', function() {
          return d3.event.stopPropagation();
        }).call(drag);
        properties.selectAll('.key').attr('class', function(d) {
          var cls, ease;
          cls = 'key';
          if (d3.select(this).classed('key--selected')) {
            cls += " key--selected";
          }
          if (d.ease) {
            ease = d.ease.split('.');
            if (ease.length === 2) {
              cls += " " + ease[1];
            }
          } else {
            cls += ' easeOut';
          }
          return cls;
        });
        grp_linear = key_grp.append('g').attr('class', 'ease-linear');
        grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');
        grp_linear.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');
        grp_in = key_grp.append('g').attr('class', 'ease-in');
        grp_in.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L 4 5 L 1 0 L 4 -5');
        grp_in.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L -6 0 L 0 6');
        grp_out = key_grp.append('g').attr('class', 'ease-out');
        grp_out.append('path').attr('class', 'key__shape-rect').attr('d', 'M 0 -6 L 0 6 L -4 5 L -1 0 L -4 -5');
        grp_out.append('path').attr('class', 'key__shape-arrow').attr('d', 'M 0 -6 L 6 0 L 0 6');
        grp_inout = key_grp.append('g').attr('class', 'ease-inout');
        grp_inout.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 5);
        keys.attr('transform', function(d) {
          var dx, dy;
          dx = self.timeline.x(d.time * 1000);
          dx = parseInt(dx, 10);
          dy = 10;
          return "translate(" + dx + "," + dy + ")";
        });
        return keys.exit().remove();
      };

      return Keys;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  define('cs!graph/Errors',['require','d3','Signal','cs!core/Utils'],function(require) {
    var Errors, Signals, Utils, d3;
    d3 = require('d3');
    Signals = require('Signal');
    Utils = require('cs!core/Utils');
    return Errors = (function() {
      function Errors(timeline) {
        this.timeline = timeline;
      }

      Errors.prototype.render = function(properties) {
        var errorTime, errors, errorsGrp, errorsValue, propertiesWithError, self, subGrp;
        self = this;
        subGrp = self.timeline.properties.subGrp;
        propertiesWithError = function(d) {
          return d.errors != null;
        };
        errorsGrp = subGrp.insert('svg', ':first-child').attr('class', 'line-item__errors').attr('width', window.innerWidth - self.timeline.label_position_x).attr('height', self.timeline.lineHeight);
        errorsValue = function(d, i, j) {
          return d.errors;
        };
        errorTime = function(d, k) {
          return d.time;
        };
        errors = properties.filter(propertiesWithError).select('.line-item__errors').selectAll('.error').data(errorsValue, errorTime);
        errors.enter().append('rect').attr('class', 'error').attr('width', 4).attr('height', self.timeline.lineHeight - 1).attr('y', '1');
        properties.selectAll('.error').attr('x', function(d) {
          var dx;
          dx = self.timeline.x(d.time * 1000);
          return dx;
        });
        return errors.exit().remove();
      };

      return Errors;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/Selection',['require'],function(require) {
    var Selection;
    return Selection = (function() {
      function Selection(timeline, svg, margin) {
        this.timeline = timeline;
        this.svg = svg;
        this.margin = margin;
        this.onMouseUp = __bind(this.onMouseUp, this);
        this.init();
      }

      Selection.prototype.onMouseUp = function(e) {
        this.svg.selectAll('.selection').remove();
        return $('body').css({
          'user-select': 'all'
        });
      };

      Selection.prototype.init = function() {
        var self;
        self = this;
        this.svg.on("mousedown", function() {
          var p;
          p = d3.mouse(this);
          self.svg.append('rect').attr({
            "class": 'selection',
            x: p[0],
            y: p[1],
            width: 0,
            height: 0
          });
          self.timeline.selectionManager.reset();
          return $('body').css({
            'user-select': 'none'
          });
        }).on("mousemove", function() {
          var containerBounding, d, key_width, move, p, s, selection;
          s = self.svg.select('.selection');
          if (s.empty()) {
            return;
          }
          p = d3.mouse(this);
          ({
            margin: self.margin
          });
          d = {
            x: parseInt(s.attr('x'), 10),
            y: parseInt(s.attr('y'), 10),
            width: parseInt(s.attr('width'), 10),
            height: parseInt(s.attr('height'), 10)
          };
          p[0] = Math.max(self.margin.left, p[0]);
          move = {
            x: p[0] - d.x,
            y: p[1] - d.y
          };
          if (move.x < 1 || move.x * 2 < d.width) {
            d.x = p[0];
            d.width -= move.x;
          } else {
            d.width = move.x;
          }
          if (move.y < 1 || move.y * 2 < d.height) {
            d.y = p[1];
            d.height -= move.y;
          } else {
            d.height = move.y;
          }
          s.attr(d);
          d.x -= self.margin.left;
          key_width = 6;
          d.timeStart = self.timeline.x.invert(d.x - key_width).getTime() / 1000;
          d.timeEnd = self.timeline.x.invert(d.x + d.width + key_width).getTime() / 1000;
          containerBounding = self.svg[0][0].getBoundingClientRect();
          d3.selectAll('.key--selected').classed('key--selected', false);
          self.timeline.selectionManager.reset();
          selection = [];
          d3.selectAll('.key').each(function(state_data, i) {
            var itemBounding, item_data, y;
            item_data = d3.select(this.parentNode.parentNode.parentNode).datum();
            if (item_data.collapsed !== true) {
              itemBounding = d3.select(this)[0][0].getBoundingClientRect();
              y = itemBounding.top - containerBounding.top;
              if (state_data.time >= d.timeStart && state_data.time <= d.timeEnd) {
                if ((y >= d.y && y <= d.y + d.height) || (y + 10 >= d.y && y + 10 <= d.y + d.height)) {
                  d3.select(this).classed('key--selected', true);
                  return selection.push(this);
                }
              }
            }
          });
          return self.timeline.selectionManager.select(selection);
        });
        return $(window).on("mouseup", this.onMouseUp);
      };

      return Selection;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!graph/Timeline',['require','jquery','d3','cs!core/Utils','cs!graph/Header','cs!graph/TimeIndicator','cs!graph/Items','cs!graph/KeysPreview','cs!graph/Properties','cs!graph/Keys','cs!graph/Errors','cs!graph/Selection'],function(require) {
    var $, Errors, Header, Items, Keys, KeysPreview, Properties, Selection, TimeIndicator, Timeline, Utils, d3, extend;
    $ = require('jquery');
    d3 = require('d3');
    Utils = require('cs!core/Utils');
    Header = require('cs!graph/Header');
    TimeIndicator = require('cs!graph/TimeIndicator');
    Items = require('cs!graph/Items');
    KeysPreview = require('cs!graph/KeysPreview');
    Properties = require('cs!graph/Properties');
    Keys = require('cs!graph/Keys');
    Errors = require('cs!graph/Errors');
    Selection = require('cs!graph/Selection');
    extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };
    return Timeline = (function() {
      function Timeline(editor) {
        var height, margin, width;
        this.editor = editor;
        this.render = __bind(this.render, this);
        this.onUpdate = __bind(this.onUpdate, this);
        this.tweenTime = this.editor.tweenTime;
        this.timer = this.tweenTime.timer;
        this.selectionManager = this.editor.selectionManager;
        this._isDirty = true;
        this.timer = this.tweenTime.timer;
        this.currentTime = this.timer.time;
        this.initialDomain = [0, 20 * 1000];
        margin = {
          top: 6,
          right: 20,
          bottom: 0,
          left: 265
        };
        this.margin = margin;
        width = window.innerWidth - margin.left - margin.right;
        height = 270 - margin.top - margin.bottom - 40;
        this.lineHeight = 20;
        this.label_position_x = -margin.left + 20;
        this.x = d3.time.scale().range([0, width]);
        this.x.domain(this.initialDomain);
        this.xAxis = d3.svg.axis().scale(this.x).orient("top").tickSize(-height, 0).tickFormat(Utils.formatMinutes);
        this.svg = d3.select('.timeline__main').append("svg").attr("width", width + margin.left + margin.right).attr("height", 600);
        this.svgContainer = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.svgContainerTime = this.svg.append("g").attr("transform", "translate(" + margin.left + ",0)");
        this.linesContainer = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        this.header = new Header(this.timer, this.initialDomain, this.tweenTime, width, margin);
        this.timeIndicator = new TimeIndicator(this, this.svgContainerTime);
        this.selection = new Selection(this, this.svg, margin);
        this.items = new Items(this, this.linesContainer);
        this.items.onUpdate.add(this.onUpdate);
        this.keysPreview = new KeysPreview(this, this.linesContainer);
        this.properties = new Properties(this);
        this.properties.onKeyAdded.add((function(_this) {
          return function(newKey, keyContainer) {
            _this._isDirty = true;
            _this.render(0, false);
            return _this.keys.selectNewKey(newKey, keyContainer);
          };
        })(this));
        this.errors = new Errors(this);
        this.keys = new Keys(this);
        this.keys.onKeyUpdated.add(this.onUpdate);
        this.xAxisGrid = d3.svg.axis().scale(this.x).ticks(100).tickSize(-this.items.dy, 0).tickFormat("").orient("top");
        this.xGrid = this.svgContainer.append('g').attr('class', 'x axis grid').attr("transform", "translate(0," + margin.top + ")").call(this.xAxisGrid);
        this.xAxisElement = this.svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + margin.top + ")").call(this.xAxis);
        this.header.onBrush.add((function(_this) {
          return function(extent) {
            _this.x.domain(extent);
            _this.xGrid.call(_this.xAxisGrid);
            _this.xAxisElement.call(_this.xAxis);
            return _this._isDirty = true;
          };
        })(this));
        window.requestAnimationFrame(this.render);
        window.onresize = (function(_this) {
          return function() {
            var INNER_WIDTH;
            INNER_WIDTH = window.innerWidth;
            width = INNER_WIDTH - margin.left - margin.right;
            _this.svg.attr("width", width + margin.left + margin.right);
            _this.svg.selectAll('.timeline__right-mask').attr('width', INNER_WIDTH);
            _this.x.range([0, width]);
            _this._isDirty = true;
            _this.header.resize(INNER_WIDTH);
            return _this.render();
          };
        })(this);
      }

      Timeline.prototype.onUpdate = function() {
        return this.editor.render(false, true);
      };

      Timeline.prototype.render = function(time, time_changed) {
        var bar, domainLength, height, margin_ms, properties;
        if (time_changed) {
          margin_ms = 16;
          if (this.timer.getCurrentTime() > this.initialDomain[1]) {
            domainLength = this.initialDomain[1] - this.initialDomain[0];
            this.initialDomain[0] += domainLength - margin_ms;
            this.initialDomain[1] += domainLength - margin_ms;
            this.header.setDomain(this.initialDomain);
          }
          if (this.timer.getCurrentTime() < this.initialDomain[0]) {
            domainLength = this.initialDomain[1] - this.initialDomain[0];
            this.initialDomain[0] = this.timer.getCurrentTime();
            this.initialDomain[1] = this.initialDomain[0] + domainLength;
            this.header.setDomain(this.initialDomain);
          }
        }
        if (this._isDirty || time_changed) {
          this.header.render();
          this.timeIndicator.render();
        }
        if (this._isDirty) {
          bar = this.items.render();
          this.keysPreview.render(bar);
          properties = this.properties.render(bar);
          this.errors.render(properties);
          this.keys.render(properties);
          this._isDirty = false;
          height = Math.max(this.items.dy + 30, 230);
          this.xAxis.tickSize(-height, 0);
          this.xAxisGrid.tickSize(-height, 0);
          this.xGrid.call(this.xAxisGrid);
          this.xAxisElement.call(this.xAxis);
          return this.svg.attr("height", height);
        }
      };

      return Timeline;

    })();
  });

}).call(this);


define('text!templates/propertyNumber.tpl.html',[],function () { return '<div class="property property--number">\n  <button class="property__key"></button>\n  <label for="{{id}}" class="property__label">{{label}}</label>\n  <input type="number" id="{{id}}" class="property__input" value="{{val}}" />\n</div>\n';});


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/PropertyBase',['require','jquery','Signal','lodash','cs!core/Utils','Mustache','text!templates/propertyNumber.tpl.html'],function(require) {
    var $, Mustache, PropertyBase, Signals, Utils, tpl_property, _;
    $ = require('jquery');
    Signals = require('Signal');
    _ = require('lodash');
    Utils = require('cs!core/Utils');
    Mustache = require('Mustache');
    tpl_property = require('text!templates/propertyNumber.tpl.html');
    return PropertyBase = (function() {
      function PropertyBase(instance_property, lineData, editor, key_val) {
        this.instance_property = instance_property;
        this.lineData = lineData;
        this.editor = editor;
        this.key_val = key_val != null ? key_val : false;
        this.update = __bind(this.update, this);
        this.render = __bind(this.render, this);
        this.addKey = __bind(this.addKey, this);
        this.getCurrentKey = __bind(this.getCurrentKey, this);
        this.onInputChange = __bind(this.onInputChange, this);
        this.getCurrentVal = __bind(this.getCurrentVal, this);
        this.getInputVal = __bind(this.getInputVal, this);
        this.onKeyClick = __bind(this.onKeyClick, this);
        this.timer = this.editor.timer;
        this.keyAdded = new Signals.Signal();
        this.render();
        this.$key = this.$el.find('.property__key');
      }

      PropertyBase.prototype.onKeyClick = function(e) {
        var currentValue;
        e.preventDefault();
        currentValue = this.getCurrentVal();
        return this.addKey(currentValue);
      };

      PropertyBase.prototype.getInputVal = function() {
        return this.$el.find('input').val();
      };

      PropertyBase.prototype.getCurrentVal = function() {
        var prop_name, val;
        val = this.instance_property.val;
        prop_name = this.instance_property.name;
        if (this.key_val) {
          return this.key_val.val;
        }
        if ((this.lineData.values != null) && this.lineData.values[prop_name]) {
          return this.lineData.values[prop_name];
        }
        return val;
      };

      PropertyBase.prototype.onInputChange = function(e) {
        var currentTime, current_key, current_value;
        current_value = this.getInputVal();
        currentTime = this.timer.getCurrentTime() / 1000;
        if (this.key_val) {
          currentTime = this.key_val.time;
        }
        if (this.instance_property.keys && this.instance_property.keys.length) {
          current_key = _.find(this.instance_property.keys, (function(_this) {
            return function(key) {
              return key.time === currentTime;
            };
          })(this));
          if (current_key) {
            current_key.val = current_value;
          } else {
            this.addKey(current_value);
          }
        } else {
          this.instance_property.val = current_value;
          this.lineData.values[this.instance_property.name] = current_value;
          if (this.lineData.object) {
            currentTime = this.timer.getCurrentTime() / 1000;
            this.lineData.object.update(currentTime - this.lineData.start);
          }
        }
        return this.lineData._isDirty = true;
      };

      PropertyBase.prototype.getCurrentKey = function() {
        var key, time, _i, _len, _ref;
        time = this.timer.getCurrentTime() / 1000;
        if (!this.instance_property || !this.instance_property.keys) {
          return false;
        }
        if (this.instance_property.keys.length === 0) {
          return false;
        }
        _ref = this.instance_property.keys;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (key.time === time) {
            return key;
          }
        }
        return false;
      };

      PropertyBase.prototype.addKey = function(val) {
        var currentTime, key;
        currentTime = this.timer.getCurrentTime() / 1000;
        key = {
          time: currentTime,
          val: val
        };
        this.instance_property.keys.push(key);
        this.instance_property.keys = Utils.sortKeys(this.instance_property.keys);
        this.lineData._isDirty = true;
        return this.keyAdded.dispatch();
      };

      PropertyBase.prototype.render = function() {
        return this.values = this.lineData.values != null ? this.lineData.values : {};
      };

      PropertyBase.prototype.update = function() {
        var key;
        key = this.getCurrentKey();
        return this.$key.toggleClass('property__key--active', key);
      };

      return PropertyBase;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!editor/PropertyNumber',['require','jquery','Signal','lodash','d3','cs!core/Utils','cs!editor/PropertyBase','draggablenumber','Mustache','text!templates/propertyNumber.tpl.html'],function(require) {
    var $, DraggableNumber, Mustache, PropertyBase, PropertyNumber, Signals, Utils, d3, tpl_property, _;
    $ = require('jquery');
    Signals = require('Signal');
    _ = require('lodash');
    d3 = require('d3');
    Utils = require('cs!core/Utils');
    PropertyBase = require('cs!editor/PropertyBase');
    DraggableNumber = require('draggablenumber');
    Mustache = require('Mustache');
    tpl_property = require('text!templates/propertyNumber.tpl.html');
    return PropertyNumber = (function(_super) {
      __extends(PropertyNumber, _super);

      function PropertyNumber(instance_property, lineData, editor, key_val) {
        this.instance_property = instance_property;
        this.lineData = lineData;
        this.editor = editor;
        this.key_val = key_val != null ? key_val : false;
        this.update = __bind(this.update, this);
        this.render = __bind(this.render, this);
        this.getInputVal = __bind(this.getInputVal, this);
        PropertyNumber.__super__.constructor.apply(this, arguments);
        this.$input = this.$el.find('input');
      }

      PropertyNumber.prototype.getInputVal = function() {
        return parseFloat(this.$el.find('input').val());
      };

      PropertyNumber.prototype.render = function() {
        var $input, data, draggable, onChangeEnd, val, view;
        PropertyNumber.__super__.render.apply(this, arguments);
        val = this.getCurrentVal();
        data = {
          id: this.instance_property.name,
          label: this.instance_property.label || this.instance_property.name,
          val: val
        };
        view = Mustache.render(tpl_property, data);
        this.$el = $(view);
        this.$el.find('.property__key').click(this.onKeyClick);
        $input = this.$el.find('input');
        onChangeEnd = (function(_this) {
          return function(new_val) {
            return _this.editor.undoManager.addState();
          };
        })(this);
        draggable = new DraggableNumber($input.get(0), {
          changeCallback: this.onInputChange,
          endCallback: onChangeEnd
        });
        $input.data('draggable', draggable);
        return $input.change(this.onInputChange);
      };

      PropertyNumber.prototype.update = function() {
        var draggable, val;
        PropertyNumber.__super__.update.apply(this, arguments);
        val = this.getCurrentVal();
        draggable = this.$input.data('draggable');
        if (draggable) {
          return draggable.set(val.toFixed(3));
        } else {
          return this.$input.val(val.toFixed(3));
        }
      };

      return PropertyNumber;

    })(PropertyBase);
  });

}).call(this);

// Spectrum Colorpicker v1.5.2
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (factory) {
    

    if (typeof define === 'function' && define.amd) { // AMD
        define('spectrum',['jquery'], factory);
    }
    else if (typeof exports == "object" && typeof module == "object") { // CommonJS
        module.exports = factory;
    }
    else { // Browser
        factory(jQuery);
    }
})(function($, undefined) {
    

    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        allowEmpty: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        hideAfterPaletteSelect: false,
        togglePaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: false,
        className: "", // Deprecated - use containerClassName and replacerClassName instead.
        containerClassName: "",
        replacerClassName: "",
        showAlpha: false,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    inputTypeColorSupport = (function() {
        var colorInput = $("<input type='color' value='!' />")[0];
        return colorInput.type === "color" && colorInput.value !== "!";
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                    "<div class='sp-palette-button-container sp-cf'>",
                        "<button type='button' class='sp-palette-toggle'></button>",
                    "</div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-clear sp-clear-display'>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button type='button' class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className, opts) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var current = p[i];
            if(current) {
                var tiny = tinycolor(current);
                var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += (tinycolor.equals(color, current)) ? " sp-thumb-active" : "";
                var formattedString = tiny.toString(opts.preferredFormat || "rgb");
                var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
                html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
            } else {
                var cls = 'sp-clear-display';
                html.push($('<div />')
                    .append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
                        .attr('title', opts.noColorSelectedText)
                    )
                    .html()
                );
            }
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = [],
            paletteArray = [],
            paletteLookup = {},
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            pickerContainer = container.find(".sp-picker-container"),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            clearButton = container.find(".sp-clear"),
            chooseButton = container.find(".sp-choose"),
            toggleButton = container.find(".sp-palette-toggle"),
            isInput = boundElement.is("input"),
            isInputTypeColor = isInput && inputTypeColorSupport && boundElement.attr("type") === "color",
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange,
            isEmpty = !initialColor,
            allowEmpty = opts.allowEmpty && !isInputTypeColor;

        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);

            if (opts.palette) {
                palette = opts.palette.slice(0);
                paletteArray = $.isArray(palette[0]) ? palette : [palette];
                paletteLookup = {};
                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        var rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-clear-enabled", allowEmpty);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className).addClass(opts.containerClassName);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (!allowEmpty) {
                clearButton.hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            updateSelectionPaletteFromStorage();

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                revert();
                hide();
            });

            clearButton.attr("title", opts.clearText);
            clearButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                isEmpty = true;
                move();

                if(flat) {
                    //for the flat style, this is a change event
                    updateOriginalInput(true);
                }
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText : opts.togglePaletteLessText);
            toggleButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                opts.showPaletteOnly = !opts.showPaletteOnly;

                // To make sure the Picker area is drawn on the right, next to the
                // Palette area (and not below the palette), first move the Palette
                // to the left to make space for the picker, plus 5px extra.
                // The 'applyOptions' function puts the whole container back into place
                // and takes care of the button-text and the sp-palette-only CSS class.
                if (!opts.showPaletteOnly && !flat) {
                    container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
                }
                applyOptions();
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                isEmpty = false;
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            }, dragStart, dragStop);

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                isEmpty = false;
                if (!opts.showAlpha) {
                    currentAlpha = 1;
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function paletteElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                }
                else {
                    set($(e.target).closest(".sp-thumb-el").data("color"));
                    move();
                    updateOriginalInput(true);
                    if (opts.hideAfterPaletteSelect) {
                      hide();
                    }
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, paletteElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, paletteElementClick);
        }

        function updateSelectionPaletteFromStorage() {

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var rgb = tinycolor(color).toRgbString();
                if (!paletteLookup[rgb] && $.inArray(rgb, selectionPalette) === -1) {
                    selectionPalette.push(rgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            if (opts.showPalette) {
                for (var i = 0; i < selectionPalette.length; i++) {
                    var rgb = tinycolor(selectionPalette[i]).toRgbString();

                    if (!paletteLookup[rgb]) {
                        unique.push(selectionPalette[i]);
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
            });

            updateSelectionPaletteFromStorage();

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
            shiftMovementDirection = null;
            boundElement.trigger('dragstart.spectrum', [ get() ]);
        }

        function dragStop() {
            container.removeClass(draggingClass);
            boundElement.trigger('dragstop.spectrum', [ get() ]);
        }

        function setFromTextInput() {

            var value = textInput.val();

            if ((value === null || value === "") && allowEmpty) {
                set(null);
                updateOriginalInput(true);
            }
            else {
                var tiny = tinycolor(value);
                if (tiny.isValid()) {
                    set(tiny);
                    updateOriginalInput(true);
                }
                else {
                    textInput.addClass("sp-validation-error");
                }
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            boundElement.trigger(event, [ get() ]);

            if (callbacks.beforeShow(get()) === false || event.isDefaultPrevented()) {
                return;
            }

            hideAll();
            visible = true;

            $(doc).bind("click.spectrum", clickout);
            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            reflow();
            updateUI();

            colorOnShow = get();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function clickout(e) {
            // Return on right click.
            if (e.button == 2) { return; }

            if (clickoutFiresChange) {
                updateOriginalInput(true);
            }
            else {
                revert();
            }
            hide();
        }

        function hide() {
            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("click.spectrum", clickout);
            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                // Update UI just in case a validation error needs
                // to be cleared.
                updateUI();
                return;
            }

            var newColor, newHsv;
            if (!color && allowEmpty) {
                isEmpty = true;
            } else {
                isEmpty = false;
                newColor = tinycolor(color);
                newHsv = newColor.toHsv();

                currentHue = (newHsv.h % 360) / 360;
                currentSaturation = newHsv.s;
                currentValue = newHsv.v;
                currentAlpha = newHsv.a;
            }
            updateUI();

            if (newColor && newColor.isValid() && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.getFormat();
            }
        }

        function get(opts) {
            opts = opts || { };

            if (allowEmpty && isEmpty) {
                return null;
            }

            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1 && !(currentAlpha === 0 && format === "name")) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                displayColor = '';

             //reset background info for preview element
            previewElement.removeClass("sp-clear-display");
            previewElement.css('background-color', 'transparent');

            if (!realColor && allowEmpty) {
                // Update the replaced elements background with icon indicating no color selection
                previewElement.addClass("sp-clear-display");
            }
            else {
                var realHex = realColor.toHexString(),
                    realRgb = realColor.toRgbString();

                // Update the replaced elements background color (with actual selected color)
                if (rgbaSupport || realColor.alpha === 1) {
                    previewElement.css("background-color", realRgb);
                }
                else {
                    previewElement.css("background-color", "transparent");
                    previewElement.css("filter", realColor.toFilter());
                }

                if (opts.showAlpha) {
                    var rgb = realColor.toRgb();
                    rgb.a = 0;
                    var realAlpha = tinycolor(rgb).toRgbString();
                    var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                    if (IE) {
                        alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                    }
                    else {
                        alphaSliderInner.css("background", "-webkit-" + gradient);
                        alphaSliderInner.css("background", "-moz-" + gradient);
                        alphaSliderInner.css("background", "-ms-" + gradient);
                        // Use current syntax gradient on unprefixed property.
                        alphaSliderInner.css("background",
                            "linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
                    }
                }

                displayColor = realColor.toString(format);
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                textInput.val(displayColor);
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            if(allowEmpty && isEmpty) {
                //if selected color is empty, hide the helpers
                alphaSlideHelper.hide();
                slideHelper.hide();
                dragHelper.hide();
            }
            else {
                //make sure helpers are visible
                alphaSlideHelper.show();
                slideHelper.show();
                dragHelper.show();

                // Where to show the little circle in that displays your current selected color
                var dragX = s * dragWidth;
                var dragY = dragHeight - (v * dragHeight);
                dragX = Math.max(
                    -dragHelperHeight,
                    Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
                );
                dragY = Math.max(
                    -dragHelperHeight,
                    Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
                );
                dragHelper.css({
                    "top": dragY + "px",
                    "left": dragX + "px"
                });

                var alphaX = currentAlpha * alphaWidth;
                alphaSlideHelper.css({
                    "left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
                });

                // Where to show the bar that displays your current selected hue
                var slideY = (currentHue) * slideHeight;
                slideHelper.css({
                    "top": (slideY - slideHelperHeight) + "px"
                });
            }
        }

        function updateOriginalInput(fireCallback) {
            var color = get(),
                displayColor = '',
                hasChanged = !tinycolor.equals(color, colorOnShow);

            if (color) {
                displayColor = color.toString(currentPreferredFormat);
                // Update the selection palette with the current color
                addColorToSelectionPalette(color);
            }

            if (isInput) {
                boundElement.val(displayColor);
            }

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height();
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height();
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();

            if (opts.showPalette) {
                drawPalette();
            }

            boundElement.trigger('reflow.spectrum');
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        offset.left -=
            Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);

        offset.top -=
            Math.min(offset.top, ((offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + inputHeight - extraY) : extraY));

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && doc.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }

        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {
                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var options = $.extend({}, opts, $(this).data());
            var spect = spectrum(this, options);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        if (!inputTypeColorSupport) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v1.0.0
    // https://github.com/bgrins/TinyColor
    // Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    var tinycolor = function tinycolor (color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (color instanceof tinycolor) {
           return color;
        }
        // If we are called as a function, call using new instead
        if (!(this instanceof tinycolor)) {
            return new tinycolor(color, opts);
        }

        var rgb = inputToRGB(color);
        this._r = rgb.r,
        this._g = rgb.g,
        this._b = rgb.b,
        this._a = rgb.a,
        this._roundA = mathRound(100*this._a) / 100,
        this._format = opts.format || rgb.format;
        this._gradientType = opts.gradientType;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this._r < 1) { this._r = mathRound(this._r); }
        if (this._g < 1) { this._g = mathRound(this._g); }
        if (this._b < 1) { this._b = mathRound(this._b); }

        this._ok = rgb.ok;
        this._tc_id = tinyCounter++;
    };

    tinycolor.prototype = {
        isDark: function() {
            return this.getBrightness() < 128;
        },
        isLight: function() {
            return !this.isDark();
        },
        isValid: function() {
            return this._ok;
        },
        getFormat: function() {
            return this._format;
        },
        getAlpha: function() {
            return this._a;
        },
        getBrightness: function() {
            var rgb = this.toRgb();
            return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        },
        setAlpha: function(value) {
            this._a = boundAlpha(value);
            this._roundA = mathRound(100*this._a) / 100;
            return this;
        },
        toHsv: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };
        },
        toHsvString: function() {
            var hsv = rgbToHsv(this._r, this._g, this._b);
            var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
            return (this._a == 1) ?
              "hsv("  + h + ", " + s + "%, " + v + "%)" :
              "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
        },
        toHsl: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };
        },
        toHslString: function() {
            var hsl = rgbToHsl(this._r, this._g, this._b);
            var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
            return (this._a == 1) ?
              "hsl("  + h + ", " + s + "%, " + l + "%)" :
              "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
        },
        toHex: function(allow3Char) {
            return rgbToHex(this._r, this._g, this._b, allow3Char);
        },
        toHexString: function(allow3Char) {
            return '#' + this.toHex(allow3Char);
        },
        toHex8: function() {
            return rgbaToHex(this._r, this._g, this._b, this._a);
        },
        toHex8String: function() {
            return '#' + this.toHex8();
        },
        toRgb: function() {
            return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };
        },
        toRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
              "rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
        },
        toPercentageRgb: function() {
            return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };
        },
        toPercentageRgbString: function() {
            return (this._a == 1) ?
              "rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
              "rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
        },
        toName: function() {
            if (this._a === 0) {
                return "transparent";
            }

            if (this._a < 1) {
                return false;
            }

            return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
        },
        toFilter: function(secondColor) {
            var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a);
            var secondHex8String = hex8String;
            var gradientType = this._gradientType ? "GradientType = 1, " : "";

            if (secondColor) {
                var s = tinycolor(secondColor);
                secondHex8String = s.toHex8String();
            }

            return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
        },
        toString: function(format) {
            var formatSet = !!format;
            format = format || this._format;

            var formattedString = false;
            var hasAlpha = this._a < 1 && this._a >= 0;
            var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

            if (needsAlphaFormat) {
                // Special case for "transparent", all other non-alpha formats
                // will return rgba when there is transparency.
                if (format === "name" && this._a === 0) {
                    return this.toName();
                }
                return this.toRgbString();
            }
            if (format === "rgb") {
                formattedString = this.toRgbString();
            }
            if (format === "prgb") {
                formattedString = this.toPercentageRgbString();
            }
            if (format === "hex" || format === "hex6") {
                formattedString = this.toHexString();
            }
            if (format === "hex3") {
                formattedString = this.toHexString(true);
            }
            if (format === "hex8") {
                formattedString = this.toHex8String();
            }
            if (format === "name") {
                formattedString = this.toName();
            }
            if (format === "hsl") {
                formattedString = this.toHslString();
            }
            if (format === "hsv") {
                formattedString = this.toHsvString();
            }

            return formattedString || this.toHexString();
        },

        _applyModification: function(fn, args) {
            var color = fn.apply(null, [this].concat([].slice.call(args)));
            this._r = color._r;
            this._g = color._g;
            this._b = color._b;
            this.setAlpha(color._a);
            return this;
        },
        lighten: function() {
            return this._applyModification(lighten, arguments);
        },
        brighten: function() {
            return this._applyModification(brighten, arguments);
        },
        darken: function() {
            return this._applyModification(darken, arguments);
        },
        desaturate: function() {
            return this._applyModification(desaturate, arguments);
        },
        saturate: function() {
            return this._applyModification(saturate, arguments);
        },
        greyscale: function() {
            return this._applyModification(greyscale, arguments);
        },
        spin: function() {
            return this._applyModification(spin, arguments);
        },

        _applyCombination: function(fn, args) {
            return fn.apply(null, [this].concat([].slice.call(args)));
        },
        analogous: function() {
            return this._applyCombination(analogous, arguments);
        },
        complement: function() {
            return this._applyCombination(complement, arguments);
        },
        monochromatic: function() {
            return this._applyCombination(monochromatic, arguments);
        },
        splitcomplement: function() {
            return this._applyCombination(splitcomplement, arguments);
        },
        triad: function() {
            return this._applyCombination(triad, arguments);
        },
        tetrad: function() {
            return this._applyCombination(tetrad, arguments);
        }
    };

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "#ff000000" or "ff000000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }
        // `rgbaToHex`
        // Converts an RGBA color plus alpha transparency to hex
        // Assumes r, g, b and a are contained in the set [0, 255]
        // Returns an 8 character hex
        function rgbaToHex(r, g, b, a) {

            var hex = [
                pad2(convertDecimalToHex(a)),
                pad2(mathRound(r).toString(16)),
                pad2(mathRound(g).toString(16)),
                pad2(mathRound(b).toString(16))
            ];

            return hex.join("");
        }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    function desaturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function saturate(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    }

    function greyscale(color) {
        return tinycolor(color).desaturate(100);
    }

    function lighten (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    function brighten(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var rgb = tinycolor(color).toRgb();
        rgb.r = mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
        rgb.g = mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
        rgb.b = mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
        return tinycolor(rgb);
    }

    function darken (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    }

    // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
    // Values outside of this range will be wrapped into this range.
    function spin(color, amount) {
        var hsl = tinycolor(color).toHsl();
        var hue = (mathRound(hsl.h) + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return tinycolor(hsl);
    }

    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    function complement(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    }

    function triad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function tetrad(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    }

    function splitcomplement(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    }

    function analogous(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    }

    function monochromatic(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    }

    // Utility Functions
    // ---------------------

    tinycolor.mix = function(color1, color2, amount) {
        amount = (amount === 0) ? 0 : (amount || 50);

        var rgb1 = tinycolor(color1).toRgb();
        var rgb2 = tinycolor(color2).toRgb();

        var p = amount / 100;
        var w = p * 2 - 1;
        var a = rgb2.a - rgb1.a;

        var w1;

        if (w * a == -1) {
            w1 = w;
        } else {
            w1 = (w + a) / (1 + w * a);
        }

        w1 = (w1 + 1) / 2;

        var w2 = 1 - w1;

        var rgba = {
            r: rgb2.r * w1 + rgb1.r * w2,
            g: rgb2.g * w1 + rgb1.g * w2,
            b: rgb2.b * w1 + rgb1.b * w2,
            a: rgb2.a * p  + rgb1.a * (1 - p)
        };

        return tinycolor(rgba);
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var c1 = tinycolor(color1);
        var c2 = tinycolor(color2);
        var rgb1 = c1.toRgb();
        var rgb2 = c2.toRgb();
        var brightnessA = c1.getBrightness();
        var brightnessB = c2.getBrightness();
        var colorDiff = (
            Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
            Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
            Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.isReadable("#000", "#111") => false
    tinycolor.isReadable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse a base-16 hex value into a base-10 integer
    function parseIntFromHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    // Converts a decimal to a hex value
    function convertDecimalToHex(d) {
        return Math.round(parseFloat(d) * 255).toString(16);
    }
    // Converts a hex value to a decimal
    function convertHexToDecimal(h) {
        return (parseIntFromHex(h) / 255);
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hex8.exec(color))) {
            return {
                a: convertHexToDecimal(match[1]),
                r: parseIntFromHex(match[2]),
                g: parseIntFromHex(match[3]),
                b: parseIntFromHex(match[4]),
                format: named ? "name" : "hex8"
            };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseIntFromHex(match[1]),
                g: parseIntFromHex(match[2]),
                b: parseIntFromHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseIntFromHex(match[1] + '' + match[1]),
                g: parseIntFromHex(match[2] + '' + match[2]),
                b: parseIntFromHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    window.tinycolor = tinycolor;
    })();


    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

});


define('text!templates/propertyColor.tpl.html',[],function () { return '<div class="property property--number">\n  <button class="property__key"></button>\n  <label for="{{id}}" class="property__label">{{label}}</label>\n  <input id="{{id}}" class="property__input" value="{{val}}" />\n</div>\n';});


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!editor/PropertyColor',['require','jquery','spectrum','Signal','lodash','d3','cs!core/Utils','cs!editor/PropertyBase','Mustache','text!templates/propertyColor.tpl.html'],function(require) {
    var $, Mustache, PropertyBase, PropertyColor, Signals, Utils, d3, tpl_property, _;
    $ = require('jquery');
    require('spectrum');
    Signals = require('Signal');
    _ = require('lodash');
    d3 = require('d3');
    Utils = require('cs!core/Utils');
    PropertyBase = require('cs!editor/PropertyBase');
    Mustache = require('Mustache');
    tpl_property = require('text!templates/propertyColor.tpl.html');
    return PropertyColor = (function(_super) {
      __extends(PropertyColor, _super);

      function PropertyColor(instance_property, lineData, editor, key_val) {
        this.instance_property = instance_property;
        this.lineData = lineData;
        this.editor = editor;
        this.key_val = key_val != null ? key_val : false;
        this.update = __bind(this.update, this);
        this.render = __bind(this.render, this);
        PropertyColor.__super__.constructor.apply(this, arguments);
        this.$input = this.$el.find('input');
      }

      PropertyColor.prototype.render = function() {
        var $input, data, val, view;
        PropertyColor.__super__.render.apply(this, arguments);
        val = this.getCurrentVal();
        data = {
          id: this.instance_property.name,
          label: this.instance_property.label || this.instance_property.name,
          val: val
        };
        view = Mustache.render(tpl_property, data);
        this.$el = $(view);
        this.$el.find('.property__key').click(this.onKeyClick);
        $input = this.$el.find('input');
        $input.spectrum({
          allowEmpty: false,
          showAlpha: true,
          clickoutFiresChange: false,
          preferredFormat: "rgb",
          change: (function(_this) {
            return function(color) {
              return _this.editor.undoManager.addState();
            };
          })(this),
          move: (function(_this) {
            return function(color) {
              if (color._a === 1) {
                _this.$input.val(color.toHexString());
              } else {
                _this.$input.val(color.toRgbString());
              }
              return _this.onInputChange();
            };
          })(this)
        });
        return $input.change(this.onInputChange);
      };

      PropertyColor.prototype.update = function() {
        var val;
        PropertyColor.__super__.update.apply(this, arguments);
        val = this.getCurrentVal();
        this.$input.val(val);
        return this.$input.spectrum('set', val);
      };

      return PropertyColor;

    })(PropertyBase);
  });

}).call(this);


define('text!templates/propertyTween.tpl.html',[],function () { return '<div class="property property--tween">\n  <label for="{{id}}" class="property__label">easing</label>\n  <div class="property__select">\n    <div class="custom-select">\n      <select id="{{id}}">\n        {{#options}}\n        <option value="{{.}}" {{selected}}>{{.}}</option>\n        {{/options}}\n      </select>\n    </div>\n  </div>\n</div>\n<div class="properties-editor__actions actions">\n  <span class="property__key-time">key at <strong class="property__key-input" contenteditable="true">{{time}}</strong> seconds</span>\n  <a href="#" class="actions__item" data-action-remove>Remove key</a>\n</div>';});


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/PropertyTween',['require','jquery','Signal','Mustache','text!templates/propertyTween.tpl.html'],function(require) {
    var $, Mustache, PropertyTween, Signals, tpl_property;
    $ = require('jquery');
    Signals = require('Signal');
    Mustache = require('Mustache');
    tpl_property = require('text!templates/propertyTween.tpl.html');
    return PropertyTween = (function() {
      function PropertyTween(instance_property, lineData, editor, key_val, timeline) {
        this.instance_property = instance_property;
        this.lineData = lineData;
        this.editor = editor;
        this.key_val = key_val != null ? key_val : false;
        this.timeline = timeline;
        this.update = __bind(this.update, this);
        this.onChange = __bind(this.onChange, this);
        this.updateKeyTime = __bind(this.updateKeyTime, this);
        this.render = __bind(this.render, this);
        this.timer = this.editor.timer;
        this.$time = false;
        this.render();
      }

      PropertyTween.prototype.render = function() {
        var data, self, tween, tweens, _i, _len;
        self = this;
        if (!this.key_val.ease) {
          this.key_val.ease = "Quad.easeOut";
        }
        data = {
          id: this.instance_property.name + "_tween",
          val: this.key_val.ease,
          time: this.key_val.time.toFixed(3),
          options: ['Linear.easeNone'],
          selected: function() {
            if (this.toString() === self.key_val.ease) {
              return 'selected';
            } else {
              return '';
            }
          }
        };
        tweens = ["Quad", "Cubic", "Quart", "Quint", "Strong"];
        for (_i = 0, _len = tweens.length; _i < _len; _i++) {
          tween = tweens[_i];
          data.options.push(tween + ".easeOut");
          data.options.push(tween + ".easeIn");
          data.options.push(tween + ".easeInOut");
        }
        this.$el = $(Mustache.render(tpl_property, data));
        this.$time = this.$el.find('.property__key-time strong');
        this.$time.keypress((function(_this) {
          return function(e) {
            if (e.charCode === 13) {
              e.preventDefault();
              _this.$time.blur();
              return _this.updateKeyTime(_this.$time.text());
            }
          };
        })(this));
        this.$time.on('click', function() {
          return document.execCommand('selectAll', false, null);
        });
        this.$el.find('select').change(this.onChange);
      };

      PropertyTween.prototype.updateKeyTime = function(time) {
        time = parseFloat(time);
        if (isNaN(time)) {
          time = this.key_val.time;
        }
        this.$time.text(time);
        this.key_val.time = time;
        return this.onChange();
      };

      PropertyTween.prototype.onChange = function() {
        var ease;
        ease = this.$el.find('select').val();
        this.key_val.ease = ease;
        this.editor.undoManager.addState();
        this.lineData._isDirty = true;
        this.timeline._isDirty = true;
      };

      PropertyTween.prototype.update = function() {
        this.$time.html(this.key_val.time.toFixed(3));
      };

      return PropertyTween;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/Property',['require','Signal','cs!editor/PropertyNumber','cs!editor/PropertyColor','cs!editor/PropertyTween'],function(require) {
    var Property, PropertyColor, PropertyNumber, PropertyTween, Signals;
    Signals = require('Signal');
    PropertyNumber = require('cs!editor/PropertyNumber');
    PropertyColor = require('cs!editor/PropertyColor');
    PropertyTween = require('cs!editor/PropertyTween');
    return Property = (function() {
      function Property(editor, $el, domElement) {
        var $container, $grp_container, $tween_container, d3Object, instance_prop, key, key_val, lineData, lineObject, numberProp, propertyData, propertyObject, property_name, tweenProp, _ref;
        this.editor = editor;
        this.$el = $el;
        this.update = __bind(this.update, this);
        this.addTweenProperty = __bind(this.addTweenProperty, this);
        this.addNumberProperty = __bind(this.addNumberProperty, this);
        this.createGroupContainer = __bind(this.createGroupContainer, this);
        this.onKeyAdded = __bind(this.onKeyAdded, this);
        this.timeline = this.editor.timeline;
        this.timer = this.editor.timer;
        this.selectionManager = editor.selectionManager;
        this.keyAdded = new Signals.Signal();
        this.items = [];
        this.numberProp = false;
        this.tweenProp = false;
        d3Object = d3.select(domElement);
        key_val = false;
        propertyObject = false;
        propertyData = false;
        lineObject = false;
        lineData = false;
        if (d3Object.classed('key')) {
          propertyObject = domElement.parentNode;
          lineObject = propertyObject.parentNode.parentNode;
          lineData = d3.select(lineObject).datum();
          propertyData = d3.select(propertyObject).datum();
          key_val = d3Object.datum();
        }
        if (d3Object.classed('bar')) {
          lineData = d3Object.datum();
        }
        if (d3Object.classed('line-label')) {
          domElement = domElement.parentNode;
          d3Object = d3.select(domElement);
          lineData = d3Object.datum();
        }
        property_name = false;
        if (propertyData) {
          property_name = propertyData.name;
        }
        $container = this.getContainer(lineData);
        $tween_container = $container;
        _ref = lineData.properties;
        for (key in _ref) {
          instance_prop = _ref[key];
          if (!property_name || instance_prop.name === property_name) {
            $grp_container = this.getGroupContainer(instance_prop, $container);
            numberProp = this.addNumberProperty(instance_prop, lineData, key_val, $grp_container);
            this.items.push(numberProp);
            if (instance_prop.name === property_name) {
              $tween_container = $grp_container;
            }
          }
        }
        if (property_name) {
          tweenProp = this.addTweenProperty(instance_prop, lineData, key_val, $tween_container, propertyData, domElement);
          this.items.push(tweenProp);
        }
        return;
      }

      Property.prototype.onKeyAdded = function() {
        return this.keyAdded.dispatch();
      };

      Property.prototype.getGroupContainer = function(instance_prop, $container) {
        var $existing, $grp, grp_class;
        if (!instance_prop.group) {
          grp_class = 'property-grp--general';
          $existing = $container.find('.' + grp_class);
          if ($existing.length) {
            return $existing;
          } else {
            $grp = this.createGroupContainer(grp_class);
            $container.append($grp);
            return $grp;
          }
        } else {
          grp_class = 'property-grp--' + instance_prop.group;
          $existing = $container.find('.' + grp_class);
          if ($existing.length) {
            return $existing;
          } else {
            $grp = this.createGroupContainer(grp_class, instance_prop.group);
            $container.append($grp);
            return $grp;
          }
        }
      };

      Property.prototype.createGroupContainer = function(grp_class, label) {
        var $grp;
        if (label == null) {
          label = false;
        }
        $grp = $('<div class="property-grp ' + grp_class + '"></div>');
        if (label) {
          $grp.append('<h3 class="property-grp__title">' + label + '</h3>');
        }
        return $grp;
      };

      Property.prototype.getContainer = function(lineData) {
        var $container;
        $container = false;
        if (lineData.id) {
          $container = $('#property--' + lineData.id);
          if (!$container.length) {
            $container = $container = $('<div class="properties__wrapper" id="property--' + lineData.id + '"></div>');
            this.$el.append($container);
            if (lineData.label) {
              $container.append('<h2 class="properties-editor__title">' + lineData.label + '</h2>');
            }
          }
        }
        if ($container === false) {
          $container = $('<div class="properties__wrapper" id="no-item"></div>');
          this.$el.append($container);
        }
        return $container;
      };

      Property.prototype.addNumberProperty = function(instance_prop, lineData, key_val, $container) {
        var prop, propClass;
        propClass = PropertyNumber;
        if (instance_prop.type && instance_prop.type === 'color') {
          propClass = PropertyColor;
        }
        prop = new propClass(instance_prop, lineData, this.editor, key_val);
        prop.keyAdded.add(this.onKeyAdded);
        $container.append(prop.$el);
        return prop;
      };

      Property.prototype.addTweenProperty = function(instance_prop, lineData, key_val, $container, propertyData, domElement) {
        var tween;
        tween = new PropertyTween(instance_prop, lineData, this.editor, key_val, this.timeline);
        $container.append(tween.$el);
        tween.$el.find('[data-action-remove]').click((function(_this) {
          return function(e) {
            var index;
            e.preventDefault();
            index = propertyData.keys.indexOf(key_val);
            if (index > -1) {
              propertyData.keys.splice(index, 1);
              _this.editor.propertiesEditor.keyRemoved.dispatch(domElement);
              return lineData._isDirty = true;
            }
          };
        })(this));
        return tween;
      };

      Property.prototype.update = function() {
        var item, _i, _len, _ref;
        _ref = this.items;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          item.update();
        }
      };

      return Property;

    })();
  });

}).call(this);


define('text!templates/propertiesEditor.tpl.html',[],function () { return '<div class="properties-editor">\n  <a href="#" class="menu-item menu-item--toggle-side" data-action="toggle"><i class="icon-toggle"></i></a>\n  <div class="properties-editor__main"></div>\n</div>\n';});


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/PropertiesEditor',['require','jquery','lodash','Signal','cs!editor/Property','text!templates/propertiesEditor.tpl.html'],function(require) {
    var $, PropertiesEditor, Property, Signals, tpl_propertiesEditor, _;
    $ = require('jquery');
    _ = require('lodash');
    Signals = require('Signal');
    Property = require('cs!editor/Property');
    tpl_propertiesEditor = require('text!templates/propertiesEditor.tpl.html');
    return PropertiesEditor = (function() {
      function PropertiesEditor(editor) {
        this.editor = editor;
        this.render = __bind(this.render, this);
        this.addProperty = __bind(this.addProperty, this);
        this.onSelect = __bind(this.onSelect, this);
        this.onKeyAdded = __bind(this.onKeyAdded, this);
        this.timeline = this.editor.timeline;
        this.timer = this.editor.timer;
        this.selectionManager = editor.selectionManager;
        this.$el = $(tpl_propertiesEditor);
        this.$container = this.$el.find('.properties-editor__main');
        this.keyAdded = new Signals.Signal();
        this.keyRemoved = new Signals.Signal();
        this.items = [];
        $('body').addClass('properties-is-closed');
        $('body').append(this.$el);
        this.selectionManager.onSelect.add(this.onSelect);
        this.$el.keypress(function(e) {
          return e.stopPropagation();
        });
      }

      PropertiesEditor.prototype.onKeyAdded = function() {
        console.log("on key added");
        return this.keyAdded.dispatch();
      };

      PropertiesEditor.prototype.onSelect = function(domElement) {
        var element, _i, _len;
        if (domElement == null) {
          domElement = false;
        }
        this.items = [];
        this.$container.empty();
        if (domElement instanceof Array) {
          for (_i = 0, _len = domElement.length; _i < _len; _i++) {
            element = domElement[_i];
            this.addProperty(element);
          }
        } else {
          this.addProperty(domElement);
        }
        if (this.items.length) {
          return $('body').removeClass('properties-is-closed');
        }
      };

      PropertiesEditor.prototype.addProperty = function(domElement) {
        var prop;
        prop = new Property(this.editor, this.$container, domElement);
        prop.keyAdded.add(this.onKeyAdded);
        return this.items.push(prop);
      };

      PropertiesEditor.prototype.render = function(time, time_changed) {
        var prop, _i, _len, _ref, _results;
        if (!time_changed) {
          return;
        }
        _ref = this.items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prop = _ref[_i];
          _results.push(prop.update());
        }
        return _results;
      };

      return PropertiesEditor;

    })();
  });

}).call(this);

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2014-08-29
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  // IE 10+ (native saveAs)
  || (typeof navigator !== "undefined" &&
      navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  // Everyone else
  || (function(view) {
	
	// IE <10 is explicitly unsupported
	if (typeof navigator !== "undefined" &&
	    /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			node.dispatchEvent(event);
		}
		, webkit_req_fs = view.webkitRequestFileSystem
		, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, fs_min_size = 0
		// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 for
		// the reasoning behind the timeout and revocation flow
		, arbitrary_revoke_timeout = 10
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, FileSaver = function(blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, blob_changed = false
				, object_url
				, target_view
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					// don't create more object URLs than needed
					if (blob_changed || !object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (target_view) {
						target_view.location.href = object_url;
					} else {
						var new_tab = view.open(object_url, "_blank");
						if (new_tab == undefined && typeof safari !== "undefined") {
							//Apple do not allow window.open, see http://bit.ly/1kZffRI
							view.location.href = object_url
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
				, abortable = function(func) {
					return function() {
						if (filesaver.readyState !== filesaver.DONE) {
							return func.apply(this, arguments);
						}
					};
				}
				, create_if_not_found = {create: true, exclusive: false}
				, slice
			;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name += ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
				fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
					var save = function() {
						dir.getFile(name, create_if_not_found, abortable(function(file) {
							file.createWriter(abortable(function(writer) {
								writer.onwriteend = function(event) {
									target_view.location.href = file.toURL();
									filesaver.readyState = filesaver.DONE;
									dispatch(filesaver, "writeend", event);
									revoke(file);
								};
								writer.onerror = function() {
									var error = writer.error;
									if (error.code !== error.ABORT_ERR) {
										fs_error();
									}
								};
								"writestart progress write abort".split(" ").forEach(function(event) {
									writer["on" + event] = filesaver["on" + event];
								});
								writer.write(blob);
								filesaver.abort = function() {
									writer.abort();
									filesaver.readyState = filesaver.DONE;
								};
								filesaver.readyState = filesaver.WRITING;
							}), fs_error);
						}), fs_error);
					};
					dir.getFile(name, {create: false}, abortable(function(file) {
						// delete file if it already exists
						file.remove();
						save();
					}), abortable(function(ex) {
						if (ex.code === ex.NOT_FOUND_ERR) {
							save();
						} else {
							fs_error();
						}
					}));
				}), fs_error);
			}), fs_error);
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name) {
			return new FileSaver(blob, name);
		}
	;
	FS_proto.abort = function() {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
  module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
  define('FileSaver',[], function() {
    return saveAs;
  });
}
;

// Generated by CoffeeScript 1.8.0
(function() {
  define('cs!editor/EditorMenu',['require','FileSaver'],function(require) {
    var EditorMenu, saveAs;
    saveAs = require('FileSaver');
    return EditorMenu = (function() {
      function EditorMenu(tweenTime, $timeline, editor) {
        this.tweenTime = tweenTime;
        this.$timeline = $timeline;
        this.editor = editor;
        this.timer = this.tweenTime.timer;
        this.initExport();
        this.initToggle();
      }

      EditorMenu.prototype.initToggle = function() {
        var $toggleLink, $toggleLinkSide, timelineClosed;
        timelineClosed = false;
        $toggleLink = this.$timeline.find('[data-action="toggle"]');
        $toggleLink.click((function(_this) {
          return function(e) {
            e.preventDefault();
            timelineClosed = !timelineClosed;
            $toggleLink.toggleClass('menu-item--toggle-up', timelineClosed);
            $('body').toggleClass('timeline-is-closed', timelineClosed);
            return window.dispatchEvent(new Event('resize'));
          };
        })(this));
        $toggleLinkSide = $('.properties-editor').find('[data-action="toggle"]');
        return $toggleLinkSide.click((function(_this) {
          return function(e) {
            var propertiesClosed;
            e.preventDefault();
            propertiesClosed = !$('body').hasClass('properties-is-closed');
            $('body').toggleClass('properties-is-closed', propertiesClosed);
            return window.dispatchEvent(new Event('resize'));
          };
        })(this));
      };

      EditorMenu.prototype.initExport = function() {
        var exporter, self;
        self = this;
        exporter = this.editor.exporter;
        return this.$timeline.find('[data-action="export"]').click(function(e) {
          var blob, data;
          e.preventDefault();
          data = exporter.getJSON();
          blob = new Blob([data], {
            "type": "text/json;charset=utf-8"
          });
          return saveAs(blob, 'data.json');
        });
      };

      return EditorMenu;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/EditorControls',['require'],function(require) {
    var EditorControls;
    return EditorControls = (function() {
      function EditorControls(tweenTime, $timeline) {
        this.tweenTime = tweenTime;
        this.$timeline = $timeline;
        this.render = __bind(this.render, this);
        this.playPause = __bind(this.playPause, this);
        this.timer = this.tweenTime.timer;
        this.$time = this.$timeline.find('.control--time');
        this.$time_end = this.$timeline.find('.control--time-end');
        this.initControls();
        this.$time_end.val(this.tweenTime.timer.getDuration());
        $(document).keypress((function(_this) {
          return function(e) {
            console.log(e);
            if (e.charCode === 32) {
              return _this.playPause();
            }
          };
        })(this));
      }

      EditorControls.prototype.playPause = function() {
        var $play_pause;
        this.timer.toggle();
        $play_pause = this.$timeline.find('.control--play-pause');
        $play_pause.toggleClass('icon-pause', this.timer.is_playing);
        return $play_pause.toggleClass('icon-play', !this.timer.is_playing);
      };

      EditorControls.prototype.initControls = function() {
        var $bt_first, $bt_last, $play_pause;
        $play_pause = this.$timeline.find('.control--play-pause');
        $play_pause.click((function(_this) {
          return function(e) {
            e.preventDefault();
            return _this.playPause();
          };
        })(this));
        $bt_first = this.$timeline.find('.control--first');
        $bt_first.click((function(_this) {
          return function(e) {
            e.preventDefault();
            return _this.timer.seek([0]);
          };
        })(this));
        $bt_last = this.$timeline.find('.control--last');
        $bt_last.click((function(_this) {
          return function(e) {
            var total;
            e.preventDefault();
            total = _this.tweenTime.getTotalDuration();
            return _this.timer.seek([total * 1000]);
          };
        })(this));
        this.$time.change((function(_this) {
          return function(e) {
            var seconds;
            seconds = parseFloat(_this.$time.val(), 10) * 1000;
            return _this.timer.seek([seconds]);
          };
        })(this));
        return this.$time_end.change((function(_this) {
          return function(e) {
            var seconds;
            seconds = parseFloat(_this.$time_end.val(), 10);
            return _this.timer.setDuration(seconds);
          };
        })(this));
      };

      EditorControls.prototype.render = function(time, time_changed) {
        var seconds;
        if (time_changed) {
          seconds = time / 1000;
          return this.$time.val(seconds.toFixed(3));
        }
      };

      return EditorControls;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/SelectionManager',['require','d3','Signal','cs!core/Utils'],function(require) {
    var SelectionManager, Signals, Utils, d3;
    d3 = require('d3');
    Signals = require('Signal');
    Utils = require('cs!core/Utils');
    return SelectionManager = (function() {
      function SelectionManager(tweenTime) {
        this.tweenTime = tweenTime;
        this.getSelection = __bind(this.getSelection, this);
        this.triggerSelect = __bind(this.triggerSelect, this);
        this.reset = __bind(this.reset, this);
        this.sortSelection = __bind(this.sortSelection, this);
        this.removeItem = __bind(this.removeItem, this);
        this.removeDuplicates = __bind(this.removeDuplicates, this);
        this.selection = [];
        this.onSelect = new Signals.Signal();
      }

      SelectionManager.prototype.removeDuplicates = function() {
        var found, item, item2, result, _i, _j, _len, _len1, _ref;
        result = [];
        _ref = this.selection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          found = false;
          for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
            item2 = result[_j];
            if (item.isEqualNode(item2)) {
              found = true;
              break;
            }
          }
          if (found === false) {
            result.push(item);
          }
        }
        return this.selection = result;
      };

      SelectionManager.prototype.removeItem = function(item) {
        var index;
        index = this.selection.indexOf(item);
        if (index > -1) {
          return this.selection.splice(index, 1);
        }
      };

      SelectionManager.prototype.sortSelection = function() {
        var compare;
        compare = function(a, b) {
          if (!a.__data__ || !b.__data__) {
            return 0;
          }
          if (a.__data__.time < b.__data__.time) {
            return -1;
          }
          if (a.__data__.time > b.__data__.time) {
            return 1;
          }
          return 0;
        };
        return this.selection = this.selection.sort(compare);
      };

      SelectionManager.prototype.reset = function() {
        this.selection = [];
        this.highlightItems();
        return this.onSelect.dispatch(this.selection, false);
      };

      SelectionManager.prototype.triggerSelect = function() {
        return this.onSelect.dispatch(this.selection, false);
      };

      SelectionManager.prototype.select = function(item, addToSelection) {
        var el, _i, _len;
        if (addToSelection == null) {
          addToSelection = false;
        }
        if (!addToSelection) {
          this.selection = [];
        }
        if (item instanceof Array) {
          for (_i = 0, _len = item.length; _i < _len; _i++) {
            el = item[_i];
            this.selection.push(el);
          }
        } else {
          this.selection.push(item);
        }
        this.removeDuplicates();
        this.highlightItems();
        this.sortSelection();
        return this.onSelect.dispatch(this.selection, addToSelection);
      };

      SelectionManager.prototype.getSelection = function() {
        return this.selection;
      };

      SelectionManager.prototype.highlightItems = function() {
        var d3item, item, _i, _len, _ref, _results;
        d3.selectAll('.bar--selected').classed('bar--selected', false);
        d3.selectAll('.key--selected').classed('key--selected', false);
        _ref = this.selection;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          d3item = d3.select(item);
          if (d3item.classed('bar')) {
            _results.push(d3item.classed('bar--selected', true));
          } else if (d3item.classed('key')) {
            _results.push(d3item.classed('key--selected', true));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      return SelectionManager;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/Exporter',['require'],function(require) {
    var Exporter;
    return Exporter = (function() {
      function Exporter(editor) {
        this.editor = editor;
        this.getJSON = __bind(this.getJSON, this);
        this.getData = __bind(this.getData, this);
      }

      Exporter.prototype.getData = function() {
        var domain, domain_end, domain_start, tweenTime;
        tweenTime = this.editor.tweenTime;
        domain = this.editor.timeline.x.domain();
        domain_start = domain[0];
        domain_end = domain[1];
        return {
          settings: {
            time: tweenTime.timer.getCurrentTime(),
            duration: tweenTime.timer.getDuration(),
            domain: [domain_start.getTime(), domain_end.getTime()]
          },
          data: tweenTime.data
        };
      };

      Exporter.prototype.getJSON = function() {
        var data, json, json_replacer, options;
        options = this.editor.options;
        json_replacer = function(key, val) {
          if (key.indexOf('_') === 0) {
            return void 0;
          }
          if (options.json_replacer != null) {
            return options.json_replacer(key, val);
          }
          return val;
        };
        data = this.getData();
        json = JSON.stringify(data, json_replacer, 2);
        return json;
      };

      return Exporter;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/UndoManager',['require','jquery'],function(require) {
    var UndoManager;
    return UndoManager = (function() {
      var $;

      $ = require('jquery');

      function UndoManager(editor) {
        this.editor = editor;
        this.setState = __bind(this.setState, this);
        this.addState = __bind(this.addState, this);
        this.redo = __bind(this.redo, this);
        this.undo = __bind(this.undo, this);
        this.history_max = 100;
        this.history = [];
        this.current_index = 0;
        this.addState();
        $(document).keydown((function(_this) {
          return function(e) {
            if (e.keyCode === 90) {
              if (e.metaKey || e.ctrlKey) {
                if (!e.shiftKey) {
                  return _this.undo();
                } else {
                  return _this.redo();
                }
              }
            }
          };
        })(this));
      }

      UndoManager.prototype.undo = function() {
        if (this.current_index <= 0) {
          return false;
        }
        this.current_index -= 1;
        return this.setState(this.current_index);
      };

      UndoManager.prototype.redo = function() {
        if (this.current_index >= this.history.length - 1) {
          return false;
        }
        this.current_index += 1;
        return this.setState(this.current_index);
      };

      UndoManager.prototype.addState = function() {
        var data;
        data = JSON.parse(this.editor.exporter.getJSON());
        if (this.current_index + 1 < this.history.length) {
          this.history.splice(this.current_index + 1, this.history.length - 1);
        }
        this.history.push(data);
        if (this.history.length > this.history_max) {
          this.history.shift();
        }
        return this.current_index = this.history.length - 1;
      };

      UndoManager.prototype.setState = function(index) {
        var data, item, item_key, key, key_key, keys, prop, prop_key, state, tweenTime, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
        state = this.history[index];
        data = state.data;
        tweenTime = this.editor.tweenTime;
        for (item_key = _i = 0, _len = data.length; _i < _len; item_key = ++_i) {
          item = data[item_key];
          if (!tweenTime.data[item_key]) {
            tweenTime.data[item_key] = item;
          } else {
            _ref = item.properties;
            for (prop_key = _j = 0, _len1 = _ref.length; _j < _len1; prop_key = ++_j) {
              prop = _ref[prop_key];
              if (!tweenTime.data[item_key].properties[prop_key]) {
                tweenTime.data[item_key].properties[prop_key] = prop;
              } else {
                keys = tweenTime.data[item_key].properties[prop_key].keys;
                _ref1 = prop.keys;
                for (key_key = _k = 0, _len2 = _ref1.length; _k < _len2; key_key = ++_k) {
                  key = _ref1[key_key];
                  if (!keys[key_key]) {
                    keys[key_key] = key;
                  } else {
                    keys[key_key].time = key.time;
                    keys[key_key].val = key.val;
                    keys[key_key].ease = key.ease;
                  }
                }
              }
            }
          }
          tweenTime.data[item_key]._isDirty = true;
        }
        return this.editor.render(false, true);
      };

      return UndoManager;

    })();
  });

}).call(this);


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/Editor',['require','text!templates/timeline.tpl.html','cs!graph/Timeline','cs!editor/PropertiesEditor','cs!editor/EditorMenu','cs!editor/EditorControls','cs!editor/SelectionManager','cs!editor/Exporter','cs!editor/UndoManager'],function(require) {
    var Editor, EditorControls, EditorMenu, Exporter, PropertiesEditor, SelectionManager, Timeline, UndoManager, tpl_timeline;
    tpl_timeline = require('text!templates/timeline.tpl.html');
    Timeline = require('cs!graph/Timeline');
    PropertiesEditor = require('cs!editor/PropertiesEditor');
    EditorMenu = require('cs!editor/EditorMenu');
    EditorControls = require('cs!editor/EditorControls');
    SelectionManager = require('cs!editor/SelectionManager');
    Exporter = require('cs!editor/Exporter');
    UndoManager = require('cs!editor/UndoManager');
    return Editor = (function() {
      function Editor(tweenTime, options) {
        this.tweenTime = tweenTime;
        this.options = options != null ? options : {};
        this.update = __bind(this.update, this);
        this.render = __bind(this.render, this);
        this.onKeyRemoved = __bind(this.onKeyRemoved, this);
        this.onKeyAdded = __bind(this.onKeyAdded, this);
        this.timer = this.tweenTime.timer;
        this.lastTime = -1;
        this.$timeline = $(tpl_timeline);
        $('body').append(this.$timeline);
        $('body').addClass('has-editor');
        this.selectionManager = new SelectionManager(this.tweenTime);
        this.exporter = new Exporter(this);
        this.timeline = new Timeline(this);
        this.propertiesEditor = new PropertiesEditor(this, this.selectionManager);
        this.propertiesEditor.keyAdded.add(this.onKeyAdded);
        this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);
        this.menu = new EditorMenu(this.tweenTime, this.$timeline, this);
        if (this.options.onMenuCreated != null) {
          this.options.onMenuCreated(this.$timeline.find('.timeline__menu'));
        }
        this.controls = new EditorControls(this.tweenTime, this.$timeline);
        this.undoManager = new UndoManager(this);
        window.editorEnabled = true;
        window.dispatchEvent(new Event('resize'));
        window.requestAnimationFrame(this.update);
      }

      Editor.prototype.onKeyAdded = function() {
        this.undoManager.addState();
        return this.render(false, true);
      };

      Editor.prototype.onKeyRemoved = function(item) {
        this.selectionManager.removeItem(item);
        this.undoManager.addState();
        if (this.selectionManager.selection.length) {
          this.selectionManager.triggerSelect();
        }
        return this.render(false, true);
      };

      Editor.prototype.render = function(time, force) {
        if (time == null) {
          time = false;
        }
        if (force == null) {
          force = false;
        }
        if (time === false) {
          time = this.timer.time[0];
        }
        if (force) {
          this.timeline._isDirty = true;
        }
        this.timeline.render(time, force);
        this.controls.render(time, force);
        return this.propertiesEditor.render(time, force);
      };

      Editor.prototype.update = function() {
        var time, time_changed;
        time = this.timer.time[0];
        time_changed = this.lastTime === time ? false : true;
        this.render(time, time_changed);
        this.lastTime = this.timer.time[0];
        return window.requestAnimationFrame(this.update);
      };

      return Editor;

    })();
  });

}).call(this);

define('Editor',['cs!editor/Editor'], function (Editor) {
  return Editor;
});

    //Register in the values from the outer closure for common dependencies
    //as local almond modules
    define('jquery', function () {
        return $;
    });
    define('lodash', function () {
        return _;
    });
    define('d3', function () {
        return d3;
    });
    define('jquery', function () {
        return jQuery;
    });
    define('Mustache', function () {
        return Mustache;
    });
    define('draggablenumber', function () {
        return DraggableNumber;
    });
    /*define('Signal', function () {
        return Signals;
    });*/

    //Use almond's special top-level, synchronous require to trigger factory
    //functions, get the final module value, and export it as the public
    //value.
    return require('Editor');
}));
//# sourceMappingURL=Editor.js.map