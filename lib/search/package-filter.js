'use strict'

module.exports = filter

function filter (data, args, notArgs, opts) {
  return typeof data === 'object' &&
         filterWords(data, args, notArgs, opts)
}

function getWords (data, opts) {
  return [ data.name ]
  .concat((opts && opts.description) ? data.description : [])
  .concat((data.maintainers || []).map(function (m) {
    return '=' + m.name
  }))
  .concat(data.versions && data.versions.length && data.url && ('<' + data.url + '>'))
  .concat(data.keywords || [])
  .map(function (f) { return f && f.trim && f.trim() })
  .filter(function (f) { return f })
  .join(' ')
  .toLowerCase()
}

function filterWords (data, args, notArgs, opts) {
  var words = getWords(data, opts)
  for (var i = 0, l = args.length; i < l; i++) {
    if (!match(words, args[i])) return false
  }
  for (i = 0, l = notArgs.length; i < l; i++) {
    if (match(words, notArgs[i])) return false
  }
  return true
}

function match (words, arg) {
  if (arg.charAt(0) === '/') {
    arg = arg.replace(/\/$/, '')
    arg = new RegExp(arg.substr(1, arg.length - 1))
    return words.match(arg)
  }
  return words.indexOf(arg) !== -1
}
