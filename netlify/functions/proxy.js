// netlify/functions/proxy.js
exports.handler = async (event, context) => {
  const path = event.path.replace('/.netlify/functions/proxy', '');
  
  try {
    const options = {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...(event.headers.authorization && { Authorization: event.headers.authorization })
      }
    };
    
    // GET, HEAD가 아닐 때만 body 추가
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' && event.body) {
      options.body = event.body;
    }
    
    const response = await fetch(`http://49.50.130.77:8080/api${path}`, options);
    
    const data = await response.json();
    
    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
