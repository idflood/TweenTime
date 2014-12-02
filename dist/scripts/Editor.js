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

      Header.prototype.onDurationChanged = function(seconds) {
        this.x.domain([0, this.timer.totalDuration]);
        this.xAxisElement.call(this.xAxis);
        this.brush.x(this.x).extent(this.initialDomain);
        this.svgContainer.select('.brush').call(this.brush);
        return this.render();
      };

      Header.prototype.createBrushHandle = function() {
        var onBrush;
        this.xAxisElement = this.svgContainer.append("g").attr("class", "x axis").attr("transform", "translate(0," + (this.margin.top + 7) + ")").call(this.xAxis);
        onBrush = (function(_this) {
          return function() {
            var extent0;
            extent0 = _this.brush.extent();
            _this.onBrush.dispatch(extent0);
            _this.render();
            return _this.xDisplayed.domain(extent0);
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
        return this.svgContainer.append("rect").attr("class", "graph-mask").attr("x", -self.margin.left).attr("y", -self.margin.top).attr("width", self.margin.left - 20).attr("height", self.height);
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
        var keyKey, keyValue, key_item, keys, propKey, propVal, properties, self, subGrp, tweenTime;
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
        properties.selectAll('.key--preview').attr("style", function(d) {
          var bar_data, item;
          item = d3.select(this.parentNode.parentNode);
          bar_data = item.datum();
          if (bar_data.collapsed === true) {
            return "";
          }
          return "display: none;";
        });
        keyValue = function(d, i, j) {
          return d.keys;
        };
        keyKey = function(d, k) {
          return d.time;
        };
        keys = properties.selectAll('.key--preview').data(keyValue, keyKey);
        key_item = keys.enter().append('path').attr('class', 'key--preview').attr('d', 'M 0 -4 L 4 0 L 0 4 L -4 0');
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
        this.onDurationChanged = __bind(this.onDurationChanged, this);
        this.tweenTime = this.editor.tweenTime;
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
        this.items.onUpdate.add((function(_this) {
          return function() {
            return _this._isDirty = true;
          };
        })(this));
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
        this.keys.onKeyUpdated.add((function(_this) {
          return function() {
            return _this._isDirty = true;
          };
        })(this));
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
        this.tweenTime.timer.durationChanged.add(this.onDurationChanged);
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

      Timeline.prototype.onDurationChanged = function(seconds) {};

      Timeline.prototype.render = function(time, time_changed) {
        var bar, height, properties;
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

  define('cs!editor/PropertyNumber',['require','jquery','Signal','lodash','d3','cs!core/Utils','draggablenumber','Mustache','text!templates/propertyNumber.tpl.html'],function(require) {
    var $, DraggableNumber, Mustache, PropertyNumber, Signals, Utils, d3, tpl_property, _;
    $ = require('jquery');
    Signals = require('Signal');
    _ = require('lodash');
    d3 = require('d3');
    Utils = require('cs!core/Utils');
    DraggableNumber = require('draggablenumber');
    Mustache = require('Mustache');
    tpl_property = require('text!templates/propertyNumber.tpl.html');
    return PropertyNumber = (function() {
      function PropertyNumber(instance_property, lineData, editor, key_val) {
        this.instance_property = instance_property;
        this.lineData = lineData;
        this.editor = editor;
        this.key_val = key_val != null ? key_val : false;
        this.update = __bind(this.update, this);
        this.render = __bind(this.render, this);
        this.addKey = __bind(this.addKey, this);
        this.getCurrentKey = __bind(this.getCurrentKey, this);
        this.getCurrentVal = __bind(this.getCurrentVal, this);
        this.getInputVal = __bind(this.getInputVal, this);
        this.onKeyClick = __bind(this.onKeyClick, this);
        this.timer = this.editor.timer;
        this.$el = false;
        this.keyAdded = new Signals.Signal();
        this.render();
        this.$input = this.$el.find('input');
        this.$key = this.$el.find('.property__key');
      }

      PropertyNumber.prototype.onKeyClick = function(e) {
        var currentValue;
        e.preventDefault();
        currentValue = this.getCurrentVal();
        return this.addKey(currentValue);
      };

      PropertyNumber.prototype.getInputVal = function() {
        return parseFloat(this.$el.find('input').val(), 10);
      };

      PropertyNumber.prototype.getCurrentVal = function() {
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

      PropertyNumber.prototype.getCurrentKey = function() {
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

      PropertyNumber.prototype.addKey = function(val) {
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

      PropertyNumber.prototype.render = function() {
        var $input, data, draggable, onChangeEnd, onInputChange, val, view;
        this.values = this.lineData.values != null ? this.lineData.values : {};
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
        onInputChange = (function(_this) {
          return function(e) {
            var currentTime, current_key, current_value;
            current_value = _this.getInputVal();
            currentTime = _this.timer.getCurrentTime() / 1000;
            if (_this.key_val) {
              currentTime = _this.key_val.time;
            }
            if (_this.instance_property.keys && _this.instance_property.keys.length) {
              current_key = _.find(_this.instance_property.keys, function(key) {
                return key.time === currentTime;
              });
              if (current_key) {
                current_key.val = current_value;
              } else {
                _this.addKey(current_value);
              }
            } else {
              _this.instance_property.val = current_value;
              _this.lineData.values[_this.instance_property.name] = current_value;
              if (_this.lineData.object) {
                currentTime = _this.timer.getCurrentTime() / 1000;
                _this.lineData.object.update(currentTime - _this.lineData.start);
              }
            }
            return _this.lineData._isDirty = true;
          };
        })(this);
        onChangeEnd = (function(_this) {
          return function(new_val) {
            return _this.editor.undoManager.addState();
          };
        })(this);
        draggable = new DraggableNumber($input.get(0), {
          changeCallback: onInputChange,
          endCallback: onChangeEnd
        });
        $input.data('draggable', draggable);
        return $input.change(onInputChange);
      };

      PropertyNumber.prototype.update = function() {
        var draggable, key, val;
        val = this.getCurrentVal();
        key = this.getCurrentKey();
        this.$key.toggleClass('property__key--active', key);
        draggable = this.$input.data('draggable');
        if (draggable) {
          return draggable.set(val.toFixed(3));
        } else {
          return this.$input.val(val.toFixed(3));
        }
      };

      return PropertyNumber;

    })();
  });

}).call(this);


define('text!templates/propertyTween.tpl.html',[],function () { return '<div class="property property--tween">\n  <label for="{{id}}" class="property__label">easing</label>\n  <select id="{{id}}" class="property__select">\n    {{#options}}\n    <option value="{{.}}" {{selected}}>{{.}}</option>\n    {{/options}}\n  </select>\n</div>\n<div class="properties-editor__actions actions">\n  <span class="property__key-time">key at <strong>{{time}}</strong> seconds</span>\n  <a href="#" class="actions__item" data-action-remove>Remove key</a>\n</div>';});


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
        this.$el.find('select').change(this.onChange);
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


define('text!templates/propertiesEditor.tpl.html',[],function () { return '<div class="properties-editor">\n  <a href="#" class="menu-item menu-item--toggle-side" data-action="toggle"><i class="icon-toggle"></i></a>\n  <div class="properties-editor__main"></div>\n</div>\n';});


// Generated by CoffeeScript 1.8.0
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!editor/PropertiesEditor',['require','jquery','lodash','Signal','cs!editor/PropertyNumber','cs!editor/PropertyTween','text!templates/propertiesEditor.tpl.html'],function(require) {
    var $, PropertiesEditor, PropertyNumber, PropertyTween, Signals, tpl_propertiesEditor, _;
    $ = require('jquery');
    _ = require('lodash');
    Signals = require('Signal');
    PropertyNumber = require('cs!editor/PropertyNumber');
    PropertyTween = require('cs!editor/PropertyTween');
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
        this.selectedProps = [];
        $('body').append(this.$el);
        this.selectionManager.onSelect.add(this.onSelect);
      }

      PropertiesEditor.prototype.onKeyAdded = function() {
        return this.keyAdded.dispatch();
      };

      PropertiesEditor.prototype.onSelect = function(domElement) {
        var element, _i, _len, _results;
        if (domElement == null) {
          domElement = false;
        }
        this.selectedProps = [];
        this.$container.empty();
        if (domElement instanceof Array) {
          _results = [];
          for (_i = 0, _len = domElement.length; _i < _len; _i++) {
            element = domElement[_i];
            _results.push(this.addProperty(element));
          }
          return _results;
        } else {
          return this.addProperty(domElement);
        }
      };

      PropertiesEditor.prototype.addProperty = function(domElement) {
        var $el, d3Object, instance_prop, key, key_val, lineData, lineObject, prop, propertyData, propertyObject, property_name, tween, _ref;
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
        $el = false;
        if (lineData.id) {
          $el = $('#property--' + lineData.id);
          if (!$el.length) {
            $el = $el = $('<div class="properties__wrapper" id="property--' + lineData.id + '"></div>');
            this.$container.append($el);
            if (lineData.label) {
              $el.append('<h2 class="properties-editor__title">' + lineData.label + '</h2>');
            }
          }
        }
        if ($el === false) {
          $el = $('<div class="properties__wrapper" id="no-item"></div>');
          this.$container.append($el);
        }
        _ref = lineData.properties;
        for (key in _ref) {
          instance_prop = _ref[key];
          if (!property_name || instance_prop.name === property_name) {
            prop = new PropertyNumber(instance_prop, lineData, this.editor, key_val);
            prop.keyAdded.add(this.onKeyAdded);
            this.selectedProps.push(prop);
            $el.append(prop.$el);
          }
        }
        if (property_name) {
          tween = new PropertyTween(instance_prop, lineData, this.editor, key_val, this.timeline);
          this.selectedProps.push(tween);
          $el.append(tween.$el);
          return tween.$el.find('[data-action-remove]').click((function(_this) {
            return function(e) {
              var index;
              e.preventDefault();
              index = propertyData.keys.indexOf(key_val);
              if (index > -1) {
                propertyData.keys.splice(index, 1);
                _this.keyRemoved.dispatch(domElement);
                return lineData._isDirty = true;
              }
            };
          })(this));
        }
      };

      PropertiesEditor.prototype.render = function(time, time_changed) {
        var prop, _i, _len, _ref, _results;
        if (!time_changed) {
          return;
        }
        _ref = this.selectedProps;
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
        var $toggleLink, $toggleLinkSide, propertiesClosed, timelineClosed;
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
        propertiesClosed = false;
        $toggleLinkSide = $('.properties-editor').find('[data-action="toggle"]');
        return $toggleLinkSide.click((function(_this) {
          return function(e) {
            e.preventDefault();
            propertiesClosed = !propertiesClosed;
            $toggleLinkSide.toggleClass('menu-item--toggle-left', propertiesClosed);
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
        this.menu = new EditorMenu(this.tweenTime, this.$timeline, this);
        if (this.options.onMenuCreated != null) {
          this.options.onMenuCreated(this.$timeline.find('.timeline__menu'));
        }
        this.propertiesEditor = new PropertiesEditor(this, this.selectionManager);
        this.propertiesEditor.keyAdded.add(this.onKeyAdded);
        this.propertiesEditor.keyRemoved.add(this.onKeyRemoved);
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