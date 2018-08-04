const _serialize = (obj, flag) => {
  const str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p))
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return flag? str.join("&") : '?' + str.join("&");
}

const _actions = {
  get: 'GET',
  put: 'PUT',
  post: 'POST',
  delete: 'DELETE'
}

const _isAction = (method='', action='') => `${method}`.toLowerCase() == `${action}`.toLowerCase()

const _request = ({fetch, baseUrl, headers, queryParams}) => async (method, endpoint, body, mapfn, grabfn) => {
  if (typeof fetch !== 'function') return 'fetch is not a function'

  const qs = _isAction(method, _actions.get) && typeof body === 'object'? _serialize({...queryParams, ...body}): _serialize(queryParams)
  const url = `${baseUrl}${endpoint}${qs}`
  const res = await fetch(url, {
    method,
    headers,
    body: body && !_isAction(method, _actions.get) ? JSON.stringify(body) : undefined,
  });

  const isJson = `${res.headers.get('content-type')}`
    .split(' ')
    .filter(ct => ct.indexOf('application/json') !== -1)
    .length !== 0

  const isStatusOk = res.status < 300

  if (isStatusOk) {
    if (!isJson) return await res.text()
    const response = await res.json()
    if (typeof mapfn !== 'function') return response
    const newresponse = (typeof grabfn === 'function') ? grabfn(response) : response
    return (newresponse instanceof Array) ? newresponse.map(mapfn) : newresponse
  }
  
  const message = isJson? res.statusText : await res.text()
  const error = new Error(message)
  error.statusCode = res.statusCode
  error.statusText = res.statusText
  error.isJson = isJson
  error.payload = isJson? await res.json() : {}
  throw error
};

const createClient = fetch => ({baseUrl = '', headers = {}, queryParams = {}} = {}) => {
  const customHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const request = _request({ fetch, headers: customHeaders, baseUrl, queryParams })
  return {
    ..._actions,
    actions: _actions,
    request,
    api: {
      get: (endpoint, body, mapfn, grabfn) => request(_actions.get, endpoint, body, mapfn, grabfn),
      post: (endpoint, body, mapfn, grabfn) => request(_actions.post, endpoint, body, mapfn, grabfn),
      put: (endpoint, body, mapfn, grabfn) => request(_actions.put, endpoint, body, mapfn, grabfn),
      delete: (endpoint, body, mapfn, grabfn) => request(_actions.delete, endpoint, body, mapfn, grabfn),
    }
  }
};

module.exports.actions = _actions
module.exports.createClient = createClient
module.exports.serialize = _serialize
module.exports.createRequest = _request